import { vi } from "vitest";

/**
 * Mock centralizado de Supabase para tests
 *
 * Uso:
 * import { createSupabaseMock } from "@/tests/mocks/supabase";
 *
 * vi.mock("@/lib/supabase", () => ({
 *   default: createSupabaseMock()
 * }));
 */

type MockQueryBuilder = {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  neq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
};

export const createMockQueryBuilder = (
  overrides?: Partial<MockQueryBuilder>
): MockQueryBuilder => {
  const builder: MockQueryBuilder = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    ...overrides,
  };

  return builder;
};

export const createSupabaseMock = (options?: {
  session?: unknown;
  authError?: Error | null;
  queryError?: Error | null;
  queryData?: unknown;
}) => {
  const {
    session = null,
    authError = null,
    queryError = null,
    queryData = null,
  } = options ?? {};

  return {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: { session },
        error: authError,
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
      verifyOtp: vi.fn().mockResolvedValue({ error: authError }),
      signInWithOtp: vi.fn().mockResolvedValue({ error: authError }),
      signOut: vi.fn().mockResolvedValue({ error: authError }),
    },
    from: vi.fn((table: string) => {
      const builder = createMockQueryBuilder();

      // Override single() to return the configured data/error
      builder.single = vi
        .fn()
        .mockResolvedValue({ data: queryData, error: queryError });

      // Make select() also resolvable for queries without .single()
      const originalSelect = builder.select;
      builder.select = vi.fn((...args) => {
        const result = originalSelect(...args);
        // Add a then() method to make it thenable
        return {
          ...result,
          then: (resolve: (value: unknown) => unknown) =>
            Promise.resolve({ data: queryData, error: queryError }).then(
              resolve
            ),
        };
      });

      return builder;
    }),
  };
};

/**
 * Helper para crear un mock de sesión de Supabase
 */
export const createMockSession = (overrides?: {
  userId?: string;
  email?: string;
}) => {
  const { userId = "test-user-id", email = "test@example.com" } =
    overrides ?? {};

  return {
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: "bearer",
    user: {
      id: userId,
      email,
      aud: "authenticated",
      role: "authenticated",
      created_at: "2024-01-01T00:00:00Z",
      app_metadata: {},
      user_metadata: {},
    },
  };
};
