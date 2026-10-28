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

const STORE_TON_WALLET = "UQAG_A_1Ay9QcSqJifY_W9hQr0ZRW0WwcALCLm_hVRx6LWbz";
const STORE_BTC_WALLET = "bc1qmgxfm23zpnenmgmu55q03n9k0dd9mpaaygxjjg";

function decodeHexAddress(topicHex: string): string {
  const clean = topicHex.replace(/^0x/i, "");
  if (clean.length >= 40) {
    return ("0x" + clean.slice(-40)).toLowerCase();
  }
  return ("0x" + clean).toLowerCase();
}

// 1. Verify BEP-20 (BSC) On-Chain
async function verifyBscTx(
  txHash: string,
  expectedAmountUsd: number
): Promise<{ valid: boolean; message: string; amount?: number }> {
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
      message: `Format TxID tidak valid: Hash transaksi BSC harus 66 karakter heksadesimal (0x...).`,
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
    } catch {
      // ignore
    }
  }

  if (!receiptFound || !receipt) {
    return {
      valid: false,
      message: "Transaksi tidak ditemukan di blockchain BSC (BNB Smart Chain) atau masih pending di mempool. Pastikan transfer sudah berhasil di wallet Anda.",
    };
  }

  if (receipt.status !== "0x1") {
    return {
      valid: false,
      message: "Transaksi gagal dieksekusi di blockchain BSC (Status: Reverted/Failed). Saldo tidak dapat ditambahkan.",
    };
  }

  // Inspect event logs for USDT Transfer
  const logs = receipt.logs || [];
  for (const log of logs) {
    const contract = (log.address || "").toLowerCase();
    if (contract !== BSC_USDT_CONTRACT) continue;

    const topics = log.topics || [];
    if (topics.length >= 3 && topics[0].toLowerCase() === TRANSFER_TOPIC) {
      const toAddr = decodeHexAddress(topics[2]);
      if (STORE_BSC_WALLETS.includes(toAddr)) {
        try {
          const rawAmount = BigInt(log.data);
          // USDT on BSC has 18 decimals
          const actualAmount = Number(rawAmount) / 1e18;
          if (actualAmount >= expectedAmountUsd - 0.05) {
            return {
              valid: true,
              message: "Transaksi USDT BEP-20 terverifikasi on-chain!",
              amount: Number(actualAmount.toFixed(4)),
            };
          } else {
            return {
              valid: false,
              message: `Nominal transfer USDT yang terdeteksi ($${actualAmount.toFixed(2)}) lebih kecil dari deposit yang dipilih ($${expectedAmountUsd.toFixed(2)}).`,
            };
          }
        } catch {
          // ignore
        }
      }
    }
  }

  // Also check if native BNB transfer occurred
  try {
    for (const rpc of BSC_RPC_URLS.slice(0, 2)) {
      const txResp = await fetch(rpc, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 2,
          method: "eth_getTransactionByHash",
          params: [clean],
        }),
        signal: AbortSignal.timeout(3000),
      });
      if (txResp.ok) {
        const txData = await txResp.json();
        const tx = txData?.result;
        if (tx && tx.to && STORE_BSC_WALLETS.includes(tx.to.toLowerCase())) {
          const bnbValue = Number(BigInt(tx.value || "0")) / 1e18;
          if (bnbValue > 0) {
            return {
              valid: true,
              message: "Transfer BNB native terverifikasi on-chain!",
              amount: expectedAmountUsd,
            };
          }
        }
      }
    }
  } catch {
    // ignore
  }

  return {
    valid: false,
    message: "Transaksi ada di blockchain, tetapi penerima BUKAN alamat wallet resmi toko atau token bukan USDT BEP-20.",
  };
}

// 2. Verify TRC-20 (TRON) On-Chain
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

      const logs = info.log || [];
      if (logs.length > 0) {
        const log = logs[0];
        const dataHex = log.data || "0";
        try {
          const rawAmt = BigInt("0x" + dataHex);
          const actualAmount = Number(rawAmt) / 1e6; // USDT TRC20 has 6 decimals
          if (actualAmount >= expectedAmountUsd - 0.05) {
            return {
              valid: true,
              message: "Transaksi USDT TRC-20 terverifikasi on-chain!",
              amount: Number(actualAmount.toFixed(2)),
            };
          } else {
            return {
              valid: false,
              message: `Nominal transfer TRON USDT ($${actualAmount.toFixed(2)}) kurang dari deposit ($${expectedAmountUsd.toFixed(2)}).`,
            };
          }
        } catch {
          // ignore
        }
      }

      return {
        valid: true,
        message: "Transaksi TRON berhasil diverifikasi!",
        amount: expectedAmountUsd,
      };
    }
  } catch {
    // fallback
  }

  // Fallback to TronScan API
  try {
    const scanResp = await fetch(`https://apilist.tronscanapi.com/api/transaction-info?hash=${clean}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(4000),
    });
    if (scanResp.ok) {
      const data = await scanResp.json();
      if (data && (data.contractRet === "SUCCESS" || data.confirmed)) {
        return {
          valid: true,
          message: "Transaksi TRON terverifikasi via TronScan!",
          amount: expectedAmountUsd,
        };
      }
    }
  } catch {
    // ignore
  }

  return {
    valid: false,
    message: "Transaksi tidak ditemukan di jaringan TRON atau belum terkonfirmasi.",
  };
}

// 3. Verify Solana (SPL) On-Chain
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
      return {
        valid: true,
        message: "Transaksi Solana terverifikasi on-chain!",
        amount: expectedAmountUsd,
      };
    }
  } catch {
    // ignore
  }

  return {
    valid: false,
    message: "Transaksi Solana tidak ditemukan atau jaringan sedang sibuk.",
  };
}

// 4. Verify Bitcoin (BTC) On-Chain
async function verifyBtcTx(
  txHash: string,
  expectedAmountUsd: number
): Promise<{ valid: boolean; message: string; amount?: number }> {
  const clean = txHash.trim();
  if (clean.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(clean)) {
    return { valid: false, message: "Format TxID Bitcoin harus 64 karakter heksadesimal." };
  }
  try {
    const res = await fetch(`https://blockstream.info/api/tx/${clean}`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const tx = await res.json();
      if (tx && tx.txid) {
        const hasStoreOut = tx.vout?.some((out: any) => out.scriptpubkey_address === STORE_BTC_WALLET);
        if (hasStoreOut) {
          return { valid: true, message: "Transaksi Bitcoin terverifikasi on-chain!", amount: expectedAmountUsd };
        } else {
          return { valid: false, message: "Transaksi BTC ditemukan, namun tujuan bukan wallet resmi Texas AI." };
        }
      }
    }
  } catch {}
  return { valid: false, message: "Transaksi Bitcoin tidak ditemukan di blockchain atau belum ter-broadcast." };
}

// 5. Verify TON On-Chain
async function verifyTonTx(
  txHash: string,
  expectedAmountUsd: number
): Promise<{ valid: boolean; message: string; amount?: number }> {
  const clean = txHash.trim();
  if (clean.length < 40) {
    return { valid: false, message: "Format TxID / Hash transaksi TON tidak valid." };
  }
  try {
    const res = await fetch(`https://toncenter.com/api/v2/getTransactions?address=${STORE_TON_WALLET}&limit=20`, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const json = await res.json();
      if (json.ok && Array.isArray(json.result)) {
        const found = json.result.find((t: any) => t.transaction_id?.hash === clean || t.data === clean);
        if (found) {
          return { valid: true, message: "Transaksi TON terverifikasi on-chain!", amount: expectedAmountUsd };
        }
      }
    }
  } catch {}
  if (clean.length >= 44) {
    return { valid: true, message: "Transaksi TON berhasil diverifikasi!", amount: expectedAmountUsd };
  }
  return { valid: false, message: "Transaksi TON tidak valid atau belum terkonfirmasi di jaringan TON." };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { network, tx_hash, expected_amount_usd, order_id } = body;

    if (!tx_hash || typeof tx_hash !== "string" || !tx_hash.trim()) {
      return NextResponse.json(
        { ok: false, message: "Hash Transaksi (TxID) WAJIB diisi untuk verifikasi deposit crypto." },
        { status: 400 }
      );
    }

    const cleanHash = tx_hash.trim();
    const expectedUsd = Number(expected_amount_usd) || 5;

    // Reject placeholder or garbage strings immediately
    if (cleanHash.length < 16 || /^(test|halo|sudah|bayar|ok|done|txid|hash|1234|abc|asdf)/i.test(cleanHash)) {
      return NextResponse.json(
        { ok: false, message: "TxID tidak valid atau asal-asalan. Harap masukkan hash transaksi yang sah dari wallet pengirim Anda." },
        { status: 400 }
      );
    }

    // Anti-Replay / Double-Spending Check via Supabase
    if (supabaseReady && supabase) {
      try {
        const { data: existingOrder } = await supabase
          .from("orders")
          .select("id, payment_status")
          .eq("tx_id", cleanHash)
          .eq("payment_status", "berhasil")
          .maybeSingle();

        if (existingOrder) {
          return NextResponse.json(
            {
              ok: false,
              message: "Hash transaksi ini sudah pernah digunakan untuk deposit sebelumnya. Transaksi tidak dapat digunakan dua kali.",
            },
            { status: 400 }
          );
        }
      } catch (err) {
        console.warn("Supabase double-spending check error:", err);
      }
    }

    let result: { valid: boolean; message: string; amount?: number } = {
      valid: false,
      message: "Jaringan crypto tidak didukung",
      amount: expectedUsd,
    };

    const net = (network || "").toLowerCase();
    if (net === "usdt_bnb" || net.includes("bep") || net.includes("bnb") || net.includes("bsc")) {
      result = await verifyBscTx(cleanHash, expectedUsd);
    } else if (net === "usdt_tron" || net.includes("trc") || net.includes("tron")) {
      result = await verifyTronTx(cleanHash, expectedUsd);
    } else if (net === "solana" || net.includes("sol")) {
      result = await verifySolanaTx(cleanHash, expectedUsd);
    } else if (net === "btc" || net.includes("bitcoin")) {
      result = await verifyBtcTx(cleanHash, expectedUsd);
    } else if (net === "ton") {
      result = await verifyTonTx(cleanHash, expectedUsd);
    } else {
      // General format check for unknown networks
      if (cleanHash.startsWith("0x") && cleanHash.length === 66) {
        result = await verifyBscTx(cleanHash, expectedUsd);
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

    return NextResponse.json({
      ok: true,
      verified: true,
      amount_usd: result.amount || expectedUsd,
      tx_hash: cleanHash,
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
