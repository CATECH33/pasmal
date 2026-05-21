import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I, Button, Badge, Avatar } from '../lib/ui.jsx'
import { scoreListing, TIER_META, MOCK_LISTINGS } from '../lib/trustScoring.js'

/* ============================================================
   Trust Center — Anti-fraud admin panel
   ============================================================ */

const TIERS_ORDER = ['high-risk', 'suspicious', 'watch', 'trusted']

const VERDICT_ICONS = {
  fail: I.X,
  warn: I.Alert,
  pass: I.Check,
}
const VERDICT_TONES = {
  fail: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', dot: 'bg-rose-500' },
  warn: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', dot: 'bg-amber-500' },
  pass: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', dot: 'bg-emerald-500' },
}

export default function TrustCenter() {
  /* Score all listings once (memoized) */
  const scored = useMemo(
    () => MOCK_LISTINGS.map((l) => ({ ...l, ...scoreListing(l) })).sort((a, b) => a.score - b.score),
    []
  )

  /* Filter state */
  const [tierFilter, setTierFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const filtered = useMemo(() => {
    return scored.filter((l) => {
      if (tierFilter !== 'all' && l.tier !== tierFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!`${l.title} ${l.city} ${l.owner} ${l.id}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [scored, tierFilter, search])

  /* Aggregate stats */
  const stats = useMemo(() => {
    const total = scored.length
    const byTier = scored.reduce((acc, l) => { acc[l.tier] = (acc[l.tier] || 0) + 1; return acc }, {})
    const avgScore = Math.round(scored.reduce((s, l) => s + l.score, 0) / total)
    const blockable = byTier['high-risk'] || 0
    return { total, byTier, avgScore, blockable }
  }, [scored])

  const selected = scored.find((l) => l.id === selectedId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <I.Shield size={12}/> Sécurité plateforme
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-navy-900 tracking-tight">Trust Center</h1>
          <p className="text-slate-600 mt-1 text-sm">Détection automatique des annonces frauduleuses · {stats.total} annonces analysées en temps réel.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><I.Download size={14}/> Rapport</Button>
          <Button size="sm"><I.Sparkles size={14}/> Re-scanner tout</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiSec icon={I.Shield} tone="navy" label="Score moyen plateforme" value={stats.avgScore} suffix="/100" />
        <KpiSec icon={I.Check} tone="emerald" label="Annonces de confiance" value={stats.byTier.trusted || 0} />
        <KpiSec icon={I.Eye} tone="amber" label="Sous surveillance" value={(stats.byTier.watch || 0) + (stats.byTier.suspicious || 0)} />
        <KpiSec icon={I.Flag} tone="rose" label="À bloquer" value={stats.blockable} pulse />
      </div>

      {/* Tier tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TIERS_ORDER.map((t) => {
          const m = TIER_META[t]
          const n = stats.byTier[t] || 0
          const pct = stats.total ? Math.round((n / stats.total) * 100) : 0
          return (
            <button
              key={t}
              onClick={() => setTierFilter(t === tierFilter ? 'all' : t)}
              className={`text-left rounded-2xl p-4 border-2 transition-all hover:-translate-y-0.5 ${tierFilter === t ? 'border-navy-900 bg-white shadow-card' : 'border-slate-100 bg-white hover:border-slate-200 shadow-soft'}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: m.color }}/>
                <div className="text-sm font-bold text-navy-900">{m.label}</div>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-extrabold text-navy-900">{n}</div>
                <div className="text-xs text-slate-500">{pct}%</div>
              </div>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ background: m.color }}/>
              </div>
            </button>
          )
        })}
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-soft p-2 flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3 h-10 bg-slate-50 border border-slate-100 rounded-xl">
          <I.Search size={14} className="text-slate-400"/>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher une annonce, ID, propriétaire…" className="flex-1 bg-transparent text-sm text-navy-900 placeholder-slate-400 focus:outline-none"/>
        </div>
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
          {[['all', 'Toutes'], ...TIERS_ORDER.map((t) => [t, TIER_META[t].badge])].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTierFilter(k)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${tierFilter === k ? 'bg-white text-navy-900 shadow-soft' : 'text-slate-600 hover:text-navy-900'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Listings table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_180px_140px_180px_120px] px-5 py-3 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <div>Annonce</div>
          <div>Propriétaire</div>
          <div className="text-center">Score</div>
          <div>Top signal</div>
          <div className="text-right">Action</div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">Aucune annonce ne correspond à ces filtres.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filtered.map((l, i) => (
              <ListingRow key={l.id} listing={l} index={i} onOpen={() => setSelectedId(l.id)} />
            ))}
          </ul>
        )}
      </div>

      {/* Detail slide-over */}
      <AnimatePresence>
        {selected && <DetailDrawer listing={selected} onClose={() => setSelectedId(null)}/>}
      </AnimatePresence>
    </div>
  )
}

/* ============================================================
   Row
   ============================================================ */
function ListingRow({ listing, index, onOpen }) {
  const m = TIER_META[listing.tier]
  const topSignal = [...listing.signals]
    .sort((a, b) => signalWeight(b) - signalWeight(a))[0]
  const sv = VERDICT_TONES[topSignal.verdict]
  const sIcon = VERDICT_ICONS[topSignal.verdict]
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
      onClick={onOpen}
      className="grid grid-cols-1 md:grid-cols-[1fr_180px_140px_180px_120px] gap-3 px-5 py-3 items-center cursor-pointer hover:bg-slate-50/60 transition-colors"
    >
      <div className="flex items-center gap-3 min-w-0">
        <img src={listing.image_url} alt={listing.title} className="w-14 h-14 rounded-xl object-cover shrink-0"/>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-navy-900 truncate flex items-center gap-2">
            {listing.title}
            <span className="text-[10px] text-slate-400 font-mono shrink-0">{listing.id}</span>
          </div>
          <div className="text-xs text-slate-500 truncate flex items-center gap-1"><I.MapPin size={11}/>{listing.city}</div>
        </div>
      </div>

      <div className="flex items-center gap-2 min-w-0">
        <Avatar name={listing.owner} size={28}/>
        <div className="min-w-0">
          <div className="text-xs font-semibold text-navy-900 truncate">{listing.owner}</div>
          <div className="text-[10px] text-slate-500 capitalize">{listing.owner_kind}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-center">
        <ScoreGauge score={listing.score} color={m.color} />
        <Badge tone={m.tone}>{m.badge}</Badge>
      </div>

      <div className={`flex items-start gap-2 rounded-lg px-2.5 py-1.5 border ${sv.bg} ${sv.border}`}>
        <span className={`w-5 h-5 rounded-full ${sv.dot}/20 flex items-center justify-center mt-0.5 shrink-0`} style={{ background: `${sv.dot.replace('bg-','')}` }}>
          {React.createElement(sIcon, { size: 11, className: sv.text })}
        </span>
        <div className="min-w-0">
          <div className={`text-[11px] font-bold ${sv.text}`}>{topSignal.label}</div>
          <div className="text-[10px] text-slate-600 line-clamp-1">{topSignal.message}</div>
        </div>
      </div>

      <div className="flex items-center gap-1 justify-end">
        {listing.tier === 'high-risk' ? (
          <button onClick={(e) => { e.stopPropagation(); }} className="text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-full transition">Bloquer</button>
        ) : listing.tier === 'suspicious' ? (
          <button onClick={(e) => { e.stopPropagation(); }} className="text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-full transition">Examiner</button>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); }} className="text-xs font-semibold text-navy-900 hover:bg-slate-100 px-3 py-1.5 rounded-full transition">Détails</button>
        )}
      </div>
    </motion.li>
  )
}

const signalWeight = (s) => (s.verdict === 'fail' ? s.weight * 2 : s.verdict === 'warn' ? s.weight : 0)

/* ============================================================
   Score gauge (small circular)
   ============================================================ */
function ScoreGauge({ score, color }) {
  return (
    <div className="relative w-10 h-10 shrink-0">
      <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
        <circle cx="18" cy="18" r="15" fill="none" stroke="#E2E8F0" strokeWidth="3"/>
        <motion.circle
          cx="18" cy="18" r="15" fill="none"
          stroke={color} strokeWidth="3" strokeLinecap="round"
          initial={{ strokeDasharray: '0 94.25' }}
          animate={{ strokeDasharray: `${(score / 100) * 94.25} 94.25` }}
          transition={{ duration: 0.6 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-navy-900">{score}</div>
    </div>
  )
}

/* ============================================================
   KPI variant with optional pulse
   ============================================================ */
function KpiSec({ icon: Icon, label, value, suffix = '', tone = 'orange', pulse = false }) {
  const tones = {
    orange:  'bg-orange-50 text-orange-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber:   'bg-amber-50 text-amber-600',
    rose:    'bg-rose-50 text-rose-600',
    navy:    'bg-navy-900 text-white',
  }
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-soft relative overflow-hidden">
      {pulse && value > 0 && (
        <span className="absolute top-3 right-3 flex items-center justify-center">
          <span className="absolute w-3 h-3 bg-rose-500 rounded-full opacity-60 animate-ping"/>
          <span className="relative w-2 h-2 bg-rose-500 rounded-full"/>
        </span>
      )}
      <div className={`w-10 h-10 rounded-xl ${tones[tone]} flex items-center justify-center mb-3`}>
        <Icon size={18}/>
      </div>
      <div className="text-[28px] font-extrabold text-navy-900 tracking-tight leading-none">{value}<span className="text-base text-slate-400 font-bold">{suffix}</span></div>
      <div className="text-slate-500 text-sm mt-1.5">{label}</div>
    </div>
  )
}

/* ============================================================
   Slide-over detail drawer
   ============================================================ */
function DetailDrawer({ listing, onClose }) {
  const m = TIER_META[listing.tier]
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-navy-900/40 backdrop-blur-sm z-40" onClick={onClose}
      />
      <motion.aside
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 32 }}
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[520px] bg-white z-50 shadow-cardHover overflow-y-auto"
      >
        {/* Header */}
        <div className="relative">
          <img src={listing.image_url} alt={listing.title} className="w-full h-44 object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/40 to-transparent"/>
          <button onClick={onClose} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-navy-900 flex items-center justify-center"><I.X size={16}/></button>
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="text-[10px] font-mono text-white/70 mb-0.5">{listing.id}</div>
            <h2 className="text-lg font-extrabold leading-tight">{listing.title}</h2>
            <div className="text-xs text-white/80 mt-0.5 flex items-center gap-1"><I.MapPin size={11}/> {listing.city}</div>
          </div>
        </div>

        {/* Score block */}
        <div className="p-5 lg:p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <BigGauge score={listing.score} color={m.color}/>
            <div className="flex-1">
              <Badge tone={m.tone}>{m.badge}</Badge>
              <div className="text-lg font-extrabold text-navy-900 mt-1.5">{m.label}</div>
              <div className="text-xs text-slate-600 leading-relaxed mt-1">{listing.recommendation.text}</div>
            </div>
          </div>
        </div>

        {/* Signals list */}
        <div className="p-5 lg:p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-navy-900">Signaux détectés</div>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"/>{listing.signals.filter((s) => s.verdict === 'pass').length} OK</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"/>{listing.signals.filter((s) => s.verdict === 'warn').length} Warn</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"/>{listing.signals.filter((s) => s.verdict === 'fail').length} Fail</span>
            </div>
          </div>
          <ul className="space-y-2">
            {listing.signals.map((s) => {
              const tone = VERDICT_TONES[s.verdict]
              const Icon = VERDICT_ICONS[s.verdict]
              return (
                <li key={s.id} className={`flex items-start gap-3 rounded-xl p-3 border ${tone.bg} ${tone.border}`}>
                  <span className={`w-7 h-7 rounded-lg ${tone.dot} text-white flex items-center justify-center shrink-0`}>
                    <Icon size={14}/>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className={`font-semibold ${tone.text} text-sm`}>{s.label}</div>
                      <div className="text-[10px] uppercase tracking-wider font-bold opacity-60">{s.verdict === 'fail' ? 'Bloquant' : s.verdict === 'warn' ? 'Alerte' : 'OK'}</div>
                    </div>
                    <div className="text-[12px] text-slate-700 mt-0.5 leading-relaxed">{s.message}</div>
                    <div className="text-[10px] text-slate-400 mt-1">Catégorie : {s.category} · Poids : {s.weight}</div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Listing details */}
        <div className="p-5 lg:p-6 border-b border-slate-100">
          <div className="font-bold text-navy-900 mb-3">Détails de l'annonce</div>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <Row k="Prix" v={listing.price?.toLocaleString('fr-FR') + ' €'}/>
            <Row k="Surface" v={`${listing.surface} m²`}/>
            <Row k="Pièces" v={listing.rooms}/>
            <Row k="Photos" v={`${listing.photo_count} fichier(s)`}/>
            <Row k="Propriétaire" v={listing.owner}/>
            <Row k="Type compte" v={listing.owner_kind}/>
            <Row k="KYC" v={listing.account_verified ? '✓ Vérifié' : '— Non vérifié'} tone={listing.account_verified ? 'emerald' : 'rose'}/>
            <Row k="Téléphone" v={listing.phone_verified ? '✓ Vérifié' : '— Non vérifié'} tone={listing.phone_verified ? 'emerald' : 'rose'}/>
            <Row k="Publié le" v={listing.published_at}/>
            <Row k="Duplicata" v={listing.duplicate_score >= 70 ? `${listing.duplicate_score}% avec ${listing.duplicate_ref || '—'}` : 'Aucun'} tone={listing.duplicate_score >= 70 ? 'rose' : 'slate'}/>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 lg:p-6 sticky bottom-0 bg-white border-t border-slate-100">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="ghost" className="flex-1"><I.MessageSquare size={14}/> Contacter</Button>
            {listing.tier === 'high-risk' || listing.tier === 'suspicious' ? (
              <>
                <Button variant="outline" className="flex-1"><I.Alert size={14}/> Demander révision</Button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-5 text-sm font-semibold rounded-full bg-rose-600 hover:bg-rose-700 text-white transition">
                  <I.Trash size={14}/> Suspendre
                </button>
              </>
            ) : (
              <Button className="flex-1"><I.Check size={14}/> Approuver</Button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  )
}

function BigGauge({ score, color }) {
  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
        <circle cx="18" cy="18" r="15" fill="none" stroke="#E2E8F0" strokeWidth="3"/>
        <motion.circle
          cx="18" cy="18" r="15" fill="none"
          stroke={color} strokeWidth="3" strokeLinecap="round"
          initial={{ strokeDasharray: '0 94.25' }}
          animate={{ strokeDasharray: `${(score / 100) * 94.25} 94.25` }}
          transition={{ duration: 0.8 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-extrabold text-navy-900 leading-none">{score}</div>
        <div className="text-[9px] text-slate-500 font-semibold tracking-wider">/100</div>
      </div>
    </div>
  )
}

function Row({ k, v, tone }) {
  const tones = { emerald: 'text-emerald-700', rose: 'text-rose-700', slate: 'text-navy-900' }
  return (
    <>
      <div className="text-slate-500 text-xs">{k}</div>
      <div className={`font-semibold text-sm ${tones[tone] || 'text-navy-900'} truncate`}>{v}</div>
    </>
  )
}
