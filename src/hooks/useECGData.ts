import { useState, useEffect } from 'react';

interface ECGDataPoint {
  timestamp: number;
  value: number;
}

export const useECGData = () => {
  const [ecgData, setEcgData] = useState<ECGDataPoint[]>([]);
  const [ecgLoading, setEcgLoading] = useState<boolean>(true);
  const [ecgError, setEcgError] = useState<string | null>(null);

  useEffect(() => {
    const fetchECGData = async () => {
      try {
        // In a real application, this would be an API call to your backend
        // For now, we'll simulate data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock ECG data
        const mockData: ECGDataPoint[] = [];
        const now = Date.now();
        
        for (let i = 0; i < 100; i++) {
          const timestamp = now - (99 - i) * 1000; // One data point per second, going back 100 seconds
          
          // Simulate ECG waveform (simplified)
          // In reality, ECG has P, Q, R, S, T waves with specific characteristics
          const baseValue = Math.sin(i * 0.2) * 0.5; // Base sine wave
          const rWave = i % 10 === 0 ? 1.0 : 0; // R peak every 10 points
          const noise = Math.random() * 0.1; // Small random noise
          
          mockData.push({
            timestamp,
            value: baseValue + rWave + noise
          });
        }
        
        setEcgData(mockData);
        setEcgLoading(false);
      } catch (error) {
        console.error('Error fetching ECG data:', error);
        setEcgError('Failed to fetch ECG data');
        setEcgLoading(false);
      }
    };

    fetchECGData();
    
    // Set up interval to simulate real-time data
    const interval = setInterval(() => {
      setEcgData(prevData => {
        if (prevData.length === 0) return prevData;
        
        const newData = [...prevData.slice(1)];
        const lastTimestamp = prevData[prevData.length - 1].timestamp;
        
        // Generate new data point
        const baseValue = Math.sin(Date.now() * 0.0002) * 0.5;
        const rWave = Date.now() % 10000 < 1000 ? 1.0 : 0; // R peak approximately every second
        const noise = Math.random() * 0.1;
        
        newData.push({
          timestamp: lastTimestamp + 1000,
          value: baseValue + rWave + noise
        });
        
        return newData;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { ecgData, ecgLoading, ecgError };
};