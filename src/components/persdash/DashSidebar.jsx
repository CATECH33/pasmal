import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I, BrandLogo } from '../../lib/ui.jsx'
import { useAuth } from '../../features/auth/providers/AuthProvider.jsx'
import { supabase } from '../../lib/supabase.js'

const NAV = [
  { id: 'overview',      label: 'Vue d\'ensemble', Icon: I.LayoutDashboard },
  { id: 'favoris',       label: 'Mes favoris',     Icon: I.Heart   },
  { id: 'alertes',       label: 'Alertes',         Icon: I.Bell    },
  { id: 'recherches',    label: 'Recherches',      Icon: I.Search  },
  { id: 'notifications', label: 'Notifications',   Icon: I.Check   },
  { id: 'abonnement',    label: 'Abonnement',      Icon: I.Star    },
]

const BOTTOM = [
  { id: 'profil', label: 'Mon profil', Icon: I.User },
]

function SidebarContent({ page, setPage, dark, setDark, onExit, badges, closeMobile }) {
  const { user, profile } = useAuth()
  const firstName = profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Utilisateur'
  const lastName  = profile?.last_name  || user?.user_metadata?.last_name  || ''
  const initials  = (firstName[0] || '') + (lastName[0] || '')
  const fullName  = [firstName, lastName].filter(Boolean).join(' ')
  const email     = user?.email || ''
  const isPremium = profile?.premium_alerts === true

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navigate = (id) => {
    setPage(id)
    closeMobile?.()
  }

  return (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.08]">
        <BrandLogo dark />
      </div>

      {/* User card */}
      <div className="mx-3 mt-4 mb-2 rounded-2xl bg-white/[0.05] border border-white/[0.08] p-3.5 flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-orange-500/30">
            {initials.toUpperCase() || 'U'}
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0B1F3A]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[13px] font-bold truncate leading-tight">{fullName}</p>
          <p className="text-white/40 text-[10px] truncate mt-0.5">{email}</p>
        </div>
        {isPremium && (
          <span className="text-[9px] font-extrabold text-orange-400 bg-orange-500/15 border border-orange-500/25 px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0">
            PRO
          </span>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-0.5">
        <div className="text-[9px] font-bold text-white/25 uppercase tracking-[0.18em] px-3 py-2">Navigation</div>
        {NAV.map(({ id, label, Icon }) => {
          const active = page === id
          const badge  = badges[id]
          return (
            <button key={id} onClick={() => navigate(id)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                active
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/55 hover:bg-white/[0.07] hover:text-white'
              }`}>
              {active && (
                <motion.div layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-orange-500 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
              )}
              <Icon size={15} className="shrink-0" />
              <span className="text-[13px] font-semibold flex-1">{label}</span>
              {badge > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                  active ? 'bg-white/25 text-white' : 'bg-orange-500 text-white'
                }`}>{badge}</span>
              )}
            </button>
          )
        })}

        <div className="text-[9px] font-bold text-white/25 uppercase tracking-[0.18em] px-3 pt-4 pb-2">Compte</div>
        {BOTTOM.map(({ id, label, Icon }) => {
          const active = page === id
          return (
            <button key={id} onClick={() => navigate(id)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                active
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/55 hover:bg-white/[0.07] hover:text-white'
              }`}>
              {active && (
                <motion.div layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-orange-500 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
              )}
              <Icon size={15} className="shrink-0" />
              <span className="text-[13px] font-semibold">{label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-4 pt-3 border-t border-white/[0.08] space-y-0.5">
        <button onClick={() => setDark(v => !v)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:bg-white/[0.07] hover:text-white transition text-[13px] font-semibold">
          {dark
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          }
          {dark ? 'Mode clair' : 'Mode sombre'}
        </button>
        <button onClick={onExit}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:bg-white/[0.07] hover:text-white transition text-[13px] font-semibold">
          <I.ArrowLeft size={15} />
          Retour à l'accueil
        </button>
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:bg-rose-500/10 hover:text-rose-400 transition text-[13px] font-semibold">
          <I.LogOut size={15} />
          Se déconnecter
        </button>
      </div>
    </>
  )
}

export default function DashSidebar({ page, setPage, dark, setDark, onExit, badges = {} }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-[200] lg:hidden w-10 h-10 rounded-xl bg-[#0B1F3A] flex items-center justify-center shadow-lg"
      >
        <I.Menu size={18} className="text-white" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-[#0B1F3A] h-full border-r border-white/[0.06]">
        <SidebarContent page={page} setPage={setPage} dark={dark} setDark={setDark} onExit={onExit} badges={badges} />
      </aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[210] bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed inset-y-0 left-0 z-[220] w-[280px] flex flex-col bg-[#0B1F3A] lg:hidden shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition"
              >
                <I.X size={16} />
              </button>
              <SidebarContent
                page={page} setPage={setPage} dark={dark} setDark={setDark}
                onExit={onExit} badges={badges}
                closeMobile={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
