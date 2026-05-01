import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories, addCategory } from "../lib/api";

// Hook to fetch all categories 
export const useCategories = () => {
    const result = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories
    })
    return result;
};

export const useAddCategory = () => {
    return useMutation({ mutationFn: addCategory});
}