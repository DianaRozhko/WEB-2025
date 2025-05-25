import { Link } from 'react-router-dom'
import { getUserRole } from '../utils/auth'
import './Header.css'

function handleLogout() {
  localStorage.removeItem('token');
  document.cookie = 'jwt=; max-age=0; path=/';
  window.location.href = 'http://localhost:5173/login';
}

export default function Header() {
  const isAdmin = getUserRole() === 'admin'
  return (
    <header className="header">
      <nav className="header-nav">
        <div className="nav-left">
          <Link to="/venues">Майданчики</Link>
          <Link to="/bookings">Мої бронювання</Link>
          {isAdmin && (
            <Link to="/venues" className="admin-link">Адмін-панель</Link>
          )}
        </div>
        <button onClick={handleLogout} className="logout-btn">Вийти</button>
      </nav>
    </header>
  )
}
