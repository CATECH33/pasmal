import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'
import { useAuth } from '../../features/auth/providers/AuthProvider.jsx'
import { supabase } from '../../lib/supabase.js'

const BADGE_COLOR = { orange: 'bg-orange-500 text-white', sky: 'bg-sky-500 text-white' }

const FALLBACK = [
  { id:'f1', listing_id:'f1', listing_title:'App. Marais 3P',   listing_location:'Paris 3e',  listing_price:'850 000 €',   listing_type:'acheter', listing_rooms:3, listing_surface:72,  listing_image:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=240&fit=crop' },
  { id:'f2', listing_id:'f2', listing_title:'Loft Bastille 2P', listing_location:'Paris 11e', listing_price:'2 400 €/mois', listing_type:'louer',   listing_rooms:2, listing_surface:58,  listing_image:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=240&fit=crop' },
  { id:'f3', listing_id:'f3', listing_title:'Villa Neuilly 5P', listing_location:'Neuilly',   listing_price:'2 100 000 €', listing_type:'acheter', listing_rooms:5, listing_surface:210, listing_image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=240&fit=crop' },
]

export default function PageFavoris({ dark }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Tous')

  useEffect(() => {
    if (!user) { setItems(FALLBACK); setLoading(false); return }
    supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error || !data?.length) {
          setItems(FALLBACK)
        } else {
          setItems(data)
        }
        setLoading(false)
      })
  }, [user])

  const removeFav = async (id) => {
    setItems(p => p.filter(i => i.id !== id))
    if (user) {
      await supabase.from('favorites').delete().eq('id', id).eq('user_id', user.id)
    }
  }

  const typeOf = (item) => item.listing_type === 'louer' ? 'Location' : 'Vente'
  const shown = filter === 'Tous' ? items : items.filter(i => typeOf(i) === filter)

  const tx = dark ? 'text-white'    : 'text-[#0F172A]'
  const sx = dark ? 'text-white/50' : 'text-slate-400'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <I.Loader size={24} className="text-orange-500" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        {['Tous', 'Vente', 'Location'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${
              filter === f ? 'bg-orange-500 text-white' : dark ? 'bg-white/10 text-white/60 hover:bg-white/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}>{f} ({f === 'Tous' ? items.length : items.filter(i => typeOf(i) === f).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {shown.map(l => (
            <motion.div key={l.id}
              layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className={`rounded-2xl border overflow-hidden shadow-sm group cursor-pointer ${
                dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
              }`}>
              <div className="relative overflow-hidden">
                <img src={l.listing_image || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=240&fit=crop'}
                  alt={l.listing_title}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=240&fit=crop' }}
                />
                <button
                  onClick={e => { e.stopPropagation(); removeFav(l.id) }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-50 flex items-center justify-center shadow transition">
                  <I.Heart size={14} className="text-rose-500" fill="currentColor" />
                </button>
              </div>
              <div className="p-4">
                <p className={`font-extrabold text-sm ${tx}`}>{l.listing_title}</p>
                <p className={`text-xs mt-0.5 ${sx}`}>{l.listing_location}</p>
                <div className={`flex items-center gap-3 mt-2 text-xs ${sx}`}>
                  {l.listing_rooms && <span className="flex items-center gap-1"><I.Bed size={12}/> {l.listing_rooms} p.</span>}
                  {l.listing_surface && <span className="flex items-center gap-1"><I.Maximize size={12}/> {l.listing_surface} m²</span>}
                </div>
                <p className={`text-base font-extrabold mt-2 ${tx}`}>{l.listing_price}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {shown.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16">
          <I.Heart size={32} className="text-slate-300" />
          <p className={`text-sm font-semibold ${sx}`}>Aucun favori dans cette catégorie</p>
        </div>
      )}
    </div>
  )
}
