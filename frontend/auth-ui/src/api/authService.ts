// auth-ui/src/api/authService.ts
const API = 'http://localhost:3002';

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${API}/users/register`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ name, email, password })
  });
  if (!res.ok) throw new Error('✖ registration failed');
  return res.json();                 // { access_token }
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API}/users/login`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('✖ login failed');
  return res.json();                 // { access_token }
}

/** Загальний хелпер – кладемо токен у cookie на 1 день */
export function saveToken(token: string) {
  // SameSite=Lax аби надсилалась і GET‑ам до gateway
  document.cookie = `jwt=${token}; max-age=${60 * 60 * 24}; path=/; SameSite=Lax`;
}
