import { useContext } from 'react';
import { TripContext } from '../context/TripContext';

export const useTrips = () => useContext(TripContext);