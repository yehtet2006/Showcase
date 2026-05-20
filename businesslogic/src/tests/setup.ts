import { jest } from "@jest/globals";


jest.mock("@clerk/express", () => ({
  clerkMiddleware: () => (
    req: any,
    res: any,
    next: any
  ) => {
    next();
  },

  requireAuth: () => (
    req: any,
    res: any,
    next: any
  ) => {
    req.auth = {
      userId: "user_test_123",
    };

    next();
  },

  getAuth: () => ({
    userId: "user_test_123",
  }),
}));