import api from "./axios";

export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response;
};

export const markAsRead = async (id) => {
  const response = await api.put(`/notifications/read/${id}`);
  return response;
};

export const markAllAsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response;
};