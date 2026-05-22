import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'
import { I, Badge } from '../lib/ui.jsx'

const Pause = (p) => <svg width={p?.size||20} height={p?.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={p?.className}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
const Play  = (p) => <svg width={p?.size||20} height={p?.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={p?.className}><polygon points="5 3 19 12 5 21 5 3"/></svg>

const spark = (base, spread) => Array.from({ length: 7 }, (_, i) => ({ v: base + Math.round((Math.random() - 0.5) * spread) }))

const INIT = [
  {
    id: 1, name: 'Paris 11e — 2 pièces', active: true, freq: 'Immédiat',
    criteria: ['Paris 11e', '2 pièces', '300–600 k€', '40–70 m²'],
    matches: 23, newThisWeek: 4, data: spark(22, 12),
  },
  {
    id: 2, name: 'Lyon Presqu\'île — T3+', active: true, freq: 'Quotidien',
    criteria: ['Lyon 1e/2e', '3+ pièces', '400–900 k€', '70–120 m²'],
    matches: 11, newThisWeek: 2, data: spark(10, 8),
  },
  {
    id: 3, name: 'Bordeaux — Maison jardin', active: false, freq: 'Hebdo',
    criteria: ['Bordeaux', 'Maison', '< 800 k€', 'Jardin'],
    matches: 5, newThisWeek: 0, data: spark(5, 4),
  },
  {
    id: 4, name: 'Investissement locatif Nantes', active: true, freq: 'Immédiat',
    criteria: ['Nantes', '2–3 pièces', '< 350 k€', 'Rentabilité > 4%'],
    matches: 8, newThisWeek: 1, data: spark(8, 6),
  },
]

function SearchCard({ s, dark, onToggle, onDuplicate, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const card = dark ? 'bg-[#0F1A2E] border-white/10' : 'bg-white border-slate-100'
  const txt  = dark ? 'text-white' : 'text-navy-900'
  const sub  = dark ? 'text-white/50' : 'text-slate-500'
  const chip = dark ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-700'

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 shadow-soft transition-all ${card} ${!s.active ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.active ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-slate-100 text-slate-400'}`}>
            <I.Search size={16}/>
          </div>
          <div className="min-w-0">
            <div className={`font-semibold text-sm truncate ${txt}`}>{s.name}</div>
            <div className={`text-[11px] ${sub}`}>Fréquence : {s.freq}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => onToggle(s.id)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
              dark ? 'hover:bg-white/10 text-white/60 hover:text-white' : 'hover:bg-slate-100 text-slate-500'
            }`} title={s.active ? 'Mettre en pause' : 'Reprendre'}>
            {s.active ? <Pause size={14}/> : <Play size={14}/>}
          </button>
          <div className="relative">
            <button onClick={() => setMenuOpen(o => !o)}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                dark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-500'
              }`}>
              <I.MoreH size={16}/>
            </button>
            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)}/>
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className={`absolute right-0 top-9 w-44 rounded-2xl border shadow-cardHover z-20 overflow-hidden ${
                      dark ? 'bg-[#0F1A2E] border-white/10' : 'bg-white border-slate-100'
                    }`}>
                    {[
                      { icon: I.Edit,  label: 'Modifier',   action: () => setMenuOpen(false) },
                      { icon: I.Copy,  label: 'Dupliquer',  action: () => { onDuplicate(s.id); setMenuOpen(false) } },
                      { icon: I.Trash, label: 'Supprimer',  action: () => { onDelete(s.id); setMenuOpen(false) }, danger: true },
                    ].map(({ icon: Icon, label, action, danger }) => (
                      <button key={label} onClick={action}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition ${
                          danger
                            ? 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                            : dark ? 'text-white/80 hover:bg-white/10' : 'text-navy-900 hover:bg-slate-50'
                        }`}>
                        <Icon size={14}/> {label}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Criteria chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {s.criteria.map(c => (
          <span key={c} className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${chip}`}>{c}</span>
        ))}
      </div>

      {/* Stats + sparkline */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-extrabold ${txt}`}>{s.matches}</span>
            <span className={`text-xs ${sub}`}>correspondances</span>
          </div>
          {s.newThisWeek > 0
            ? <Badge tone="emerald">+{s.newThisWeek} cette semaine</Badge>
            : <Badge tone="slate">Aucune nouveauté</Badge>
          }
        </div>
        <div className="h-14 w-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={s.data} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`g${s.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6B00" stopOpacity={0.4}/>
                  <stop offset="100%" stopColor="#FF6B00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip contentStyle={{ background: '#0B1F3A', color: '#fff', borderRadius: 8, border: 'none', fontSize: 11 }} formatter={(v) => [v, 'matchs']}/>
              <Area type="monotone" dataKey="v" stroke="#FF6B00" strokeWidth={2} fill={`url(#g${s.id})`} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

export default function UDSavedSearches() {
  const { dark } = useOutletContext()
  const [searches, setSearches] = useState(INIT)
  const txt = dark ? 'text-white' : 'text-navy-900'
  const sub = dark ? 'text-white/50' : 'text-slate-500'
  const card = dark ? 'bg-[#0F1A2E] border-white/10' : 'bg-white border-slate-100'

  const toggle    = (id) => setSearches(ss => ss.map(s => s.id === id ? { ...s, active: !s.active } : s))
  const duplicate = (id) => setSearches(ss => { const s = ss.find(x => x.id === id); return [...ss, { ...s, id: Date.now(), name: s.name + ' (copie)', active: false }] })
  const del       = (id) => setSearches(ss => ss.filter(s => s.id !== id))

  const active  = searches.filter(s => s.active).length
  const paused  = searches.filter(s => !s.active).length

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Alertes</div>
          <h1 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${txt}`}>Recherches sauvegardées</h1>
          <p className={`text-sm mt-1 ${sub}`}>
            <span className="font-semibold text-emerald-500">{active} actives</span>
            {paused > 0 && <> · <span className="font-semibold text-slate-400">{paused} en pause</span></>}
          </p>
        </div>
        <button className="inline-flex items-center gap-2 h-9 px-4 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-full transition">
          <I.Plus size={14}/> Nouvelle alerte
        </button>
      </div>

      {/* Summary bar */}
      <div className={`rounded-2xl border p-4 flex items-center gap-6 flex-wrap shadow-soft ${card}`}>
        {[
          { label: 'Alertes totales', value: searches.length, color: txt },
          { label: 'Actives', value: active, color: 'text-emerald-500' },
          { label: 'En pause', value: paused, color: 'text-slate-400' },
          { label: 'Nouvelles cette semaine', value: searches.reduce((a, s) => a + s.newThisWeek, 0), color: 'text-orange-500' },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
            <div className={`text-xs ${sub}`}>{label}</div>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {searches.map(s => (
            <SearchCard key={s.id} s={s} dark={dark} onToggle={toggle} onDuplicate={duplicate} onDelete={del}/>
          ))}
        </AnimatePresence>
      </div>

      {searches.length === 0 && (
        <div className={`rounded-3xl border p-12 text-center shadow-soft ${card}`}>
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-4">
            <I.Search size={24}/>
          </div>
          <div className={`font-bold text-lg ${txt}`}>Aucune alerte</div>
          <div className={`text-sm mt-1 ${sub}`}>Créez votre première alerte pour recevoir des correspondances en temps réel.</div>
        </div>
      )}
    </div>
  )
}
