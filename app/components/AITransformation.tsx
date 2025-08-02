"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransformationOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'creative' | 'legal' | 'educational' | 'analytical';
  color: string;
}

const transformationOptions: TransformationOption[] = [
  {
    id: 'poetry',
    name: 'Transform to Poetry',
    description: 'Convert legal text into beautiful, artistic poetry that captures the essence',
    icon: '🎭',
    category: 'creative',
    color: 'from-pink-500 to-purple-600'
  },
  {
    id: 'haiku',
    name: 'Create Haiku',
    description: 'Distill complex legal concepts into elegant 5-7-5 syllable haiku',
    icon: '🌸',
    category: 'creative',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'eli5',
    name: 'Explain Like I\'m 5',
    description: 'Break down legal jargon into simple, easy-to-understand language',
    icon: '🧒',
    category: 'educational',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'summary',
    name: 'Professional Summary',
    description: 'Create a comprehensive legal analysis and summary',
    icon: '📋',
    category: 'legal',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'risks',
    name: 'Risk Analysis',
    description: 'Identify potential legal risks, liabilities, and concerning clauses',
    icon: '⚠️',
    category: 'legal',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'json',
    name: 'Structured Data',
    description: 'Extract key information into clean, organized JSON format',
    icon: '🔧',
    category: 'analytical',
    color: 'from-gray-500 to-slate-600'
  }
];

interface AITransformationProps {
  extractedText: string;
  onResult: (result: any) => void;
}

export default function AITransformation({ extractedText, onResult }: AITransformationProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTransformation, setSelectedTransformation] = useState<string>('');
  const [results, setResults] = useState<Record<string, any>>({});
  const [activeResult, setActiveResult] = useState<string>('');

  const handleTransform = async (transformationType: string) => {
    if (!extractedText.trim()) {
      alert('No text available for transformation');
      return;
    }

    setIsProcessing(true);
    setSelectedTransformation(transformationType);

    try {
      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: extractedText,
          transformationType: transformationType,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setResults(prev => ({
          ...prev,
          [transformationType]: result.data
        }));
        setActiveResult(transformationType);
        onResult(result.data);
      } else {
        alert(result.error || 'Transformation failed');
      }
    } catch (error) {
      console.error('Transformation error:', error);
      alert('Failed to process text. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedTransformation('');
    }
  };

  const formatResult = (result: string, type: string) => {
    if (type === 'json') {
      try {
        const parsed = JSON.parse(result);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return result;
      }
    }
    return result;
  };

  const categoryInfo = {
    creative: { name: 'Creative Transformations', description: 'Artistic and poetic interpretations' },
    legal: { name: 'Legal Analysis', description: 'Professional legal insights' },
    educational: { name: 'Educational', description: 'Simplified explanations' },
    analytical: { name: 'Data & Analysis', description: 'Structured information extraction' }
  };

  const groupedOptions = transformationOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, TransformationOption[]>);

  if (!extractedText) {
    return (
      <div className="text-center py-12 text-gray-500">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium font-playfair">Upload a PDF to start transforming</p>
          <p className="text-sm mt-1">Extract text from your legal document first</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-playfair text-3xl font-bold text-[#0f0f0f] mb-3">AI Transformations</h2>
        <p className="text-[#0f0f0f]/70 text-lg">Transform your legal document with AI creativity and precision</p>
      </div>

      {/* Transformation Options */}
      <div className="space-y-8">
        {Object.entries(groupedOptions).map(([category, options]) => (
          <div key={category} className="space-y-4">
            <div className="text-center">
              <h3 className="font-playfair text-xl font-semibold text-[#0f0f0f] mb-1">
                {categoryInfo[category as keyof typeof categoryInfo].name}
              </h3>
              <p className="text-sm text-[#0f0f0f]/60">
                {categoryInfo[category as keyof typeof categoryInfo].description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  onClick={() => handleTransform(option.id)}
                  disabled={isProcessing}
                  className={`relative p-6 text-left rounded-xl border-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group ${
                    results[option.id] ? 'border-[#b8a1ff] bg-[#b8a1ff]/5' : 'border-gray-200 hover:border-[#b8a1ff] hover:bg-[#b8a1ff]/5'
                  }`}
                  whileHover={{ scale: isProcessing ? 1 : 1.02, y: -2 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />
                  
                  <div className="relative">
                    {/* Icon and Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-3xl">{option.icon}</div>
                      {isProcessing && selectedTransformation === option.id && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6"
                        >
                          <svg className="w-full h-full text-[#b8a1ff]" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                        </motion.div>
                      )}
                      {results[option.id] && !isProcessing && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full"
                        >
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </div>

                    {/* Content */}
                    <h4 className="font-playfair text-lg font-semibold text-[#0f0f0f] mb-2">{option.name}</h4>
                    <p className="text-sm text-[#0f0f0f]/70 leading-relaxed">{option.description}</p>

                    {/* Processing indicator */}
                    {isProcessing && selectedTransformation === option.id && (
                      <div className="mt-3 text-xs text-[#b8a1ff] font-medium">
                        AI is working on this...
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Results Display */}
      <AnimatePresence>
        {Object.keys(results).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h3 className="font-playfair text-2xl font-bold text-[#0f0f0f] mb-2">Your Transformations</h3>
              <p className="text-[#0f0f0f]/70">Click on any transformation to view the results</p>
            </div>
            
            {/* Results Tabs */}
            <div className="flex flex-wrap justify-center gap-3">
              {Object.keys(results).map((transformationType) => {
                const option = transformationOptions.find(opt => opt.id === transformationType);
                return (
                  <motion.button
                    key={transformationType}
                    onClick={() => setActiveResult(transformationType)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeResult === transformationType
                        ? 'bg-[#b8a1ff] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{option?.icon}</span>
                    <span>{option?.name}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Active Result */}
            {activeResult && results[activeResult] && (
              <motion.div
                key={activeResult}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-playfair text-xl font-semibold text-[#0f0f0f]">
                      {transformationOptions.find(opt => opt.id === activeResult)?.name} Result
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Generated by {results[activeResult].model} • {results[activeResult].provider}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => navigator.clipboard.writeText(results[activeResult].result)}
                    className="flex items-center space-x-2 px-3 py-2 text-gray-500 hover:text-[#b8a1ff] hover:bg-[#b8a1ff]/5 rounded-lg transition-all"
                    title="Copy to clipboard"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Copy</span>
                  </motion.button>
                </div>
                
                <div className={`p-4 bg-gray-50 rounded-lg border ${activeResult === 'json' ? 'font-mono text-sm' : 'font-playfair leading-relaxed'} whitespace-pre-wrap text-[#0f0f0f]`}>
                  {formatResult(results[activeResult].result, activeResult)}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

