import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WelcomePage from '../pages/WelcomePage';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import CreateTripPage from '../pages/CreateTripPage';
import TripOverviewPage from '../pages/TripOverviewPage';
import DailyPlanPage from '../pages/DailyPlanPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import Header from '../components/layout/Header';

const AppRouter = () => {
	return (
		<div className="app-shell">
		<Header />
		<main className="app-main">
		<Routes>
		<Route path="/" element={<WelcomePage />} />
		<Route path="/login" element={<LoginPage />} />
		<Route
		path="/home"
		element={
			<ProtectedRoute>
			<HomePage />
			</ProtectedRoute>
		}
		/>
		<Route
		path="/trip/new"
		element={
			<ProtectedRoute>
			<CreateTripPage />
			</ProtectedRoute>
		}
		/>
		<Route
		path="/trip/:tripId/overview"
		element={
			<ProtectedRoute>
			<TripOverviewPage />
			</ProtectedRoute>
		}
		/>
		<Route
		path="/trip/:tripId/daily"
		element={
			<ProtectedRoute>
			<DailyPlanPage />
			</ProtectedRoute>
		}
		/>
		<Route path="*" element={<NotFoundPage />} />
		</Routes>
		</main>
		</div>
	);
};

export default AppRouter;
