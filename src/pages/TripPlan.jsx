import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';
import Card from '../components/Card';
import './TripPlan.css';

const TripPlan = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fillActivities, setFillActivities] = useState(false);
  const history = useHistory();
  const { createTrip } = useTrip();

  const handleStartPlanning = (e) => {
    e.preventDefault();
    if (destination && startDate && endDate) {
      const tripId = createTrip({
        destination,
        startDate,
        endDate,
        fillActivities
      });
      history.push(`/trip/${tripId}/daily-plan`);
    }
  };

  return (
    <div className="trip-plan-container">
      <button className="close-btn">✕</button>
      <h1 className="trip-plan-title">Plan a new trip</h1>

      <form onSubmit={handleStartPlanning}>
        <Card>
          <input
            type="text"
            placeholder="Where to?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="input-field"
            required
          />
        </Card>

        <Card>
          <div className="date-row">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field date-input"
              required
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field date-input"
              required
            />
          </div>
        </Card>

        <Card>
          <button type="button" className="btn-collaborator">
            ➕ Add collaborator
          </button>
        </Card>

        <Card>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={fillActivities}
              onChange={(e) => setFillActivities(e.target.checked)}
            />
            <span>Fill plan with activities</span>
          </label>
        </Card>

        <button type="submit" className="btn-start-planning">Start planning</button>
      </form>
    </div>
  );
};

export default TripPlan;