import React from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { I } from '../../lib/ui.jsx'

const KPIS = [
  { label: 'Vues totales',      value: '1 247', trend: '+12%', up: true,  Icon: I.Globe,      color: 'orange' },
  { label: 'Clics',             value: '89',    trend: '+5%',  up: true,  Icon: I.TrendingUp, color: 'blue'   },
  { label: 'Taux conversion',   value: '7,1%',  trend: '-0.3', up: false, Icon: I.Star,       color: 'amber'  },
  { label: 'Annonces actives',  value: '8',     trend: '+2',   up: true,  Icon: I.Building,   color: 'green'  },
]

const BARS = [42, 68, 55, 90, 73, 61, 85]
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const colorMap = {
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', icon: 'bg-orange-500' },
  blue:   { bg: 'bg-sky-100',    text: 'text-sky-600',    icon: 'bg-sky-500'    },
  amber:  { bg: 'bg-amber-100',  text: 'text-amber-600',  icon: 'bg-amber-500'  },
  green:  { bg: 'bg-emerald-100',text: 'text-emerald-600',icon: 'bg-emerald-500'},
}

function KpiCard({ label, value, trend, up, Icon, color, dark }) {
  const c = colorMap[color]
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 border ${dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.icon}`}>
          <Icon size={16} className="text-white" />
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${up ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {up ? '↑' : '↓'} {trend}
        </span>
      </div>
      <p className={`text-2xl font-extrabold ${dark ? 'text-white' : 'text-navy-900'}`}>{value}</p>
      <p className={`text-xs mt-0.5 ${dark ? 'text-white/50' : 'text-slate-400'}`}>{label}</p>
    </motion.div>
  )
}

function MiniBarChart({ dark }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} className={`rounded-2xl p-5 border ${dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'} shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-sm font-extrabold ${dark ? 'text-white' : 'text-navy-900'}`}>Vues cette semaine</p>
          <p className={`text-xs ${dark ? 'text-white/40' : 'text-slate-400'}`}>7 derniers jours</p>
        </div>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">↑ 12%</span>
      </div>
      <div className="flex items-end gap-2 h-20">
        {BARS.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t-md overflow-hidden" style={{ height: 64 }}>
              <motion.div
                className="w-full bg-orange-500 rounded-t-md"
                initial={{ height: 0 }} animate={{ height: inView ? `${h}%` : 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                style={{ marginTop: 'auto' }}
              />
            </div>
            <span className={`text-[9px] font-bold ${dark ? 'text-white/40' : 'text-slate-400'}`}>{DAYS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const RECENT_LEADS = [
  { name: 'Sophie Martin',  prop: 'App. Marais 3P', time: 'Il y a 5 min',  status: 'Nouveau'   },
  { name: 'Thomas Bernard', prop: 'Villa Neuilly',   time: 'Il y a 2 h',   status: 'Contacté'  },
  { name: 'Claire Dubois',  prop: 'Loft Bastille',  time: 'Hier',          status: 'En cours'  },
]

export default function PageOverview({ dark }) {
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((k, i) => <KpiCard key={i} {...k} dark={dark} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="lg:col-span-2"><MiniBarChart dark={dark} /></div>

        {/* Premium badge widget */}
        <div className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between ${bd}`}
          style={dark ? {} : { background: 'linear-gradient(135deg,#0B1F3A 0%,#1a3a6b 100%)' }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <I.BadgeCheck size={18} className="text-orange-400" />
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Plan Visibilité</span>
            </div>
            <p className="text-white font-extrabold text-lg leading-snug">Agence vérifiée</p>
            <p className="text-white/50 text-xs mt-1">Badge actif sur toutes vos annonces</p>
          </div>
          <button className="mt-4 w-full h-9 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition">
            Passer Premium →
          </button>
        </div>
      </div>

      {/* Recent leads */}
      <div className={`rounded-2xl border shadow-sm ${bd}`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? 'border-white/10' : 'border-slate-100'}`}>
          <p className={`text-sm font-extrabold ${tx}`}>Derniers leads</p>
          <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">3 nouveaux</span>
        </div>
        {RECENT_LEADS.map((l, i) => (
          <div key={i} className={`flex items-center gap-4 px-5 py-3.5 border-b last:border-0 ${dark ? 'border-white/5' : 'border-slate-50'}`}>
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {l.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${tx} truncate`}>{l.name}</p>
              <p className={`text-xs ${sx} truncate`}>{l.prop}</p>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                l.status === 'Nouveau' ? 'bg-orange-100 text-orange-600' :
                l.status === 'Contacté' ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-500'
              }`}>{l.status}</span>
              <p className={`text-[10px] mt-0.5 ${sx}`}>{l.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
