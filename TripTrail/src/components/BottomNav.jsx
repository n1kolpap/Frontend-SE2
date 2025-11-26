import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const history = useHistory();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleAddClick = () => {
    history.push('/trip/create');
  };

  return (
    <nav className="bottom-nav">
      <button
        className={`nav-btn ${isActive('/dashboard') ? 'active' : ''}`}
        onClick={() => history.push('/dashboard')}
      >
        🏠
      </button>
      <button 
        className="nav-btn-add"
        onClick={handleAddClick}
      >
        ➕
      </button>
      <button
        className={`nav-btn ${isActive('/profile') ? 'active' : ''}`}
        onClick={() => history.push('/profile')}
      >
        👤
      </button>
    </nav>
  );
};

export default BottomNav;