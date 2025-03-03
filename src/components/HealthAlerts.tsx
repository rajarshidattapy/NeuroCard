import React, { useState } from 'react';
import { useAnomalies } from '../hooks/useAnomalies';
import { AlertTriangle, Check, X, ChevronDown, ChevronUp, Clock } from 'lucide-react';

const HealthAlerts = () => {
  const { anomalies, loading } = useAnomalies();
  const [expandedAlerts, setExpandedAlerts] = useState<string[]>([]);

  // Mock data for initial display
  const mockAnomalies = [
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

  const toggleAlert = (id: string) => {
    if (expandedAlerts.includes(id)) {
      setExpandedAlerts(expandedAlerts.filter(alertId => alertId !== id));
    } else {
      setExpandedAlerts([...expandedAlerts, id]);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Health Alerts</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span>All Alerts</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span>Active</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2">
            <X className="h-4 w-4" />
            <span>Resolved</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {mockAnomalies.map(anomaly => (
              <div 
                key={anomaly.id} 
                className={`bg-gray-800 rounded-lg overflow-hidden ${anomaly.status === 'resolved' ? 'opacity-70' : ''}`}
              >
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => toggleAlert(anomaly.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`h-3 w-3 rounded-full ${getSeverityColor(anomaly.severity)}`}></div>
                    <div>
                      <h3 className="font-semibold">{anomaly.description}</h3>
                      <div className="text-sm text-gray-400 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimestamp(anomaly.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm px-2 py-1 rounded bg-gray-700">
                      {anomaly.type}
                    </span>
                    <span className="text-sm px-2 py-1 rounded bg-gray-700 capitalize">
                      {anomaly.status}
                    </span>
                    {expandedAlerts.includes(anomaly.id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                </div>
                
                {expandedAlerts.includes(anomaly.id) && (
                  <div className="p-4 border-t border-gray-700 bg-gray-900">
                    <p className="mb-4">{anomaly.details}</p>
                    <div className="flex justify-end space-x-2">
                      {anomaly.status === 'active' && (
                        <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm">
                          Mark as Resolved
                        </button>
                      )}
                      <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthAlerts;