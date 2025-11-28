import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import './SuggestedActivities.css';

const SuggestedActivities = () => {
  return (
    <div className="suggested-activities">
      <Input placeholder="Search" />
      <section className="near-you">
        <h2>Near you</h2>
        <div className="cards">
          <div className="card">
            <h3>Activity 1</h3>
            <p>Description</p>
            <Button>Add to plan</Button>
          </div>
        </div>
      </section>
      <section className="highly-rated">
        <h2>Highly rated</h2>
        <div className="cards">
          <div className="card">
            <h3>Activity 2</h3>
            <p>Description</p>
            <Button>Add to plan</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SuggestedActivities;