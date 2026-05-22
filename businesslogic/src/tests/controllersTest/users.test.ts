import request from "supertest";
import app from "../../app";
import * as userQueries from "../../db/userQueries";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.mock("../../db/userQueries");

beforeEach(() => {
    // Clear all mocks before each test to ensure test isolation
    jest.clearAllMocks();
});

describe("REST API - Users", () => {
    // Get all users (admin only)
    describe("GET /api/users/all", () => {
        it("should return all users (admin)", async () => {
        (userQueries.getUserById as jest.Mock<any>).mockResolvedValue({
            id: "user_test_123",
            role: "admin",
        });

        (userQueries.getAllUsers as jest.Mock<any>).mockResolvedValue([
            { id: "1", name: "User A" },
            { id: "2", name: "User B" },
        ]);

        const res = await request(app).get("/api/users/all");

        expect(res.status).toBe(200);
        expect(res.body.users).toHaveLength(2);
        });

        it("should return 403 if not admin", async () => {
        (userQueries.getUserById as jest.Mock<any>).mockResolvedValue({
            id: "user_test_123",
            role: "user",
        });

        const res = await request(app).get("/api/users/all");

        expect(res.status).toBe(403);
        });
    });

    // Get user by ID (authorized users)
    describe("GET /api/users/:id", () => {
        it("should return user", async () => {
        (userQueries.getUserById as jest.Mock<any>).mockResolvedValue({
            id: "1",
            name: "John",
        });

        const res = await request(app).get("/api/users/1");

        expect(res.status).toBe(200);
        expect(res.body.user.name).toBe("John");
        });
         
        // Test for user not found
        it("should return 404 if user not found", async () => {
        (userQueries.getUserById as jest.Mock<any>).mockResolvedValue(null);

        const res = await request(app).get("/api/users/999");

        expect(res.status).toBe(404);
        });
    });

    // Update user (admin only)
    describe("PUT /api/users/:id", () => {
        it("should update user (admin only)", async () => {
        (userQueries.getUserById as jest.Mock<any>)
            .mockResolvedValueOnce({ id: "admin", role: "admin" }) // auth user
            .mockResolvedValueOnce({ id: "1", role: "user" }); // target user

        (userQueries.updateUser as jest.Mock<any>).mockResolvedValue({
            id: "1",
            name: "Updated",
        });

        const res = await request(app)
            .put("/api/users/1")
            .send({ name: "Updated" });

        expect(res.status).toBe(200);
        expect(res.body.user.name).toBe("Updated");
        });

        it("should return 403 if not admin", async () => {
        (userQueries.getUserById as jest.Mock<any>).mockResolvedValue({
            id: "user_test_123",
            role: "user",
        });

        const res = await request(app).put("/api/users/1").send({ name: "Updated" });
        expect(res.status).toBe(403);
        });
    });

    // Delete user (admin only)
    describe("DELETE /api/users/:id", () => {
        it("should delete user", async () => {
        (userQueries.deleteUser as jest.Mock<any>).mockResolvedValue({
            id: "1",
        });

        const res = await request(app).delete("/api/users/1");

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User deleted");
        });
    });

});