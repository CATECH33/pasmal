import React from 'react'
import { motion } from 'framer-motion'
import { I } from './ui.jsx'

/* ============================================================
   Trust badges — minimal premium design
   Palette : blue (navy) + orange + supporting greens/indigos
   ============================================================ */

export const TRUST_BADGES = {
  agency: {
    label: 'Agence vérifiée',
    short: 'Agence',
    icon: I.BadgeCheck,
    description: 'Identité, Kbis et activité validés par notre équipe.',
    tone: 'orange',
  },
  payment: {
    label: 'Paiement sécurisé',
    short: 'Paiement',
    icon: I.CreditCard,
    description: 'Transactions chiffrées et protégées par Stripe Connect.',
    tone: 'navy',
  },
  listing: {
    label: 'Annonce vérifiée',
    short: 'Annonce',
    icon: I.Shield,
    description: 'Photos originales et données validées par notre IA anti-fraude.',
    tone: 'emerald',
  },
  owner: {
    label: 'Propriétaire certifié',
    short: 'Propriétaire',
    icon: I.User,
    description: "Identité confirmée par pièce d'identité officielle.",
    tone: 'indigo',
  },
}

const PALETTES = {
  orange:  { pill: 'bg-orange-50 text-orange-700 ring-orange-200',  dot: 'bg-orange-500',  ring: 'ring-orange-200',  bubble: 'bg-orange-100 text-orange-600' },
  navy:    { pill: 'bg-navy-900 text-white ring-navy-900/10',       dot: 'bg-white',       ring: 'ring-navy-900/20', bubble: 'bg-navy-900 text-white' },
  emerald: { pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500', ring: 'ring-emerald-200', bubble: 'bg-emerald-100 text-emerald-600' },
  indigo:  { pill: 'bg-indigo-50 text-indigo-700 ring-indigo-200', dot: 'bg-indigo-500',  ring: 'ring-indigo-200',  bubble: 'bg-indigo-100 text-indigo-600' },
}

/* ============================================================
   <TrustBadge type="agency" size="md" /> — inline pill
   ============================================================ */
export function TrustBadge({ type, size = 'md', className = '' }) {
  const b = TRUST_BADGES[type]
  if (!b) return null
  const palette = PALETTES[b.tone]
  const Icon = b.icon
  const sizes = {
    sm: { box: 'text-[10px] px-1.5 py-0.5 gap-1',  icon: 10 },
    md: { box: 'text-[11px] px-2 py-1 gap-1.5',     icon: 12 },
    lg: { box: 'text-xs px-2.5 py-1.5 gap-1.5',     icon: 14 },
  }[size]

  return (
    <span className={`inline-flex items-center font-semibold rounded-md ring-1 ${palette.pill} ${sizes.box} ${className}`}>
      <Icon size={sizes.icon}/>
      {b.label}
    </span>
  )
}

/* ============================================================
   <TrustBadgeCompact /> — icon-only with tooltip via title
   ============================================================ */
export function TrustBadgeCompact({ type, size = 28, className = '' }) {
  const b = TRUST_BADGES[type]
  if (!b) return null
  const palette = PALETTES[b.tone]
  const Icon = b.icon
  return (
    <span
      title={b.label}
      style={{ width: size, height: size }}
      className={`inline-flex items-center justify-center rounded-full ring-1 ${palette.bubble} ${palette.ring} ${className}`}
    >
      <Icon size={Math.round(size * 0.45)}/>
    </span>
  )
}

/* ============================================================
   <TrustBadgeRow types={['agency','listing']} /> — inline row
   ============================================================ */
export function TrustBadgeRow({ types = Object.keys(TRUST_BADGES), size = 'md', className = '' }) {
  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
      {types.map((t) => <TrustBadge key={t} type={t} size={size}/>)}
    </div>
  )
}

/* ============================================================
   <TrustGuarantees /> — full premium strip with descriptions
   Designed to be embedded in landing footer area
   ============================================================ */
export function TrustGuarantees({ title = 'Vos transactions, sécurisées de A à Z', subtitle = 'Quatre engagements concrets — pas du marketing.' }) {
  const ENTRIES = ['owner', 'listing', 'agency', 'payment'].map((k) => ({ key: k, ...TRUST_BADGES[k] }))

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 mb-3">
            <I.Shield size={11}/> Trust & Sécurité
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy-900 tracking-tight">{title}</h2>
          <p className="text-slate-600 mt-2 text-sm">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ENTRIES.map((e, i) => {
            const palette = PALETTES[e.tone]
            const Icon = e.icon
            return (
              <motion.div
                key={e.key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-soft hover:shadow-card transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <span className={`w-10 h-10 rounded-xl ${palette.bubble} flex items-center justify-center shrink-0`}>
                    <Icon size={18}/>
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-navy-900 text-sm">{e.label}</div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{e.description}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
