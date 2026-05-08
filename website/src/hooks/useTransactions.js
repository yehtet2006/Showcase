import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
    addTransaction,
    getTransactionById,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getDashboardData
 } from "../lib/api";
import { use } from "react";

// Hook to fetch all transactions
export const useTransactions = () => {
    const result = useQuery({
        queryKey: ["transactions"],
        queryFn: getTransactions,
    
    })
    return result;
};

export const useDashboardData = () => {
    const result = useQuery({
        queryKey: ["dashboardData"],
        queryFn: getDashboardData,
    })
    return result;
}

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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] }); // was "transaction"
        }
    })
}

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...transactionData }) => updateTransaction(id, transactionData), // unwrap here
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["transaction", variables.id] }); // also fix: was variables.transactionId, should be variables.id
        }
    })
}
