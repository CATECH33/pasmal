import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../../lib/ui.jsx'
import { useAuth } from '../../../features/auth/providers/AuthProvider.jsx'
import { supabase } from '../../../lib/supabase.js'

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtPrice(n) {
  if (!n) return '—'
  return n.toLocaleString('fr-FR') + ' €'
}

export default function AdminSavedSearches({ dark }) {
  const { user } = useAuth()
  const [alerts,   setAlerts]   = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setAlerts(data ?? [])
    } catch (err) {
      console.error('[admin-searches]', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette recherche sauvegardée ?')) return
    setDeleting(id)
    try {
      const { error } = await supabase.from('alerts').delete().eq('id', id)
      if (!error) setAlerts(prev => prev.filter(a => a.id !== id))
    } catch (err) {
      console.error('[admin-searches] delete', err)
    } finally {
      setDeleting(null)
    }
  }

  const exportCSV = () => {
    const rows = [
      ['ID', 'Ville', 'Quartier', 'Prix max', 'Type', 'Créé le'],
      ...shown.map(a => [a.id, a.city ?? '', a.district ?? '', a.max_price ?? '', a.property_type ?? '', fmtDate(a.created_at)]),
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = 'recherches-sauvegardees.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const shown = alerts.filter(a => {
    if (!search) return true
    const q = search.toLowerCase()
    return (a.city ?? '').toLowerCase().includes(q)
      || (a.property_type ?? '').toLowerCase().includes(q)
      || (a.district ?? '').toLowerCase().includes(q)
  })

  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'
  const inp = dark
    ? 'bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-orange-400'
    : 'bg-white border-slate-200 text-navy-900 placeholder-slate-400 focus:border-orange-400'

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className={`flex items-center gap-2 px-3 h-10 rounded-xl border flex-1 min-w-[220px] ${inp} transition`}>
          <I.Search size={14} className={sx} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Filtrer par ville, type de bien…"
            className="flex-1 bg-transparent text-sm outline-none" />
          {search && (
            <button onClick={() => setSearch('')} className={sx}>
              <I.X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} disabled={shown.length === 0}
            className="flex items-center gap-2 h-10 px-4 rounded-xl border-2 border-slate-200 text-slate-600 text-xs font-bold hover:border-orange-400 hover:text-orange-500 transition disabled:opacity-40">
            <I.Download size={14} /> Exporter CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={`grid grid-cols-3 gap-4`}>
        {[
          { label: 'Total recherches', value: alerts.length },
          { label: 'Villes uniques',   value: new Set(alerts.map(a => a.city).filter(Boolean)).size },
          { label: 'Types de bien',    value: new Set(alerts.map(a => a.property_type).filter(Boolean)).size },
        ].map(({ label, value }) => (
          <div key={label} className={`rounded-2xl border p-4 shadow-sm ${bd}`}>
            <p className={`text-2xl font-extrabold ${tx}`}>{value}</p>
            <p className={`text-xs mt-0.5 ${sx}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden ${bd}`}>
        {loading ? (
          <div className="flex justify-center py-14">
            <I.Loader size={22} className={`animate-spin ${sx}`} />
          </div>
        ) : shown.length === 0 ? (
          <div className="py-14 text-center">
            <I.Bookmark size={28} className={`mx-auto mb-3 ${sx}`} />
            <p className={`text-sm font-semibold ${tx}`}>Aucune recherche sauvegardée</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className={`text-[11px] font-bold uppercase tracking-wider border-b ${dark ? 'border-white/10 text-white/40' : 'border-slate-100 text-slate-400'}`}>
                <th className="text-left px-5 py-3">Ville</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Quartier</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Prix max</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Créé le</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {shown.map((a, i) => (
                  <motion.tr key={a.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={`border-b last:border-0 ${dark ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <I.MapPin size={13} className="text-orange-500 shrink-0" />
                        <p className={`text-sm font-semibold ${tx}`}>{a.city ?? '—'}</p>
                      </div>
                    </td>
                    <td className={`px-4 py-3.5 text-xs ${sx} hidden md:table-cell`}>{a.district ?? '—'}</td>
                    <td className="px-4 py-3.5">
                      {a.property_type ? (
                        <span className="text-[11px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                          {a.property_type}
                        </span>
                      ) : <span className={sx}>—</span>}
                    </td>
                    <td className={`px-4 py-3.5 text-sm font-bold ${tx} hidden sm:table-cell`}>{fmtPrice(a.max_price)}</td>
                    <td className={`px-4 py-3.5 text-xs ${sx} hidden lg:table-cell`}>{fmtDate(a.created_at)}</td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => handleDelete(a.id)} disabled={deleting === a.id}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition disabled:opacity-40 ${dark ? 'hover:bg-rose-500/20 text-white/40' : 'hover:bg-rose-50 text-slate-400'}`}>
                        {deleting === a.id
                          ? <I.Loader size={13} />
                          : <I.Trash size={13} />}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
        {shown.length > 0 && (
          <div className={`px-5 py-3 text-xs ${sx} border-t ${dark ? 'border-white/10' : 'border-slate-100'}`}>
            {shown.length} résultat{shown.length > 1 ? 's' : ''} sur {alerts.length}
          </div>
        )}
      </div>
    </div>
  )
}
