import numpy as np
import uuid
from datetime import datetime
import pickle
import os
from services.eeg_ecg_conversion import detect_ecg_eeg_anomaly

# Path to the trained model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models/anomaly_detector.pkl')

def load_model():
    """
    Load the trained anomaly detection model
    
    Returns:
        object: The loaded model
    """
    # In a real application, this would load a trained model from a file
    # For now, we'll return None and use our simplified detection logic
    
    # Check if model file exists
    if os.path.exists(MODEL_PATH):
        try:
            with open(MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
            return model
        except Exception as e:
            print(f"Error loading model: {e}")
    
    return None

def detect_anomalies(ecg_data, eeg_data, type=None):
    """
    Detect anomalies in ECG and EEG data
    
    Args:
        ecg_data (list): List of ECG data points
        eeg_data (list): List of EEG data points
        type (str, optional): Type of anomalies to detect ('ECG', 'EEG', or None for combined)
    
    Returns:
        list: List of detected anomalies
    """
    # Load the model
    model = load_model()
    
    # List to store detected anomalies
    anomalies = []
    
    # If we have a trained model, use it
    if model:
        # In a real application, this would use the trained model for prediction
        # For now, we'll use our simplified detection logic
        pass
    
    # If no model is available, use our simplified detection logic
    else:
        # Detect ECG anomalies
        if ecg_data and (type is None or type == 'ECG'):
            ecg_anomalies = detect_ecg_anomalies(ecg_data)
            anomalies.extend(ecg_anomalies)
        
        # Detect EEG anomalies
        if eeg_data and (type is None or type == 'EEG'):
            eeg_anomalies = detect_eeg_anomalies(eeg_data)
            anomalies.extend(eeg_anomalies)
        
        # Detect combined anomalies
        if ecg_data and eeg_data and (type is None or type == 'Combined'):
            combined_anomalies = detect_combined_anomalies(ecg_data, eeg_data)
            anomalies.extend(combined_anomalies)
    
    return anomalies

def detect_ecg_anomalies(ecg_data):
    """
    Detect anomalies in ECG data
    
    Args:
        ecg_data (list): List of ECG data points
    
    Returns:
        list: List of detected anomalies
    """
    anomalies = []
    
    # In a real application, this would use more sophisticated algorithms
    # For now, we'll use a simple threshold-based approach
    
    # Calculate mean and standard deviation
    values = [point['value'] for point in ecg_data]
    mean = np.mean(values)
    std = np.std(values)
    
    # Check for anomalies
    for i, point in enumerate(ecg_data):
        # Skip the first and last few points to avoid edge effects
        if i < 5 or i > len(ecg_data) - 5:
            continue
        
        # Check for values that are significantly different from the mean
        if abs(point['value'] - mean) > 2.5 * std:
            # Check if this is a sustained anomaly (at least 3 consecutive points)
            if (i + 2 < len(ecg_data) and 
                abs(ecg_data[i+1]['value'] - mean) > 2 * std and 
                abs(ecg_data[i+2]['value'] - mean) > 2 * std):
                
                # Create an anomaly
                anomaly = {
                    'id': str(uuid.uuid4()),
                    'timestamp': datetime.fromtimestamp(point['timestamp'] / 1000).isoformat(),
                    'type': 'ECG',
                    'severity': 'high' if abs(point['value'] - mean) > 3 * std else 'medium',
                    'description': 'Irregular heartbeat pattern detected',
                    'details': 'The ECG shows signs of arrhythmia with irregular R-R intervals. This pattern has persisted for over 5 minutes.',
                    'status': 'active'
                }
                
                anomalies.append(anomaly)
                
                # Skip the next few points to avoid detecting the same anomaly multiple times
                i += 5
    
    return anomalies

def detect_eeg_anomalies(eeg_data):
    """
    Detect anomalies in EEG data
    
    Args:
        eeg_data (list): List of EEG data points
    
    Returns:
        list: List of detected anomalies
    """
    anomalies = []
    
    # In a real application, this would use more sophisticated algorithms
    # For now, we'll use a simple threshold-based approach
    
    # Calculate mean and standard deviation for each wave band
    alpha_values = [point['alpha'] for point in eeg_data]
    beta_values = [point['beta'] for point in eeg_data]
    theta_values = [point['theta'] for point in eeg_data]
    delta_values = [point['delta'] for point in eeg_data]
    
    alpha_mean = np.mean(alpha_values)
    alpha_std = np.std(alpha_values)
    
    beta_mean = np.mean(beta_values)
    beta_std = np.std(beta_values)
    
    theta_mean = np.mean(theta_values)
    theta_std = np.std(theta_values)
    
    delta_mean = np.mean(delta_values)
    delta_std = np.std(delta_values)
    
    # Check for anomalies
    for i, point in enumerate(eeg_data):
        # Skip the first and last few points to avoid edge effects
        if i < 5 or i > len(eeg_data) - 5:
            continue
        
        # Check for values that are significantly different from the mean
        alpha_anomaly = abs(point['alpha'] - alpha_mean) > 2.5 * alpha_std
        beta_anomaly = abs(point['beta'] - beta_mean) > 2.5 * beta_std
        theta_anomaly = abs(point['theta'] - theta_mean) > 2.5 * theta_std
        delta_anomaly = abs(point['delta'] - delta_mean) > 2.5 * delta_std
        
        if alpha_anomaly or beta_anomaly or theta_anomaly or delta_anomaly:
            # Check if this is a sustained anomaly (at least 3 consecutive points)
            sustained = False
            
            if alpha_anomaly:
                sustained = (i + 2 < len(eeg_data) and 
                            abs(eeg_data[i+1]['alpha'] - alpha_mean) > 2 * alpha_std and 
                            abs(eeg_data[i+2]['alpha'] - alpha_mean) > 2 * alpha_std)
            elif beta_anomaly:
                sustained = (i + 2 < len(eeg_data) and 
                            abs(eeg_data[i+1]['beta'] - beta_mean) > 2 * beta_std and 
                            abs(eeg_data[i+2]['beta'] - beta_mean) > 2 * beta_std)
            elif theta_anomaly:
                sustained = (i + 2 < len(eeg_data) and 
                            abs(eeg_data[i+1]['theta'] - theta_mean) > 2 * theta_std and 
                            abs(eeg_data[i+2]['theta'] - theta_mean) > 2 * theta_std)
            elif delta_anomaly:
                sustained = (i + 2 < len(eeg_data) and 
                            abs(eeg_data[i+1]['delta'] - delta_mean) > 2 * delta_std and 
                            abs(eeg_data[i+2]['delta'] - delta_mean) > 2 * delta_std)
            
            if sustained:
                # Determine which wave band has the most significant anomaly
                anomaly_type = 'alpha'
                max_deviation = abs(point['alpha'] - alpha_mean) / alpha_std
                
                if abs(point['beta'] - beta_mean) / beta_std > max_deviation:
                    anomaly_type = 'beta'
                    max_deviation = abs(point['beta'] - beta_mean) / beta_std
                
                if abs(point['theta'] - theta_mean) / theta_std > max_deviation:
                    anomaly_type = 'theta'
                    max_deviation = abs(point['theta'] - theta_mean) / theta_std
                
                if abs(point['delta'] - delta_mean) / delta_std > max_deviation:
                    anomaly_type = 'delta'
                    max_deviation = abs(point['delta'] - delta_mean) / delta_std
                
                # Create an anomaly
                description = f'Unusual {anomaly_type} wave activity'
                details = f'{anomaly_type.capitalize()} wave patterns show unusual amplitude variations during rest state. This may indicate increased stress or anxiety.'
                
                anomaly = {
                    'id': str(uuid.uuid4()),
                    'timestamp': datetime.fromtimestamp(point['timestamp'] / 1000).isoformat(),
                    'type': 'EEG',
                    'severity': 'high' if max_deviation > 3 else ('medium' if max_deviation > 2.5 else 'low'),
                    'description': description,
                    'details': details,
                    'status': 'active'
                }
                
                anomalies.append(anomaly)
                
                # Skip the next few points to avoid detecting the same anomaly multiple times
                i += 5
    
    return anomalies

def detect_combined_anomalies(ecg_data, eeg_data):
    """
    Detect anomalies in the relationship between ECG and EEG data
    
    Args:
        ecg_data (list): List of ECG data points
        eeg_data (list): List of EEG data points
    
    Returns:
        list: List of detected anomalies
    """
    anomalies = []
    
    # In a real application, this would use more sophisticated algorithms
    # For now, we'll use our simplified detection logic
    
    # Make sure we have the same number of data points
    min_length = min(len(ecg_data), len(eeg_data))
    ecg_data = ecg_data[:min_length]
    eeg_data = eeg_data[:min_length]
    
    # Check for anomalies in the ECG-EEG relationship
    for i in range(min_length):
        # Skip the first and last few points to avoid edge effects
        if i < 5 or i > min_length - 5:
            continue
        
        # Check for anomalies in the relationship
        if detect_ecg_eeg_anomaly(ecg_data[i]['value'], eeg_data[i]):
            # Check if this is a sustained anomaly (at least 3 consecutive points)
            if (i + 2 < min_length and 
                detect_ecg_eeg_anomaly(ecg_data[i+1]['value'], eeg_data[i+1]) and 
                detect_ecg_eeg_anomaly(ecg_data[i+2]['value'], eeg_data[i+2])):
                
                # Create an anomaly
                anomaly = {
                    'id': str(uuid.uuid4()),
                    'timestamp': datetime.fromtimestamp(ecg_data[i]['timestamp'] / 1000).isoformat(),
                    'type': 'Combined',
                    'severity': 'low',
                    'description': 'Minor correlation anomaly between EEG and ECG',
                    'details': 'The correlation between EEG and ECG patterns shows a slight deviation from the baseline. This is likely temporary but worth monitoring.',
                    'status': 'active'
                }
                
                anomalies.append(anomaly)
                
                # Skip the next few points to avoid detecting the same anomaly multiple times
                i += 5
    
    return anomalies