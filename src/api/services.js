import apiClient from './client';

// User Authentication
export const signUp = async (username, password, email) => {
  const response = await apiClient.post('/user', {
    username,
    password,
    email,
  });
  return response.data;
};

export const logIn = async (username, password) => {
  const response = await apiClient.put('/user/login', {
    username,
    password,
  });
  return response.data;
};

// Trip Plans
export const createTripPlan = async (userId, tripData) => {
  const response = await apiClient.post(`/user/${userId}/tripPlan`, tripData);
  return response.data;
};

export const getTripPlan = async (userId, tripId) => {
  const response = await apiClient.get(`/user/${userId}/tripPlan/${tripId}`);
  return response.data;
};

export const updateTripPlan = async (userId, tripId, tripData) => {
  const response = await apiClient.put(`/user/${userId}/tripPlan/${tripId}`, tripData);
  return response.data;
};

export const deleteTripPlan = async (userId, tripId) => {
  const response = await apiClient.delete(`/user/${userId}/tripPlan/${tripId}`);
  return response.data;
};

// Daily Plans
export const getDailyPlans = async (userId, tripId) => {
  const response = await apiClient.get(`/user/${userId}/tripPlan/${tripId}/dailyPlan`);
  return response.data;
};

export const addActivity = async (userId, tripId, date, activityData) => {
  const response = await apiClient.post(
    `/user/${userId}/tripPlan/${tripId}/dailyPlan/${date}/activity`,
    activityData
  );
  return response.data;
};

export const removeActivity = async (userId, tripId, date, activityId) => {
  const response = await apiClient.delete(
    `/user/${userId}/tripPlan/${tripId}/dailyPlan/${date}/activity/${activityId}`
  );
  return response.data;
};

export const markActivityCompleted = async (userId, tripId, date, activityId) => {
  const response = await apiClient.post(
    `/user/${userId}/tripPlan/${tripId}/dailyPlan/${date}/activity/${activityId}/completed`
  );
  return response.data;
};

export const addNote = async (userId, tripId, date, note) => {
  const response = await apiClient.post(
    `/user/${userId}/tripPlan/${tripId}/dailyPlan/${date}/note`,
    { note }
  );
  return response.data;
};

// Utility
export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};