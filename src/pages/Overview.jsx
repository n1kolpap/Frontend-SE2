import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';
import Card from '../components/Card';
import './Overview.css';

const Overview = () => {
  const { tripId } = useParams();
  const { trips, updateTrip } = useTrip();
  const history = useHistory();
  const [budget, setBudget] = useState('');

  const trip = trips.find(t => t.id === parseInt(tripId));

  const handleSave = () => {
    updateTrip(parseInt(tripId), { budget });
    history.push('/dashboard');
  };

  const handleCancel = () => {
    history.goBack();
  };

  if (!trip) return <div>Trip not found</div>;

  return (
    <div className="overview-container">
      <h1 className="overview-title">Overview</h1>

      <Card>
        <h3>Budget</h3>
        <input
          type="number"
          placeholder="Enter budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="input-field"
        />
      </Card>

      <Card>
        <h3>Estimated cost</h3>
        <p className="cost-text">$0.00</p>
      </Card>

      <Card>
        <h3>Your Favorites</h3>
        <p className="favorites-text">No favorites yet</p>
        <button className="btn-edit">✏️ Edit</button>
      </Card>

      <div className="overview-buttons">
        <button onClick={handleCancel} className="btn-cancel">Cancel</button>
        <button onClick={handleSave} className="btn-save">Save</button>
      </div>
    </div>
  );
};

export default Overview;