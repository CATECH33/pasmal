import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashSidebar from './persdash/DashSidebar.jsx'
import DashTopbar from './persdash/DashTopbar.jsx'
import PageOverview from './persdash/PageOverview.jsx'
import PageFavoris from './persdash/PageFavoris.jsx'
import PageAlertes from './persdash/PageAlertes.jsx'
import PageRecherches from './persdash/PageRecherches.jsx'
import PageNotifications from './persdash/PageNotifications.jsx'
import PageAbonnement from './persdash/PageAbonnement.jsx'
import PageProfil from './persdash/PageProfil.jsx'

const PAGES = {
  overview:      PageOverview,
  favoris:       PageFavoris,
  alertes:       PageAlertes,
  recherches:    PageRecherches,
  notifications: PageNotifications,
  abonnement:    PageAbonnement,
  profil:        PageProfil,
}

export default function PersonalDashboard({ onExit }) {
  const [page, setPage] = useState('overview')
  const [dark, setDark] = useState(false)

  const Page = PAGES[page] ?? PageOverview
  const bg = dark ? 'bg-[#111827]' : 'bg-slate-50'

  return (
    <div className={`fixed inset-0 z-[120] flex ${bg}`}>
      <DashSidebar page={page} setPage={setPage} dark={dark} setDark={setDark} onExit={onExit} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashTopbar page={page} dark={dark} />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}>
              <Page dark={dark} setPage={setPage} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
