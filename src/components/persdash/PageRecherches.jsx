import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const INIT = [
  { id:1, label:'Appartements Paris 3e',     params:'Vente · 2–4p · ≤ 900k€ · 50–100m²', results:24, time:'Il y a 2 h'  },
  { id:2, label:'Locations 11e arrondissement',params:'Location · 1–3p · ≤ 2 500€/mois',  results:11, time:'Hier'        },
  { id:3, label:'Villas Île-de-France',       params:'Vente · ≥ 5p · ≤ 2M€ · Jardin',     results:7,  time:'Il y a 3 j' },
]

export default function PageRecherches({ dark }) {
  const [items, setItems] = useState(INIT)
  const tx = dark ? 'text-white'    : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'

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
                <p className={`text-xs mt-0.5 ${sx} truncate`}>{s.params}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full">{s.results} résultats</span>
                  <span className={`text-[11px] ${sx}`}>{s.time}</span>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button className={`flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-bold transition ${
                  dark ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                }`}>
                  <I.Search size={12}/> Relancer
                </button>
                <button onClick={() => setItems(p => p.filter(i => i.id !== s.id))}
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
