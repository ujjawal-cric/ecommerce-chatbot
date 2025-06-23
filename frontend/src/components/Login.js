import React, { useState } from 'react';
import './Login.css';

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('https://ecommerce-chatbot-backend-jala.onrender.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.token) {
      setToken(data.token);
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>✨ Welcome ✨</h2>
        <input
          className="login-input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-btn" onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
