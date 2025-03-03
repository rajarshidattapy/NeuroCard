import React, { useState } from 'react';
import { useGoogleFitData } from '../hooks/useGoogleFitData';
import { RefreshCw, Check, X, Link, Settings, Database } from 'lucide-react';

const ApiConnections = () => {
  const { connected: googleFitConnected, connect: connectGoogleFit, disconnect: disconnectGoogleFit, lastSync, loading } = useGoogleFitData();
  const [llmConnected, setLlmConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleLlmConnect = () => {
    if (apiKey.trim()) {
      setLlmConnected(true);
    }
  };

  const handleLlmDisconnect = () => {
    setLlmConnected(false);
    setApiKey('');
  };

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleString();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">API Connections</h2>
        <button 
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-red-400" />
              <h3 className="text-lg font-semibold">Google Fit</h3>
            </div>
            <div className={`px-2 py-1 rounded text-xs flex items-center ${googleFitConnected ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {googleFitConnected ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <X className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            Connect to Google Fit to import your health data for analysis and conversion.
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <span>Last synchronized:</span>
            <span>{formatLastSync(lastSync)}</span>
          </div>
          
          <div className="flex space-x-2">
            {googleFitConnected ? (
              <>
                <button 
                  className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center space-x-1"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync Now</span>
                </button>
                <button 
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 rounded"
                  onClick={disconnectGoogleFit}
                  disabled={loading}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button 
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center space-x-1"
                onClick={connectGoogleFit}
                disabled={loading}
              >
                <Link className="h-4 w-4" />
                <span>Connect</span>
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-blue-400" />
              <h3 className="text-lg font-semibold">LLM API</h3>
            </div>
            <div className={`px-2 py-1 rounded text-xs flex items-center ${llmConnected ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
              {llmConnected ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <X className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-4">
            Connect to OpenRouter Nvidia LLaMA API for health alerts and recommendations.
          </p>
          
          {!llmConnected ? (
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">API Key</label>
              <input 
                type="password" 
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
              <span>API Status:</span>
              <span className="text-green-400">Operational</span>
            </div>
          )}
          
          <div className="flex space-x-2">
            {llmConnected ? (
              <button 
                className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 rounded"
                onClick={handleLlmDisconnect}
              >
                Disconnect
              </button>
            ) : (
              <button 
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center space-x-1"
                onClick={handleLlmConnect}
                disabled={!apiKey.trim()}
              >
                <Link className="h-4 w-4" />
                <span>Connect</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">API Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Data Refresh Interval</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="5">Every 5 minutes</option>
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every hour</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Data Retention Period</label>
              <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="autoSync" 
                className="h-4 w-4 bg-gray-700 border border-gray-600 rounded focus:ring-blue-500"
                defaultChecked
              />
              <label htmlFor="autoSync" className="ml-2 text-sm text-gray-400">
                Enable automatic synchronization
              </label>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <button 
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiConnections;