import { useState, useEffect } from 'react';
import { useECGData } from './useECGData';
import { useEEGData } from './useEEGData';

interface Anomaly {
  id: string;
  timestamp: string;
  type: 'ECG' | 'EEG' | 'Combined';
  severity: 'low' | 'medium' | 'high';
  description: string;
  details: string;
  status: 'active' | 'resolved';
}

export const useAnomalies = () => {
  const { ecgData } = useECGData();
  const { eegData } = useEEGData();
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectAnomalies = async () => {
      try {
        // In a real application, this would send the ECG and EEG data to your backend
        // for anomaly detection using the trained models
        // For now, we'll simulate anomaly detection
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock anomalies
        const mockAnomalies: Anomaly[] = [
          {
            id: '1',
            timestamp: new Date().toISOString(),
            type: 'ECG',
            severity: 'high',
            description: 'Irregular heartbeat pattern detected',
            details: 'The ECG shows signs of arrhythmia with irregular R-R intervals. This pattern has persisted for over 5 minutes.',
            status: 'active'
          },
          {
            id: '2',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            type: 'EEG',
            severity: 'medium',
            description: 'Unusual alpha wave activity',
            details: 'Alpha wave patterns show unusual amplitude variations during rest state. This may indicate increased stress or anxiety.',
            status: 'active'
          },
          {
            id: '3',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            type: 'Combined',
            severity: 'low',
            description: 'Minor correlation anomaly between EEG and ECG',
            details: 'The correlation between EEG and ECG patterns shows a slight deviation from the baseline. This is likely temporary but worth monitoring.',
            status: 'resolved'
          }
        ];
        
        setAnomalies(mockAnomalies);
        setLoading(false);
      } catch (error) {
        console.error('Error detecting anomalies:', error);
        setError('Failed to detect anomalies');
        setLoading(false);
      }
    };

    // Only detect anomalies if we have both ECG and EEG data
    if (ecgData.length > 0 && eegData.length > 0) {
      detectAnomalies();
    }
    
  }, [ecgData, eegData]);

  return { anomalies, loading, error };
};