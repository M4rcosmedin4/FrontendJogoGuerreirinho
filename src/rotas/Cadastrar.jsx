import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cadastrar({usuario}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8800/cadastro', { username, email, password })
      setMessage(response.data);
    } catch (error) {
      setMessage('Erro ao cadastrar usuário');
    }
  };

  useEffect(() => {
    if (usuario.trim() !== "") {
      navigate('/client');
    }
  }, []);


  return (
    <div>
      <h2>Cadastrar-se</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <br />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <label>Senha:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Cadastrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Cadastrar;
