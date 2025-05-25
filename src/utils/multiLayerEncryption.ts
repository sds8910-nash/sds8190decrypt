
import { xorEncrypt, xorDecrypt } from './encryptionUtils';
import { generateTokenList, stringToTokens, tokensToString } from './tokenUtils';
import { textToMorse, morseToText } from './morseUtils';

export const encode = (text: string, password: string): string => {
  console.log('Starting encode with text:', text);
  
  try {
    // Step 1: XOR encrypt the text
    const encrypted = xorEncrypt(text, password);
    console.log('XOR encrypted:', encrypted.substring(0, 50));
    
    // Step 2: Generate tokens for this password
    const tokens = generateTokenList(password);
    console.log('Generated tokens:', tokens.slice(0, 10));
    
    // Step 3: Convert encrypted text to base64 first
    const b64Encrypted = btoa(encrypted);
    console.log('Base64 encrypted:', b64Encrypted.substring(0, 50));
    
    // Step 4: Convert to token representation
    const tokenString = stringToTokens(b64Encrypted, tokens);
    console.log('Token string:', tokenString.substring(0, 100));
    
    // Step 5: Encode token string as base64
    const tokenB64 = btoa(tokenString);
    console.log('Token base64:', tokenB64.substring(0, 50));
    
    // Step 6: Convert to morse code
    const morse = textToMorse(tokenB64);
    console.log('Morse code:', morse.substring(0, 100));
    
    // Step 7: Final base64 encoding
    const finalEncoded = btoa(morse);
    console.log('Final encoded:', finalEncoded.substring(0, 50));
    
    return finalEncoded;
  } catch (error) {
    console.error('Encode error:', error);
    throw new Error('Encoding failed: ' + (error as Error).message);
  }
};

export const decode = (encodedStr: string, password: string): string => {
  console.log('Starting decode with:', encodedStr.substring(0, 50));
  
  try {
    // Step 1: Decode from base64 to get morse
    const morse = atob(encodedStr);
    console.log('Decoded morse:', morse.substring(0, 100));
    
    // Step 2: Convert morse back to text (which should be base64)
    const tokenB64 = morseToText(morse);
    console.log('Converted morse to text:', tokenB64.substring(0, 50));
    
    if (!tokenB64) {
      throw new Error('Failed to convert morse to text');
    }
    
    // Validate base64 format
    const validB64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    if (!validB64Regex.test(tokenB64)) {
      console.error('Invalid base64 characters detected:', tokenB64.substring(0, 50));
      throw new Error('Invalid base64 format after morse conversion');
    }
    
    // Step 3: Decode base64 to get token string
    const tokenString = atob(tokenB64);
    console.log('Decoded token string:', tokenString.substring(0, 100));
    
    // Step 4: Generate tokens for this password
    const tokens = generateTokenList(password);
    console.log('Generated tokens for decode:', tokens.slice(0, 10));
    
    // Step 5: Convert tokens back to string
    const b64Encrypted = tokensToString(tokenString, tokens);
    console.log('Converted back to base64:', b64Encrypted.substring(0, 50));
    
    // Step 6: Decode from base64
    const encrypted = atob(b64Encrypted);
    console.log('Decoded from base64:', encrypted.substring(0, 50));
    
    // Step 7: XOR decrypt to get original text
    const decrypted = xorDecrypt(encrypted, password);
    console.log('Final decrypted result:', decrypted);
    
    return decrypted;
  } catch (error) {
    console.error('Decode error details:', error);
    throw new Error('Failed to decode: ' + (error as Error).message);
  }
};
