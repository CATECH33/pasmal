import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BrandLogo, I } from '../lib/ui.jsx'

const ART = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80'

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── LEFT — Navy decorative panel (mirrors Login.jsx) ── */}
      <div className="relative hidden lg:flex lg:w-[48%] xl:w-[52%] flex-col overflow-hidden bg-[#0B1F3A]">
        <img src={ART} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0B1F3A]/90 to-[#0B1F3A]/70" />

        {/* Glow blobs */}
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-500 opacity-20 blur-3xl pointer-events-none"
          animate={{ x: [0, 24, 0], y: [0, 18, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500 opacity-10 blur-3xl pointer-events-none"
          animate={{ x: [0, -20, 0], y: [0, -16, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 flex flex-col h-full p-12 xl:p-16">
          <Link to="/"><BrandLogo dark /></Link>

          <div className="flex-1 flex flex-col justify-center mt-16">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-orange-400 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              Premium Estate
            </span>
            <h2 className="text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white leading-tight mb-4">
              Le marché immobilier<br />
              <span className="text-orange-400">pour les exigeants.</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed max-w-md mb-10">
              Achetez, vendez et investissez en toute confiance grâce à notre plateforme vérifiée et sécurisée.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: I.Shield,     label: 'Vérification KYC' },
                { icon: I.Sparkles,  label: 'Modération IA'    },
                { icon: I.CreditCard, label: 'Stripe Connect'  },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4">
                  <Icon size={18} className="text-orange-400 mb-2" />
                  <div className="text-xs font-medium text-white/80 leading-snug">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 mt-12">
            <div className="flex -space-x-2.5">
              {['JD', 'SB', 'ML', 'PK'].map((init) => (
                <div key={init} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 border-2 border-[#0B1F3A] flex items-center justify-center text-[10px] font-bold text-white">
                  {init}
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-xs">
              <span className="text-white font-bold">86 400+</span> utilisateurs vérifiés nous font confiance
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT — White form panel ── */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-8 pb-2">
          <Link to="/"><BrandLogo /></Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
          <motion.div
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="text-2xl xl:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-1">{title}</h1>
            {subtitle && <p className="text-slate-500 text-sm mb-6 leading-relaxed">{subtitle}</p>}
            <div className={subtitle ? '' : 'mt-6'}>{children}</div>
            {footer && <p className="mt-8 text-sm text-slate-500 text-center">{footer}</p>}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="px-10 pb-6 flex items-center justify-between text-xs text-slate-400">
          <span>© {new Date().getFullYear()} PASMAL</span>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-slate-600">Aide</Link>
            <Link to="#" className="hover:text-slate-600">Confidentialité</Link>
            <Link to="#" className="hover:text-slate-600">CGU</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
