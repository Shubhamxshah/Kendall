'use client'

import { useAuth } from '@/helpers/authContext'
import React, { useEffect } from 'react'


const Dashboard = () => {
  const {username, api, accessToken } = useAuth();
  
  useEffect(() => {
  if (!accessToken) return;
    console.log("Current access token:", accessToken);
    // Make a test request to check the header
    api.get('/api/auth/user/profile')
      .then(res => console.log("Profile response:", res.data))
      .catch(err => console.log("Profile error:", err.response?.data));
}, [accessToken, api]);

  console.log("username", username)
  return (
    <div>Welcome to Dashboard {username}</div>
  )
}

export default Dashboard
