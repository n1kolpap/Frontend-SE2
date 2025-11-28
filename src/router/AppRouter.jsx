import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { TripProvider } from '../context/TripContext';
import Welcome from '../pages/Welcome';
import Login from '../pages/Login';
import Signup from '../pages/SignUp';
import Home from '../pages/Home';
import CreateTrip from '../pages/CreateTrip';
import TripOverview from '../pages/TripOverview';
import TripDailyPlan from '../pages/TripDailyPlan';
import SuggestedActivities from '../pages/SuggestedActivities';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('token');
  return (
    <Route
      {...rest}
      render={(props) => (token ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

const AppRouter = () => (
  <AuthProvider>
    <TripProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <ProtectedRoute path="/home" component={Home} />
          <ProtectedRoute path="/trip/create" component={CreateTrip} />
          <ProtectedRoute path="/trip/:tripId" component={TripOverview} />
          <ProtectedRoute path="/trip/:tripId/daily" component={TripDailyPlan} />
          <ProtectedRoute path="/trip/:tripId/activities" component={SuggestedActivities} />
        </Switch>
      </Router>
    </TripProvider>
  </AuthProvider>
);

export default AppRouter;