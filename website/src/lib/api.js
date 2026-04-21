import api from "./axios";

// Users api
export const syncUser = async () => {
  const { data } = await api.post("/users/sync");
  return data;
};

export const getUsers = async () => {
  const { data } = await api.get("/users/all");
  return data.users;
}

// get user by id
export const getCurrentUser = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data.user;
}

export const updateUser = async (payload) => {
  const { id, ...userData } = payload;
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

//Transactions api


//Transactions api

//Categories api