import React, { useState, useCallback } from 'react';
import { Tool } from '../types';
import { PlusIcon } from './icons';

interface FileUploaderProps {
  onFilesSelected: (files: FileList) => void;
  tool: Tool;
  isAdditional?: boolean;
  accept?: string;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFilesSelected, 
  tool, 
  isAdditional = false,
  accept = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.html",
  multiple = true
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(e.target.files);
      // Reset the input value to allow re-uploading the same file
      e.target.value = '';
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  }, [onFilesSelected]);

  if (isAdditional) {
    return (
      <label className="relative cursor-pointer w-full inline-flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-red-400 hover:bg-red-50 p-4 transition-all">
        <PlusIcon className="w-6 h-6 mr-2 text-red-500" />
        <span className="font-semibold text-red-500">Add more files</span>
        <input
          type="file"
          multiple={multiple}
          accept={accept}
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    );
  }

  return (
    <div className="w-full max-w-2xl text-center">
        <label
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-xl transition-all duration-300 ${isDragging ? 'border-red-500 bg-red-50' : 'border-transparent bg-transparent'}`}
            >
            <div className={`flex items-center justify-center py-4 px-8 rounded-lg text-white font-bold text-xl md:text-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1 ${tool.color} ${tool.hoverColor}`}>
                Select file{multiple && 's'}
            </div>
            <p className="mt-6 text-gray-500 text-lg">or drop file{multiple && 's'} here</p>
            <input
                type="file"
                multiple={multiple}
                accept={accept}
                className="hidden"
                onChange={handleFileChange}
            />
        </label>
    </div>
  );
};

export default FileUploader;