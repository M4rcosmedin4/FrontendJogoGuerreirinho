import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Lobby from './rotas/Lobby';
import Logar from './rotas/Logar';
import Cadastrar from './rotas/Cadastrar';
import Client from './rotas/Client';
//import Missoes from './rotas/Lobby';
import Loja from './rotas/Loja';
import Historico from './rotas/Historico';
import Missoes from './rotas/Missoes';



class UserStatus {
  constructor(nome) {
    this.Nome = nome;
    this.Vida=100;
    this.VidaMaxima=100;
    this.BonusRegenEnergia=0;
    this.Status = {
      Dano: 20,
      Armadura:10,
      Xp : 0,
      
    };
    this.Dinheiro=50;
    this.Elmo =1;
    this.Nivel=1;
    this.Bencao=[];
    this.Score =0;
    this.Fase = 0;
    this.FaseMax = 1;
    this.Inimigo=null;
    this.VezesFase=[0,0,0,0,0];
    this.DanoDado = 0;
    this.DanoTomado=0;
    //criar sistema de missões
  }
}

function App() {
  const storedName = localStorage.getItem('userLogado');
  const [usuario, setUsuario] = useState(storedName || "");

  useEffect(() => {
    if (usuario) {
      const storedStatus = localStorage.getItem(usuario);
      if (!storedStatus) {
        const newUserStatus = new UserStatus(usuario);
        localStorage.setItem(usuario, JSON.stringify(newUserStatus));
      }
    }
  }, [usuario]);

 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Logar addUsuario={setUsuario} usuario={usuario} />} />
        <Route path="/cadastrar" element={<Cadastrar usuario={usuario} />} />
        <Route path="/client" element={<Client />}>
          <Route path="" element={<Lobby usuario={usuario}/>} />
          <Route path="historico" element={<Historico/>} />
          <Route path="loja" element={<Loja usuario={usuario}/>} />
          <Route path="missoes" element={<Missoes usuario={usuario}/>} />
        </Route>
      </Routes>
    </Router>
  );
}export default App;