import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../../lib/ui.jsx'
import { useAuth } from '../../../features/auth/providers/AuthProvider.jsx'
import { supabase } from '../../../lib/supabase.js'

function fmtPrice(price, type) {
  if (!price) return '—'
  const base = Number(price).toLocaleString('fr-FR') + ' €'
  return type === 'location' || type === 'colocation' ? base + '/mois' : base
}

export default function AdminFavorites({ dark }) {
  const { user } = useAuth()
  const [favs,     setFavs]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [removing, setRemoving] = useState(null)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id, listing_id, created_at, listings(id, title, city, district, price, transaction_type, status, images)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setFavs((data ?? []).filter(f => f.listings))
    } catch (err) {
      console.error('[admin-favorites]', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { load() }, [load])

  const handleRemove = async (favId) => {
    setRemoving(favId)
    try {
      const { error } = await supabase.from('favorites').delete().eq('id', favId)
      if (!error) setFavs(prev => prev.filter(f => f.id !== favId))
    } catch (err) {
      console.error('[admin-favorites] remove', err)
    } finally {
      setRemoving(null)
    }
  }

  const STATUS_STYLE = {
    active:   'bg-emerald-100 text-emerald-700',
    pending:  'bg-amber-100 text-amber-700',
    inactive: 'bg-slate-100 text-slate-500',
    sold:     'bg-slate-100 text-slate-400',
    rented:   'bg-sky-100 text-sky-700',
  }
  const STATUS_LABEL = {
    active: 'Actif', pending: 'En attente', inactive: 'Inactif', sold: 'Vendu', rented: 'Loué',
  }

  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-extrabold ${tx}`}>Mes favoris</p>
          <p className={`text-xs mt-0.5 ${sx}`}>{favs.length} annonce{favs.length !== 1 ? 's' : ''} sauvegardée{favs.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <I.Loader size={24} className={`animate-spin ${sx}`} />
        </div>
      ) : favs.length === 0 ? (
        <div className={`rounded-2xl border p-14 text-center ${bd}`}>
          <I.Heart size={32} className={`mx-auto mb-3 ${sx}`} />
          <p className={`text-sm font-semibold ${tx}`}>Aucun favori</p>
          <p className={`text-xs mt-1 ${sx}`}>Vos annonces sauvegardées apparaîtront ici</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {favs.map((fav, i) => {
              const l     = fav.listings
              const thumb = l.images?.[0] ?? null
              const status = l.status ?? 'active'
              return (
                <motion.div key={fav.id}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className={`rounded-2xl border shadow-sm overflow-hidden ${bd}`}>
                  {/* Image */}
                  <div className="relative h-40">
                    {thumb
                      ? <img src={thumb} alt={l.title} className="w-full h-full object-cover" />
                      : <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-white/10' : 'bg-slate-100'}`}>
                          <I.Building size={28} className={sx} />
                        </div>}
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[status] ?? 'bg-slate-100 text-slate-500'}`}>
                        {STATUS_LABEL[status] ?? status}
                      </span>
                    </div>
                    <button onClick={() => handleRemove(fav.id)} disabled={removing === fav.id}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-rose-50 text-rose-500 transition disabled:opacity-40">
                      {removing === fav.id ? <I.Loader size={12} /> : <I.Heart size={13} fill="currentColor" />}
                    </button>
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <p className={`text-sm font-bold ${tx} truncate`}>{l.title}</p>
                    <p className={`text-xs ${sx} mt-0.5 flex items-center gap-1`}>
                      <I.MapPin size={11} />
                      {l.district ? `${l.city} · ${l.district}` : l.city}
                    </p>
                    <p className={`text-base font-extrabold mt-2 ${tx}`}>
                      {fmtPrice(l.price, l.transaction_type)}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
