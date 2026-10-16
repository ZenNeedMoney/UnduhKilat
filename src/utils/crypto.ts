// Web Crypto API file encryption and checksum utility
import { timingSafeEqual } from './security';

const PBKDF2_ITERATIONS = 250000; // Hardened according to OWASP standards
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

export async function encryptBuffer(data: ArrayBuffer, password: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  // Import base key from user password
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive AES-GCM 256-bit key
  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    data
  );

  // Pack: Salt (16 bytes) + IV (12 bytes) + Ciphertext
  const totalLength = salt.byteLength + iv.byteLength + ciphertext.byteLength;
  const packed = new Uint8Array(totalLength);
  packed.set(salt, 0);
  packed.set(iv, salt.byteLength);
  packed.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength);

  return packed.buffer;
}

export async function decryptBuffer(packedData: ArrayBuffer, password: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder();
  const packedBytes = new Uint8Array(packedData);

  if (packedBytes.length < SALT_LENGTH + IV_LENGTH + 16) {
    throw new Error('Format data terenkripsi tidak valid atau rusak');
  }

  const salt = packedBytes.slice(0, SALT_LENGTH);
  const iv = packedBytes.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = packedBytes.slice(SALT_LENGTH + IV_LENGTH);

  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  try {
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      ciphertext
    );
    return decrypted;
  } catch {
    throw new Error('Kata sandi salah atau data file telah terkorupsi');
  }
}

export async function calculateSha256(data: ArrayBuffer | Uint8Array): Promise<string> {
  const arrayBuffer: ArrayBuffer = data instanceof Uint8Array 
    ? (data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer) 
    : data;
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function calculateSha512(data: ArrayBuffer | Uint8Array): Promise<string> {
  const arrayBuffer: ArrayBuffer = data instanceof Uint8Array 
    ? (data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer) 
    : data;
  const hashBuffer = await window.crypto.subtle.digest('SHA-512', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyChecksum(
  data: ArrayBuffer | Uint8Array, 
  expectedHash: string
): Promise<{ matches: boolean; calculatedHash: string; algorithm: 'SHA-256' | 'SHA-512' }> {
  const cleanExpected = expectedHash.trim().toLowerCase();
  const is512 = cleanExpected.length === 128;
  const calculated = is512 ? await calculateSha512(data) : await calculateSha256(data);
  const matches = timingSafeEqual(cleanExpected, calculated);
  return {
    matches,
    calculatedHash: calculated,
    algorithm: is512 ? 'SHA-512' : 'SHA-256'
  };
}

// Fast lightweight pseudo-MD5 hex calculation for preview integrity
export function simpleChecksum(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
