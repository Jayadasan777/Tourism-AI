import api from './api';

/**
 * Generate new itinerary
 * @param {Object} data - Itinerary request data
 * @param {string} data.destination - Destination name
 * @param {number} data.budget - Total budget in INR
 * @param {number} data.duration - Number of days
 * @param {string[]} data.interests - Array of interest tags
 * @param {string} data.startDate - ISO date string
 */
export const generateItinerary = async (data) => {
  const response = await api.post('/itinerary/generate', data);
  return response.data;
};

/**
 * Get user's saved itineraries
 */
export const getMyItineraries = async () => {
  const response = await api.get('/itinerary/my');
  return response.data;
};

/**
 * Get specific itinerary by ID
 * @param {string} id - Itinerary ID
 */
export const getItineraryById = async (id) => {
  const response = await api.get(`/itinerary/${id}`);
  return response.data;
};

/**
 * Delete itinerary
 * @param {string} id - Itinerary ID
 */
export const deleteItinerary = async (id) => {
  const response = await api.delete(`/itinerary/${id}`);
  return response.data;
};
