import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { getUsers, getCurrentUser } from "../lib/api";

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


