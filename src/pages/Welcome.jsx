import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../components/Button';
import './Welcome.css';

const Welcome = () => {
  const history = useHistory();

  return (
    <div className="welcome">
      <h1>TripTrail</h1>
      <p>Unlock the world</p>
      <Button onClick={() => history.push('/login')}>Welcome</Button>
    </div>
  );
};

export default Welcome;