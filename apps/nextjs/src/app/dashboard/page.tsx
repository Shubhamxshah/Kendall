'use client';

import { useAuth } from '@/helpers/authContext';
import React, { useEffect } from 'react';

const Dashboard = () => {
  const { username, api, accessToken } = useAuth();

  useEffect(() => {
    if (!accessToken) return;

    console.log('🟢 Current accessToken in Context:', accessToken);
    console.log('🟠 Axios instance headers before request:', api.defaults.headers);
    console.log('Current access token:', accessToken);
    // Make a test request to check the header
    api
      .get('/api/auth/user/profile', { headers: { Authorization: `Bearer ${accessToken}`}})
      .then((res) => console.log('Profile response:', res.data))
      .catch((err) => console.log('Profile error:', err.response?.data));
  }, [accessToken, api]);

  console.log('username', username);
  return <div>Welcome to Dashboard {username}</div>;
};

export default Dashboard;
