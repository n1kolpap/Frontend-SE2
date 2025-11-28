import { useContext } from 'react';
import { TripContext } from '../context/TripContext';

export const useTrip = () => useContext(TripContext);
