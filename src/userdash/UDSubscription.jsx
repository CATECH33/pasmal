import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { I, Badge } from '../lib/ui.jsx'

const PLANS = [
  {
    id: 'free', name: 'Gratuit', price: '0', period: '/mois', current: false,
    features: ['3 alertes max', '5 favoris max', 'Notifications hebdo', 'Accès basique'],
    cta: 'Rétrograder',
  },
  {
    id: 'pro', name: 'Pro', price: '29', period: '/mois', current: true,
    features: ['Alertes illimitées', '50 favoris', 'Notifications en temps réel', 'Insights IA basiques', 'Support prioritaire'],
    cta: 'Plan actuel',
    highlight: true,
  },
  {
    id: 'premium', name: 'Premium', price: '79', period: '/mois', current: false,
    features: ['Tout Pro inclus', 'Favoris illimités', 'IA avancée + prédictions', 'Alertes personnalisées', 'Accès API', 'Gestionnaire dédié'],
    cta: 'Passer Premium',
  },
]

const HISTORY = [
  { date: '22 mai 2026',  desc: 'Plan Pro — renouvellement',   amount: '29,00 €', status: 'Payé' },
  { date: '22 avr. 2026', desc: 'Plan Pro — renouvellement',   amount: '29,00 €', status: 'Payé' },
  { date: '22 mar. 2026', desc: 'Plan Pro — renouvellement',   amount: '29,00 €', status: 'Payé' },
  { date: '22 fév. 2026', desc: 'Plan Pro — renouvellement',   amount: '29,00 €', status: 'Payé' },
  { date: '22 jan. 2026', desc: 'Plan Pro — activation',       amount: '29,00 €', status: 'Payé' },
]

export default function UDSubscription() {
  const { dark } = useOutletContext()
  const [showCancel, setShowCancel] = useState(false)

  const txt  = dark ? 'text-white' : 'text-navy-900'
  const sub  = dark ? 'text-white/50' : 'text-slate-500'
  const card = dark ? 'bg-[#0F1A2E] border-white/10' : 'bg-white border-slate-100'

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Facturation</div>
        <h1 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${txt}`}>Abonnement</h1>
        <p className={`text-sm mt-1 ${sub}`}>Gérez votre plan, consultez vos factures et mettez à jour votre moyen de paiement.</p>
      </div>

      {/* Current plan banner */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden p-6 bg-gradient-to-br from-navy-900 to-[#162E52]">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-orange-600/20 blur-3xl"/>
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge tone="orange">Plan actuel</Badge>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
              <span className="text-emerald-400 text-xs font-semibold">Actif</span>
            </div>
            <div className="text-white text-3xl font-extrabold">Pro</div>
            <div className="text-white/60 text-sm mt-1">Prochain renouvellement le <span className="text-white font-semibold">22 juin 2026</span></div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-white text-4xl font-extrabold">29 €<span className="text-white/50 text-lg">/mois</span></div>
            <button onClick={() => {}}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full transition">
              <I.CreditCard size={14}/> Portail Stripe
            </button>
          </div>
        </div>
      </motion.div>

      {/* Plan comparison */}
      <div>
        <div className={`font-bold text-lg mb-4 ${txt}`}>Changer de plan</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`rounded-3xl border p-6 relative transition ${
                plan.highlight
                  ? 'border-orange-400 shadow-glow'
                  : `shadow-soft ${card}`
              } ${plan.highlight && !dark ? 'bg-white' : ''} ${plan.highlight && dark ? 'bg-[#0F1A2E]' : ''}`}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge tone="orange">Plan actuel</Badge>
                </div>
              )}
              <div className={`text-base font-bold mb-1 ${txt}`}>{plan.name}</div>
              <div className="mb-4">
                <span className={`text-3xl font-extrabold ${txt}`}>{plan.price} €</span>
                <span className={`text-sm ${sub}`}>{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className={`flex items-center gap-2 text-sm ${sub}`}>
                    <I.Check size={14} className="text-emerald-500 shrink-0"/>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.current}
                className={`w-full h-10 rounded-2xl text-sm font-semibold transition ${
                  plan.current
                    ? dark ? 'bg-white/10 text-white/40 cursor-default' : 'bg-slate-100 text-slate-400 cursor-default'
                    : plan.highlight
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-navy-900 hover:bg-navy-700 text-white'
                }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Billing history */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className={`rounded-3xl border shadow-soft overflow-hidden ${card}`}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: dark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }}>
          <div className={`font-bold ${txt}`}>Historique de facturation</div>
          <button className={`flex items-center gap-1.5 text-sm font-semibold text-orange-500 hover:text-orange-600 transition`}>
            <I.Download size={14}/> Tout télécharger
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className={dark ? 'border-b border-white/5' : 'border-b border-slate-50'}>
              {['Date', 'Description', 'Montant', 'Statut', ''].map(h => (
                <th key={h} className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((row, i) => (
              <tr key={i} className={`border-b last:border-0 transition ${
                dark ? 'border-white/5 hover:bg-white/5' : 'border-slate-50 hover:bg-slate-50'
              }`}>
                <td className={`px-6 py-4 ${sub}`}>{row.date}</td>
                <td className={`px-6 py-4 font-medium ${txt}`}>{row.desc}</td>
                <td className={`px-6 py-4 font-bold ${txt}`}>{row.amount}</td>
                <td className="px-6 py-4">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    dark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
                  }`}>{row.status}</span>
                </td>
                <td className="px-6 py-4">
                  <button className={`flex items-center gap-1 text-xs font-medium ${dark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-navy-900'} transition`}>
                    <I.Download size={13}/> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Cancel zone */}
      <div className={`rounded-3xl border p-6 shadow-soft ${dark ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50/50 border-rose-100'}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-rose-600 font-bold mb-0.5">Zone de danger</div>
            <div className={`text-sm ${sub}`}>L'annulation prend effet à la fin de la période en cours (22 juin 2026).</div>
          </div>
          <button onClick={() => setShowCancel(true)}
            className="h-9 px-4 rounded-full border border-rose-300 text-rose-600 text-sm font-semibold hover:bg-rose-600 hover:text-white transition">
            Résilier l'abonnement
          </button>
        </div>
      </div>

      {/* Cancel modal */}
      <AnimatePresence>
        {showCancel && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCancel(false)}
              className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50"/>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto rounded-3xl p-8 z-50 shadow-cardHover ${
                dark ? 'bg-[#0F1A2E]' : 'bg-white'
              }`}>
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <I.Alert size={24}/>
              </div>
              <h2 className={`text-xl font-extrabold text-center mb-2 ${txt}`}>Résilier le plan Pro ?</h2>
              <p className={`text-sm text-center mb-6 ${sub}`}>
                Vous perdrez l'accès aux alertes illimitées, aux insights IA et aux notifications temps réel dès le 22 juin 2026.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowCancel(false)}
                  className={`flex-1 h-11 rounded-2xl text-sm font-semibold transition ${
                    dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-navy-900'
                  }`}>Conserver mon plan</button>
                <button onClick={() => setShowCancel(false)}
                  className="flex-1 h-11 rounded-2xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white transition">
                  Confirmer la résiliation
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
