'use client';

import { useAuth } from '@/helpers/authContext';
import React, { useEffect } from 'react';

const Dashboard = () => {
  const { username, api } = useAuth();

  useEffect(() => {
    
    const fetchUsername = () => {
    api
      .get('/api/auth/user/profile')
      .then((res) => console.log('Profile response:', res.data))
      .catch((err) => console.log('Profile error:', err.response?.data));
    }

    if (username){
      fetchUsername();
    }
  }, [username, api]);

  return <div>Welcome to Dashboard {username}</div>;
};

export default Dashboard;
