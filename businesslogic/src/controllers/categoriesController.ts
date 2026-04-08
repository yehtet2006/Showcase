import { Request, Response } from "express";
import * as categoryQueries from "../db/categoriesQueries";

import { getAuth } from "@clerk/express";

export async function createCategory(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const { name, color } = req.body;
        if (!name || !color) {
            res.status(400).json({ error: "Name and color are required" });
            return;
        }
        if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)) {
            res.status(400).json({ error: "color must be a valid hex color (e.g. #FF5733)" });
            return;
        }

        const category = await categoryQueries.createCategory({
            userId,
            name,
            color,
        });
        res.status(201).json({ category });
    } catch (error) {
        console.log("Error creating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export async function getCategories(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
 
        const categories = await categoryQueries.getCategoriesByUserId(userId);
        res.status(200).json({ categories });
    } catch (error) {
        console.error("Error getting categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export async function getCategory(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
 
        const { id } = req.params as { id: string };
        const category = await categoryQueries.getCategoryById(id);
 
        if (!category) {
            res.status(404).json({ error: "Category not found" });
            return;
        }
 
        if (category.userId !== userId) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
 
        res.status(200).json({ category });
    } catch (error) {
        console.error("Error getting category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export async function deleteCategory(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
 
        const { id } = req.params as { id: string };
        await categoryQueries.deleteCategory(id, userId);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export async function updateCategory(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
 
        const { id } = req.params as { id: string };
        const { name, color } = req.body;
 
        if (!name && !color) {
            res.status(400).json({ error: "Provide at least one field to update: name or color" });
            return;
        }
 
        if (color && !/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)) {
            res.status(400).json({ error: "color must be a valid hex color (e.g. #FF5733)" });
            return;
        }
 
        const category = await categoryQueries.updateCategory(id, userId, {
            ...(name && { name }),
            ...(color && { color }),
        });
 
        res.status(200).json({ category });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};