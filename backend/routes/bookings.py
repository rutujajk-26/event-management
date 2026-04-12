import logging
import random
import string
from flask import Blueprint, jsonify, request
from models import db, Booking, Event

logger = logging.getLogger(__name__)
bookings_bp = Blueprint('bookings', __name__)


def generate_booking_ref() -> str:
    chars = string.ascii_uppercase + string.digits
    return 'CTX-' + ''.join(random.choices(chars, k=8))


def validate_booking_data(data: dict) -> list[str]:
    errors = []
    if not data.get('student_name', '').strip():
        errors.append('student_name is required')
    if not data.get('email', '').strip() or '@' not in data.get('email', ''):
        errors.append('Valid email is required')
    if not data.get('phone', '').strip():
        errors.append('phone is required')
    if not data.get('college_id', '').strip():
        errors.append('college_id is required')
    num_tickets = data.get('num_tickets', 0)
    if not isinstance(num_tickets, int) or num_tickets < 1:
        errors.append('num_tickets must be a positive integer')
    if isinstance(num_tickets, int) and num_tickets > 5:
        errors.append('Maximum 5 tickets per booking')
    return errors


@bookings_bp.route('/book', methods=['POST'])
def create_booking():
    """Create a new ticket booking."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'Request body required'}), 400

        errors = validate_booking_data(data)
        if errors:
            return jsonify({'success': False, 'error': 'Validation failed', 'details': errors}), 422

        event = Event.query.get(data.get('event_id'))
        if not event:
            return jsonify({'success': False, 'error': 'Event not found'}), 404

        num_tickets = int(data['num_tickets'])
        if event.available_seats < num_tickets:
            return jsonify({
                'success': False,
                'error': f'Only {event.available_seats} seats available'
            }), 409

        booking_ref = generate_booking_ref()
        while Booking.query.filter_by(booking_ref=booking_ref).first():
            booking_ref = generate_booking_ref()

        total_amount = event.price * num_tickets

        booking = Booking(
            event_id=event.id,
            student_name=data['student_name'].strip(),
            email=data['email'].strip().lower(),
            phone=data['phone'].strip(),
            college_id=data.get('college_id', '').strip(),
            num_tickets=num_tickets,
            total_amount=total_amount,
            booking_ref=booking_ref,
            status='confirmed',
        )

        event.available_seats -= num_tickets
        db.session.add(booking)
        db.session.commit()

        logger.info(f'Booking created: {booking_ref} for event {event.id}')
        return jsonify({'success': True, 'data': booking.to_dict()}), 201

    except Exception as exc:
        db.session.rollback()
        logger.error(f'Error creating booking: {exc}')
        return jsonify({'success': False, 'error': str(exc)}), 500


@bookings_bp.route('/bookings', methods=['GET'])
def get_bookings():
    """Fetch bookings (filter by email query param)."""
    try:
        email = request.args.get('email')
        query = Booking.query.order_by(Booking.created_at.desc())
        if email:
            query = query.filter_by(email=email.lower().strip())
        bookings = query.all()
        return jsonify({'success': True, 'data': [b.to_dict() for b in bookings]}), 200
    except Exception as exc:
        logger.error(f'Error fetching bookings: {exc}')
        return jsonify({'success': False, 'error': str(exc)}), 500


@bookings_bp.route('/bookings/<string:ref>', methods=['GET'])
def get_booking_by_ref(ref: str):
    """Fetch a booking by its reference code."""
    try:
        booking = Booking.query.filter_by(booking_ref=ref.upper()).first()
        if not booking:
            return jsonify({'success': False, 'error': 'Booking not found'}), 404
        return jsonify({'success': True, 'data': booking.to_dict()}), 200
    except Exception as exc:
        logger.error(f'Error fetching booking {ref}: {exc}')
        return jsonify({'success': False, 'error': str(exc)}), 500
