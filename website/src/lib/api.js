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
export const addTransaction = async (transactionData) => {
  const { data } = await api.post("/transactions", transactionData);
  return data; 
}
export const getTransactions = async () => {
  const { data } = await api.get("/transactions"); 
  return data.transactions;
}
export const getTransactionById = async (transactionId) => {
  const { data } = await api.get(`/transactions/${transactionId}`);
  return data;
};
export const updateTransaction = async (transactionId, transactionData) => {
  const { data } = await api.put(`/transactions/${transactionId}`, transactionData);
  return data;
};;
export const deleteTransaction = async (transactionId) => {
  const { data } = await api.delete(`/transactions/${transactionId}`);
  return data;
};

export const getDashboardData = async () => {
  const { data } = await api.get('/transactions/dashboard/stats');
  return data.summary;
}
//Categories api
export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data.categories;
}
export const addCategory = async (categoryData) => {
  const { data } = await api.post("/categories", categoryData);
  return data;
}
