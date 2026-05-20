import request from "supertest";
import app from "../app";
import { jest, describe, expect, it, beforeEach } from "@jest/globals";
import * as transactionQueries from "../db/transactionsQueries";
import * as categoryQueries from "../db/categoriesQueries";

jest.mock("../db/transactionsQueries", () => ({
  getTransactionsByUserId: jest.fn(),
  getTransactionById: jest.fn(),
  createTransaction: jest.fn(),
  updateTransaction: jest.fn(),
  deleteTransaction: jest.fn(),
  getDashboardStats: jest.fn(),
  getMonthlyIncomeExpense: jest.fn(),
}));

jest.mock("../db/categoriesQueries", () => ({
  getExpenseCategories: jest.fn(),
  getExpenseCategoriesPerMonth: jest.fn(),
}));

const tq = transactionQueries as any;
const cq = categoryQueries as any;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("REST API - Transactions", () => {

  // -----------------------------
  // HEALTH
  // -----------------------------
  describe("Health", () => {
    it("should return 200", async () => {
      const res = await request(app).get("/api/health");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Server healthy");
    });
  });

  // -----------------------------
  // GET ALL
  // -----------------------------
  describe("GET /api/transactions", () => {
    it("should return transactions", async () => {

      tq.getTransactionsByUserId.mockResolvedValue([
        {
          id: "1",
          name: "Salary",
          amount: "5000",
          type: "income",
          categoryId: "1",
          description: "Monthly salary",
          date: new Date().toISOString(),
        },
      ]);

      const res = await request(app).get("/api/transactions");

      expect(res.status).toBe(200);
      expect(res.body.transactions).toHaveLength(1);
      expect(res.body.transactions[0].name).toBe("Salary");
      expect(res.body.transactions[0].type).toBe("income");
    });
  });

  // -----------------------------
  // GET BY ID
  // -----------------------------
  describe("GET /api/transactions/:id", () => {

    it("should return a transaction", async () => {

      tq.getTransactionById.mockResolvedValue({
        id: "1",
        name: "Salary",
        amount: "5000",
        type: "income",
      });

      const res = await request(app)
        .get("/api/transactions/1");

      expect(res.status).toBe(200);
      expect(res.body.transaction).toBeDefined();
      expect(res.body.transaction.name).toBe("Salary");
    });

    it("should return 404 if not found", async () => {

      tq.getTransactionById.mockResolvedValue(null);

      const res = await request(app)
        .get("/api/transactions/999");

      expect(res.status).toBe(404);
    });
  });

  // -----------------------------
  // CREATE
  // -----------------------------
  describe("POST /api/transactions", () => {

    it("should create transaction", async () => {

      tq.createTransaction.mockResolvedValue({
        id: "1",
        name: "Groceries",
        amount: "150",
        type: "expense",
      });

      const res = await request(app)
        .post("/api/transactions")
        .send({
          categoryId: "1",
          name: "Groceries",
          amount: "150",
          type: "expense",
          date: new Date().toISOString(),
        });

      expect(res.status).toBe(201);
      expect(res.body.transaction).toBeDefined();

      expect(res.body.transaction).toMatchObject({
        name: "Groceries",
        amount: "150",
      });
    });

    it("should return 400 for invalid type", async () => {

      const res = await request(app)
        .post("/api/transactions")
        .send({
          name: "Test",
          amount: "100",
          type: "INVALID",
          date: new Date().toISOString(),
        });

      expect(res.status).toBe(400);
    });
  });

  // -----------------------------
  // UPDATE
  // -----------------------------
  describe("PUT /api/transactions/:id", () => {

    it("should update transaction", async () => {

      tq.getTransactionById.mockResolvedValue({
        id: "1",
        userId: "user_test_123",
      });

      tq.updateTransaction.mockResolvedValue({
        id: "1",
        name: "Updated",
        amount: "200",
      });

      const res = await request(app)
        .put("/api/transactions/1")
        .send({
          name: "Updated",
          amount: "200",
        });

      expect(res.status).toBe(200);
      expect(res.body.transaction.name).toBe("Updated");
    });
  });

  // -----------------------------
  // DELETE
  // -----------------------------
  describe("DELETE /api/transactions/:id", () => {

    it("should delete transaction", async () => {

      tq.deleteTransaction.mockResolvedValue({
        id: "1",
      });

      const res = await request(app)
        .delete("/api/transactions/1");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        "Transaction deleted successfully"
      );
    });
  });

  // -----------------------------
  // DASHBOARD
  // -----------------------------
  describe("GET /dashboard/stats", () => {

    it("should return dashboard stats", async () => {

      tq.getDashboardStats.mockResolvedValue({ total: 1000 });
      tq.getMonthlyIncomeExpense.mockResolvedValue([]);

      cq.getExpenseCategories.mockResolvedValue([]);
      cq.getExpenseCategoriesPerMonth.mockResolvedValue([]);

      const res = await request(app)
        .get("/api/transactions/dashboard/stats");

      expect(res.status).toBe(200);
      expect(res.body.summary).toBeDefined();
    });
  });

});