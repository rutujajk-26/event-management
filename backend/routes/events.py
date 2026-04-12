import logging
from datetime import date
from flask import Blueprint, jsonify, request
from models import db, Event

logger = logging.getLogger(__name__)
events_bp = Blueprint('events', __name__)


@events_bp.route('/events', methods=['GET'])
def get_events():
    """Fetch all events with optional category filter."""
    try:
        category = request.args.get('category')
        query = Event.query.order_by(Event.date.asc())
        if category:
            query = query.filter_by(category=category)
        events = query.all()
        logger.info(f'Fetched {len(events)} events')
        return jsonify({'success': True, 'data': [e.to_dict() for e in events]}), 200
    except Exception as exc:
        logger.error(f'Error fetching events: {exc}')
        return jsonify({'success': False, 'error': str(exc)}), 500


@events_bp.route('/events/<string:event_id>', methods=['GET'])
def get_event(event_id: str):
    """Fetch a single event by ID."""
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'success': False, 'error': 'Event not found'}), 404
        return jsonify({'success': True, 'data': event.to_dict()}), 200
    except Exception as exc:
        logger.error(f'Error fetching event {event_id}: {exc}')
        return jsonify({'success': False, 'error': str(exc)}), 500


@events_bp.route('/events', methods=['POST'])
def create_event():
    """Create a new event (admin use)."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Request body required'}), 400

        required = ['title', 'date', 'venue', 'price', 'total_seats']
        missing = [f for f in required if f not in data]
        if missing:
            return jsonify({'success': False, 'error': f'Missing fields: {missing}'}), 400

        from datetime import date
        event = Event(
            title=data['title'],
            description=data.get('description', ''),
            date=date.fromisoformat(data['date']),
            time=data.get('time', '10:00'),
            venue=data['venue'],
            category=data.get('category', 'General'),
            price=float(data['price']),
            total_seats=int(data['total_seats']),
            available_seats=int(data['total_seats']),
            image_url=data.get('image_url', ''),
            organizer=data.get('organizer', ''),
        )
        db.session.add(event)
        db.session.commit()
        logger.info(f'Created event: {event.id}')
        return jsonify({'success': True, 'data': event.to_dict()}), 201
    except Exception as exc:
        db.session.rollback()
        logger.error(f'Error creating event: {exc}')
        return jsonify({'success': False, 'error': str(exc)}), 500

@events_bp.route('/events/<string:event_id>', methods=['PATCH'])
def update_event(event_id: str):
    """Update an existing event."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Request body required'}), 400

        event = Event.query.get(event_id)
        if not event:
            return jsonify({'success': False, 'error': 'Event not found'}), 404

        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'date' in data:
            event.date = date.fromisoformat(data['date'])
        if 'time' in data:
            event.time = data['time']
        if 'venue' in data:
            event.venue = data['venue']
        if 'category' in data:
            event.category = data['category']
        if 'price' in data:
            event.price = float(data['price'])

        if 'total_seats' in data:
            new_total = int(data['total_seats'])
            seat_delta = new_total - event.total_seats
            event.total_seats = new_total
            event.available_seats = max(0, min(new_total, event.available_seats + seat_delta))

        if 'image_url' in data:
            event.image_url = data['image_url']
        if 'organizer' in data:
            event.organizer = data['organizer']

        db.session.commit()
        logger.info(f'Updated event: {event.id}')
        return jsonify({'success': True, 'data': event.to_dict()}), 200
    except Exception as exc:
        db.session.rollback()
        logger.error(f'Error updating event: {exc}')
        return jsonify({'success': False, 'error': str(exc)}), 500


@events_bp.route('/events/<string:event_id>', methods=['DELETE'])
def delete_event(event_id: str):
    """Delete an event."""
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'success': False, 'error': 'Event not found'}), 404

        db.session.delete(event)
        db.session.commit()
        logger.info(f'Deleted event: {event.id}')
        return jsonify({'success': True, 'data': None}), 200
    except Exception as exc:
        db.session.rollback()
        logger.error(f'Error deleting event: {exc}')
        return jsonify({'success': False, 'error': str(exc)}), 500