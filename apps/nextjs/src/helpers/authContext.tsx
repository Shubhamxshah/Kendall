import { createContext, ReactNode, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: string;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const api = axios.create({
  baseURL: process.env.BACKEND_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthProvider = ({children}: {chidren: ReactNode}) => {
  const [username, setUsername] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      }, 
      (error) => Promise.reject(error)
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response, 
      async (error) => {
        const originalRequest = error.config;

        if(error.response?.status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshResponse = await axios.post('/api/auth/refresh-token');
            const newToken = refreshResponse.data.accessToken;

            setAccessToken(newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`; 

            return api(originalRequest)
          } catch (refreshError) {
            setUser(null); 
            setAccessToken(null);
            router.push("/")
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.  eject(responseInterceptor);
    }
  }, [accessToken, router]);

  useEffect(() => {
    const 
  })
}
