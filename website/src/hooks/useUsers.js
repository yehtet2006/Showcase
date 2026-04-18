import { useMutation, useQuery } from "@tanstack/react-query";
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

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["myUser"] });
    }
  })
}