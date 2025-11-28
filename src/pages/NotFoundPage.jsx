import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
	const navigate = useNavigate();
	return (
		<div className="main-card" style={{ maxWidth: 480, margin: '0 auto' }}>
		<h1 className="page-title">Page not found</h1>
		<p className="page-subtitle">
		The page you are looking for does not exist. You might have followed an invalid link.
		</p>
		<Button onClick={() => navigate('/')}>Go to home</Button>
		</div>
	);
};

export default NotFoundPage;
