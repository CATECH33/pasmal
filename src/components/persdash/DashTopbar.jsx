import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'
import { useAuth } from '../../features/auth/providers/AuthProvider.jsx'

const PAGE_TITLES = {
  overview:      { title: 'Vue d\'ensemble',  sub: 'Bienvenue dans votre espace' },
  favoris:       { title: 'Mes favoris',       sub: 'Biens que vous suivez' },
  alertes:       { title: 'Alertes',           sub: 'Notifications automatiques' },
  recherches:    { title: 'Mes recherches',    sub: 'Critères sauvegardés' },
  notifications: { title: 'Notifications',     sub: 'Activité récente' },
  abonnement:    { title: 'Abonnement',        sub: 'Gérer votre plan' },
  profil:        { title: 'Mon profil',        sub: 'Informations personnelles' },
}

export default function DashTopbar({ page, dark }) {
  const { user, profile } = useAuth()
  const [open, setOpen] = useState(false)
  const ref  = useRef(null)

  const firstName = profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Vous'
  const initials  = (profile?.first_name?.[0] || user?.email?.[0] || 'U').toUpperCase()
  const info      = PAGE_TITLES[page] || PAGE_TITLES.overview

  const bg   = dark ? 'bg-[#111827] border-white/[0.08]' : 'bg-white/90 border-slate-200/80'
  const tx   = dark ? 'text-white'    : 'text-[#0F172A]'
  const sub  = dark ? 'text-white/40' : 'text-slate-400'
  const icn  = dark ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-[#0F172A]'

  useEffect(() => {
    if (!open) return
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  return (
    <header className={`flex items-center justify-between px-6 h-[60px] border-b shrink-0 backdrop-blur-sm ${bg}`}>

      {/* Page info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <h1 className={`text-[15px] font-extrabold leading-none truncate ${tx}`}>{info.title}</h1>
          <p className={`text-[11px] mt-0.5 ${sub}`}>{info.sub}</p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Today's date chip */}
        <div className={`hidden sm:flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg ${
          dark ? 'bg-white/[0.06] text-white/50' : 'bg-slate-100 text-slate-500'
        }`}>
          <I.Calendar size={12} />
          {new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
        </div>

        {/* Notification bell */}
        <div className="relative" ref={ref}>
          <button onClick={() => setOpen(o => !o)}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all ${icn}`}>
            <I.Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 border-2 border-white" />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                className={`absolute right-0 top-12 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden ${
                  dark ? 'bg-[#1a2740] border-white/10' : 'bg-white border-slate-200'
                }`}>
                <div className={`flex items-center justify-between px-4 py-3 border-b ${
                  dark ? 'border-white/[0.08]' : 'border-slate-100'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-white/50' : 'text-slate-400'}`}>
                    Notifications
                  </span>
                  <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">3 nouvelles</span>
                </div>
                {[
                  { dot: 'bg-orange-500', text: 'Nouveau bien correspondant à votre alerte Paris', time: 'Il y a 10 min', unread: true },
                  { dot: 'bg-sky-500',    text: 'Baisse de prix : Loft Bastille −15 000 €',        time: 'Il y a 3 h',   unread: true },
                  { dot: 'bg-slate-400',  text: 'Votre favori "Villa Neuilly" a été mis à jour',   time: 'Hier',          unread: false },
                ].map((n, i) => (
                  <div key={i} className={`flex gap-3 px-4 py-3.5 border-b last:border-0 cursor-pointer transition-colors ${
                    n.unread
                      ? dark ? 'bg-orange-500/[0.05] hover:bg-orange-500/10 border-white/5' : 'bg-orange-50/60 hover:bg-orange-50 border-slate-50'
                      : dark ? 'hover:bg-white/5 border-white/5' : 'hover:bg-slate-50 border-slate-50'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold truncate ${dark ? 'text-white' : 'text-[#0F172A]'}`}>{n.text}</p>
                      <p className={`text-[10px] mt-0.5 ${dark ? 'text-white/35' : 'text-slate-400'}`}>{n.time}</p>
                    </div>
                  </div>
                ))}
                <div className={`px-4 py-3 ${dark ? 'bg-white/[0.03]' : 'bg-slate-50'}`}>
                  <button className="w-full text-[11px] font-bold text-orange-500 hover:text-orange-600 transition">
                    Voir toutes les notifications →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] font-extrabold shadow-sm bg-gradient-to-br from-orange-400 to-orange-600`}>
          {initials}
        </div>
      </div>
    </header>
  )
}
