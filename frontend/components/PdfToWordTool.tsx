/**
 * PDF to Word Tool Page Example
 * ==============================
 * Example implementation with async task polling
 */

import React, { useState } from 'react';
import FileUpload from './FileUpload';
import TaskProgress from './TaskProgress';
import { useTaskPolling, uploadAndStartTask } from '../hooks/useTaskPolling';
import SEO from './SEO';

export default function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { status, isPolling, error: pollingError, startPolling, reset } = useTaskPolling({
    taskId,
    onComplete: (result) => {
      console.log('Conversion complete:', result);
      // You can add analytics tracking here
    },
    onError: (error) => {
      console.error('Conversion failed:', error);
    }
  });

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;

    const selectedFile = files[0];
    setFile(selectedFile);
    setUploadError(null);
    reset();

    try {
      setIsUploading(true);

      // Upload file and get task ID
      const result = await uploadAndStartTask(
        selectedFile,
        '/api/pdf/to-word'
      );

      setTaskId(result.task_id);
      startPolling();
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMsg);
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    // Track download event
    console.log('File downloaded');
  };

  const handleCancel = () => {
    reset();
    setFile(null);
    setTaskId(null);
  };

  const handleNewFile = () => {
    reset();
    setFile(null);
    setTaskId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12">
      <SEO 
        title="PDF to Word Converter - Free Online PDF to DOCX | ImageAndPDF"
        description="Convert PDF to Word (DOCX) for free. High-quality conversion that preserves formatting. No signup required. Fast, secure, and easy to use."
        keywords="PDF to Word, PDF to DOCX, convert PDF to Word, PDF converter, free PDF to Word converter"
        canonicalUrl="https://imageandpdf.com/pdf-to-word"
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
            PDF to Word Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert your PDF files to editable Word documents (DOCX) for free. 
            Preserves formatting, images, and layout.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {!isPolling && !status && (
            <FileUpload
              acceptedFormats=".pdf"
              maxFiles={1}
              maxSizeMB={50}
              multiple={false}
              onFilesSelected={handleFilesSelected}
            />
          )}

          {isUploading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Uploading file...</p>
            </div>
          )}

          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-red-800 font-medium">Upload Failed</p>
                  <p className="text-red-700 text-sm">{uploadError}</p>
                </div>
              </div>
            </div>
          )}

          {(isPolling || status) && (
            <>
              <TaskProgress
                status={status}
                fileName={file?.name}
                onDownload={handleDownload}
                onCancel={status?.state === 'PROGRESS' ? handleCancel : undefined}
              />

              {status?.state === 'SUCCESS' && (
                <button
                  onClick={handleNewFile}
                  className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Convert Another File
                </button>
              )}

              {status?.state === 'FAILURE' && (
                <button
                  onClick={handleNewFile}
                  className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              )}
            </>
          )}

          {pollingError && !uploadError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-yellow-800 font-medium">Connection Error</p>
                  <p className="text-yellow-700 text-sm">{pollingError}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl mb-3">🔒</div>
            <h3 className="font-semibold text-gray-800 mb-2">Secure & Private</h3>
            <p className="text-sm text-gray-600">
              Files are automatically deleted after conversion
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-semibold text-gray-800 mb-2">Fast Conversion</h3>
            <p className="text-sm text-gray-600">
              Quick processing with real-time progress updates
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="font-semibold text-gray-800 mb-2">High Quality</h3>
            <p className="text-sm text-gray-600">
              Preserves formatting, images, and document structure
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            How to Convert PDF to Word
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold mb-2">Upload PDF</h3>
              <p className="text-sm text-gray-600">
                Drag & drop or click to select your PDF file
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold mb-2">Wait for Conversion</h3>
              <p className="text-sm text-gray-600">
                Watch real-time progress as we convert your file
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold mb-2">Download DOCX</h3>
              <p className="text-sm text-gray-600">
                Get your editable Word document instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
