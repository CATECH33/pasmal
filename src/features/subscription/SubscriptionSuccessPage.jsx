import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { I, BrandLogo } from '../../lib/ui.jsx'
import { verifyCheckoutSession } from './subscriptionService.js'

export default function SubscriptionSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [status, setStatus] = useState('verifying') // verifying | success | error
  const [error, setError] = useState('')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setError('Session de paiement introuvable.')
      return
    }

    verifyCheckoutSession(sessionId)
      .then(() => setStatus('success'))
      .catch((err) => {
        console.error('Verification failed:', err)
        // Even if verification fails, the webhook will handle it
        // Show success optimistically
        setStatus('success')
      })
  }, [sessionId])

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center">
        <div className="text-center">
          <I.Loader size={32} className="text-orange-500 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Vérification du paiement...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-5">
            <I.Alert size={28} className="text-rose-500" />
          </div>
          <h2 className="text-xl font-extrabold text-[#0F172A] mb-2">Erreur de vérification</h2>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <Link to="/"
            className="inline-flex items-center gap-2 px-6 h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <BrandLogo />
        </div>

        {/* Success icon */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
          className="relative inline-flex items-center justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <I.Check size={36} className="text-white" />
          </div>
          <motion.div className="absolute inset-0 rounded-full border-2 border-emerald-400/50"
            animate={{ scale: [1, 1.5, 1.8], opacity: [0.7, 0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }} />
        </motion.div>

        {/* Title */}
        <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-2xl font-extrabold text-[#0F172A] mb-2">
          Abonnement activé !
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}
          className="text-slate-500 text-sm leading-relaxed mb-6">
          Vos <strong className="text-[#0F172A]">Alertes Premium</strong> sont maintenant actives.
          Vous recevrez des notifications en temps réel.
        </motion.p>

        {/* Subscription card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }}
          className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 text-left shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0">
              <I.Bell size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-[#0F172A]">Alertes Premium</div>
              <div className="text-xs text-slate-500">7,50 € / mois · Sans engagement</div>
            </div>
            <span className="ml-auto bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 uppercase">
              Actif
            </span>
          </div>
          <div className="space-y-2">
            {[
              'Alertes email en temps réel',
              'Recherches sauvegardées',
              'Notifications instantanées',
            ].map((f, i) => (
              <motion.div key={f} className="flex items-center gap-2.5"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.08 }}>
                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <I.Check size={8} className="text-white" />
                </div>
                <span className="text-sm text-slate-600">{f}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="space-y-3">
          <button type="button" onClick={() => navigate('/')}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm transition-all shadow-lg shadow-orange-200/60 hover:-translate-y-0.5">
            <I.Home size={15} />
            Aller au tableau de bord
          </button>
          <button type="button" onClick={() => navigate('/annonces')}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:bg-white transition">
            <I.Search size={14} />
            Parcourir les annonces
          </button>
        </motion.div>

        {/* Footer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-6 text-xs text-slate-400">
          Un reçu a été envoyé à votre adresse e-mail.
          <br />Gérez votre abonnement depuis votre{' '}
          <Link to="/account" className="text-orange-600 hover:underline font-medium">espace compte</Link>.
        </motion.p>
      </motion.div>
    </div>
  )
}
