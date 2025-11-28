import React from 'react';
import './FloatingActionButton.css';

const FloatingActionButton = ({ onClick }) => (
  <button className="fab" onClick={onClick}>+</button>
);

export default FloatingActionButton;