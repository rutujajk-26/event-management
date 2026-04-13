"""
CampusTix - College Event Ticket Booking System
Flask REST API Backend
"""

import os
import logging
from datetime import date
from pathlib import Path
from flask import Flask, jsonify
from flask_cors import CORS
from models import db, Event
from config import config_map, DATABASE_DIR
from routes.events import events_bp
from routes.bookings import bookings_bp

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
)
logger = logging.getLogger(__name__)


def seed_events() -> None:
    sample_events = [
        {
            'title': 'TechFest 2024 - Annual Tech Symposium',
            'description': 'Join us for the biggest tech event of the year! Featuring keynote speakers from top tech companies, hands-on workshops on AI/ML, web development, and cybersecurity. Network with industry professionals and showcase your projects at the innovation expo.',
            'date': '2024-04-15',
            'time': '09:00',
            'venue': 'Main Auditorium, Block A',
            'category': 'Technology',
            'price': 200.0,
            'total_seats': 500,
            'available_seats': 342,
            'image_url': 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
            'organizer': 'Department of Computer Science',
        },
        {
            'title': 'Kulturama 2024 - Annual Cultural Festival',
            'description': 'Three days of music, dance, drama, and art celebrating our diverse cultural heritage. Watch stunning performances from student groups, participate in competitions, and enjoy live concerts by top artists. A festival of colors, sounds, and traditions!',
            'date': '2024-04-20',
            'time': '16:00',
            'venue': 'Open Air Theater, Main Campus',
            'category': 'Cultural',
            'price': 150.0,
            'total_seats': 1000,
            'available_seats': 673,
            'image_url': 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
            'organizer': 'Student Cultural Council',
        },
        {
            'title': 'Sportanza 2024 - Annual Sports Meet',
            'description': 'The ultimate college sports extravaganza with events in cricket, football, basketball, athletics, and more. Cheer for your department teams, witness thrilling competitions, and celebrate sportsmanship. Opening ceremony with a grand parade of all teams!',
            'date': '2024-04-25',
            'time': '07:00',
            'venue': 'College Sports Complex',
            'category': 'Sports',
            'price': 100.0,
            'total_seats': 2000,
            'available_seats': 1456,
            'image_url': 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=800',
            'organizer': 'Sports Committee & Physical Education Dept',
        },
        {
            'title': 'BizPlan Challenge 2024 - Business Competition',
            'description': 'Present your innovative business ideas to a panel of industry veterans and venture capitalists. Categories include tech startups, social enterprises, and product innovations. Winner receives seed funding of ₹1,00,000! Pre-registration for teams of 2-4 members required.',
            'date': '2024-05-01',
            'time': '10:00',
            'venue': 'Conference Hall A, Management Block',
            'category': 'Business',
            'price': 300.0,
            'total_seats': 200,
            'available_seats': 87,
            'image_url': 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
            'organizer': 'MBA Department & Entrepreneurship Cell',
        },
        {
            'title': 'Art Expo 2024 - Fine Arts Exhibition',
            'description': 'A curated exhibition of student artwork spanning painting, sculpture, photography, digital art, and installation art. Over 200 pieces from students across all departments. Special live art performances and interactive installations throughout the day.',
            'date': '2024-05-05',
            'time': '11:00',
            'venue': 'College Art Gallery, Creative Block',
            'category': 'Arts',
            'price': 50.0,
            'total_seats': 300,
            'available_seats': 218,
            'image_url': 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800',
            'organizer': 'Department of Fine Arts',
        },
        {
            'title': 'Science & Innovation Fair 2024',
            'description': 'Witness groundbreaking research and experiments by our brightest science students. Projects spanning physics, chemistry, biology, environmental science, and robotics. Guest lectures from research scientists and live demonstrations. Open to all science enthusiasts!',
            'date': '2024-05-10',
            'time': '09:30',
            'venue': 'Science Exhibition Hall, Science Block',
            'category': 'Science',
            'price': 100.0,
            'total_seats': 500,
            'available_seats': 389,
            'image_url': 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=800',
            'organizer': 'Science Departments Consortium',
        },
    ]
    for item in sample_events:
        event = Event(
            title=item['title'],
            description=item['description'],
            date=date.fromisoformat(item['date']),
            time=item['time'],
            venue=item['venue'],
            category=item['category'],
            price=item['price'],
            total_seats=item['total_seats'],
            available_seats=item['available_seats'],
            image_url=item['image_url'],
            organizer=item['organizer'],
        )
        db.session.add(event)
    db.session.commit()


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

        if env != 'testing' and Event.query.count() == 0:
            logger.info('No events found in database; seeding sample featured events.')
            seed_events()

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
