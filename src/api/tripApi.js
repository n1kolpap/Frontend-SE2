import apiClient from './client';

export const createTripPlan = async (userId, payload) => {
	const res = await apiClient.post(`/user/${userId}/tripPlan`, payload);
	return res.data;
};

export const getTripPlan = async (userId, tripId) => {
	const res = await apiClient.get(`/user/${userId}/tripPlan/${tripId}`);
	return res.data;
};

export const updateTripPlan = async (userId, tripId, payload) => {
	const res = await apiClient.put(`/user/${userId}/tripPlan/${tripId}`, payload);
	return res.data;
};

export const deleteTripPlan = async (userId, tripId) => {
	const res = await apiClient.delete(`/user/${userId}/tripPlan/${tripId}`);
	return res.data;
};
