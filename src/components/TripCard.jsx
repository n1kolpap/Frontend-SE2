import React from 'react';
import './TripCard.css';

const TripCard = ({ trip, onClick }) => (
  <div className="trip-card" onClick={onClick}>
    <h2>Trip to {trip.destination}</h2>
    <p>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
    <div className="share-icon">📤</div>
  </div>
);

export default TripCard;