import React from 'react';
import { useHistory } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import './Profile.css';

const Profile = () => {
  const history = useHistory();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={() => history.push('/dashboard')} className="back-btn">←</button>
        <h1>Profile</h1>
      </div>

      <div className="profile-content">
        <div className="profile-avatar">
          <div className="avatar-placeholder">👤</div>
        </div>
        <h2>John Doe</h2>
        <p>john.doe@example.com</p>

        <div className="profile-options">
          <button className="profile-option">My Trips</button>
          <button className="profile-option">Settings</button>
          <button className="profile-option">Help</button>
          <button className="profile-option">Logout</button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;