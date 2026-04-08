import { Router } from "express";
import * as transactionController from "../controllers/transactionController";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/", requireAuth(), transactionController.createTransaction);
router.get("/", requireAuth(), transactionController.getTransactionsByUserId);
router.get("/:id", requireAuth(), transactionController.getTransactionById);
router.put("/:id", requireAuth(), transactionController.updateTransaction);
router.delete("/:id", requireAuth(), transactionController.deleteTransaction);
export default router;