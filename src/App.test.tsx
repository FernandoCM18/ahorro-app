import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./app";

// Mock Supabase
vi.mock("./lib/supabase", () => ({
  default: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      verifyOtp: vi.fn().mockResolvedValue({ error: null }),
      signInWithOtp: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({}),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

describe("App", () => {
  it("renders the auth screen when not logged in", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Mi Alcancía")).toBeInTheDocument();
    });
  });

  it("renders the login form", async () => {
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText("Ingresa tu correo para recibir un enlace mágico")
      ).toBeInTheDocument();
    });
  });

  it("renders the email input", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("tu@correo.com")).toBeInTheDocument();
    });
  });

  it("renders the submit button", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Enviar enlace mágico")).toBeInTheDocument();
    });
  });
});
