"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LLMModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  contextLength: number;
  pricing: string;
}

const llmModels: LLMModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    description: 'Most capable multimodal model with enhanced reasoning',
    capabilities: ['Text', 'Images', 'Vision', 'Function Calling'],
    contextLength: 128000,
    pricing: '$5/$15 per 1M tokens',
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    description: 'Fast and capable model for complex tasks',
    capabilities: ['Text', 'Vision', 'Function Calling'],
    contextLength: 128000,
    pricing: '$10/$30 per 1M tokens',
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    description: 'Advanced reasoning with enhanced coding capabilities',
    capabilities: ['Text', 'Images', 'Analysis'],
    contextLength: 200000,
    pricing: '$3/$15 per 1M tokens',
  },
  {
    id: 'claude-3-haiku',
    name: 'Claude 3 Haiku',
    provider: 'anthropic',
    description: 'Fast and affordable for everyday tasks',
    capabilities: ['Text', 'Basic Analysis'],
    contextLength: 200000,
    pricing: '$0.25/$1.25 per 1M tokens',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'google',
    description: 'Long context understanding with multimodal capabilities',
    capabilities: ['Text', 'Images', 'Video', 'Audio'],
    contextLength: 2000000,
    pricing: '$3.50/$10.50 per 1M tokens',
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'mistral',
    description: 'High-performance model for complex reasoning',
    capabilities: ['Text', 'Function Calling'],
    contextLength: 32000,
    pricing: '$8/$24 per 1M tokens',
  },
  {
    id: 'command-r-plus',
    name: 'Command R+',
    provider: 'cohere',
    description: 'Advanced RAG capabilities and tool use',
    capabilities: ['Text', 'RAG', 'Tool Use'],
    contextLength: 128000,
    pricing: '$3/$15 per 1M tokens',
  },
];

const providerInfo = {
  openai: { name: 'OpenAI', icon: '🤖', color: 'from-green-500 to-emerald-600' },
  anthropic: { name: 'Anthropic', icon: '🧠', color: 'from-orange-500 to-red-600' },
  google: { name: 'Google AI', icon: '🔍', color: 'from-blue-500 to-indigo-600' },
  mistral: { name: 'Mistral AI', icon: '🌪️', color: 'from-purple-500 to-violet-600' },
  cohere: { name: 'Cohere', icon: '✨', color: 'from-pink-500 to-rose-600' },
};

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (modelId: string) => void;
  availableProviders: string[];
}

export default function ModelSelector({ selectedModel, onModelSelect, availableProviders }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const availableModels = llmModels.filter(model => 
    availableProviders.includes(model.provider)
  );

  const filteredModels = filter === 'all' 
    ? availableModels 
    : availableModels.filter(model => model.provider === filter);

  const selectedModelData = llmModels.find(model => model.id === selectedModel);
  const uniqueProviders = [...new Set(availableModels.map(model => model.provider))];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="relative">
      {/* Selected Model Display */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl hover:border-[#b8a1ff] transition-all duration-300 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${providerInfo[selectedModelData?.provider as keyof typeof providerInfo]?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center text-white text-lg`}>
              {providerInfo[selectedModelData?.provider as keyof typeof providerInfo]?.icon || '🤖'}
            </div>
            <div className="text-left">
              <h3 className="font-medium text-[#0f0f0f] group-hover:text-[#b8a1ff] transition-colors">
                {selectedModelData?.name || 'Select Model'}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedModelData?.provider ? providerInfo[selectedModelData.provider as keyof typeof providerInfo]?.name : 'No model selected'}
              </p>
            </div>
          </div>
          <motion.svg 
            className="w-5 h-5 text-gray-400"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </motion.button>

      {/* Model Selection Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Filter Tabs */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex space-x-2 overflow-x-auto">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === 'all' 
                      ? 'bg-[#b8a1ff] text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({availableModels.length})
                </button>
                {uniqueProviders.map(provider => {
                  const providerModels = availableModels.filter(m => m.provider === provider);
                  const info = providerInfo[provider as keyof typeof providerInfo];
                  return (
                    <button
                      key={provider}
                      onClick={() => setFilter(provider)}
                      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        filter === provider 
                          ? 'bg-[#b8a1ff] text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {info?.icon} {info?.name} ({providerModels.length})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Models List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredModels.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No models available</p>
                  <p className="text-sm">Add API keys to access models</p>
                </div>
              ) : (
                filteredModels.map((model) => {
                  const info = providerInfo[model.provider as keyof typeof providerInfo];
                  const isSelected = model.id === selectedModel;
                  
                  return (
                    <motion.button
                      key={model.id}
                      onClick={() => {
                        onModelSelect(model.id);
                        setIsOpen(false);
                      }}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-l-4 ${
                        isSelected 
                          ? 'border-[#b8a1ff] bg-[#b8a1ff]/5' 
                          : 'border-transparent'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${info?.color} flex items-center justify-center text-white text-lg flex-shrink-0`}>
                          {info?.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-[#0f0f0f] truncate">{model.name}</h4>
                            {isSelected && (
                              <svg className="w-5 h-5 text-[#b8a1ff] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                            {model.capabilities.slice(0, 3).map((capability) => (
                              <span 
                                key={capability}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                              >
                                {capability}
                              </span>
                            ))}
                            {model.capabilities.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{model.capabilities.length - 3}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatNumber(model.contextLength)} tokens</span>
                            <span>{model.pricing}</span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
