
// Character substitution cipher
export const createSubstitutionKey = (password: string): { [key: string]: string } => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  const shuffled = chars.split('');
  
  // Simple shuffle based on password
  let seed = 0;
  for (let i = 0; i < password.length; i++) {
    seed += password.charCodeAt(i);
  }
  
  // Fisher-Yates shuffle with deterministic seed
  for (let i = shuffled.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = seed % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  const substitutionMap: { [key: string]: string } = {};
  for (let i = 0; i < chars.length; i++) {
    substitutionMap[chars[i]] = shuffled[i];
  }
  
  return substitutionMap;
};

export const createReverseSubstitutionKey = (substitutionMap: { [key: string]: string }): { [key: string]: string } => {
  const reverseMap: { [key: string]: string } = {};
  for (const [original, substituted] of Object.entries(substitutionMap)) {
    reverseMap[substituted] = original;
  }
  return reverseMap;
};

export const applySubstitution = (text: string, substitutionMap: { [key: string]: string }): string => {
  return text.split('').map(char => substitutionMap[char] || char).join('');
};
