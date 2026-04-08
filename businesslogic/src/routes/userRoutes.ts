import { Router } from "express";
import * as userController from "../controllers/userController";
import { requireAuth } from "@clerk/express";

const router = Router();

router.post("/sync", userController.syncUser);
router.get("/:id", requireAuth(), userController.getUser);
router.get("/all", requireAuth(), userController.getAllUsers);

router.put("/:id", requireAuth(), userController.updateUser);
router.delete("/:id", requireAuth(), userController.deleteUser);
export default router;  