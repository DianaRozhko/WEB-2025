import React, { useEffect, useState } from 'react'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { fetchVenueById, updateVenue, Venue } from '../api/venueService'
import { getJwt, getUserRole } from '../utils/auth'

export default function EditVenue() {
  const { id } = useParams<{ id: string }>()
  const nav    = useNavigate()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [form,  setForm]  = useState({
    name: '',
    location: '',
    type: 'other',
    description: '',
  })
  const [error, setError] = useState<string | null>(null)
  const role  = getUserRole()
  const token = getJwt() || ''

  useEffect(() => {
    if (id && token) {
      fetchVenueById(id, token)
        .then((v) => {
          setVenue(v)
          setForm({
            name: v.name,
            location: v.location,
            type: v.type,
            description: v.description || '',
          })
        })
        .catch((e) => setError(e.message))
    }
  }, [id, token])

  if (role !== 'admin') return <Navigate to="/venues" replace />
  if (error) return <div className="error">Помилка: {error}</div>
  if (!venue) return <div>Завантаження…</div>

  const handleChange = (e: React.ChangeEvent<any>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateVenue(id!, form, token)
      alert('Майданчик оновлено')
      nav('/venues')
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h1>Редагувати майданчик</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Назва
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Локація
          <input name="location" value={form.location} onChange={handleChange} required />
        </label>
        <label>
          Тип
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="football">Football</option>
            <option value="tennis">Tennis</option>
            <option value="basketball">Basketball</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Опис
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>
        <button type="submit">Зберегти</button>
      </form>
    </div>
  )
}