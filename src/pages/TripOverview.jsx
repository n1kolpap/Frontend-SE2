import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { mockData } from '../mock/data';
import Card from '../components/Card';
import './TripOverview.css';

const TripOverview = () => {
  const { tripId } = useParams();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('overview');
  const [budget, setBudget] = useState('');
  const [cost, setCost] = useState('');
  const [isEditMode, setIsEditMode] = useState(true);

  // Mock data for trip
  const trip = mockData.trips.find(t => t.id === parseInt(tripId)) || mockData.trips[0];

  const handleSave = () => {
    setIsEditMode(false);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    history.goBack();
  };

  const handleExport = () => {
    // Mock export
    alert('Exporting as PDF');
  };

  return (
    <div className="trip-overview-container">
      <div className="trip-overview-header">
        <button onClick={() => history.push('/dashboard')} className="back-btn">←</button>
        <h1>TripTrail</h1>
        <button className="share-btn">📤</button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily')}
        >
          Daily Plan
        </button>
        <button
          className={`tab ${activeTab === 'review' ? 'active' : ''}`}
          onClick={() => setActiveTab('review')}
        >
          Review
        </button>
      </div>

      <div className="overview-content">
        <Card>
          <h3>Budget</h3>
          <input
            type="number"
            placeholder="Enter budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="input-field"
            disabled={!isEditMode}
          />
        </Card>

        <Card>
          <h3>Estimated cost</h3>
          <input
            type="number"
            placeholder="Enter estimated cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="input-field"
            disabled={!isEditMode}
          />
        </Card>

        <Card>
          <h3>Your Favorites</h3>
          <p>No favorites yet</p>
          <button className="btn-edit">Edit</button>
        </Card>

        <div className="overview-buttons">
          {isEditMode ? (
            <>
              <button onClick={handleCancel} className="btn-cancel">Cancel</button>
              <button onClick={handleSave} className="btn-save">Save</button>
            </>
          ) : (
            <>
              <button onClick={handleEdit} className="btn-edit-mode">Edit</button>
              <button onClick={handleExport} className="btn-export">Export as PDF</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripOverview;