import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import Input from '../components/Input';
import Button from '../components/Button';
import './CreateTrip.css';

const CreateTrip = () => {
  const history = useHistory();
  const { addTrip } = useTrips();
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fillWithActivities, setFillWithActivities] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trip = {
      id: crypto.randomUUID(),
      destination,
      startDate,
      endDate,
      autoActivities: fillWithActivities
    };
    addTrip(trip);
    history.push('/home');
  };

  return (
    <div className="create-trip">
      <button className="close" onClick={() => history.push('/home')}>X</button>
      <h1>Plan a new trip</h1>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Where to?"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <div className="dates">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="collaborator">
          <span>Invite a collaborator</span>
          <button type="button">+</button>
        </div>
        <label>
          <input
            type="checkbox"
            checked={fillWithActivities}
            onChange={(e) => setFillWithActivities(e.target.checked)}
          />
          Fill plan with activities
        </label>
        <Button>Start planning</Button>
      </form>
    </div>
  );
};

export default CreateTrip;