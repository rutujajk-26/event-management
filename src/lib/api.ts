import { Event } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || '/api';

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

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || body.message || `Request failed: ${response.status}`);
  }
  return body.data as T;
}

export async function fetchEvents(): Promise<Event[]> {
  return request<Event[]>('/events', { method: 'GET' });
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
