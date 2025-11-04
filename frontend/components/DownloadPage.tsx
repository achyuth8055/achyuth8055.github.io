
import React, { useState } from 'react';
import { Tool } from '../types';
import { DownloadIcon, HomeIcon, StarIcon } from './icons';

interface DownloadPageProps {
  tool: Tool;
  downloadUrl: string;
  fileName: string;
  onBackToHome: () => void;
}

const DownloadPage: React.FC<DownloadPageProps> = ({ tool, downloadUrl, fileName, onBackToHome }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (rate: number) => {
    setRating(rate);
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-16">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Task completed successfully!</h1>
      <p className="text-xl text-gray-700 mb-8">
        Your files have been processed with the {tool.name} tool.
      </p>
      
      <a
        href={downloadUrl}
        download={fileName}
        className={`inline-flex items-center gap-4 px-12 py-6 text-2xl font-bold text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${tool.color} ${tool.hoverColor}`}
      >
        <DownloadIcon className="w-8 h-8" />
        Download {tool.name.replace('PDF', '')}ed PDF
      </a>

      <div className="mt-16 w-full max-w-md p-6 bg-white rounded-lg shadow-md transition-all duration-500 animate-fade-in">
        {!submitted ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Rate your experience</h2>
            <div className="flex justify-center items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none"
                  aria-label={`Rate ${star} out of 5 stars`}
                >
                  <StarIcon
                    className={`w-10 h-10 transition-colors duration-200 cursor-pointer ${
                      (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">Your feedback helps us improve our service.</p>
          </>
        ) : (
          <div className="text-center py-4">
            <h2 className="text-2xl font-bold text-green-500">Thank you for your feedback!</h2>
            <p className="text-gray-600 mt-2">We appreciate you taking the time to help us improve.</p>
          </div>
        )}
      </div>
      
      <button
        onClick={onBackToHome}
        className="mt-12 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <HomeIcon className="w-5 h-5"/>
        Back to Home
      </button>
    </div>
  );
};

export default DownloadPage;
