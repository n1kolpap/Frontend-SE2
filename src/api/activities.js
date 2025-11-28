import client from './client';

export const addActivity = async (userId, tripId, date, activityData) => {
  const response = await client.post(`/user/${userId}/tripPlan/${tripId}/dailyPlan/${date}/activity`, activityData);
  return response.data;
};

export const deleteActivity = async (userId, tripId, date, activityId) => {
  const response = await client.delete(`/user/${userId}/tripPlan/${tripId}/dailyPlan/${date}/activity/${activityId}`);
  return response.data;
};