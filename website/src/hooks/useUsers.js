import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { getUsers, getUserMe } from "../lib/api";

export const useUsers = () => {
    const result = useQuery({ queryKey: ["users"], queryFn: getUsers });
    return result;
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserMe(id),
    enabled: !!id, // important
  });
};


