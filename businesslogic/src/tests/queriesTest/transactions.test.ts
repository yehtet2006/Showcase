import request from "supertest";
import app from "../../app";
import * as transactionQueries from "../../db/transactionsQueries";
import * as categoryQueries from "../../db/categoriesQueries";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";

jest.mock("../../db/transactionsQueries");
jest.mock("../../db/categoriesQueries");
beforeEach(() => {
  jest.clearAllMocks();
});

describe("REST API - Transactions", () => {
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

      (transactionQueries.getTransactionsByUserId as jest.Mock<any>)
        .mockResolvedValue([
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
      expect(res.body.transactions[0].amount).toBe("5000");
      expect(res.body.transactions[0].categoryId).toBe("1");
      expect(res.body.transactions[0].description).toBe("Monthly salary");
      expect(new Date(res.body.transactions[0].date)).toBeInstanceOf(Date);
    });
  });

  // -----------------------------
  // GET BY ID
  // -----------------------------
  describe("GET /api/transactions/:id", () => {
    it("should return a transaction", async () => {(transactionQueries.getTransactionById as jest.Mock<any>).mockResolvedValue({
          id: "1",
          name: "Salary",
          amount: "5000",
          type: "income",
          categoryId: "1",
          description: "Monthly salary",
          date: new Date().toISOString(),
        });

      const res = await request(app).get("/api/transactions/1");
      expect(res.status).toBe(200);
      expect(res.body.transaction).toBeDefined();
      expect(res.body.transaction.name).toBe("Salary");
      expect(res.body.transaction.type).toBe("income");
      expect(res.body.transaction.amount).toBe("5000");
      expect(res.body.transaction.categoryId).toBe("1");
      expect(res.body.transaction.description).toBe("Monthly salary");
      expect(new Date(res.body.transaction.date)).toBeInstanceOf(Date);
    });

    it("should return 404 if not found", async () => {

      (transactionQueries.getTransactionById as jest.Mock<any>)
        .mockResolvedValue(null);

      const res = await request(app)
        .get("/api/transactions/999");

      expect(res.status).toBe(404);
    });
  });

  // -----------------------------
  // CREATE TRANSACTION
  // -----------------------------
  describe("POST /api/transactions", () => {
    it("should create transaction", async () => {

      (transactionQueries.createTransaction as jest.Mock<any>)
        .mockResolvedValue({
          id: "1",
          name: "Groceries",
          amount: "150",
          type: "expense",
          categoryId: "1",
          description: "Weekly groceries",
          date: new Date().toISOString(),
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
  // UPDATE TRANSACTION
  // -----------------------------
  describe("PUT /api/transactions/:id", () => {
    it("should update transaction", async () => {

      (transactionQueries.getTransactionById as jest.Mock<any>)
        .mockResolvedValue({
          id: "1",
          userId: "user_test_123",
        });

      (transactionQueries.updateTransaction as jest.Mock<any>)
        .mockResolvedValue({
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
  // DELETE TRANSACTION
  // -----------------------------
  describe("DELETE /api/transactions/:id", () => {
    it("should delete transaction", async () => {

      (transactionQueries.deleteTransaction as jest.Mock<any>)
        .mockResolvedValue({
          id: "1",
        });

      const res = await request(app)
        .delete("/api/transactions/1");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Transaction deleted successfully");
    });
  });

  // -----------------------------
  // DASHBOARD
  // -----------------------------
  describe("GET /dashboard/stats", () => {
    it("should return dashboard stats", async () => {

      (transactionQueries.getDashboardStats as jest.Mock<any>)
        .mockResolvedValue({ total: 1000 });

      (transactionQueries.getMonthlyIncomeExpense as jest.Mock<any>)
        .mockResolvedValue([]);

      (categoryQueries.getExpenseCategories as jest.Mock<any>)
        .mockResolvedValue([]);

      (categoryQueries.getExpenseCategoriesPerMonth as jest.Mock<any>)
        .mockResolvedValue([]);

      const res = await request(app)
        .get("/api/transactions/dashboard/stats");

      expect(res.status).toBe(200);
      expect(res.body.summary).toBeDefined();
    });
  });

});