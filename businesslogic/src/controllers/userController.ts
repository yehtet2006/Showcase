import type { Request, Response} from "express";
import * as userQueries from "../db/userQueries";

import { getAuth } from "@clerk/express";

export async function syncUser(req: Request, res: Response) {
    try {
        // Get the user ID from the authentication token using Clerk's getAuth function
        const { userId } = getAuth(req);
        if(!userId){
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // The upsertUser function will create a new user if it doesn't exist, or update the existing user's name and email if it does exist 
        const { email, name } = req.body;
        if (!email || !name) {
            res.status(400).json({ error: "Email and name are required" });
            return;
        }

        // Sync the user with the database
        const user = await userQueries.upsertUser({ id: userId, email, name});
        res.status(200).json({ user });
    } catch (error) {
        console.log("Error syncing user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getAllUsers(req: Request, res: Response) {
    try {
        const {userId } = getAuth(req);
        if (!userId){
            res.status(401).json({ error: "Unauthorized" });
            return;
        };
        const currentUser = await userQueries.getUserById(userId);
        if (!currentUser || currentUser.role !== "admin"){
            res.status(403).json({ error: "Forbidden" });
            return;
        }

        const users = await userQueries.getAllUsers();
        res.status(200).json({ users });
    } catch (error) {
        console.log("Error getting all users", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getUser(req: Request, res: Response){
    try {
        const { userId } = getAuth(req);
        if (!userId){
            return res.status(401).json({ error: "Unauthorized"})
        }

        const user = await userQueries.getUserById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json({user});
    } catch (error) {
        console.log("Error getting the user details", error);
        res.status(500).json({ error: "Internal server error"})
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId){
            return res.status(401).json({ error: "Unauthorized"})
        }

        const { email, name} = req.body;
        if(!email && !name){
            return res.status(404).json({ error: "Fill in all the fields"})
        }

        const user = await userQueries.updateUser(userId, {
            email, 
            name,
        })
        res.status(200).json({ user });
    } catch (error) {
        console.log("Error updating user's role");
        res.status(500).json({ error: "Internal server error"})
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId){
            return res.status(401).json({ error: "Unauthorized"})
        }

        const user = await userQueries.deleteUser(userId);
        res.status(201).json({ message: "User deleted", user})
    } catch (error) {
        console.log("Error deleting user", error)
        res.status(500).json({ error: "Internal server error."})
    }
    
}