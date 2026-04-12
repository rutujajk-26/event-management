import pytest
from app import create_app
from models import db, Event
from datetime import date


@pytest.fixture
def client():
    app = create_app('testing')
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            event = Event(
                id='test-event-1',
                title='Test Tech Symposium',
                description='A test event',
                date=date(2024, 6, 15),
                time='10:00',
                venue='Main Hall',
                category='Technology',
                price=200.0,
                total_seats=100,
                available_seats=100,
                image_url='https://example.com/img.jpg',
                organizer='CS Dept',
            )
            db.session.add(event)
            db.session.commit()
        yield client
        with app.app_context():
            db.drop_all()


def test_health(client):
    res = client.get('/health')
    assert res.status_code == 200
    assert res.json['status'] == 'ok'


def test_get_events(client):
    res = client.get('/api/events')
    assert res.status_code == 200
    assert res.json['success'] is True
    assert len(res.json['data']) == 1


def test_get_event_by_id(client):
    res = client.get('/api/events/test-event-1')
    assert res.status_code == 200
    assert res.json['data']['title'] == 'Test Tech Symposium'


def test_get_event_not_found(client):
    res = client.get('/api/events/nonexistent')
    assert res.status_code == 404


def test_filter_events_by_category(client):
    res = client.get('/api/events?category=Technology')
    assert res.status_code == 200
    assert len(res.json['data']) == 1

    res = client.get('/api/events?category=Sports')
    assert res.status_code == 200
    assert len(res.json['data']) == 0
