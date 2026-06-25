import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true
});

api.interceptors.response.use(
  (response) => {
    // Only transform JSON responses, not blobs or other binary data
    if (response.data && typeof response.data === 'object' && !(response.data instanceof Blob)) {
      return response.data;
    }
    return response;
  },
  (error) => Promise.reject(error.response?.data || error)
);

export default api;