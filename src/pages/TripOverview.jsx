import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import client from '../api/client';
import TabNavigation from '../components/TabNavigation';
import './TripOverview.css';

const TripOverview = () => {
  const { tripId } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [editing, setEditing] = useState(false);
  const [budget, setBudget] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await client.get(`/user/${user.id}/tripPlan/${tripId}`);
        setTrip(response.data.data);
        setBudget(response.data.data.budget || '');
        setEstimatedCost(response.data.data.estimatedCost || '');
      } catch (error) {
        console.error('Failed to fetch trip');
      }
    };
    fetchTrip();
  }, [tripId, user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await client.put(`/user/${user.id}/tripPlan/${tripId}`, { budget, estimatedCost });
      setTrip({ ...trip, budget, estimatedCost });
      setEditing(false);
    } catch (error) {
      alert('Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setBudget(trip.budget || '');
    setEstimatedCost(trip.estimatedCost || '');
    setEditing(false);
  };

  if (!trip) return <div>Loading...</div>;

  return (
    <div className="trip-overview">
      <div className="trip-header">
        <h1>Trip to {trip.destination}</h1>
        <p>{trip.startDate} - {trip.endDate}</p>
        <button className="share-button">Share</button>
      </div>
      <TabNavigation tabs={['Overview', 'Daily Plan', 'Review']} activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'Overview' && (
        <div className="overview-content">
          <h3>Budget & Cost Overview</h3>
          <div className="budget-section">
            <label>Budget: €</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              disabled={!editing}
              className="input-field"
            />
          </div>
          <div className="cost-section">
            <label>Estimated Cost: €</label>
            <input
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              disabled={!editing}
              className="input-field"
            />
          </div>
          <div className="favorites-section">
            <h4>Your Favorites</h4>
            <div className="favorites-list">
              {/* Placeholder for favorites */}
              <div className="favorite-card">
                <p>Central Park</p>
                <p>Description...</p>
              </div>
            </div>
            <button className="add-favorite">+</button>
          </div>
          <div className="buttons-section">
            {editing ? (
              <>
                <button onClick={handleSave} disabled={loading} className="save-button">
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleCancel} className="cancel-button">Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => console.log('Export as PDF')} className="export-button">Export as PDF</button>
                <button onClick={() => setEditing(true)} className="edit-button">Edit</button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Add other tabs if needed */}
    </div>
  );
};

export default TripOverview;