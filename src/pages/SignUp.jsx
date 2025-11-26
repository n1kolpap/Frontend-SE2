import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const history = useHistory();

  const handleSignUp = () => {
    if (name && email && password) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        history.push('/login');
      }, 2000);
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleLogin = () => {
    history.push('/login');
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-logo">TripTrail</div>
        
        <form className="signup-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
          />
          <button type="button" onClick={handleSignUp} className="btn-signup">Sign Up</button>
        </form>

        <button onClick={handleLogin} className="btn-login">Log In</button>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>Success!</h2>
            <p>Your account has been created.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;