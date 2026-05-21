import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { I, Counter } from '../lib/ui.jsx'

/* ============================================================
   Listing Performance Widget — compact premium analytics
   - Reusable: <ListingPerfWidget /> drops anywhere in dashboard
   - 4 KPIs: views, leads, conversion, visibility score
   - Mini sparklines + circular gauge
   - Mock data, frontend only
   ============================================================ */

const DATA = {
  '7d': {
    views:      { total: 8220,  delta: +18,  series: [820, 940, 1120, 1010, 1280, 1410, 1640] },
    leads:      { total: 158,   delta: +24,  series: [12, 14, 21, 18, 27, 31, 35] },
    conversion: { total: 1.9,   delta: -0.3, series: [1.4, 1.5, 1.9, 1.8, 2.1, 2.2, 2.1] },
    visibility: { value: 78,    delta: +6 },
  },
  '30d': {
    views:      { total: 34620, delta: +22,  series: [1100,1280,1420,1180,1610,1740,1820,1690,1530,1820,1980,2110,1980,2240,2380,2160,2420,2510,2380,2640,2820,2640,2890,3010,2880,3120,3240,3110,3380,3520] },
    leads:      { total: 648,   delta: +28,  series: [14,18,22,17,26,31,28,24,32,36,34,38,29,42,46,40,48,52,45,54,58,52,61,65,58,67,70,63,72,76] },
    conversion: { total: 1.87,  delta: +0.1, series: [1.3,1.4,1.5,1.4,1.6,1.8,1.5,1.4,2.1,2.0,1.7,1.8,1.5,1.9,1.9,1.9,2.0,2.1,1.9,2.0,2.1,2.0,2.1,2.2,2.0,2.1,2.2,2.0,2.1,2.2] },
    visibility: { value: 82,    delta: +9 },
  },
  '90d': {
    views:      { total: 98410, delta: +34,  series: [820,940,1120,1010,1280,1410,1640,1530,1820,1980,2110,1980,2240,2380,2160,2420,2510,2380,2640,2820,2640,2890,3010,2880,3120,3240,3110,3380,3520,3680] },
    leads:      { total: 1842,  delta: +41,  series: [12,14,21,18,27,31,35,32,36,34,38,29,42,46,40,48,52,45,54,58,52,61,65,58,67,70,63,72,76,80] },
    conversion: { total: 1.87,  delta: +0.4, series: [1.4,1.5,1.9,1.8,2.1,2.2,2.1,2.0,1.7,1.8,1.5,1.9,1.9,1.9,2.0,2.1,1.9,2.0,2.1,2.0,2.1,2.2,2.0,2.1,2.2,2.0,2.1,2.2,2.0,2.1] },
    visibility: { value: 85,    delta: +14 },
  },
}

const RANGES = [['7d', '7j'], ['30d', '30j'], ['90d', '90j']]

export default function ListingPerfWidget({ title = 'Performances de l\'annonce', subtitle, defaultRange = '30d' }) {
  const [range, setRange] = useState(defaultRange)
  const d = DATA[range]

  return (
    <section className="bg-white rounded-3xl border border-slate-100 shadow-soft p-5 lg:p-6 relative overflow-hidden">
      {/* Subtle ambient gradient */}
      <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-orange-100/40 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-end justify-between gap-3 flex-wrap mb-5">
        <div>
          <div className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-1">Analytics</div>
          <h3 className="font-bold text-navy-900 text-base lg:text-lg">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
          {RANGES.map(([k, l]) => (
            <button
              key={k}
              onClick={() => setRange(k)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition ${range === k ? 'bg-white text-navy-900 shadow-soft' : 'text-slate-600 hover:text-navy-900'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* KPI grid */}
      <motion.div
        key={range}
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
        className="relative grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <KpiSpark
          icon={I.Eye}
          label="Total des vues"
          value={d.views.total}
          delta={d.views.delta}
          series={d.views.series}
          accent="#FF6B00"
        />
        <KpiSpark
          icon={I.Users}
          label="Leads reçus"
          value={d.leads.total}
          delta={d.leads.delta}
          series={d.leads.series}
          accent="#6366F1"
        />
        <KpiSpark
          icon={I.TrendingUp}
          label="Taux de conversion"
          value={d.conversion.total}
          suffix=" %"
          delta={d.conversion.delta}
          deltaSuffix=" pts"
          series={d.conversion.series}
          accent="#10B981"
          decimals={2}
        />
        <KpiVisibility
          value={d.visibility.value}
          delta={d.visibility.delta}
        />
      </motion.div>

      {/* AI insight footer */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="relative mt-5 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-50 via-orange-50/40 to-transparent border border-orange-100"
      >
        <span className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shrink-0">
          <I.Sparkles size={13} />
        </span>
        <div className="text-xs text-slate-700 leading-snug">
          <span className="font-semibold text-navy-900">Insight IA</span> · Ajoutez 3 photos et activez le boost pour gagner ~<span className="font-bold text-orange-600">+12 %</span> de vues estimées sur 30 jours.
        </div>
      </motion.div>
    </section>
  )
}

/* ============================================================
   KPI card with sparkline
   ============================================================ */
function KpiSpark({ icon: Icon, label, value, suffix = '', delta, deltaSuffix = ' %', series, accent, decimals = 0 }) {
  const positive = delta >= 0
  const sparkData = series.map((y, x) => ({ x, y }))
  const id = `sp-${label.replace(/\s/g, '')}`

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
      whileHover={{ y: -3 }}
      className="relative rounded-2xl border border-slate-100 bg-white overflow-hidden hover:shadow-card transition-shadow"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent 0%, ${accent} 50%, transparent 100%)`, opacity: 0.5 }} />

      <div className="p-4 pt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}15`, color: accent }}>
            <Icon size={16}/>
          </div>
          <div className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md inline-flex items-center gap-0.5 ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {positive ? <I.TrendingUp size={10}/> : <I.TrendingDown size={10}/>}
            {positive ? '+' : ''}{decimals ? delta.toFixed(decimals === 2 ? 1 : 0) : delta}{deltaSuffix}
          </div>
        </div>

        <div className="text-2xl font-extrabold text-navy-900 tracking-tight leading-none">
          <Counter to={value} suffix={suffix} decimals={decimals} />
        </div>
        <div className="text-[11px] text-slate-500 mt-1">{label}</div>
      </div>

      {/* Sparkline */}
      <div className="h-12 -mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={accent} stopOpacity={0.35}/>
                <stop offset="100%" stopColor={accent} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="y" stroke={accent} strokeWidth={2} fill={`url(#${id})`} dot={false} isAnimationActive={true} animationDuration={600}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

/* ============================================================
   Visibility score card (circular gauge)
   ============================================================ */
function KpiVisibility({ value, delta }) {
  const positive = delta >= 0
  const dash = (value / 100) * 94.25
  const tier = value >= 80 ? 'Excellent' : value >= 60 ? 'Bon' : value >= 40 ? 'Moyen' : 'Faible'
  const tierColor = value >= 80 ? '#10B981' : value >= 60 ? '#FF6B00' : value >= 40 ? '#F59E0B' : '#E11D48'

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
      whileHover={{ y: -3 }}
      className="relative rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white overflow-hidden hover:shadow-card transition-shadow"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
      <div className="absolute -top-10 -right-8 w-28 h-28 rounded-full bg-orange-200/40 blur-2xl pointer-events-none" />

      <div className="relative p-4 pt-5 flex items-center gap-3.5">
        {/* Gauge */}
        <div className="relative w-16 h-16 shrink-0">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#FFE4D1" strokeWidth="3.2"/>
            <motion.circle
              cx="18" cy="18" r="15" fill="none"
              stroke={tierColor} strokeWidth="3.2" strokeLinecap="round"
              initial={{ strokeDasharray: '0 94.25' }}
              animate={{ strokeDasharray: `${dash} 94.25` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span className="text-[15px] font-extrabold text-navy-900">
              <Counter to={value} duration={1} />
            </span>
            <span className="text-[8px] text-slate-500 font-semibold">/100</span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] text-slate-500 mb-0.5">Visibility score</div>
          <div className="font-extrabold text-navy-900 text-base leading-tight" style={{ color: tierColor }}>{tier}</div>
          <div className={`mt-1 inline-flex items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {positive ? <I.TrendingUp size={10}/> : <I.TrendingDown size={10}/>}
            {positive ? '+' : ''}{delta} pts
          </div>
        </div>
      </div>
    </motion.div>
  )
}
