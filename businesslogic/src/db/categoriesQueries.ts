import { db } from ".";
import { eq, and } from "drizzle-orm";
import { categories, type NewCategory, transactions, type NewTransaction } from "./schema";

// Category queries
export const createCategory = async (category: NewCategory) => {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
};

export const getCategoryById = async (id: string) => {
    return await db.query.categories.findFirst({
        where: eq(categories.id, id),
        with: { user: true },
    });
};

export const getCategoriesByUserId = async (userId: string) => {
    return await db.query.categories.findMany({
        where: eq(categories.userId, userId ),
    })
}

export const updateCategory = async (categoryId: string, userId: string, data: Partial<NewCategory>) => {
    const existingCategory = await db.query.categories.findFirst({
        where: and(eq(categories.id, categoryId), eq(categories.userId, userId)),
    });
    if (!existingCategory) {
        throw new Error(`Category with id ${categoryId} not found for this user`);
    }

    const [updatedCategory] = await db.update(categories).set(data).where(and(eq(categories.id, categoryId), eq(categories.userId, userId))).returning();
    return updatedCategory;
}

export const deleteCategory = async (categoryId: string, userId: string) => {
    const existingCategory = await db.query.categories.findFirst({
        where: and(eq(categories.id, categoryId), eq(categories.userId, userId)),
    });
    if (!existingCategory){
        throw new Error(`Category with id ${categoryId} not found for this user`);
    }

    await db.delete(categories).where(and(eq(categories.id, categoryId), eq(categories.userId, userId)));
    
}

export const getExpenseCategories = async (userId: string) => {
    const expenseTransactions = await db.query.transactions.findMany({
        where: and(
            eq(transactions.userId, userId),
            eq(transactions.type, "expense")
        ),
        with: {
            category: true,
        },
    });

    const categoryMap: Record<string, number> = {};

    expenseTransactions.forEach((transaction) => {
        const categoryName =
            transaction.category?.name || "Other";

        if (!categoryMap[categoryName]) {
            categoryMap[categoryName] = 0;
        }

        categoryMap[categoryName] += Number(transaction.amount);
    });

    return Object.entries(categoryMap).map(
        ([category, amount]) => ({
            category,
            amount,
        })
    );
};

export const getExpenseCategoriesPerMonth = async (userId: string) => {
    const expenseTransactions = await db.query.transactions.findMany({
        where: and(
            eq(transactions.userId, userId),
            eq(transactions.type, "expense")
        ),
        with: {
            category: true,
        },
    });

    const categoryMonthMap: Record<string, Record<string, number>> = {};
    expenseTransactions.forEach((transaction) => {
        const categoryName =
            transaction.category?.name || "Other";
        const month = transaction.date.toLocaleString("en-us", {
            month: "short",
            year: "numeric",
        });
        if (!categoryMonthMap[categoryName]) {
            categoryMonthMap[categoryName] = {};
        }
        if (!categoryMonthMap[categoryName][month]) {
            categoryMonthMap[categoryName][month] = 0;
        }
        categoryMonthMap[categoryName][month] += Number(transaction.amount);
    }); 

    // return expenseTransactions.map((transaction) => ({
    //     category: transaction.category?.name || "None",
    //     amount: Number(transaction.amount),
    //     month: transaction.date.toLocaleString("default", {
    //         month: "long",
    //         year: "numeric",
    //     }),
    // }));
    return Object.entries(categoryMonthMap).map(([category, monthData]) => ({
        category,
        monthlyData: Object.entries(monthData).map(([month, amount]) => ({
            month,
            amount,
        })),
    }));
};
