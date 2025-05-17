import { useEffect, useState } from 'react';
import { fetchVenues, createVenue, updateVenue } from '../api/venueService';
import { Venue, VenueType } from '../types';
import Modal from '../components/Modal';
import { getJwt, getUserRole } from '../utils/auth';      // ← ваші утиліти
import './Venues.css';

export default function Venues() {
  const [venues, setVenues]         = useState<Venue[]>([]);
  const [filter, setFilter]         = useState<VenueType | 'all'>('all');
  const [loading, setLoading]       = useState(false);

  // modal‑state
  const [isModalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]       = useState<Venue | null>(null);   // null => create

  const isAdmin = getUserRole() === 'admin';

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchVenues();
        setVenues(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ---- helpers -------------------------------------------------
  const closeModal = () => {
    setEditing(null);
    setModalOpen(false);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd   = new FormData(form);
    const payload = {
      name:        fd.get('name')        as string,
      location:    fd.get('location')    as string,
      type:        fd.get('type')        as VenueType,
      description: fd.get('description') as string,
    };

    if (editing) {
      // ----------------- UPDATE
      const updated = await updateVenue(editing.id, payload);
      setVenues(v => v.map(it => it.id === updated.id ? updated : it));
    } else {
      // ----------------- CREATE
      const created = await createVenue(payload);
      setVenues(v => [created, ...v]);
    }
    closeModal();
  }

  const visible = filter === 'all'
    ? venues
    : venues.filter(v => v.type === filter);

  // ---- UI ------------------------------------------------------
  return (
    <div className="venues-page">
      <h1>Майданчики</h1>

      {/* ---- фільтр ---- */}
      <select
        value={filter}
        onChange={e => setFilter(e.target.value as any)}
        className="type-filter"
      >
        <option value="all">Усі типи</option>
        <option value="football">Футбол</option>
        <option value="tennis">Теніс</option>
        <option value="basketball">Баскетбол</option>
        <option value="other">Інше</option>
      </select>

      {loading && <p>Завантаження…</p>}

      <div className="grid">
        {visible.map(v => (
          <div key={v.id} className="card">
            <h3>{v.name}</h3>
            <p><b>Локація:</b> {v.location}</p>
            <p><b>Тип:</b> {v.type}</p>
            <p className="descr">{v.description}</p>

            {isAdmin && (
              <button
                className="edit-btn"
                onClick={() => {
                  setEditing(v);
                  setModalOpen(true);
                }}
              >
                ✎ Редагувати
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ---- плаваюча "+" ---- */}
      {isAdmin && (
        <button
          className="fab"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          ＋
        </button>
      )}

      {/* ---- модальне вікно ---- */}
      <Modal open={isModalOpen} onClose={closeModal}>
        <form className="venue-form" onSubmit={handleSubmit}>
          <h2>{editing ? 'Редагувати' : 'Новий'} майданчик</h2>

          <input name="name" defaultValue={editing?.name} placeholder="Назва" required />
          <input name="location" defaultValue={editing?.location} placeholder="Локація" required />

          <select name="type" defaultValue={editing?.type ?? 'football'}>
            <option value="football">Футбол</option>
            <option value="tennis">Теніс</option>
            <option value="basketball">Баскетбол</option>
            <option value="other">Інше</option>
          </select>

          <textarea name="description" defaultValue={editing?.description} placeholder="Опис" />

          <div className="actions">
            <button type="submit">Зберегти</button>
            <button type="button" onClick={closeModal}>Скасувати</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
