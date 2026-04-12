"""
CampusTix - College Event Ticket Booking System
Flask REST API Backend
"""

import os
import logging
from pathlib import Path
from flask import Flask, jsonify
from flask_cors import CORS
from models import db
from config import config_map, DATABASE_DIR
from routes.events import events_bp
from routes.bookings import bookings_bp

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
)
logger = logging.getLogger(__name__)


def create_app(env: str = 'default') -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_map[env])

    CORS(app, resources={r'/api/*': {'origins': '*'}})

    db.init_app(app)

    app.register_blueprint(events_bp, url_prefix='/api')
    app.register_blueprint(bookings_bp, url_prefix='/api')

    with app.app_context():
        DATABASE_DIR.mkdir(parents=True, exist_ok=True)
        db.create_all()
        logger.info(f'Database tables initialized at {DATABASE_DIR}')

    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({'status': 'ok', 'service': 'CampusTix API'}), 200

    @app.route('/', methods=['GET'])
    def root():
        return jsonify({
            'service': 'CampusTix API',
            'version': '1.0.0',
            'endpoints': [
                'GET /api/events',
                'GET /api/events/<id>',
                'POST /api/events',
                'POST /api/book',
                'GET /api/bookings',
                'GET /api/bookings/<ref>',
                'GET /health',
            ],
        }), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'success': False, 'error': 'Endpoint not found'}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({'success': False, 'error': 'Method not allowed'}), 405

    @app.errorhandler(500)
    def internal_error(e):
        logger.error(f'Internal server error: {e}')
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

    return app


if __name__ == '__main__':
    env = os.environ.get('FLASK_ENV', 'development')
    app = create_app(env)
    port = int(os.environ.get('PORT', 5000))
    logger.info(f'Starting CampusTix API on port {port}')
    app.run(host='0.0.0.0', port=port)
