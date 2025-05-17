import { createBrowserRouter } from 'react-router-dom'
import Venues      from './pages/Venues'
import EditVenue   from './pages/EditVenue'
import { getJwt }  from './utils/auth'
import { JSX }     from 'react'
import { NotFound } from './pages/NoFound'


/** Guard: якщо токена немає – робимо *повний* редирект і нічого не рендеримо */
function protect(element: JSX.Element) {
  if (getJwt()) return element
  window.location.replace('http://localhost:5173/login')
  return null
}

export const router = createBrowserRouter([
  { path: '/',           element: protect(<Venues />) },
  { path: '/venues',     element: protect(<Venues />) },
  { path: '/venues/:id', element: protect(<EditVenue />) },

  // fallback 404
  { path: '*', element: <NotFound /> },
])