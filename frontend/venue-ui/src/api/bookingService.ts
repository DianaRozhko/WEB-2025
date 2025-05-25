import { API_URL } from '../config'
import { getJwt } from '../utils/auth'
import { jwtDecode } from 'jwt-decode'

const jsonAuthHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getJwt() || ''}`,
})

export function getUserId() {
  const token = getJwt()
  if (!token) return null
  try {
    const payload = jwtDecode(token)
    return (payload as any).sub
  } catch {
    return null
  }
}

export async function fetchVenues() {
  const res = await fetch(`${API_URL}/venues`, { headers: jsonAuthHeaders() })
  if (!res.ok) throw new Error('Не вдалося отримати майданчики')
  return res.json()
}

export async function fetchSlots(venueId: string, date: string) {
  const res = await fetch(`${API_URL}/venues/${venueId}/slots`, { headers: jsonAuthHeaders() })
  if (!res.ok) throw new Error('Не вдалося отримати слоти')
  const slots = await res.json()
  return slots.filter((s: any) => s.is_available && s.start_time.startsWith(date))
}

export async function createBooking({ venue_id, slot_ids }: { venue_id: string, slot_ids: string[] }) {
  const user_id = getUserId()
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ user_id, venue_id, slot_ids }),
  })
  if (!res.ok) throw new Error('Не вдалося створити бронювання')
  return res.json()
}

export async function fetchMyBookings(user_id: string) {
  const res = await fetch(`${API_URL}/bookings/${user_id}`, { headers: jsonAuthHeaders() })
  if (!res.ok) throw new Error('Не вдалося отримати ваші бронювання')
  return res.json()
}

export async function cancelBooking(id: string) {
  const res = await fetch(`${API_URL}/bookings/${id}`, { method: 'DELETE', headers: jsonAuthHeaders() })
  if (!res.ok) throw new Error('Не вдалося скасувати бронювання')
  return res.json()
}

export async function generateSlots(venueId: string, period: 'month', slotDurationMinutes: number) {
  const res = await fetch(`${API_URL}/venues/${venueId}/generate-slots`, {
    method: 'POST',
    headers: jsonAuthHeaders(),
    body: JSON.stringify({ venueId, period, slotDurationMinutes }),
  })
  if (!res.ok) throw new Error('Не вдалося згенерувати слоти')
  return res.json()
}
