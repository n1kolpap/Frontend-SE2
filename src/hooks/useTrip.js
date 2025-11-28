import { useContext } from 'react';
import { TripContext } from '../context/TripContext';

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within TripProvider');
  }
  return context;
};