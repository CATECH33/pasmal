import React from 'react'
import { motion } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const DOCS = [
  { label:'Extrait Kbis',            status:'validated', hint:'Validé le 20/05/2026' },
  { label:'Pièce d\'identité',       status:'validated', hint:'Validé le 20/05/2026' },
  { label:'Selfie de vérification',  status:'pending',   hint:'Disponible prochainement' },
  { label:'RCP professionnelle',     status:'missing',   hint:'Recommandé pour badge Premium' },
]

const STATUS_CONFIG = {
  validated: { label:'Validé',    Icon:I.Check,   ring:'border-emerald-400', bg:'bg-emerald-100', text:'text-emerald-700', icon:'bg-emerald-500' },
  pending:   { label:'En attente',Icon:I.Loader,  ring:'border-amber-400',   bg:'bg-amber-100',   text:'text-amber-700',   icon:'bg-amber-400'   },
  missing:   { label:'Manquant',  Icon:I.Upload,  ring:'border-slate-300',   bg:'bg-slate-100',   text:'text-slate-500',   icon:'bg-slate-300'   },
}

export default function PageVerification({ dark }) {
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'
  const validated = DOCS.filter(d => d.status === 'validated').length
  const pct = Math.round((validated / DOCS.length) * 100)

  return (
    <div className="p-6 space-y-5 max-w-2xl mx-auto">
      {/* Badge status */}
      <div className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg,#0B1F3A,#1a3a6b)' }}>
        <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shrink-0">
          <I.BadgeCheck size={26} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-extrabold text-lg">Agence vérifiée</p>
          <p className="text-white/60 text-sm mt-0.5">Badge actif sur toutes vos annonces</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-white/50 text-xs">Score de confiance</p>
          <p className="text-white font-extrabold text-2xl">{pct}%</p>
        </div>
      </div>

      {/* Progress */}
      <div className={`rounded-2xl border p-5 shadow-sm ${bd}`}>
        <div className="flex justify-between text-xs mb-2">
          <span className={`font-bold ${tx}`}>Progression de la vérification</span>
          <span className={sx}>{validated}/{DOCS.length} documents</span>
        </div>
        <div className={`h-2.5 rounded-full ${dark ? 'bg-white/10' : 'bg-slate-100'}`}>
          <motion.div className="h-full rounded-full bg-emerald-500"
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, type: 'spring' }} />
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-3">
        {DOCS.map(({ label, status, hint }) => {
          const c = STATUS_CONFIG[status]
          return (
            <div key={label} className={`rounded-2xl border-2 p-4 flex items-center gap-4 ${c.ring} ${dark ? 'bg-[#1f2937]' : 'bg-white'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
                <c.Icon size={17} className="text-white" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${tx}`}>{label}</p>
                <p className={`text-xs mt-0.5 ${sx}`}>{hint}</p>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>{c.label}</span>
              {status === 'missing' && (
                <button className="text-xs font-bold text-orange-500 hover:text-orange-600 transition shrink-0">Uploader</button>
              )}
            </div>
          )
        })}
      </div>

      {/* Info note */}
      <div className={`rounded-2xl border p-4 flex gap-3 ${dark ? 'bg-[#1f2937] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
        <I.Shield size={16} className="text-navy-700 shrink-0 mt-0.5" />
        <p className={`text-xs leading-relaxed ${sx}`}>
          Tous les documents sont vérifiés manuellement par notre équipe sous 24 h ouvrées. Pour toute question : <span className="text-orange-500 font-semibold">verification@pasmal.fr</span>
        </p>
      </div>
    </div>
  )
}
