import { useCallback, useMemo, useState } from "react";
import {
  getLoggedInUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authApi";
import AuthContext from "./AuthContext.js";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getLoggedInUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError("");

    try {
      const loggedInUser = await loginUser(credentials);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (loginError) {
      setError(loginError.message);
      throw loginError;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError("");

    try {
      return await registerUser(userData);
    } catch (registerError) {
      setError(registerError.message);
      throw registerError;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await logoutUser();
      setUser(null);
    } catch (logoutError) {
      setError(logoutError.message);
      throw logoutError;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(() => {
    const currentUser = getLoggedInUser();
    setUser(currentUser);
    return currentUser;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
      clearError: () => setError(""),
    }),
    [user, loading, error, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
