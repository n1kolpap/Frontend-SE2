import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import './index.css';
import './styles/variables.css';
import './styles/layout.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<React.StrictMode>
	<BrowserRouter>
	<AuthProvider>
	<TripProvider>
	<App />
	</TripProvider>
	</AuthProvider>
	</BrowserRouter>
	</React.StrictMode>
);
