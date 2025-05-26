import { Link, useLocation } from 'react-router-dom'
import { getUserRole } from '../utils/auth'
import './Header.css'

function handleLogout() {
    localStorage.removeItem('token');
    document.cookie = 'jwt=; max-age=0; path=/';
    window.location.href = 'http://localhost:5173/login';
}

export default function Header() {
  const isAdmin = getUserRole() === 'admin'
  const { pathname } = useLocation();
  return (
    <header className="header">
      <div className="header-inner">
        <nav className="header-nav">
          <Link to="/venues" className={`header-link${pathname==='/venues' ? ' active' : ''}`}>Майданчики</Link>
          <Link to="/bookings" className={`header-link${pathname==='/bookings' ? ' active' : ''}`}>Мої бронювання</Link>
          {isAdmin && (
            <Link to="/venues" className={`header-link${pathname==='/admin' ? ' active' : ''}`}>Адмін-панель</Link>
          )}
        </nav>
        <div className="header-spacer" />
        <button onClick={handleLogout} className="header-logout-btn">Вийти</button>
      </div>
    </header>
  )
}
