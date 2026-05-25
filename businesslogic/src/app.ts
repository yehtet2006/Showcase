
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/userRoutes";
import categoriesRoutes from "./routes/categoriesRoutes";
import transactionsRoutes from "./routes/transactionsRoutes";
import { ENV } from "./config/env";

const app = express();

app.use(express.json());
app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true }));
app.use(cors({origin: ENV.FRONTEND_URL, credentials: true})); 

app.use("/api/users", userRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/transactions", transactionsRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Server healthy",
  });
});

export default app;