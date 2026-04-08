import { db } from ".";
import { desc, and, eq, gte, lte } from "drizzle-orm";
import { transactions, type NewTransaction } from "./schema";

// Transaction queries
export const createTransaction = async (transaction: NewTransaction) => {
    const [newTransaction] = await db.insert(transaction).values(transaction).returning();
    return newTransaction;
};

export const getTransactionById = async (transactionId: string, userId: string) => {
    return await db.query.transactions.findFirst({
        where: and(eq(transactions.id, transactionId), eq(transactions.userId, userId)),
        with: {
            user: true,
            category: true,
        },
    });
};

// Get all transactions for a user, optionally filtered by category and/or date range
export const getTransactionByUserId = async (
    userId: string,
    filters?: { categoryId?: string; from?: Date; to?: Date; }
) => {
    const conditions = [eq(transactions.userId, userId)];

    // This will chech the filters, if true then the values will be pushed into conditions above
    if (filters?.categoryId !== undefined){
        conditions.push(eq(transactions.categoryId, filters.categoryId));
    }
    if (filters?.from) {
        conditions.push(gte(transactions.date, filters.from));
    }
    if (filters?.to) {
        conditions.push(lte(transactions.date, filters.to))
    }

    return await db.query.transactions.findMany({
        where: and(...conditions),
        with: { category: true },
        orderBy: (t, { desc }) => [desc(t.date)],
    });
};

export const updateTransaction = async (transactionId: string, userId: string, data:Partial<NewTransaction>) => {
    const existingTransaction = await getTransactionById(transactionId, userId)

    if (!existingTransaction){
        throw new Error(`Transaction with id ${transactionId} not found for this user`)
    }
    const [updatedTransaction] = await db.update(transactions).set({ ...data, updatedAt: new Date()}).where(eq(transactions.userId, userId)).returning();
    return updatedTransaction;

}

// See queries ts under the projects C