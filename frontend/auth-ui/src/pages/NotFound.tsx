import React from 'react'
import { Link, useRouteError } from 'react-router-dom'

export function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <h1>404 – Сторінку не знайдено</h1>
      <p>
        Можливо, ви перейшли за застарілим посиланням або ввели адресу вручну.
        <br />
        <Link to="/">Повернутися на головну</Link>
      </p>
    </div>
  )
}

export function RouteError() {
  const error = useRouteError() as any
  console.error(error)
  return (
    <div style={{ textAlign: 'center', marginTop: 80 }}>
      <h1>Упс… 😕</h1>
      <p>Щось пішло не так.</p>
      <pre style={{ whiteSpace: 'pre-wrap', color: '#c53030' }}>
        {error?.statusText || error?.message || String(error)}
      </pre>
      <p>
        <Link to="/">На головну</Link>
      </p>
    </div>
  )
}