import React from 'react';
import { Tool, ManagedFile } from '../types';
import FileUploader from './FileUploader';
import FileList from './FileList';
import ToolParameters from './ToolParameters';
import { getToolConfig } from '../toolConfig';
import { PlusIcon, ArrowLeftIcon, ExclamationIcon } from './icons';

interface ToolPageProps {
  tool: Tool;
  files: ManagedFile[];
  onFilesChange: (files: File[]) => void;
  onSetFiles: (files: ManagedFile[]) => void;
  onProcess: () => void;
  onBack: () => void;
  error: string | null;
  onClearError: () => void;
  toolParameters?: Record<string, any>;
  onParametersChange?: (values: Record<string, any>) => void;
}

const ToolPage: React.FC<ToolPageProps> = ({ 
  tool, 
  files, 
  onFilesChange, 
  onSetFiles, 
  onProcess, 
  onBack, 
  error, 
  onClearError,
  toolParameters,
  onParametersChange 
}) => {
  const filesReadyForProcessing = files.filter(f => f.status === 'waiting').length;
  const isProcessing = files.some(f => f.status === 'uploading' || f.status === 'processing');
  
  const isProcessButtonDisabled = filesReadyForProcessing < tool.minFiles || isProcessing;
  const processButtonText = isProcessing ? "Processing..." : tool.name;

  const toolConfig = getToolConfig(tool.id);

  const ErrorMessage: React.FC<{ message: string, onDismiss: () => void }> = ({ message, onDismiss }) => (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-6 flex items-center justify-between" role="alert">
      <div className="flex items-center">
        <ExclamationIcon className="w-6 h-6 mr-3 text-red-500" />
        <span className="block sm:inline">{message}</span>
      </div>
      <button onClick={onDismiss} className="p-1 text-red-500 hover:text-red-700">
        <span className="text-2xl">&times;</span>
      </button>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center w-full max-w-4xl mx-auto">
        <div className="relative flex justify-center items-center mb-6">
            <button onClick={onBack} className="absolute left-0 text-gray-500 hover:text-gray-800 transition-colors">
                <ArrowLeftIcon className="w-8 h-8"/>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{tool.name}</h1>
        </div>
        <p className="text-md md:text-lg text-gray-600 mb-8">{tool.description}</p>
      </div>

      {error && <ErrorMessage message={error} onDismiss={onClearError} />}

      {files.length === 0 ? (
        <FileUploader onFilesSelected={(newFiles) => onFilesChange(Array.from(newFiles))} tool={tool} />
      ) : (
        <div className="w-full flex flex-col lg:flex-row gap-8 mt-8">
            <div className="flex-grow">
                 <FileList files={files} onSetFiles={onSetFiles} />
            </div>
            <aside className="w-full lg:w-80 flex-shrink-0">
                <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                    {/* Dynamic Tool Parameters */}
                    {toolConfig && toolConfig.parameters.length > 0 && onParametersChange && (
                        <div className="mb-6">
                            <ToolParameters
                                parameters={toolConfig.parameters}
                                values={toolParameters || {}}
                                onChange={onParametersChange}
                            />
                        </div>
                    )}

                    {/* OCR Language Selector (legacy - should be moved to toolConfig) */}
                    {tool.id === 'ocr-pdf' && (
                        <div className="mb-6">
                            <label htmlFor="ocr-language" className="block text-sm font-bold text-gray-700 mb-2">
                                RECOGNITION LANGUAGE
                            </label>
                            <select
                                id="ocr-language"
                                className="w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                                <option>Italian</option>
                                <option>Portuguese</option>
                            </select>
                        </div>
                    )}
                    <button
                        onClick={onProcess}
                        disabled={isProcessButtonDisabled}
                        className={`w-full px-6 py-4 text-xl font-bold text-white rounded-lg transition-all duration-300 flex items-center justify-center ${tool.color} ${tool.hoverColor} ${isProcessButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'}`}
                        >
                        {isProcessing && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        {processButtonText}
                    </button>
                    {filesReadyForProcessing < tool.minFiles && !isProcessing && (
                        <p className="text-center text-red-500 mt-3 text-sm">You need at least {tool.minFiles} files ready.</p>
                    )}
                    <div className="mt-6 text-center">
                        <FileUploader onFilesSelected={(newFiles) => onFilesChange(Array.from(newFiles))} tool={tool} isAdditional={true} />
                    </div>
                </div>
            </aside>
        </div>
      )}
    </div>
  );
};

export default ToolPage;
