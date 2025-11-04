// API service for making requests to Flask backend

import { API_ENDPOINTS } from '../config/api';

export interface ToolInfo {
  id: string;
  name: string;
  description: string;
}

export interface UploadResponse {
  filename: string;
  message: string;
}

export interface ProcessResponse {
  filename: string;
  message: string;
}

// Generic fetch wrapper with error handling
async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred');
  }
}

// PDF API functions
export const pdfAPI = {
  async getTools(): Promise<ToolInfo[]> {
    return fetchAPI<ToolInfo[]>(API_ENDPOINTS.pdf.tools);
  },
  
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return fetchAPI<UploadResponse>(API_ENDPOINTS.pdf.upload, {
      method: 'POST',
      body: formData,
    });
  },
  
  async processFile(toolId: string, filename: string, options?: any): Promise<ProcessResponse> {
    return fetchAPI<ProcessResponse>(API_ENDPOINTS.pdf.process(toolId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename, ...options }),
    });
  },
  
  getDownloadUrl(filename: string): string {
    return API_ENDPOINTS.pdf.download(filename);
  },
};

// Image API functions
export const imageAPI = {
  async getTools(): Promise<ToolInfo[]> {
    return fetchAPI<ToolInfo[]>(API_ENDPOINTS.img.tools);
  },
  
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return fetchAPI<UploadResponse>(API_ENDPOINTS.img.upload, {
      method: 'POST',
      body: formData,
    });
  },
  
  async processFile(toolId: string, filename: string, options?: any): Promise<ProcessResponse> {
    return fetchAPI<ProcessResponse>(API_ENDPOINTS.img.process(toolId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename, ...options }),
    });
  },
  
  getDownloadUrl(filename: string): string {
    return API_ENDPOINTS.img.download(filename);
  },
};

// Health check
export async function checkHealth(): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>(API_ENDPOINTS.health);
}
