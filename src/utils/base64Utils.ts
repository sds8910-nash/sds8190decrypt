
// Enhanced Base64 utilities with better encoding
export const safeBase64Encode = (str: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    console.error('Base64 encode error:', error);
    throw new Error('Failed to encode string');
  }
};

export const safeBase64Decode = (str: string): string => {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (error) {
    console.error('Base64 decode error:', error);
    throw new Error('Failed to decode string');
  }
};

export const isValidBase64 = (str: string): boolean => {
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(str) && str.length % 4 === 0;
};
