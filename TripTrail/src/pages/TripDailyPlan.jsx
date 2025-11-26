import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { mockData } from '../mock/data';
import ActivityCard from '../components/ActivityCard';
import FloatingActionButtons from '../components/FloatingActionButtons';
import DeleteModal from '../components/DeleteModal';
import Card from '../components/Card';
import './TripDailyPlan.css';

const TripDailyPlan = () => {
  const { tripId } = useParams();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('daily');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Mock data for trip
  const trip = mockData.trips.find(t => t.id === parseInt(tripId)) || mockData.trips[0];

  const handleDeleteActivity = (activityId) => {
    setActivityToDelete(activityId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    // Mock delete - in real app, update state
    setDeleteModalOpen(false);
    setActivityToDelete(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleAddActivity = () => {
    setShowMenu(true);
  };

  const handleMenuOption = (option) => {
    setShowMenu(false);
    // Mock navigation or action
    if (option === 'suggested') {
      history.push('/suggested-activities');
    } else {
      alert(`Selected ${option}`);
    }
  };

  return (
    <div className="trip-daily-plan-container">
      <div className="trip-daily-plan-header">
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

      <div className="daily-plan-content">
        {trip.dailyPlan && trip.dailyPlan.map((day) => (
          <Card key={day.date} className="day-card">
            <h3 className="day-date">{day.date}</h3>
            <input
              type="text"
              placeholder="Add an activity"
              className="add-activity-input"
            />
            {day.activities && day.activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onDelete={() => handleDeleteActivity(activity.id)}
              />
            ))}
          </Card>
        ))}
      </div>

      <FloatingActionButtons onAdd={handleAddActivity} />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />

      {showSuccess && (
        <div className="success-message">
          Activity deleted successfully!
        </div>
      )}

      {showMenu && (
        <div className="menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="menu-card">
            <button onClick={() => handleMenuOption('transportation')}>Transportation</button>
            <button onClick={() => handleMenuOption('accommodation')}>Accommodation</button>
            <button onClick={() => handleMenuOption('budget')}>Budget</button>
            <button onClick={() => handleMenuOption('purpose')}>Purpose</button>
            <button onClick={() => handleMenuOption('interests')}>Interests</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDailyPlan;