/**
 * Encryption helper for storing sensitive data at rest
 * Uses AES-256-GCM for authenticated encryption
 */

import { createCipheriv, createDecipheriv, randomBytes, createHash } from "crypto";

// Get encryption key from environment
function getEncryptionKey(): Buffer {
  const keyString = process.env.APP_ENCRYPTION_KEY || "dev-only-key-for-local-development";
  return createHash("sha256").update(keyString).digest(); // 32 bytes
}

/**
 * Encrypt JSON object to Buffer
 * Format: [12-byte IV][16-byte auth tag][N-byte encrypted data]
 */
export function encryptJson(obj: unknown): Buffer {
  const key = getEncryptionKey();
  const iv = randomBytes(12); // 12 bytes for GCM
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  
  const data = Buffer.from(JSON.stringify(obj), "utf8");
  const enc = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();
  
  return Buffer.concat([iv, tag, enc]);
}

/**
 * Decrypt Buffer/Uint8Array/String to JSON object
 */
export function decryptJson(buf: Buffer | Uint8Array | string): any {
  const key = getEncryptionKey();
  
  // Convert to Buffer if needed
  let buffer: Buffer;
  if (Buffer.isBuffer(buf)) {
    buffer = buf;
  } else if (typeof buf === 'string') {
    // Handle string input (from database)
    buffer = Buffer.from(buf, 'base64');
  } else {
    buffer = Buffer.from(buf);
  }
  
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const data = buffer.subarray(28);
  
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return JSON.parse(dec.toString("utf8"));
}

/**
 * Encrypt string value
 */
export function encryptString(value: string): Buffer {
  return encryptJson({ value });
}

/**
 * Decrypt string value
 */
export function decryptString(buf: Buffer): string {
  const data = decryptJson(buf);
  return data.value;
}
