import React, { useEffect, useState } from 'react';
import { Tool } from '../types';

interface ProcessingPageProps {
  tool: Tool;
  onComplete: (success: boolean) => void;
}

const messages = [
    "Uploading files...",
    "Analyzing documents...",
    "Applying changes...",
    "Almost done...",
    "Finalizing..."
];

const ProcessingPage: React.FC<ProcessingPageProps> = ({ tool, onComplete }) => {
    const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
        setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
    }, 1000);

    const timer = setTimeout(() => {
      // Simulate a random processing failure
      const isSuccess = Math.random() > 0.2; // 80% chance of success
      onComplete(isSuccess);
    }, 5000); // Simulate a 5-second processing time

    return () => {
        clearInterval(messageInterval);
        clearTimeout(timer);
    }
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-16">
      <div className="relative w-24 h-24">
        <div className={`absolute inset-0 rounded-full ${tool.color} opacity-25`}></div>
        <div className={`absolute inset-0 rounded-full ${tool.color} animate-ping`}></div>
        <tool.Icon className={`w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white`} />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mt-8">
        {tool.name.replace('PDF', '')}ing PDFs
      </h2>
      <p className="text-gray-600 mt-4 text-lg">{messages[messageIndex]}</p>
    </div>
  );
};

export default ProcessingPage;
