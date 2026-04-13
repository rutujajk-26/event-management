import { Event } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || (import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
  } catch (error) {
    throw new Error(`Backend request failed: ${(error as Error).message}`);
  }

  let body: any = {};
  let text: string | null = null;
  try {
    text = await response.text();
    body = text ? JSON.parse(text) : {};
  } catch {
    body = {};
  }

  if (!response.ok) {
    const errorMessage = body?.error || body?.message || text || response.statusText || `Request failed: ${response.status}`;
    throw new Error(errorMessage);
  }

  return body.data as T;
}

export async function fetchEvents(): Promise<Event[]> {
  return request<Event[]>('/events', { method: 'GET' });
}

export async function createBooking(payload: Omit<Record<string, unknown>, 'id'>): Promise<any> {
  return request<any>('/book', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at' | 'available_seats'>): Promise<Event> {
  return request<Event>('/events', {
    method: 'POST',
    body: JSON.stringify(event),
  });
}

export async function updateEvent(eventId: string, event: Partial<Omit<Event, 'id' | 'created_at' | 'available_seats'>>): Promise<Event> {
  return request<Event>(`/events/${eventId}`, {
    method: 'PATCH',
    body: JSON.stringify(event),
  });
}

export async function deleteEvent(eventId: string): Promise<void> {
  await request<void>(`/events/${eventId}`, {
    method: 'DELETE',
  });
}
