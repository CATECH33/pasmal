import React from 'react'
import { motion } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const NAV = [
  { id: 'overview',       label: 'Vue d\'ensemble', Icon: I.Home       },
  { id: 'favoris',        label: 'Mes favoris',     Icon: I.Heart,  badge: 4 },
  { id: 'alertes',        label: 'Alertes',         Icon: I.Bell,   badge: 2 },
  { id: 'recherches',     label: 'Mes recherches',  Icon: I.Search     },
  { id: 'notifications',  label: 'Notifications',   Icon: I.Check      },
  { id: 'abonnement',     label: 'Abonnement',      Icon: I.Star       },
  { id: 'profil',         label: 'Mon profil',      Icon: I.User       },
]

export default function DashSidebar({ page, setPage, dark, setDark, onExit }) {
  return (
    <aside className="flex flex-col w-60 shrink-0 bg-[#0B1F3A] h-full">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10">
        <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
          <I.User size={14} className="text-white" />
        </div>
        <div>
          <p className="text-white font-extrabold text-sm leading-none">PASMAL</p>
          <p className="text-white/40 text-[10px] mt-0.5">Espace Personnel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {NAV.map(({ id, label, Icon, badge }) => {
          const active = page === id
          return (
            <button key={id} onClick={() => setPage(id)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                active ? 'bg-orange-500 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              {active && (
                <motion.div layoutId="pers-sidebar-pill"
                  className="absolute inset-0 rounded-xl bg-orange-500 -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
              )}
              <Icon size={15} className="shrink-0" />
              <span className="text-[13px] font-semibold">{label}</span>
              {badge && !active && (
                <span className="ml-auto text-[10px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded-full">{badge}</span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <button onClick={() => setDark(!dark)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition text-[13px] font-semibold">
          {dark ? <I.Star size={15} /> : <I.Bell size={15} />}
          {dark ? 'Mode clair' : 'Mode sombre'}
        </button>
        <button onClick={onExit}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:bg-rose-500/20 hover:text-rose-400 transition text-[13px] font-semibold">
          <I.ArrowLeft size={15} /> Quitter
        </button>
      </div>
    </aside>
  )
}
