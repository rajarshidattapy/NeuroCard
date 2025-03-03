import React, { useState } from 'react';
import DigitalTwin from './DigitalTwin';
import HealthAlerts from './HealthAlerts';
import ApiConnections from './ApiConnections';
import Recommendations from './Recommendations';
import { Brain, Heart, AlertTriangle, Activity, Settings } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('twin');

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="https://i.imgur.com/OpEOQQp.png" alt="NeuroCard Logo" className="h-8 w-8" />
            <h1 className="text-xl font-bold">NeuroCard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-700">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex">
        <nav className="w-16 bg-gray-800 border-r border-gray-700">
          <div className="flex flex-col items-center py-4 space-y-6">
            <button
              className={`p-3 rounded-lg ${activeTab === 'twin' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('twin')}
              title="Digital Twin"
            >
              <Activity className="h-6 w-6" />
            </button>
            <button
              className={`p-3 rounded-lg ${activeTab === 'alerts' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('alerts')}
              title="Health Alerts"
            >
              <AlertTriangle className="h-6 w-6" />
            </button>
            <button
              className={`p-3 rounded-lg ${activeTab === 'api' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('api')}
              title="API Connections"
            >
              <Settings className="h-6 w-6" />
            </button>
            <button
              className={`p-3 rounded-lg ${activeTab === 'recommendations' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              onClick={() => setActiveTab('recommendations')}
              title="Recommendations"
            >
              <Brain className="h-6 w-6" />
            </button>
          </div>
        </nav>

        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'twin' && <DigitalTwin />}
          {activeTab === 'alerts' && <HealthAlerts />}
          {activeTab === 'api' && <ApiConnections />}
          {activeTab === 'recommendations' && <Recommendations />}
        </div>
      </main>

      <footer className="bg-gray-800 p-2 border-t border-gray-700 text-center text-sm text-gray-400">
        NeuroCard © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Dashboard;