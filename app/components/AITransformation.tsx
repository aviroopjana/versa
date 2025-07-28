"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransformationTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  examples: string[];
}

interface AITransformationProps {
  extractedText: string;
  onResult: (result: any) => void;
}

export default function AITransformation({ extractedText, onResult }: AITransformationProps) {
  const [templates, setTemplates] = useState<TransformationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<Record<string, any>>({});
  const [activeResult, setActiveResult] = useState<string>('');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/ai/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  const handleTransform = async (templateId: string) => {
    if (!extractedText.trim()) {
      alert('No text available for transformation');
      return;
    }

    setIsProcessing(true);
    setSelectedTemplate(templateId);

    try {
      const response = await fetch('/api/ai/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: extractedText,
          transformationType: templateId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setResults(prev => ({
          ...prev,
          [templateId]: result.data
        }));
        setActiveResult(templateId);
        onResult(result.data);
      } else {
        alert(result.error || 'Transformation failed');
      }
    } catch (error) {
      console.error('Transformation error:', error);
      alert('Failed to process text. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedTemplate('');
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

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, TransformationTemplate[]>);

  if (!extractedText) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium">Upload a PDF to start transforming</p>
        <p className="text-sm mt-1">Extract text from your legal document first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Transformation Options */}
      <div className="space-y-4">
        <h2 className="font-playfair text-2xl font-bold text-[#0f0f0f]">AI Transformations</h2>
        <p className="text-[#0f0f0f]/70">Transform your extracted text using AI-powered tools</p>

        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <div key={category} className="space-y-3">
            <h3 className="font-medium text-lg text-[#0f0f0f] capitalize">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryTemplates.map((template) => (
                <motion.button
                  key={template.id}
                  onClick={() => handleTransform(template.id)}
                  disabled={isProcessing}
                  className={`p-4 text-left border rounded-lg hover:border-[#b8a1ff] hover:bg-[#b8a1ff]/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    results[template.id] ? 'border-[#b8a1ff] bg-[#b8a1ff]/5' : 'border-gray-200'
                  }`}
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.98 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-[#0f0f0f]">{template.name}</h4>
                    {isProcessing && selectedTemplate === template.id && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4"
                      >
                        <svg className="w-full h-full text-[#b8a1ff]" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                      </motion.div>
                    )}
                    {results[template.id] && !isProcessing && (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
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
            className="space-y-4"
          >
            <h3 className="font-playfair text-xl font-bold text-[#0f0f0f]">Results</h3>
            
            {/* Results Tabs */}
            <div className="flex flex-wrap gap-2">
              {Object.keys(results).map((templateId) => (
                <button
                  key={templateId}
                  onClick={() => setActiveResult(templateId)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeResult === templateId
                      ? 'bg-[#b8a1ff] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {templateId.charAt(0).toUpperCase() + templateId.slice(1)}
                </button>
              ))}
            </div>

            {/* Active Result */}
            {activeResult && results[activeResult] && (
              <motion.div
                key={activeResult}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-[#0f0f0f]">
                      {activeResult.charAt(0).toUpperCase() + activeResult.slice(1)} Result
                    </h4>
                    <p className="text-sm text-gray-500">
                      Generated by {results[activeResult].model} • {results[activeResult].provider}
                    </p>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(results[activeResult].result)}
                    className="p-2 text-gray-500 hover:text-[#b8a1ff] transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                
                <div className={`${activeResult === 'json' ? 'font-mono text-sm' : ''} whitespace-pre-wrap text-[#0f0f0f]`}>
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
