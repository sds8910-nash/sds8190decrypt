
// Base encryption utilities
export const deriveKey = (password: string, length: number): Uint8Array => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Simple hash derivation
  const hash = new Uint8Array(32);
  for (let i = 0; i < data.length; i++) {
    hash[i % 32] ^= data[i];
  }
  
  const key = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    key[i] = hash[i % 32];
  }
  return key;
};

export const xorEncrypt = (plaintext: string, password: string): string => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const key = deriveKey(password, data.length);
  
  const encrypted = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    encrypted[i] = data[i] ^ key[i];
  }
  
  return btoa(String.fromCharCode(...encrypted));
};

export const xorDecrypt = (ciphertext: string, password: string): string => {
  const encrypted = new Uint8Array(atob(ciphertext).split('').map(c => c.charCodeAt(0)));
  const key = deriveKey(password, encrypted.length);
  
  const decrypted = new Uint8Array(encrypted.length);
  for (let i = 0; i < encrypted.length; i++) {
    decrypted[i] = encrypted[i] ^ key[i];
  }
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};
