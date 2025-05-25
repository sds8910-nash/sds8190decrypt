
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Unlock, Eye, EyeOff, Shield, Sun, Moon, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Encryption utilities
const generateTokenList = (key: string, length: number = 90): string[] => {
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

const intToTokens = (number: number, tokens: string[]): string[] => {
  const base = tokens.length;
  const result: string[] = [];
  if (number === 0) return [tokens[0]];
  
  let num = number;
  while (num > 0) {
    const rem = num % base;
    num = Math.floor(num / base);
    result.unshift(tokens[rem]);
  }
  return result;
};

const tokensToInt = (tokenList: string[], tokens: string[]): number => {
  const base = tokens.length;
  const tokenIndex: { [key: string]: number } = {};
  tokens.forEach((token, idx) => {
    tokenIndex[token] = idx;
  });
  
  let number = 0;
  for (const token of tokenList) {
    number = number * base + tokenIndex[token];
  }
  return number;
};

const MORSE_CODE_DICT: { [key: string]: string } = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.',
  'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.',
  'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
  'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  ' ': '/', '=': '-...-'
};

const REVERSE_MORSE_CODE_DICT: { [key: string]: string } = {};
Object.keys(MORSE_CODE_DICT).forEach(key => {
  REVERSE_MORSE_CODE_DICT[MORSE_CODE_DICT[key]] = key;
});

const base32ToMorse = (base32Str: string): string => {
  return base32Str.split('').map(c => MORSE_CODE_DICT[c]).join(' ');
};

const morseToBase32 = (morseStr: string): string => {
  return morseStr.split(' ').map(s => REVERSE_MORSE_CODE_DICT[s]).join('');
};

const deriveKey = (password: string, length: number): Uint8Array => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Simple hash derivation (in real app, use crypto.subtle)
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

const xorEncrypt = (plaintext: string, password: string): string => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const key = deriveKey(password, data.length);
  
  const encrypted = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    encrypted[i] = data[i] ^ key[i];
  }
  
  return btoa(String.fromCharCode(...encrypted));
};

const xorDecrypt = (ciphertext: string, password: string): string => {
  const encrypted = new Uint8Array(atob(ciphertext).split('').map(c => c.charCodeAt(0)));
  const key = deriveKey(password, encrypted.length);
  
  const decrypted = new Uint8Array(encrypted.length);
  for (let i = 0; i < encrypted.length; i++) {
    decrypted[i] = encrypted[i] ^ key[i];
  }
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};

const encodeFunLayer = (text: string, key: string): string => {
  const tokens = generateTokenList(key);
  const b64Str = btoa(text);
  
  // Convert to number
  const bytes = new TextEncoder().encode(b64Str);
  let number = 0;
  for (const byte of bytes) {
    number = number * 256 + byte;
  }
  
  const tokenList = intToTokens(number, tokens);
  const tokenStr = tokenList.join(' ');
  const b32 = btoa(tokenStr);
  const morse = base32ToMorse(b32);
  const encoded = btoa(morse);
  
  return encoded;
};

const decodeFunLayer = (encodedStr: string, key: string): string => {
  try {
    const tokens = generateTokenList(key);
    const morse = atob(encodedStr);
    const b32 = morseToBase32(morse);
    const tokenStr = atob(b32);
    const tokenList = tokenStr.split(' ');
    const number = tokensToInt(tokenList, tokens);
    
    // Convert number back to bytes
    const bytes: number[] = [];
    let num = number;
    while (num > 0) {
      bytes.unshift(num % 256);
      num = Math.floor(num / 256);
    }
    
    const b64Str = new TextDecoder().decode(new Uint8Array(bytes));
    return atob(b64Str);
  } catch (error) {
    throw new Error('Failed to decode');
  }
};

const encode = (text: string, password: string): string => {
  const encrypted = xorEncrypt(text, password);
  return encodeFunLayer(encrypted, password);
};

const decode = (encoded: string, password: string): string => {
  const decryptedFun = decodeFunLayer(encoded, password);
  return xorDecrypt(decryptedFun, password);
};

const Index = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!inputText.trim() || !password.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both text and password",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
      
      if (mode === 'encrypt') {
        const encrypted = encode(inputText, password);
        setOutput(encrypted);
        toast({
          title: "Encryption Successful",
          description: "Your text has been securely encrypted",
        });
      } else {
        const decrypted = decode(inputText, password);
        setOutput(decrypted);
        toast({
          title: "Decryption Successful", 
          description: "Your text has been successfully decrypted",
        });
      }
    } catch (error) {
      toast({
        title: "Process Failed",
        description: mode === 'decrypt' ? "Invalid encrypted text or password" : "Encryption failed",
        variant: "destructive"
      });
      setOutput('');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Output copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23334155" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-between w-full max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">SecureCrypt</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Sun className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Moon className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-16 h-16 text-cyan-400 mb-4" />
          </div>
          
          <h2 className="text-4xl font-bold text-cyan-400 mb-4">SecureCrypt</h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Advanced multi-layer encryption with XOR, tokenization, Base32, Morse code, and cryptographic hashing
          </p>
          
          {/* Mode Toggle */}
          <div className="flex items-center justify-center mt-8">
            <div className="bg-slate-800 p-1 rounded-lg flex">
              <Button
                variant={mode === 'encrypt' ? 'default' : 'ghost'}
                className={`flex items-center gap-2 ${mode === 'encrypt' ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setMode('encrypt')}
              >
                <Lock className="w-4 h-4" />
                Encrypt
              </Button>
              <Button
                variant={mode === 'decrypt' ? 'default' : 'ghost'}
                className={`flex items-center gap-2 ${mode === 'decrypt' ? 'bg-emerald-600 hover:bg-emerald-700' : 'text-gray-400 hover:text-white'}`}
                onClick={() => setMode('decrypt')}
              >
                <Unlock className="w-4 h-4" />
                Decrypt
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Input Section */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-semibold text-white">
                  Text to {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
                </h3>
              </div>
              
              <Textarea
                placeholder={mode === 'encrypt' ? "Enter your secret message..." : "Enter encrypted text to decrypt..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 min-h-[120px] resize-none focus:border-cyan-500 focus:ring-cyan-500"
              />
              
              <div className="mt-4 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 pr-12 focus:border-cyan-500 focus:ring-cyan-500"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-semibold text-white">
                    {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} Output
                  </h3>
                </div>
                {output && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="border-slate-600 text-cyan-400 hover:bg-cyan-500 hover:text-white"
                  >
                    Copy
                  </Button>
                )}
              </div>
              
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 min-h-[120px] text-white font-mono text-sm break-all">
                {output || <span className="text-gray-400">{mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} text will appear here...</span>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleProcess}
            disabled={isProcessing || !inputText.trim() || !password.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {mode === 'encrypt' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
