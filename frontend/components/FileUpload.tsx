import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: string[];
  maxFiles?: number;
  maxSizeMB?: number;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  acceptedFormats = [],
  maxFiles = 10,
  maxSizeMB = 50,
  multiple = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: File[]): { valid: File[], error: string | null } => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    
    // Check file count
    if (files.length > maxFiles) {
      return { 
        valid: [], 
        error: `Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed` 
      };
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      // Check file size
      if (file.size > maxSizeBytes) {
        return { 
          valid: [], 
          error: `File "${file.name}" exceeds ${maxSizeMB}MB limit` 
        };
      }

      // Check file type if formats specified
      if (acceptedFormats.length > 0) {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
          return { 
            valid: [], 
            error: `File type ".${fileExtension}" not supported. Accepted: ${acceptedFormats.join(', ')}` 
          };
        }
      }

      validFiles.push(file);
    }

    return { valid: validFiles, error: null };
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const { valid, error: validationError } = validateFiles(fileArray);

    if (validationError) {
      setError(validationError);
      setTimeout(() => setError(null), 5000);
      return;
    }

    setError(null);
    onFilesSelected(valid);
  }, [onFilesSelected, validateFiles]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const acceptString = acceptedFormats.length > 0 
    ? acceptedFormats.map(format => `.${format}`).join(',')
    : '*';

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 md:p-12
          transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-red-500 bg-red-50 scale-105' 
            : 'border-gray-300 bg-white hover:border-red-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileInput}
          accept={acceptString}
          multiple={multiple}
        />
        
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          {/* Upload Icon */}
          <div className={`
            mb-4 w-20 h-20 rounded-full flex items-center justify-center
            transition-all duration-300
            ${isDragging ? 'bg-red-500 scale-110' : 'bg-gray-100'}
          `}>
            <svg
              className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {/* Text Content */}
          <div className="text-center">
            <p className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
              {isDragging ? 'Drop files here' : 'Choose files or drag & drop'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {acceptedFormats.length > 0 
                ? `Supported formats: ${acceptedFormats.map(f => f.toUpperCase()).join(', ')}`
                : 'All file formats supported'
              }
            </p>
            <p className="text-xs text-gray-400">
              Max {maxFiles} file{maxFiles > 1 ? 's' : ''} • Up to {maxSizeMB}MB each
            </p>
          </div>

          {/* Browse Button */}
          <button
            type="button"
            className="mt-6 px-8 py-3 bg-red-500 text-white font-semibold rounded-lg
                     hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('file-upload')?.click();
            }}
          >
            Browse Files
          </button>
        </label>

        {/* Animated Corner Indicators */}
        {isDragging && (
          <>
            <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-red-500 animate-pulse"></div>
            <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-red-500 animate-pulse"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-red-500 animate-pulse"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-red-500 animate-pulse"></div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-blue-700">100% Secure</p>
            <p className="text-xs text-blue-600">Files are encrypted</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-green-700">Auto-Delete</p>
            <p className="text-xs text-green-600">Removed after 1 hour</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
          <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-purple-700">Privacy First</p>
            <p className="text-xs text-purple-600">No data stored</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
