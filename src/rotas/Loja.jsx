import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Armaduras from '../components/Armaduras';
import BlessingsGrid from './BlessingsGrid';
import { Container } from 'react-bootstrap';
import './Loja.css'
import moeda from '../Imgs/moeda.png'

const blessings = [
  { name: 'Regeneração', icon: '🌱' },
  { name: 'Vitalidade', icon: '🔋' },
  { name: 'Roubo de Vida', icon: '🩸' },
  { name: 'Milagre Econômico', icon: '💸' }
];

const Loja = ({ usuario }) => {
  const [statusPartida, setStatusPartida] = useState({
    Nome: 'Provisorio',
    Status: {
      provisorio: 0,
    },
    Vida: 100,
    VidaMaxima: 100,
    Atributos: {
      provisorio: 0,
    },
    Elmo: 0,
    Fase: 0,
    FaseMax: 1,
    Inimigo: null,
    Nivel: 1,
    BonusRegenEnergia: 0,
    Bencao: [],
  });

  let money = statusPartida?.Dinheiro;
  let vidaMaxima = statusPartida?.VidaMaxima;
  let vida = statusPartida?.Vida;
  let armadura = statusPartida?.Status?.Armadura;
  let nivel = statusPartida?.Nivel;
  let bonusRegenEnergia = statusPartida?.BonusRegenEnergia;
  let Nivel = statusPartida?.Nivel;
  let Bencao = statusPartida?.Bencao;

  useEffect(() => {
    setTimeout(() => {
      const savedStatus = JSON.parse(localStorage.getItem(usuario));
      if (savedStatus) {
        setStatusPartida(savedStatus);
      }
    }, 1000);
  }, [usuario]);

  const items = [
    { id: 1, name: 'Poção de vida', price: 50 },
    { id: 2, name: 'Poção de energia', price: 20 },
    { id: 3, name: 'Reforçar armadura', price: 40 },
    { id: 4, name: 'Fruta da vida', price: 70 },
  ];

  const handlePurchase = (item) => {
    if (money >= item.price) {
      let newMoney = money - item.price;
      let newVida = vida;
      let newVidaMaxima = vidaMaxima;
      let newArmadura = armadura;
      let newBonusRegenEnergia = bonusRegenEnergia;

      switch (item.id) {
        case 1:
          newVida = Math.min(vidaMaxima, vida + 2 * nivel);
          break;
        case 2:
          newBonusRegenEnergia += 1;
          break;
        case 3:
          newArmadura += 50;
          break;
        case 4:
          newVidaMaxima += 10 * (nivel / 2);
          break;
        default:
          break;
      }

      setStatusPartida((prevStatus) => {
        const updatedStatus = {
          ...prevStatus,
          Status:{...prevStatus.Status, Armadura:newArmadura},
          BonusRegenEnergia: newBonusRegenEnergia,
          VidaMaxima: newVidaMaxima,
          Vida: newVida,
          Dinheiro: newMoney,
        };

        localStorage.setItem(usuario, JSON.stringify(updatedStatus));
        return updatedStatus;
      });
      window.location.reload();
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (usuario === '') {
      navigate('/');
    }
  }, [usuario, navigate]);

  const [selectedBlessings, setSelectedBlessings] = useState([]);

  // Carregar o status da partida e bênçãos salvas ao carregar a página
  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem(usuario));
    if (savedStatus) {
      setStatusPartida(savedStatus);
      if (savedStatus.Bencao) {
        setSelectedBlessings(savedStatus.Bencao);
      }
    }
  }, [usuario]);

  const handleSelectBlessing = (blessing) => {
    setSelectedBlessings((prev) => {
      const newBlessings = prev.includes(blessing.name)
        ? prev.filter((b) => b !== blessing.name)
        : [...prev, blessing.name];

      setStatusPartida((prevStatus) => {
        const updatedStatus = {
          ...prevStatus,
          Bencao: newBlessings,
        };
        localStorage.setItem(usuario, JSON.stringify(updatedStatus));
        return updatedStatus;
      });

      return newBlessings;
    });
  };
  return (
    <>
      {statusPartida?.Nome === 'Provisorio' ? (
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <section>
          <div>
          <div className='menor'>
          <Container style={{ textAlign: 'center' }}>
              <BlessingsGrid
                blessings={blessings}
                selectedBlessings={selectedBlessings}
                onSelectBlessing={handleSelectBlessing}
                level={Nivel}
                Bencao={Bencao}
              />
            </Container>
          <div className="container" >
            <ul className="list-group">
              {items.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <h5>{item.name}</h5> - {item.price}<img className='moeda' src={moeda}/>
                  <button style={{
                          backgroundColor: money >= item.price ? 'green' : 'red',
                          color: 'white',
                          padding:'0px',
                          marginLeft: '50px',
                        }}
                        onClick={() => handlePurchase(item)}
                        disabled={money < item.price || (item.id === 1 && vida >= vidaMaxima)}
                      >
                        {money >= item.price ? 'Comprar' : 'Insuficiente'}
                      </button>

                </li>
              ))}
            </ul>
            <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">Vida❤️:{vida}</li>
                <li className="list-group-item d-flex justify-content-between align-items-center">EnergiaExtra⚡:{bonusRegenEnergia}</li>
                <li className="list-group-item d-flex justify-content-between align-items-center">Armadura🛡️:{armadura}</li>
                <li className="list-group-item d-flex justify-content-between align-items-center">VidaMax💖:{vidaMaxima}</li>
            </ul>
          </div>
          </div></div>
          <div>
            <Armaduras usuario={usuario} />
          </div>
        </section>
      )}
    </>
  );
};

export default Loja;