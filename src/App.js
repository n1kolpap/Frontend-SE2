import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import AppRouter from './router/AppRouter';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <TripProvider>
            <AppRouter />
          </TripProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;