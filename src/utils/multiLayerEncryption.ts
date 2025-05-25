
import { xorEncrypt, xorDecrypt, simpleHash } from './encryptionUtils';
import { safeBase64Encode, safeBase64Decode } from './base64Utils';
import { createSubstitutionKey, createReverseSubstitutionKey, applySubstitution } from './substituionCipher';
import { hexToMorse, morseToHex } from './morseUtils';
import { stringToHex, hexToString } from './hexUtils';

export const encode = (text: string, password: string): string => {
  console.log('Starting encode with text:', text);
  
  try {
    // Step 1: XOR encrypt the text
    const encrypted = xorEncrypt(text, password);
    console.log('XOR encrypted (hex):', encrypted.substring(0, 50));
    
    // Step 2: Convert to base64 for easier handling
    const b64Encrypted = safeBase64Encode(encrypted);
    console.log('Base64 encrypted:', b64Encrypted.substring(0, 50));
    
    // Step 3: Apply character substitution
    const substitutionKey = createSubstitutionKey(password);
    const substituted = applySubstitution(b64Encrypted, substitutionKey);
    console.log('Substituted:', substituted.substring(0, 50));
    
    // Step 4: Convert to hex for morse compatibility
    const hexString = stringToHex(substituted);
    console.log('Hex string:', hexString.substring(0, 50));
    
    // Step 5: Convert to morse
    const morse = hexToMorse(hexString);
    console.log('Morse code:', morse.substring(0, 100));
    
    // Step 6: Final base64 encoding
    const finalEncoded = safeBase64Encode(morse);
    console.log('Final encoded:', finalEncoded.substring(0, 50));
    
    // Step 7: Add hash for verification
    const hash = simpleHash(text + password);
    const result = finalEncoded + '.' + hash;
    console.log('Result with hash:', result.substring(0, 50));
    
    return result;
  } catch (error) {
    console.error('Encode error:', error);
    throw new Error('Encoding failed: ' + (error as Error).message);
  }
};

export const decode = (encodedStr: string, password: string): string => {
  console.log('Starting decode with:', encodedStr.substring(0, 50));
  
  try {
    // Step 1: Extract hash and data
    const parts = encodedStr.split('.');
    if (parts.length !== 2) {
      throw new Error('Invalid encoded format');
    }
    
    const [finalEncoded, expectedHash] = parts;
    console.log('Extracted encoded data:', finalEncoded.substring(0, 50));
    console.log('Expected hash:', expectedHash);
    
    // Step 2: Decode from base64 to get morse
    const morse = safeBase64Decode(finalEncoded);
    console.log('Decoded morse:', morse.substring(0, 100));
    
    // Step 3: Convert morse back to hex
    const hexString = morseToHex(morse);
    console.log('Converted to hex:', hexString.substring(0, 50));
    
    // Step 4: Convert hex back to string
    const substituted = hexToString(hexString);
    console.log('Hex to string:', substituted.substring(0, 50));
    
    // Step 5: Reverse character substitution
    const substitutionKey = createSubstitutionKey(password);
    const reverseKey = createReverseSubstitutionKey(substitutionKey);
    const b64Encrypted = applySubstitution(substituted, reverseKey);
    console.log('Reverse substituted:', b64Encrypted.substring(0, 50));
    
    // Step 6: Decode from base64
    const encrypted = safeBase64Decode(b64Encrypted);
    console.log('Base64 decoded:', encrypted.substring(0, 50));
    
    // Step 7: XOR decrypt to get original text
    const decrypted = xorDecrypt(encrypted, password);
    console.log('Final decrypted result:', decrypted);
    
    // Step 8: Verify hash
    const actualHash = simpleHash(decrypted + password);
    if (actualHash !== expectedHash) {
      throw new Error('Hash verification failed - incorrect password or corrupted data');
    }
    
    return decrypted;
  } catch (error) {
    console.error('Decode error details:', error);
    throw new Error('Failed to decode: ' + (error as Error).message);
  }
};
