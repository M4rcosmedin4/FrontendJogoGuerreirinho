import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Jogo from "./Jogo";
import './Lobby.css'

const Lobby = ({ usuario }) => {
  const [statusPartida, setStatusPartida] = useState({
    "Nome": "Provisorio",
    "Status": {
      "provisorio": 0
    },
    "Vida": 100,
    "Atributos": {
      "provisorio": 0
    },
    "Elmo":"Branco",
    "Fase": 0,
    "Score":0,
    "FaseMax": 1,
    "Inimigo": null,
    "VezesFase":[0,0,0,0,0],
    "Dinheiro":0
  });

  let Fase = statusPartida.Fase;
  let FaseMax = statusPartida.FaseMax;
  let Vida = statusPartida.Vida;
  let VezesFase = statusPartida.VezesFase;
  let Score = statusPartida.Score;
  let bonusRegenEnergia =statusPartida.BonusRegenEnergia
  let dinheiro = statusPartida.Dinheiro
  let nivel = statusPartida?.Nivel; 

  useEffect(() => {
    setTimeout(() => {
      setStatusPartida(JSON.parse(localStorage.getItem(usuario)));
    }, 1000);
  }, [usuario]);

  const navigate = useNavigate();

  useEffect(() => {
    if (usuario=== "") {
      navigate('/');
    }
  }, [usuario, navigate]);

  const escolherInimigo = (fase) => {
    let random = Math.random() * 100;

    switch(fase) {
      case 1:
        return random < 90 ? 'Slime' : 'Esqueleto';
      case 2:
        return random < 60 ? 'Slime' : 'Esqueleto';
      case 3:
        if (random < 20) return 'Slime';
        if (random < 90) return 'Esqueleto';
        return 'Oni';
      case 4:
        if (random < 40) return 'Slime';
        if (random < 60) return 'Esqueleto';
        return 'Oni';
      case 5:
        if (random < 5) return 'Slime';
        if (random < 20) return 'Esqueleto';
        return 'Oni';
      default:
        return 'Nenhum inimigo encontrado';
    }
  };

  const handleNivelClick = (novaFaseAtual) => {
    const novoInimigo = escolherInimigo(novaFaseAtual);

    setStatusPartida(prevStatus => {
      const updatedStatus = {
        ...prevStatus,
        Fase: novaFaseAtual,
        Inimigo: novoInimigo
      };
      localStorage.setItem(usuario, JSON.stringify(updatedStatus));
      return updatedStatus;
    });
  };

 // Função para calcular o XP necessário para o próximo nível
const calculateXP = (level) => {
  const baseXP = 50;
  const growthFactor = 1.2;
  return baseXP * Math.pow(growthFactor, level - 1);
};

// Função para determinar o nível do jogador e o XP restante
const calculateLevelAndProgress = (xp) => {
  let level = 1;
  let xpForNextLevel = calculateXP(level);
  while (xp >= xpForNextLevel) {
    xp -= xpForNextLevel;
    level++;
    xpForNextLevel = calculateXP(level);
  }
  const progress = (xp / xpForNextLevel) * 100;
  return { level, progress };
};

// Função finalPartida com a lógica de aumento de nível e bônus
const finalPartida = (fase, vida, valorFinalDado, score, calculadoXp, valorFinalTomado, BonusME) => {
  setStatusPartida((prevStatus) => {
    const updatedVezesFase = [...prevStatus.VezesFase];
    updatedVezesFase[fase - 1] += 1;

    // Calcular o novo XP e verificar se o jogador subiu de nível
    const novoXp = prevStatus.Status.Xp + calculadoXp;
    const { level: novoNivel} = calculateLevelAndProgress(novoXp);

    // Verificar se o jogador subiu de nível
    let updatedStatus = { ...prevStatus };
    if (novoNivel > prevStatus.Nivel) {
      // Jogador subiu de nível, aplicar os bônus
      updatedStatus = {
        ...updatedStatus,
        Status: {
          ...updatedStatus.Status,
          Armadura: updatedStatus.Status.Armadura + 4 * (novoNivel - prevStatus.Nivel), // +4 de armadura por nível
          Dano: updatedStatus.Status.Dano + 1 * (novoNivel - prevStatus.Nivel), // +1 de dano por nível
          Xp: novoXp, 
        },
        Dinheiro: updatedStatus.Dinheiro + 30 * (novoNivel - prevStatus.Nivel)+30 + BonusME, 
        Nivel: novoNivel, // Atualizar o nível do jogador
      };
    } else {
      // Jogador não subiu de nível, apenas atualizar o XP
      updatedStatus = {
        ...updatedStatus,
        Status: { ...updatedStatus.Status, Xp: novoXp},
        Dinheiro: dinheiro +30 + BonusME 
      };
    }

    updatedStatus = {
      ...updatedStatus,
      Inimigo: null,
      Fase: 0,
      VezesFase: updatedVezesFase,
      FaseMax: prevStatus.FaseMax === fase && vida > 0 ? prevStatus.FaseMax + 1 : prevStatus.FaseMax,
      Vida: vida,
      DanoDado: valorFinalDado,
      DanoTomado: valorFinalTomado,
      BonusRegenEnergia:bonusRegenEnergia===0?0:bonusRegenEnergia-1,
      Score: score, 
    };

    localStorage.setItem(usuario, JSON.stringify(updatedStatus));

    return updatedStatus;
  });
  window.location.reload();
};


  const enviarStatus = async (resultadoPartida) => {
    try {
      console.log('Enviando status:', statusPartida); 
      await axios.post('http://localhost:8800/historico', { statusPartida, resultadoPartida });

    
    } catch (error) {
      console.error('Erro ao enviar status da partida:', error);
    }
  };
  
const [atualizado,setAtualizar]=useState(false)
  useEffect(() => {
    if (Vida <= 0) {
      const result ="Derrota"
      enviarStatus(result)

      setTimeout(() => {
        localStorage.removeItem(usuario);
      }, 300);
    }
    if (VezesFase[4]>0) {
      const result ="Vitoria"
      enviarStatus(result)

      setTimeout(() => {
        localStorage.removeItem(usuario);
      }, 300);
    }
  }, [atualizado]);

  const excluirLocalStorage =()=>{
    localStorage.removeItem(usuario);
      window.location.reload();
  }

  
  useEffect(()=>{
    if(atualizado){
      setTimeout(()=>{
      setAtualizar(false)
    },1000)
    } 
  },[atualizado])

  useEffect(() => {
    if (Vida<=0||VezesFase[4]>0) {
      navigate(`/${Vida<=0?derrota:vitoria}/${Score}`);
    }
  }, [usuario, navigate]);

  return (
    <div>
      {statusPartida.Nome === "Provisorio" ||atualizado ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <div>
          {Fase === 0 ? (
            <div className='tabela' >
              <button disabled={FaseMax < 1 || Vida <= 0} onClick={() => handleNivelClick(1)}>nvl1</button>
              <button disabled={FaseMax < 2 || Vida <= 0} onClick={() => handleNivelClick(2)}>nvl2</button>
              <button disabled={FaseMax < 3 || Vida <= 0} onClick={() => handleNivelClick(3)}>nvl3</button>
              <button disabled={FaseMax < 4 || Vida <= 0} onClick={() => handleNivelClick(4)}>nvl4</button>
              <button disabled={FaseMax < 5 || Vida <= 0} onClick={() => handleNivelClick(5)}>nvl5</button>
              <p>{usuario}</p>
              {Vida<=0&&(
                <button id='tentarnovamente' onClick={excluirLocalStorage}>TENTAR NOVAMENTE</button>
              )}
            </div>
          ) : (
            <Jogo usuario={usuario} mudarNoClient={finalPartida} atualizalobby={setAtualizar} />
          )}
  
        </div>
      )}
    </div>
  );
};

export default Lobby;
