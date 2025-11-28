import React from 'react';import './FloatingActionButtons.css';const FloatingActionButtons = ({ onBlue, onOrange, onBlack }) => (  <div className="floating-buttons">    <button className="fab blue" onClick={onBlue}>🔵</button>    <button className="fab orange" onClick={onOrange}>🟠</button>    <button className="fab black" onClick={onBlack}>⚫</button>
  </div>
);

export default FloatingActionButtons;