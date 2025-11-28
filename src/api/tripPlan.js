import client from './client';

export const createTripPlan = async (userId, tripData) => {
  const response = await client.post(`/user/${userId}/tripPlan`, tripData);
  return response.data;
};

export const getTripPlan = async (userId, tripId) => {
  const response = await client.get(`/user/${userId}/tripPlan/${tripId}`);
  return response.data;
};

export const updateTripPlan = async (userId, tripId, tripData) => {
  const response = await client.put(`/user/${userId}/tripPlan/${tripId}`, tripData);
  return response.data;
};

export const deleteTripPlan = async (userId, tripId) => {
  const response = await client.delete(`/user/${userId}/tripPlan/${tripId}`);
  return response.data;
};