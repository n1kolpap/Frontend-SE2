import React from 'react';
import './ActivityCard.css';

const ActivityCard = ({ activity, onDelete }) => {
  return (
    <div className="activity-card">
      <div className="activity-info">
        <h4>{activity.title}</h4>
        <p className="time">{activity.time}</p>
        <p className="description">{activity.description}</p>
      </div>
      <div className="activity-actions">
        <button className="icon-btn">✏️</button>
        <button onClick={onDelete} className="icon-btn">🗑️</button>
        <button className="icon-btn">📅</button>
      </div>
    </div>
  );
};

export default ActivityCard;