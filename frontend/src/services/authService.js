import api from './api';

/**
 * Verify user token with backend
 */
export const verifyUser = async () => {
  const response = await api.get('/auth/verify');
  return response.data;
};

/**
 * Get user profile from backend
 */
export const getUserProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};
