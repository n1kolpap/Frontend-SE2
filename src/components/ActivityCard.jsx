import React from 'react';
import './ActivityCard.css';

const ActivityCard = ({ activity, onEdit, onDelete }) => (
  <div className="activity-card">
    <h3>{activity.name}</h3>
    <p>{activity.time}</p>
    <p>{activity.description}</p>
    <div className="icons">
      <button onClick={onEdit}>✏️</button>
      <button onClick={onDelete}>🗑️</button>
      <span>📅</span>
    </div>
  </div>
);

export default ActivityCard;