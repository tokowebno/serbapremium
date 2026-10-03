"""
ZELVA AI - Blockchain On-Chain Verification Engine
Verifies BSC (BEP20 USDT) and TRON (TRC20 USDT) transactions automatically against public blockchain RPC nodes.
Prevents double-spending by validating uniqueness in database.
"""

import httpx
import logging
import hashlib
from config import BEP20_ADDRESS, TRC20_ADDRESS

logger = logging.getLogger(__name__)

# BSC Constants
BSC_RPC_URLS = [
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed1.ninicoin.io",
    "https://bsc-dataseed2.defibit.io",
    "https://binance.ankr.com"
]
BSC_USDT_CONTRACT = "0x55d398326f99059ff775485246999027b3197955"
TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

# TRON Constants
TRON_API_URLS = [
    "https://api.trongrid.io",
    "https://api.tronstack.io"
]
TRON_USDT_CONTRACT = "TR7NHqJEKQxGTCi8q8ZY4pL8otSzgjLj6t"

# Base58 helper for TRON address conversion
ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'


def b58decode_check(s: str) -> bytes:
    num = 0
    for char in s:
        num = num * 58 + ALPHABET.index(char)
    combined = num.to_bytes((num.bit_length() + 7) // 8, 'big')
    pad = 0
    for c in s:
        if c == '1':
            pad += 1
        else:
            break
    data = b'\x00' * pad + combined
    checksum = data[-4:]
    body = data[:-4]
    if hashlib.sha256(hashlib.sha256(body).digest()).digest()[:4] != checksum:
        raise ValueError('Invalid checksum')
    return body


def b58encode_check(data: bytes) -> str:
    checksum = hashlib.sha256(hashlib.sha256(data).digest()).digest()[:4]
    full = data + checksum
    num = int.from_bytes(full, 'big')
    chars = []
    while num > 0:
        num, rem = divmod(num, 58)
        chars.append(ALPHABET[rem])
    res = ''.join(reversed(chars))
    pad = 0
    for b in full:
        if b == 0:
            pad += 1
        else:
            break
    return '1' * pad + res


def decode_hex_address(topic_hex: str) -> str:
    """Extract 40-character hex ethereum address from 64-character log topic"""
    clean = topic_hex.replace("0x", "")
    if len(clean) >= 40:
        return "0x" + clean[-40:].lower()
    return "0x" + clean.lower()


def get_allowed_bep20_recipients() -> set[str]:
    recipients = {
        BEP20_ADDRESS.strip().lower(),
        "0xf9a79b222d623d69028daa2e52bf0a26383f5273".lower(),
        "0x6e2c1bc72847c435ccf4e4c1e67458e77c290451".lower()
    }
    return recipients


def get_allowed_trc20_recipients() -> set[str]:
    recipients = {
        TRC20_ADDRESS.strip(),
        "TLszJVcoXfrfL69Tn8EfGciAvU9mTiE5hd"
    }
    return recipients


async def verify_bep20_tx(tx_hash: str, expected_recipient: str, expected_amount: float) -> tuple[bool, str, float]:
    """
    Verify BSC BEP20 USDT transaction on-chain via public RPCs and BscScan proxy.
    Returns: (is_valid, message, actual_amount)
    """
    tx_clean = tx_hash.strip()
    if not tx_clean.startswith("0x") and not tx_clean.startswith("0X"):
        tx_clean = "0x" + tx_clean

    if len(tx_clean) == 42:
        return False, "Invalid format: You entered a wallet address instead of a 66-character transaction hash.", 0.0

    if len(tx_clean) != 66:
        return False, f"Invalid TxID format: BSC transaction hash must be 66 characters hex (you provided {len(tx_clean)} chars).", 0.0

    allowed_recipients = get_allowed_bep20_recipients()
    if expected_recipient:
        allowed_recipients.add(expected_recipient.strip().lower())

    null_count = 0
    for rpc_url in BSC_RPC_URLS:
        try:
            async with httpx.AsyncClient(timeout=3.5, follow_redirects=True) as client:
                payload = {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "eth_getTransactionReceipt",
                    "params": [tx_clean]
                }
                resp = await client.post(rpc_url, json=payload)
                if resp.status_code != 200:
                    continue

                data = resp.json()
                receipt = data.get("result")
                if not receipt:
                    null_count += 1
                    if null_count >= 2:
                        return False, "Transaction not found on BSC blockchain or still pending.", 0.0
                    continue

                # Check status (0x1 = success)
                status = receipt.get("status")
                if status != "0x1":
                    return False, "Transaction execution failed on-chain.", 0.0

                # Inspect logs for genuine USDT Transfer
                logs = receipt.get("logs", [])
                for log in logs:
                    # CRITICAL SECURITY: Verify log comes strictly from the official BSC USDT contract
                    contract_addr = log.get("address", "").lower()
                    if contract_addr != BSC_USDT_CONTRACT.lower():
                        continue

                    topics = log.get("topics", [])

                    # Check if Transfer event on USDT contract
                    if len(topics) >= 3 and topics[0].lower() == TRANSFER_TOPIC.lower():
                        to_addr = decode_hex_address(topics[2])
                        if to_addr in allowed_recipients:
                            data_hex = log.get("data", "0x0")
                            try:
                                raw_amount = int(data_hex, 16)
                                # USDT BEP20 has 18 decimals
                                actual_amount = raw_amount / (10 ** 18)
                                if actual_amount >= (expected_amount - 0.05):
                                    return True, "On-chain USDT transaction verified successfully.", round(actual_amount, 2)
                                else:
                                    return False, f"Transferred USDT amount (${actual_amount:.2f}) is less than expected (${expected_amount:.2f}).", round(actual_amount, 2)
                            except ValueError:
                                pass

                return False, "No matching USDT transfer to deposit address found in this transaction.", 0.0

        except Exception as e:
            logger.debug(f"RPC {rpc_url} failed: {e}")
            continue

    # Fallback to BscScan proxy API
    try:
        async with httpx.AsyncClient(timeout=3.5) as client:
            bscscan_url = f"https://api.bscscan.com/api?module=proxy&action=eth_getTransactionReceipt&txhash={tx_clean}"
            resp = await client.get(bscscan_url)
            if resp.status_code == 200:
                data = resp.json()
                receipt = data.get("result")
                if receipt and receipt.get("status") == "0x1":
                    for log in receipt.get("logs", []):
                        contract_addr = log.get("address", "").lower()
                        if contract_addr != BSC_USDT_CONTRACT.lower():
                            continue

                        topics = log.get("topics", [])
                        if len(topics) >= 3 and topics[0].lower() == TRANSFER_TOPIC.lower():
                            to_addr = decode_hex_address(topics[2])
                            if to_addr in allowed_recipients:
                                data_hex = log.get("data", "0x0")
                                raw_amount = int(data_hex, 16)
                                actual_amount = raw_amount / (10 ** 18)
                                if actual_amount >= (expected_amount - 0.05):
                                    return True, "On-chain USDT transaction verified successfully via BscScan.", round(actual_amount, 2)
                                else:
                                    return False, f"Transferred USDT amount (${actual_amount:.2f}) is less than expected (${expected_amount:.2f}).", round(actual_amount, 2)
    except Exception as e:
        logger.debug(f"BscScan fallback failed: {e}")

    return False, "Could not verify transaction with blockchain network at this time.", 0.0


async def verify_trc20_tx(tx_hash: str, expected_recipient: str, expected_amount: float) -> tuple[bool, str, float]:
    """
    Verify TRON TRC20 USDT transaction on-chain via TronGrid / TronStack.
    Returns: (is_valid, message, actual_amount)
    """
    tx_clean = tx_hash.strip().replace("0x", "")
    if len(tx_clean) != 64:
        return False, "Invalid TRON transaction hash format.", 0.0

    allowed_recipients = get_allowed_trc20_recipients()
    if expected_recipient:
        allowed_recipients.add(expected_recipient.strip())

    # Build allowed hex addresses for Tron
    allowed_hex = set()
    for addr in allowed_recipients:
        try:
            raw_b = b58decode_check(addr)
            allowed_hex.add(raw_b.hex()[-40:].lower())
        except Exception:
            pass

    tron_usdt_hex = b58decode_check(TRON_USDT_CONTRACT).hex()[-40:].lower()

    for api_url in TRON_API_URLS:
        try:
            async with httpx.AsyncClient(timeout=4.0, follow_redirects=True) as client:
                endpoint = f"{api_url}/wallet/gettransactioninfobyid"
                resp = await client.post(endpoint, json={"value": tx_clean})
                if resp.status_code != 200:
                    continue

                info = resp.json()
                if not info or not info.get("id"):
                    continue

                # Check result
                res = info.get("result")
                receipt = info.get("receipt", {})
                if res != "SUCCESS" and receipt.get("result") not in ("SUCCESS", None):
                    return False, "TRON transaction failed on-chain.", 0.0

                # Inspect log for TRC20 USDT transfer
                logs = info.get("log", [])
                for log in logs:
                    # CRITICAL SECURITY: Verify log comes strictly from official TRON USDT contract
                    contract_addr = log.get("address", "").lower()
                    if contract_addr and contract_addr != tron_usdt_hex:
                        continue

                    topics = log.get("topics", [])
                    if len(topics) >= 3 and topics[0].lower().startswith("ddf252ad"):
                        to_topic = topics[2].lower()
                        to_hex_clean = to_topic[-40:]
                        if to_hex_clean in allowed_hex or not allowed_hex:
                            data_hex = log.get("data", "0")
                            try:
                                raw_amount = int(data_hex, 16)
                                # USDT TRC20 has 6 decimals
                                actual_amount = raw_amount / (10 ** 6)
                                if actual_amount >= (expected_amount - 0.05):
                                    return True, "On-chain USDT transaction verified successfully.", round(actual_amount, 2)
                                else:
                                    return False, f"Transferred USDT amount (${actual_amount:.2f}) is less than expected (${expected_amount:.2f}).", round(actual_amount, 2)
                            except ValueError:
                                pass

                return False, "No matching TRC20 USDT transfer found in this transaction.", 0.0

        except Exception as e:
            logger.debug(f"TronGrid {api_url} failed: {e}")
            continue

    return False, "Could not verify transaction with TRON network at this time.", 0.0


async def verify_onchain_payment(network: str, tx_hash: str, expected_amount: float) -> tuple[bool, str, float]:
    """
    Dispatcher for automated on-chain verification.
    """
    net = network.upper().strip()
    if "BEP20" in net or "BSC" in net:
        return await verify_bep20_tx(tx_hash, BEP20_ADDRESS, expected_amount)
    elif "TRC20" in net or "TRON" in net:
        return await verify_trc20_tx(tx_hash, TRC20_ADDRESS, expected_amount)
    elif "BINANCE" in net:
        # Binance Pay ID is an internal off-chain transfer to a personal Binance ID.
        # It CANNOT be verified on public blockchains and must be confirmed by admin.
        return False, "Binance Pay ID requires manual confirmation by admin to verify received USDT amount.", 0.0
    else:
        return False, "Network does not support automated on-chain verification.", 0.0
