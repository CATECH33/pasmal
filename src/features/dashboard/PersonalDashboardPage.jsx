import React from 'react'
import { useNavigate } from 'react-router-dom'
import PersonalDashboard from '../../components/PersonalDashboard.jsx'

export default function PersonalDashboardPage() {
  const navigate = useNavigate()
  return <PersonalDashboard onExit={() => navigate('/')} />
}
