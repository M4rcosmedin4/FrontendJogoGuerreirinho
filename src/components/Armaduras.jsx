import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import './Armaduras.css';
import ElmoBranco from '../Imgs/ElmoBranco.png';
import ElmoVermelho from '../Imgs/ElmoVermelho.png';
import ElmoRoxo from '../Imgs/ElmoRoxo.png';
import ElmoPreto from '../Imgs/ElmoPreto.png';
import ElmoVerde from '../Imgs/ElmoVerde.png';

const ArmaduraSelector = ({usuario}) => {
  const [statusPartida, setStatusPartida] = useState(JSON.parse(localStorage.getItem(usuario)));
  let Elmo = statusPartida?.Elmo;

  const armaduras = [
    { img: ElmoBranco, nome: "Elmo Branco", descricao: "+30% de XP" },
    { img: ElmoVermelho, nome: "Elmo Vermelho", descricao: "+15% de dano do jogador" },
    { img: ElmoRoxo, nome: "Elmo Roxo", descricao: "Ataque e defesa aplicam veneno que causa o valor de nível em % ao longo de 4 segundos" },
    { img: ElmoPreto, nome: "Elmo Preto", descricao: "-1 ou 2 de vida por segundo, mas ganha essa mesma quantidade em dano adicional" },
    { img: ElmoVerde, nome: "Elmo Verde", descricao: "Cura 1*(nível/2) de vida por segundo" }
  ];

  const [selectedIndex, setSelectedIndex] = useState(Elmo - 1);

  const prevArmadura = () => {
    setSelectedIndex((prevIndex) => (prevIndex - 1 + armaduras.length) % armaduras.length);
  };

  const nextArmadura = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % armaduras.length);
  };

  const getDisplayedArmaduras = () => {
    const prevIndex = (selectedIndex - 1 + armaduras.length) % armaduras.length;
    const nextIndex = (selectedIndex + 1) % armaduras.length;
    return [armaduras[prevIndex], armaduras[selectedIndex], armaduras[nextIndex]];
  };

  const displayedArmaduras = getDisplayedArmaduras();

  useEffect(() => {
    handleElmo();
  }, [selectedIndex]);

  const handleElmo = () => {
    setStatusPartida((prevStatus) => {
      const updatedStatus = {
        ...prevStatus,
        Elmo: selectedIndex + 1,
      };
      localStorage.setItem(usuario, JSON.stringify(updatedStatus));
      return updatedStatus;
    });
  };

  return (
    <>
      <div className="armadura-selector">
        <Button variant="primary" onClick={prevArmadura}>&lt;</Button>
        <div className="armadura-display">
          <img className="armadura" src={displayedArmaduras[0].img} alt="Armadura Anterior" />
          <img className="armadura selected" src={displayedArmaduras[1].img} alt="Armadura Selecionada" />
          <img className="armadura" src={displayedArmaduras[2].img} alt="Armadura Próxima" />
        </div>
        <Button variant="primary" onClick={nextArmadura}>&gt;</Button>
      </div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{displayedArmaduras[1].nome}</h5>
          <p className="card-text">{displayedArmaduras[1].descricao}</p>
        </div>
      </div>
    </>
  );
};

export default ArmaduraSelector;
