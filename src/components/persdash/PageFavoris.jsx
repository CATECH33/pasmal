import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const FAVORIS = [
  { id:1, title:'App. Marais 3P',   city:'Paris 3e',  price:'850 000 €',   type:'Vente',    rooms:3, area:72,  img:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=240&fit=crop', badge:'Nouveau prix', badgeColor:'orange' },
  { id:2, title:'Loft Bastille 2P', city:'Paris 11e', price:'2 400 €/mois', type:'Location', rooms:2, area:58,  img:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=240&fit=crop', badge:null,           badgeColor:null     },
  { id:3, title:'Villa Neuilly 5P', city:'Neuilly',   price:'2 100 000 €', type:'Vente',    rooms:5, area:210, img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=240&fit=crop', badge:'Exclusivité',  badgeColor:'sky'    },
  { id:4, title:'Studio Nation',    city:'Paris 11e', price:'1 200 €/mois', type:'Location', rooms:1, area:28,  img:'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=240&fit=crop', badge:null,           badgeColor:null     },
]

const BADGE_COLOR = { orange: 'bg-orange-500 text-white', sky: 'bg-sky-500 text-white' }

export default function PageFavoris({ dark }) {
  const [items, setItems] = useState(FAVORIS)
  const [filter, setFilter] = useState('Tous')
  const shown = filter === 'Tous' ? items : items.filter(i => i.type === filter)
  const tx = dark ? 'text-white'    : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center gap-2">
        {['Tous', 'Vente', 'Location'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${
              filter === f ? 'bg-orange-500 text-white' : dark ? 'bg-white/10 text-white/60 hover:bg-white/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}>{f} {f === 'Tous' ? `(${items.length})` : `(${items.filter(i => i.type === f).length})`}
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
                <img src={l.img} alt={l.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                {l.badge && (
                  <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${BADGE_COLOR[l.badgeColor]}`}>{l.badge}</span>
                )}
                <button
                  onClick={e => { e.stopPropagation(); setItems(p => p.filter(i => i.id !== l.id)) }}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-50 flex items-center justify-center shadow transition">
                  <I.Heart size={14} className="text-rose-500" fill="currentColor" />
                </button>
              </div>
              <div className="p-4">
                <p className={`font-extrabold text-sm ${tx}`}>{l.title}</p>
                <p className={`text-xs mt-0.5 ${sx}`}>{l.city}</p>
                <div className={`flex items-center gap-3 mt-2 text-xs ${sx}`}>
                  <span className="flex items-center gap-1"><I.Bed size={12}/> {l.rooms} p.</span>
                  <span className="flex items-center gap-1"><I.Maximize size={12}/> {l.area} m²</span>
                </div>
                <p className={`text-base font-extrabold mt-2 ${tx}`}>{l.price}</p>
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
