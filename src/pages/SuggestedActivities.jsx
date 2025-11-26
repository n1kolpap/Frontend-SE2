import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { mockData } from '../mock/data';
import Card from '../components/Card';
import './SuggestedActivities.css';

const SuggestedActivities = () => {
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToPlan = (activity) => {
    // Mock add to plan
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      history.push('/trip/1/daily-plan');
    }, 2000);
  };

  const filteredActivities = mockData.activities.filter(activity =>
    activity.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="suggested-activities-container">
      <div className="suggested-activities-header">
        <button onClick={() => history.goBack()} className="back-btn">←</button>
        <h1>Suggested Activities</h1>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search activities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="categories">
        <h2>Near you</h2>
        <div className="activities-list">
          {filteredActivities.slice(0, 2).map((activity) => (
            <Card key={activity.id} className="activity-card">
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <button onClick={() => handleAddToPlan(activity)} className="btn-add-to-plan">
                Add to Plan
              </button>
            </Card>
          ))}
        </div>

        <h2>Highly rated</h2>
        <div className="activities-list">
          {filteredActivities.slice(2).map((activity) => (
            <Card key={activity.id} className="activity-card">
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <button onClick={() => handleAddToPlan(activity)} className="btn-add-to-plan">
                Add to Plan
              </button>
            </Card>
          ))}
        </div>
      </div>

      {showSuccess && (
        <div className="success-message">
          Activity added to plan!
        </div>
      )}
    </div>
  );
};

export default SuggestedActivities;