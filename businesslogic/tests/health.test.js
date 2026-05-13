const request = require("supertest");
const app = require("../src/app").default;

describe("API tests", () => {
  it("GET /api/health should return 200", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("The server is running fine");
  });
});