import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'
import { useAuth } from '../../features/auth/providers/AuthProvider.jsx'
import { supabase } from '../../lib/supabase.js'

const FALLBACK = [
  { id:'1', label:'Appartements Paris 3e',      params:{type:'Vente',rooms:'2–4p',budget:'≤ 900k€',surface:'50–100m²'}, result_count:24, updated_at: new Date(Date.now() - 7200000).toISOString() },
  { id:'2', label:'Locations 11e arrondissement', params:{type:'Location',rooms:'1–3p',budget:'≤ 2 500€/mois'},          result_count:11, updated_at: new Date(Date.now() - 86400000).toISOString() },
  { id:'3', label:'Villas Île-de-France',        params:{type:'Vente',rooms:'≥ 5p',budget:'≤ 2M€',extra:'Jardin'},       result_count:7,  updated_at: new Date(Date.now() - 86400000*3).toISOString() },
]

function formatParams(p) {
  if (!p || typeof p !== 'object') return ''
  return Object.values(p).filter(Boolean).join(' · ')
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Il y a quelques minutes'
  if (hours < 24) return `Il y a ${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Hier'
  return `Il y a ${days} j`
}

export default function PageRecherches({ dark }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setItems(FALLBACK); setLoading(false); return }
    supabase
      .from('saved_searches')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .then(({ data, error }) => {
        if (error || !data?.length) {
          setItems(FALLBACK)
        } else {
          setItems(data)
        }
        setLoading(false)
      })
  }, [user])

  const remove = async (id) => {
    setItems(p => p.filter(i => i.id !== id))
    if (user) {
      await supabase.from('saved_searches').delete().eq('id', id).eq('user_id', user.id)
    }
  }

  const tx = dark ? 'text-white'    : 'text-[#0F172A]'
  const sx = dark ? 'text-white/50' : 'text-slate-400'
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'

  if (loading) {
    return <div className="flex items-center justify-center py-20"><I.Loader size={24} className="text-orange-500" /></div>
  }

  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <p className={`text-sm ${sx}`}>{items.length} recherche(s) sauvegardée(s)</p>

      <div className="space-y-3">
        <AnimatePresence>
          {items.map(s => (
            <motion.div key={s.id} layout
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
              className={`rounded-2xl border p-4 shadow-sm flex items-center gap-4 ${bd}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                dark ? 'bg-white/10' : 'bg-slate-100'
              }`}>
                <I.Search size={17} className={dark ? 'text-white/60' : 'text-slate-500'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-extrabold ${tx} truncate`}>{s.label}</p>
                <p className={`text-xs mt-0.5 ${sx} truncate`}>{formatParams(s.params)}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">
                    {s.result_count} résultats
                  </span>
                  <span className={`text-[11px] ${sx}`}>{timeAgo(s.updated_at)}</span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button className={`flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-bold transition ${
                  dark ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                }`}>
                  <I.Search size={12}/> Relancer
                </button>
                <button onClick={() => remove(s.id)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                    dark ? 'hover:bg-rose-500/20 text-white/30' : 'hover:bg-rose-50 text-slate-300'
                  }`}><I.Trash size={13}/></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16">
          <I.Search size={32} className="text-slate-300" />
          <p className={`text-sm font-semibold ${sx}`}>Aucune recherche sauvegardée</p>
        </div>
      )}
    </div>
  )
}
