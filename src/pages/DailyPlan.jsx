import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useTrip } from '../hooks/useTrip';
import ActivityCard from '../components/ActivityCard';
import FloatingActionButtons from '../components/FloatingActionButtons';
import DeleteModal from '../components/DeleteModal';
import Card from '../components/Card';
import './DailyPlan.css';

const DailyPlan = () => {
  const { tripId } = useParams();
  const { trips, addActivity, deleteActivity } = useTrip();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('overview');
  const [newActivityName, setNewActivityName] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);

  const trip = trips.find(t => t.id === parseInt(tripId));

  const handleAddActivity = (date) => {
    if (newActivityName.trim()) {
      addActivity(parseInt(tripId), date, {
        name: newActivityName,
        time: '10:00-11:00',
        description: 'Activity description'
      });
      setNewActivityName('');
    }
  };

  const confirmDelete = () => {
    if (activityToDelete) {
      deleteActivity(parseInt(tripId), activityToDelete.date, activityToDelete.id);
      setDeleteModalOpen(false);
      setActivityToDelete(null);
    }
  };

  if (!trip) return <div>Trip not found</div>;

  return (
    <div className="daily-plan-container">
      <div className="daily-plan-header">
        <button onClick={() => history.push('/dashboard')} className="back-btn">
          ←
        </button>
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
            <p className="day-date">{day.date}</p>
            <div className="activity-input-group">
              <input
                type="text"
                placeholder="Add an activity"
                value={newActivityName}
                onChange={(e) => setNewActivityName(e.target.value)}
                className="input-field"
              />
              <button
                onClick={() => handleAddActivity(day.date)}
                className="btn-add-activity"
              >
                ➕
              </button>
            </div>
            {day.activities && day.activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onDelete={() => {
                  setActivityToDelete({ date: day.date, id: activity.id });
                  setDeleteModalOpen(true);
                }}
              />
            ))}
          </Card>
        ))}
      </div>

      <FloatingActionButtons />
      
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default DailyPlan;