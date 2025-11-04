import React from 'react';

export type ToolCategory = 
  | 'Organize PDF' 
  | 'Optimize PDF' 
  | 'Convert PDF' 
  | 'Edit PDF' 
  | 'PDF Security' 
  | 'Workflows'
  | 'Image Tools'
  | 'Optimize Image'
  | 'Edit Image'
  | 'Convert Image'
  | 'Video Tools'
  | 'Convert Video'
  | 'Edit Video';

export interface Tool {
  id: string;
  name: string;
  description: string;
  Icon: React.FC<{ className?: string }>;
  color: string;
  hoverColor: string;
  minFiles: number;
  category: ToolCategory;
}

export type FileStatus = 'uploading' | 'processing' | 'completed' | 'error' | 'waiting';

export interface ManagedFile {
  id: string;
  file: File;
  status: FileStatus;
  progress: number; // 0-100
  errorMessage?: string;
}
