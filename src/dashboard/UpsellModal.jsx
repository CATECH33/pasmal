import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I, Button } from '../lib/ui.jsx'

/* ============================================================
   Upsell Modal — triggered when user picks the Free plan
   - Side-by-side comparison: Free / Visibility / Premium
   - Visibility highlighted as best value
   - Modern conversion-focused
   ============================================================
   API:
     <UpsellModal
       open={boolean}
       onClose={() => {}}                 // dismiss
       onUpgrade={(planId) => {}}         // 'boost' | 'premium'
       onContinueFree={() => {}}          // skip upgrade
     />
   ============================================================ */

const ROWS = [
  { label: 'Photos par annonce',     values: ['3',            '8',                  '12'] },
  { label: 'Durée en ligne',         values: ['7 jours',      '30 jours',           '30 jours'] },
  { label: 'Badge sur l\'annonce',   values: [null,           { badge: 'Nouveau' }, { badge: 'Urgent', tone: 'rose' }] },
  { label: 'Boost visibilité',       values: [null,           '+200 %',             'Top placement'] },
  { label: 'Statistiques',           values: [null,           'Basiques',           'Avancées'] },
  { label: 'Support',                values: ['Communautaire','Prioritaire',        'Dédié'] },
  { label: 'Contacts estimés / mois',values: ['1-2',          '8-12',               '15-20'] },
]

const PLANS = [
  { id: 'free',    name: 'Gratuit',         price: '0',     period: '€',     cta: 'Rester en gratuit', col: 'left' },
  { id: 'boost',   name: 'Pack Visibilité', price: '9,90',  period: '€',     cta: 'Passer Visibilité', col: 'highlight', save: 'MEILLEUR RAPPORT' },
  { id: 'premium', name: 'Premium',         price: '14,90', period: '€',     cta: 'Passer Premium',    col: 'right' },
]

export default function UpsellModal({ open, onClose, onUpgrade, onContinueFree }) {
  /* Escape key to close */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-navy-900/55 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 lg:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="pointer-events-auto relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-cardHover overflow-hidden flex flex-col"
            >
              {/* Decorative top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
              <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-orange-200/40 blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Fermer"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition z-10"
              >
                <I.X size={16} className="text-navy-900"/>
              </button>

              {/* Header */}
              <div className="relative px-6 lg:px-10 pt-8 lg:pt-10 pb-5">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 mb-4">
                  <I.Sparkles size={11}/> Offre limitée publication
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-navy-900 tracking-tight max-w-xl">
                  Avant de publier en <span className="text-slate-500 line-through decoration-2 decoration-rose-500">gratuit</span>…
                </h2>
                <p className="text-slate-600 mt-2 leading-relaxed max-w-2xl text-sm lg:text-base">
                  Vos annonces premium reçoivent en moyenne <strong className="text-navy-900">4× plus de contacts</strong>.
                  Comparez les 3 forfaits avant de choisir.
                </p>
              </div>

              {/* Comparison table — scrollable on small screens */}
              <div className="relative flex-1 overflow-y-auto px-3 lg:px-6 pb-3 lg:pb-4">
                <div className="bg-slate-50 rounded-3xl p-2 lg:p-3 overflow-x-auto">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-3 lg:p-4 font-semibold text-slate-500 text-[11px] uppercase tracking-wider w-[28%]">Comparatif</th>
                        {PLANS.map((p) => (
                          <th key={p.id} className="p-2 lg:p-3 align-top">
                            <PlanHeader plan={p}/>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ROWS.map((row, i) => (
                        <motion.tr
                          key={row.label}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 + i * 0.03, duration: 0.3 }}
                          className="border-t border-slate-200/70"
                        >
                          <td className="p-3 lg:p-4 text-slate-700 font-medium text-[13px]">{row.label}</td>
                          {row.values.map((v, idx) => (
                            <td key={idx} className={`p-2.5 lg:p-3 text-center align-middle ${PLANS[idx].col === 'highlight' ? 'bg-orange-50/50' : ''}`}>
                              <Cell value={v}/>
                            </td>
                          ))}
                        </motion.tr>
                      ))}

                      {/* CTA row */}
                      <tr className="border-t border-slate-200/70">
                        <td className="p-3 lg:p-4"></td>
                        {PLANS.map((p) => (
                          <td key={p.id} className={`p-2.5 lg:p-3 text-center ${p.col === 'highlight' ? 'bg-orange-50/50' : ''}`}>
                            <button
                              onClick={() => p.id === 'free' ? onContinueFree?.() : onUpgrade?.(p.id)}
                              className={`w-full inline-flex items-center justify-center gap-1.5 font-semibold rounded-full transition-all px-3 py-2.5 text-xs lg:text-[13px] ${
                                p.col === 'highlight'
                                  ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-soft hover:shadow-cardHover hover:-translate-y-0.5'
                                  : p.col === 'right'
                                    ? 'bg-navy-900 hover:bg-navy-700 text-white shadow-soft hover:shadow-card hover:-translate-y-0.5'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {p.cta}
                              {p.id !== 'free' && <I.ArrowRight size={12}/>}
                            </button>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer — social proof + secondary dismiss */}
              <div className="relative px-6 lg:px-10 py-4 border-t border-slate-100 bg-white flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex -space-x-2">
                    {['JK', 'SB', 'ML', 'PR'].map((i, k) => (
                      <div key={k} className="w-7 h-7 rounded-full ring-2 ring-white bg-navy-900 text-white text-[10px] font-bold flex items-center justify-center">{i}</div>
                    ))}
                  </div>
                  <span><span className="font-bold text-navy-900">1 248 propriétaires</span> ont choisi un pack premium cette semaine</span>
                </div>
                <button
                  onClick={onContinueFree || onClose}
                  className="text-xs text-slate-500 hover:text-orange-600 underline underline-offset-2 transition-colors"
                >
                  Non merci, continuer en gratuit →
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ============================================================
   Plan column header
   ============================================================ */
function PlanHeader({ plan }) {
  const highlight = plan.col === 'highlight'
  const right = plan.col === 'right'
  return (
    <div className={`relative rounded-2xl p-3 lg:p-4 ${
      highlight ? 'bg-white shadow-cardHover ring-2 ring-orange-500'
      : right    ? 'bg-navy-900 text-white shadow-soft'
      : 'bg-white border border-slate-200'
    }`}>
      {plan.save && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-orange-600 text-white shadow-soft whitespace-nowrap">
          <I.Star size={9} fill="white"/> {plan.save}
        </div>
      )}
      <div className={`text-[11px] font-semibold mb-1 ${
        highlight ? 'text-orange-600' : right ? 'text-orange-400' : 'text-slate-500'
      }`}>
        {plan.name}
      </div>
      <div className="flex items-baseline gap-0.5 justify-center">
        <span className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${right ? 'text-white' : 'text-navy-900'}`}>
          {plan.price}
        </span>
        <span className={`text-[11px] ${right ? 'text-white/70' : 'text-slate-500'}`}>
          {plan.period}
        </span>
      </div>
    </div>
  )
}

/* ============================================================
   Comparison cell renderer
   ============================================================ */
function Cell({ value }) {
  if (value === null || value === undefined) {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
        <I.X size={12}/>
      </span>
    )
  }
  if (typeof value === 'object' && value.badge) {
    const tone = value.tone === 'rose'
      ? 'bg-rose-100 text-rose-700 ring-rose-200'
      : 'bg-orange-100 text-orange-700 ring-orange-200'
    return (
      <span className={`inline-flex items-center text-[9px] font-extrabold uppercase tracking-[0.15em] px-2 py-0.5 rounded-md ring-1 ${tone}`}>
        {value.badge}
      </span>
    )
  }
  return <span className="text-[13px] font-semibold text-navy-900">{value}</span>
}
