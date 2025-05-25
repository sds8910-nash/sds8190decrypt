
// Simplified Morse code utilities for hex characters only
export const HEX_MORSE_DICT: { [key: string]: string } = {
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'a': '.-.-', 'b': '-...-', 'c': '-.-.-.', 'd': '-..--', 'e': '.-.', 'f': '..-.-'
};

export const REVERSE_HEX_MORSE_DICT: { [key: string]: string } = {};
Object.keys(HEX_MORSE_DICT).forEach(key => {
  REVERSE_HEX_MORSE_DICT[HEX_MORSE_DICT[key]] = key;
});

export const hexToMorse = (hex: string): string => {
  console.log('Converting hex to morse:', hex.substring(0, 50));
  
  const result = hex.split('').map(char => {
    const morse = HEX_MORSE_DICT[char];
    if (!morse) {
      console.error('Missing morse for hex character:', char);
      throw new Error(`Invalid hex character: ${char}`);
    }
    return morse;
  }).join(' ');
  
  console.log('Morse result:', result.substring(0, 100));
  return result;
};

export const morseToHex = (morse: string): string => {
  console.log('Converting morse to hex:', morse.substring(0, 100));
  
  const result = morse.split(' ').map(morseChar => {
    if (morseChar === '') return '';
    const char = REVERSE_HEX_MORSE_DICT[morseChar];
    if (!char) {
      console.error('Missing character for morse:', morseChar);
      throw new Error(`Invalid morse code: ${morseChar}`);
    }
    return char;
  }).join('');
  
  console.log('Hex result:', result.substring(0, 50));
  return result;
};
