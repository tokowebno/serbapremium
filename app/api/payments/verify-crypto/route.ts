import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseReady } from "@/lib/supabase";

// Official Store Wallets (Latest)
const OFFICIAL_EVM_WALLET = "0x6fA9dBe5E22564966e57Ab450F93443Aaa603245".toLowerCase();
const OFFICIAL_TON_WALLET = "UQCBzYw12ka6Y7m-skI_W5NL1uv5LSXGI1Hb6s-AvImK6BUe";
const OFFICIAL_TRON_WALLET = "TTcjF78tTsDFNmuJzzBgTdT9GaWHmmmnVV";
const OFFICIAL_SOLANA_WALLET = "FNNgq27hNuwddakAeZJiWUEJYjE13CtsS3YHRJjGMwpP";
const OFFICIAL_BTC_WALLET = "14YEFfBwFJ7F5h8rPY7ZjCm18NWGeYcANk";

const STORE_BSC_WALLETS = [OFFICIAL_EVM_WALLET];
const STORE_TRON_WALLETS = [OFFICIAL_TRON_WALLET];
const STORE_TON_WALLETS = [OFFICIAL_TON_WALLET];

const STORE_SOLANA_WALLETS = [OFFICIAL_SOLANA_WALLET];
const STORE_BTC_WALLETS = [OFFICIAL_BTC_WALLET];

// RPC Endpoints & Token Contracts
const BSC_RPC_URLS = [
  "https://bsc-dataseed1.defibit.io",
  "https://bsc-dataseed1.binance.org",
  "https://bsc-dataseed.binance.org",
  "https://binance.ankr.com",
  "https://rpc.ankr.com/bsc",
];
const ETH_RPC_URLS = [
  "https://eth.llamarpc.com",
  "https://rpc.ankr.com/eth",
  "https://ethereum-rpc.publicnode.com",
];
const SOLANA_RPC_URLS = [
  "https://api.mainnet-beta.solana.com",
  "https://solana-rpc.publicnode.com",
];

const BSC_USDT_CONTRACT = "0x55d398326f99059ff775485246999027b3197955".toLowerCase();
const BSC_USDC_CONTRACT = "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d".toLowerCase();
const ETH_USDT_CONTRACT = "0xdac17f958d2ee523a2206206994597c13d831ec7".toLowerCase();
const ETH_USDC_CONTRACT = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48".toLowerCase();
const SOLANA_USDT_MINT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
const SOLANA_USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef".toLowerCase();

// Global In-Memory Anti-Replay Cache
const CLAIMED_TX_CACHE = new Set<string>();

// Maximum transaction age allowed for deposit: 2 hours (7200 seconds)
const MAX_TX_AGE_SECONDS = 2 * 60 * 60;

function decodeHexAddress(topicHex: string): string {
  const clean = topicHex.replace(/^0x/i, "");
  if (clean.length >= 40) {
    return ("0x" + clean.slice(-40)).toLowerCase();
  }
  return ("0x" + clean).toLowerCase();
}

function extractTxHash(rawInput: string): string {
  const text = (rawInput || "").trim();
  const evmMatch = text.match(/0x[0-9a-fA-F]{64}/);
  if (evmMatch) return evmMatch[0];

  const hex64Match = text.match(/\b[0-9a-fA-F]{64}\b/);
  if (hex64Match) return hex64Match[0];

  const solMatch = text.match(/\b[1-9A-HJ-NP-Za-km-z]{84,90}\b/);
  if (solMatch) return solMatch[0];

  if (text.includes("/")) {
    const parts = text.split("/").filter(Boolean);
    const last = parts[parts.length - 1]?.split("?")[0]?.split("#")[0];
    if (last && last.length >= 32) return last;
  }
  return text;
}

const FALLBACK_PRICES: Record<string, number> = {
  BNB: 620,
  ETH: 2650,
  TRX: 0.24,
  SOL: 185,
  TON: 3.4,
  BTC: 92000,
  GRAM: 1.18,
};

async function getLiveCoinPriceUsd(symbol: string): Promise<number> {
  const sym = symbol.toUpperCase();
  if (sym === "USDT" || sym === "USDC") return 1.0;
  try {
    const resp = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${sym}USDT`, {
      signal: AbortSignal.timeout(3000),
    });
    if (resp.ok) {
      const data = await resp.json();
      const p = parseFloat(data?.price);
      if (p > 0) return p;
    }
  } catch {}
  return FALLBACK_PRICES[sym] || 1.0;
}

function isAmountAcceptable(detectedUsd: number, expectedUsd: number): boolean {
  const minFloor = Math.max(1.0, Math.floor(expectedUsd) - 0.25);
  return detectedUsd >= Math.min(expectedUsd - 0.25, minFloor);
}

// 1. Verify BEP-20 (BSC) On-Chain (USDT, USDC, or Native BNB)
async function verifyBscTx(
  txHash: string,
  expectedAmountUsd: number
): Promise<{ valid: boolean; message: string; amount?: number; sender?: string }> {
  let clean = extractTxHash(txHash);
  if (!clean.startsWith("0x") && /^[0-9a-fA-F]{64}$/.test(clean)) {
    clean = "0x" + clean;
  }

  if (clean.length === 42 && clean.toLowerCase().startsWith("0x")) {
    return {
      valid: false,
      message: "Invalid format: You entered a wallet address (42 chars) instead of a Transaction Hash / TxID (66 chars).",
    };
  }

  if (clean.length !== 66 || !/^0x[0-9a-fA-F]{64}$/.test(clean)) {
    return {
      valid: false,
      message: "Invalid BSC TxID format: Hash must be 66 hexadecimal characters (0x...).",
    };
  }

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
      const receipt = data?.result;
      if (!receipt) continue;

      if (receipt.status !== "0x1") {
        return {
          valid: false,
          message: "Transaction failed on BNB Smart Chain (Status: Reverted).",
        };
      }

      if (receipt.blockNumber) {
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
              const blockTs = parseInt(bData.result.timestamp, 16);
              const ageSec = Math.floor(Date.now() / 1000) - blockTs;
              if (ageSec > MAX_TX_AGE_SECONDS) {
                return {
                  valid: false,
                  message: `Transaction expired (${Math.floor(ageSec / 60)} minutes ago). Please submit a recent transaction.`,
                };
              }
            }
          }
        } catch {}
      }

      const logs = receipt.logs || [];
      let detectedAmount = 0;
      let onChainSender = "";

      for (const log of logs) {
        const contract = (log.address || "").toLowerCase();
        if (contract !== BSC_USDT_CONTRACT && contract !== BSC_USDC_CONTRACT) continue;

        const topics = log.topics || [];
        if (topics.length >= 3 && topics[0].toLowerCase() === TRANSFER_TOPIC) {
          const toAddr = decodeHexAddress(topics[2]);
          if (STORE_BSC_WALLETS.includes(toAddr)) {
            onChainSender = decodeHexAddress(topics[1]);
            try {
              const rawAmount = BigInt(log.data);
              detectedAmount += Number(rawAmount) / 1e18;
            } catch {}
          }
        }
      }

      if (detectedAmount <= 0) {
        try {
          const txResp = await fetch(rpc, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 3,
              method: "eth_getTransactionByHash",
              params: [clean],
            }),
            signal: AbortSignal.timeout(3500),
          });
          if (txResp.ok) {
            const txObj = (await txResp.json())?.result;
            const toAddr = (txObj?.to || "").toLowerCase();
            if (STORE_BSC_WALLETS.includes(toAddr) && txObj?.value) {
              const wei = BigInt(txObj.value);
              if (wei > BigInt(0)) {
                const bnbAmt = Number(wei) / 1e18;
                const bnbPrice = await getLiveCoinPriceUsd("BNB");
                detectedAmount = bnbAmt * bnbPrice;
                onChainSender = (txObj?.from || "").toLowerCase();
              }
            }
          }
        } catch {}
      }

      if (detectedAmount <= 0) {
        return {
          valid: false,
          message: "No USDT/USDC/BNB transfer to the official Texas AI BSC wallet was found in this transaction.",
        };
      }

      if (!isAmountAcceptable(detectedAmount, expectedAmountUsd)) {
        return {
          valid: false,
          message: `Transferred amount ($${detectedAmount.toFixed(2)} USD) is less than the invoice amount ($${expectedAmountUsd.toFixed(2)} USD).`,
        };
      }

      return {
        valid: true,
        message: "BEP-20 transaction verified on-chain!",
        amount: Number(detectedAmount.toFixed(2)),
        sender: onChainSender,
      };
    } catch {}
  }

  return {
    valid: false,
    message: "Transaction not found on BNB Smart Chain (BEP-20) or still confirming.",
  };
}

// 2. Verify Ethereum ERC-20 (USDT, USDC, or Native ETH)
async function verifyEthTx(
  txHash: string,
  expectedAmountUsd: number
): Promise<{ valid: boolean; message: string; amount?: number }> {
  let clean = extractTxHash(txHash);
  if (!clean.startsWith("0x") && /^[0-9a-fA-F]{64}$/.test(clean)) {
    clean = "0x" + clean;
  }
  if (clean.length !== 66 || !/^0x[0-9a-fA-F]{64}$/.test(clean)) {
    return { valid: false, message: "Invalid Ethereum TxID format." };
  }

  for (const rpc of ETH_RPC_URLS) {
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
      const receipt = (await resp.json())?.result;
      if (!receipt) continue;
      if (receipt.status !== "0x1") {
        return { valid: false, message: "Ethereum transaction failed on-chain." };
      }

      let detectedAmount = 0;
      for (const log of receipt.logs || []) {
        const contract = (log.address || "").toLowerCase();
        if (contract !== ETH_USDT_CONTRACT && contract !== ETH_USDC_CONTRACT) continue;
        const topics = log.topics || [];
        if (topics.length >= 3 && topics[0].toLowerCase() === TRANSFER_TOPIC) {
          const toAddr = decodeHexAddress(topics[2]);
          if (STORE_BSC_WALLETS.includes(toAddr)) {
            try {
              detectedAmount += Number(BigInt(log.data)) / 1e6;
            } catch {}
          }
        }
      }

      if (detectedAmount <= 0) {
        const txResp = await fetch(rpc, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: 2,
            method: "eth_getTransactionByHash",
            params: [clean],
          }),
          signal: AbortSignal.timeout(3500),
        });
        if (txResp.ok) {
          const txObj = (await txResp.json())?.result;
          const toAddr = (txObj?.to || "").toLowerCase();
          if (STORE_BSC_WALLETS.includes(toAddr) && txObj?.value) {
            const wei = BigInt(txObj.value);
            if (wei > BigInt(0)) {
              const ethAmt = Number(wei) / 1e18;
              const ethPrice = await getLiveCoinPriceUsd("ETH");
              detectedAmount = ethAmt * ethPrice;
            }
          }
        }
      }

      if (detectedAmount > 0) {
        if (!isAmountAcceptable(detectedAmount, expectedAmountUsd)) {
          return {
            valid: false,
            message: `Transferred amount ($${detectedAmount.toFixed(2)} USD) is less than the invoice amount ($${expectedAmountUsd.toFixed(2)} USD).`,
          };
        }
        return {
          valid: true,
          message: "Ethereum transaction verified on-chain!",
          amount: Number(detectedAmount.toFixed(2)),
        };
      }
    } catch {}
  }

  return { valid: false, message: "Transaction not found on Ethereum network." };
}

// 3. Verify TRC-20 (TRON USDT or Native TRX)
async function verifyTronTx(
  txHash: string,
  expectedAmountUsd: number
): Promise<{ valid: boolean; message: string; amount?: number }> {
  const clean = extractTxHash(txHash).replace(/^0x/i, "");
  if (clean.length !== 64 || !/^[0-9a-fA-F]{64}$/.test(clean)) {
    return {
      valid: false,
      message: "Invalid TRON TxID format: Hash must be 64 hexadecimal characters.",
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
          message: "Transaction not found on TRON network or still pending confirmation.",
        };
      }

      const res = info.result;
      const receiptRes = info.receipt?.result;
      if (res && res !== "SUCCESS") {
        return { valid: false, message: "TRON transaction failed on-chain (FAILED)." };
      }
      if (receiptRes && receiptRes !== "SUCCESS") {
        return { valid: false, message: `TRON transaction failed (${receiptRes}).` };
      }

      if (info.blockTimeStamp) {
        const ageSec = (Date.now() - info.blockTimeStamp) / 1000;
        if (ageSec > MAX_TX_AGE_SECONDS) {
          return {
            valid: false,
            message: `Transaction expired (${Math.floor(ageSec / 60)} minutes ago). Please submit a recent transfer.`,
          };
        }
      }

      let detectedAmount = 0;
      const logs = info.log || [];
      for (const log of logs) {
        const dataHex = log.data || "0";
        try {
          const rawAmt = BigInt("0x" + dataHex);
          const amt = Number(rawAmt) / 1e6;
          if (amt > 0) detectedAmount += amt;
        } catch {}
      }

      if (detectedAmount <= 0) {
        try {
          const txResp = await fetch("https://api.trongrid.io/wallet/gettransactionbyid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: clean }),
            signal: AbortSignal.timeout(4000),
          });
          if (txResp.ok) {
            const txData = await txResp.json();
            const contracts = txData?.raw_data?.contract || [];
            for (const c of contracts) {
              if (c?.type === "TransferContract") {
                const sunAmt = Number(c?.parameter?.value?.amount || 0);
                if (sunAmt > 0) {
                  const trxAmt = sunAmt / 1e6;
                  const trxPrice = await getLiveCoinPriceUsd("TRX");
                  detectedAmount += trxAmt * trxPrice;
                }
              }
            }
          }
        } catch {}
      }

      if (detectedAmount > 0) {
        if (!isAmountAcceptable(detectedAmount, expectedAmountUsd)) {
          return {
            valid: false,
            message: `Transferred TRON amount ($${detectedAmount.toFixed(2)} USD) is less than the invoice amount ($${expectedAmountUsd.toFixed(2)} USD).`,
          };
        }
        return {
          valid: true,
          message: "TRON (TRC-20) transaction verified on-chain!",
          amount: Number(detectedAmount.toFixed(2)),
        };
      }

      return {
        valid: false,
        message: "No valid USDT/TRX transfer to the official Texas AI TRON wallet was found in this transaction.",
      };
    }
  } catch {}

  return {
    valid: false,
    message: "Transaction not found on TRON network or still confirming.",
  };
}

// 4. Verify Solana (SPL USDT/USDC or Native SOL)
async function verifySolanaTx(
  txHash: string,
  expectedAmountUsd: number
): Promise<{ valid: boolean; message: string; amount?: number }> {
  const clean = extractTxHash(txHash);
  if (clean.length < 60 || clean.length > 100) {
    return {
      valid: false,
      message: "Invalid Solana signature format (must be an 87-88 character Base58 signature).",
    };
  }

  for (const rpcUrl of SOLANA_RPC_URLS) {
    try {
      const resp = await fetch(rpcUrl, {
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

      if (!resp.ok) continue;
      const json = await resp.json();
      const res = json?.result;
      if (!res) continue;

      if (res.meta?.err !== null && res.meta?.err !== undefined) {
        return { valid: false, message: "Solana transaction failed on-chain." };
      }

      if (res.blockTime) {
        const ageSec = Math.floor(Date.now() / 1000) - res.blockTime;
        if (ageSec > MAX_TX_AGE_SECONDS) {
          return {
            valid: false,
            message: `Solana transaction expired (${Math.floor(ageSec / 60)} minutes ago).`,
          };
        }
      }

      const preTokens = res.meta?.preTokenBalances || [];
      const postTokens = res.meta?.postTokenBalances || [];
      const preMap = new Map<string, number>();

      for (const pt of preTokens) {
        if (STORE_SOLANA_WALLETS.includes(pt?.owner) && (pt?.mint === SOLANA_USDT_MINT || pt?.mint === SOLANA_USDC_MINT)) {
          preMap.set(`${pt.accountIndex}:${pt.mint}`, Number(pt?.uiTokenAmount?.uiAmount || 0));
        }
      }

      let detectedUsd = 0;
      for (const pt of postTokens) {
        if (STORE_SOLANA_WALLETS.includes(pt?.owner) && (pt?.mint === SOLANA_USDT_MINT || pt?.mint === SOLANA_USDC_MINT)) {
          const postAmt = Number(pt?.uiTokenAmount?.uiAmount || 0);
          const preAmt = preMap.get(`${pt.accountIndex}:${pt.mint}`) || 0;
          if (postAmt > preAmt) {
            detectedUsd += postAmt - preAmt;
          }
        }
      }

      if (detectedUsd <= 0) {
        const keys = res.transaction?.message?.accountKeys || [];
        let targetIdx = -1;
        keys.forEach((k: any, idx: number) => {
          const addr = typeof k === "string" ? k : k?.pubkey;
          if (STORE_SOLANA_WALLETS.includes(addr)) targetIdx = idx;
        });
        if (targetIdx >= 0) {
          const preBal = Number(res.meta?.preBalances?.[targetIdx] || 0);
          const postBal = Number(res.meta?.postBalances?.[targetIdx] || 0);
          if (postBal > preBal) {
            const solAmt = (postBal - preBal) / 1e9;
            const solPrice = await getLiveCoinPriceUsd("SOL");
            detectedUsd = solAmt * solPrice;
          }
        }
      }

      if (detectedUsd <= 0) {
        return { valid: false, message: "No USDT/USDC/SOL transfer to the official Texas AI Solana wallet was found." };
      }

      if (!isAmountAcceptable(detectedUsd, expectedAmountUsd)) {
        return {
          valid: false,
          message: `Transferred Solana amount ($${detectedUsd.toFixed(2)} USD) is less than the invoice amount ($${expectedAmountUsd.toFixed(2)} USD).`,
        };
      }

      return {
        valid: true,
        message: "Solana transaction verified on-chain!",
        amount: Number(detectedUsd.toFixed(2)),
      };
    } catch {}
  }

  return {
    valid: false,
    message: "Transaction not found on Solana network or still confirming.",
  };
}

// 5. Verify TON (The Open Network — Native TON, USDT-TON, or GRAM Jettons)
async function verifyTonTx(
  txHash: string,
  expectedAmountUsd: number
): Promise<{ valid: boolean; message: string; amount?: number }> {
  const clean = extractTxHash(txHash);
  if (clean.length < 32) {
    return { valid: false, message: "Invalid TON transaction hash format." };
  }

  try {
    const allowedRaw = new Set<string>();
    for (const friendly of STORE_TON_WALLETS) {
      try {
        const acctResp = await fetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(friendly)}`, {
          signal: AbortSignal.timeout(4000),
        });
        if (acctResp.ok) {
          const acctData = await acctResp.json();
          if (acctData?.address) allowedRaw.add(String(acctData.address).toLowerCase());
        }
      } catch {}
    }

    const evResp = await fetch(`https://tonapi.io/v2/events/${encodeURIComponent(clean)}`, {
      signal: AbortSignal.timeout(5000),
    });

    if (evResp.ok) {
      const ev = await evResp.json();
      const ts = Number(ev?.timestamp || 0);
      if (ts > 0 && Math.floor(Date.now() / 1000) - ts > MAX_TX_AGE_SECONDS) {
        return {
          valid: false,
          message: "TON transaction has expired (older than 2 hours).",
        };
      }

      let detectedUsd = 0;
      for (const act of ev?.actions || []) {
        if (act?.status !== "ok") continue;
        if (act?.type === "TonTransfer") {
          const tt = act.TonTransfer || {};
          const recAddr = String(tt?.recipient?.address || "").toLowerCase();
          if (allowedRaw.size === 0 || allowedRaw.has(recAddr)) {
            const tonAmt = Number(tt?.amount || 0) / 1e9;
            const tonPrice = await getLiveCoinPriceUsd("TON");
            detectedUsd += tonAmt * tonPrice;
          }
        } else if (act?.type === "JettonTransfer") {
          const jt = act.JettonTransfer || {};
          const recAddr = String(jt?.recipient?.address || "").toLowerCase();
          const sym = String(jt?.jetton?.symbol || "").toUpperCase();
          const decimals = Number(jt?.jetton?.decimals || 6);
          if (allowedRaw.size === 0 || allowedRaw.has(recAddr)) {
            const tokenAmt = Number(jt?.amount || 0) / Math.pow(10, decimals);
            if (sym.includes("USD")) {
              detectedUsd += tokenAmt;
            } else if (sym.includes("GRAM")) {
              const gramPrice = await getLiveCoinPriceUsd("GRAM");
              detectedUsd += tokenAmt * gramPrice;
            } else {
              const price = await getLiveCoinPriceUsd(sym);
              detectedUsd += tokenAmt * price;
            }
          }
        }
      }

      if (detectedUsd <= 0) {
        return {
          valid: false,
          message: "No TON/USDT transfer to the official Texas AI TON wallet was found in this transaction.",
        };
      }

      if (!isAmountAcceptable(detectedUsd, expectedAmountUsd)) {
        return {
          valid: false,
          message: `Transferred TON value ($${detectedUsd.toFixed(2)} USD) is less than the invoice amount ($${expectedAmountUsd.toFixed(2)} USD).`,
        };
      }

      return {
        valid: true,
        message: "TON transaction verified on-chain!",
        amount: Number(detectedUsd.toFixed(2)),
      };
    }
  } catch {}

  return {
    valid: false,
    message: "Transaction not found on TON blockchain or still confirming.",
  };
}

// 6. Verify Bitcoin (BTC) On-Chain via Mempool.space / Blockstream
async function verifyBtcTx(
  txHash: string,
  expectedAmountUsd: number
): Promise<{ valid: boolean; message: string; amount?: number }> {
  const clean = extractTxHash(txHash);
  if (!/^[0-9a-fA-F]{64}$/.test(clean)) {
    return {
      valid: false,
      message: "Invalid Bitcoin TxID format: must be a 64-character hexadecimal transaction hash.",
    };
  }

  const apis = [
    `https://mempool.space/api/tx/${clean}`,
    `https://blockstream.info/api/tx/${clean}`,
  ];

  for (const url of apis) {
    try {
      const resp = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!resp.ok) continue;
      const tx = await resp.json();
      const blockTime = Number(tx?.status?.block_time || 0);
      if (blockTime > 0 && Math.floor(Date.now() / 1000) - blockTime > MAX_TX_AGE_SECONDS * 2) {
        return { valid: false, message: "Bitcoin transaction has expired." };
      }

      let satsReceived = 0;
      for (const vout of tx?.vout || []) {
        if (STORE_BTC_WALLETS.includes(vout?.scriptpubkey_address)) {
          satsReceived += Number(vout?.value || 0);
        }
      }

      if (satsReceived <= 0) {
        return {
          valid: false,
          message: "No BTC output to the official Texas AI Bitcoin wallet was found in this transaction.",
        };
      }

      const btcAmt = satsReceived / 1e8;
      const btcPrice = await getLiveCoinPriceUsd("BTC");
      const detectedUsd = btcAmt * btcPrice;

      if (!isAmountAcceptable(detectedUsd, expectedAmountUsd)) {
        return {
          valid: false,
          message: `Transferred BTC value ($${detectedUsd.toFixed(2)} USD) is less than the invoice amount ($${expectedAmountUsd.toFixed(2)} USD).`,
        };
      }

      return {
        valid: true,
        message: "Bitcoin transaction verified on-chain!",
        amount: Number(detectedUsd.toFixed(2)),
      };
    } catch {}
  }

  return {
    valid: false,
    message: "Transaction not found on Bitcoin blockchain.",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { network, tx_hash, expected_amount_usd } = body;

    if (!tx_hash || typeof tx_hash !== "string" || !tx_hash.trim()) {
      return NextResponse.json(
        { ok: false, message: "Transaction Hash (TxID) is required for payment verification." },
        { status: 400 }
      );
    }

    const cleanHash = extractTxHash(tx_hash);
    const cleanLower = cleanHash.toLowerCase().replace(/^0x/, "");
    const expectedUsd = Number(expected_amount_usd) || 5;

    if (cleanHash.length < 16 || /^(test|halo|sudah|bayar|ok|done|txid|hash|1234|abc|asdf)/i.test(cleanHash)) {
      return NextResponse.json(
        { ok: false, message: "Invalid TxID format. Please paste a valid transaction hash from your wallet." },
        { status: 400 }
      );
    }

    // ANTI-REPLAY CHECK 1: In-Memory Cache
    if (CLAIMED_TX_CACHE.has(cleanLower)) {
      return NextResponse.json(
        {
          ok: false,
          message: "This transaction hash has already been used for a previous deposit.",
        },
        { status: 400 }
      );
    }

    // ANTI-REPLAY CHECK 2: Supabase
    if (supabaseReady && supabase) {
      try {
        const { data: existingOrder } = await supabase
          .from("orders")
          .select("id, payment_status")
          .ilike("tx_id", `%${cleanLower}%`)
          .eq("payment_status", "berhasil")
          .maybeSingle();

        if (existingOrder) {
          CLAIMED_TX_CACHE.add(cleanLower);
          return NextResponse.json(
            {
              ok: false,
              message: "This transaction hash has already been claimed on a previous order. Each TxID can only be used once.",
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
      message: "Unsupported crypto network.",
      amount: expectedUsd,
    };

    const net = (network || "").toLowerCase();
    if (net === "usdt_bnb" || net.includes("bep") || net.includes("bnb") || net.includes("bsc")) {
      result = await verifyBscTx(cleanHash, expectedUsd);
    } else if (net === "usdt_tron" || net.includes("trc") || net.includes("tron")) {
      result = await verifyTronTx(cleanHash, expectedUsd);
    } else if (net === "solana" || net.includes("sol")) {
      result = await verifySolanaTx(cleanHash, expectedUsd);
    } else if (net === "ton" || net.includes("ton")) {
      result = await verifyTonTx(cleanHash, expectedUsd);
    } else if (net === "btc" || net.includes("bitcoin")) {
      result = await verifyBtcTx(cleanHash, expectedUsd);
    } else if (net.includes("eth") || net.includes("erc")) {
      result = await verifyEthTx(cleanHash, expectedUsd);
    }

    // Smart Cross-Chain Auto-Fallback if user selected the wrong network tab
    if (!result.valid) {
      if (/^0x[0-9a-fA-F]{64}$/.test(cleanHash) || /^[0-9a-fA-F]{64}$/.test(cleanHash)) {
        const bscTry = await verifyBscTx(cleanHash, expectedUsd);
        if (bscTry.valid) result = bscTry;
        if (!result.valid) {
          const ethTry = await verifyEthTx(cleanHash, expectedUsd);
          if (ethTry.valid) result = ethTry;
        }
        if (!result.valid && !cleanHash.startsWith("0x")) {
          const tonTry = await verifyTonTx(cleanHash, expectedUsd);
          if (tonTry.valid) result = tonTry;
        }
        if (!result.valid && !cleanHash.startsWith("0x")) {
          const tronTry = await verifyTronTx(cleanHash, expectedUsd);
          if (tronTry.valid) result = tronTry;
        }
        if (!result.valid && !cleanHash.startsWith("0x")) {
          const btcTry = await verifyBtcTx(cleanHash, expectedUsd);
          if (btcTry.valid) result = btcTry;
        }
      } else if (cleanHash.length >= 40 && cleanHash.length <= 60) {
        const tonTry = await verifyTonTx(cleanHash, expectedUsd);
        if (tonTry.valid) result = tonTry;
      } else if (cleanHash.length >= 80 && cleanHash.length <= 92) {
        const solTry = await verifySolanaTx(cleanHash, expectedUsd);
        if (solTry.valid) result = solTry;
      }
    }

    if (!result.valid) {
      return NextResponse.json(
        { ok: false, message: result.message },
        { status: 400 }
      );
    }

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
      { ok: false, message: "An error occurred while verifying your transaction on-chain: " + (error?.message || "Internal error") },
      { status: 500 }
    );
  }
}
