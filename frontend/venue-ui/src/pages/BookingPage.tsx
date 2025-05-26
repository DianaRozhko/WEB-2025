import React, { useEffect, useState } from 'react'
import { fetchVenues, fetchSlots, createBooking, fetchMyBookings, cancelBooking, generateSlots, getUserId } from '../api/bookingService'
import { getUserRole } from '../utils/auth'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import Header from '../components/Header'
import './Bookings.css'

export default function BookingPage() {
  const [venues, setVenues] = useState<any[]>([])
  const [selectedVenue, setSelectedVenue] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [slots, setSlots] = useState<any[]>([])
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [myBookings, setMyBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [slotDuration, setSlotDuration] = useState(60)
  const isAdmin = getUserRole() === 'admin'
  const userId = getUserId()

  useEffect(() => { fetchVenues().then(setVenues) }, [])
  useEffect(() => {
    if (selectedVenue && selectedDate) {
      const dateStr = selectedDate.toISOString().slice(0,10)
      fetchSlots(selectedVenue, dateStr).then(setSlots)
      setSelectedSlots([])
    } else {
      setSlots([])
    }
  }, [selectedVenue, selectedDate])
  useEffect(() => { if(userId) fetchMyBookings(userId).then(setMyBookings) }, [userId])

  function areSlotsContinuous(selected: string[], allSlots: any[]) {
    if (selected.length < 1) return false
    const chain = selected.map(id => allSlots.find(s => s.id === id))
    chain.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    for (let i = 1; i < chain.length; ++i) {
      if (chain[i-1].end_time !== chain[i].start_time) return false
    }
    return true
  }

  async function handleBooking() {
    if (!selectedVenue || selectedSlots.length < 1) return alert('Оберіть хоча б один слот')
    if (!areSlotsContinuous(selectedSlots, slots)) return alert('Слоти мають бути підряд без розривів у часі!')
    setLoading(true)
    try {
      await createBooking({ venue_id: selectedVenue, slot_ids: selectedSlots })
      setSelectedSlots([])
      fetchMyBookings(userId).then(setMyBookings)
      fetchSlots(selectedVenue, selectedDate!.toISOString().slice(0,10)).then(setSlots)
      alert('Бронювання створено')
    } catch(e:any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleGenerateSlots() {
    if (!selectedVenue) return alert('Оберіть майданчик')
    setLoading(true)
    try {
      await generateSlots(selectedVenue, 'month', slotDuration)
      alert('Слоти згенеровано')
      if (selectedDate) fetchSlots(selectedVenue, selectedDate.toISOString().slice(0,10)).then(setSlots)
    } catch(e:any) { alert(e.message) }
    finally { setLoading(false) }
  }

  // Для календаря: тільки сьогодні і майбутнє
  const today = new Date()
  today.setHours(0,0,0,0)

  return (
    <div>
      <Header />
      <div className="booking-root">
        <h2 className="booking-title">Бронювання майданчиків</h2>
        <div className="booking-main">
          {/* Форма бронювання */}
          <div className="booking-card">
            <label>
              <b>Майданчик:</b>
              <select
                className="venue-select"
                value={selectedVenue}
                onChange={e => { setSelectedVenue(e.target.value); setSelectedDate(null); }}
              >
                <option value="">Виберіть...</option>
                {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </label>
            {selectedVenue && (
              <>
                <div style={{margin:'1rem 0'}}>
                  <b>Дата:</b>
                  <Calendar
                    value={selectedDate}
                    onChange={d => setSelectedDate(d as Date)}
                    minDate={today}
                  />
                </div>
                {selectedDate && (
                  <>
                    <b>Часові слоти (доступні):</b>
                    <div className="slots-grid">
                      {slots.map(s =>
                        <button
                          key={s.id}
                          className={`slot-btn${selectedSlots.includes(s.id) ? ' selected' : ''}`}
                          onClick={() => {
                            if (!selectedSlots.includes(s.id))
                              setSelectedSlots([...selectedSlots, s.id])
                            else
                              setSelectedSlots(selectedSlots.filter(id => id !== s.id))
                          }}
                        >
                          {s.start_time.slice(11,16)}-{s.end_time.slice(11,16)}
                        </button>
                      )}
                    </div>
                    <button
                      className="booking-btn"
                      disabled={loading || selectedSlots.length<1}
                      onClick={handleBooking}>
                      Забронювати
                    </button>
                    {isAdmin && (
                      <div style={{marginTop:18}}>
                        <input
                          type="number"
                          min={30}
                          max={120}
                          step={15}
                          className="duration-input"
                          value={slotDuration}
                          onChange={e=>setSlotDuration(Number(e.target.value))}
                        /> хвилин на слот
                        <button
                          className="gen-btn"
                          disabled={loading}
                          onClick={handleGenerateSlots}>
                          Генерувати слоти на місяць (адмін)
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          {/* Мої бронювання */}
          <div className="mybookings-col">
            <h3 style={{marginBottom:18}}>Мої бронювання</h3>
            <ul style={{padding:0, listStyle:'none'}}>
              {myBookings.map(b =>
                <li key={b.id} className="booking-card-item">
                  <div>
                    <b>{venues.find(v=>v.id===b.venue_id)?.name || b.venue_id}</b><br/>
                    {b.start_time.slice(0,10)} {b.start_time.slice(11,16)}—{b.end_time.slice(11,16)} <br/>
                    <span style={{fontSize:13, color:'#555'}}>Статус: {b.status}</span>
                  </div>
                  {b.status === 'confirmed' &&
                    <button
                      className="cancel-btn"
                      onClick={() => cancelBooking(b.id).then(() => fetchMyBookings(userId).then(setMyBookings))}>
                      Скасувати
                    </button>
                  }
                </li>
              )}
              {myBookings.length === 0 && <li style={{padding:'20px 0',textAlign:'center',color:'#999'}}>В тебе поки нема бронювань…</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
