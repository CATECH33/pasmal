import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashSidebar from './prodash/DashSidebar.jsx'
import DashTopbar from './prodash/DashTopbar.jsx'
import PageOverview from './prodash/PageOverview.jsx'
import PageListings from './prodash/PageListings.jsx'
import PageLeads from './prodash/PageLeads.jsx'
import PageAnalytics from './prodash/PageAnalytics.jsx'
import PageBilling from './prodash/PageBilling.jsx'
import PageVerification from './prodash/PageVerification.jsx'
import PageProfile from './prodash/PageProfile.jsx'

const PAGES = {
  overview:     PageOverview,
  listings:     PageListings,
  leads:        PageLeads,
  analytics:    PageAnalytics,
  billing:      PageBilling,
  verification: PageVerification,
  profile:      PageProfile,
}

export default function ProfessionalDashboard({ onExit }) {
  const [page, setPage] = useState('overview')
  const [dark, setDark] = useState(false)

  const Page = PAGES[page] ?? PageOverview
  const bg   = dark ? 'bg-[#111827]' : 'bg-slate-50'

  return (
    <div className="fixed inset-0 z-[120] flex" style={{ fontFamily: 'inherit' }}>
      <DashSidebar page={page} setPage={setPage} dark={dark} setDark={setDark} onExit={onExit} />

      <div className={`flex-1 flex flex-col overflow-hidden ${bg}`}>
        <DashTopbar page={page} dark={dark} />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}>
              <Page dark={dark} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
