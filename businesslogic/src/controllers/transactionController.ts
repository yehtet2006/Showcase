import type { Request, Response} from "express";
import * as transactionQueries from "../db/transactionsQueries";
import { getAuth } from "@clerk/express";


export async function createTransaction(req: Request, res: Response) {
    try {

        // Get the user ID from the authentication token using Clerk's getAuth function
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        
        // Validate the request body
        const { categoryId, name, amount, type, description, date } = req.body;
 
        if (!name || !amount || !type || !date) {
            res.status(400).json({ error: "name, amount, type, and date are required" });
            return;
        }
 
        if (type !== "income" && type !== "expense") {
            res.status(400).json({ error: 'type must be "income" or "expense"' });
            return;
        }
 
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            res.status(400).json({ error: "Invalid date" });
            return;
        }
 
        const transaction = await transactionQueries.createTransaction({
            userId,
            categoryId: categoryId ?? null,
            name,
            amount: String(amount),
            type,
            description: description ?? null,
            date: parsedDate,
        });
 
        res.status(201).json({ transaction });

    } catch (error) {
        console.log("Error creating transaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getTransactionsByUserId(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Get filters from query parameters
        const { categoryId, from, to } = req.query;

        // Build filters object for the query
        const filters = {
            categoryId: categoryId ? String(categoryId) : undefined,
            from: from ? new Date(String(from)) : undefined,
            to: to ? new Date(String(to)) : undefined,
        };

        // Validate date filters
        if (filters.from && isNaN(filters.from.getTime())) {
            res.status(400).json({ error: 'Invalid "from" date' });
            return;
        }
        if (filters.to && isNaN(filters.to.getTime())) {
            res.status(400).json({ error: 'Invalid "to" date' });
            return;
        }

        const transactions = await transactionQueries.getTransactionsByUserId(userId, filters);
        res.status(200).json({ transactions });

    } catch (error) {
        console.log("Error getting transactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getTransactionById(req: Request, res: Response){
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { transactionId } = req.params as { transactionId: string };
        if (!transactionId) {
            res.status(400).json({ error: "Transaction ID is required" });
            return;
        }
        const transaction = await transactionQueries.getTransactionById(transactionId, userId);
        if (!transaction) {
            res.status(404).json({ error: "Transaction not found" });
            return;
        }
        res.status(200).json({ transaction });


    } catch (error) {
        console.log("Error getting transaction by id:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateTransaction(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { transactionId } = req.params as { transactionId: string };
        const { categoryId, name, amount, type, description, date } = req.body;

        const existingTransaction = await transactionQueries.getTransactionById(transactionId, userId);
        if (!existingTransaction) {
            res.status(404).json({ error: "Transaction not found" });
            return;
        }

        if(existingTransaction.userId !== userId){
            res.status(403).json({ error: "Forbidden" });
            return;
        }

        if (type && type !== "income" && type !== "expense") {
            res.status(400).json({ error: 'type must be "income" or "expense"' });
            return;
        }
        let parsedDate: Date | undefined;
        if (date) {
            parsedDate = new Date(date);
            if (isNaN(parsedDate.getTime())) {
                res.status(400).json({ error: "Invalid date" });
                return;
            }
        }

        // const updatedTransaction = await transactionQueries.updateTransaction(transactionId, userId, {
        //     name,
        //     amount,
        //     type,
        //     date: date ? new Date(date) : undefined,
        //     categoryId,
        //     description,
        // });

        // This will check if the values are undefined, if not then they will be added to the update object
        const updatedTransaction = await transactionQueries.updateTransaction(transactionId, userId, {
            ...(categoryId !== undefined && { categoryId }),
            ...(name && { name }),
            ...(amount !== undefined && { amount: String(amount) }),
            ...(type && { type }),
            ...(description !== undefined && { description }),
            ...(parsedDate && { date: parsedDate }),
        });

        res.status(200).json({ transaction: updatedTransaction });

    } catch (error) {
        console.log("Error updating transaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function deleteTransaction(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { transactionId } = req.params as { transactionId: string };
        
        const deletedTransaction = await transactionQueries.deleteTransaction(transactionId, userId);
        if (!deletedTransaction) {
            res.status(404).json({ error: "Transaction not found" });
            return;
        }

        res.status(200).json({ message: "Transaction deleted successfully" });

    } catch (error) {
        console.log("Error deleting transaction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}