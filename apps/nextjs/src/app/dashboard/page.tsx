'use client'

import { useAuth } from '@/helpers/authContext'
import React from 'react'


const Dashboard = () => {
  const {username} = useAuth(); 
  return (
    <div>Welcome to Dashboard {username}</div>
  )
}

export default Dashboard
