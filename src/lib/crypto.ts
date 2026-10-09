import { secp256k1 } from '@noble/curves/secp256k1.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { ripemd160 } from '@noble/hashes/legacy.js';

// Base58 Alphabet as in Bitcoin & C++ code
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Base58 encoding matching the C++ script implementation
 */
export function base58Encode(input: Uint8Array): string {
  let zeroBytes = 0;
  while (zeroBytes < input.length && input[zeroBytes] === 0) {
    zeroBytes++;
  }

  // Pre-allocate buffer estimate
  const size = Math.floor(((input.length - zeroBytes) * 138) / 100) + 1;
  const buf = new Uint8Array(size);

  for (let i = zeroBytes; i < input.length; i++) {
    let carry = input[i];
    for (let j = size - 1; j >= 0; j--) {
      carry += 256 * buf[j];
      buf[j] = carry % 58;
      carry = Math.floor(carry / 58);
    }
  }

  let i = 0;
  while (i < size && buf[i] === 0) {
    i++;
  }

  let output = '';
  for (let j = 0; j < zeroBytes; j++) {
    output += '1';
  }
  for (; i < size; i++) {
    output += BASE58_ALPHABET[buf[i]];
  }

  return output;
}

/**
 * Helper: Bytes to hex string
 */
export function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Helper: Hex string to bytes
 */
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.replace(/^0x/, '').trim();
  const len = cleanHex.length;
  const bytes = new Uint8Array(len / 2);
  for (let i = 0; i < len; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Convert 32-byte private key to Electrum WIF Compressed format
 * Format: 0x80 + 32-byte privKey + 0x01 + 4-byte double SHA256 checksum
 */
export function privateKeyToWifCompressed(privBytes: Uint8Array): string {
  const payload = new Uint8Array(34);
  payload[0] = 0x80; // Mainnet prefix
  payload.set(privBytes, 1);
  payload[33] = 0x01; // Compressed flag

  const check1 = sha256(payload);
  const check2 = sha256(check1);

  const finalBytes = new Uint8Array(38);
  finalBytes.set(payload, 0);
  finalBytes.set(check2.subarray(0, 4), 34);

  return base58Encode(finalBytes);
}

/**
 * Convert 32-byte private key to Legacy Bitcoin Address (P2PKH - Base58 compressed)
 * 1. secp256k1 point multiplication -> compressed public key (33 bytes)
 * 2. SHA-256(pubKey) -> 32 bytes
 * 3. RIPEMD-160(sha256) -> 20 bytes (Hash160)
 * 4. Prepend version byte 0x00 -> 21 bytes
 * 5. Double SHA-256 for 4-byte checksum -> 25 bytes
 * 6. Base58 encode -> Bitcoin Legacy Address starting with '1'
 */
export function privateKeyToLegacyAddress(privBytes: Uint8Array): {
  address: string;
  compressedPubKey: Uint8Array;
  pubKeyHex: string;
  sha256HashHex: string;
  ripemd160Hex: string;
  payloadHex: string;
} {
  // secp256k1 compressed public key (33 bytes: 0x02 or 0x03 prefix + 32-byte X)
  const compressedPubKey = secp256k1.getPublicKey(privBytes, true);

  const shaRes = sha256(compressedPubKey);
  const ripemdRes = ripemd160(shaRes);

  const payload = new Uint8Array(21);
  payload[0] = 0x00; // Mainnet P2PKH address prefix
  payload.set(ripemdRes, 1);

  const check1 = sha256(payload);
  const check2 = sha256(check1);

  const finalBytes = new Uint8Array(25);
  finalBytes.set(payload, 0);
  finalBytes.set(check2.subarray(0, 4), 21);

  const address = base58Encode(finalBytes);

  return {
    address,
    compressedPubKey,
    pubKeyHex: bytesToHex(compressedPubKey),
    sha256HashHex: bytesToHex(shaRes),
    ripemd160Hex: bytesToHex(ripemdRes),
    payloadHex: bytesToHex(payload),
  };
}

/**
 * Fast generation for worker batches (returns minimal result to optimize throughput)
 */
export function fastCheckKey(privBytes: Uint8Array, targetAddress: string): {
  matched: boolean;
  address: string;
} {
  const compressedPubKey = secp256k1.getPublicKey(privBytes, true);
  const shaRes = sha256(compressedPubKey);
  const ripemdRes = ripemd160(shaRes);

  const payload = new Uint8Array(21);
  payload[0] = 0x00;
  payload.set(ripemdRes, 1);

  const check1 = sha256(payload);
  const check2 = sha256(check1);

  const finalBytes = new Uint8Array(25);
  finalBytes.set(payload, 0);
  finalBytes.set(check2.subarray(0, 4), 21);

  const address = base58Encode(finalBytes);
  return {
    matched: address === targetAddress,
    address,
  };
}
