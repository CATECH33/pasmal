import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../../lib/ui.jsx'
import { supabase } from '../../../lib/supabase.js'

const PLAN_CFG = {
  basic:      { label: 'Basic',      cls: 'bg-slate-100 text-slate-600'          },
  premium:    { label: 'Premium',    cls: 'bg-orange-100 text-orange-700'         },
  enterprise: { label: 'Enterprise', cls: 'bg-emerald-100 text-emerald-700'       },
  visibility: { label: 'Visibilité', cls: 'bg-sky-100 text-sky-700'              },
  pro:        { label: 'Pro',        cls: 'bg-indigo-100 text-indigo-700'         },
}

const STATUS_CFG = {
  active:    { label: 'Actif',     cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  cancelled: { label: 'Annulé',   cls: 'bg-rose-100 text-rose-700',       dot: 'bg-rose-500'    },
  suspended: { label: 'Suspendu', cls: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-500'   },
  past_due:  { label: 'Impayé',   cls: 'bg-rose-100 text-rose-700',       dot: 'bg-rose-500'    },
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtAmount(cents) {
  if (!cents) return '—'
  return (cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + ' €'
}

export default function AdminSubscriptions({ dark }) {
  const [subs,      setSubs]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [filter,    setFilter]    = useState('all')
  const [planFilter,setPlanFilter]= useState('all')
  const [updating,  setUpdating]  = useState(null)
  const [search,    setSearch]    = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*, profiles(first_name, last_name, email)')
        .order('created_at', { ascending: false })
      if (error) throw error
      setSubs(data ?? [])
    } catch (err) {
      console.error('[admin-subs]', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, newStatus) => {
    setUpdating(id)
    try {
      const { error } = await supabase.from('subscriptions').update({ status: newStatus }).eq('id', id)
      if (!error) setSubs(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s))
    } catch (err) {
      console.error('[admin-subs] update', err)
    } finally {
      setUpdating(null)
    }
  }

  const shown = subs.filter(s => {
    if (filter !== 'all' && s.status !== filter) return false
    if (planFilter !== 'all' && s.plan !== planFilter) return false
    if (search) {
      const q = search.toLowerCase()
      const email = (s.profiles?.email ?? '').toLowerCase()
      const name  = `${s.profiles?.first_name ?? ''} ${s.profiles?.last_name ?? ''}`.toLowerCase()
      if (!email.includes(q) && !name.includes(q)) return false
    }
    return true
  })

  const totalRevenue = subs
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.price_amount ?? s.price ?? 0), 0)

  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'
  const inp = dark
    ? 'bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-orange-400'
    : 'bg-white border-slate-200 text-navy-900 placeholder-slate-400 focus:border-orange-400'

  const statuses = ['all', 'active', 'cancelled', 'suspended', 'past_due']
  const plans    = ['all', 'basic', 'premium', 'enterprise', 'visibility', 'pro']

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',         value: subs.length },
          { label: 'Actifs',        value: subs.filter(s => s.status === 'active').length },
          { label: 'Annulés',       value: subs.filter(s => s.status === 'cancelled').length },
          { label: 'MRR estimé',    value: fmtAmount(totalRevenue) },
        ].map(({ label, value }) => (
          <div key={label} className={`rounded-2xl border p-4 shadow-sm ${bd}`}>
            <p className={`text-xl font-extrabold ${tx}`}>{value}</p>
            <p className={`text-xs mt-0.5 ${sx}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className={`flex items-center gap-2 px-3 h-9 rounded-xl border flex-1 min-w-[180px] ${inp} transition`}>
          <I.Search size={13} className={sx} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher utilisateur…"
            className="flex-1 bg-transparent text-sm outline-none" />
          {search && <button onClick={() => setSearch('')} className={sx}><I.X size={13} /></button>}
        </div>
        <div className="flex gap-1 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition ${
                filter === s ? 'bg-orange-500 text-white' : dark ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'
              }`}>
              {s === 'all' ? 'Tous' : STATUS_CFG[s]?.label ?? s}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {plans.map(p => (
            <button key={p} onClick={() => setPlanFilter(p)}
              className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition ${
                planFilter === p ? 'bg-navy-900 text-white' : dark ? 'bg-white/10 text-white/60' : 'bg-slate-100 text-slate-500'
              }`}>
              {p === 'all' ? 'Tous plans' : PLAN_CFG[p]?.label ?? p}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${bd}`}>
        {loading ? (
          <div className="flex justify-center py-14">
            <I.Loader size={22} className={`animate-spin ${sx}`} />
          </div>
        ) : shown.length === 0 ? (
          <div className="py-14 text-center">
            <I.CreditCard size={28} className={`mx-auto mb-3 ${sx}`} />
            <p className={`text-sm font-semibold ${tx}`}>Aucun abonnement</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className={`text-[11px] font-bold uppercase tracking-wider border-b ${dark ? 'border-white/10 text-white/40' : 'border-slate-100 text-slate-400'}`}>
                  <th className="text-left px-5 py-3">Utilisateur</th>
                  <th className="text-left px-4 py-3">Plan</th>
                  <th className="text-left px-4 py-3">Statut</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Prix/mois</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Début</th>
                  <th className="text-left px-4 py-3 hidden lg:table-cell">Fin</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {shown.map((s, i) => {
                    const planCfg   = PLAN_CFG[s.plan]   ?? { label: s.plan, cls: 'bg-slate-100 text-slate-600' }
                    const statusCfg = STATUS_CFG[s.status] ?? STATUS_CFG.active
                    const email     = s.profiles?.email
                    const name      = [s.profiles?.first_name, s.profiles?.last_name].filter(Boolean).join(' ')
                    const isUpdating = updating === s.id
                    return (
                      <motion.tr key={s.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className={`border-b last:border-0 transition ${dark ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'}`}>
                        <td className="px-5 py-3.5">
                          <p className={`text-sm font-semibold ${tx} truncate max-w-[160px]`}>{name || '—'}</p>
                          <p className={`text-xs ${sx} truncate max-w-[160px]`}>{email ?? '—'}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${planCfg.cls}`}>{planCfg.label}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${statusCfg.cls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />{statusCfg.label}
                          </span>
                        </td>
                        <td className={`px-4 py-3.5 text-sm font-bold ${tx} hidden sm:table-cell`}>
                          {fmtAmount(s.price_amount ?? s.price)}
                        </td>
                        <td className={`px-4 py-3.5 text-xs ${sx} hidden md:table-cell`}>{fmtDate(s.start_date ?? s.current_period_start)}</td>
                        <td className={`px-4 py-3.5 text-xs ${sx} hidden lg:table-cell`}>{fmtDate(s.end_date ?? s.current_period_end)}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex gap-1 justify-center">
                            {s.status === 'active' ? (
                              <button onClick={() => updateStatus(s.id, 'suspended')} disabled={isUpdating}
                                className="text-[11px] font-bold text-amber-600 hover:bg-amber-50 px-2 py-1 rounded-lg transition disabled:opacity-40">
                                {isUpdating ? '…' : 'Suspendre'}
                              </button>
                            ) : s.status === 'suspended' ? (
                              <button onClick={() => updateStatus(s.id, 'active')} disabled={isUpdating}
                                className="text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-lg transition disabled:opacity-40">
                                {isUpdating ? '…' : 'Réactiver'}
                              </button>
                            ) : null}
                            {s.status !== 'cancelled' && (
                              <button onClick={() => { if (window.confirm('Annuler cet abonnement ?')) updateStatus(s.id, 'cancelled') }}
                                disabled={isUpdating}
                                className="text-[11px] font-bold text-rose-500 hover:bg-rose-50 px-2 py-1 rounded-lg transition disabled:opacity-40">
                                Annuler
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
        {shown.length > 0 && (
          <div className={`px-5 py-3 text-xs ${sx} border-t ${dark ? 'border-white/10' : 'border-slate-100'}`}>
            {shown.length} abonnement{shown.length > 1 ? 's' : ''} affichés sur {subs.length}
          </div>
        )}
      </div>
    </div>
  )
}
