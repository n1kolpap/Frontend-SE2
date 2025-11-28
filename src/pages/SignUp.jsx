import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './SignUp.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { signup } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await signup(username, password, email);
    setLoading(false);

    if (result.success) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        history.push('/login');
      }, 2000);
    } else {
      setError(result.message || 'Signup failed. Please try again.');
    }
  };

  const handleLogin = () => {
    history.push('/login');
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-logo">TripTrail</div>
        
        <form className="signup-form" onSubmit={handleSignUp}>
          {error && <div className="error-message">{error}</div>}
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="signup-input"
            required
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
            required
            disabled={loading}
          />
          <button 
            type="submit" 
            className="btn-signup"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
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