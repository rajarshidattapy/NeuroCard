import React, { useState } from 'react';
import { Brain, Heart, Activity, ChevronDown, ChevronUp, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';

const Recommendations = () => {
  const [expandedRecommendations, setExpandedRecommendations] = useState<string[]>([]);

  // Mock data for initial display
  const mockRecommendations = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      category: 'Cardiac',
      title: 'Irregular Heart Rate Pattern Detected',
      description: 'Based on your ECG data from the past 24 hours, we have detected periods of irregular heart rhythm. This pattern may indicate early signs of arrhythmia.',
      recommendations: [
        'Consider scheduling a check-up with your cardiologist',
        'Reduce caffeine intake for the next 48 hours',
        'Monitor your heart rate during physical activities',
        'Ensure you are getting adequate sleep (7-8 hours)'
      ],
      source: 'AI Analysis + LLM',
      confidence: 0.87
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      category: 'Neurological',
      title: 'Elevated Stress Patterns',
      description: 'Your EEG patterns over the past week show increased beta wave activity, which is often associated with elevated stress levels.',
      recommendations: [
        'Incorporate 10-15 minutes of meditation daily',
        'Practice deep breathing exercises when feeling overwhelmed',
        'Consider reducing screen time before bed',
        'Maintain regular physical activity to help reduce stress'
      ],
      source: 'EEG Analysis',
      confidence: 0.92
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      category: 'Combined',
      title: 'Sleep Quality Improvement Needed',
      description: 'Analysis of your nighttime EEG and ECG patterns indicates disrupted sleep cycles and potential sleep apnea episodes.',
      recommendations: [
        'Maintain a consistent sleep schedule',
        'Avoid screens 1 hour before bedtime',
        'Consider sleeping on your side rather than your back',
        'If symptoms persist, consult with a sleep specialist'
      ],
      source: 'Combined Analysis',
      confidence: 0.78
    }
  ];

  const toggleRecommendation = (id: string) => {
    if (expandedRecommendations.includes(id)) {
      setExpandedRecommendations(expandedRecommendations.filter(recId => recId !== id));
    } else {
      setExpandedRecommendations([...expandedRecommendations, id]);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Cardiac':
        return <Heart className="h-5 w-5 text-red-400" />;
      case 'Neurological':
        return <Brain className="h-5 w-5 text-blue-400" />;
      case 'Combined':
        return <Activity className="h-5 w-5 text-purple-400" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Health Recommendations</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-400" />
            <span>Cardiac</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2">
            <Brain className="h-4 w-4 text-blue-400" />
            <span>Neurological</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center space-x-2">
            <Activity className="h-4 w-4 text-purple-400" />
            <span>Combined</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-4">
          {mockRecommendations.map(recommendation => (
            <div 
              key={recommendation.id} 
              className="bg-gray-800 rounded-lg overflow-hidden"
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => toggleRecommendation(recommendation.id)}
              >
                <div className="flex items-center space-x-4">
                  {getCategoryIcon(recommendation.category)}
                  <div>
                    <h3 className="font-semibold">{recommendation.title}</h3>
                    <div className="text-sm text-gray-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTimestamp(recommendation.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm px-2 py-1 rounded bg-gray-700">
                    {recommendation.category}
                  </span>
                  <span className={`text-sm ${getConfidenceColor(recommendation.confidence)}`}>
                    {Math.round(recommendation.confidence * 100)}% confidence
                  </span>
                  {expandedRecommendations.includes(recommendation.id) ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </div>
              
              {expandedRecommendations.includes(recommendation.id) && (
                <div className="p-4 border-t border-gray-700 bg-gray-900">
                  <p className="mb-4">{recommendation.description}</p>
                  
                  <h4 className="font-semibold mb-2">Recommendations:</h4>
                  <ul className="list-disc pl-5 mb-4 space-y-1">
                    {recommendation.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Source: {recommendation.source}
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-full hover:bg-gray-700" title="Helpful">
                        <ThumbsUp className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-full hover:bg-gray-700" title="Not Helpful">
                        <ThumbsDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;