import React,{useEffect, useState} from 'react';
import { Card } from 'react-bootstrap';

const BlessingSquare = ({ blessing, isSelected, onSelect, disabled }) => {
  return (
    <Card
      onClick={() => !disabled && onSelect(blessing)}
      style={{
        width: '105px',
        height: '100px',
        backgroundColor: isSelected ? 'yellow' : disabled ? 'red' : 'lightblue',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '12px',
        fontWeight: 'bold'
      }}
    >
      <Card.Body>
        <div style={{ fontSize: '2em' }}>{blessing.icon}</div>
        <div>{blessing.name}</div>
      </Card.Body>
    </Card>
  );
};

export default BlessingSquare;
