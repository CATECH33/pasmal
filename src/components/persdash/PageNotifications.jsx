import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const INIT = [
  { id:1, type:'match',  text:'3 nouvelles annonces correspondent à votre alerte "Paris 3e"', time:'Il y a 10 min', read:false, dot:'bg-orange-500' },
  { id:2, type:'price',  text:'Baisse de prix : Loft Bastille 2P → 2 400 €/mois (−15 000 €)', time:'Il y a 3 h',   read:false, dot:'bg-sky-500'    },
  { id:3, type:'update', text:'Votre favori "Villa Neuilly" a été mis à jour par l\'agence',   time:'Hier',         read:false, dot:'bg-emerald-500'},
  { id:4, type:'match',  text:'9 nouvelles annonces : Location Paris 11e ≤ 2 500 €/mois',     time:'Il y a 1 j',   read:true,  dot:'bg-orange-500' },
  { id:5, type:'system', text:'Bienvenue sur PASMAL ! Complétez votre profil pour de meilleures suggestions.', time:'Il y a 3 j', read:true, dot:'bg-slate-400' },
]

const TYPE_ICON = {
  match:  I.Bell,
  price:  I.TrendingDown,
  update: I.Edit,
  system: I.Check,
}

export default function PageNotifications({ dark }) {
  const [items, setItems] = useState(INIT)
  const markAll = () => setItems(p => p.map(n => ({ ...n, read: true })))
  const markRead = (id) => setItems(p => p.map(n => n.id === id ? { ...n, read: true } : n))
  const unread = items.filter(n => !n.read).length
  const tx = dark ? 'text-white'    : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'

  return (
    <div className="p-6 space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <p className={`text-sm ${sx}`}>{unread} non lue(s)</p>
        {unread > 0 && (
          <button onClick={markAll} className="text-xs font-bold text-orange-500 hover:text-orange-600 transition">
            Tout marquer comme lu
          </button>
        )}
      </div>

      <div className={`rounded-2xl border shadow-sm overflow-hidden ${bd}`}>
        <AnimatePresence>
          {items.map((n, i) => {
            const Icon = TYPE_ICON[n.type] ?? I.Bell
            return (
              <motion.div key={n.id} layout
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => markRead(n.id)}
                className={`flex gap-4 px-5 py-4 border-b last:border-0 cursor-pointer transition ${
                  !n.read
                    ? dark ? 'bg-orange-500/5 border-white/5' : 'bg-orange-50/60 border-orange-100'
                    : dark ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'
                }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  !n.read ? 'bg-orange-100' : dark ? 'bg-white/10' : 'bg-slate-100'
                }`}>
                  <Icon size={15} className={!n.read ? 'text-orange-500' : dark ? 'text-white/40' : 'text-slate-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug ${!n.read ? (dark ? 'text-white font-semibold' : 'text-navy-900 font-semibold') : sx}`}>{n.text}</p>
                  <p className={`text-[11px] mt-1 ${sx}`}>{n.time}</p>
                </div>
                {!n.read && <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.dot}`} />}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
