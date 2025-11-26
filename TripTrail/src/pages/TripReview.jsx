import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { mockData } from '../mock/data';
import Card from '../components/Card';
import './TripReview.css';

const TripReview = () => {
  const { tripId } = useParams();
  const history = useHistory();
  const [activeTab, setActiveTab] = useState('review');
  const [review, setReview] = useState('');

  // Mock data for trip
  const trip = mockData.trips.find(t => t.id === parseInt(tripId)) || mockData.trips[0];

  const handleSaveReview = () => {
    // Mock save review
    alert('Review saved');
  };

  const handleExport = () => {
    // Mock export
    alert('Exporting as PDF');
  };

  return (
    <div className="trip-review-container">
      <div className="trip-review-header">
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

      <div className="review-content">
        <Card>
          <h3>Trip Review</h3>
          <textarea
            placeholder="Write your trip review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="review-textarea"
          />
          <button onClick={handleSaveReview} className="btn-save-review">Save Review</button>
        </Card>

        <Card>
          <h3>Trip Summary</h3>
          <p>Destination: {trip.destination}</p>
          <p>Dates: {trip.startDate} - {trip.endDate}</p>
          <p>Activities: {trip.dailyPlan.reduce((total, day) => total + day.activities.length, 0)}</p>
          <button onClick={handleExport} className="btn-export">Export as PDF</button>
        </Card>
      </div>
    </div>
  );
};

export default TripReview;