import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const PLANS = [
  {
    id: 'free',
    name: 'Gratuit',
    price: '0',
    period: '',
    Icon: I.User,
    color: 'slate',
    features: [
      'Jusqu\'à 5 favoris',
      '1 alerte de recherche',
      'Notifications par e-mail',
      'Accès aux annonces standard',
    ],
    missing: [
      'Alertes instantanées',
      'Recherches illimitées',
      'Contact direct agences',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '9',
    period: '/mois',
    Icon: I.Star,
    color: 'orange',
    badge: 'Recommandé',
    features: [
      'Favoris illimités',
      'Alertes illimitées',
      'Notifications instantanées',
      'Annonces en avant-première',
      'Contact direct agences',
      'Historique des prix',
    ],
    missing: [],
  },
]

const INVOICES = [
  { date: '01/05/2026', amount: '9,00 €', status: 'Payé' },
  { date: '01/04/2026', amount: '9,00 €', status: 'Payé' },
  { date: '01/03/2026', amount: '9,00 €', status: 'Payé' },
]

export default function PageAbonnement({ dark }) {
  const [current] = useState('free')
  const [selected, setSelected] = useState('premium')
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANS.map((plan, i) => {
          const isSelected = selected === plan.id
          const isCurrent = current === plan.id
          return (
            <motion.div key={plan.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelected(plan.id)}
              className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all shadow-sm ${
                isSelected
                  ? plan.color === 'orange'
                    ? 'border-orange-500 bg-orange-500/5'
                    : dark ? 'border-white/30 bg-white/5' : 'border-slate-400 bg-slate-50'
                  : dark ? 'border-white/10 bg-[#1f2937]' : 'border-slate-200 bg-white'
              }`}>
              {plan.badge && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-orange-500 text-white px-3 py-0.5 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.color === 'orange' ? 'bg-orange-100' : dark ? 'bg-white/10' : 'bg-slate-100'
                }`}>
                  <plan.Icon size={17} className={plan.color === 'orange' ? 'text-orange-500' : dark ? 'text-white/60' : 'text-slate-500'} />
                </div>
                <div>
                  <p className={`text-sm font-extrabold ${tx}`}>{plan.name}</p>
                  {isCurrent && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Plan actuel</span>
                  )}
                </div>
                <div className="ml-auto text-right">
                  <span className={`text-2xl font-extrabold ${tx}`}>{plan.price}€</span>
                  <span className={`text-xs ${sx}`}>{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-1.5">
                {plan.features.map((f, j) => (
                  <li key={j} className={`flex items-center gap-2 text-xs ${tx}`}>
                    <I.Check size={12} className="text-emerald-500 shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.missing.map((f, j) => (
                  <li key={j} className={`flex items-center gap-2 text-xs ${sx} line-through`}>
                    <I.X size={12} className="shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>

      {selected !== current && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <button className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition shadow">
            {selected === 'premium' ? 'Passer à Premium — 9€/mois' : 'Repasser en Gratuit'}
          </button>
        </motion.div>
      )}

      {current === 'premium' && (
        <div className={`rounded-2xl border shadow-sm overflow-hidden ${bd}`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? 'border-white/10' : 'border-slate-100'}`}>
            <p className={`text-sm font-extrabold ${tx}`}>Historique de facturation</p>
          </div>
          <div className="divide-y" style={{ borderColor: dark ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}>
            {INVOICES.map((inv, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <I.FileText size={14} className={sx} />
                <p className={`flex-1 text-sm ${tx}`}>{inv.date}</p>
                <p className={`text-sm font-semibold ${tx}`}>{inv.amount}</p>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">{inv.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
