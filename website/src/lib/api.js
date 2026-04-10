import api from "./axios";

//Users api
// export const syncUser = async (userData) => {
//     if (!userData?.email || !userData?.name) {
//         throw new Error("syncUser requires both email and name"); 
//     }
//   const { data } = await api.post("/users/sync", userData);
//   return data;
// };

export const syncUser = async () => {
  const { data } = await api.post("/users/sync");
  return data;
};

export const getUsers = async () => {
  const { data } = await api.get("/users/all");
  return data.users;
}

export const getCurrentUser = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data.user;
}

//Transactions api

//Transactions api

//Categories api