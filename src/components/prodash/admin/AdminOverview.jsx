import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { I } from '../../../lib/ui.jsx'
import { supabase } from '../../../lib/supabase.js'

function fmt(n) {
  if (n === null || n === undefined) return '—'
  return n >= 1000 ? `${(n / 1000).toFixed(1)} k` : String(n)
}

function fmtEur(cents) {
  if (!cents) return '0 €'
  return (cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: 0 }) + ' €'
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'À l\'instant'
  if (mins < 60) return `Il y a ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `Il y a ${hrs} h`
  return `Il y a ${Math.floor(hrs / 24)} j`
}

const colorMap = {
  orange:  { bg: 'bg-orange-500/15',  text: 'text-orange-500',  icon: 'bg-orange-500'  },
  blue:    { bg: 'bg-sky-500/15',     text: 'text-sky-500',     icon: 'bg-sky-500'     },
  emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-500', icon: 'bg-emerald-500' },
  rose:    { bg: 'bg-rose-500/15',    text: 'text-rose-500',    icon: 'bg-rose-500'    },
  indigo:  { bg: 'bg-indigo-500/15',  text: 'text-indigo-500',  icon: 'bg-indigo-500'  },
  amber:   { bg: 'bg-amber-500/15',   text: 'text-amber-500',   icon: 'bg-amber-500'   },
}

function KpiCard({ label, value, Icon, color, dark, loading, sub }) {
  const c = colorMap[color]
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-5 border shadow-sm ${bd}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${c.icon}`}>
        <Icon size={16} className="text-white" />
      </div>
      <p className={`text-2xl font-extrabold ${tx}`}>
        {loading
          ? <span className="inline-block w-16 h-7 rounded-lg bg-slate-100 animate-pulse" />
          : value}
      </p>
      <p className={`text-xs mt-0.5 ${sx}`}>{label}</p>
      {sub && <p className={`text-[10px] mt-1 ${c.text}`}>{sub}</p>}
    </motion.div>
  )
}

export default function AdminOverview({ dark }) {
  const [stats,   setStats]   = useState({})
  const [recent,  setRecent]  = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const since30 = new Date(Date.now() - 30 * 86400000).toISOString()

      const [
        profilesRes,
        listingsRes,
        paymentsRes,
        subsRes,
        newUsersRes,
        recentListings,
        recentMsgs,
        recentSubs,
      ] = await Promise.all([
        supabase.from('profiles').select('id, role, created_at'),
        supabase.from('listings').select('id, status, created_at, title, user_id'),
        supabase.from('payments').select('amount, status, created_at'),
        supabase.from('subscriptions').select('id, plan, status, created_at').eq('status', 'active'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', since30),
        supabase.from('listings').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(4),
        supabase.from('messages').select('id, created_at').order('created_at', { ascending: false }).limit(3),
        supabase.from('subscriptions').select('id, plan, created_at, user_id').order('created_at', { ascending: false }).limit(3),
      ])

      const profiles  = profilesRes.data  ?? []
      const listings  = listingsRes.data  ?? []
      const payments  = paymentsRes.data  ?? []
      const subs      = subsRes.data      ?? []

      const totalUsers     = profiles.length
      const particuliers   = profiles.filter(p => p.role === 'private_user').length
      const professionnels = profiles.filter(p => p.role === 'pro_user').length
      const activeList     = listings.filter(l => l.status === 'active').length
      const pendingList    = listings.filter(l => l.status === 'pending').length
      const inactiveList   = listings.filter(l => !['active','pending'].includes(l.status)).length
      const revenue        = payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0)
      const activeSubs     = subs.length
      const newUsers       = newUsersRes.count ?? 0

      setStats({ totalUsers, particuliers, professionnels, activeList, pendingList, inactiveList, revenue, activeSubs, newUsers })

      const events = [
        ...(recentListings.data ?? []).map(l => ({
          id: 'l' + l.id, icon: I.Building,
          tone: l.status === 'pending' ? 'amber' : 'orange',
          text: `Annonce "${l.title?.slice(0, 30)}"`,
          sub: l.status === 'pending' ? 'En attente' : 'Active',
          time: l.created_at,
        })),
        ...(recentMsgs.data ?? []).map(m => ({
          id: 'm' + m.id, icon: I.Mail, tone: 'blue',
          text: 'Nouveau message contact', sub: '', time: m.created_at,
        })),
        ...(recentSubs.data ?? []).map(s => ({
          id: 's' + s.id, icon: I.CreditCard, tone: 'emerald',
          text: `Abonnement activé — Plan ${s.plan ?? '?'}`, sub: '', time: s.created_at,
        })),
      ]
        .filter(e => e.time)
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 8)

      setRecent(events)
    } catch (err) {
      console.error('[admin-overview]', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const kpis = [
    { label: 'Utilisateurs totaux',   value: fmt(stats.totalUsers),   Icon: I.Users,      color: 'blue'    },
    { label: 'Particuliers',          value: fmt(stats.particuliers),  Icon: I.User,       color: 'indigo'  },
    { label: 'Professionnels',        value: fmt(stats.professionnels),Icon: I.Briefcase,  color: 'orange'  },
    { label: 'Annonces actives',      value: fmt(stats.activeList),    Icon: I.Building,   color: 'emerald' },
    { label: 'Annonces en attente',   value: fmt(stats.pendingList),   Icon: I.AlertTriangle,color:'amber'  },
    { label: 'Annonces inactives',    value: fmt(stats.inactiveList),  Icon: I.Eye,        color: 'rose'    },
    { label: 'Revenus (paiements)',   value: fmtEur(stats.revenue),   Icon: I.CreditCard,  color: 'emerald' },
    { label: 'Abonnements actifs',    value: fmt(stats.activeSubs),    Icon: I.Star,       color: 'orange'  },
    { label: 'Nouveaux (30j)',        value: fmt(stats.newUsers),      Icon: I.TrendingUp, color: 'blue',
      sub: 'Inscriptions du dernier mois' },
  ]

  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'

  const toneColor = {
    orange: 'bg-orange-500/15 text-orange-500',
    amber:  'bg-amber-500/15 text-amber-500',
    emerald:'bg-emerald-500/15 text-emerald-500',
    blue:   'bg-sky-500/15 text-sky-500',
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        {kpis.map((k, i) => (
          <KpiCard key={i} {...k} dark={dark} loading={loading} />
        ))}
      </div>

      {/* Activité récente */}
      <div className={`rounded-2xl border shadow-sm ${bd}`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? 'border-white/10' : 'border-slate-100'}`}>
          <p className={`text-sm font-extrabold ${tx}`}>Activité récente</p>
          <span className={`text-xs ${sx}`}>Plateform events en temps réel</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <I.Loader size={22} className={`animate-spin ${sx}`} />
          </div>
        ) : recent.length === 0 ? (
          <div className={`py-12 text-center text-sm ${sx}`}>Aucune activité récente</div>
        ) : recent.map((e, i) => {
          const Icon = e.icon
          return (
            <div key={e.id} className={`flex items-center gap-4 px-5 py-3.5 border-b last:border-0 ${dark ? 'border-white/5' : 'border-slate-50'}`}>
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${toneColor[e.tone] ?? toneColor.orange}`}>
                <Icon size={14} />
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${tx} truncate`}>{e.text}</p>
                {e.sub && <p className={`text-xs ${sx}`}>{e.sub}</p>}
              </div>
              <p className={`text-[11px] ${sx} shrink-0`}>{timeAgo(e.time)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
