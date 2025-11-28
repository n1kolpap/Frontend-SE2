import { useState } from 'react';

export const useDailyPlan = () => {
  const [plan, setPlan] = useState({});
  return { plan, setPlan };
};