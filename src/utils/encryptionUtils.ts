
// Improved encryption utilities
export const simpleHash = (input: string): string => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
};

export const xorEncrypt = (text: string, password: string): string => {
  const encoder = new TextEncoder();
  const textBytes = encoder.encode(text);
  const keyBytes = encoder.encode(password);
  
  const encrypted = new Uint8Array(textBytes.length);
  for (let i = 0; i < textBytes.length; i++) {
    encrypted[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
  }
  
  // Convert to hex instead of base64 for better reliability
  return Array.from(encrypted)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const xorDecrypt = (encryptedHex: string, password: string): string => {
  if (encryptedHex.length % 2 !== 0) {
    throw new Error('Invalid encrypted data format');
  }
  
  const encrypted = new Uint8Array(encryptedHex.length / 2);
  for (let i = 0; i < encryptedHex.length; i += 2) {
    encrypted[i / 2] = parseInt(encryptedHex.substr(i, 2), 16);
  }
  
  const encoder = new TextEncoder();
  const keyBytes = encoder.encode(password);
  
  const decrypted = new Uint8Array(encrypted.length);
  for (let i = 0; i < encrypted.length; i++) {
    decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length];
  }
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};
