import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTrip } from '../hooks/useTrip';
import BottomNav from '../components/BottomNav';
import Card from '../components/Card';
import TripCard from '../components/TripCard';
import './Dashboard.css';

const Dashboard = () => {
  const history = useHistory();
  const { user } = useAuth();
  const { trips } = useTrip();
  const [activeTrip, setActiveTrip] = useState(null);

  useEffect(() => {
    // Get the most recent trip or upcoming trip
    if (trips && trips.length > 0) {
      const sortedTrips = [...trips].sort((a, b) => 
        new Date(b.startDate) - new Date(a.startDate)
      );
      setActiveTrip(sortedTrips[0]);
    }
  }, [trips]);

  const handleCreateTrip = () => {
    history.push('/create-trip');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-logo">TripTrail</h1>
        <button className="search-btn">🔍</button>
      </div>

      {activeTrip ? (
        <TripCard trip={activeTrip} />
      ) : (
        <Card className="empty-trip-card">
          <div className="empty-state">
            <h3>No active trips</h3>
            <button onClick={handleCreateTrip} className="btn-create-trip">
              Create Your First Trip
            </button>
          </div>
        </Card>
      )}

      <section className="dashboard-section">
        <h2>Your Trips</h2>
        <div className="trips-list">
          {trips && trips.length > 0 ? (
            trips.map((trip) => (
              <Card 
                key={trip.tripId} 
                className="trip-card-small"
                onClick={() => history.push(`/trip/${trip.tripId}`)}
              >
                <h3>{trip.destination}</h3>
                <p>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
              </Card>
            ))
          ) : (
            <p className="empty-message">No trips yet. Create one to get started!</p>
          )}
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default Dashboard;