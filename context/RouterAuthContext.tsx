import { AuthState, RouterAuthContextType, RouterConfig } from "@/types";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DEFAULT_CONFIG: RouterConfig = {
  ip: "192.168.110.1",
  loginUrl: "http://192.168.110.1/cgi-bin/luci/",
  authApi: "http://192.168.110.1/cgi-bin/luci/api/auth",
  cookieName: "G1U061Y103788",
  password: "", // User will input this
};

const CONFIG_STORAGE_KEY = "router_auth_config";

const COOKIE_STORAGE_KEY = "router_auth_cookie";

const RouterAuthContext = createContext<RouterAuthContextType | undefined>(
  undefined,
);

export function RouterAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: false,
    error: null,
    cookie: null,
    routerConnected: false,
  });

  const [routerConfig, setRouterConfig] = useState<RouterConfig>(DEFAULT_CONFIG);

  const loadStoredConfig = useCallback(async () => {
    try {
      const storedConfig = await SecureStore.getItemAsync(CONFIG_STORAGE_KEY);
      if (storedConfig) {
        setRouterConfig(JSON.parse(storedConfig));
      }
    } catch (error) {
      console.error("Error loading router config:", error);
    }
  }, []);

  const updateRouterConfig = useCallback(async (updates: Partial<RouterConfig>) => {
    setRouterConfig((prev) => {
      const newConfig = { ...prev, ...updates };
      if (updates.ip) {
        newConfig.loginUrl = `http://${updates.ip}/cgi-bin/luci/`;
        newConfig.authApi = `http://${updates.ip}/cgi-bin/luci/api/auth`;
      }
      SecureStore.setItemAsync(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
      return newConfig;
    });
  }, []);

  const loadStoredCookie = useCallback(async () => {
    try {
      const storedCookie = await SecureStore.getItemAsync(COOKIE_STORAGE_KEY);
      if (storedCookie) {
        setAuthState((prev) => ({
          ...prev,
          isAuthenticated: true,
          cookie: storedCookie,
          routerConnected: true,
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error loading stored cookie:", error);
      return false;
    }
  }, []);

  const login = useCallback(async (cookie: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      await SecureStore.setItemAsync(COOKIE_STORAGE_KEY, cookie);

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        error: null,
        cookie,
        routerConnected: true,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        routerConnected: false,
      }));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(COOKIE_STORAGE_KEY);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        error: null,
        cookie: null,
        routerConnected: false,
      });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    await loadStoredCookie();
    setAuthState((prev) => ({ ...prev, isLoading: false }));
  }, [loadStoredCookie]);

  const testConnection = useCallback(async (): Promise<boolean> => {
    if (!authState.cookie) {
      return false;
    }

    try {
      const response = await fetch(routerConfig.authApi, {
        method: "GET",
        headers: {
          Cookie: authState.cookie,
        },
      });

      const isConnected = response.ok;
      setAuthState((prev) => ({ ...prev, routerConnected: isConnected }));
      return isConnected;
    } catch (error) {
      console.error("Connection test failed:", error);
      setAuthState((prev) => ({ ...prev, routerConnected: false }));
      return false;
    }
  }, [authState.cookie]);

  const contextValue: RouterAuthContextType = {
    authState,
    routerConfig,
    updateRouterConfig,
    login,
    logout,
    refreshAuth,
    testConnection,
  };

  useEffect(() => {
    loadStoredConfig().then(() => {
      loadStoredCookie();
    });
  }, [loadStoredConfig, loadStoredCookie]);

  return (
    <RouterAuthContext.Provider value={contextValue}>
      {children}
    </RouterAuthContext.Provider>
  );
}

export function useRouterAuth(): RouterAuthContextType {
  const context = useContext(RouterAuthContext);
  if (!context) {
    throw new Error("useRouterAuth must be used within a RouterAuthProvider");
  }
  return context;
}

export { COOKIE_STORAGE_KEY, CONFIG_STORAGE_KEY };
