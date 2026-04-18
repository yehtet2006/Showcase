import { Router } from "express";
import * as userController from "../controllers/userController";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/sync", requireAuth(), userController.syncUser);
router.get("/all", requireAuth(), userController.getAllUsers);
router.get("/:id", requireAuth(), userController.getUser);
router.put("/:id", requireAuth(), userController.updateUser);
router.delete("/:id", requireAuth(), userController.deleteUser);
export default router;  