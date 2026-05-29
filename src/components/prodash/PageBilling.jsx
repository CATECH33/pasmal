import React from 'react'
import { motion } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const PLANS = [
  { id:'free',       name:'Gratuit',    price:'0',  listings:3,  Icon:I.User,    active:false },
  { id:'visibility', name:'Visibilité', price:'29', listings:20, Icon:I.Star,    active:true  },
  { id:'premium',    name:'Premium',    price:'79', listings:'∞', Icon:I.Zap,    active:false },
]

const INVOICES = [
  { date:'01/05/2026', desc:'Plan Visibilité', amount:'29,00 €', status:'Payée'   },
  { date:'01/04/2026', desc:'Plan Visibilité', amount:'29,00 €', status:'Payée'   },
  { date:'01/03/2026', desc:'Plan Visibilité', amount:'29,00 €', status:'Payée'   },
]

export default function PageBilling({ dark }) {
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'

  return (
    <div className="p-6 space-y-5 max-w-3xl mx-auto">
      {/* Current plan banner */}
      <div className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg,#0B1F3A,#1a3a6b)' }}>
        <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center shrink-0">
          <I.Star size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-white font-extrabold text-lg">Plan Visibilité</p>
            <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">ACTIF</span>
          </div>
          <p className="text-white/60 text-sm mt-0.5">29 € / mois · Renouvellement le 01/06/2026</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-white/50 text-xs">Annonces utilisées</p>
          <p className="text-white font-extrabold text-xl mt-0.5">8 <span className="text-white/40 font-normal text-sm">/ 20</span></p>
        </div>
      </div>

      {/* Usage bar */}
      <div className={`rounded-2xl border p-5 shadow-sm ${bd}`}>
        <p className={`text-sm font-extrabold mb-3 ${tx}`}>Utilisation</p>
        <div className="space-y-3">
          {[
            { label: 'Annonces actives', used: 8, max: 20 },
            { label: 'Leads ce mois',    used: 3, max: 50 },
          ].map(({ label, used, max }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className={sx}>{label}</span>
                <span className={`font-bold ${tx}`}>{used} / {max}</span>
              </div>
              <div className={`h-2 rounded-full ${dark ? 'bg-white/10' : 'bg-slate-100'}`}>
                <motion.div className="h-full rounded-full bg-orange-500"
                  initial={{ width: 0 }} animate={{ width: `${(used / max) * 100}%` }}
                  transition={{ duration: 0.6 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan selector */}
      <div className={`rounded-2xl border p-5 shadow-sm ${bd}`}>
        <p className={`text-sm font-extrabold mb-3 ${tx}`}>Changer d'offre</p>
        <div className="grid grid-cols-3 gap-3">
          {PLANS.map(({ id, name, price, listings, Icon, active }) => (
            <div key={id} className={`rounded-xl border-2 p-3 text-center transition-all ${
              active ? 'border-orange-400 bg-orange-50' : dark ? 'border-white/10 hover:border-white/20' : 'border-slate-200 hover:border-slate-300'
            }`}>
              <div className={`w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center ${active ? 'bg-orange-500' : dark ? 'bg-white/10' : 'bg-slate-100'}`}>
                <Icon size={15} className={active ? 'text-white' : dark ? 'text-white/60' : 'text-slate-500'} />
              </div>
              <p className={`text-xs font-extrabold ${tx}`}>{name}</p>
              <p className={`text-[11px] ${sx}`}>{price === '0' ? 'Gratuit' : `${price}€/mois`}</p>
              <p className={`text-[10px] mt-1 ${sx}`}>{listings} annonces</p>
              {active
                ? <span className="mt-2 inline-block text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Actuel</span>
                : <button className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${dark ? 'border-white/20 text-white/60 hover:border-orange-400 hover:text-orange-400' : 'border-slate-300 text-slate-500 hover:border-orange-400 hover:text-orange-500'}`}>Choisir</button>
              }
            </div>
          ))}
        </div>
        <p className={`text-[11px] text-center mt-3 ${sx}`}>Aucun paiement requis maintenant. Gérez votre abonnement à tout moment.</p>
      </div>

      {/* Invoice history */}
      <div className={`rounded-2xl border shadow-sm ${bd}`}>
        <div className={`px-5 py-4 border-b ${dark ? 'border-white/10' : 'border-slate-100'}`}>
          <p className={`text-sm font-extrabold ${tx}`}>Historique des factures</p>
        </div>
        {INVOICES.map((inv, i) => (
          <div key={i} className={`flex items-center gap-4 px-5 py-3.5 border-b last:border-0 ${dark ? 'border-white/5' : 'border-slate-50'}`}>
            <I.FileText size={16} className="text-slate-400 shrink-0" />
            <div className="flex-1">
              <p className={`text-sm font-semibold ${tx}`}>{inv.desc}</p>
              <p className={`text-xs ${sx}`}>{inv.date}</p>
            </div>
            <p className={`text-sm font-bold ${tx}`}>{inv.amount}</p>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">{inv.status}</span>
            <button className={`text-xs font-semibold ${dark ? 'text-white/40 hover:text-orange-400' : 'text-slate-400 hover:text-orange-500'} transition`}>PDF</button>
          </div>
        ))}
      </div>
    </div>
  )
}
