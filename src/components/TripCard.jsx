import React from 'react';
import './TripCard.css';

const TripCard = ({ trip }) => {
  return (
    <div className="trip-card">
      <h3>{trip.destination}</h3>
      <p>{trip.startDate} - {trip.endDate}</p>
      <button className="btn-share">Share</button>
    </div>
  );
};

export default TripCard;