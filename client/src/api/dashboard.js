import api from './axios';

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/student/dashboard');
    return response;
  } catch (error) {
    throw error;
  }
};
