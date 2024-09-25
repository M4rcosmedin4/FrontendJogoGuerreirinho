import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Nav.module.css';
import { AiFillSetting } from 'react-icons/ai';
import { useTheme } from '../ThemeContext';
import XP from './Xp';
import Money from './Money';
import Dinheiro from '../Imgs/dinheiro.png';
import { Link } from 'react-router-dom';

const Nav = () => {
  const { toggleTheme } = useTheme();
  const storedName = localStorage.getItem('userLogado') || '';
  const [logado, setLogado] = useState(true);
  const [showModal, setShowModal] = useState(false); // Estado para controlar o modal
  const statusPartida = JSON.parse(localStorage.getItem(storedName));
  const xp = statusPartida?.Status?.Xp;

  useEffect(() => {
    if (storedName === '') setLogado(false);
    if (!logado) {
      localStorage.removeItem('userLogado');
      window.location.reload();
    }
  }, [logado, storedName]);

  const handleDesistir = () => {
    // Função para abrir o modal de confirmação
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Fecha o modal
  };

  const handleConfirmDesistir = () => {
    // Lógica para excluir a sessão e sair
    localStorage.removeItem(statusPartida);
    
    setShowModal(false);
    window.location.reload();
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg bg-body-tertiary ${styles.navbar}`}>
        <div className="container-fluid d-flex justify-content-between">
          <div className={styles.parte + " me-auto"}>
            <XP xp={xp} />
          </div>
          <div className={styles.parte + " text-center"}>
            <div className={`${styles.bloco} d-flex justify-content-center`}>
              <p className="me-3 btn btn-primary"><Link to="">Lobby</Link></p>
              <p className="me-3 btn btn-primary"><Link to="loja">Loja</Link></p>
              <p className="me-3 btn btn-primary"><Link to="missoes">Missões</Link></p>
              <p className="btn btn-primary"><Link to="historico">Histórico</Link></p>
            </div>
          </div>
          <div className={styles.parte + " d-flex align-items-center justify-content-end"}>
            <div className={styles.moneyContainer}>
              <Money statusPartida={statusPartida} />
              <img src={Dinheiro} alt="Dinheiro" className={styles.dinheiroImg} />
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarScroll"
              aria-controls="navbarScroll"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarScroll">
              <ul className="navbar-nav navbar-nav-scroll" style={{ '--bs-scroll-height': '100px' }}>
                <li className={`nav-item dropdown ${styles.navItem}`}>
                  <a
                    className={`nav-link dropdown-toggle ${styles.navLink}`}
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <AiFillSetting />
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button
                        className={`dropdown-item ${styles.dropdown}`}
                        onClick={toggleTheme}
                      >
                        Mudar Tema
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${styles.dropdown}`}
                        onClick={() => setLogado(false)}
                      >
                        Sair da conta
                      </button>
                    </li>
                    <li>
                      <button
                        className={`dropdown-item ${styles.dropdown}`}
                        onClick={handleDesistir} // Abre o modal ao clicar
                      >
                        Desistir
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="desistirModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="desistirModalLabel">Confirmar Desistência</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                Você tem certeza que deseja desistir e excluir a sessão?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDesistir}>Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
