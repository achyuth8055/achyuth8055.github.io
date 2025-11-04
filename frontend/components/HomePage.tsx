import React, { useState, useMemo } from 'react';
import { Tool, ToolCategory } from '../types';
import ToolCard from './ToolCard';
import UserRatings from './UserRatings';
import { CATEGORIES } from '../constants';

interface HomePageProps {
  tools: Tool[];
  onSelectTool: (tool: Tool) => void;
  section?: 'pdf' | 'image' | 'video' | 'all';
}

const HomePage: React.FC<HomePageProps> = ({ tools, onSelectTool, section = 'all' }) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'All'>('All');

  // Filter categories based on section
  const availableCategories = useMemo(() => {
    if (section === 'pdf') {
      return CATEGORIES.filter(cat => 
        ['Organize PDF', 'Optimize PDF', 'Convert PDF', 'Edit PDF', 'PDF Security', 'Workflows'].includes(cat)
      );
    } else if (section === 'image') {
      return CATEGORIES.filter(cat => 
        ['Image Tools', 'Optimize Image', 'Edit Image', 'Convert Image'].includes(cat)
      );
    } else if (section === 'video') {
      return CATEGORIES.filter(cat => 
        ['Video Tools', 'Convert Video', 'Edit Video'].includes(cat)
      );
    }
    return CATEGORIES; // all categories
  }, [section]);

  const filteredTools = useMemo(() => {
    if (activeCategory === 'All') {
      return tools;
    }
    return tools.filter(tool => tool.category === activeCategory);
  }, [tools, activeCategory]);

  // Update page title and description based on section
  const pageTitle = section === 'pdf' 
    ? 'Every tool you need to work with PDFs in one place'
    : section === 'image'
    ? 'Every tool you need to work with Images in one place'
    : 'Every tool you need to work with Images and PDFs in one place';

  const pageDescription = section === 'pdf'
    ? 'All PDF tools you need, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, and more with just a few clicks.'
    : section === 'image'
    ? 'All image editing tools you need, at your fingertips. All are 100% FREE and easy to use! Resize, crop, compress, convert, and more with just a few clicks.'
    : 'Every tool you need to use Images and PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, and more with just a few clicks.';

  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        {section === 'pdf' && (
          <>Every tool you need to work with <span className="text-red-500">PDFs</span> in one place</>
        )}
        {section === 'image' && (
          <>Every tool you need to work with <span className="text-red-500">Images</span> in one place</>
        )}
        {section === 'all' && (
          <>Every tool you need to work with <span className="text-red-500">Images</span> and <span className="text-red-500">PDFs</span> in one place</>
        )}
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        {pageDescription}
      </p>

      <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-colors ${activeCategory === 'All' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          All
        </button>
        {availableCategories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 text-sm md:text-base font-semibold rounded-full transition-colors ${activeCategory === category ? 'bg-red-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onSelect={() => onSelectTool(tool)} />
        ))}
      </div>

      {/* User Ratings Section */}
      <UserRatings />
    </div>
  );
};

export default HomePage;
