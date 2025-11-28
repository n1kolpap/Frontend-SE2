import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import TripForm from '../components/TripForm';
import DailyPlanView from '../components/DailyPlanView';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

const AppRouter = () => {
  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={SignUp} />
      <PrivateRoute exact path="/dashboard" component={Dashboard} />
      <PrivateRoute exact path="/create-trip" component={TripForm} />
      <PrivateRoute exact path="/trip/:tripId/daily/:date" component={DailyPlanView} />
      <Route exact path="/">
        <Redirect to="/dashboard" />
      </Route>
    </Switch>
  );
};

export default AppRouter;