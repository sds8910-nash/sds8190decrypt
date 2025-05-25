
// Morse code utilities
export const MORSE_CODE_DICT: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
  'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
  'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '+': '.-.-.', '/': '-..-.', '=': '-...-', ' ': '/'
};

export const REVERSE_MORSE_CODE_DICT: { [key: string]: string } = {};
Object.keys(MORSE_CODE_DICT).forEach(key => {
  REVERSE_MORSE_CODE_DICT[MORSE_CODE_DICT[key]] = key;
});

export const textToMorse = (text: string): string => {
  console.log('Converting to morse:', text.substring(0, 50));
  
  // Clean text to only include valid base64 characters
  const cleanText = text.replace(/[^A-Za-z0-9+/=]/g, '');
  console.log('Cleaned text for morse:', cleanText.substring(0, 50));
  
  const result = cleanText.toUpperCase().split('').map(c => {
    const morse = MORSE_CODE_DICT[c];
    if (!morse) {
      console.warn('Missing morse code for character:', c, 'ASCII:', c.charCodeAt(0));
      return '';
    }
    return morse;
  }).filter(m => m).join(' ');
  
  console.log('Morse result:', result.substring(0, 100));
  return result;
};

export const morseToText = (morseStr: string): string => {
  console.log('Converting from morse:', morseStr.substring(0, 100));
  
  const result = morseStr.split(' ').map(s => {
    if (s === '') return '';
    const char = REVERSE_MORSE_CODE_DICT[s];
    if (!char) {
      console.warn('Missing character for morse code:', s);
      return '';
    }
    return char;
  }).join('');
  
  console.log('Text result:', result.substring(0, 50));
  return result;
};
