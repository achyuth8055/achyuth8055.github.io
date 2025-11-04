import React, { useState, useCallback, useEffect } from 'react';
import MainLandingPage from './components/MainLandingPage';
import HomePage from './components/HomePage';
import ToolPage from './components/ToolPage';
import EditPdfPage from './components/EditPdfPage';
import DownloadPage from './components/DownloadPage';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import Header from './components/Header';
import Footer from './components/Footer';
import { Tool, ManagedFile, ToolCategory } from './types';
import { TOOLS } from './constants';
import { getToolConfig } from './toolConfig';

type AppState = 'main' | 'pdf-tools' | 'image-tools' | 'video-tools' | 'tool' | 'download' | 'contact' | 'about' | 'privacy' | 'terms';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('main');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [toolSection, setToolSection] = useState<'pdf' | 'image' | 'video' | 'main'>('main');
  const [files, setFiles] = useState<ManagedFile[]>([]);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [processedFileName, setProcessedFileName] = useState<string>('download.pdf');
  const [error, setError] = useState<string | null>(null);
  const [toolParameters, setToolParameters] = useState<Record<string, any>>({});

  // Initialize default parameters when tool is selected
  useEffect(() => {
    if (selectedTool) {
      const config = getToolConfig(selectedTool.id);
      if (config) {
        const defaults: Record<string, any> = {};
        config.parameters.forEach(param => {
          defaults[param.name] = param.defaultValue;
        });
        setToolParameters(defaults);
      } else {
        setToolParameters({});
      }
    }
  }, [selectedTool]);

  const simulateProgress = useCallback((fileId: string, stage: 'uploading' | 'processing') => {
    const interval = setInterval(() => {
      setFiles(currentFiles => {
        const fileExists = currentFiles.some(f => f.id === fileId);
        if (!fileExists) {
          clearInterval(interval);
          return currentFiles;
        }

        return currentFiles.map(f => {
          if (f.id === fileId) {
            const newProgress = f.progress + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              if (stage === 'uploading') {
                return { ...f, status: 'waiting', progress: 100 };
              }
              if (stage === 'processing') {
                return { ...f, status: 'completed', progress: 100 };
              }
            }
            return { ...f, progress: newProgress };
          }
          return f;
        });
      });
    }, 150);
  }, []);

  const handleSelectTool = useCallback((tool: Tool) => {
    setSelectedTool(tool);
    setAppState('tool');
    setError(null);
    setFiles([]);
  }, []);

  const handleSelectSection = useCallback((section: 'pdf' | 'image' | 'video') => {
    setToolSection(section);
    setAppState(section === 'pdf' ? 'pdf-tools' : section === 'image' ? 'image-tools' : 'video-tools');
  }, []);

  const handleBackToMain = useCallback(() => {
    setAppState('main');
    setSelectedTool(null);
    setFiles([]);
    setError(null);
  }, []);

  const handleBackToHome = useCallback(() => {
    const targetState = toolSection === 'pdf' ? 'pdf-tools' : toolSection === 'image' ? 'image-tools' : toolSection === 'video' ? 'video-tools' : 'main';
    setAppState(targetState);
    setSelectedTool(null);
    setFiles([]);
    setError(null);
  }, [toolSection]);

  const handleSelectToolById = useCallback((toolId: string) => {
    const tool = TOOLS.find(t => t.id === toolId);
    if (tool) {
      handleSelectTool(tool);
    }
  }, [handleSelectTool]);

  const handleFilesChange = useCallback((newFiles: File[]) => {
    const newManagedFiles: ManagedFile[] = newFiles.map(file => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        status: 'uploading',
        progress: 0,
    }));
    
    setFiles(prevFiles => [...prevFiles, ...newManagedFiles]);
    setError(null);
    
    newManagedFiles.forEach(mf => simulateProgress(mf.id, 'uploading'));
  }, [simulateProgress]);
  
  const handleStartProcessing = useCallback(() => {
    if (files.some(f => f.status === 'uploading' || f.status === 'processing')) return;
    
    if (files.some(f => f.file.name.toLowerCase().includes('error'))) {
      setError('A file appears to be corrupted. Please remove it and try again.');
      setFiles(currentFiles => currentFiles.map(f => f.file.name.toLowerCase().includes('error') ? { ...f, status: 'error', errorMessage: 'Corrupted file' } : f));
      return;
    }
    
    setFiles(currentFiles => currentFiles.map(f => 
        f.status === 'waiting' ? { ...f, status: 'processing', progress: 0 } : f
    ));

    files.filter(f => f.status === 'waiting').forEach(f => {
        // Simulate a random processing failure for demonstration
        if (Math.random() > 0.8) { // 20% chance of failure
             setTimeout(() => {
                setFiles(current => current.map(mf => mf.id === f.id ? { ...f, status: 'error', errorMessage: 'Processing failed' } : mf));
             }, 1000);
        } else {
            simulateProgress(f.id, 'processing');
        }
    });

  }, [files, simulateProgress]);

  const handleProcessingComplete = useCallback(async () => {
    const successfulFiles = files.filter(f => f.status === 'completed');
    if (successfulFiles.length === 0) {
        setError("All file operations failed. Please try again.");
        // Reset file statuses to waiting so user can retry
        setFiles(current => current.map(f => ({...f, status: 'waiting', progress: 100})));
        return;
    }

    try {
      const toolId = selectedTool?.id || '';
      const toolConfig = getToolConfig(toolId);
      
      if (!toolConfig) {
        // No config = dummy file for unimplemented tools
        const dummyContent = `This tool is coming soon: ${selectedTool?.name}`;
        const blob = new Blob([dummyContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        setProcessedFileUrl(url);
        setProcessedFileName(`${toolId}_coming_soon.txt`);
        setAppState('download');
        return;
      }

      // Build FormData with file and parameters
      const formData = new FormData();
      formData.append('file', successfulFiles[0].file);

      // Add dynamic parameters
      toolConfig.parameters.forEach(param => {
        const value = toolParameters[param.name] ?? param.defaultValue;
        
        if (param.name === 'resizeMode') return;
        if (param.name === 'customAngle' && toolParameters['angle'] !== 'custom') return;
        
        if (param.name === 'angle' && value === 'custom') {
          formData.append('angle', String(toolParameters['customAngle'] ?? 45));
          return;
        }

        if (toolId === 'resize-image') {
          const mode = toolParameters['resizeMode'] ?? 'percentage';
          if (mode === 'percentage' && param.name === 'percentage') {
            formData.append('percentage', String(value));
          } else if (mode === 'dimensions' && (param.name === 'width' || param.name === 'height')) {
            formData.append(param.name, String(value));
          } else if (mode === 'width' && param.name === 'width') {
            formData.append('width', String(value));
          } else if (mode === 'height' && param.name === 'height') {
            formData.append('height', String(value));
          }
          return;
        }

        if (value !== undefined && value !== null) {
          formData.append(param.name, String(value));
        }
      });

      const apiUrl = `http://localhost:5001${toolConfig.endpoint}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Processing failed' }));
        throw new Error(errorData.error || 'Processing failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `imageandpdf_processed.${toolConfig.outputFormat || 'file'}`;
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      setProcessedFileUrl(url);
      setProcessedFileName(filename);
      setAppState('download');

    } catch (error) {
      console.error('Processing error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process file. Please try again.');
      setFiles(current => current.map(f => ({...f, status: 'error'})));
    }
  }, [files, selectedTool, toolParameters]);
  
  // Effect to check when all processing is done
  useEffect(() => {
    const isProcessing = files.some(f => f.status === 'processing');
    const allDone = files.length > 0 && files.every(f => f.status === 'completed' || f.status === 'error' || f.status === 'waiting');

    if (!isProcessing && allDone && appState === 'tool') {
        const hasStartedProcessing = files.some(f => f.status === 'completed' || f.status === 'error');
        if(hasStartedProcessing){
             // A brief delay to allow user to see the final "completed" or "error" state
            setTimeout(() => {
                handleProcessingComplete();
            }, 1000);
        }
    }
  }, [files, appState, handleProcessingComplete]);
  
  const handleNavigate = useCallback((page: string) => {
    setAppState(page as AppState);
  }, []);
  
  const handleClearError = useCallback(() => {
    setError(null);
  }, []);

  const handleSetFiles = useCallback((updatedFiles: ManagedFile[]) => {
      setFiles(updatedFiles);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'main':
        return <MainLandingPage onSelectSection={handleSelectSection} />;
      case 'pdf-tools':
        const pdfTools = TOOLS.filter(tool => 
          ['Organize PDF', 'Optimize PDF', 'Convert PDF', 'Edit PDF', 'PDF Security', 'Workflows'].includes(tool.category)
        );
        return <HomePage tools={pdfTools} onSelectTool={handleSelectTool} section="pdf" />;
      case 'image-tools':
        const imageTools = TOOLS.filter(tool => 
          ['Image Tools', 'Optimize Image', 'Edit Image', 'Convert Image'].includes(tool.category)
        );
        return <HomePage tools={imageTools} onSelectTool={handleSelectTool} section="image" />;
      case 'video-tools':
        const videoTools = TOOLS.filter(tool => 
          ['Video Tools', 'Convert Video', 'Edit Video'].includes(tool.category)
        );
        return <HomePage tools={videoTools} onSelectTool={handleSelectTool} section="video" />;
      case 'contact':
        return <ContactPage onBack={handleBackToHome} />;
      case 'about':
        return <AboutPage onBack={handleBackToHome} />;
      case 'privacy':
        return <PrivacyPolicyPage onBack={handleBackToHome} />;
      case 'terms':
        return <TermsOfServicePage onBack={handleBackToHome} />;
      case 'tool':
        if (!selectedTool) return null;
        
        if (selectedTool.id === 'edit-pdf') {
          return (
            <EditPdfPage
              tool={selectedTool}
              files={files}
              onFilesChange={handleFilesChange}
              onProcess={handleStartProcessing}
              onBack={handleBackToHome}
            />
          );
        }
        return (
          <ToolPage
            tool={selectedTool}
            files={files}
            onFilesChange={handleFilesChange}
            onSetFiles={handleSetFiles}
            onProcess={handleStartProcessing}
            onBack={handleBackToHome}
            error={error}
            onClearError={handleClearError}
            toolParameters={toolParameters}
            onParametersChange={setToolParameters}
          />
        );
      case 'download':
        return selectedTool && processedFileUrl && (
          <DownloadPage 
            tool={selectedTool} 
            downloadUrl={processedFileUrl} 
            fileName={processedFileName}
            onBackToHome={handleBackToHome} 
          />
        );
      default:
        return <MainLandingPage onSelectSection={handleSelectSection} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        onLogoClick={handleBackToMain} 
        onSelectTool={handleSelectToolById}
        currentSection={toolSection}
      />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {renderContent()}
      </main>
      <Footer 
        onNavigate={handleNavigate}
        onSelectTool={handleSelectToolById}
        onSelectSection={handleSelectSection}
      />
    </div>
  );
};

export default App;
