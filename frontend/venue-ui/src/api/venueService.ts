// src/api/venueService.ts
import { API_URL } from '../config'
import { getJwt }  from '../utils/auth'

export interface Venue {
  id: string
  name: string
  location: string
  type: 'football' | 'tennis' | 'basketball' | 'other'
  description?: string
  created_at: string
}

/* ───────── helpers ───────── */
const token = () => getJwt() || ''
const jsonAuthHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token()}`,
})

/* ───────── READ ───────── */
export async function fetchVenues(): Promise<Venue[]> {
  const res = await fetch(`${API_URL}/venues`, {
    headers: jsonAuthHeaders(),
  })
  if (!res.ok) throw new Error('Не вдалося отримати майданчики')
  return res.json()
}

export async function fetchVenueById(id: string): Promise<Venue> {
  const res = await fetch(`${API_URL}/venues/${id}`, {
    headers: jsonAuthHeaders(),
  })
  if (!res.ok) throw new Error('Не вдалося завантажити майданчик')
  return res.json()
}

/* ───────── CREATE ───────── */
export async function createVenue(
  data: Pick<Venue, 'name' | 'location' | 'type' | 'description'>
): Promise<Venue> {
  const res = await fetch(`${API_URL}/venues`, {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Не вдалося створити майданчик')
  return res.json()
}

/* ───────── UPDATE ───────── */
export async function updateVenue(
  id: string,
  data: Partial<Pick<Venue, 'name' | 'location' | 'type' | 'description'>>
): Promise<Venue> {
  const res = await fetch(`${API_URL}/venues/${id}`, {
    method: 'PATCH',
    headers: jsonAuthHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Не вдалося оновити майданчик')
  return res.json()
}