/**
 * Custom Hook for Celery Task Polling
 * ====================================
 * Polls backend for async task status and provides progress updates
 */

import { useState, useEffect, useCallback } from 'react';

export interface TaskStatus {
  state: 'PENDING' | 'PROGRESS' | 'SUCCESS' | 'FAILURE';
  status: string;
  progress: number;
  output_filename?: string;
  download_url?: string;
  error?: string;
}

interface UseTaskPollingOptions {
  taskId: string | null;
  onComplete?: (result: TaskStatus) => void;
  onError?: (error: string) => void;
  pollInterval?: number; // milliseconds
  baseUrl?: string;
}

export function useTaskPolling({
  taskId,
  onComplete,
  onError,
  pollInterval = 1000,
  baseUrl = '/api'
}: UseTaskPollingOptions) {
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollTask = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${baseUrl}/pdf/task/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: TaskStatus = await response.json();
      setStatus(data);

      // Handle completion
      if (data.state === 'SUCCESS') {
        setIsPolling(false);
        onComplete?.(data);
      } else if (data.state === 'FAILURE') {
        setIsPolling(false);
        const errorMsg = data.status || 'Task failed';
        setError(errorMsg);
        onError?.(errorMsg);
      }

      return data;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to poll task status';
      setError(errorMsg);
      setIsPolling(false);
      onError?.(errorMsg);
      return null;
    }
  }, [baseUrl, onComplete, onError]);

  useEffect(() => {
    if (!taskId || !isPolling) return;

    const intervalId = setInterval(async () => {
      const result = await pollTask(taskId);
      
      // Stop polling if task is complete or failed
      if (result && (result.state === 'SUCCESS' || result.state === 'FAILURE')) {
        clearInterval(intervalId);
      }
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [taskId, isPolling, pollInterval, pollTask]);

  const startPolling = useCallback(() => {
    setIsPolling(true);
    setError(null);
    setStatus(null);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  const reset = useCallback(() => {
    setIsPolling(false);
    setStatus(null);
    setError(null);
  }, []);

  return {
    status,
    isPolling,
    error,
    startPolling,
    stopPolling,
    reset
  };
}

// Helper function to upload file and start task
export async function uploadAndStartTask(
  file: File,
  endpoint: string,
  additionalData?: Record<string, any>
): Promise<{ task_id: string; status: string }> {
  const formData = new FormData();
  formData.append('file', file);

  // Add additional form data if provided
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}
