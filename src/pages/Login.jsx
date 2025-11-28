import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Login failed. Please try again.');
    }
  };

  const handleSignUp = () => {
    history.push('/signup');
  };

  const handleForgotPassword = () => {
    alert('Forgot password clicked');
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-logo">TripTrail</div>
        
        <form className="login-form" onSubmit={handleLogin}>
          {error && <div className="error-message">{error}</div>}
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <button onClick={handleSignUp} className="btn-signup">Sign Up</button>

        <button onClick={handleForgotPassword} className="btn-forgot">Forgot password?</button>
      </div>
    </div>
  );
};

export default Login;