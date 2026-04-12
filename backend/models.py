import uuid
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def generate_uuid():
    return str(uuid.uuid4())


class Event(db.Model):
    __tablename__ = 'events'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False, default='')
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(10), nullable=False, default='10:00')
    venue = db.Column(db.String(200), nullable=False, default='')
    category = db.Column(db.String(50), nullable=False, default='General')
    price = db.Column(db.Float, nullable=False, default=0.0)
    total_seats = db.Column(db.Integer, nullable=False, default=100)
    available_seats = db.Column(db.Integer, nullable=False, default=100)
    image_url = db.Column(db.Text, nullable=False, default='')
    organizer = db.Column(db.String(200), nullable=False, default='')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    bookings = db.relationship('Booking', backref='event', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time,
            'venue': self.venue,
            'category': self.category,
            'price': self.price,
            'total_seats': self.total_seats,
            'available_seats': self.available_seats,
            'image_url': self.image_url,
            'organizer': self.organizer,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<Event {self.title}>'


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.String(36), primary_key=True, default=generate_uuid)
    event_id = db.Column(db.String(36), db.ForeignKey('events.id'), nullable=False)
    student_name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False, default='')
    college_id = db.Column(db.String(50), nullable=False, default='')
    num_tickets = db.Column(db.Integer, nullable=False, default=1)
    total_amount = db.Column(db.Float, nullable=False, default=0.0)
    booking_ref = db.Column(db.String(20), nullable=False, unique=True)
    status = db.Column(db.String(20), nullable=False, default='confirmed')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'student_name': self.student_name,
            'email': self.email,
            'phone': self.phone,
            'college_id': self.college_id,
            'num_tickets': self.num_tickets,
            'total_amount': self.total_amount,
            'booking_ref': self.booking_ref,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f'<Booking {self.booking_ref}>'
