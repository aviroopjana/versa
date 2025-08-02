"use client";

import { motion } from 'framer-motion';

export interface ExtractedPDFData {
  text: string;
  fileName: string;
  fileSize: string;
  pageCount: number;
  wordCount: number;
  extractionTime: number;
}

interface ExtractedTextDisplayProps {
  data: ExtractedPDFData | null;
  onReset: () => void;
  onStartTransformation?: () => void;
}

export default function ExtractedTextDisplay({ data, onReset, onStartTransformation }: ExtractedTextDisplayProps) {
  if (!data) return null;

  const formatExtractionTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      {/* Header with file info */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-playfair font-semibold text-[#0f0f0f]">Document Processed</h2>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            Upload New PDF
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">File Name:</span>
              <span className="font-medium text-[#0f0f0f]">{data.fileName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">File Size:</span>
              <span className="font-medium text-[#0f0f0f]">{data.fileSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pages:</span>
              <span className="font-medium text-[#0f0f0f]">{data.pageCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Words:</span>
              <span className="font-medium text-[#0f0f0f]">{data.wordCount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Characters:</span>
              <span className="font-medium text-[#0f0f0f]">{data.text.length.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Extraction Time:</span>
              <span className="font-medium text-[#0f0f0f]">{formatExtractionTime(data.extractionTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="font-medium text-green-600">✓ Ready for AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Extracted text display */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-playfair font-semibold text-[#0f0f0f]">Extracted Text</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => navigator.clipboard.writeText(data.text)}
              className="px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
            >
              Copy Text
            </button>
            <button className="px-3 py-1 text-xs bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors">
              Ready for AI ✨
            </button>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto bg-gray-50 rounded-lg p-4">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
            {data.text}
          </pre>
        </div>
        
        {data.text.length > 1000 && (
          <div className="mt-4 text-xs text-gray-500 italic">
            Text preview truncated. Full text has been extracted and is ready for processing.
          </div>
        )}
      </div>

      {/* Next steps */}
      <div className="bg-gradient-to-r from-[#00ffe0]/10 to-[#b8a1ff]/10 rounded-xl p-6">
        <h3 className="text-lg font-playfair font-semibold text-[#0f0f0f] mb-3">Ready for AI Transformation!</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <motion.button
            onClick={onStartTransformation}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-[#b8a1ff]/5"
          >
            <div className="text-2xl mb-2">🎭</div>
            <div className="text-sm font-medium text-[#0f0f0f]">Transform to Poetry</div>
            <div className="text-xs text-gray-500 mt-1">Convert to poetic language</div>
          </motion.button>
          
          <motion.button
            onClick={onStartTransformation}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-[#b8a1ff]/5"
          >
            <div className="text-2xl mb-2">📝</div>
            <div className="text-sm font-medium text-[#0f0f0f]">Simplify Language</div>
            <div className="text-xs text-gray-500 mt-1">Make it easy to understand</div>
          </motion.button>
          
          <motion.button
            onClick={onStartTransformation}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-[#b8a1ff]/5"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-[#0f0f0f]">Analyze & Structure</div>
            <div className="text-xs text-gray-500 mt-1">Extract key information</div>
          </motion.button>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-[#0f0f0f]/60">Your document is ready for AI transformation. Scroll down to explore all options!</p>
        </div>
      </div>
    </motion.div>
  );
}
