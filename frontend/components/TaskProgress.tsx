/**
 * Task Progress Indicator Component
 * ==================================
 * Shows real-time progress for async tasks
 */

import React from 'react';
import { TaskStatus } from '../hooks/useTaskPolling';

interface TaskProgressProps {
  status: TaskStatus | null;
  fileName?: string;
  onDownload?: () => void;
  onCancel?: () => void;
  className?: string;
}

export default function TaskProgress({ 
  status, 
  fileName,
  onDownload,
  onCancel,
  className = ''
}: TaskProgressProps) {
  if (!status) return null;

  const getStateColor = () => {
    switch (status.state) {
      case 'SUCCESS': return 'bg-green-500';
      case 'FAILURE': return 'bg-red-500';
      case 'PROGRESS': return 'bg-blue-500';
      default: return 'bg-gray-400';
    }
  };

  const getStateIcon = () => {
    switch (status.state) {
      case 'SUCCESS': return '✓';
      case 'FAILURE': return '✗';
      case 'PROGRESS': return '⟳';
      default: return '○';
    }
  };

  const isComplete = status.state === 'SUCCESS';
  const isFailed = status.state === 'FAILURE';
  const isProcessing = status.state === 'PROGRESS' || status.state === 'PENDING';

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${getStateColor()} flex items-center justify-center text-white text-xl font-bold ${isProcessing ? 'animate-spin' : ''}`}>
            {getStateIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {isComplete ? 'Processing Complete!' : isFailed ? 'Processing Failed' : 'Processing...'}
            </h3>
            {fileName && (
              <p className="text-sm text-gray-600">{fileName}</p>
            )}
          </div>
        </div>
        
        {onCancel && isProcessing && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Cancel"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">{status.status}</span>
          <span className="text-sm font-semibold text-gray-800">{status.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${getStateColor()} ${isProcessing ? 'animate-pulse' : ''}`}
            style={{ width: `${status.progress}%` }}
          />
        </div>
      </div>

      {/* Status Messages */}
      {isComplete && status.output_filename && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎉</span>
            <div className="flex-1">
              <p className="text-green-800 font-medium mb-1">File ready for download!</p>
              <p className="text-green-700 text-sm">{status.output_filename}</p>
            </div>
          </div>
        </div>
      )}

      {isFailed && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="text-red-800 font-medium mb-1">Processing failed</p>
              <p className="text-red-700 text-sm">{status.status || 'Unknown error occurred'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isComplete && status.download_url && (
        <div className="flex gap-3">
          <a
            href={status.download_url}
            download={status.output_filename}
            onClick={onDownload}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download File
          </a>
        </div>
      )}

      {/* Processing Animation */}
      {isProcessing && (
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span>Please wait...</span>
        </div>
      )}
    </div>
  );
}
