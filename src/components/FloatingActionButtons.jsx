import React from 'react';
import './FloatingActionButtons.css';

const FloatingActionButtons = ({ onAdd }) => {
  return (
    <div className="fab-container">
      <button className="fab fab-edit">✏️</button>
      <button className="fab fab-location">📍</button>
      <button className="fab fab-add" onClick={onAdd}>➕</button>
    </div>
  );
};

export default FloatingActionButtons;