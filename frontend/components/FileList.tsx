import React from 'react';
import { ManagedFile } from '../types';
import { FileIcon, TrashIcon, CheckCircleIcon, XCircleIcon, RetryIcon } from './icons';

interface FileListProps {
  files: ManagedFile[];
  onSetFiles: (files: ManagedFile[]) => void;
}

const ProgressBar: React.FC<{ progress: number, status: ManagedFile['status'] }> = ({ progress, status }) => {
  const colorClass = status === 'error' ? 'bg-red-500' : 'bg-green-500';
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
      <div
        className={`h-1.5 rounded-full ${colorClass} transition-all duration-300`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

const FileList: React.FC<FileListProps> = ({ files, onSetFiles }) => {
  const removeFile = (idToRemove: string) => {
    onSetFiles(files.filter(f => f.id !== idToRemove));
  };

  const handleRetry = (idToRetry: string) => {
    onSetFiles(files.map(f => 
      f.id === idToRetry 
        ? { ...f, status: 'waiting', progress: 100, errorMessage: undefined } 
        : f
    ));
  };
  
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const getStatusText = (file: ManagedFile) => {
    switch (file.status) {
      case 'uploading':
        return `Uploading... ${file.progress}%`;
      case 'processing':
        return `Processing... ${file.progress}%`;
      case 'completed':
        return 'Completed';
      case 'error':
        return file.errorMessage || 'Error';
      case 'waiting':
        return 'Ready to process';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-3">
      {files.map(managedFile => (
        <div key={managedFile.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4 animate-fade-in">
          <FileIcon className="w-10 h-10 text-red-500 flex-shrink-0" />
          <div className="flex-grow overflow-hidden">
            <p className="font-semibold text-gray-800 truncate" title={managedFile.file.name}>
              {managedFile.file.name}
            </p>
            <p className="text-sm text-gray-500">
              {formatBytes(managedFile.file.size)} - <span className={managedFile.status === 'error' ? 'text-red-500 font-medium' : ''}>{getStatusText(managedFile)}</span>
            </p>
            {(managedFile.status === 'uploading' || managedFile.status === 'processing' || managedFile.status === 'error') && (
              <ProgressBar progress={managedFile.progress} status={managedFile.status} />
            )}
          </div>
          <div className="flex-shrink-0 flex items-center gap-2">
            {managedFile.status === 'completed' && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
            {managedFile.status === 'error' && <XCircleIcon className="w-6 h-6 text-red-500" />}
            
            {managedFile.status === 'error' && (
              <button
                onClick={() => handleRetry(managedFile.id)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                title="Retry"
              >
                <RetryIcon className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => removeFile(managedFile.id)}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
              title="Remove file"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;