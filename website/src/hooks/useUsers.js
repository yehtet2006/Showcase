import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getUsers, getCurrentUser, updateUser } from "../lib/api";

export const useUsers = () => {
    const result = useQuery({ queryKey: ["users"], queryFn: getUsers });
    return result;
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getCurrentUser(id),
    enabled: !!id, // important
  });
};

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser, 

    onSuccess: () => {

      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user']);
      // queryClient.invalidateQueries(['user', selectedUserId]);
    }
  });
}
