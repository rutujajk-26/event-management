import os
import sqlite3

path = os.path.join(os.path.dirname(__file__), '..', 'database', 'events.db')
print('db exists', os.path.exists(path), path)
if os.path.exists(path):
    conn = sqlite3.connect(path)
    cur = conn.cursor()
    cur.execute("SELECT count(*) FROM sqlite_master WHERE type='table' AND name='events'")
    print('events table exists', cur.fetchone()[0])
    try:
        cur.execute('SELECT count(*) FROM events')
        print('events count', cur.fetchone()[0])
        cur.execute('SELECT id,title,date,venue FROM events LIMIT 5')
        for row in cur.fetchall():
            print(row)
    except Exception as e:
        print('query error', e)
    conn.close()
