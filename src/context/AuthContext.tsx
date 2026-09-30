import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  logoutUser,
  registerUser,
  getCurrentUser,
} from "@/services/auth.service";

import { LoginPayload, RegisterPayload, User } from "@/types/auth";

import { clearTokens, getAccessToken } from "@/utils/tokenStorage";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /*
   * Load the currently authenticated user
   * when the application starts.
   */
  const loadUser = async () => {
    try {
      const token = await getAccessToken();

      if (!token) {
        setUser(null);
        return;
      }

      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch {
      /*
       * If the stored access token is invalid,
       * expired, or the user can no longer be
       * authenticated, clear the local session.
       */
      await clearTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * Restore authentication state when
   * the app is launched.
   */
  useEffect(() => {
    loadUser();
  }, []);

  /*
   * Login
   */
  const login = async (payload: LoginPayload) => {
    const response = await loginUser(payload);

    setUser(response.user);

    return response.user;
  };

  /*
   * Register
   */
  const register = async (payload: RegisterPayload) => {
    const response = await registerUser(payload);

    setUser(response.user);

    return response.user;
  };

  /*
   * Logout
   *
   * We always clear local tokens and user state,
   * even if the server-side logout request fails.
   *
   * This is especially important after:
   * - Password changes
   * - Account deletion/deactivation
   * - Expired/invalid sessions
   */
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      await clearTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/*
 * Access AuthContext
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
