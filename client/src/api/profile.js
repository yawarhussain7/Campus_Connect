import api, { API_BASE_URL } from "./axios";

export const getProfile = async () => {
  const response = await api.get("/student/me");
  return response;
};

export const updateProfile = async (data) => {
  const response = await api.put("/student/update", data);
  return response;
};

// Profile picture upload: sent as multipart/form-data so the file itself
// reaches the server instead of being flattened into JSON.
export const uploadProfileImage = async (data) => {
  const response = await api.put("/student/update", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

/** Absolute URL for a stored avatar path so it renders off the API origin. */
export const avatarUrl = (avatar) => {
  if (!avatar) return "";
  if (/^https?:\/\//i.test(avatar)) return avatar;

  return `${API_BASE_URL}${avatar.startsWith("/") ? "" : "/"}${avatar}`;
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response;
};