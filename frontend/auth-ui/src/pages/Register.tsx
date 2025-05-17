import { useState } from 'react';
import { registerUser } from '../api/authService';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AuthForms.css';

export default function Register() {
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate=useNavigate();

  async function handleSubmit(e:React.FormEvent){
    e.preventDefault();
    try{
      await registerUser(name,email,password);
      alert('Реєстрація успішна!');
      navigate('/login');
    }catch(err:any){alert(err.message||'Помилка');}
  }

  return(
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Реєстрація</h2>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Імʼя" required/>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required/>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Пароль" required/>
      <button>Зареєструватися</button>
      <p>Вже маєте акаунт? <Link to="/login">Увійти</Link></p>
    </form>);
}
