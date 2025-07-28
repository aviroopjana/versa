"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import VersaLogo from "../components/VersaLogo";
import PDFUpload from "../components/PDFUpload";
import ExtractedTextDisplay from "../components/ExtractedTextDisplay";
import AITransformation from "../components/AITransformation";
import SettingsPanel from "../components/SettingsPanel";

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/auth/signin?callbackUrl=/dashboard");
    },
  });
  const router = useRouter();
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setExtractedData(result.data);
      } else {
        alert(result.error || 'Failed to process PDF');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setExtractedData(null);
    setAiResults(null);
  };

  const handleAIResult = (result: any) => {
    setAiResults(result);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{
              rotate: [0, 360],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <VersaLogo size="xl" />
          </motion.div>
          <p className="mt-4 text-[#0f0f0f]/60 font-playfair italic">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#fdfdfd] via-[#f3f3f3]/70 to-[#eaeaea]">
      {/* Header/Navigation */}
      <header className="border-b border-[#dcdcdc]/30 bg-white/75 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <VersaLogo size="md" animated={false} />
          
          <div className="flex items-center space-x-6">
            {/* AI Settings Button */}
            <motion.button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:border-[#b8a1ff] hover:bg-[#b8a1ff]/5 transition-all duration-300 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-4 h-4 text-gray-600 group-hover:text-[#b8a1ff] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#b8a1ff] transition-colors">AI Settings</span>
            </motion.button>

            <div className="relative group">
              <button className="flex items-center space-x-2 text-sm text-[#0f0f0f] font-medium hover:text-[#b8a1ff] transition-colors">
                <img 
                  src={session.user?.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(session.user?.name || "User")} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
                <span>{session.user?.name}</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                <a 
                  href="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </a>
                <a 
                  href="/api/auth/signout?callbackUrl=/"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 px-6 max-w-7xl mx-auto">
        <div className="py-12">
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-playfair text-4xl font-bold text-[#0f0f0f]">Welcome, {session.user?.name}!</h1>
            <p className="font-playfair italic text-[#0f0f0f]/70 mt-2">Your legal transformations await</p>
          </motion.div>

          {/* PDF Upload Section */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {!extractedData ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-playfair text-2xl font-bold text-[#0f0f0f] mb-6">Upload Legal Document</h2>
                <PDFUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
              </div>
            ) : (
              <ExtractedTextDisplay data={extractedData} onReset={handleReset} />
            )}
          </motion.div>

          {/* AI Transformation Section */}
          {extractedData && (
            <motion.div 
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-white rounded-xl shadow-md p-6">
                <AITransformation 
                  extractedText={extractedData.text} 
                  onResult={handleAIResult}
                />
              </div>
            </motion.div>
          )}

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* New Translation Card */}
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/60 p-6 hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-[#00ffe0]/20 to-[#b8a1ff]/20 mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-playfair text-xl font-semibold text-[#0f0f0f] mb-2">New Translation</h3>
              <p className="text-[#0f0f0f]/70 mb-4 font-playfair">Start a new legal language transformation</p>
              <button className="mt-2 px-4 py-2 bg-gradient-to-r from-[#00ffe0]/80 to-[#b8a1ff]/80 text-[#0f0f0f] font-medium text-sm rounded-md transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-[0_5px_15px_rgba(0,255,224,0.2)]">
                Create New
              </button>
            </motion.div>

            {/* Recent Projects Card */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/60 p-6"
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-[#00ffe0]/20 to-[#b8a1ff]/20 mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="font-playfair text-xl font-semibold text-[#0f0f0f] mb-2">Recent Projects</h3>
              <p className="text-[#0f0f0f]/70 mb-4 font-playfair">Access your recent transformations</p>
              <p className="text-sm text-[#0f0f0f]/50 italic">No recent projects</p>
            </motion.div>

            {/* AI Settings Card */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/60 p-6"
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-[#00ffe0]/20 to-[#b8a1ff]/20 mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-playfair text-xl font-semibold text-[#0f0f0f] mb-2">AI Settings</h3>
              <p className="text-[#0f0f0f]/70 mb-4 font-playfair">Configure AI models and API keys</p>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="mt-2 px-4 py-2 bg-white border border-[#dcdcdc]/50 text-[#0f0f0f] font-medium text-sm rounded-md transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-md hover:border-gray-400"
              >
                Open Settings
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
