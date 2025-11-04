import React from 'react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  onSelect: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`group flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full h-full`}
    >
      <div className={`w-16 h-16 flex items-center justify-center rounded-full ${tool.color} mb-4`}>
        <tool.Icon className={`w-8 h-8 text-white`} />
      </div>
      <h3 className="text-lg font-bold text-gray-800">{tool.name}</h3>
      <p className="text-gray-600 text-sm mt-1 flex-grow">{tool.description}</p>
    </button>
  );
};

export default ToolCard;
