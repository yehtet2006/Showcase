module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/tests/**/*.test.ts"],
  testPathIgnorePatterns: ["/dist/"],
  modulePathIgnorePatterns: ["/dist/"],
    setupFiles: ["<rootDir>/src/tests/setup.ts"],
};