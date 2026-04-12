import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_DIR = BASE_DIR / 'database'
DATABASE_FILE = DATABASE_DIR / 'events.db'
DEFAULT_DATABASE_URI = os.environ.get(
    'DATABASE_URL', f"sqlite:///{DATABASE_FILE.as_posix()}"
)

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'campus-tix-secret-key-2024')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JSON_SORT_KEYS = False

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = DEFAULT_DATABASE_URI

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = DEFAULT_DATABASE_URI

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

config_map = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig,
}
