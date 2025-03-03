import React, { useState, useEffect } from 'react';
import { useECGData } from '../hooks/useECGData';
import { useEEGData } from '../hooks/useEEGData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Brain, Heart, Activity } from 'lucide-react';

const DigitalTwin = () => {
  const { ecgData, ecgLoading } = useECGData();
  const { eegData, eegLoading } = useEEGData();
  const [activeView, setActiveView] = useState('combined');

  // Mock data for initial display
  const [mockData, setMockData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock data for visualization
    const generateMockData = () => {
      const data = [];
      for (let i = 0; i < 100; i++) {
        const time = i * 0.1;
        const ecgValue = Math.sin(time) * 0.5 + Math.sin(time * 2) * 0.3 + Math.random() * 0.1;
        const eegValue = Math.sin(time * 0.5) * 0.3 + Math.cos(time * 1.5) * 0.2 + Math.random() * 0.05;
        
        data.push({
          time: time.toFixed(1),
          ecg: ecgValue,
          eeg: eegValue
        });
      }
      return data;
    };

    setMockData(generateMockData());

    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMockData(prev => {
        const newData = [...prev.slice(1)];
        const lastTime = parseFloat(prev[prev.length - 1].time);
        const newTime = lastTime + 0.1;
        const ecgValue = Math.sin(newTime) * 0.5 + Math.sin(newTime * 2) * 0.3 + Math.random() * 0.1;
        const eegValue = Math.sin(newTime * 0.5) * 0.3 + Math.cos(newTime * 1.5) * 0.2 + Math.random() * 0.05;
        
        newData.push({
          time: newTime.toFixed(1),
          ecg: ecgValue,
          eeg: eegValue
        });
        
        return newData;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Digital Twin Visualization</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${activeView === 'combined' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setActiveView('combined')}
          >
            <Activity className="h-4 w-4" />
            <span>Combined</span>
          </button>
          <button 
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${activeView === 'heart' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setActiveView('heart')}
          >
            <Heart className="h-4 w-4" />
            <span>Heart</span>
          </button>
          <button 
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${activeView === 'brain' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setActiveView('brain')}
          >
            <Brain className="h-4 w-4" />
            <span>Brain</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Heart className="h-5 w-5 text-red-400 mr-2" />
            ECG Signal
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                <Legend />
                <Line type="monotone" dataKey="ecg" stroke="#ff4560" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <Brain className="h-5 w-5 text-blue-400 mr-2" />
            EEG Signal
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#555' }} />
                <Legend />
                <Line type="monotone" dataKey="eeg" stroke="#00e396" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg flex-1">
        <h3 className="text-lg font-semibold mb-2">3D Visualization</h3>
        <div className="flex items-center justify-center h-full bg-gray-900 rounded-lg">
          <div className="text-center">
            <p className="text-gray-400 mb-2">3D model visualization will be implemented here</p>
            <div className="flex justify-center space-x-4">
              <div className="flex flex-col items-center">
                <Brain className="h-16 w-16 text-blue-400" />
                <span className="mt-2">Brain</span>
              </div>
              <div className="flex flex-col items-center">
                <Heart className="h-16 w-16 text-red-400" />
                <span className="mt-2">Heart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTwin;