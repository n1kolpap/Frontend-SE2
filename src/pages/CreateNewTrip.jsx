import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './CreateNewTrip.css';

const CreateNewTrip = () => {
  const history = useHistory();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fillActivities, setFillActivities] = useState(false);

  const handleClose = () => {
    history.goBack();
  };

  const handleStartPlanning = (e) => {
    e.preventDefault();
    if (destination && startDate && endDate) {
      // Store trip data in local state (no backend)
      history.push('/trip/1/daily-plan');
    }
  };

  return (
    <div className="create-new-trip-wrapper">
      <div className="create-new-trip-container">
        {/* Close Button */}
        <button className="close-button" onClick={handleClose}>
          ✕
        </button>

        {/* Title */}
        <h1 className="create-trip-title">Plan a new trip</h1>

        {/* Form */}
        <form onSubmit={handleStartPlanning} className="create-trip-form">
          {/* Where To Input */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Where to?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="input-field where-to-input"
              required
            />
          </div>

          {/* Date Range Section */}
          <div className="form-group date-range-group">
            <div className="date-input-wrapper">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field date-input"
                required
              />
              <span className="date-icon">📅</span>
            </div>
            <div className="date-input-wrapper">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field date-input"
                required
              />
              <span className="date-icon">📅</span>
            </div>
          </div>

          {/* Invite Collaborator */}
          <div className="form-group collaborator-group">
            <button type="button" className="collaborator-button">
              <span className="plus-icon">➕</span>
              <span className="collaborator-text">Invite a collaborator</span>
            </button>
          </div>

          {/* Checkbox */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={fillActivities}
                onChange={(e) => setFillActivities(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-text">Fill plan with activities</span>
            </label>
          </div>

          {/* Start Planning Button */}
          <button type="submit" className="btn-start-planning">
            Start planning
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNewTrip;