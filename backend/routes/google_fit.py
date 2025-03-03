from flask import Blueprint, jsonify, request
from services.google_fit_service import GoogleFitService

google_fit_bp = Blueprint('google_fit', __name__)

# Initialize Google Fit service
google_fit_service = GoogleFitService()

@google_fit_bp.route('/google-fit/connect', methods=['POST'])
def connect_google_fit():
    """
    Connect to Google Fit API
    """
    try:
        # In a real application, this would initiate OAuth flow
        # For now, we'll simulate the connection
        auth_url = google_fit_service.get_authorization_url()
        
        return jsonify({
            'status': 'success',
            'auth_url': auth_url
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@google_fit_bp.route('/google-fit/callback', methods=['GET'])
def google_fit_callback():
    """
    Handle Google Fit OAuth callback
    Query parameters:
    - code: authorization code
    - state: state parameter for security
    """
    code = request.args.get('code')
    state = request.args.get('state')
    
    if not code:
        return jsonify({'error': 'Authorization code is required'}), 400
    
    try:
        # Exchange authorization code for access token
        token = google_fit_service.exchange_code_for_token(code, state)
        
        return jsonify({
            'status': 'success',
            'message': 'Successfully connected to Google Fit'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@google_fit_bp.route('/google-fit/disconnect', methods=['POST'])
def disconnect_google_fit():
    """
    Disconnect from Google Fit API
    """
    try:
        # Revoke access token
        google_fit_service.revoke_token()
        
        return jsonify({
            'status': 'success',
            'message': 'Successfully disconnected from Google Fit'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@google_fit_bp.route('/google-fit/sync', methods=['POST'])
def sync_google_fit():
    """
    Sync data from Google Fit API
    Request body:
    {
        "startTime": number (optional),
        "endTime": number (optional)
    }
    """
    data = request.json or {}
    
    start_time = data.get('startTime')
    end_time = data.get('endTime')
    
    try:
        # Sync data from Google Fit
        result = google_fit_service.sync_data(start_time, end_time)
        
        return jsonify({
            'status': 'success',
            'message': 'Successfully synced data from Google Fit',
            'data': result
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@google_fit_bp.route('/google-fit/status', methods=['GET'])
def get_google_fit_status():
    """
    Get Google Fit connection status
    """
    try:
        # Get connection status
        status = google_fit_service.get_status()
        
        return jsonify(status)
    except Exception as e:
        return jsonify({'error': str(e)}), 500