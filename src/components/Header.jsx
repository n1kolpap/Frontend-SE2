import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Header.css';

const Header = () => {
  const { user } = useAuth();
  const history = useHistory();

  return (
    <header className="header">
      <div className="top-bar">
        <button onClick={() => history.goBack()} className="icon-btn">🏠</button>
        <div className="logo">TripTrail</div>
        <button className="icon-btn">📤</button>
      </div>
    </header>
  );
};

export default Header;