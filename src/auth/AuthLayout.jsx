import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BrandLogo, I } from '../lib/ui.jsx'

const ART = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left form pane */}
      <div className="flex-1 flex flex-col px-6 py-8 lg:px-16 lg:py-12 max-w-2xl mx-auto w-full">
        <Link to="/"><BrandLogo /></Link>

        <div className="flex-1 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md mx-auto"
          >
            <h1 className="text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-slate-600 mt-3 leading-relaxed">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-8 text-sm text-slate-600 text-center">{footer}</div>}
          </motion.div>
        </div>

        <div className="text-xs text-slate-400 flex items-center justify-between gap-4 pt-6">
          <span>© {new Date().getFullYear()} PASMAL</span>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-slate-600">Aide</Link>
            <Link to="#" className="hover:text-slate-600">Confidentialité</Link>
            <Link to="#" className="hover:text-slate-600">CGU</Link>
          </div>
        </div>
      </div>

      {/* Right visual pane */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-navy-900">
        <img src={ART} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-tr from-navy-900 via-navy-900/55 to-transparent" />
        <motion.div
          className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full bg-orange-600 opacity-30 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/70">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> Premium Estate
          </div>

          <div className="space-y-6">
            <div className="text-3xl xl:text-5xl font-extrabold leading-tight max-w-md">
              Le marché immobilier premium.
              <br />
              <span className="text-orange-400">Pour les exigeants.</span>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md">
              {[
                { icon: I.Shield, label: 'Vérification KYC' },
                { icon: I.Sparkles, label: 'Modération IA' },
                { icon: I.CreditCard, label: 'Stripe Connect' },
              ].map((f) => {
                const Icon = f.icon
                return (
                  <div key={f.label} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4">
                    <Icon size={18} className="text-orange-400 mb-2" />
                    <div className="text-xs font-medium text-white/80 leading-snug">{f.label}</div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center gap-3 text-sm text-white/80">
              <div className="flex -space-x-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full ring-2 ring-navy-900 bg-orange-600/80 flex items-center justify-center text-[11px] font-bold">
                    {['JD','SB','ML'][i-1]}
                  </div>
                ))}
              </div>
              <span><span className="text-white font-bold">86 400+</span> utilisateurs vérifiés</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
