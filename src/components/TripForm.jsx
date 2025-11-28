import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTrip } from '../hooks/useTrip';
import './TripForm.css';

const TripForm = () => {
  const history = useHistory();
  const { user } = useAuth();
  const { createTrip } = useTrip();
  
  const [formData, setFormData] = useState({
    destination: '',
    origin: '',
    startDate: '',
    endDate: '',
    budget: '',
    purpose: '',
    interests: [],
    notes: '',
    collaborators: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestsChange = (e) => {
    const interests = e.target.value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      interests
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      setLoading(true);
      const tripData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined
      };

      const tripId = await createTrip(user.userId, tripData);
      history.push(`/trip/${tripId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-form-container">
      <div className="trip-form-header">
        <button onClick={() => history.goBack()} className="back-btn">←</button>
        <h1>Create New Trip</h1>
      </div>

      <form onSubmit={handleSubmit} className="trip-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="destination">Destination *</label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Where are you going?"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="origin">Origin</label>
          <input
            type="text"
            id="origin"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="Where are you starting from?"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date *</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="budget">Budget</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="purpose">Purpose</label>
          <select
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
          >
            <option value="">Select purpose</option>
            <option value="vacation">Vacation</option>
            <option value="business">Business</option>
            <option value="adventure">Adventure</option>
            <option value="family">Family</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="interests">Interests (comma separated)</label>
          <input
            type="text"
            id="interests"
            name="interests"
            value={formData.interests.join(', ')}
            onChange={handleInterestsChange}
            placeholder="e.g., hiking, museums, food"
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional notes..."
            rows="4"
          />
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Trip'}
        </button>
      </form>
    </div>
  );
};

export default TripForm;