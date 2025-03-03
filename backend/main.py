from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from routes.health_data import health_data_bp
from routes.llm_analysis import llm_analysis_bp
from routes.google_fit import google_fit_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(health_data_bp, url_prefix='/api')
app.register_blueprint(llm_analysis_bp, url_prefix='/api')
app.register_blueprint(google_fit_bp, url_prefix='/api')

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({
        'status': 'operational',
        'version': '1.0.0',
        'environment': os.environ.get('FLASK_ENV', 'development')
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)