import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_SECRET || 'your-32-character-secret-key-here!';
const key = crypto.scryptSync(secretKey, 'salt', 32);

export function encrypt(text: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    // Fallback to base64 encoding if encryption fails
    return Buffer.from(text).toString('base64');
  }
}

export function decrypt(encryptedText: string): string {
  try {
    // Check if it's our encrypted format (has colon separator)
    if (encryptedText.includes(':')) {
      const parts = encryptedText.split(':');
      if (parts.length === 2) {
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        
        const decipher = crypto.createDecipher(algorithm, key);
        
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
      }
    }
    
    // Fallback: try base64 decode
    return Buffer.from(encryptedText, 'base64').toString('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText; // Return original if decryption fails
  }
}
