import React from 'react'
import { useNavigate } from 'react-router-dom'
import ProfessionalDashboard from '../../components/ProfessionalDashboard.jsx'

export default function ProDashboardPage() {
  const navigate = useNavigate()
  return <ProfessionalDashboard onExit={() => navigate('/')} />
}
