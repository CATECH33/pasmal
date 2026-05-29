import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const PAGE_TITLES = {
  overview:      'Vue d\'ensemble',
  favoris:       'Mes favoris',
  alertes:       'Alertes',
  recherches:    'Mes recherches',
  notifications: 'Notifications',
  abonnement:    'Abonnement',
  profil:        'Mon profil',
}

const NOTIFS = [
  { id: 1, text: 'Nouveau bien correspondant à votre alerte Paris 3e', time: 'Il y a 10 min', dot: 'bg-orange-500' },
  { id: 2, text: 'Baisse de prix : Loft Bastille −15 000 €',           time: 'Il y a 3 h',   dot: 'bg-sky-500'    },
  { id: 3, text: 'Votre favori "Villa Neuilly" a été mis à jour',      time: 'Hier',          dot: 'bg-slate-400'  },
]

export default function DashTopbar({ page, dark, userName = 'Jean' }) {
  const [open, setOpen] = useState(false)
  const bg   = dark ? 'bg-[#111827] border-white/10' : 'bg-white border-slate-200'
  const text = dark ? 'text-white'    : 'text-navy-900'
  const sub  = dark ? 'text-white/40' : 'text-slate-400'

  return (
    <header className={`flex items-center justify-between px-6 h-14 border-b shrink-0 ${bg}`}>
      <div>
        <h1 className={`text-base font-extrabold leading-none ${text}`}>{PAGE_TITLES[page]}</h1>
        <p className={`text-[11px] mt-0.5 ${sub}`}>Bonjour, {userName} 👋</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button onClick={() => setOpen(o => !o)}
            className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition ${
              dark ? 'hover:bg-white/10 text-white/70' : 'hover:bg-slate-100 text-slate-500'
            }`}>
            <I.Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 border-2 border-white" />
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className={`absolute right-0 top-11 w-72 rounded-2xl shadow-xl border z-50 overflow-hidden ${
                  dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
                }`}>
                <div className={`px-4 py-3 border-b text-xs font-bold uppercase tracking-wider ${
                  dark ? 'border-white/10 text-white/50' : 'border-slate-100 text-slate-400'
                }`}>Notifications</div>
                {NOTIFS.map(n => (
                  <div key={n.id} className={`flex gap-3 px-4 py-3 border-b last:border-0 cursor-pointer transition ${
                    dark ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`} />
                    <div>
                      <p className={`text-xs font-semibold ${dark ? 'text-white' : 'text-navy-900'}`}>{n.text}</p>
                      <p className={`text-[11px] mt-0.5 ${dark ? 'text-white/40' : 'text-slate-400'}`}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
          {userName[0]}
        </div>
      </div>
    </header>
  )
}
