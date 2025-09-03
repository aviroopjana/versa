"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface APIKey {
  id: string;
  name: string;
  provider: string;
  key: string;
  isActive: boolean;
  createdAt: Date;
}

const providers = [
  { id: 'openai', name: 'OpenAI', icon: '🤖' },
  { id: 'anthropic', name: 'Anthropic', icon: '🧠' },
  { id: 'google', name: 'Google AI', icon: '🔍' },
  { id: 'mistral', name: 'Mistral AI', icon: '🌪️' },
  { id: 'cohere', name: 'Cohere', icon: '✨' },
];

interface APIKeyManagerProps {
  onClose: () => void;
}

export default function APIKeyManager({ onClose }: APIKeyManagerProps) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [newKey, setNewKey] = useState({ name: '', provider: '', key: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testingKey, setTestingKey] = useState<string | null>(null);

  useEffect(() => {
    loadApiKeys();
  }, []);

  const testApiKey = async (keyId: string, provider: string) => {
    if (provider !== 'openai') {
      alert('Testing is currently only available for OpenAI keys');
      return;
    }

    setTestingKey(keyId);
    try {
      const apiKey = apiKeys.find(k => k.id === keyId);
      if (!apiKey) return;

      const response = await fetch('/api/test-openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.key }),
      });

      const result = await response.json();
      
      if (result.valid) {
        alert(`✅ API key is valid! Found ${result.modelsCount} models.`);
      } else {
        alert(`❌ API key is invalid: ${result.error}`);
      }
    } catch (error) {
      alert('❌ Failed to test API key');
    } finally {
      setTestingKey(null);
    }
  };

  const loadApiKeys = async () => {
    try {
      const response = await fetch('/api/user/api-keys');
      if (response.ok) {
        const keys = await response.json();
        setApiKeys(keys);
      }
    } catch (error) {
      console.error('Failed to load API keys:', error);
    }
  };

  const handleAddKey = async () => {
    if (!newKey.name || !newKey.provider || !newKey.key) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKey),
      });

      if (response.ok) {
        const addedKey = await response.json();
        setApiKeys([...apiKeys, addedKey]);
        setNewKey({ name: '', provider: '', key: '' });
        setIsAddingKey(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add API key');
        if (errorData.error?.includes('sign out and sign in')) {
          // Redirect to sign out if session is invalid
          setTimeout(() => {
            window.location.href = '/auth/signout';
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Failed to add API key:', error);
      setError('Failed to add API key. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setApiKeys(apiKeys.filter(key => key.id !== keyId));
      }
    } catch (error) {
      console.error('Failed to delete API key:', error);
    }
  };

  const handleToggleActive = async (keyId: string) => {
    try {
      const response = await fetch(`/api/user/api-keys/${keyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !apiKeys.find(k => k.id === keyId)?.isActive }),
      });

      if (response.ok) {
        setApiKeys(apiKeys.map(key => 
          key.id === keyId ? { ...key, isActive: !key.isActive } : key
        ));
      }
    } catch (error) {
      console.error('Failed to toggle API key:', error);
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-xl shadow-2xl border border-white/60 w-full max-w-2xl max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-[#0f0f0f]">API Keys</h2>
              <p className="text-[#0f0f0f]/70 mt-1">Manage your AI provider credentials</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Add New Key Button */}
          {!isAddingKey && (
            <motion.button
              onClick={() => setIsAddingKey(true)}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#b8a1ff] hover:bg-[#b8a1ff]/5 transition-all duration-300 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center space-x-2 text-gray-600 group-hover:text-[#b8a1ff]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-medium">Add New API Key</span>
              </div>
            </motion.button>
          )}

          {/* Add Key Form */}
          <AnimatePresence>
            {isAddingKey && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-[#0f0f0f] mb-4">Add New API Key</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={newKey.name}
                        onChange={(e) => setNewKey({ ...newKey, name: e.target.value })}
                        placeholder="e.g., My OpenAI Key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b8a1ff] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                      <select
                        value={newKey.provider}
                        onChange={(e) => setNewKey({ ...newKey, provider: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b8a1ff] focus:border-transparent"
                      >
                        <option value="">Select Provider</option>
                        {providers.map(provider => (
                          <option key={provider.id} value={provider.id}>
                            {provider.icon} {provider.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                      <input
                        type="password"
                        value={newKey.key}
                        onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                        placeholder="Enter your API key"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#b8a1ff] focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-red-800 text-sm font-medium">Error</p>
                          <p className="text-red-700 text-sm">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={handleAddKey}
                      disabled={isLoading || !newKey.name || !newKey.provider || !newKey.key}
                      className="px-4 py-2 bg-[#b8a1ff] text-white rounded-md hover:bg-[#a889ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? 'Adding...' : 'Add Key'}
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingKey(false);
                        setNewKey({ name: '', provider: '', key: '' });
                        setError(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* API Keys List */}
          <div className="space-y-3 mt-6">
            {apiKeys.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <p>No API keys configured</p>
                <p className="text-sm">Add your first API key to get started</p>
              </div>
            ) : (
              apiKeys.map((apiKey) => {
                const provider = providers.find(p => p.id === apiKey.provider);
                return (
                  <motion.div
                    key={apiKey.id}
                    className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{provider?.icon}</span>
                        <div>
                          <h4 className="font-medium text-[#0f0f0f]">{apiKey.name}</h4>
                          <p className="text-sm text-gray-500">{provider?.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{maskKey(apiKey.key)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {apiKey.provider === 'openai' && (
                          <button
                            onClick={() => testApiKey(apiKey.id, apiKey.provider)}
                            disabled={testingKey === apiKey.id}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 rounded transition-colors disabled:opacity-50"
                          >
                            {testingKey === apiKey.id ? 'Testing...' : 'Test'}
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleToggleActive(apiKey.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            apiKey.isActive 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {apiKey.isActive ? 'Active' : 'Inactive'}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteKey(apiKey.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
