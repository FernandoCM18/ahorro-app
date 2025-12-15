import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockSession } from "../tests/mocks/supabase";

// Mock Supabase - use vi.hoisted to avoid hoisting issues
const {
  mockGetSession,
  mockOnAuthStateChange,
  mockSignInWithOtp,
  mockSignOut,
} = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockOnAuthStateChange: vi.fn(),
  mockSignInWithOtp: vi.fn(),
  mockSignOut: vi.fn(),
}));

vi.mock("../lib/supabase", () => ({
  default: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signInWithOtp: mockSignInWithOtp,
      signOut: mockSignOut,
    },
  },
}));

// Import after mock
const { useAuth } = await import("./use-auth");

describe("useAuth", () => {
  const mockUnsubscribe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock setup
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });
  });

  describe("initial state", () => {
    it("starts with loading true and user/session null", () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
    });
  });

  describe("getSession", () => {
    it("loads existing session on mount", async () => {
      const session = createMockSession();
      mockGetSession.mockResolvedValue({
        data: { session },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.session).toEqual(session);
      expect(result.current.user).toEqual(session.user);
    });

    it("sets loading to false when no session exists", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.session).toBeNull();
      expect(result.current.user).toBeNull();
    });
  });

  describe("signIn", () => {
    it("calls signInWithOtp with correct parameters", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockSignInWithOtp.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const email = "test@example.com";
      await result.current.signIn(email);

      expect(mockSignInWithOtp).toHaveBeenCalledWith({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
    });

    it("returns error when sign in fails", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const testError = new Error("Invalid email");
      mockSignInWithOtp.mockResolvedValue({ error: testError });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.signIn("invalid@test.com");

      expect(response.error).toEqual(testError);
    });

    it("returns null error on success", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockSignInWithOtp.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.signIn("test@example.com");

      expect(response.error).toBeNull();
    });
  });

  describe("signUp", () => {
    it("delegates to signIn function", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });
      mockSignInWithOtp.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const email = "newuser@example.com";
      await result.current.signUp(email);

      expect(mockSignInWithOtp).toHaveBeenCalledWith({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
    });
  });

  describe("signOut", () => {
    it("calls supabase signOut and clears session/user", async () => {
      const session = createMockSession();
      mockGetSession.mockResolvedValue({
        data: { session },
        error: null,
      });
      mockSignOut.mockResolvedValue({ error: null });

      const { result } = renderHook(() => useAuth());

      // Wait for initial session to load
      await waitFor(() => {
        expect(result.current.user).toEqual(session.user);
      });

      // Sign out
      await result.current.signOut();

      expect(mockSignOut).toHaveBeenCalled();

      await waitFor(() => {
        expect(result.current.session).toBeNull();
        expect(result.current.user).toBeNull();
      });
    });
  });

  describe("onAuthStateChange", () => {
    it("subscribes to auth state changes on mount", () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      renderHook(() => useAuth());

      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });

    it("unsubscribes on unmount", () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const { unmount } = renderHook(() => useAuth());

      unmount();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it("updates user when session changes", async () => {
      mockGetSession.mockResolvedValue({
        data: { session: null },
        error: null,
      });

      let authChangeCallback:
        | ((event: string, session: unknown) => void)
        | null = null;

      mockOnAuthStateChange.mockImplementation((callback) => {
        authChangeCallback = callback;
        return {
          data: { subscription: { unsubscribe: mockUnsubscribe } },
        };
      });

      const { result } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Simulate auth state change
      const newSession = createMockSession({ email: "newemail@test.com" });
      authChangeCallback?.("SIGNED_IN", newSession);

      await waitFor(() => {
        expect(result.current.session).toEqual(newSession);
        expect(result.current.user).toEqual(newSession.user);
      });
    });
  });
});
