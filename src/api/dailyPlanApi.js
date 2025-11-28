import apiClient from './client';

export const getDailyPlans = async (userId, tripId) => {
	const res = await apiClient.get(`/user/${userId}/tripPlan/${tripId}/dailyPlan`);
	return res.data;
};

export const addActivity = async (userId, tripId, date, payload) => {
	const res = await apiClient.post(
		`/user/${userId}/tripPlan/${tripId}/dailyPlan/${date}/activity`,
		payload
	);
	return res.data;
};

export const deleteActivity = async (userId, tripId, date, activityId) => {
	const res = await apiClient.delete(
		`/user/${userId}/tripPlan/${tripId}/dailyPlan/${date}/activity/${activityId}`
	);
	return res.data;
};

export const markActivityCompleted = async (userId, tripId, date, activityId) => {
	const res = await apiClient.post(
		`/user/${userId}/tripPlan/${tripId}/dailyPlan/${date}/activity/${activityId}/completed`
	);
	return res.data;
};

export const addDailyNote = async (userId, tripId, date, note) => {
	const res = await apiClient.post(
		`/user/${userId}/tripPlan/${tripId}/dailyPlan/${date}/note`,
		{ note }
	);
	return res.data;
};
