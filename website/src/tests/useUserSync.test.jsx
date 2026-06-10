import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import useUserSync from "../hooks/useUserSync";

// Mock the necessary modules and functions
const mutateMock = vi.fn();

// Mock the Clerk authentication and user hooks
vi.mock("@clerk/react", () => ({
  useAuth: vi.fn(),
  useUser: vi.fn(),
}));

// Mock the react-query useMutation hook
vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
}));

// Import the mocked hooks after setting up the mocks
describe("useUserSync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls sync mutation when signed in", async () => {
    const { useAuth, useUser } = await import("@clerk/react");
    const { useMutation } = await import("@tanstack/react-query");

    useAuth.mockReturnValue({ isSignedIn: true, });

    useUser.mockReturnValue({ user: { id: "123" }, });

    useMutation.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      isSuccess: false,
    });

    renderHook(() => useUserSync());

    await waitFor(() => {
      expect(mutateMock).toHaveBeenCalledTimes(1);
    });
  });

  it("does not call mutation when signed out", async () => {
    const { useAuth, useUser } = await import("@clerk/react");
    const { useMutation } = await import("@tanstack/react-query");

    useAuth.mockReturnValue({isSignedIn: false, });

    useUser.mockReturnValue( {user: null,});
 
    useMutation.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      isSuccess: false,
    });

    renderHook(() => useUserSync());

    expect(mutateMock).not.toHaveBeenCalled();
  });

  it("does not call mutation if already successful", async () => {
    const { useAuth, useUser } = await import("@clerk/react");
    const { useMutation } = await import("@tanstack/react-query");

    useAuth.mockReturnValue({ isSignedIn: true, }); // User is signed in

    useUser.mockReturnValue({ user: { id: "123" }, }); // User data is available

    useMutation.mockReturnValue({
      mutate: mutateMock,
      isPending: false, 
      isSuccess: true, // Sync is already successful
    });

    renderHook(() => useUserSync());

    expect(mutateMock).not.toHaveBeenCalled();
  });
});