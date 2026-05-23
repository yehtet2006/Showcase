import { renderHook } from "@testing-library/react";
import { vi, expect, describe, it } from "vitest";

const useMock = vi.fn();
const ejectMock = vi.fn();

// Mock the necessary modules and functions
vi.mock("@clerk/react", () => ({
  useAuth: vi.fn(),
}));

// Mock the axios module and its interceptors
vi.mock("../lib/axios", () => ({
  default: {
    interceptors: {
      request: {
        use: useMock,
        eject: ejectMock,
      },
    },
  },
}));

describe("Bearer token", () => {

  it("adds Authorization: Bearer token", async () => {

    const { useAuth } = await import("@clerk/react");
    const getTokenMock = vi.fn().mockResolvedValue("abc123");

    useAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
      getToken: getTokenMock,
    });

    const useAuthReq = (await import("../hooks/useAuthReq")).default;

    renderHook(() => useAuthReq());

    // interceptor function that was registered
    const interceptorFn = useMock.mock.calls[0][0]; // Return the first argument of the first call to useMock, which is the interceptor function

    const config = { headers: {} }; // Mock Axios request config

    const result = await interceptorFn(config); // Call the interceptor function with the mock config

    expect(getTokenMock).toHaveBeenCalled(); // Ensure getToken was called to retrieve the token
    expect(result.headers.Authorization).toBe("Bearer abc123"); // Check that the Authorization header was set correctly
    console.log(result.headers); // Log the headers to verify the output
  });
});