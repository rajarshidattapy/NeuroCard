import os
import json
import requests
from typing import Dict, Any, List, Optional

class LLMService:
    """
    Service for interacting with LLM APIs for health data analysis
    """
    
    def __init__(self):
        self.api_key = os.environ.get('LLM_API_KEY', '')
        self.model = os.environ.get('LLM_MODEL', 'nvidia/llama3-70b-instruct')
        self.api_url = 'https://openrouter.ai/api/v1/chat/completions'
    
    def set_api_key(self, api_key: str) -> None:
        """
        Set the API key for the LLM service
        
        Args:
            api_key (str): The API key to use
        """
        self.api_key = api_key
        # In a production environment, this would be stored securely
        # For now, we'll just set it in memory
    
    def set_model(self, model: str) -> None:
        """
        Set the model to use for the LLM service
        
        Args:
            model (str): The model to use
        """
        self.model = model
    
    def generate_health_recommendations(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate health recommendations based on health data
        
        Args:
            data (Dict[str, Any]): The health data to analyze
        
        Returns:
            Dict[str, Any]: The generated recommendations
        """
        if not self.api_key:
            raise ValueError("API key not set")
        
        # Extract relevant data
        ecg_data = data.get('ecgData', [])
        eeg_data = data.get('eegData', [])
        anomalies = data.get('anomalies', [])
        user_profile = data.get('userProfile', {})
        
        # Create prompt for the LLM
        prompt = self._create_health_recommendations_prompt(ecg_data, eeg_data, anomalies, user_profile)
        
        # In a real application, this would call the LLM API
        # For now, we'll return mock recommendations
        
        # Mock response for demonstration
        return {
            'analysis': 'Based on the provided health data, there are several patterns worth noting. The ECG shows minor irregularities in heart rhythm, particularly during periods of rest. The EEG data indicates elevated beta wave activity, which is often associated with stress or anxiety.',
            'recommendations': [
                {
                    'category': 'Cardiac',
                    'title': 'Monitor Heart Rate Variability',
                    'description': 'Your heart rate variability shows some concerning patterns during rest periods.',
                    'actions': [
                        'Track your heart rate during different activities',
                        'Practice deep breathing exercises for 5-10 minutes daily',
                        'Consider reducing caffeine intake'
                    ],
                    'urgency': 'medium'
                },
                {
                    'category': 'Neurological',
                    'title': 'Stress Management',
                    'description': 'Your EEG patterns suggest elevated stress levels, particularly in the evening.',
                    'actions': [
                        'Incorporate mindfulness meditation into your daily routine',
                        'Establish a consistent sleep schedule',
                        'Limit screen time before bed'
                    ],
                    'urgency': 'medium'
                },
                {
                    'category': 'General',
                    'title': 'Lifestyle Adjustments',
                    'description': 'Some general lifestyle changes could improve both cardiac and neurological health.',
                    'actions': [
                        'Aim for 30 minutes of moderate exercise daily',
                        'Stay hydrated throughout the day',
                        'Consider keeping a health journal to track symptoms'
                    ],
                    'urgency': 'low'
                }
            ],
            'warningSigns': [
                'Persistent chest pain or discomfort',
                'Severe headaches accompanied by confusion',
                'Fainting or loss of consciousness',
                'Significant changes in heart rate at rest'
            ]
        }
    
    def analyze_anomaly(self, anomaly: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze a specific anomaly and provide detailed information
        
        Args:
            anomaly (Dict[str, Any]): The anomaly to analyze
        
        Returns:
            Dict[str, Any]: The analysis of the anomaly
        """
        if not self.api_key:
            raise ValueError("API key not set")
        
        # Create prompt for the LLM
        prompt = self._create_anomaly_analysis_prompt(anomaly)
        
        # In a real application, this would call the LLM API
        # For now, we'll return mock analysis
        
        # Mock response for demonstration
        return {
            'explanation': 'This anomaly represents an irregular heart rhythm pattern that may indicate early signs of arrhythmia. The pattern shows a deviation from normal sinus rhythm with occasional premature beats.',
            'possibleCauses': [
                'Stress or anxiety',
                'Caffeine or alcohol consumption',
                'Electrolyte imbalances',
                'Sleep deprivation',
                'Underlying heart conditions'
            ],
            'riskFactors': [
                'Age over 60',
                'High blood pressure',
                'Obesity',
                'Smoking',
                'Family history of heart disease'
            ],
            'recommendations': [
                'Monitor your heart rate and rhythm regularly',
                'Practice stress reduction techniques',
                'Maintain a heart-healthy diet',
                'Ensure adequate sleep',
                'Consider consulting with a cardiologist if symptoms persist'
            ],
            'medicalAttention': 'If you experience chest pain, shortness of breath, dizziness, or fainting along with irregular heartbeats, seek medical attention immediately.'
        }
    
    def _create_health_recommendations_prompt(
        self, 
        ecg_data: List[Dict[str, Any]], 
        eeg_data: List[Dict[str, Any]], 
        anomalies: List[Dict[str, Any]], 
        user_profile: Dict[str, Any]
    ) -> str:
        """
        Create a prompt for health recommendations
        
        Args:
            ecg_data (List[Dict[str, Any]]): The ECG data
            eeg_data (List[Dict[str, Any]]): The EEG data
            anomalies (List[Dict[str, Any]]): The detected anomalies
            user_profile (Dict[str, Any]): The user profile
        
        Returns:
            str: The prompt for the LLM
        """
        prompt = "Based on the following health data, provide personalized health recommendations:\n\n"
        
        # Add anomalies to the prompt
        if anomalies:
            prompt += "Detected Anomalies:\n"
            for i, anomaly in enumerate(anomalies):
                prompt += f"{i+1}. {anomaly.get('description')} (Type: {anomaly.get('type')}, Severity: {anomaly.get('severity')})\n"
            prompt += "\n"
        
        # Add user profile to the prompt
        if user_profile:
            prompt += "User Profile:\n"
            if 'age' in user_profile:
                prompt += f"Age: {user_profile['age']}\n"
            if 'gender' in user_profile:
                prompt += f"Gender: {user_profile['gender']}\n"
            if 'medicalConditions' in user_profile and user_profile['medicalConditions']:
                prompt += f"Medical Conditions: {', '.join(user_profile['medicalConditions'])}\n"
            if 'medications' in user_profile and user_profile['medications']:
                prompt += f"Medications: {', '.join(user_profile['medications'])}\n"
            prompt += "\n"
        
        # Add data summary to the prompt
        prompt += f"ECG Data Points: {len(ecg_data)}\n"
        prompt += f"EEG Data Points: {len(eeg_data)}\n\n"
        
        # Add request for recommendations
        prompt += "Please provide:\n"
        prompt += "1. A brief analysis of the health data\n"
        prompt += "2. Specific recommendations categorized by health area (cardiac, neurological, general)\n"
        prompt += "3. Warning signs the user should watch for\n"
        
        return prompt
    
    def _create_anomaly_analysis_prompt(self, anomaly: Dict[str, Any]) -> str:
        """
        Create a prompt for anomaly analysis
        
        Args:
            anomaly (Dict[str, Any]): The anomaly to analyze
        
        Returns:
            str: The prompt for the LLM
        """
        prompt = "Please analyze the following health anomaly in detail:\n\n"
        
        # Add anomaly details to the prompt
        prompt += f"Type: {anomaly.get('type')}\n"
        prompt += f"Description: {anomaly.get('description')}\n"
        prompt += f"Severity: {anomaly.get('severity')}\n"
        if 'details' in anomaly:
            prompt += f"Details: {anomaly['details']}\n"
        prompt += "\n"
        
        # Add request for analysis
        prompt += "Please provide:\n"
        prompt += "1. A detailed explanation of what this anomaly might indicate\n"
        prompt += "2. Possible causes and risk factors\n"
        prompt += "3. Specific recommendations to address this issue\n"
        prompt += "4. When the user should consider seeking medical attention\n"
        
        return prompt
    
    def _call_llm_api(self, prompt: str, temperature: float = 0.7, max_tokens: int = 1000) -> str:
        """
        Call the LLM API with the given prompt
        
        Args:
            prompt (str): The prompt to send to the LLM
            temperature (float, optional): The temperature parameter for the LLM. Defaults to 0.7.
            max_tokens (int, optional): The maximum number of tokens to generate. Defaults to 1000.
        
        Returns:
            str: The response from the LLM
        """
        if not self.api_key:
            raise ValueError("API key not set")
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}'
        }
        
        data = {
            'model': self.model,
            'messages': [
                {
                    'role': 'system',
                    'content': 'You are a medical AI assistant specializing in cardiology and neurology. Provide accurate, helpful, and concise health recommendations based on ECG and EEG data. Always prioritize patient safety and recommend consulting healthcare professionals for serious concerns.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': temperature,
            'max_tokens': max_tokens
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=data)
            response.raise_for_status()
            
            response_data = response.json()
            return response_data['choices'][0]['message']['content']
        except Exception as e:
            print(f"Error calling LLM API: {e}")
            raise