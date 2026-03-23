import React, { useRef, useCallback, useState, useEffect } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from "react-native-webview";
import CookieManager from "@react-native-cookies/cookies";
import {
  COOKIE_STORAGE_KEY,
  useRouterAuth,
} from "@/context/RouterAuthContext";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface RouterWebViewProps {
  onAuthSuccess?: () => void;
  onAuthFailure?: (error: string) => void;
}

export function RouterWebView({
  onAuthSuccess,
  onAuthFailure,
}: RouterWebViewProps) {
  const webViewRef = useRef<WebView>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "dark"];
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [pageLoaded, setPageLoaded] = useState(false);
  const { authState, login, routerConfig } = useRouterAuth();
  const [useManualAuth, setUseManualAuth] = useState(false); // Default to WebView
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const checkForLogin = useCallback(async (url: string) => {
    const hasStok = url.includes("stok=");
    const isHomeOverview = url.includes("/ehr/home_overview");

    console.log(
      "Checking URL:",
      url,
      "hasStok:",
      hasStok,
      "isHomeOverview:",
      isHomeOverview,
    );

    if (hasStok || isHomeOverview) {
      // Use native CookieManager to read HttpOnly cookies
      try {
        const routerUrl = routerConfig.loginUrl;
        const cookies = await CookieManager.get(routerUrl);
        console.log('Native cookies from CookieManager:', JSON.stringify(cookies));
        
        const cookieName = routerConfig.cookieName;
        if (cookies[cookieName]) {
          const authToken = cookies[cookieName].value;
          console.log(`Auth cookie ${cookieName}:`, authToken);
          await login(authToken);
          onAuthSuccess?.();
        } else {
          console.log(`Cookie ${cookieName} not found in native store. Available:`, Object.keys(cookies));
        }
      } catch (error) {
        console.error('CookieManager error:', error);
      }
    }
  }, [routerConfig.cookieName, routerConfig.loginUrl, login, onAuthSuccess]);

  const handleMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);

        if (data.type === "CHECK_NATIVE_COOKIES") {
          // pollAuth detected login, use CookieManager to read HttpOnly cookie
          try {
            const cookies = await CookieManager.get(routerConfig.loginUrl);
            console.log('pollAuth native cookies:', JSON.stringify(cookies));
            const cookieName = routerConfig.cookieName;
            if (cookies[cookieName]) {
              const authToken = cookies[cookieName].value;
              console.log(`pollAuth Auth cookie ${cookieName}:`, authToken);
              await login(authToken);
              onAuthSuccess?.();
            }
          } catch (err) {
            console.error('pollAuth CookieManager error:', err);
          }
        } else if (data.type === "LOGIN_SUCCESS" && data.cookie) {
          login(data.cookie)
            .then(() => {
              onAuthSuccess?.();
            })
            .catch((error) => {
              onAuthFailure?.(error.message);
            });
        } else if (data.type === "ERROR") {
          onAuthFailure?.(data.message);
        }
      } catch (error) {
        console.error("Error handling WebView message:", error);
      }
    },
    [login, onAuthSuccess, onAuthFailure, routerConfig.loginUrl, routerConfig.cookieName],
  );

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      setCurrentUrl(navState.url);
      console.log("Nav state changed:", navState);
      checkForLogin(navState.url);
    },
    [checkForLogin],
  );

  const handleManualAuth = async () => {
    if (!password || password.length < 1) {
      Alert.alert("Error", "Please enter password");
      return;
    }

    setIsAuthenticating(true);
    try {
      // Try direct API call
      const formData = new FormData();
      formData.append("password", password);

      const response = await fetch(routerConfig.authApi, {
        method: "POST",
        body: formData,
        mode: "cors",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Auth response:", data);

        // Try to extract cookie from response
        const setCookieHeader = response.headers.get("set-cookie");
        console.log("Set-cookie header:", setCookieHeader);

        if (
          setCookieHeader &&
          setCookieHeader.includes(routerConfig.cookieName)
        ) {
          const cookieMatch = setCookieHeader.match(
            new RegExp(`${routerConfig.cookieName}=([^;]+)`),
          );
          if (cookieMatch && cookieMatch[1]) {
            await login(cookieMatch[1]);
            onAuthSuccess?.();
            return;
          }
        }

        // If no cookie in headers, check response body
        if (data.data && data.data.stok) {
          await login(data.data.stok);
          onAuthSuccess?.();
          return;
        }

        throw new Error("Could not extract authentication token");
      } else {
        throw new Error(`Authentication failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Manual auth error:", error);
      onAuthFailure?.(
        error instanceof Error ? error.message : "Authentication failed",
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  const injectedJavaScript = `
    (function() {
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
          const cookies = response.headers.get('set-cookie');
          if (cookies) {
             window.ReactNativeWebView.postMessage(JSON.stringify({
               type: 'LOGIN_SUCCESS',
               cookie: document.cookie || cookies
             }));
          }
          return response;
        });
      };

      let attempts = 0;
      const autoPassword = '${routerConfig.password || ""}';
      
      const pollAuth = setInterval(() => {
        const currentHref = window.location.href;
        const hasStok = currentHref.includes('stok=');
        const isHomeOverview = currentHref.includes('/ehr/home_overview');

        if (hasStok || isHomeOverview) {
          // Signal the native layer to read cookies via CookieManager
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'CHECK_NATIVE_COOKIES',
            url: currentHref
          }));
          clearInterval(pollAuth);
          return;
        }

        // Attempt Auto-login up to 10 seconds (10 ticks)
        if (autoPassword && attempts < 10 && !hasStok) {
          attempts++;
          const pwdInput = document.getElementById('password') || document.querySelector('input[name="loginPass"]') || document.querySelector('input[type="password"]');
          const submitBtn = document.querySelector('button[type="submit"], input[type="submit"], input[type="button"], .login-btn, .btn-login, button');
          
          if (pwdInput && submitBtn) {
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
            if (nativeInputValueSetter) {
              nativeInputValueSetter.call(pwdInput, autoPassword);
            } else {
              pwdInput.value = autoPassword;
            }
            pwdInput.dispatchEvent(new Event("input", { bubbles: true }));
            pwdInput.dispatchEvent(new Event("change", { bubbles: true }));
            
            setTimeout(() => {
              submitBtn.click();
            }, 500); // Small delay to let reactive frameworks process the state
            
            // Stop further input attempts while login is processing
            attempts = 100;
          }
        }
      }, 1000);
    })();
    true;
  `;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.debugBar}>
        <Text style={[styles.debugText, { color: colors.textSecondary }]}>
          {useManualAuth ? "Manual Mode" : "WebView Mode"} |{" "}
          {currentUrl?.slice(0, 40)}...
        </Text>
        <TouchableOpacity onPress={() => setUseManualAuth(!useManualAuth)}>
          <MaterialIcons
            name={useManualAuth ? "key" : "web"}
            size={20}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {useManualAuth && (
        <View
          style={[
            styles.manualAuthContainer,
            {
              backgroundColor: colors.surfaceCard,
              borderColor: colors.borderLight,
            },
          ]}
        >
          <Text style={[styles.manualAuthTitle, { color: colors.text }]}>
            Manual Authentication
          </Text>
          <Text
            style={[styles.manualAuthText, { color: colors.textSecondary }]}
          >
            Router uses self-signed HTTPS certificate. Use manual authentication
            instead.
          </Text>
          <TextInput
            style={[
              styles.passwordInput,
              {
                backgroundColor: colors.background,
                borderColor: colors.borderLight,
                color: colors.text,
              },
            ]}
            placeholder="Enter router password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={handleManualAuth}
            disabled={isAuthenticating}
            style={[styles.button, isAuthenticating && styles.buttonDisabled]}
          >
            <MaterialIcons
              name="lock"
              size={18}
              color="#ffffff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonText}>
              {isAuthenticating ? "Authenticating..." : "Authenticate"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {error && (
        <View
          style={[
            styles.errorOverlay,
            { backgroundColor: colors.error + "15" },
          ]}
        >
          <MaterialIcons name="error-outline" size={48} color={colors.error} />
          <Text
            style={[
              styles.errorDisplayText,
              { color: colors.text, marginTop: 16 },
            ]}
          >
            Failed to connect to router
          </Text>
          <Text
            style={[
              styles.errorDisplaySubtext,
              { color: colors.textSecondary, marginTop: 8 },
            ]}
          >
            {error}
          </Text>
          <Text
            style={[
              styles.errorDisplaySubtext,
              {
                color: colors.textSecondary,
                marginTop: 8,
                textAlign: "center",
              },
            ]}
          >
            Try manual authentication or use HTTP instead of HTTPS
          </Text>
        </View>
      )}

      {isLoading && !error && !useManualAuth && (
        <View
          style={[
            styles.loadingOverlay,
            { backgroundColor: colors.background },
          ]}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={[
              styles.loadingText,
              { color: colors.textSecondary, marginTop: 12 },
            ]}
          >
            Loading router login page...
          </Text>
        </View>
      )}

      {!useManualAuth && (
        <WebView
          ref={webViewRef}
          source={{ uri: !!currentUrl ? currentUrl : routerConfig.loginUrl }}
          style={styles.webView}
          injectedJavaScript={injectedJavaScript}
          onMessage={handleMessage}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => {
            console.log("WebView load start");
            if (!pageLoaded) {
              setIsLoading(true);
            }
            setError(null);
          }}
          onLoadEnd={() => {
            console.log("WebView load end");
            setIsLoading(false);
            setPageLoaded(true);
          }}
          onLoadProgress={({ nativeEvent }) => {
            console.log("Loading progress:", nativeEvent.progress);
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          mixedContentMode="always"
          originWhitelist={["*"]}
          androidLayerType="hardware"
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          allowUniversalAccessFromFileURLs={true}
          thirdPartyCookiesEnabled={true}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("WebView error:", nativeEvent);
            // Ignore SSL errors since we're using self-signed certificates
            if (nativeEvent.code !== 3) {
              setError(nativeEvent.description || "Failed to load router page");
            }
            setIsLoading(false);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error("HTTP error:", nativeEvent);
            // Ignore SSL/certificate errors for self-signed certs
            if (
              nativeEvent.statusCode !== -1 &&
              nativeEvent.statusCode >= 400
            ) {
              setError(`HTTP ${nativeEvent.statusCode}: ${nativeEvent.url}`);
            }
            setIsLoading(false);
          }}
          incognito={false}
          cacheEnabled={true}
          allowsBackForwardNavigationGestures={true}
          renderLoading={() => <View />}
          onLoad={() => {
            console.log("WebView fully loaded");
            setPageLoaded(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  debugBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  debugText: {
    fontSize: 10,
    flex: 1,
  },
  manualAuthContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  manualAuthTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  manualAuthText: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  loadingText: {
    fontSize: 14,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    zIndex: 2,
  },
  errorDisplayText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  errorDisplaySubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#135bec",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonDisabled: {
    backgroundColor: "#334155",
    opacity: 0.5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
