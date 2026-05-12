import express from "express";
import cors from "cors";
import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/userRoutes";
import categoriesRoutes from "./routes/categoriesRoutes";
import transactionsRoutes from "./routes/transactionsRoutes";

const app = express();

app.use(express.json());
app.use(clerkMiddleware());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "The server is running fine",
  });
});

app.use("/api/users", userRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/transactions", transactionsRoutes);

export default app;