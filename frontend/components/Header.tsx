import React from 'react';
import { LogoIcon } from './icons';
import { Tool } from '../types';

interface HeaderProps {
    onLogoClick: () => void;
    currentSection?: 'pdf' | 'image' | 'video' | 'main';
    onSelectTool?: (toolId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, currentSection = 'main', onSelectTool }) => {
  // Most useful tools for quick access - varies by section
  const pdfQuickTools = [
    { id: 'merge-pdf', name: 'Merge PDF' },
    { id: 'split-pdf', name: 'Split PDF' },
    { id: 'compress-pdf', name: 'Compress PDF' },
    { id: 'pdf-to-word', name: 'PDF to Word' }
  ];

  const imageQuickTools = [
    { id: 'compress-image', name: 'Compress Image' },
    { id: 'resize-image', name: 'Resize Image' },
    { id: 'crop-image', name: 'Crop Image' },
    { id: 'image-to-jpg', name: 'Convert to JPG' }
  ];

  const videoQuickTools = [
    { id: 'compress-video', name: 'Compress Video' },
    { id: 'convert-video', name: 'Convert Video' },
    { id: 'trim-video', name: 'Trim Video' },
    { id: 'video-to-gif', name: 'Video to GIF' }
  ];

  const quickTools = currentSection === 'pdf' ? pdfQuickTools : 
                     currentSection === 'image' ? imageQuickTools :
                     currentSection === 'video' ? videoQuickTools : 
                     pdfQuickTools; // default to PDF tools on main

  const handleToolClick = (toolId: string) => {
    if (onSelectTool) {
      onSelectTool(toolId);
    }
  };

  // Render logo text based on current section
  const renderLogoText = () => {
    if (currentSection === 'main') {
      return (
        <span className="text-2xl font-bold text-red-500">
          imageandpdf
        </span>
      );
    } else if (currentSection === 'pdf') {
      return (
        <span className="text-2xl font-bold">
          <span className="text-gray-800">imageand</span>
          <span className="text-red-500">pdf</span>
        </span>
      );
    } else if (currentSection === 'image') {
      return (
        <span className="text-2xl font-bold">
          <span className="text-red-500">image</span>
          <span className="text-gray-800">andpdf</span>
        </span>
      );
    } else if (currentSection === 'video') {
      return (
        <span className="text-2xl font-bold">
          <span className="text-blue-500">video</span>
          <span className="text-gray-800"> @ imageandpdf</span>
        </span>
      );
    }
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-3">
            <LogoIcon className="h-10 text-red-500"/>
            {renderLogoText()}
        </button>
        <nav className="hidden md:flex items-center space-x-6">
          {quickTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className="text-gray-700 hover:text-red-500 transition-colors font-medium text-sm"
            >
              {tool.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
