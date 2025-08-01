"use client";

import '../lib/polyfills';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import pdfToText from 'react-pdftotext';

export interface ExtractedPDFData {
  text: string;
  fileName: string;
  fileSize: string;
  pageCount: number;
  wordCount: number;
  extractionTime: number;
}

interface PDFUploadProps {
  onTextExtracted: (data: ExtractedPDFData) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
}

interface ExtractionState {
  isExtracting: boolean;
  progress: number;
  currentStep: string;
}

export default function PDFUpload({ onTextExtracted, onError, isProcessing }: PDFUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [extractionState, setExtractionState] = useState<ExtractionState>({
    isExtracting: false,
    progress: 0,
    currentStep: ''
  });

  /**
   * Validates PDF file before processing
   */
  const validatePDFFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type
    if (file.type !== 'application/pdf') {
      return { isValid: false, error: 'Please upload a PDF file only.' };
    }

    // Check file size (25MB limit for production)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 25MB.' };
    }

    // Check if file is empty
    if (file.size === 0) {
      return { isValid: false, error: 'File appears to be empty.' };
    }

    return { isValid: true };
  };

  /**
   * Extracts text from PDF with comprehensive error handling
   */
  const extractTextFromPDF = async (file: File): Promise<void> => {
    const startTime = Date.now();
    
    setExtractionState({
      isExtracting: true,
      progress: 10,
      currentStep: 'Initializing PDF reader...'
    });

    try {
      // Validate file first
      const validation = validatePDFFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      setExtractionState(prev => ({
        ...prev,
        progress: 30,
        currentStep: 'Reading PDF structure...'
      }));

      // Add timeout for large files
      const extractionPromise = pdfToText(file);
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('PDF extraction timeout - file may be too complex')), 30000);
      });

      setExtractionState(prev => ({
        ...prev,
        progress: 70,
        currentStep: 'Extracting text content...'
      }));

      const extractedText = await Promise.race([extractionPromise, timeoutPromise]);

      // Validate extracted text
      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text could be extracted from this PDF. It may be image-based or encrypted.');
      }

      // Check for minimum viable text length
      if (extractedText.trim().length < 10) {
        throw new Error('Extracted text is too short. Please ensure the PDF contains readable text.');
      }

      setExtractionState(prev => ({
        ...prev,
        progress: 90,
        currentStep: 'Processing extracted content...'
      }));

      // Format file size
      const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      // Count words
      const wordCount = extractedText.trim().split(/\s+/).length;
      
      // Estimate number of pages (rough approximation)
      const estimatedPages = Math.max(1, Math.ceil(extractedText.length / 2000));
      
      // Calculate extraction time
      const extractionTime = Date.now() - startTime;

      // Create comprehensive data object
      const extractedData: ExtractedPDFData = {
        text: extractedText.trim(),
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        pageCount: estimatedPages,
        wordCount: wordCount,
        extractionTime: extractionTime
      };

      setExtractionState(prev => ({
        ...prev,
        progress: 100,
        currentStep: 'Extraction complete!'
      }));

      // Small delay to show completion
      setTimeout(() => {
        onTextExtracted(extractedData);
        setExtractionState({
          isExtracting: false,
          progress: 0,
          currentStep: ''
        });
      }, 500);

    } catch (error) {
      console.error('PDF extraction error:', error);
      
      let errorMessage = 'Failed to extract text from PDF.';
      
      if (error instanceof Error) {
        // Handle specific error types
        if (error.message.includes('timeout')) {
          errorMessage = 'PDF extraction timed out. The file may be too large or complex.';
        } else if (error.message.includes('No text could be extracted')) {
          errorMessage = 'This PDF appears to be image-based. Please try a text-based PDF or use OCR.';
        } else if (error.message.includes('encrypted')) {
          errorMessage = 'This PDF is password-protected or encrypted.';
        } else if (error.message.includes('File size')) {
          errorMessage = error.message;
        } else if (error.message.includes('too short')) {
          errorMessage = error.message;
        } else {
          errorMessage = `Extraction failed: ${error.message}`;
        }
      }

      onError(errorMessage);
      setExtractionState({
        isExtracting: false,
        progress: 0,
        currentStep: ''
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      let errorMessage = 'File rejected.';
      
      if (rejection.errors) {
        const error = rejection.errors[0];
        if (error.code === 'file-too-large') {
          errorMessage = 'File is too large. Maximum size is 25MB.';
        } else if (error.code === 'file-invalid-type') {
          errorMessage = 'Only PDF files are accepted.';
        }
      }
      
      onError(errorMessage);
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      extractTextFromPDF(file);
    }
  }, [onTextExtracted, onError]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    maxSize: 25 * 1024 * 1024, // 25MB
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    disabled: isProcessing || extractionState.isExtracting
  });

  const isActive = extractionState.isExtracting || isProcessing;

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? 'border-[#b8a1ff] bg-[#b8a1ff]/5 scale-105' 
            : isDragReject 
            ? 'border-red-400 bg-red-50' 
            : 'border-gray-300 hover:border-[#b8a1ff]/60 hover:bg-[#b8a1ff]/5'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          <AnimatePresence mode="wait">
            {extractionState.isExtracting ? (
              <motion.div
                key="extracting"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mb-4"
                >
                  <svg className="w-full h-full text-[#b8a1ff]" fill="none" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </motion.div>
                
                <p className="text-lg font-medium text-[#0f0f0f] font-playfair mb-2">Extracting Text from PDF</p>
                <p className="text-sm text-[#0f0f0f]/60 mb-4">{extractionState.currentStep}</p>
                
                {/* Progress Bar */}
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mb-4">
                  <motion.div 
                    className="bg-[#b8a1ff] h-2 rounded-full transition-all duration-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${extractionState.progress}%` }}
                  />
                </div>
                
                <div className="text-xs text-[#0f0f0f]/50">
                  {extractionState.progress}% complete
                </div>
              </motion.div>
            ) : isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mb-4"
                >
                  <svg className="w-full h-full text-[#b8a1ff]" fill="none" viewBox="0 0 24 24">
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </motion.div>
                <p className="text-lg font-medium text-[#0f0f0f] font-playfair">Processing Document...</p>
                <p className="text-sm text-[#0f0f0f]/60 mt-1">Please wait while we prepare your content</p>
              </motion.div>
            ) : (
              <motion.div
                key="upload"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <motion.div 
                  className="w-16 h-16 mb-4 text-[#b8a1ff]"
                  whileHover={{ scale: isActive ? 1 : 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                    />
                  </svg>
                </motion.div>
                
                <h3 className="text-lg font-medium text-[#0f0f0f] mb-2 font-playfair">
                  {isDragActive ? 'Drop your PDF here!' : 'Upload Legal Document'}
                </h3>
                
                <p className="text-sm text-[#0f0f0f]/60 mb-4">
                  Drag and drop your PDF file or click to browse
                </p>
                
                <div className="flex items-center space-x-2 text-xs text-[#0f0f0f]/50">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    PDF only
                  </span>
                  <span>•</span>
                  <span>Max 25MB</span>
                  <span>•</span>
                  <span>Text extraction</span>
                </div>
                
                {/* Feature highlights */}
                <div className="mt-4 grid grid-cols-3 gap-4 text-xs text-[#0f0f0f]/40">
                  <div className="flex flex-col items-center">
                    <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Text Extraction</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Secure</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <svg className="w-4 h-4 mb-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>Fast</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
