import React from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { I, Badge } from '../lib/ui.jsx'

const views7d = [
  { day: 'Lun', vues: 8 }, { day: 'Mar', vues: 14 }, { day: 'Mer', vues: 11 },
  { day: 'Jeu', vues: 19 }, { day: 'Ven', vues: 23 }, { day: 'Sam', vues: 17 }, { day: 'Dim', vues: 9 },
]
const typeData = [
  { name: 'Appartement', value: 7 }, { name: 'Maison', value: 3 },
  { name: 'Studio', value: 2 }, { name: 'Autre', value: 1 },
]
const PIE_COLORS = ['#FF6B00', '#0B1F3A', '#FB923C', '#94A3B8']

const recent = [
  { title: 'T3 Paris 11e — 74 m²', price: '680 000 €', tag: 'Nouvelle baisse', tagTone: 'emerald', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=120&q=60' },
  { title: 'Studio Bastille — 28 m²', price: '295 000 €', tag: 'Nouveau', tagTone: 'orange', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=120&q=60' },
  { title: 'Maison Lyon Foch — 140 m²', price: '1 250 000 €', tag: 'Correspond', tagTone: 'indigo', img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=120&q=60' },
]

const kpis = [
  { icon: I.Bell,       label: 'Alertes actives',   value: '5',     sub: '2 nouvelles correspondances', color: 'orange' },
  { icon: I.Heart,      label: 'Favoris',            value: '12',    sub: '3 collections créées',         color: 'rose' },
  { icon: I.Eye,        label: 'Annonces vues',      value: '47',    sub: 'Cette semaine',                color: 'indigo' },
  { icon: I.BadgeCheck, label: 'Abonnement',         value: 'Pro',   sub: 'Actif jusqu\'au 22/06',        color: 'emerald' },
]

const colorMap = {
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
  rose:   'bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
  indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
  emerald:'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
}

const tagToneMap = {
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  orange:  'bg-orange-50 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300',
  indigo:  'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
}

export default function UDOverview() {
  const { dark } = useOutletContext()
  const card = dark ? 'bg-[#0F1A2E] border-white/10' : 'bg-white border-slate-100'
  const txt  = dark ? 'text-white' : 'text-navy-900'
  const sub  = dark ? 'text-white/50' : 'text-slate-500'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Mon espace</div>
          <h1 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${txt}`}>Bonjour 👋</h1>
          <p className={`text-sm mt-1 ${sub}`}>Voici ce qui se passe sur votre espace PASMAL.</p>
        </div>
        <Link to="/dashboard/searches"
          className="inline-flex items-center gap-2 h-9 px-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-full transition">
          <I.Plus size={14}/> Nouvelle alerte
        </Link>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ icon: Icon, label, value, sub: s, color }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }}
            className={`rounded-2xl p-5 border shadow-soft ${card}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
              <Icon size={18}/>
            </div>
            <div className={`text-2xl font-extrabold tracking-tight ${txt}`}>{value}</div>
            <div className={`text-sm font-medium mt-0.5 ${txt}`}>{label}</div>
            <div className={`text-xs mt-1 ${sub}`}>{s}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Views chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
          className={`lg:col-span-2 rounded-3xl p-6 border shadow-soft ${card}`}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <div className={`font-bold ${txt}`}>Annonces consultées</div>
              <div className={`text-xs ${sub}`}>7 derniers jours</div>
            </div>
            <Badge tone="orange">+18% vs sem. passée</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={views7d} margin={{ top: 6, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gUD" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.35}/>
                    <stop offset="100%" stopColor="#FF6B00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke={dark ? '#1E2D42' : '#F1F5F9'} vertical={false}/>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: dark ? '#64748B' : '#94A3B8', fontSize: 12 }}/>
                <YAxis tickLine={false} axisLine={false} tick={{ fill: dark ? '#64748B' : '#94A3B8', fontSize: 12 }}/>
                <Tooltip contentStyle={{ background: '#0B1F3A', color: '#fff', borderRadius: 12, border: 'none', fontSize: 12 }}/>
                <Area type="monotone" dataKey="vues" stroke="#FF6B00" strokeWidth={2.5} fill="url(#gUD)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Favorites by type */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}
          className={`rounded-3xl p-6 border shadow-soft ${card}`}>
          <div className={`font-bold mb-1 ${txt}`}>Favoris par type</div>
          <div className={`text-xs mb-4 ${sub}`}>12 biens sauvegardés</div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={68} stroke="none">
                  {typeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]}/>)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0B1F3A', color: '#fff', borderRadius: 12, border: 'none', fontSize: 12 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5">
            {typeData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }}/>
                  <span className={sub}>{d.name}</span>
                </div>
                <span className={`font-bold ${txt}`}>{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent listings */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}
        className={`rounded-3xl p-6 border shadow-soft ${card}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className={`font-bold ${txt}`}>Consultées récemment</div>
            <div className={`text-xs ${sub}`}>Vos dernières annonces visitées</div>
          </div>
          <Link to="/dashboard/favorites" className="text-xs font-semibold text-orange-500 hover:underline">Voir les favoris</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recent.map((r) => (
            <div key={r.title} className={`flex flex-col rounded-2xl overflow-hidden border transition hover:shadow-card ${dark ? 'border-white/10' : 'border-slate-100'}`}>
              <img src={r.img} alt="" className="h-32 w-full object-cover"/>
              <div className="p-3 flex-1 flex flex-col gap-1">
                <div className={`text-xs font-semibold ${txt} line-clamp-1`}>{r.title}</div>
                <div className="text-sm font-extrabold text-orange-500">{r.price}</div>
                <span className={`self-start text-[10px] font-bold px-2 py-0.5 rounded-full ${tagToneMap[r.tagTone]}`}>{r.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
