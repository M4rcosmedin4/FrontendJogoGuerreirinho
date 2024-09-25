import React from 'react';
import BlessingSquare from './BlessingSquare';

const BlessingsGrid = ({ blessings, selectedBlessings, onSelectBlessing, level }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 100px)', // 2 colunas
      gridGap: '20px', // Espaçamento de 20px
      justifyContent: 'center',
      marginTop: '20px',
    }}>
      {blessings.map((blessing, index) => {
        const isSelected = selectedBlessings.includes(blessing.name);
        const disabled = 
          (level < 3) || 
          (selectedBlessings.length >= 1 && level < 12) || 
          (selectedBlessings.length >= 2 && level >= 12);
        
        return (
          <BlessingSquare
            key={index}
            blessing={blessing}
            isSelected={isSelected}
            onSelect={onSelectBlessing}
            disabled={disabled && !isSelected} // Permitir deseleção
          />
        );
      })}
    </div>
  );
};

export default BlessingsGrid;
