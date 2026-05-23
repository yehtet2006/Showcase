import { renderHook } from "@testing-library/react";
import { vi, expect, describe, it } from "vitest";

const useMock = vi.fn();
const ejectMock = vi.fn();

vi.mock("@clerk/react", () => ({
  useAuth: vi.fn(),
}));

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
    const interceptorFn = useMock.mock.calls[0][0];

    const config = { headers: {} };

    const result = await interceptorFn(config);

    expect(getTokenMock).toHaveBeenCalled();
    expect(result.headers.Authorization).toBe("Bearer abc123");
    console.log(result.headers);
  });
});