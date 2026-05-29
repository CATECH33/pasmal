import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'
const INIT_ALERTS = [
  { id:1, label:'Appartement · Paris 3e–4e', criteria:'Vente · 2–4 pièces · ≤ 900 000 €', active:true,  new:3, freq:'Immédiat' },
  { id:2, label:'Location Paris 11e',        criteria:'Location · 1–2 pièces · ≤ 2 500 €/mois', active:true, new:9, freq:'Quotidien' },
  { id:3, label:'Villa Île-de-France',       criteria:'Vente · ≥ 5 pièces · ≤ 2 000 000 €', active:false, new:0, freq:'Hebdo' },
]

export default function PageAlertes({ dark }) {
  const [alerts, setAlerts] = useState(INIT_ALERTS)
  const toggle = (id) => setAlerts(p => p.map(a => a.id === id ? { ...a, active: !a.active } : a))
  const remove = (id) => setAlerts(p => p.filter(a => a.id !== id))
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white'    : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'

  return (
    <div className="p-6 space-y-5 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <p className={`text-sm ${sx}`}>{alerts.filter(a => a.active).length} alerte(s) active(s)</p>
        <button className="flex items-center gap-2 h-9 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition">
          <I.Plus size={13}/> Nouvelle alerte
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map(a => (
            <motion.div key={a.id} layout
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
              className={`rounded-2xl border p-4 shadow-sm ${bd}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  a.active ? 'bg-orange-100' : dark ? 'bg-white/10' : 'bg-slate-100'
                }`}>
                  <I.Bell size={17} className={a.active ? 'text-orange-500' : sx} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-extrabold ${tx}`}>{a.label}</p>
                    {a.new > 0 && a.active && (
                      <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">{a.new} nouveaux</span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${sx}`}>{a.criteria}</p>
                  <p className={`text-[11px] mt-1 ${sx}`}>Fréquence : {a.freq}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <div className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${a.active ? 'bg-orange-500' : dark ? 'bg-white/20' : 'bg-slate-200'}`}
                    onClick={() => toggle(a.id)}>
                    <motion.div animate={{ x: a.active ? 20 : 2 }} transition={{ type:'spring', stiffness:500, damping:30 }}
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
                  </div>
                  <button onClick={() => remove(a.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                      dark ? 'hover:bg-rose-500/20 text-white/30' : 'hover:bg-rose-50 text-slate-300'
                    }`}><I.Trash size={13}/></button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {alerts.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16">
          <I.Bell size={32} className="text-slate-300" />
          <p className={`text-sm font-semibold ${sx}`}>Aucune alerte configurée</p>
          <p className={`text-xs ${sx}`}>Créez une alerte pour être notifié des nouvelles annonces</p>
        </div>
      )}
    </div>
  )
}
