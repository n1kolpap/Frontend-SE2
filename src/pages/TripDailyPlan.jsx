import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import client from '../api/client';
import ActivityCard from '../components/ActivityCard';
import DeleteModal from '../components/DeleteModal';
import FloatingActionButtons from '../components/FloatingActionButtons';
import './TripDailyPlan.css';

const TripDailyPlan = () => {
  const { tripId } = useParams();
  const { user } = useAuth();
  const [dailyPlan, setDailyPlan] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await client.get(`/user/${user.id}/tripPlan/${tripId}/dailyPlan`);  // Path: /api/user/:userId/tripPlan/:tripId/dailyPlan
        setDailyPlan(response.data.data || {});  // Response: { success: true, data: { date: [activities] } }
      } catch (error) {
        console.error('Failed to fetch daily plan');
      }
    };
    fetchPlan();
  }, [tripId, user]);

  const handleDelete = async () => {
    if (!activityToDelete) return;
    setLoading(true);
    try {
      await client.delete(`/user/${user.id}/tripPlan/${tripId}/dailyPlan/${activityToDelete.day}/activity/${activityToDelete.id}`);  // Path: /api/user/:userId/tripPlan/:tripId/dailyPlan/:date/activity/:activityId
      setDailyPlan(prev => {
        const updated = { ...prev };
        if (updated[activityToDelete.day]) {
          updated[activityToDelete.day] = updated[activityToDelete.day].filter(a => a.activityId !== activityToDelete.id);
        }
        return updated;
      });
      setShowModal(false);
      setActivityToDelete(null);
    } catch (error) {
      alert('Failed to delete activity');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (activityId, day) => {
    setActivityToDelete({ id: activityId, day });
    setShowModal(true);
  };

  return (
    <div className="daily-plan">
      {Object.keys(dailyPlan).map(date => (
        <div key={date} className="day-card">
          <h3>{date}</h3>
          {dailyPlan[date].map(activity => (
            <ActivityCard
              key={activity.activityId}
              activity={activity}
              onDelete={() => openDeleteModal(activity.activityId, date)}
            />
          ))}
          <div className="add-activity" onClick={() => {/* Static or no action */}}>
            Add an activity
          </div>
        </div>
      ))}
      <FloatingActionButtons onBlue={() => {/* Static or no action */}} onOrange={() => {}} onBlack={() => {}} />
      <DeleteModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this activity?"
      />
    </div>
  );
};

export default TripDailyPlan;