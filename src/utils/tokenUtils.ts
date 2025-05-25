
// Token generation and conversion utilities
export const generateTokenList = (key: string, length: number = 90): string[] => {
  const tokens: string[] = [];
  const base = key.toLowerCase();
  let i = 0;
  while (tokens.length < length) {
    const token = base[i % base.length] + String(Math.floor(i / base.length) + 1);
    tokens.push(token);
    i++;
  }
  return tokens;
};

export const stringToTokens = (text: string, tokens: string[]): string => {
  console.log('Converting string to tokens:', text.substring(0, 50));
  
  // Convert string to bytes
  const bytes = new TextEncoder().encode(text);
  console.log('String as bytes:', bytes.slice(0, 10));
  
  // Convert bytes to big number
  let number = BigInt(0);
  for (const byte of bytes) {
    number = number * BigInt(256) + BigInt(byte);
  }
  console.log('Number representation:', number.toString().substring(0, 50));
  
  // Convert number to tokens
  const tokenList: string[] = [];
  const base = BigInt(tokens.length);
  let num = number;
  
  if (num === BigInt(0)) {
    tokenList.push(tokens[0]);
  } else {
    while (num > BigInt(0)) {
      const remainder = Number(num % base);
      tokenList.unshift(tokens[remainder]);
      num = num / base;
    }
  }
  
  const result = tokenList.join(' ');
  console.log('Token string result:', result.substring(0, 100));
  return result;
};

export const tokensToString = (tokenString: string, tokens: string[]): string => {
  console.log('Converting tokens to string:', tokenString.substring(0, 100));
  
  const tokenList = tokenString.split(' ').filter(t => t.trim());
  console.log('Token list length:', tokenList.length);
  console.log('First few tokens:', tokenList.slice(0, 5));
  
  if (tokenList.length === 0) {
    throw new Error('No valid tokens found');
  }
  
  // Create token index
  const tokenIndex: { [key: string]: number } = {};
  tokens.forEach((token, idx) => {
    tokenIndex[token] = idx;
  });
  
  // Convert tokens back to number
  const base = BigInt(tokens.length);
  let number = BigInt(0);
  
  for (const token of tokenList) {
    const index = tokenIndex[token];
    if (index === undefined) {
      console.error('Invalid token found:', token);
      throw new Error(`Invalid token: ${token}`);
    }
    number = number * base + BigInt(index);
  }
  
  console.log('Converted number:', number.toString().substring(0, 50));
  
  // Convert number back to bytes
  const bytes: number[] = [];
  let num = number;
  if (num === BigInt(0)) {
    bytes.push(0);
  } else {
    while (num > BigInt(0)) {
      bytes.unshift(Number(num % BigInt(256)));
      num = num / BigInt(256);
    }
  }
  
  console.log('Converted bytes:', bytes.slice(0, 10));
  
  // Convert bytes back to string
  const result = new TextDecoder().decode(new Uint8Array(bytes));
  console.log('Final string result:', result.substring(0, 50));
  return result;
};
