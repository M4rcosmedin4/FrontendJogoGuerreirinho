import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"

function Logar({ addUsuario,usuario}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{ 
        const response = await axios.post('http://localhost:8800/login',{email,password})
        addUsuario(response.data.name)
        localStorage.setItem('userLogado', response.data.name);
        navigate('/client')
    }
    catch(err){
        setError('Credenciais inválidas')
    }

  };

  useEffect(() => {
    if (usuario.trim() !== "") {
      navigate('/client');
    }
  }, []);

  const rapido=()=>{
    setEmail('te@gmail.com')
    setPassword('dasv6262')
  }

  return (
    <div>
      <h2>Logar-se</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <br />
        <label>Senha:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <br />
        <button type="submit">Logar</button>
      </form>
      {error && <p>{error}</p>}
      {usuario}
      <button onClick={rapido}>login desenvolvimento</button>
    </div>
  );
}

export default Logar;
