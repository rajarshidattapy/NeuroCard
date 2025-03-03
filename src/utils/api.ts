/**
 * API client for backend communication
 */

// Base URL for API requests
const API_BASE_URL = 'http://localhost:5000/api';

// Generic fetch function with error handling
const fetchWithErrorHandling = async (url: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// ECG data endpoints
export const ecgApi = {
  getECGData: async (startTime?: number, endTime?: number) => {
    const params = new URLSearchParams();
    if (startTime) params.append('startTime', startTime.toString());
    if (endTime) params.append('endTime', endTime.toString());
    
    return fetchWithErrorHandling(`${API_BASE_URL}/ecg?${params.toString()}`);
  },
  
  getECGAnomalies: async (startTime?: number, endTime?: number) => {
    const params = new URLSearchParams();
    if (startTime) params.append('startTime', startTime.toString());
    if (endTime) params.append('endTime', endTime.toString());
    
    return fetchWithErrorHandling(`${API_BASE_URL}/ecg/anomalies?${params.toString()}`);
  }
};

// EEG data endpoints
export const eegApi = {
  getEEGData: async (startTime?: number, endTime?: number) => {
    const params = new URLSearchParams();
    if (startTime) params.append('startTime', startTime.toString());
    if (endTime) params.append('endTime', endTime.toString());
    
    return fetchWithErrorHandling(`${API_BASE_URL}/eeg?${params.toString()}`);
  },
  
  getEEGAnomalies: async (startTime?: number, endTime?: number) => {
    const params = new URLSearchParams();
    if (startTime) params.append('startTime', startTime.toString());
    if (endTime) params.append('endTime', endTime.toString());
    
    return fetchWithErrorHandling(`${API_BASE_URL}/eeg/anomalies?${params.toString()}`);
  }
};

// Combined anomaly detection endpoints
export const anomalyApi = {
  getAnomalies: async (startTime?: number, endTime?: number) => {
    const params = new URLSearchParams();
    if (startTime) params.append('startTime', startTime.toString());
    if (endTime) params.append('endTime', endTime.toString());
    
    return fetchWithErrorHandling(`${API_BASE_URL}/anomalies?${params.toString()}`);
  },
  
  getRecommendations: async (anomalyId: string) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/anomalies/${anomalyId}/recommendations`);
  }
};

// Google Fit API endpoints
export const googleFitApi = {
  connect: async () => {
    return fetchWithErrorHandling(`${API_BASE_URL}/google-fit/connect`, { method: 'POST' });
  },
  
  disconnect: async () => {
    return fetchWithErrorHandling(`${API_BASE_URL}/google-fit/disconnect`, { method: 'POST' });
  },
  
  sync: async () => {
    return fetchWithErrorHandling(`${API_BASE_URL}/google-fit/sync`, { method: 'POST' });
  },
  
  getStatus: async () => {
    return fetchWithErrorHandling(`${API_BASE_URL}/google-fit/status`);
  }
};

// LLM API endpoints
export const llmApi = {
  getHealthRecommendations: async (data: any) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/llm/recommendations`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  getAnomalyAnalysis: async (anomalyId: string) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/llm/analysis/${anomalyId}`);
  },
  
  setApiKey: async (apiKey: string) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/llm/config`, {
      method: 'POST',
      body: JSON.stringify({ apiKey })
    });
  }
};