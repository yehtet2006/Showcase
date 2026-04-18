import { Router } from "express";
import * as transactionController from "../controllers/transactionController";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/", requireAuth(), transactionController.createTransaction);
router.get("/", requireAuth(), transactionController.getTransactionsByUserId);
router.get("/:transactionId", requireAuth(), transactionController.getTransactionById);
router.put("/:transactionId", requireAuth(), transactionController.updateTransaction);
router.delete("/:transactionId", requireAuth(), transactionController.deleteTransaction);
export default router;
