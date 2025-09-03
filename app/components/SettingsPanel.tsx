"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import APIKeyManager from "./APIKeyManager";
import ModelSelector from "./ModelSelector";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState('model');
  const [showAPIKeyManager, setShowAPIKeyManager] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [settings, setSettings] = useState({
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1.0,
  });

  useEffect(() => {
    if (isOpen) {
      loadUserSettings();
      loadAvailableProviders();
    }
  }, [isOpen]);

  const loadUserSettings = async () => {
    try {
      const response = await fetch('/api/user/settings');
      if (response.ok) {
        const userSettings = await response.json();
        setSelectedModel(userSettings.selectedModel || '');
        setSettings({
          temperature: userSettings.temperature || 0.7,
          maxTokens: userSettings.maxTokens || 2000,
          topP: userSettings.topP || 1.0,
        });
      }
    } catch (error) {
      console.error('Failed to load user settings:', error);
    }
  };

  const loadAvailableProviders = async () => {
    try {
      const response = await fetch('/api/user/api-keys');
      if (response.ok) {
        const keys = await response.json();
        const activeProviders = keys
          .filter((key: any) => key.isActive)
          .map((key: any) => key.provider as string);
        setAvailableProviders([...new Set(activeProviders)] as string[]);
      }
    } catch (error) {
      console.error('Failed to load available providers:', error);
    }
  };

  const handleModelSelect = async (modelId: string) => {
    setSelectedModel(modelId);
    await saveSettings({ selectedModel: modelId });
  };

  const handleSettingChange = async (key: string, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const saveSettings = async (newSettings: any) => {
    try {
      await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const tabs = [
    { id: 'model', name: 'Model', icon: '🤖' },
    { id: 'parameters', name: 'Parameters', icon: '⚙️' },
    { id: 'keys', name: 'API Keys', icon: '🔐' },
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="bg-white rounded-xl shadow-2xl border border-white/60 w-full max-w-4xl max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-playfair text-2xl font-bold text-[#0f0f0f]">AI Settings</h2>
                    <p className="text-[#0f0f0f]/70 mt-1">Configure your AI models and parameters</p>
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

                {/* Tabs */}
                <div className="flex space-x-1 mt-6 bg-gray-100 rounded-lg p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-[#0f0f0f] shadow-sm'
                          : 'text-gray-600 hover:text-[#0f0f0f]'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
                {/* Model Selection Tab */}
                {activeTab === 'model' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                    style={{ overflow: 'visible' }}
                  >
                    <div>
                      <h3 className="font-medium text-[#0f0f0f] mb-3">Select AI Model</h3>
                      <ModelSelector
                        selectedModel={selectedModel}
                        onModelSelect={handleModelSelect}
                        availableProviders={availableProviders}
                      />
                    </div>

                    {availableProviders.length === 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <h4 className="font-medium text-amber-800">No API Keys Configured</h4>
                            <p className="text-amber-700 text-sm mt-1">
                              Add API keys in the "API Keys" tab to access AI models.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Parameters Tab */}
                {activeTab === 'parameters' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="font-medium text-[#0f0f0f] mb-4">Generation Parameters</h3>
                      
                      <div className="space-y-6">
                        {/* Temperature */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Temperature</label>
                            <span className="text-sm text-gray-500">{settings.temperature}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={settings.temperature}
                            onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Focused (0)</span>
                            <span>Balanced (1)</span>
                            <span>Creative (2)</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Controls randomness. Lower values for focused, deterministic outputs. Higher for creative, varied responses.
                          </p>
                        </div>

                        {/* Max Tokens */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Max Tokens</label>
                            <span className="text-sm text-gray-500">{settings.maxTokens}</span>
                          </div>
                          <input
                            type="range"
                            min="100"
                            max="4000"
                            step="100"
                            value={settings.maxTokens}
                            onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Short (100)</span>
                            <span>Medium (2000)</span>
                            <span>Long (4000)</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Maximum length of the AI response. Longer outputs cost more tokens.
                          </p>
                        </div>

                        {/* Top P */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Top P</label>
                            <span className="text-sm text-gray-500">{settings.topP}</span>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.1"
                            value={settings.topP}
                            onChange={(e) => handleSettingChange('topP', parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Focused (0.1)</span>
                            <span>Balanced (0.5)</span>
                            <span>Diverse (1.0)</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">
                            Controls diversity via nucleus sampling. Lower values focus on likely tokens.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* API Keys Tab */}
                {activeTab === 'keys' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-[#b8a1ff]/10 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#b8a1ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-[#0f0f0f] mb-2">Manage API Keys</h3>
                      <p className="text-gray-600 text-sm mb-6">
                        Add and manage your AI provider API keys to access different models.
                      </p>
                      <button
                        onClick={() => setShowAPIKeyManager(true)}
                        className="px-6 py-3 bg-[#b8a1ff] text-white rounded-lg hover:bg-[#a889ff] transition-colors font-medium"
                      >
                        Open API Key Manager
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Key Manager Modal */}
      {showAPIKeyManager && (
        <APIKeyManager 
          onClose={() => {
            setShowAPIKeyManager(false);
            loadAvailableProviders(); // Refresh available providers
          }} 
        />
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #b8a1ff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #b8a1ff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
}
