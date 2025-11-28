import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './SignUp.css';  // Changed to SignUp.css

const Signup = () => {
  const [userData, setUserData] = useState({ username: '', email: '', password: '' });
  const { signup, loading } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(userData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-page">
      <div className="logo-section">
        <h1>TripTrail</h1>
        <h2>Unlock the world</h2>
      </div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={userData.username}
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          required
          className="input-field"
        />
        <input
          type="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          required
          className="input-field"
        />
        <button type="submit" disabled={loading} className="signup-button">
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <Link to="/login" className="login-link">Log In</Link>
    </div>
  );
};

export default Signup;