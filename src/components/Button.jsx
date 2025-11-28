import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    className={`button button-${variant}`}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;