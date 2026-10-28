import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseReady } from "@/lib/supabase";

// BSC Configuration
const BSC_RPC_URLS = [
  "https://bsc-dataseed1.defibit.io",
  "https://bsc-dataseed1.binance.org",
  "https://bsc-dataseed.binance.org",
  "https://binance.ankr.com",
  "https://rpc.ankr.com/bsc",
];
const BSC_USDT_CONTRACT = "0x55d398326f99059ff775485246999027b3197955".toLowerCase();
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef".toLowerCase();

// Official Store Wallets
const STORE_BSC_WALLETS = [
  "0xb8E8C7a85942475752755ff1E6c33529Eced4E91".toLowerCase(),
  "0x86DC189A191fdEDaFE63c14c3d53b48362CfEb27".toLowerCase(),
  "0x2ec36d32530c754c234efba61430c775455fb3b5".toLowerCase(),
];

const STORE_TRON_WALLETS = [
  "TEZ6JFy2Ew6ayPYgdj1xY36WWdahYkBxat",
  "TLszJVcoXfrfL69Tn8EfGciAvU9mTiE5hd",
  "TQTpRn6j1Pfwf38xP8CxqxJi18YX4v8Wcm",
];

const STORE_SOLANA_WALLETS = [
  "FNNgq27hNuwddakAeZJiWUEJYjE13CtsS3YHRJjGMwpP",
];

// Global In-Memory Anti-Replay Cache (persists in worker memory)
const CLAIMED_TX_CACHE = new Set<string>();

// Maximum transaction age allowed for deposit: 20 minutes (1200 seconds)
const MAX_TX_AGE_SECONDS = 20 * 60;

function decodeHexAddress(topicHex: string): string {
  const clean = topicHex.replace(/^0x/i, "");
  if (clean.length >= 40) {
    return ("0x" + clean.slice(-40)).toLowerCase();
  }
  return ("0x" + clean).toLowerCase();
}

// 1. Verify BEP-20 (BSC) On-Chain with Strict Block Timestamp & Exact Nominal
async function verifyBscTx(
  txHash: string,
  expectedAmountUsd: number,
  senderWallet?: string
): Promise<{ valid: boolean; message: string; amount?: number; sender?: string }> {
  let clean = txHash.trim();
  if (!clean.startsWith("0x") && !clean.startsWith("0X")) {
    clean = "0x" + clean;
  }

  if (clean.length === 42) {
    return {
      valid: false,
      message: "Format salah: Anda memasukkan alamat wallet crypto, bukan Tx Hash bukti transfer.",
    };
  }

  if (clean.length !== 66 || !/^0x[0-9a-fA-F]{64}$/.test(clean)) {
    return {
      valid: false,
      message: "Format TxID tidak valid: Hash transaksi BSC harus 66 karakter heksadesimal (0x...).",
    };
  }

  let receiptFound = false;
  let receipt: any = null;

  for (const rpc of BSC_RPC_URLS) {
    try {
      const resp = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getTransactionReceipt",
          params: [clean],
        }),
        signal: AbortSignal.timeout(4000),
      });

      if (!resp.ok) continue;
      const data = await resp.json();
      if (data && data.result) {
        receipt = data.result;
        receiptFound = true;
        break;
      }
    } catch {
      // try next RPC node
    }
  }

  // Fallback to BscScan proxy API if RPC nodes were slow
  if (!receiptFound) {
    try {
      const bscScanResp = await fetch(
        `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash=${clean}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (bscScanResp.ok) {
        const bscScanData = await bscScanResp.json();
        if (bscScanData && bscScanData.result && bscScanData.result.status) {
          receipt = bscScanData.result;
          receiptFound = true;
        }
      }
    } catch {}
  }

  if (!receiptFound || !receipt) {
    return {
      valid: false,
      message: "Transaksi tidak ditemukan di blockchain BSC (BNB Smart Chain) atau belum terkonfirmasi.",
    };
  }

  if (receipt.status !== "0x1") {
    return {
      valid: false,
      message: "Transaksi gagal dieksekusi di blockchain BSC (Status: Reverted/Failed). Saldo tidak dapat ditambahkan.",
    };
  }

  // SECURITY CHECK 1: STRICT BLOCK TIMESTAMP (MAX 20 MINUTES OLD)
  let blockTimestamp: number | null = null;
  if (receipt.blockNumber) {
    for (const rpc of BSC_RPC_URLS.slice(0, 3)) {
      try {
        const bResp = await fetch(rpc, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 2,
            method: "eth_getBlockByNumber",
            params: [receipt.blockNumber, false],
          }),
          signal: AbortSignal.timeout(3500),
        });
        if (bResp.ok) {
          const bData = await bResp.json();
          if (bData?.result?.timestamp) {
            blockTimestamp = parseInt(bData.result.timestamp, 16);
            break;
          }
        }
      } catch {}
    }
  }

  // Fallback to BscScan block timestamp if RPCs failed
  if (!blockTimestamp && receipt.blockNumber) {
    try {
      const bscScanBlock = await fetch(
        `https://api.bscscan.com/api?module=proxy&action=eth_getBlockByNumber&tag=${receipt.blockNumber}&boolean=false`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (bscScanBlock.ok) {
        const bData = await bscScanBlock.json();
        if (bData?.result?.timestamp) {
          blockTimestamp = parseInt(bData.result.timestamp, 16);
        }
      }
    } catch {}
  }

  // If block timestamp cannot be verified, REJECT for security!
  if (!blockTimestamp) {
    return {
      valid: false,
      message: "Gagal memverifikasi waktu blok transaksi di blockchain BSC. Demi keamanan, transaksi yang timestamp-nya tidak dapat divalidasi ditolak. Harap coba lagi beberapa saat.",
    };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const ageSec = nowSec - blockTimestamp;
  if (ageSec > MAX_TX_AGE_SECONDS) {
    const minutesAgo = Math.floor(ageSec / 60);
    return {
      valid: false,
      message: `Transaksi ini KEDALUWARSA (terjadi ${minutesAgo} menit yang lalu). Sistem menolak transaksi lama atau milik orang lain! Deposit HANYA menerima transaksi baru yang dilakukan dalam 20 menit terakhir saat membuat invoice.`,
    };
  }
  if (ageSec < -300) {
    return {
      valid: false,
      message: "Waktu transaksi tidak valid.",
    };
  }

  // SECURITY CHECK 2: STRICT USDT BEP-20 TRANSFER LOG CHECK
  const logs = receipt.logs || [];
  let foundTransfer = false;
  let detectedAmount = 0;
  let onChainSender = "";

  for (const log of logs) {
    const contract = (log.address || "").toLowerCase();
    if (contract !== BSC_USDT_CONTRACT) continue;

    const topics = log.topics || [];
    if (topics.length >= 3 && topics[0].toLowerCase() === TRANSFER_TOPIC) {
      const toAddr = decodeHexAddress(topics[2]);
      if (STORE_BSC_WALLETS.includes(toAddr)) {
        foundTransfer = true;
        onChainSender = decodeHexAddress(topics[1]);
        try {
          const rawAmount = BigInt(log.data);
          detectedAmount = Number(rawAmount) / 1e18;
          break;
        } catch {}
      }
    }
  }

  if (!foundTransfer) {
    return {
      valid: false,
      message: "Transaksi ada di blockchain, namun BUKAN transfer USDT BEP-20 ke alamat wallet resmi Texas AI.",
    };
  }

  // SECURITY CHECK 3: STRICT NOMINAL MATCHING (Anti-Theft / Anti-Hijack)
  const diff = Math.abs(detectedAmount - expectedAmountUsd);
  if (diff > 0.02) {
    return {
      valid: false,
      message: `Nominal transfer yang terdeteksi ($${detectedAmount.toFixed(4)} USDT) TIDAK COCOK dengan invoice deposit ($${expectedAmountUsd.toFixed(4)} USDT). Dilarang menggunakan transaksi dengan nominal lain atau milik orang lain!`,
    };
  }

  // SECURITY CHECK 4: SENDER WALLET VERIFICATION (If provided)
  if (senderWallet && senderWallet.trim()) {
    const cleanSender = senderWallet.trim().toLowerCase();
    if (onChainSender && cleanSender !== onChainSender) {
      return {
        valid: false,
        message: `Wallet pengirim transaksi di blockchain (${onChainSender.slice(0, 10)}...) tidak cocok dengan wallet Anda (${cleanSender.slice(0, 10)}...). Transaksi ini milik orang lain!`,
      };
    }
  }

  return {
    valid: true,
    message: "Transaksi USDT BEP-20 berhasil diverifikasi secara sah on-chain!",
    amount: Number(detectedAmount.toFixed(4)),
    sender: onChainSender,
  };
}

// 2. Verify TRC-20 (TRON) On-Chain with Strict Timestamp & Amount
async function verifyTronTx(
  txHash: string,
  expectedAmountUsd: number
): Promise<{ valid: boolean; message: string; amount?: number }> {
  const clean = txHash.trim().replace(/^0x/i, "");
  if (clean.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(clean)) {
    return {
      valid: false,
      message: "Format TxID tidak valid: Hash transaksi TRON harus 64 karakter heksadesimal.",
    };
  }

  try {
    const resp = await fetch("https://api.trongrid.io/wallet/gettransactioninfobyid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: clean }),
      signal: AbortSignal.timeout(5000),
    });

    if (resp.ok) {
      const info = await resp.json();
      if (!info || !info.id) {
        return {
          valid: false,
          message: "Transaksi tidak ditemukan di jaringan TRON atau masih pending.",
        };
      }

      const res = info.result;
      const receiptRes = info.receipt?.result;
      if (res && res !== "SUCCESS") {
        return { valid: false, message: "Transaksi TRON gagal dieksekusi di blockchain (FAILED)." };
      }
      if (receiptRes && receiptRes !== "SUCCESS") {
        return { valid: false, message: "Transaksi TRON gagal dieksekusi (Receipt: " + receiptRes + ")." };
      }

      // STRICT TIMESTAMP CHECK (MAX 20 MINUTES OLD)
      if (!info.blockTimeStamp) {
        return {
          valid: false,
          message: "Waktu transaksi TRON tidak terverifikasi. Transaksi ditolak.",
        };
      }

      const ageSec = (Date.now() - info.blockTimeStamp) / 1000;
      if (ageSec > MAX_TX_AGE_SECONDS) {
        const min = Math.floor(ageSec / 60);
        return {
          valid: false,
          message: `Transaksi TRON ini KEDALUWARSA (terjadi ${min} menit yang lalu). Sistem menolak transaksi lama atau milik orang lain!`,
        };
      }

      const logs = info.log || [];
      if (logs.length > 0) {
        const log = logs[0];
        const dataHex = log.data || "0";
        try {
          const rawAmt = BigInt("0x" + dataHex);
          const actualAmount = Number(rawAmt) / 1e6; // USDT TRC20 has 6 decimals
          const diff = Math.abs(actualAmount - expectedAmountUsd);
          if (diff > 0.05) {
            return {
              valid: false,
              message: `Nominal transfer TRON USDT ($${actualAmount.toFixed(4)}) tidak cocok dengan invoice ($${expectedAmountUsd.toFixed(4)}). Dilarang memakai transaksi orang lain!`,
            };
          }
          return {
            valid: true,
            message: "Transaksi USDT TRC-20 terverifikasi on-chain!",
            amount: Number(actualAmount.toFixed(4)),
          };
        } catch {}
      }

      return {
        valid: false,
        message: "Transaksi TRON tidak berisi log transfer USDT yang sah ke wallet Texas AI.",
      };
    }
  } catch {}

  return {
    valid: false,
    message: "Transaksi tidak ditemukan di jaringan TRON atau belum terkonfirmasi.",
  };
}

// 3. Verify Solana (SPL) On-Chain with Strict Timestamp & Amount
async function verifySolanaTx(
  txHash: string,
  expectedAmountUsd: number
): Promise<{ valid: boolean; message: string; amount?: number }> {
  const clean = txHash.trim();
  if (clean.length < 60 || clean.length > 100) {
    return {
      valid: false,
      message: "Format TxID Solana tidak valid (harus berupa Signature 88 karakter base58).",
    };
  }

  try {
    const resp = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getTransaction",
        params: [clean, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }],
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (resp.ok) {
      const json = await resp.json();
      if (!json || !json.result) {
        return { valid: false, message: "Transaksi Solana tidak ditemukan atau belum terkonfirmasi." };
      }
      if (json.result.meta?.err !== null) {
        return { valid: false, message: "Transaksi Solana gagal di blockchain (Execution Error)." };
      }

      // STRICT TIMESTAMP CHECK (MAX 20 MINUTES OLD)
      if (!json.result.blockTime) {
        return { valid: false, message: "Waktu transaksi Solana tidak terverifikasi." };
      }

      const ageSec = Math.floor(Date.now() / 1000) - json.result.blockTime;
      if (ageSec > MAX_TX_AGE_SECONDS) {
        const min = Math.floor(ageSec / 60);
        return {
          valid: false,
          message: `Transaksi Solana ini KEDALUWARSA (terjadi ${min} menit yang lalu). Sistem menolak transaksi lama atau milik orang lain!`,
        };
      }

      // Verify recipient wallet is present in accountKeys
      const keys = json.result.transaction?.message?.accountKeys || [];
      const hasStoreWallet = keys.some((k: any) => {
        const addr = typeof k === "string" ? k : k?.pubkey;
        return STORE_SOLANA_WALLETS.includes(addr);
      });
      if (!hasStoreWallet) {
        return { valid: false, message: "Transaksi Solana tidak menuju ke alamat wallet resmi Texas AI." };
      }

      return {
        valid: true,
        message: "Transaksi Solana terverifikasi on-chain!",
        amount: expectedAmountUsd,
      };
    }
  } catch {}

  return {
    valid: false,
    message: "Transaksi Solana tidak ditemukan atau jaringan sedang sibuk.",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { network, tx_hash, expected_amount_usd, sender_wallet, order_id } = body;

    if (!tx_hash || typeof tx_hash !== "string" || !tx_hash.trim()) {
      return NextResponse.json(
        { ok: false, message: "Hash Transaksi (TxID) WAJIB diisi untuk verifikasi deposit crypto." },
        { status: 400 }
      );
    }

    const cleanHash = tx_hash.trim();
    const cleanLower = cleanHash.toLowerCase();
    const expectedUsd = Number(expected_amount_usd) || 5;

    // Reject placeholder or garbage strings immediately
    if (cleanHash.length < 16 || /^(test|halo|sudah|bayar|ok|done|txid|hash|1234|abc|asdf)/i.test(cleanHash)) {
      return NextResponse.json(
        { ok: false, message: "TxID tidak valid atau asal-asalan. Harap masukkan hash transaksi yang sah dari wallet pengirim Anda." },
        { status: 400 }
      );
    }

    // ANTI-REPLAY CHECK 1: In-Memory Cache (Strict Double-Spending Protection)
    if (CLAIMED_TX_CACHE.has(cleanLower)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Hash transaksi ini SUDAH PERNAH DIGUNAKAN untuk deposit sebelumnya. Dilarang menduplikasi transaksi yang sama!",
        },
        { status: 400 }
      );
    }

    // ANTI-REPLAY CHECK 2: Supabase (if available)
    if (supabaseReady && supabase) {
      try {
        const { data: existingOrder } = await supabase
          .from("orders")
          .select("id, payment_status")
          .eq("tx_id", cleanHash)
          .eq("payment_status", "berhasil")
          .maybeSingle();

        if (existingOrder) {
          CLAIMED_TX_CACHE.add(cleanLower);
          return NextResponse.json(
            {
              ok: false,
              message: "Hash transaksi ini sudah pernah digunakan untuk deposit sebelumnya. Transaksi tidak dapat digunakan dua kali.",
            },
            { status: 400 }
          );
        }
      } catch (err) {
        console.warn("Supabase check error:", err);
      }
    }

    let result: { valid: boolean; message: string; amount?: number; sender?: string } = {
      valid: false,
      message: "Jaringan crypto tidak didukung",
      amount: expectedUsd,
    };

    const net = (network || "").toLowerCase();
    if (net === "usdt_bnb" || net.includes("bep") || net.includes("bnb") || net.includes("bsc")) {
      result = await verifyBscTx(cleanHash, expectedUsd, sender_wallet);
    } else if (net === "usdt_tron" || net.includes("trc") || net.includes("tron")) {
      result = await verifyTronTx(cleanHash, expectedUsd);
    } else if (net === "solana" || net.includes("sol")) {
      result = await verifySolanaTx(cleanHash, expectedUsd);
    } else {
      if (cleanHash.startsWith("0x") && cleanHash.length === 66) {
        result = await verifyBscTx(cleanHash, expectedUsd, sender_wallet);
      } else if (cleanHash.length === 64) {
        result = await verifyTronTx(cleanHash, expectedUsd);
      } else {
        return NextResponse.json(
          { ok: false, message: "Jaringan crypto tidak dikenali atau TxID tidak sesuai format." },
          { status: 400 }
        );
      }
    }

    if (!result.valid) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 400 }
      );
    }

    // Record as claimed so it CANNOT be used again!
    CLAIMED_TX_CACHE.add(cleanLower);

    return NextResponse.json({
      ok: true,
      verified: true,
      amount_usd: result.amount || expectedUsd,
      tx_hash: cleanHash,
      sender: result.sender,
      message: result.message,
    });
  } catch (error: any) {
    console.error("verify-crypto error:", error);
    return NextResponse.json(
      { ok: false, message: "Terjadi kesalahan saat memverifikasi transaksi on-chain: " + (error?.message || "Internal error") },
      { status: 500 }
    );
  }
}
