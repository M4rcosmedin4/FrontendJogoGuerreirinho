import React, { useState, useEffect } from 'react';
import './Historico.css';
import ReactPaginate from 'react-paginate';
import melhor from "../Imgs/Melhor.png";

const Historico = () => {
  const [historico, setHistorico] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 4; // Número de partidas por página

  const formatarData = (dataCompleta) => {
    const data = new Date(dataCompleta);
    return data.toLocaleDateString('pt-BR'); // Formato DD/MM/YYYY
  };

  useEffect(() => {
    fetch('http://localhost:8800/historico', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then((resp) => resp.json())
      .then((data) => {
        setHistorico(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const ordenarPorScore = () => {
    const sortedHistorico = [...historico].sort((a, b) => b.Score - a.Score);
    setHistorico(sortedHistorico);
    setSearchQuery('');
    setCurrentPage(0); // Resetar para a primeira página
  };

  const ordenarPorData = () => {
    const sortedHistorico = [...historico].sort((a, b) => new Date(b.data) - new Date(a.data));
    setHistorico(sortedHistorico);
    setSearchQuery('');
    setCurrentPage(0); // Resetar para a primeira página
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredHistorico = historico.filter(entry =>
    entry.Nome.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const melhorTentativa = filteredHistorico.reduce((max, tentativa) =>
    tentativa.Score > max.Score ? tentativa : max, filteredHistorico[0] || {});

  // Lógica de paginação
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredHistorico.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredHistorico.length / itemsPerPage);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="main-container-h">
      <div className="button-container-h">
        <button onClick={ordenarPorScore}>Score</button>
        <button onClick={ordenarPorData}>Data</button>
        <input 
          type="text" 
          value={searchQuery} 
          onChange={handleSearchChange} 
          placeholder="Pesquisar por nome" 
        />
      </div>

      <div className="container-h">
        {currentPageData.length > 0 &&
          currentPageData.map((tentativa) => (
            <div key={tentativa._id} className="person" style={{
              backgroundColor: tentativa.Resultado === "Vitoria" ? 'blue' : 'red'
            }}>
              <div className='NomeResultado'>
                <h4>Jogador: {tentativa.Nome}</h4>
                <div>
                  <p>Score: {tentativa.Score}</p>
                  {tentativa._id === melhorTentativa._id && <img id="best" src={melhor} alt="Maior Score" />}
                </div>
              </div>
              <p>Fase Máxima: {tentativa.FaseMax}</p>
              <div className='juntar'>
                <span>Dano Dado: {tentativa.DanoDado}</span>
                <span>Dano Tomado: {tentativa.DanoTomado}</span>
              </div>
              <div className='juntar'>
                <span>Data: {formatarData(tentativa.data)}</span>
              </div>
            </div>
          ))
        }
      </div>

      {/* Componente de paginação */}
      {filteredHistorico.length > itemsPerPage && (
        <ReactPaginate
          previousLabel={"← Anterior"}
          nextLabel={"Próximo →"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      )}
    </div>
  );
};

export default Historico;
