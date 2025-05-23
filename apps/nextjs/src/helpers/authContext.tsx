'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import axios, { AxiosInstance } from 'axios';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  username: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  api: AxiosInstance;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
};

//create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// custom axios instance
const api = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Auth provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  // set up request interceptor
  useEffect(() => {
    // add token to request
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          console.log("accesstoken inside request interceptor", accessToken)
          config.headers["Authorization"] = `Bearer ${accessToken}`;
          console.log('setting auth header', config.headers.Authorization)
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // handle token refresh on 403(token expired or not there) (maybe thrown by middleware because no accessToken) and request hasnt been retried yet.
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // try to refresh the token
            const refreshResponse = await axios.post(
              `${process.env.BACKEND_URL || 'http://localhost:8080'}/api/auth/refresh-token`,
              {},
              { withCredentials: true }
            );
            const newToken = refreshResponse.data.accessToken;
            //update authorization header
            api.defaults.headers['Authorization'] = `Bearer ${newToken}`;
            console.log("api header are now", api.defaults.headers)
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            //store new token
            setAccessToken(newToken);


            // retry original request
            return api(originalRequest);
          } catch (refreshError) {
            // if refresh fails, clear state and redirect to homepage
            setUsername(null);
            setAccessToken(null);
            
            console.log("error in response interceptor, redirecting")
            router.push('/');
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    //clean up interceptors on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, router]);

  //initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // try to get the current user data using the refresh token
        const response = await axios.post(
          `${process.env.BACKEND_URL || 'http://localhost:8080'}/api/auth/refresh-token`, 
          {}, 
          { withCredentials: true }
        );
        setAccessToken(response.data.accessToken);

        const userResponse = await api.get('/api/auth/user/profile');
        console.log("userresponse is", userResponse)
        setUsername(userResponse.data.user);
      } catch (e) {
        // if error user is not authenticated
        console.log(e);
        setUsername(null);
        setAccessToken(null);
        console.log("error from init auth, redirecting")
        router.push("/")
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        username,
        loading,
        isAuthenticated: !!username,
        api,
        accessToken,
        setAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
