import React from 'react';
import { useHistory } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  const history = useHistory();

  const handleWelcome = () => {
    history.push('/login');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-logo">TripTrail</div>
        <p className="welcome-subtitle">Unlock the world</p>
      </div>
      <button onClick={handleWelcome} className="btn-welcome">Welcome</button>
    </div>
  );
};

export default Welcome;