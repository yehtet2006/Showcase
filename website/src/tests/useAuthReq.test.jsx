import { renderHook } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";


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

describe("useAuthReq", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers axios interceptor", async () => {
    const { useAuth } = await import("@clerk/react");

    useAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
      getToken: vi.fn(),
    });

    const useAuthReq = (await import("../hooks/useAuthReq")).default;

    renderHook(() => useAuthReq());

    expect(useMock).toHaveBeenCalledTimes(1);
  });

  it("ejects interceptor on unmount", async () => {
    const { useAuth } = await import("@clerk/react");

    useAuth.mockReturnValue({
      isSignedIn: true,
      isLoaded: true,
      getToken: vi.fn(),
    });

    useMock.mockReturnValue(123);

    const useAuthReq = (await import("../hooks/useAuthReq")).default;

    const { unmount } = renderHook(() => useAuthReq());

    unmount();

    expect(ejectMock).toHaveBeenCalledWith(123);
  });
});