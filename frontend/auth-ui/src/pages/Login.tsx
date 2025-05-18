import { useState } from 'react'
import { loginUser, saveToken } from '../api/authService'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/AuthForms.css'

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { access_token } = await loginUser(email, password);
      saveToken(access_token);               // ⬅️ кладемо у cookie
      // одразу стрибаємо на мікрофронт майданчиків
      window.location.href = 'http://localhost:5174/venues';
    } catch {
      alert('Невірна пара email / пароль');
    }
  }

  return (
    <div className="auth-wrapper">
    <form className="auth-form" onSubmit={onSubmit}>
      <h2>Логін</h2>
      <input type="email"    value={email}    onChange={e=>setEmail(e.target.value)}    placeholder="Email"    required />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Пароль"   required />
      <button type="submit">Увійти</button>
      <p>Не маєте акаунта? <Link to="/register">Реєстрація</Link></p>
    </form>
    </div>
  );
}
