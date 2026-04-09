import { useAuth } from "@clerk/react";
import { useEffect } from "react";
import api from "../lib/axios";

let isInterceptorRegistered = false; // Flag to track if the interceptor is registered

function useAuthReq() {
    // Get the authentication status and token from Clerk
  const { isSignedIn, getToken, isLoaded } = useAuth();
  // include the token to the request headers
  useEffect(() => {
    if (isInterceptorRegistered) return;
    isInterceptorRegistered = true;

    // Add a request interceptor to include the token in the headers
    const interceptor = api.interceptors.request.use(async (config) => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
      isInterceptorRegistered = false;
    };
  }, [isSignedIn, getToken]);

  return { isSignedIn, isClerkLoaded: isLoaded };
}

export default useAuthReq;