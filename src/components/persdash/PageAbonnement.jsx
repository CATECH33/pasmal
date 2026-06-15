import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { I } from '../../lib/ui.jsx'
import { useAuth } from '../../features/auth/providers/AuthProvider.jsx'
import { startCheckout } from '../../features/subscription/checkoutService.js'
import { getSubscriptionStatus } from '../../features/subscription/subscriptionService.js'

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
    stripePrice: 'premium_alerts',
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

export default function PageAbonnement({ dark }) {
  const { user, profile } = useAuth()
  const [current, setCurrent] = useState('free')
  const [selected, setSelected] = useState('premium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    if (profile?.premium_alerts) {
      setCurrent('premium')
      setSelected('premium')
      return
    }
    getSubscriptionStatus(user.id)
      .then(sub => {
        if (sub) { setCurrent('premium'); setSelected('premium') }
      })
      .catch(() => {})
  }, [user, profile])

  const handleSubscribe = async () => {
    if (!user) return
    const plan = PLANS.find(p => p.id === selected)
    if (!plan?.stripePrice) return

    setLoading(true)
    setError('')
    try {
      await startCheckout(plan.stripePrice, {
        successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}&type=${plan.stripePrice}`,
        cancelUrl: window.location.href,
      })
    } catch (err) {
      setError(err.message || 'Erreur lors du paiement.')
      setLoading(false)
    }
  }

  const tx = dark ? 'text-white' : 'text-[#0F172A]'
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
              onClick={() => !loading && setSelected(plan.id)}
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

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      {selected !== current && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className={`w-full h-11 rounded-xl text-white text-sm font-bold transition shadow flex items-center justify-center gap-2 ${
              loading ? 'bg-orange-400 cursor-wait' : 'bg-orange-500 hover:bg-orange-600'
            }`}>
            {loading ? (
              <><I.Loader size={15} /> Redirection vers Stripe...</>
            ) : selected === 'premium' ? (
              'Passer à Premium — 9€/mois'
            ) : (
              'Repasser en Gratuit'
            )}
          </button>
        </motion.div>
      )}

      {current === 'premium' && (
        <div className={`rounded-2xl border shadow-sm overflow-hidden ${bd}`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? 'border-white/10' : 'border-slate-100'}`}>
            <p className={`text-sm font-extrabold ${tx}`}>Votre abonnement</p>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full uppercase">Actif</span>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${tx}`}>Plan Premium</span>
              <span className={`text-sm font-bold ${tx}`}>9,00 €/mois</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${sx}`}>Prochain renouvellement</span>
              <span className={`text-xs ${sx}`}>{new Date(Date.now() + 30 * 86400000).toLocaleDateString('fr-FR')}</span>
            </div>
            <p className={`text-[11px] ${sx}`}>
              Gérez votre abonnement et vos moyens de paiement depuis le portail Stripe.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
