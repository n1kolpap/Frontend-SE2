import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import './CreateTripPlan.css';

const CreateTripPlan = () => {
  const history = useHistory();
  const { addTrip } = useTrips();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fillWithActivities, setFillWithActivities] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const tripData = {
        destination,
        startDate,
        endDate,
        autoActivities: fillWithActivities
      };
      await addTrip(tripData);
      history.push('/home');
    } catch (error) {
      alert('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-trip-container">
      <button className="close-button" onClick={() => history.push('/home')}>X</button>
      <h1>Plan a new trip</h1>
      <form onSubmit={handleSubmit} className="create-trip-form">
        <input
          type="text"
          placeholder="Where to? e.g., Greece, Paris"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          className="input-field"
        />
        <div className="date-row">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="input-field date-input"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            className="input-field date-input"
          />
        </div>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={fillWithActivities}
            onChange={(e) => setFillWithActivities(e.target.checked)}
          />
          Fill plan with activities
        </label>
        <button type="submit" disabled={loading} className="start-button">
          {loading ? 'Creating...' : 'Start planning'}
        </button>
      </form>
    </div>
  );
};

export default CreateTripPlan;