import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Tool, ManagedFile } from '../types';
import FileUploader from './FileUploader';
import { 
    ArrowLeftIcon, TextIcon, ImageIcon, DrawIcon, ShapeIcon, UndoIcon, RedoIcon,
    ZoomInIcon, ZoomOutIcon, ChevronLeftIcon, ChevronRightIcon
} from './icons';

// Configure the worker to load PDFs. Using a static version string is more robust in this environment
// than relying on pdfjs.version, which can be subject to module loading timing issues.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs`;

type EditActionType = 'text' | 'image' | 'draw' | 'shape';

type EditAction = {
    id: string;
    type: EditActionType;
    pageNumber: number;
    x: number; // percentage
    y: number; // percentage
    // Tool-specific options that define the edit's appearance
    text?: string;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    width?: number; // for shape
    height?: number; // for shape
    fillColor?: string;
    borderColor?: string;
    lineWidth?: number;
};

interface EditPdfPageProps {
  tool: Tool;
  files: ManagedFile[];
  onFilesChange: (files: File[]) => void;
  onProcess: () => void;
  onBack: () => void;
}

const EditPdfPage: React.FC<EditPdfPageProps> = ({ tool, files, onFilesChange, onProcess, onBack }) => {
  const [activeEditTool, setActiveEditTool] = useState<EditActionType | null>(null);

  // State for PDF viewer
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  
  // State for edit history (undo/redo)
  const [history, setHistory] = useState<EditAction[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentEdits = history[historyIndex];
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;


  // State for tool options
  const [textOptions, setTextOptions] = useState({ fontFamily: 'Arial', fontSize: 16, color: '#000000' });
  const [imageOptions, setImageOptions] = useState({ scale: 100, rotation: 0 });
  const [drawOptions, setDrawOptions] = useState({ brushSize: 5, color: '#ff0000' });
  const [shapeOptions, setShapeOptions] = useState({ lineWidth: 2, fillColor: '#3b82f6', borderColor: '#000000' });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const goToPrevPage = () => setPageNumber(oldPage => Math.max(1, oldPage - 1));
  const goToNextPage = () => setPageNumber(oldPage => Math.min(numPages || oldPage, oldPage + 1));

  const zoomIn = () => setScale(oldScale => Math.min(3.0, oldScale + 0.1));
  const zoomOut = () => setScale(oldScale => Math.max(0.5, oldScale - 0.1));

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(e.target.value));
  };

  const addEdit = (edit: Omit<EditAction, 'id'>) => {
    const newAction = { ...edit, id: `edit-${Date.now()}-${Math.random()}` };
    const newEdits = [...currentEdits, newAction];
    const newHistory = [...history.slice(0, historyIndex + 1), newEdits];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (canUndo) {
        setHistoryIndex(historyIndex - 1);
    }
  };
  
  const handleRedo = () => {
    if (canRedo) {
        setHistoryIndex(historyIndex + 1);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!activeEditTool) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    let newEdit: Omit<EditAction, 'id'> | null = null;

    switch (activeEditTool) {
        case 'text': {
            const text = prompt('Enter text:');
            if (text) {
                newEdit = { type: 'text', pageNumber, x, y, text, ...textOptions };
            }
            break;
        }
        case 'shape': {
            newEdit = { type: 'shape', pageNumber, x, y, width: 50, height: 50, ...shapeOptions };
            break;
        }
        case 'image': {
            newEdit = { type: 'image', pageNumber, x, y };
            break;
        }
        case 'draw': {
            newEdit = { type: 'draw', pageNumber, x, y, color: drawOptions.color, lineWidth: drawOptions.brushSize };
            break;
        }
    }

    if (newEdit) {
        addEdit(newEdit);
    }
  };


  const ToolbarButton = ({
    Icon,
    label,
    toolName
  }: {
    Icon: React.FC<{className?: string}>,
    label: string,
    toolName: EditActionType
  }) => (
    <button
      onClick={() => setActiveEditTool(toolName === activeEditTool ? null : toolName)}
      className={`flex flex-col items-center justify-center p-2 rounded-lg w-full aspect-square transition-colors ${
        activeEditTool === toolName ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100 text-gray-600'
      }`}
    >
      <Icon className="w-8 h-8 mb-1" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  const OptionSlider: React.FC<{
      label: string;
      value: number;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      min: number;
      max: number;
      step?: number;
      unit?: string;
  }> = ({ label, value, onChange, min, max, step = 1, unit = '' }) => (
      <div>
          <label className="text-sm font-semibold text-gray-700">{label}</label>
          <div className="flex items-center gap-2 mt-1">
              <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
              <span className="text-sm font-mono w-12 text-right">{value}{unit}</span>
          </div>
      </div>
  );

  const OptionColorPicker: React.FC<{
      label: string;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }> = ({ label, value, onChange }) => (
      <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-gray-700">{label}</label>
          <input type="color" value={value} onChange={onChange} className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent" style={{backgroundColor: value}}/>
      </div>
  );

  const renderOptions = () => {
    switch(activeEditTool) {
        case 'text':
            return (
                <div className="space-y-4 animate-fade-in">
                    <div>
                        <label htmlFor="font-family" className="text-sm font-semibold text-gray-700">Font Family</label>
                        <select id="font-family" value={textOptions.fontFamily} onChange={(e) => setTextOptions({...textOptions, fontFamily: e.target.value})} className="w-full mt-1 px-2 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm">
                            <option>Arial</option>
                            <option>Times New Roman</option>
                            <option>Courier New</option>
                            <option>Georgia</option>
                            <option>Verdana</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="font-size" className="text-sm font-semibold text-gray-700">Font Size</label>
                        <input type="number" id="font-size" value={textOptions.fontSize} onChange={(e) => setTextOptions({...textOptions, fontSize: parseInt(e.target.value)})} className="w-full mt-1 px-2 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm" />
                    </div>
                    <OptionColorPicker label="Color" value={textOptions.color} onChange={(e) => setTextOptions({...textOptions, color: e.target.value})} />
                </div>
            );
        case 'image':
            return (
                <div className="space-y-4 animate-fade-in">
                    <OptionSlider label="Resize" value={imageOptions.scale} onChange={(e) => setImageOptions({...imageOptions, scale: parseInt(e.target.value)})} min={10} max={200} unit="%"/>
                    <OptionSlider label="Rotate" value={imageOptions.rotation} onChange={(e) => setImageOptions({...imageOptions, rotation: parseInt(e.target.value)})} min={0} max={360} unit="°"/>
                </div>
            );
        case 'draw':
            return (
                <div className="space-y-4 animate-fade-in">
                    <OptionSlider label="Brush Size" value={drawOptions.brushSize} onChange={(e) => setDrawOptions({...drawOptions, brushSize: parseInt(e.target.value)})} min={1} max={50} unit="px"/>
                    <OptionColorPicker label="Color" value={drawOptions.color} onChange={(e) => setDrawOptions({...drawOptions, color: e.target.value})} />
                </div>
            );
        case 'shape':
            return (
                <div className="space-y-4 animate-fade-in">
                    <OptionSlider label="Line Width" value={shapeOptions.lineWidth} onChange={(e) => setShapeOptions({...shapeOptions, lineWidth: parseInt(e.target.value)})} min={1} max={30} unit="px"/>
                    <OptionColorPicker label="Fill Color" value={shapeOptions.fillColor} onChange={(e) => setShapeOptions({...shapeOptions, fillColor: e.target.value})} />
                    <OptionColorPicker label="Border Color" value={shapeOptions.borderColor} onChange={(e) => setShapeOptions({...shapeOptions, borderColor: e.target.value})} />
                </div>
            );
        default:
            return (
                <div className="text-center text-sm text-gray-500 h-full flex items-center justify-center">
                    <p>Select a tool to see its options.</p>
                </div>
            );
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="text-center w-full max-w-4xl mx-auto mb-8">
        <div className="relative flex justify-center items-center mb-6">
          <button onClick={onBack} className="absolute left-0 text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeftIcon className="w-8 h-8" />
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{tool.name}</h1>
        </div>
        <p className="text-md md:text-lg text-gray-600">{tool.description}</p>
      </div>

      {files.length === 0 ? (
        <FileUploader
          onFilesSelected={(newFiles) => onFilesChange(Array.from(newFiles))}
          tool={tool}
          accept=".pdf"
          multiple={false}
        />
      ) : (
        <div className="w-full flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden min-h-[70vh]">
          {/* Main Editor Content */}
          <main className="flex-grow flex flex-col items-center justify-center bg-gray-200 p-4 md:p-8 overflow-auto">
             <div className="relative">
                <Document
                  file={files[0].file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={console.error}
                  className="shadow-lg"
                >
                  <div className={`relative ${activeEditTool ? 'cursor-crosshair' : ''}`} onClick={handleCanvasClick}>
                    <Page pageNumber={pageNumber} scale={scale} />
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                      {currentEdits.filter(edit => edit.pageNumber === pageNumber).map(edit => {
                        const style = {
                            position: 'absolute' as const,
                            left: `${edit.x}%`,
                            top: `${edit.y}%`,
                            transform: 'translate(-50%, -50%)',
                        };
                        switch (edit.type) {
                            case 'text':
                                return <div key={edit.id} style={{...style, fontFamily: edit.fontFamily, fontSize: edit.fontSize, color: edit.color}}>{edit.text}</div>;
                            case 'shape':
                                return <div key={edit.id} style={{...style, width: edit.width, height: edit.height, backgroundColor: edit.fillColor, border: `${edit.lineWidth}px solid ${edit.borderColor}`}}></div>;
                            case 'image':
                                return <ImageIcon key={edit.id} className="w-12 h-12 text-gray-400" style={style} />;
                            case 'draw':
                                return <DrawIcon key={edit.id} className="w-8 h-8" style={{...style, color: edit.color, strokeWidth: (edit.lineWidth || 2) / 2 }} />;
                            default:
                                return null;
                        }
                      })}
                    </div>
                  </div>
                </Document>

                {numPages && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 bg-opacity-75 backdrop-blur-sm text-white rounded-full shadow-lg px-4 py-1.5 flex items-center gap-3 text-sm select-none">
                        <button onClick={zoomOut} disabled={scale <= 0.5} title="Zoom Out" className="p-1.5 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-transparent transition-colors">
                            <ZoomOutIcon className="w-5 h-5" />
                        </button>
                        
                        <input
                            type="range"
                            min="0.5"
                            max="3.0"
                            step="0.01"
                            value={scale}
                            onChange={handleScaleChange}
                            className="w-24 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                            title="Adjust Zoom"
                        />

                        <button onClick={zoomIn} disabled={scale >= 3.0} title="Zoom In" className="p-1.5 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-transparent transition-colors">
                            <ZoomInIcon className="w-5 h-5" />
                        </button>
                        
                        <span className="font-mono w-12 text-center tabular-nums">{Math.round(scale * 100)}%</span>
                        
                        <div className="w-px h-5 bg-white bg-opacity-30 mx-1"></div>

                        <button onClick={goToPrevPage} disabled={pageNumber <= 1} title="Previous Page" className="p-1.5 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-transparent transition-colors">
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <span className="font-mono w-24 text-center">Page {pageNumber} / {numPages}</span>
                        <button onClick={goToNextPage} disabled={pageNumber >= numPages} title="Next Page" className="p-1.5 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:hover:bg-transparent transition-colors">
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-full md:w-72 flex-shrink-0 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
            <div className="p-4 h-full flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">Toolbar</h3>
                    <div className="flex items-center gap-2 text-gray-600">
                        <button onClick={handleUndo} disabled={!canUndo} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent" title="Undo">
                            <UndoIcon className="w-5 h-5" />
                        </button>
                        <button onClick={handleRedo} disabled={!canRedo} className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent" title="Redo">
                            <RedoIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
                    <ToolbarButton Icon={TextIcon} label="Add Text" toolName="text" />
                    <ToolbarButton Icon={ImageIcon} label="Add Image" toolName="image" />
                    <ToolbarButton Icon={DrawIcon} label="Draw" toolName="draw" />
                    <ToolbarButton Icon={ShapeIcon} label="Add Shape" toolName="shape" />
                </div>
                
                <div className="border-t border-gray-200 my-4"></div>

                <h4 className="text-md font-bold text-gray-800 text-center mb-3">Tool Options</h4>
                <div className="flex-grow min-h-[200px]">
                    {renderOptions()}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-200">
                    <button
                        onClick={onProcess}
                        className={`w-full px-6 py-3 text-lg font-bold text-white rounded-lg transition-all duration-300 ${tool.color} ${tool.hoverColor} shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                        >
                        {tool.name}
                    </button>
                </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default EditPdfPage;