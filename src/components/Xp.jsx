// XP.jsx
import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import styles from './Xp.module.css'; // Importar o arquivo CSS

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

const XP = ({ xp }) => {
  const { level, progress } = calculateLevelAndProgress(xp);

  return (
    <div className={styles.xpContainer}>
      <h4 className={styles.level}>Nível:{level}</h4>
      <ProgressBar
        now={progress}
        label={`${Math.round(progress)}%`}
        max={100}
        className={styles.progressBar}
      />
    </div>
  );
};

export default XP;
