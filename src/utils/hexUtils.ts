
// Hexadecimal encoding utilities
export const stringToHex = (str: string): string => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const hexToString = (hex: string): string => {
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid hex string length');
  }
  
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
};

export const isValidHex = (str: string): boolean => {
  return /^[0-9a-fA-F]*$/.test(str) && str.length % 2 === 0;
};
