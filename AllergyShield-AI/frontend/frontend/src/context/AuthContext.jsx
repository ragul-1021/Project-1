import { useEffect, useState, useCallback } from "react";
import { loginRequest, registerRequest, fetchProfile } from "../api/authApi";
import { AuthContext } from "./authContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("access_token"));
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const { data } = await fetchProfile();
      setUser(data);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem("access_token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const { data } = await loginRequest(email, password);
    localStorage.setItem("access_token", data.access_token);
    setToken(data.access_token);
    await loadProfile();
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await registerRequest(name, email, password);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
