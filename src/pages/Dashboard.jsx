import React from 'react';
import { useHistory } from 'react-router-dom';
import { mockData } from '../mock/data';
import BottomNav from '../components/BottomNav';
import Card from '../components/Card';
import TripCard from '../components/TripCard';
import './Dashboard.css';

const Dashboard = () => {
  const history = useHistory();
  const activeTrip = mockData.trips.length > 0 ? mockData.trips[0] : null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-logo">TripTrail</h1>
        <button className="search-btn">🔍</button>
      </div>

      {activeTrip && (
        <TripCard trip={activeTrip} />
      )}

      <section className="dashboard-section">
        <h2>Featured guides from users</h2>
        <div className="horizontal-scroll">
          {mockData.guides.map((guide) => (
            <Card key={guide.id} className="guide-card">
              <div className="card-placeholder">{guide.title}</div>
            </Card>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Popular destinations</h2>
        <div className="destinations-grid">
          {mockData.destinations.map((destination) => (
            <Card key={destination.id} className="destination-card">
              <div className="card-placeholder">{destination.name}</div>
            </Card>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
};

export default Dashboard;