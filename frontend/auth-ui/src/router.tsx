import { createBrowserRouter } from 'react-router-dom'
import Login    from './pages/Login'
import Register from './pages/Register'
import { NotFound, RouteError } from './pages/NotFound'




export const router = createBrowserRouter([
  {
    path: '/',
    element: <Register />,
    errorElement: <RouteError />,
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <RouteError />,
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <RouteError />,
  },
  { path: '*', element: <NotFound /> },
])