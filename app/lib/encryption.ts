import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_SECRET || 'your-32-character-secret-key-here!';
const key = crypto.scryptSync(secretKey, 'salt', 32);

export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Format: iv:authTag:encryptedData
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    // Fallback to base64 encoding if encryption fails
    return Buffer.from(text).toString('base64');
  }
}

export function decrypt(encryptedText: string): string {
  try {
    // First, let's handle the case where the data might not be encrypted at all
    // (in case the encryption failed and it was stored as base64)
    if (!encryptedText.includes(':')) {
      try {
        return Buffer.from(encryptedText, 'base64').toString('utf8');
      } catch {
        return encryptedText; // Return as-is if not base64
      }
    }

    const parts = encryptedText.split(':');
    
    if (parts.length === 3) {
      // New format: iv:authTag:encryptedData
      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];
      
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } else if (parts.length === 2) {
      // Legacy format - the old encryption was broken, so this is likely base64
      console.warn('Detected legacy format, treating as base64');
      try {
        return Buffer.from(encryptedText, 'base64').toString('utf8');
      } catch {
        // If base64 fails, just return the original text
        return encryptedText;
      }
    }
    
    // Fallback: return original
    return encryptedText;
  } catch (error) {
    console.error('Decryption error:', error);
    // Try base64 fallback
    try {
      return Buffer.from(encryptedText, 'base64').toString('utf8');
    } catch {
      return encryptedText; // Return original if all fails
    }
  }
}
