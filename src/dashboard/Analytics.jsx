import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts'
import { I, Button, KpiCard, Badge } from '../lib/ui.jsx'

/* ============================================================
   Analytics — Premium dashboard (Airbnb-admin style)
   ============================================================ */

const u = (id, w = 200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const REVENUE_12M = [
  { m: 'Juin',  ca: 4820, prev: 3210 },
  { m: 'Juil', ca: 5410, prev: 3680 },
  { m: 'Août', ca: 4980, prev: 4120 },
  { m: 'Sept', ca: 6240, prev: 4580 },
  { m: 'Oct',  ca: 7110, prev: 5240 },
  { m: 'Nov',  ca: 6890, prev: 5680 },
  { m: 'Déc',  ca: 8420, prev: 6110 },
  { m: 'Janv', ca: 7980, prev: 5890 },
  { m: 'Fév',  ca: 8910, prev: 6420 },
  { m: 'Mars', ca: 10240, prev: 7180 },
  { m: 'Avr',  ca: 11420, prev: 7980 },
  { m: 'Mai',  ca: 12680, prev: 8520 },
]

const VIEWS_30D = Array.from({ length: 30 }).map((_, i) => {
  const day = i + 1
  const noise = Math.sin(i * 0.7) * 220 + Math.cos(i * 0.35) * 120
  return {
    day: `${day < 10 ? '0' + day : day}/05`,
    views: Math.round(1400 + i * 32 + noise + (i > 22 ? 380 : 0)),
    leads: Math.round((1400 + i * 32 + noise) * 0.018 + (i % 7 === 0 ? 6 : 0)),
  }
})

const CHANNELS = [
  { label: 'Recherche organique', value: 48, color: '#FF6B00' },
  { label: 'Trafic direct',       value: 22, color: '#0B1F3A' },
  { label: 'Réseaux sociaux',     value: 18, color: '#FB923C' },
  { label: 'Partenaires',         value: 12, color: '#94A3B8' },
]

const POPULAR = [
  { id: 'a1', title: 'T3 avec balcon vue dégagée', city: 'Lyon 6ᵉ',     img: u('photo-1560448204-e02f11c3d0e2'), price: 485000, views: 3240, leads: 41, ca: 1960, trend: +18 },
  { id: 'a2', title: 'Villa avec piscine',          city: 'Nice',         img: u('photo-1613490493576-7fde63acd811'), price: 2100000, views: 2810, leads: 36, ca: 2890, trend: +24 },
  { id: 'a3', title: 'Studio cosy lumineux',        city: 'Paris 11ᵉ',  img: u('photo-1502672260266-1c1ef2d93688'), price: 320000, views: 2540, leads: 28, ca: 1190, trend: +9 },
  { id: 'a4', title: 'Appartement haussmannien',    city: 'Paris 8ᵉ',   img: u('photo-1600585154340-be6161a56a0c'), price: 1250000, views: 2210, leads: 24, ca: 2410, trend: +6 },
  { id: 'a5', title: 'Maison contemporaine',        city: 'Bordeaux',     img: u('photo-1564013799919-ab600027ffc6'), price: 780000, views: 1980, leads: 19, ca: 1430, trend: -3 },
  { id: 'a6', title: 'Colocation design 4 ch.',     city: 'Nantes',       img: u('photo-1522708323590-d24dbb6b0267'), price: 590, views: 1620, leads: 22, ca: 240,  trend: +12 },
  { id: 'a7', title: 'Loft industriel rénové',      city: 'Marseille',    img: u('photo-1493809842364-78817add7ffb'), price: 1450, views: 1410, leads: 16, ca: 320,  trend: +4 },
]

const RANGES = [
  { id: '7d',  label: '7 jours' },
  { id: '30d', label: '30 jours' },
  { id: '90d', label: '3 mois' },
  { id: '12m', label: '12 mois' },
]

const fmtEUR = (n) => n.toLocaleString('fr-FR') + ' €'
const fmtK = (n) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)} k€` : `${n} €`)

export default function Analytics() {
  const [range, setRange] = useState('30d')

  const totals = useMemo(() => {
    const ca = REVENUE_12M.reduce((s, r) => s + r.ca, 0)
    const prev = REVENUE_12M.reduce((s, r) => s + r.prev, 0)
    return { ca, prev, growth: Math.round(((ca - prev) / prev) * 100) }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Performances</div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-navy-900 tracking-tight">Analytics</h1>
          <p className="text-slate-600 mt-1 text-sm">Vue d'ensemble de votre activité commerciale et de l'engagement de vos annonces.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-full">
            {RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${range === r.id ? 'bg-white text-navy-900 shadow-soft' : 'text-slate-600 hover:text-navy-900'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm"><I.Download size={14}/> Exporter</Button>
        </div>
      </div>

      {/* KPI cards */}
      <motion.div
        initial="hidden" animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={fadeUp}><KpiCard icon={I.CreditCard} label="Revenus encaissés"  value={86420} suffix=" €" trend="up" trendValue="+24%" helper="vs 30 derniers jours" /></motion.div>
        <motion.div variants={fadeUp}><KpiCard icon={I.Building}   label="Annonces actives"   value={14}    trend="up" trendValue="+2" helper="2 publiées cette semaine" /></motion.div>
        <motion.div variants={fadeUp}><KpiCard icon={I.Users}      label="Leads reçus"        value={392}   trend="up" trendValue="+18%" helper="vs période précédente" /></motion.div>
        <motion.div variants={fadeUp}><KpiCard icon={I.TrendingUp} label="Taux de conversion" value={4.2}   suffix="%" trend="down" trendValue="-0.3%" helper="Objectif : 5%" /></motion.div>
      </motion.div>

      {/* Revenue chart + channel breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-soft"
        >
          <div className="flex items-end justify-between mb-1 flex-wrap gap-2">
            <div>
              <div className="font-bold text-navy-900">Revenus mensuels</div>
              <div className="text-xs text-slate-500">Cette année vs année précédente</div>
            </div>
            <div className="flex items-center gap-5 text-xs">
              <Legend2 color="#FF6B00" label={`Cette année · ${fmtEUR(totals.ca)}`} />
              <Legend2 color="#CBD5E1" label={`N-1 · ${fmtEUR(totals.prev)}`} />
            </div>
          </div>
          <div className="mb-3 flex items-baseline gap-3">
            <div className="text-4xl font-extrabold text-navy-900 tracking-tight">{fmtEUR(totals.ca)}</div>
            <Badge tone={totals.growth >= 0 ? 'emerald' : 'rose'}>{totals.growth >= 0 ? '+' : ''}{totals.growth}% YoY</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_12M} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="aCA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#FF6B00" stopOpacity={0.40}/>
                    <stop offset="100%" stopColor="#FF6B00" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="aPrev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#CBD5E1" stopOpacity={0.35}/>
                    <stop offset="100%" stopColor="#CBD5E1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false}/>
                <XAxis dataKey="m" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }}/>
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} tickFormatter={(v) => `${v/1000}k`}/>
                <Tooltip content={<TooltipBox unit="€" />} cursor={{ stroke: '#E2E8F0' }}/>
                <Area type="monotone" dataKey="prev" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="4 4" fill="url(#aPrev)"/>
                <Area type="monotone" dataKey="ca"   stroke="#FF6B00" strokeWidth={2.5} fill="url(#aCA)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft"
        >
          <div className="flex items-end justify-between mb-1">
            <div>
              <div className="font-bold text-navy-900">Canaux d'acquisition</div>
              <div className="text-xs text-slate-500">Origine du trafic</div>
            </div>
            <Badge tone="orange">30j</Badge>
          </div>

          <div className="mt-5 space-y-4">
            {CHANNELS.map((c, i) => (
              <div key={c.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-700 font-medium">{c.label}</span>
                  <span className="font-bold text-navy-900">{c.value}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${c.value}%` }} viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center justify-between mb-1">
              <span>Visites uniques</span>
              <span className="font-bold text-navy-900">48 920</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Sessions</span>
              <span className="font-bold text-navy-900">62 410</span>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Views chart */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-white rounded-3xl p-6 border border-slate-100 shadow-soft"
      >
        <div className="flex items-end justify-between mb-3 flex-wrap gap-2">
          <div>
            <div className="font-bold text-navy-900">Vues d'annonces & leads</div>
            <div className="text-xs text-slate-500">30 derniers jours</div>
          </div>
          <div className="flex items-center gap-5 text-xs">
            <Legend2 color="#FF6B00" label="Vues" />
            <Legend2 color="#0B1F3A" label="Leads" />
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={VIEWS_30D} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false}/>
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }} interval={3}/>
              <YAxis yAxisId="l" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }}/>
              <YAxis yAxisId="r" orientation="right" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 11 }}/>
              <Tooltip content={<TooltipBox />} cursor={{ stroke: '#E2E8F0' }}/>
              <Line yAxisId="l" type="monotone" dataKey="views" stroke="#FF6B00" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#FF6B00', stroke: '#fff', strokeWidth: 3 }}/>
              <Line yAxisId="r" type="monotone" dataKey="leads" stroke="#0B1F3A" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#0B1F3A', stroke: '#fff', strokeWidth: 3 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Popular listings table */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="font-bold text-navy-900">Annonces les plus populaires</div>
            <div className="text-xs text-slate-500">Classement par vues sur la période</div>
          </div>
          <Button variant="ghost" size="sm">Tout voir <I.ArrowRight size={14}/></Button>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {POPULAR.map((p, i) => (
            <div key={p.id} className="p-4 flex items-center gap-3">
              <span className="text-slate-400 font-bold text-sm w-5 shrink-0">#{i+1}</span>
              <img src={p.img} alt={p.title} className="w-14 h-14 rounded-xl object-cover shrink-0"/>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-navy-900 truncate">{p.title}</div>
                <div className="text-xs text-slate-500 truncate flex items-center gap-1"><I.MapPin size={11}/>{p.city}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-navy-900 text-sm">{p.views.toLocaleString('fr-FR')}</div>
                <div className={`text-[11px] font-semibold inline-flex items-center gap-0.5 ${p.trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {p.trend >= 0 ? <I.TrendingUp size={11}/> : <I.TrendingDown size={11}/>}{Math.abs(p.trend)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table */}
        <table className="hidden md:table w-full">
          <thead className="bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="text-left px-6 py-3 w-12">#</th>
              <th className="text-left px-6 py-3">Bien</th>
              <th className="text-right px-6 py-3">Vues</th>
              <th className="text-right px-6 py-3">Leads</th>
              <th className="text-right px-6 py-3">Conversion</th>
              <th className="text-right px-6 py-3">Revenus</th>
              <th className="text-right px-6 py-3">Évol.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {POPULAR.map((p, i) => {
              const conv = ((p.leads / p.views) * 100).toFixed(1)
              const up = p.trend >= 0
              return (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="px-6 py-3 text-slate-400 font-bold">#{i + 1}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.img} alt={p.title} className="w-12 h-12 rounded-xl object-cover"/>
                      <div className="min-w-0">
                        <div className="font-semibold text-navy-900 text-sm truncate">{p.title}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1"><I.MapPin size={11}/>{p.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right text-navy-900 font-semibold">{p.views.toLocaleString('fr-FR')}</td>
                  <td className="px-6 py-3 text-right text-navy-900 font-semibold">{p.leads}</td>
                  <td className="px-6 py-3 text-right">
                    <Badge tone={Number(conv) >= 1.5 ? 'emerald' : Number(conv) >= 0.8 ? 'amber' : 'slate'}>{conv}%</Badge>
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-navy-900">{fmtK(p.ca * 1)}</td>
                  <td className="px-6 py-3 text-right">
                    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {up ? <I.TrendingUp size={12}/> : <I.TrendingDown size={12}/>}{Math.abs(p.trend)}%
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </motion.section>
    </div>
  )
}

/* ============================================================
   Small UI helpers (local)
   ============================================================ */
const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }

function Legend2({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-700">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}

function TooltipBox({ active, payload, label, unit = '' }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-900 text-white rounded-xl shadow-cardHover px-3 py-2 border border-white/10">
      <div className="text-[10px] uppercase tracking-wider text-white/60 mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }}/>
          <span className="capitalize text-white/80">{p.dataKey}</span>
          <span className="font-bold ml-1">{Number(p.value).toLocaleString('fr-FR')}{unit}</span>
        </div>
      ))}
    </div>
  )
}
