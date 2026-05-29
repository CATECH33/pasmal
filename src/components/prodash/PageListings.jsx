import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const LISTINGS = [
  { id:1, title:'Appartement Marais 3P',   city:'Paris 3e',  price:'850 000 €',  type:'Vente',    status:'Actif',    views:312, img:'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=80&h=60&fit=crop' },
  { id:2, title:'Villa Neuilly 5P',         city:'Neuilly',   price:'2 100 000 €',type:'Vente',    status:'Actif',    views:189, img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=80&h=60&fit=crop' },
  { id:3, title:'Loft Bastille 2P',         city:'Paris 11e', price:'2 400 €/mois',type:'Location', status:'Loué',    views:445, img:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=80&h=60&fit=crop' },
  { id:4, title:'Studio Nation',            city:'Paris 11e', price:'1 200 €/mois',type:'Location', status:'En attente',views:67,img:'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=80&h=60&fit=crop' },
  { id:5, title:'T4 Boulogne',              city:'Boulogne',  price:'620 000 €',  type:'Vente',    status:'Vendu',    views:523, img:'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=80&h=60&fit=crop' },
]

const STATUS_STYLE = {
  'Actif':       'bg-emerald-100 text-emerald-700',
  'Loué':        'bg-sky-100 text-sky-700',
  'Vendu':       'bg-slate-100 text-slate-500',
  'En attente':  'bg-amber-100 text-amber-700',
}

export default function PageListings({ dark }) {
  const [filter, setFilter] = useState('Tous')
  const filters = ['Tous', 'Actif', 'Loué', 'Vendu', 'En attente']
  const shown = filter === 'Tous' ? LISTINGS : LISTINGS.filter(l => l.status === filter)
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition ${
                filter === f ? 'bg-orange-500 text-white' : dark ? 'bg-white/10 text-white/60 hover:bg-white/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}>{f}</button>
          ))}
        </div>
        <button className="flex items-center gap-2 h-9 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition">
          <I.Plus size={13} /> Nouvelle annonce
        </button>
      </div>

      <div className={`rounded-2xl border shadow-sm overflow-hidden ${bd}`}>
        <table className="w-full">
          <thead>
            <tr className={`text-[11px] font-bold uppercase tracking-wider border-b ${dark ? 'border-white/10 text-white/40' : 'border-slate-100 text-slate-400'}`}>
              <th className="text-left px-5 py-3">Annonce</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3">Prix</th>
              <th className="text-left px-4 py-3 hidden sm:table-cell">Vues</th>
              <th className="text-left px-4 py-3">Statut</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {shown.map((l, i) => (
                <motion.tr key={l.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`border-b last:border-0 ${dark ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'} transition`}>
                  <td className="px-5 py-3.5 flex items-center gap-3">
                    <img src={l.img} alt="" className="w-12 h-9 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold ${tx} truncate`}>{l.title}</p>
                      <p className={`text-xs ${sx}`}>{l.city}</p>
                    </div>
                  </td>
                  <td className={`px-4 py-3.5 text-xs ${sx} hidden md:table-cell`}>{l.type}</td>
                  <td className={`px-4 py-3.5 text-sm font-bold ${tx}`}>{l.price}</td>
                  <td className={`px-4 py-3.5 text-sm ${sx} hidden sm:table-cell`}>{l.views}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[l.status]}`}>{l.status}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <button className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${dark ? 'hover:bg-white/10 text-white/40' : 'hover:bg-slate-100 text-slate-400'}`}><I.Edit size={13} /></button>
                      <button className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${dark ? 'hover:bg-rose-500/20 text-white/40' : 'hover:bg-rose-50 text-slate-400'}`}><I.Trash size={13} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}
