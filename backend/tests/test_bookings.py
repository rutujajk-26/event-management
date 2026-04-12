import pytest
from app import create_app
from models import db, Event, Booking
from datetime import date


@pytest.fixture
def client():
    app = create_app('testing')
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            event = Event(
                id='evt-001',
                title='Cultural Fest',
                description='Annual cultural festival',
                date=date(2024, 6, 20),
                time='16:00',
                venue='Open Air Theater',
                category='Cultural',
                price=150.0,
                total_seats=500,
                available_seats=500,
                image_url='https://example.com/img.jpg',
                organizer='Student Council',
            )
            db.session.add(event)
            db.session.commit()
        yield client
        with app.app_context():
            db.drop_all()


def test_create_booking(client):
    payload = {
        'event_id': 'evt-001',
        'student_name': 'Priya Sharma',
        'email': 'priya@college.edu',
        'phone': '9876543210',
        'college_id': 'CS21B001',
        'num_tickets': 2,
    }
    res = client.post('/api/book', json=payload)
    assert res.status_code == 201
    data = res.json['data']
    assert data['student_name'] == 'Priya Sharma'
    assert data['num_tickets'] == 2
    assert data['total_amount'] == 300.0
    assert data['status'] == 'confirmed'
    assert data['booking_ref'].startswith('CTX-')


def test_booking_reduces_seats(client):
    payload = {
        'event_id': 'evt-001',
        'student_name': 'Raj Kumar',
        'email': 'raj@college.edu',
        'phone': '9123456789',
        'college_id': 'ME21B002',
        'num_tickets': 3,
    }
    client.post('/api/book', json=payload)
    res = client.get('/api/events/evt-001')
    assert res.json['data']['available_seats'] == 497


def test_booking_validation_errors(client):
    res = client.post('/api/book', json={'event_id': 'evt-001'})
    assert res.status_code == 422


def test_booking_event_not_found(client):
    payload = {
        'event_id': 'nonexistent',
        'student_name': 'Test',
        'email': 'test@test.com',
        'phone': '9000000000',
        'college_id': 'ID001',
        'num_tickets': 1,
    }
    res = client.post('/api/book', json=payload)
    assert res.status_code == 404


def test_get_bookings_by_email(client):
    payload = {
        'event_id': 'evt-001',
        'student_name': 'Ananya Singh',
        'email': 'ananya@college.edu',
        'phone': '9000000001',
        'college_id': 'EC21B003',
        'num_tickets': 1,
    }
    client.post('/api/book', json=payload)
    res = client.get('/api/bookings?email=ananya@college.edu')
    assert res.status_code == 200
    assert len(res.json['data']) == 1
