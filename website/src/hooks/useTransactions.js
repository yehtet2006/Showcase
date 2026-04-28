import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    addTransaction,
    getTransactionById,
    getTransactions,
    updateTransaction,
    deleteTransaction
 } from "../lib/api";
import { use } from "react";

// Hook to fetch all transactions
export const useTransactions = () => {
    const result = useQuery({
        queryKey: ["transactions"],
        queryFn: getTransactions
    })
    return result;
};

export const useAddTransaction = () => {
    return useMutation({ mutationFn: addTransaction});
};

// Hook to get a single transaction by ID
export const useTransaction = (transactionId) => {
    return useQuery({
        queryKey: ["transaction", transactionId],
        queryFn: () => getTransactionById(transactionId),
        enabled: !!transactionId, // Only run the query if transactionId is provided
    })
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient(); // Get the query client instance
    return useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transaction"] }); // Invalidate the transactions query to refetch the updated list
        }
    })
}

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient(); // Get the query client instance

    return useMutation({
        mutationFn: updateTransaction,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Invalidate the transactions query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ["transaction", variables.transactionId] }); // Invalidate the specific transaction query to refetch the updated transaction details

        }
    })
}
