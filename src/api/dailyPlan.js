import client from './client';

export const getDailyPlan = async (userId, tripId) => {
  const response = await client.get(`/user/${userId}/tripPlan/${tripId}/dailyPlan`);
  return response.data;
};