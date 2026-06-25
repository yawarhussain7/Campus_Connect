import api from './axios';

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/dashboard');
    return response;
  } catch (error) {
    throw error;
  }
};