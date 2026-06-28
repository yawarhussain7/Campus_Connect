import api from "./axios";

export const getProfile = async () => {
  const response = await api.get("/student/me");
  return response;
};

export const updateProfile = async (data) => {
  const response = await api.put("/student/update", data);
  return response;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response;
};