import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import TripCard from '../components/TripCard';
import './Home.css';

const Home = () => {
  const { trips } = useTrips();
  const history = useHistory();

  return (
    <div className="home">
      <header className="home-header">
        <h1>TripTrail</h1>
        <div className="search-icon">🔍</div>
      </header>
      <main className="home-main">
        {trips.length > 0 ? (
          trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onClick={() => history.push(`/trip/${trip.id}`)} />
          ))
        ) : (
          <>
            <section className="guides">
              <h2>Featured guides from users</h2>
              <div className="cards">
                <div className="card">Guide 1</div>
                <div className="card">Guide 2</div>
              </div>
            </section>
            <section className="destinations">
              <h2>Popular destinations</h2>
              <div className="cards">
                <div className="card">Dest 1</div>
                <div className="card">Dest 2</div>
                <div className="card">Dest 3</div>
              </div>
            </section>
          </>
        )}
      </main>
      <nav className="bottom-nav">
        <div className="nav-item active">🏠</div>
        <div className="nav-item plus" onClick={() => history.push('/trip/create')}>➕</div>
        <div className="nav-item">👤</div>
      </nav>
    </div>
  );
};

export default Home;