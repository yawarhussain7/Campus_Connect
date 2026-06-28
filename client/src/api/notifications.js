import api from "./axios";

export const getNotifications = async () => {
  const response = await api.get("/student/");
  return response;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/student/read/${id}`);
  return response;
};

export const markAllAsRead = async () => {
  const response = await api.put("/student/read-all");
  return response;
};
