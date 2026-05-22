import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../lib/ui.jsx'

const NOTIFS = [
  { id: 1,  type: 'match',  read: false, title: 'Nouvelle correspondance',    body: '3 annonces correspondent à "Paris 11e — 2 pièces"',          time: 'Il y a 4 min',  icon: I.Bell },
  { id: 2,  type: 'price',  read: false, title: 'Baisse de prix',             body: 'T3 Lyon Foch — 1 250 000 € → 1 180 000 € (−70 000 €)',       time: 'Il y a 22 min', icon: I.TrendingDown },
  { id: 3,  type: 'match',  read: false, title: 'Nouvelle correspondance',    body: '1 annonce correspond à "Investissement locatif Nantes"',      time: 'Il y a 1h',    icon: I.Bell },
  { id: 4,  type: 'system', read: false, title: 'Profil vérifié',             body: 'Votre identité a été vérifiée avec succès (KYC)',             time: 'Il y a 3h',    icon: I.BadgeCheck },
  { id: 5,  type: 'price',  read: true,  title: 'Baisse de prix',             body: 'Studio Bastille — 315 000 € → 295 000 € (−20 000 €)',        time: 'Hier, 18h',    icon: I.TrendingDown },
  { id: 6,  type: 'fav',   read: true,  title: 'Annonce expirée',             body: 'Un bien de vos favoris a été retiré de la vente',            time: 'Hier, 14h',    icon: I.Heart },
  { id: 7,  type: 'system', read: true,  title: 'Abonnement renouvelé',       body: 'Votre plan Pro a été renouvelé — 29 € prélevés',             time: 'Il y a 2j',    icon: I.CreditCard },
  { id: 8,  type: 'match',  read: true,  title: 'Nouvelle correspondance',    body: '5 annonces correspondent à "Bordeaux — Maison jardin"',      time: 'Il y a 3j',    icon: I.Bell },
]

const TYPE_CONFIG = {
  match:  { label: 'Correspondance', bg: 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400'  },
  price:  { label: 'Baisse de prix', bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' },
  fav:    { label: 'Favoris',        bg: 'bg-rose-50 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'          },
  system: { label: 'Système',        bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'  },
}

const FILTERS = [
  { key: 'all',    label: 'Toutes' },
  { key: 'unread', label: 'Non lues' },
  { key: 'match',  label: 'Correspondances' },
  { key: 'price',  label: 'Baisses de prix' },
  { key: 'system', label: 'Système' },
]

export default function UDNotifications() {
  const { dark } = useOutletContext()
  const [notifs, setNotifs] = useState(NOTIFS)
  const [filter, setFilter] = useState('all')

  const txt  = dark ? 'text-white' : 'text-navy-900'
  const sub  = dark ? 'text-white/50' : 'text-slate-500'
  const card = dark ? 'bg-[#0F1A2E] border-white/10' : 'bg-white border-slate-100'

  const markRead  = (id) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  const markAll   = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })))
  const deleteN   = (id) => setNotifs(ns => ns.filter(n => n.id !== id))

  const unread = notifs.filter(n => !n.read).length

  const visible = notifs.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'all') return true
    return n.type === filter
  })

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Centre de notifications</div>
          <h1 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${txt}`}>
            Notifications
            {unread > 0 && (
              <span className="ml-3 inline-flex items-center justify-center bg-orange-600 text-white text-sm font-bold rounded-full px-2.5 py-0.5">
                {unread}
              </span>
            )}
          </h1>
          <p className={`text-sm mt-1 ${sub}`}>{unread > 0 ? `${unread} non lue${unread > 1 ? 's' : ''}` : 'Tout est à jour'}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll}
            className={`text-sm font-semibold transition ${dark ? 'text-white/60 hover:text-white' : 'text-slate-500 hover:text-navy-900'}`}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filters */}
      <div className={`flex gap-1.5 flex-wrap p-1 rounded-2xl border w-fit shadow-soft ${card}`}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${
              filter === f.key
                ? 'bg-navy-900 text-white shadow-soft'
                : dark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-slate-600 hover:bg-slate-100'
            }`}>
            {f.label}
            {f.key === 'unread' && unread > 0 && (
              <span className="ml-1.5 bg-orange-600 text-white text-[10px] font-bold rounded-full px-1.5">{unread}</span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className={`rounded-3xl border shadow-soft overflow-hidden ${card}`}>
        <AnimatePresence>
          {visible.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto mb-3">
                <I.Bell size={22}/>
              </div>
              <div className={`font-bold ${txt}`}>Aucune notification</div>
              <div className={`text-sm mt-1 ${sub}`}>Revenez plus tard !</div>
            </div>
          )}
          {visible.map((n, i) => {
            const Icon = n.icon
            const cfg  = TYPE_CONFIG[n.type]
            return (
              <motion.div key={n.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className={`flex items-start gap-4 px-6 py-4 border-b last:border-0 transition-colors cursor-default
                  ${dark ? 'border-white/5' : 'border-slate-100'}
                  ${!n.read ? (dark ? 'bg-orange-500/5' : 'bg-orange-50/40') : ''}
                  hover:${dark ? 'bg-white/5' : 'bg-slate-50'}
                `}>
                {/* Unread dot */}
                <div className="mt-4 shrink-0">
                  {!n.read
                    ? <span className="w-2 h-2 rounded-full bg-orange-500 block"/>
                    : <span className="w-2 h-2 rounded-full block"/>
                  }
                </div>
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}>
                  <Icon size={16}/>
                </div>
                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className={`text-sm font-semibold ${txt}`}>{n.title}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.bg}`}>{cfg.label}</span>
                  </div>
                  <p className={`text-sm ${sub} line-clamp-2`}>{n.body}</p>
                  <div className={`text-xs mt-1 ${dark ? 'text-white/30' : 'text-slate-400'}`}>{n.time}</div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0 mt-1">
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} title="Marquer comme lu"
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${dark ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-slate-100 text-slate-400'}`}>
                      <I.Check size={14}/>
                    </button>
                  )}
                  <button onClick={() => deleteN(n.id)} title="Supprimer"
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${dark ? 'hover:bg-rose-500/20 text-white/30 hover:text-rose-400' : 'hover:bg-rose-50 text-slate-300 hover:text-rose-500'}`}>
                    <I.X size={14}/>
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
