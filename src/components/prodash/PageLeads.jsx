import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const LEADS = [
  { id:1, name:'Sophie Martin',   phone:'+33 6 11 22 33 44', prop:'App. Marais 3P',   budget:'850k€',  status:'Nouveau',   time:'5 min',  note:'Cherche à acheter d\'ici 2 mois. Préfère le 3e ou 4e arr.' },
  { id:2, name:'Thomas Bernard',  phone:'+33 6 55 66 77 88', prop:'Villa Neuilly 5P',  budget:'2M€',    status:'Contacté',  time:'2 h',    note:'Famille de 4, jardin indispensable. Déjà propriétaire.' },
  { id:3, name:'Claire Dubois',   phone:'+33 6 99 00 11 22', prop:'Loft Bastille 2P',  budget:'2 500€/m',status:'En cours', time:'Hier',   note:'Étudiante en master, bail étudiant souhaité.' },
  { id:4, name:'Marc Leroy',      phone:'+33 6 44 55 66 77', prop:'Studio Nation',     budget:'1 300€/m',status:'Converti', time:'3 j',    note:'Signé ! Remise des clés le 15/06.' },
  { id:5, name:'Julie Moreau',    phone:'+33 6 88 99 00 11', prop:'T4 Boulogne',       budget:'650k€',  status:'Nouveau',   time:'30 min', note:'Première visite prévue samedi.' },
]

const STATUS_STYLE = {
  'Nouveau':   'bg-orange-100 text-orange-700',
  'Contacté':  'bg-sky-100 text-sky-700',
  'En cours':  'bg-amber-100 text-amber-700',
  'Converti':  'bg-emerald-100 text-emerald-700',
}

export default function PageLeads({ dark }) {
  const [selected, setSelected] = useState(null)
  const lead = LEADS.find(l => l.id === selected)
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex gap-4">
        {/* Lead list */}
        <div className="flex-1 space-y-3">
          {LEADS.map(l => (
            <motion.button key={l.id} onClick={() => setSelected(l.id === selected ? null : l.id)}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className={`w-full rounded-2xl border p-4 text-left transition-all shadow-sm ${
                selected === l.id
                  ? 'border-orange-400 ' + (dark ? 'bg-orange-500/10' : 'bg-orange-50')
                  : bd
              }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {l.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${tx} truncate`}>{l.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${STATUS_STYLE[l.status]}`}>{l.status}</span>
                  </div>
                  <p className={`text-xs ${sx} truncate`}>{l.prop} · {l.budget}</p>
                </div>
                <p className={`text-[11px] ${sx} shrink-0`}>{l.time}</p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail panel */}
        <AnimatePresence>
          {lead && (
            <motion.div key={lead.id}
              initial={{ opacity: 0, x: 20, width: 0 }} animate={{ opacity: 1, x: 0, width: 280 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              className={`rounded-2xl border shadow-sm overflow-hidden shrink-0 ${bd}`}>
              <div className={`px-5 py-4 border-b flex items-center justify-between ${dark ? 'border-white/10' : 'border-slate-100'}`}>
                <p className={`text-sm font-extrabold ${tx}`}>Détail</p>
                <button onClick={() => setSelected(null)} className={`w-6 h-6 rounded-full flex items-center justify-center ${dark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-slate-100 text-slate-400'}`}>
                  <I.X size={12} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex flex-col items-center gap-2 pb-4 border-b" style={{ borderColor: dark ? 'rgba(255,255,255,0.1)' : '#f1f5f9' }}>
                  <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-extrabold">
                    {lead.name[0]}
                  </div>
                  <p className={`font-extrabold ${tx}`}>{lead.name}</p>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[lead.status]}`}>{lead.status}</span>
                </div>
                {[
                  { label: 'Annonce', val: lead.prop },
                  { label: 'Budget', val: lead.budget },
                  { label: 'Téléphone', val: lead.phone },
                  { label: 'Contact', val: 'Il y a ' + lead.time },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${sx}`}>{label}</p>
                    <p className={`text-sm font-semibold mt-0.5 ${tx}`}>{val}</p>
                  </div>
                ))}
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${sx}`}>Note</p>
                  <p className={`text-xs leading-relaxed ${dark ? 'text-white/70' : 'text-slate-600'}`}>{lead.note}</p>
                </div>
                <button className="w-full h-9 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center justify-center gap-2">
                  <I.Phone size={13} /> Appeler
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
