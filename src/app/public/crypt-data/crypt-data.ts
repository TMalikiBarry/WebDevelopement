/*import * as crypto from 'crypto';

const KEY_LENGTH = 32; // 256 bits (AES-256)
const ITERATION_COUNT = 65536;

export function encrypt(strToEncrypt: string, secretKey: string, salt: string): string | null {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto.pbkdf2Sync(secretKey, salt, ITERATION_COUNT, KEY_LENGTH, 'sha256');
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(strToEncrypt, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    const encryptedData = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]);
    return encryptedData.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
}

export function decrypt(strToDecrypt: string, secretKey: string, salt: string): string | null {
  try {
    const encryptedData = Buffer.from(strToDecrypt, 'base64');
    const iv = encryptedData.slice(0, 16);
    const encryptedText = encryptedData.slice(16);
    const key = crypto.pbkdf2Sync(secretKey, salt, ITERATION_COUNT, KEY_LENGTH, 'sha256');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
}*/
