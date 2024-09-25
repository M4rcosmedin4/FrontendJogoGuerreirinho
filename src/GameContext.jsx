// src/GameContext.js
import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [isGameRunning, setIsGameRunning] = useState(false);

  const startGame = () => setIsGameRunning(true);
  const endGame = () => setIsGameRunning(false);

  return (
    <GameContext.Provider value={{ isGameRunning, startGame, endGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
