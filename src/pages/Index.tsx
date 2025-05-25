import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Unlock, Eye, EyeOff, Shield, Sun, Moon, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { encode, decode } from "@/utils/multiLayerEncryption";

const Index = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { theme, setTheme, actualTheme } = useTheme();

  // Clear input text when mode changes, but keep password
  useEffect(() => {
    console.log('Mode changed to:', mode);
    setInputText('');
    setOutput('');
  }, [mode]);

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
        console.log('Encrypting text:', inputText);
        const encrypted = encode(inputText, password);
        console.log('Encrypted result:', encrypted);
        setOutput(encrypted);
        toast({
          title: "Encryption Successful",
          description: "Your text has been securely encrypted",
        });
      } else {
        console.log('Decrypting text:', inputText);
        const decrypted = decode(inputText, password);
        console.log('Decrypted result:', decrypted);
        setOutput(decrypted);
        toast({
          title: "Decryption Successful", 
          description: "Your text has been successfully decrypted",
        });
      }
    } catch (error) {
      console.error('Process error:', error);
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

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5" />;
    if (theme === 'dark') return <Moon className="w-5 h-5" />;
    return actualTheme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 via-blue-900 to-slate-900 dark:from-slate-900 dark:via-purple-900/20 dark:via-blue-900 dark:to-slate-900 light:from-slate-50 light:via-blue-50 light:to-purple-50 relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      {/* Glass orb effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-between w-full max-w-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg transform transition-transform duration-300 hover:scale-110">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">SecureCrypt</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 transition-all duration-300 hover:scale-110"
                  onClick={toggleTheme}
                  title={`Current theme: ${theme}`}
                >
                  {getThemeIcon()}
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 transition-all duration-300 hover:scale-110">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <Shield className="w-16 h-16 text-cyan-400 mb-4 animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            SecureCrypt
          </h2>
          <p className="text-gray-300 dark:text-gray-300 light:text-slate-600 text-lg max-w-2xl mx-auto">
            Advanced multi-layer encryption with XOR, tokenization, Base64, Morse code, and cryptographic hashing
          </p>
          
          {/* Mode Toggle */}
          <div className="flex items-center justify-center mt-8">
            <div className="bg-slate-800/60 dark:bg-slate-800/60 light:bg-white/60 backdrop-blur-xl p-1 rounded-lg flex border border-slate-700/50 dark:border-slate-700/50 light:border-slate-300/50 shadow-2xl">
              <Button
                variant={mode === 'encrypt' ? 'default' : 'ghost'}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  mode === 'encrypt' 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-lg transform scale-105' 
                    : 'text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 hover:bg-slate-700/50 dark:hover:bg-slate-700/50 light:hover:bg-slate-200/50'
                }`}
                onClick={() => setMode('encrypt')}
              >
                <Lock className="w-4 h-4" />
                Encrypt
              </Button>
              <Button
                variant={mode === 'decrypt' ? 'default' : 'ghost'}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  mode === 'decrypt' 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-lg transform scale-105' 
                    : 'text-gray-400 hover:text-white dark:text-gray-400 dark:hover:text-white light:text-slate-600 light:hover:text-slate-900 hover:bg-slate-700/50 dark:hover:bg-slate-700/50 light:hover:bg-slate-200/50'
                }`}
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
          <Card className="bg-slate-800/40 dark:bg-slate-800/40 light:bg-white/60 backdrop-blur-xl border-slate-700/50 dark:border-slate-700/50 light:border-slate-300/50 shadow-2xl transform transition-all duration-500 hover:shadow-cyan-500/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h3 className="text-xl font-semibold text-white dark:text-white light:text-slate-900">
                  Text to {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
                </h3>
              </div>
              
              <Textarea
                key={mode} // Force re-render with animation when mode changes
                placeholder={mode === 'encrypt' ? "Enter your secret message..." : "Enter encrypted text to decrypt..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="bg-slate-700/40 dark:bg-slate-700/40 light:bg-slate-100/60 backdrop-blur-sm border-slate-600/50 dark:border-slate-600/50 light:border-slate-300/50 text-white dark:text-white light:text-slate-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-slate-500 min-h-[120px] resize-none focus:border-cyan-500 focus:ring-cyan-500/50 transition-all duration-300 animate-fade-in"
              />
              
              <div className="mt-4 relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700/40 dark:bg-slate-700/40 light:bg-slate-100/60 backdrop-blur-sm border-slate-600/50 dark:border-slate-600/50 light:border-slate-300/50 text-white dark:text-white light:text-slate-900 placeholder-gray-400 dark:placeholder-gray-400 light:placeholder-slate-500 pr-12 focus:border-cyan-500 focus:ring-cyan-500/50 transition-all duration-300"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 h-8 w-8 transition-all duration-300 hover:scale-110"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="bg-slate-800/40 dark:bg-slate-800/40 light:bg-white/60 backdrop-blur-xl border-slate-700/50 dark:border-slate-700/50 light:border-slate-300/50 shadow-2xl transform transition-all duration-500 hover:shadow-purple-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-xl font-semibold text-white dark:text-white light:text-slate-900">
                    {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} Output
                  </h3>
                </div>
                {output && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="border-slate-600/50 dark:border-slate-600/50 light:border-slate-300/50 bg-slate-700/40 dark:bg-slate-700/40 light:bg-slate-100/60 backdrop-blur-sm text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    Copy
                  </Button>
                )}
              </div>
              
              <div className="bg-slate-700/40 dark:bg-slate-700/40 light:bg-slate-100/60 backdrop-blur-sm border border-slate-600/50 dark:border-slate-600/50 light:border-slate-300/50 rounded-lg p-4 min-h-[120px] text-white dark:text-white light:text-slate-900 font-mono text-sm break-all transition-all duration-300">
                {output || <span className="text-gray-400 dark:text-gray-400 light:text-slate-500">{mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} text will appear here...</span>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleProcess}
            disabled={isProcessing || !inputText.trim() || !password.trim()}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
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
