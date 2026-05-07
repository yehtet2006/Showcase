import { db } from ".";
import { and, eq, gte, lte } from "drizzle-orm";
import { transactions, type NewTransaction } from "./schema";


export const createTransaction = async (transaction: NewTransaction) => {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
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
export const getTransactionsByUserId = async ( userId: string, filters?: { categoryId?: string; from?: Date; to?: Date; }) => {
    // Start with the base condition to filter by userId
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
    const [updatedTransaction] = await db.update(transactions)
    .set({ ...data, updatedAt: new Date()})
    .where(
        and(
        eq(transactions.id, transactionId),
        eq(transactions.userId, userId)
    )
)
    .returning();
    return updatedTransaction;

}

export const deleteTransaction = async (transactionId: string, userId: string) => {
    const existingTransaction = await getTransactionById(transactionId, userId)
    if (!existingTransaction){
        throw new Error(`Transaction with id ${transactionId} not found for this user`)
    }
    if (existingTransaction.userId !== userId){
        throw new Error(`Unauthorized to delete this transaction`)
    }
    await db.delete(transactions).where(
            and(
                eq(transactions.id, transactionId),
                eq(transactions.userId, userId)
            )
        );
    return existingTransaction;
}

// See queries ts under the projects C
export const getDashboardStats = async (userId: string) => {
    const now = new Date();

    // Start of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // End of current month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Get all transactions for current month
    const monthlyTransactions = await db.query.transactions.findMany({
        where: and(
            eq(transactions.userId, userId),
            gte(transactions.date, startOfMonth),
            lte(transactions.date, endOfMonth)
        ),
    });

    // Calculate totals
    const totalIncome = monthlyTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = monthlyTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalSavings = monthlyTransactions.filter((t) => t.type === "savings")
        .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const totalBalance = totalIncome - totalExpenses - totalSavings;

    // Optional: total amount across ALL time
    const allTransactions = await db.query.transactions.findMany({
        where: eq(transactions.userId, userId),
    });

    const totalAmount = allTransactions.reduce((sum, t) => {
        if (t.type === "income") {
            return sum + Number(t.amount);
        }

        return sum - Number(t.amount);
    }, 0);

    return {
        totalAmount,
        totalIncome,
        totalExpenses,
        totalSavings,
        totalBalance,
    };
};