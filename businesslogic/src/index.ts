import express from "express"
import cors from "cors";

import {ENV} from "./config/env"
import { clerkMiddleware } from "@clerk/express";

import userRoutes from "./routes/userRoutes";
import categoriesRoutes from "./routes/categoriesRoutes";
import transactionsRoutes from "./routes/transactionsRoutes";


const app = express();

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());
// You can use this middleware to protect your routes and access user information from Clerk, auth obj will be attached to the request object, allowing you to access user information in your route handlers.
app.use(clerkMiddleware());
// Middleware to parse URL-encoded bodies from incoming requests, with extended syntax support
app.use(express.urlencoded({ extended: true})) 
// Middleware to enable Cross-Origin Resource Sharing (CORS) for all routes, allowing requests from different origins
app.use(cors({origin: ENV.FRONTEND_URL, credentials: true})); 

app.get("/api/health", (req, res) => {
    try {
        res.status(200).json({
        "message": "The server is running fine",
        "endpoints": {
            "users" : "/api/users",
            "transactions" : "/api/transactions",
            "categories" : "/api/categories",
            "history" : "/api/history"
        }})
    } catch (error) {
        console.error("Health check failed:", error);
        return res.status(500).json({ message: "Health check failed", error: error instanceof Error ? error.message : String(error) });
    }
})

app.use("/api/users", userRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/transactions", transactionsRoutes);


app.listen(ENV.PORT, () => {
    console.log(`http://localhost:${ENV.PORT}/api/health`);
    console.log(`Frontend URL: ${ENV.FRONTEND_URL}`)
})