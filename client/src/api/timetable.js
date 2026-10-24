import api from './axios';

/**
 * Fetch all scraped departments from the database
 */
export const getScrapedDepartments = async () => {
  try {
    const response = await api.get('/timetable/departments');
    // api interceptor returns response.data if object
    const payload = response?.data ?? response;
    return Array.isArray(payload) ? payload : [];
  } catch (error) {
    console.error('Failed to fetch scraped departments:', error);
    return [];
  }
};

/**
 * Fetch subjects catalog by department (or all departments)
 */
export const getDepartmentSubjects = async (department) => {
  try {
    const params = department ? { department } : {};
    const response = await api.get('/timetable/subjects', { params });
    const payload = response?.data ?? response;
    return payload?.data ?? payload ?? [];
  } catch (error) {
    console.error('Failed to fetch department subjects:', error);
    return null;
  }
};

/**
 * Trigger backend scraping of timetable and departments from a URL
 */
export const scrapeTimetableUrl = async (url) => {
  return api.post('/timetable/scrape', { url });
};

/**
 * Fetch timetable entries with optional query filters
 */
export const getSavedTimetable = async (filters = {}) => {
  try {
    const response = await api.get('/timetable', { params: filters });
    const payload = response?.data ?? response;
    return Array.isArray(payload) ? payload : [];
  } catch (error) {
    console.error('Failed to fetch timetable records:', error);
    return [];
  }
};

/**
 * Save custom student timetable
 */
export const saveTimetable = async (entries = []) => {
  return api.post('/timetable/save', { entries });
};

