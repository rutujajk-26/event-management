from flask import Blueprint

events_bp = Blueprint('events', __name__, url_prefix='/api')
bookings_bp = Blueprint('bookings', __name__, url_prefix='/api')

from . import events, bookings  # noqa: F401, E402
