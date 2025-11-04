import React from 'react';

interface FooterProps {
  onNavigate?: (page: string) => void;
  onSelectTool?: (toolId: string) => void;
  onSelectSection?: (section: 'pdf' | 'image') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectTool, onSelectSection }) => {
  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleToolClick = (toolId: string) => {
    if (onSelectTool) {
      onSelectTool(toolId);
    }
  };

  const handleSectionClick = (section: 'pdf' | 'image') => {
    if (onSelectSection) {
      onSelectSection(section);
    }
  };

  return (
    <footer className="bg-gray-100 text-gray-700 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
             <h4 className="font-bold mb-3 text-gray-800">
               <span className="text-red-500">image</span>
               <span className="text-gray-800">and</span>
               <span className="text-red-500">pdf</span>
             </h4>
             <p className="text-sm text-gray-600 mt-2">
               Every tool you need to work with images and PDFs in one place.
             </p>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-gray-800">PDF TOOLS</h4>
            <ul>
              <li className="mb-2">
                <button onClick={() => handleToolClick('merge-pdf')} className="hover:underline text-gray-600">
                  Merge PDF
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => handleToolClick('split-pdf')} className="hover:underline text-gray-600">
                  Split PDF
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => handleToolClick('compress-pdf')} className="hover:underline text-gray-600">
                  Compress PDF
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => handleSectionClick('pdf')} className="hover:underline text-gray-600 font-semibold">
                  All PDF tools →
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-gray-800">COMPANY</h4>
            <ul>
              <li className="mb-2"><button onClick={() => handleNavigation('main')} className="hover:underline text-gray-600">Home</button></li>
              <li className="mb-2"><button onClick={() => handleNavigation('about')} className="hover:underline text-gray-600">About us</button></li>
              <li className="mb-2"><button onClick={() => handleNavigation('contact')} className="hover:underline text-gray-600">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-gray-800">IMAGE TOOLS</h4>
            <ul>
              <li className="mb-2">
                <button onClick={() => handleToolClick('resize-image')} className="hover:underline text-gray-600">
                  Resize Image
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => handleToolClick('compress-image')} className="hover:underline text-gray-600">
                  Compress Image
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => handleToolClick('image-to-jpg')} className="hover:underline text-gray-600">
                  Convert Image
                </button>
              </li>
              <li className="mb-2">
                <button onClick={() => handleSectionClick('image')} className="hover:underline text-gray-600 font-semibold">
                  All Image tools →
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-gray-800">LEGAL</h4>
            <ul>
                <li className="mb-2"><button onClick={() => handleNavigation('privacy')} className="hover:underline text-gray-600">Privacy Policy</button></li>
                <li className="mb-2"><button onClick={() => handleNavigation('terms')} className="hover:underline text-gray-600">Terms of Service</button></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 border-t border-gray-200 mt-8 pt-6">
          © <span className="text-red-500">image</span>and<span className="text-red-500">pdf</span> 2025 - All rights reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;
