import api from './api';

/**
 * Get complete safety information for a destination
 * @param {string} destination - Destination name
 */
export const getSafetyInfo = async (destination) => {
  const response = await api.get(`/safety?destination=${encodeURIComponent(destination)}`);
  return response.data;
};

/**
 * Get only weather information
 * @param {string} destination - Destination name
 */
export const getWeather = async (destination) => {
  const response = await api.get(`/safety/weather?destination=${encodeURIComponent(destination)}`);
  return response.data;
};

/**
 * Get only hazard alerts
 * @param {string} destination - Destination name
 */
export const getHazards = async (destination) => {
  const response = await api.get(`/safety/hazards?destination=${encodeURIComponent(destination)}`);
  return response.data;
};

/**
 * Get emergency contacts
 * @param {string} destination - Destination name
 */
export const getEmergencyContacts = async (destination) => {
  const response = await api.get(`/safety/emergency?destination=${encodeURIComponent(destination)}`);
  return response.data;
};
