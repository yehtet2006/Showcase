import { db } from ".";
import { eq, and } from "drizzle-orm";
import { categories, type NewCategory } from "./schema";

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