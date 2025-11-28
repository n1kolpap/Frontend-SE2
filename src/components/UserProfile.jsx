import React from 'react';
import { useAuth } from '../hooks/useAuth';

const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return <div>Please log in</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default UserProfile;