import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Welcome from '../pages/Welcome';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import CreateTrip from '../pages/CreateTrip';
import TripOverview from '../pages/TripOverview';
import TripDailyPlan from '../pages/TripDailyPlan';
import TripReview from '../pages/TripReview';
import SuggestedActivities from '../pages/SuggestedActivities';

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Welcome} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route path="/trip/create" component={CreateTrip} />
        <Route path="/trip/:tripId/daily-plan" component={TripDailyPlan} />
        <Route path="/trip/:tripId/overview" component={TripOverview} />
        <Route path="/trip/:tripId/review" component={TripReview} />
        <Route path="/suggested-activities" component={SuggestedActivities} />
      </Switch>
    </Router>
  );
};

export default AppRouter;