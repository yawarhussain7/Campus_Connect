import api from './axios';

export const getDashboardStats = () => {
  return api.get('/student/dashboard');
};
