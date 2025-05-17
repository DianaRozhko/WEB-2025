import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  sub: string
  role?: 'admin' | 'user'
}

/** Повертає JWT з cookie `jwt=` або null */
export function getJwt(): string | null {
  const m = document.cookie.match(/(?:^|;\s*)jwt=([^;]+)/)
  return m ? decodeURIComponent(m[1]) : null
}

/** true, якщо токен присутній */
export function isAuthenticated(): boolean {
  return !!getJwt()
}

/** Роль користувача, що зберігається у payload токена. */
export function getUserRole(): 'admin' | 'user' {
  const token = getJwt()
  if (!token) return 'user'
  try {
    const payload = jwtDecode<JwtPayload>(token)
    return payload.role || 'user'
  } catch {
    return 'user'
  }
}

/** Сумісний псевдонім – для старого коду */
export const getAuthToken = getJwt