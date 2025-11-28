import React from 'react';
import './Input.css';

const Input = ({ type = 'text', placeholder, value, onChange, required = false }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    required={required}
    className="input"
  />
);

export default Input;