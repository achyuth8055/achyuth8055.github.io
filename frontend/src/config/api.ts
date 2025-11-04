// API Configuration for connecting React frontend to Flask backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const API_ENDPOINTS = {
  // Health check
  health: `${API_BASE_URL}/health`,
  
  // PDF endpoints
  pdf: {
    tools: `${API_BASE_URL}/pdf/tools`,
    upload: `${API_BASE_URL}/pdf/upload`,
    process: (toolId: string) => `${API_BASE_URL}/pdf/process/${toolId}`,
    download: (filename: string) => `${API_BASE_URL}/pdf/download/${filename}`,
  },
  
  // Image endpoints
  img: {
    tools: `${API_BASE_URL}/img/tools`,
    upload: `${API_BASE_URL}/img/upload`,
    process: (toolId: string) => `${API_BASE_URL}/img/process/${toolId}`,
    download: (filename: string) => `${API_BASE_URL}/img/download/${filename}`,
  },
};

export default API_BASE_URL;
