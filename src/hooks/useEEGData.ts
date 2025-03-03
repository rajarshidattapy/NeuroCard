import { useState, useEffect } from 'react';
import { transformECGtoEEG } from '../utils/eegEcgTransform';
import { useECGData } from './useECGData';

interface EEGDataPoint {
  timestamp: number;
  alpha: number;
  beta: number;
  theta: number;
  delta: number;
}

export const useEEGData = () => {
  const { ecgData, ecgLoading } = useECGData();
  const [eegData, setEegData] = useState<EEGDataPoint[]>([]);
  const [eegLoading, setEegLoading] = useState<boolean>(true);
  const [eegError, setEegError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEEGData = async () => {
      try {
        // In a real application, this would be an API call to your backend
        // For now, we'll simulate data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate mock EEG data
        const mockData: EEGDataPoint[] = [];
        const now = Date.now();
        
        for (let i = 0; i < 100; i++) {
          const timestamp = now - (99 - i) * 1000; // One data point per second, going back 100 seconds
          
          // Simulate different EEG wave bands
          // Alpha (8-13 Hz): Relaxed, calm
          // Beta (13-30 Hz): Alert, active thinking
          // Theta (4-8 Hz): Drowsy, meditative
          // Delta (0.5-4 Hz): Deep sleep
          
          mockData.push({
            timestamp,
            alpha: Math.sin(i * 0.1) * 0.5 + Math.random() * 0.2,
            beta: Math.cos(i * 0.15) * 0.3 + Math.random() * 0.15,
            theta: Math.sin(i * 0.05) * 0.4 + Math.random() * 0.1,
            delta: Math.cos(i * 0.03) * 0.6 + Math.random() * 0.05
          });
        }
        
        setEegData(mockData);
        setEegLoading(false);
      } catch (error) {
        console.error('Error fetching EEG data:', error);
        setEegError('Failed to fetch EEG data');
        setEegLoading(false);
      }
    };

    // If we have ECG data, transform it to EEG
    if (ecgData.length > 0) {
      const transformedData = ecgData.map(ecgPoint => {
        const eegValues = transformECGtoEEG(ecgPoint.value);
        return {
          timestamp: ecgPoint.timestamp,
          ...eegValues
        };
      });
      
      setEegData(transformedData);
      setEegLoading(false);
    } else if (!ecgLoading) {
      // If ECG data is done loading but empty, fetch mock EEG data
      fetchEEGData();
    }
    
  }, [ecgData, ecgLoading]);

  return { eegData, eegLoading, eegError };
};