import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTrip } from '../hooks/useTrip';
import './DailyPlanView.css';

const DailyPlanView = () => {
  const { tripId, date } = useParams();
  const history = useHistory();
  const { user } = useAuth();
  const { getDailyPlans, addActivity, deleteActivity, markCompleted, addDailyNote } = useTrip();
  
  const [dailyPlan, setDailyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activityForm, setActivityForm] = useState({
    name: '',
    location: '',
    time: '',
    notes: ''
  });
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    loadDailyPlan();
  }, [tripId, date]);

  const loadDailyPlan = async () => {
    try {
      setLoading(true);
      const plans = await getDailyPlans(user.userId, tripId);
      const plan = plans.find(p => p.date === date);
      setDailyPlan(plan || { date, activities: [], notes: '' });
      setNoteText(plan?.notes || '');
    } catch (error) {
      console.error('Failed to load daily plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      await addActivity(user.userId, tripId, date, activityForm);
      setActivityForm({ name: '', location: '', time: '', notes: '' });
      setShowActivityForm(false);
      await loadDailyPlan();
    } catch (error) {
      console.error('Failed to add activity:', error);
      alert('Failed to add activity');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteActivity(user.userId, tripId, date, activityId);
        await loadDailyPlan();
      } catch (error) {
        console.error('Failed to delete activity:', error);
        alert('Failed to delete activity');
      }
    }
  };

  const handleToggleCompleted = async (activityId, currentStatus) => {
    try {
      if (!currentStatus) {
        await markCompleted(user.userId, tripId, date, activityId);
      }
      await loadDailyPlan();
    } catch (error) {
      console.error('Failed to mark activity:', error);
      alert('Failed to update activity');
    }
  };

  const handleSaveNote = async () => {
    try {
      await addDailyNote(user.userId, tripId, date, noteText);
      alert('Note saved successfully');
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="daily-plan-container">
      <div className="daily-plan-header">
        <button onClick={() => history.goBack()} className="back-btn">←</button>
        <h1>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h1>
      </div>

      <section className="activities-section">
        <div className="section-header">
          <h2>Activities</h2>
          <button onClick={() => setShowActivityForm(true)} className="add-btn">+ Add</button>
        </div>

        {showActivityForm && (
          <form onSubmit={handleAddActivity} className="activity-form">
            <input
              type="text"
              placeholder="Activity name *"
              value={activityForm.name}
              onChange={(e) => setActivityForm({...activityForm, name: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={activityForm.location}
              onChange={(e) => setActivityForm({...activityForm, location: e.target.value})}
            />
            <input
              type="time"
              placeholder="Time *"
              value={activityForm.time}
              onChange={(e) => setActivityForm({...activityForm, time: e.target.value})}
              required
            />
            <textarea
              placeholder="Notes"
              value={activityForm.notes}
              onChange={(e) => setActivityForm({...activityForm, notes: e.target.value})}
              rows="2"
            />
            <div className="form-actions">
              <button type="submit" className="btn-save">Save</button>
              <button type="button" onClick={() => setShowActivityForm(false)} className="btn-cancel">Cancel</button>
            </div>
          </form>
        )}

        <div className="activities-list">
          {dailyPlan?.activities?.length === 0 && (
            <p className="empty-message">No activities planned for this day</p>
          )}
          {dailyPlan?.activities?.map((activity) => (
            <div key={activity.activityId} className={`activity-item ${activity.completed ? 'completed' : ''}`}>
              <div className="activity-checkbox">
                <input
                  type="checkbox"
                  checked={activity.completed}
                  onChange={() => handleToggleCompleted(activity.activityId, activity.completed)}
                />
              </div>
              <div className="activity-content">
                <h3>{activity.name}</h3>
                {activity.location && <p className="activity-location">📍 {activity.location}</p>}
                <p className="activity-time">🕐 {activity.time}</p>
                {activity.notes && <p className="activity-notes">{activity.notes}</p>}
              </div>
              <button
                onClick={() => handleDeleteActivity(activity.activityId)}
                className="delete-btn"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="notes-section">
        <h2>Daily Notes</h2>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add notes about this day..."
          rows="4"
          className="notes-textarea"
        />
        <button onClick={handleSaveNote} className="btn-save-note">Save Note</button>
      </section>
    </div>
  );
};

export default DailyPlanView;