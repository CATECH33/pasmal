import React from 'react'
import { motion } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const STATS = [
  { label: 'Biens en favoris',    value: '4',  Icon: I.Heart,  color: 'rose'    },
  { label: 'Alertes actives',     value: '2',  Icon: I.Bell,   color: 'orange'  },
  { label: 'Nouvelles annonces',  value: '12', Icon: I.Home,   color: 'sky'     },
  { label: 'Recherches sauvées',  value: '3',  Icon: I.Search, color: 'emerald' },
]

const colorMap = {
  rose:    { icon: 'bg-rose-500',    bg: 'bg-rose-50',    text: 'text-rose-600'    },
  orange:  { icon: 'bg-orange-500',  bg: 'bg-orange-50',  text: 'text-orange-600'  },
  sky:     { icon: 'bg-sky-500',     bg: 'bg-sky-50',     text: 'text-sky-600'     },
  emerald: { icon: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
}

const RECENT = [
  { title: 'App. Marais 3P',  city: 'Paris 3e',  price: '850 000 €',  img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=120&h=90&fit=crop', badge: 'Nouveau prix' },
  { title: 'Loft Bastille',   city: 'Paris 11e', price: '2 400 €/mois',img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=120&h=90&fit=crop', badge: null         },
  { title: 'Villa Neuilly',   city: 'Neuilly',   price: '2 100 000 €', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=120&h=90&fit=crop', badge: 'Exclusivité'  },
]

const ALERTS = [
  { criteria: 'Appartement · Paris 3e–4e · ≤ 900k€', new: 3 },
  { criteria: 'Location · Paris 11e · ≤ 2 500€/mois', new: 9 },
]

export default function PageOverview({ dark, setPage }) {
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white'    : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, Icon, color }, i) => {
          const c = colorMap[color]
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-2xl border p-4 shadow-sm flex items-center gap-3 ${bd}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
                <Icon size={17} className="text-white" />
              </div>
              <div>
                <p className={`text-xl font-extrabold leading-none ${tx}`}>{value}</p>
                <p className={`text-xs mt-0.5 ${sx}`}>{label}</p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent favoris */}
      <div className={`rounded-2xl border shadow-sm ${bd}`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? 'border-white/10' : 'border-slate-100'}`}>
          <p className={`text-sm font-extrabold ${tx}`}>Favoris récents</p>
          <button onClick={() => setPage('favoris')} className="text-xs font-bold text-orange-500 hover:text-orange-600 transition">Voir tout →</button>
        </div>
        <div className="divide-y" style={{ borderColor: dark ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}>
          {RECENT.map((l, i) => (
            <div key={i} className={`flex items-center gap-4 px-5 py-3.5 ${dark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition cursor-pointer`}>
              <img src={l.img} alt="" className="w-14 h-11 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${tx} truncate`}>{l.title}</p>
                  {l.badge && <span className="text-[10px] font-bold bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full shrink-0">{l.badge}</span>}
                </div>
                <p className={`text-xs ${sx}`}>{l.city}</p>
              </div>
              <p className={`text-sm font-bold ${tx} shrink-0`}>{l.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active alerts */}
      <div className={`rounded-2xl border shadow-sm ${bd}`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? 'border-white/10' : 'border-slate-100'}`}>
          <p className={`text-sm font-extrabold ${tx}`}>Alertes actives</p>
          <button onClick={() => setPage('alertes')} className="text-xs font-bold text-orange-500 hover:text-orange-600 transition">Gérer →</button>
        </div>
        <div className="divide-y" style={{ borderColor: dark ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}>
          {ALERTS.map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <I.Bell size={14} className="text-orange-500" />
              </div>
              <p className={`flex-1 text-sm ${tx}`}>{a.criteria}</p>
              <span className="text-xs font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full shrink-0">{a.new} nouveaux</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
