import request from "supertest";
import app from "../../app";
import * as categoryQueries from "../../db/categoriesQueries";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.mock("../../db/categoriesQueries");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("REST API - Categories", () => {

    describe("POST /api/categories", () => {
        it("should create category", async () => {
        (categoryQueries.createCategory as jest.Mock<any>)
            .mockResolvedValue({id: "1", name: "Food", color: "#FF0000",});

        const res = await request(app).post("/api/categories")
            .send({ name: "Food", color: "#FF0000",});

        expect(res.status).toBe(201);
        expect(res.body.category.name).toBe("Food");
        });

        it("should fail with invalid color", async () => {
        const res = await request(app).post("/api/categories")
            .send({ name: "Food", color: "invalid-color",});

        expect(res.status).toBe(400);
        });
    });

    describe("GET /api/categories", () => {
        it("should return categories", async () => {
            (categoryQueries.getCategoriesByUserId as jest.Mock<any>).mockResolvedValue([
                { id: "1", name: "Food", color: "#FF0000" },
                { id: "2", name: "Transport", color: "#00FF00" },
            ]);

            const res = await request(app).get("/api/categories");

            expect(res.status).toBe(200);
            expect(res.body.categories).toHaveLength(2);
        });
    });

    describe("GET /api/categories/:id", () => {
        it("should return category", async () => {
        (categoryQueries.getCategoryById as jest.Mock<any>).mockResolvedValue({
            id: "1",
            userId: "user_test_123",
            name: "Food",
        });

        const res = await request(app).get("/api/categories/1");
        expect(res.status).toBe(200);
        expect(res.body.category.name).toBe("Food");
        });

        it("should return 404 if not found", async () => {
        (categoryQueries.getCategoryById as jest.Mock<any>).mockResolvedValue(null);

        const res = await request(app).get("/api/categories/999");
        expect(res.status).toBe(404);
        });

        it("should return 403 if forbidden", async () => {
        (categoryQueries.getCategoryById as jest.Mock<any>).mockResolvedValue({
            id: "1",
            userId: "different_user",
        });
        const res = await request(app).get("/api/categories/1");
        expect(res.status).toBe(403);
        });
    });

    describe("PUT /api/categories/:id", () => {
        it("should update category", async () => {
        (categoryQueries.updateCategory as jest.Mock<any>).mockResolvedValue({
            id: "1",
            name: "Updated",
        });

        const res = await request(app)
            .put("/api/categories/1")
            .send({ name: "Updated" });

        expect(res.status).toBe(200);
        expect(res.body.category.name).toBe("Updated");
        });
    });

    describe("DELETE /api/categories/:id", () => {
        it("should delete category", async () => {
        (categoryQueries.deleteCategory as jest.Mock<any>).mockResolvedValue(undefined);

        const res = await request(app).delete("/api/categories/1");

        expect(res.status).toBe(204);
        });
    });
});
