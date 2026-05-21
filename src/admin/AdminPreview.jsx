import React, { useState } from 'react'
import AdminLayout from './AdminLayout.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import AdminUsers     from './AdminUsers.jsx'
import AdminListings  from './AdminListings.jsx'
import AdminAgencies  from './AdminAgencies.jsx'
import AdminRevenue   from './AdminRevenue.jsx'
import AdminCRM       from './AdminCRM.jsx'
import AdminSettings  from './AdminSettings.jsx'

const MODULES = {
  dashboard: AdminDashboard,
  users:     AdminUsers,
  listings:  AdminListings,
  agencies:  AdminAgencies,
  payments:  AdminRevenue,
  crm:       AdminCRM,
  reports:   AdminRevenue,
  settings:  AdminSettings,
}

export default function AdminPreview() {
  const [activeId, setActiveId] = useState('dashboard')
  const Module = MODULES[activeId] || AdminDashboard

  return (
    <AdminLayout activeId={activeId} onActiveChange={setActiveId}>
      <Module key={activeId} />
    </AdminLayout>
  )
}
