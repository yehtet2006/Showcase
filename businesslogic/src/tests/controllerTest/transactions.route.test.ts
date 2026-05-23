import request from "supertest";
import app from "../../app";
import * as transactionController from "../../controllers/transactionController";
import { jest, describe, beforeEach, expect, it, } from "@jest/globals";


jest.mock("../../controllers/transactionController");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Transactions Routes", () => {

    describe("GET /api/transactions", () => {
        it("should call getTransactionsByUserId controller", async () => {
        (transactionController.getTransactionsByUserId as jest.Mock).mockImplementation((req: any, res: any) => {
            return res.status(200).json({
            transactions: [
                { id: "1", name: "Salary", amount: "5000", type: "income",},
                { id: "2", name: "Groceries", amount: "200", type: "expense",}
            ],
            });
        });
        const res = await request(app).get("/api/transactions");
        expect(res.status).toBe(200);
        expect(res.body.transactions).toHaveLength(2);
        expect(transactionController.getTransactionsByUserId).toHaveBeenCalled();
    });
    });

    describe("GET /api/transactions/:id", () => {
        it("should call getTransactionById controller", async () => {
        ( transactionController.getTransactionById as jest.Mock).mockImplementation((req: any, res: any) => {
            return res.status(200).json({
                transaction: { id: "1", name: "Salary", amount: "5000", type: "income",},
            });
        });

        const res = await request(app).get("/api/transactions/1");
        expect(res.status).toBe(200);
        expect(res.body.transaction.name).toBe("Salary");
        expect(res.body.transaction.type).toBe("income");
        expect(res.body.transaction.amount).toBe("5000");
        expect(transactionController.getTransactionById).toHaveBeenCalled();
        expect(transactionController.getTransactionById).toHaveBeenCalled();});
    });

//   describe("POST /api/transactions", () => {
//     it("should call createTransaction controller", async () => {
//       (
//         transactionController.createTransaction as jest.Mock
//       ).mockImplementation((req: any, res: any) => {
//         return res.status(201).json({
//           transaction: {
//             id: "1",
//           },
//         });
//       });

//       const res = await request(app)
//         .post("/api/transactions")
//         .send({
//           name: "Salary",
//         });

//       expect(res.status).toBe(201);

//       expect(
//         transactionController.createTransaction
//       ).toHaveBeenCalled();
//     });
//   });

//   describe("PUT /api/transactions/:id", () => {
//     it("should call updateTransaction controller", async () => {
//       (
//         transactionController.updateTransaction as jest.Mock
//       ).mockImplementation((req: any, res: any) => {
//         return res.status(200).json({
//           transaction: {
//             id: "1",
//           },
//         });
//       });

//       const res = await request(app)
//         .put("/api/transactions/1")
//         .send({
//           name: "Updated",
//         });

//       expect(res.status).toBe(200);

//       expect(
//         transactionController.updateTransaction
//       ).toHaveBeenCalled();
//     });
//   });

//   describe("DELETE /api/transactions/:id", () => {
//     it("should call deleteTransaction controller", async () => {
//       (
//         transactionController.deleteTransaction as jest.Mock
//       ).mockImplementation((req: any, res: any) => {
//         return res.status(200).json({
//           message: "Deleted",
//         });
//       });

//       const res = await request(app)
//         .delete("/api/transactions/1");

//       expect(res.status).toBe(200);

//       expect(
//         transactionController.deleteTransaction
//       ).toHaveBeenCalled();
//     });
//   });

//   describe("GET /api/transactions/dashboard/stats", () => {
//     it("should call getDashboardStats controller", async () => {
//       (
//         transactionController.getDashboardStats as jest.Mock
//       ).mockImplementation((req: any, res: any) => {
//         return res.status(200).json({
//           summary: {},
//         });
//       });

//       const res = await request(app)
//         .get("/api/transactions/dashboard/stats");

//       expect(res.status).toBe(200);

//       expect(
//         transactionController.getDashboardStats
//       ).toHaveBeenCalled();
//     });
//   });
});