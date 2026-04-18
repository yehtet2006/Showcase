import { Router } from "express";
import * as categoryController from "../controllers/categoriesController";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/", requireAuth(), categoryController.createCategory);
router.get("/", requireAuth(), categoryController.getCategories);
router.get("/:id", requireAuth(), categoryController.getCategory);
router.put("/:id", requireAuth(), categoryController.updateCategory);
router.delete("/:id", requireAuth(), categoryController.deleteCategory);
export default router;