import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = () => {
    history.push('/dashboard');
  };

  const handleSignUp = () => {
    history.push('/signup');
  };

  const handleForgotPassword = () => {
    // Placeholder for forgot password
    alert('Forgot password clicked');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-logo">TripTrail</div>
        
        <form className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="button" onClick={handleLogin} className="btn-login">Log In</button>
        </form>

        <button onClick={handleSignUp} className="btn-signup">Sign Up</button>

        <button onClick={handleForgotPassword} className="btn-forgot">Forgot password?</button>
      </div>
    </div>
  );
};

export default Login;