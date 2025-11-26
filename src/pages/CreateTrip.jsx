import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './CreateTrip.css';

const CreateTrip = () => {
  const history = useHistory();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fillActivities, setFillActivities] = useState(false);

  const handleClose = () => {
    history.push('/dashboard');
  };

  const handleStartPlanning = () => {
    // Mock navigation to daily plan
    history.push('/trip/1/daily-plan');
  };

  return (
    <div className="create-trip-container">
      <div className="create-trip-header">
        <button className="close-btn" onClick={handleClose}>✕</button>
        <h1 className="create-trip-title">Plan a new trip</h1>
      </div>

      <div className="create-trip-form">
        <input
          type="text"
          placeholder="Where to?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="input-field"
        />

        <div className="date-row">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input-field date-input"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input-field date-input"
          />
        </div>

        <button className="collaborator-btn">
          ➕ Add collaborator
        </button>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={fillActivities}
            onChange={(e) => setFillActivities(e.target.checked)}
          />
          Fill plan with activities
        </label>

        <button onClick={handleStartPlanning} className="start-planning-btn">
          Start planning
        </button>
      </div>
    </div>
  );
};

export default CreateTrip;