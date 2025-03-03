/**
 * LLM API client for OpenRouter Nvidia LLaMA integration
 */

// Base URL for OpenRouter API
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

// Default model to use
const DEFAULT_MODEL = 'nvidia/llama3-70b-instruct';

// Interface for LLM request options
interface LLMRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// Interface for health data to send to LLM
interface HealthData {
  ecgData?: any[];
  eegData?: any[];
  anomalies?: any[];
  userProfile?: {
    age?: number;
    gender?: string;
    medicalConditions?: string[];
    medications?: string[];
  };
}

// LLM API client
export class LLMClient {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  /**
   * Generate health recommendations based on health data
   */
  async generateHealthRecommendations(
    healthData: HealthData,
    options: LLMRequestOptions = {}
  ) {
    const prompt = this.createHealthRecommendationsPrompt(healthData);
    return this.generateCompletion(prompt, options);
  }
  
  /**
   * Analyze an anomaly and provide detailed explanation
   */
  async analyzeAnomaly(
    anomaly: any,
    healthData: HealthData,
    options: LLMRequestOptions = {}
  ) {
    const prompt = this.createAnomalyAnalysisPrompt(anomaly, healthData);
    return this.generateCompletion(prompt, options);
  }
  
  /**
   * Generate a completion from the LLM
   */
  private async generateCompletion(
    prompt: string,
    options: LLMRequestOptions = {}
  ) {
    try {
      const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'NeuroCardiac Digital Twin'
        },
        body: JSON.stringify({
          model: options.model || DEFAULT_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are a medical AI assistant specializing in cardiology and neurology. Provide accurate, helpful, and concise health recommendations based on ECG and EEG data. Always prioritize patient safety and recommend consulting healthcare professionals for serious concerns.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('LLM API request failed:', error);
      throw error;
    }
  }
  
  /**
   * Create a prompt for health recommendations
   */
  private createHealthRecommendationsPrompt(healthData: HealthData): string {
    // In a real application, this would format the health data in a way that's optimal for the LLM
    // For now, we'll create a simplified prompt
    
    let prompt = 'Based on the following health data, provide personalized health recommendations:\n\n';
    
    if (healthData.anomalies && healthData.anomalies.length > 0) {
      prompt += 'Detected Anomalies:\n';
      healthData.anomalies.forEach((anomaly, index) => {
        prompt += `${index + 1}. ${anomaly.description} (${anomaly.type}, Severity: ${anomaly.severity})\n`;
      });
      prompt += '\n';
    }
    
    if (healthData.userProfile) {
      prompt += 'User Profile:\n';
      if (healthData.userProfile.age) prompt += `Age: ${healthData.userProfile.age}\n`;
      if (healthData.userProfile.gender) prompt += `Gender: ${healthData.userProfile.gender}\n`;
      
      if (healthData.userProfile.medicalConditions && healthData.userProfile.medicalConditions.length > 0) {
        prompt += `Medical Conditions: ${healthData.userProfile.medicalConditions.join(', ')}\n`;
      }
      
      if (healthData.userProfile.medications && healthData.userProfile.medications.length > 0) {
        prompt += `Medications: ${healthData.userProfile.medications.join(', ')}\n`;
      }
      
      prompt += '\n';
    }
    
    prompt += 'Please provide:\n';
    prompt += '1. A brief analysis of the health data\n';
    prompt += '2. Specific recommendations to address any detected issues\n';
    prompt += '3. General health advice based on the overall patterns\n';
    prompt += '4. Any warning signs the user should watch for\n';
    
    return prompt;
  }
  
  /**
   * Create a prompt for anomaly analysis
   */
  private createAnomalyAnalysisPrompt(anomaly: any, healthData: HealthData): string {
    // In a real application, this would format the anomaly data in a way that's optimal for the LLM
    // For now, we'll create a simplified prompt
    
    let prompt = `Please analyze the following health anomaly in detail:\n\n`;
    
    prompt += `Anomaly Type: ${anomaly.type}\n`;
    prompt += `Description: ${anomaly.description}\n`;
    prompt += `Severity: ${anomaly.severity}\n`;
    prompt += `Details: ${anomaly.details}\n\n`;
    
    if (healthData.userProfile) {
      prompt += 'User Profile:\n';
      if (healthData.userProfile.age) prompt += `Age: ${healthData.userProfile.age}\n`;
      if (healthData.userProfile.gender) prompt += `Gender: ${healthData.userProfile.gender}\n`;
      
      if (healthData.userProfile.medicalConditions && healthData.userProfile.medicalConditions.length > 0) {
        prompt += `Medical Conditions: ${healthData.userProfile.medicalConditions.join(', ')}\n`;
      }
      
      if (healthData.userProfile.medications && healthData.userProfile.medications.length > 0) {
        prompt += `Medications: ${healthData.userProfile.medications.join(', ')}\n`;
      }
      
      prompt += '\n';
    }
    
    prompt += 'Please provide:\n';
    prompt += '1. A detailed explanation of what this anomaly might indicate\n';
    prompt += '2. Potential causes and risk factors\n';
    prompt += '3. Specific recommendations to address this issue\n';
    prompt += '4. When the user should consider seeking medical attention\n';
    
    return prompt;
  }
}

// Export a function to create a new LLM client
export const createLLMClient = (apiKey: string) => {
  return new LLMClient(apiKey);
};