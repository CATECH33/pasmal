import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from 'recharts'
import { I, Badge } from '../lib/ui.jsx'

const priceTrend = [
  { m: 'Juin', paris: 10800, lyon: 5100, bordeaux: 4800 },
  { m: 'Juil', paris: 10950, lyon: 5200, bordeaux: 4850 },
  { m: 'Août', paris: 10700, lyon: 5150, bordeaux: 4900 },
  { m: 'Sep',  paris: 11100, lyon: 5300, bordeaux: 5000 },
  { m: 'Oct',  paris: 11400, lyon: 5450, bordeaux: 5100 },
  { m: 'Nov',  paris: 11200, lyon: 5400, bordeaux: 5050 },
  { m: 'Déc',  paris: 11600, lyon: 5600, bordeaux: 5200 },
  { m: 'Jan',  paris: 11800, lyon: 5700, bordeaux: 5300 },
  { m: 'Fév',  paris: 12000, lyon: 5800, bordeaux: 5350 },
  { m: 'Mar',  paris: 12200, lyon: 5900, bordeaux: 5500 },
  { m: 'Avr',  paris: 12100, lyon: 6000, bordeaux: 5600 },
  { m: 'Mai',  paris: 12400, lyon: 6100, bordeaux: 5700 },
]

const neighborhoodGrowth = [
  { name: 'Paris 11e',        growth: 8.4, avgPrice: 11800 },
  { name: 'Lyon Confluence',  growth: 12.1, avgPrice: 6200 },
  { name: 'Bordeaux Chartrons',growth: 9.7, avgPrice: 5900 },
  { name: 'Nantes Île de N.', growth: 11.3, avgPrice: 4800 },
  { name: 'Marseille 13e',    growth: 15.2, avgPrice: 3400 },
  { name: 'Montpellier Ctr.', growth: 7.8,  avgPrice: 4200 },
]

const opportunities = [
  { title: 'T3 Paris 11e — 74 m²',     price: '680 000 €', below: '−9%', score: 94, type: 'Dessous du marché',    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=80&q=60' },
  { title: 'Studio Bastille — 28 m²',   price: '295 000 €', below: '−12%',score: 89, type: 'Prix négociable',      img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=80&q=60' },
  { title: 'Maison Nantes — 110 m²',    price: '498 000 €', below: '−6%', score: 82, type: 'Fort potentiel locatif',img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80&q=60' },
]

const CITY_COLORS = { paris: '#FF6B00', lyon: '#0B1F3A', bordeaux: '#FB923C' }

export default function UDAIInsights() {
  const { dark } = useOutletContext()
  const [city, setCity] = useState('paris')

  const txt  = dark ? 'text-white' : 'text-navy-900'
  const sub  = dark ? 'text-white/50' : 'text-slate-500'
  const card = dark ? 'bg-[#0F1A2E] border-white/10' : 'bg-white border-slate-100'
  const grid = dark ? 'stroke="#1E2D42"' : 'stroke="#F1F5F9"'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Intelligence artificielle</div>
          <h1 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${txt}`}>Insights IA</h1>
          <p className={`text-sm mt-1 ${sub}`}>Analyses du marché immobilier en temps réel, générées par notre modèle IA.</p>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${dark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
          Mis à jour il y a 2h
        </div>
      </div>

      {/* Price trend */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className={`rounded-3xl border p-6 shadow-soft ${card}`}>
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <div className={`font-bold ${txt}`}>Évolution des prix au m²</div>
            <div className={`text-xs ${sub}`}>12 derniers mois · €/m²</div>
          </div>
          <div className="flex gap-1">
            {['paris', 'lyon', 'bordeaux'].map(c => (
              <button key={c} onClick={() => setCity(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition ${
                  city === c ? 'bg-navy-900 text-white' : dark ? 'text-white/60 hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
                }`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceTrend} margin={{ top: 6, right: 0, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gAI" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CITY_COLORS[city]} stopOpacity={0.3}/>
                  <stop offset="100%" stopColor={CITY_COLORS[city]} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={dark ? '#1E2D42' : '#F1F5F9'} vertical={false}/>
              <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fill: dark ? '#64748B' : '#94A3B8', fontSize: 12 }}/>
              <YAxis tickLine={false} axisLine={false} tick={{ fill: dark ? '#64748B' : '#94A3B8', fontSize: 12 }}
                tickFormatter={v => `${(v/1000).toFixed(0)}k`}/>
              <Tooltip
                contentStyle={{ background: '#0B1F3A', color: '#fff', borderRadius: 12, border: 'none', fontSize: 12 }}
                formatter={v => [`${v.toLocaleString('fr-FR')} €/m²`]}/>
              <Area type="monotone" dataKey={city} stroke={CITY_COLORS[city]} strokeWidth={2.5} fill="url(#gAI)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Neighborhood growth */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className={`rounded-3xl border p-6 shadow-soft ${card}`}>
          <div className={`font-bold mb-1 ${txt}`}>Croissance par quartier</div>
          <div className={`text-xs mb-5 ${sub}`}>Hausse des prix sur 12 mois (%)</div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={neighborhoodGrowth} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke={dark ? '#1E2D42' : '#F1F5F9'} vertical={false}/>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: dark ? '#64748B' : '#94A3B8', fontSize: 10 }}
                  tickFormatter={v => v.split(' ')[0]}/>
                <YAxis tickLine={false} axisLine={false} tick={{ fill: dark ? '#64748B' : '#94A3B8', fontSize: 11 }}
                  tickFormatter={v => `${v}%`}/>
                <Tooltip contentStyle={{ background: '#0B1F3A', color: '#fff', borderRadius: 12, border: 'none', fontSize: 12 }}
                  formatter={v => [`${v}%`, 'Croissance']}/>
                <Bar dataKey="growth" radius={[6, 6, 0, 0]}>
                  {neighborhoodGrowth.map((e, i) => (
                    <Cell key={i} fill={e.growth > 10 ? '#FF6B00' : '#0B1F3A'}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-600 inline-block"/>
              <span className={sub}>Forte croissance (&gt;10%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-sm bg-navy-900 inline-block"/>
              <span className={sub}>Croissance modérée</span>
            </div>
          </div>
        </motion.div>

        {/* Best opportunities */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
          className={`rounded-3xl border p-6 shadow-soft ${card}`}>
          <div className="flex items-center gap-2 mb-1">
            <I.Sparkles size={16} className="text-orange-500"/>
            <div className={`font-bold ${txt}`}>Meilleures opportunités</div>
          </div>
          <div className={`text-xs mb-5 ${sub}`}>Sélection IA basée sur vos critères</div>
          <div className="space-y-4">
            {opportunities.map((o, i) => (
              <motion.div key={o.title}
                initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition hover:shadow-soft cursor-pointer ${
                  dark ? 'border-white/10 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50'
                }`}>
                <img src={o.img} alt="" className="w-16 h-14 rounded-xl object-cover shrink-0"/>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold truncate ${txt}`}>{o.title}</div>
                  <div className="text-orange-500 font-bold text-sm">{o.price}</div>
                  <div className={`text-[11px] ${sub}`}>{o.type}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className={`text-[11px] font-bold ${dark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'} px-2 py-0.5 rounded-full mb-1`}>
                    {o.below}
                  </div>
                  <div className={`text-xs font-bold ${txt}`}>Score {o.score}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Market summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: I.TrendingUp,   label: 'Hausse moy. Paris',    value: '+8.4%',  sub: 'sur 12 mois',          tone: 'orange' },
          { icon: I.Home,         label: 'Délai moyen de vente', value: '72 j',   sub: 'Paris intra-muros',    tone: 'indigo' },
          { icon: I.Zap,          label: 'Tension marché',       value: 'Élevée', sub: '3.2 offres / bien',    tone: 'rose' },
          { icon: I.BadgeCheck,   label: 'Fiabilité modèle IA',  value: '91%',    sub: 'Précision prédictive', tone: 'emerald' },
        ].map(({ icon: Icon, label, value, sub: s, tone }, i) => {
          const bg = {
            orange: 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
            indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
            rose:   'bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
            emerald:'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
          }[tone]
          return (
            <motion.div key={label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
              className={`rounded-2xl border p-5 shadow-soft ${card}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
                <Icon size={18}/>
              </div>
              <div className={`text-xl font-extrabold ${txt}`}>{value}</div>
              <div className={`text-sm font-medium mt-0.5 ${txt}`}>{label}</div>
              <div className={`text-xs mt-1 ${sub}`}>{s}</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
