import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../lib/ui.jsx'
import { supabase } from '../lib/supabase.js'
import PersonalRegisterForm from './PersonalRegisterForm.jsx'
import ProfessionalRegisterForm from './ProfessionalRegisterForm.jsx'

/* ── Shared form primitives (exported for use in form steps) ─────── */

export function FormField({ label, type = 'text', value, onChange, placeholder, Icon, right, hint }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      {label && (
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      )}
      <div className={`flex items-center gap-2.5 px-4 h-12 rounded-2xl border-2 bg-white transition-all duration-150 ${
        focused ? 'border-orange-400 shadow-[0_0_0_4px_rgba(251,146,60,0.10)]' : 'border-slate-200 hover:border-slate-300'
      }`}>
        {Icon && <Icon size={15} className={focused ? 'text-orange-400' : 'text-slate-400'} />}
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="flex-1 text-sm text-navy-900 placeholder-slate-400 bg-transparent outline-none"
        />
        {right}
      </div>
      {hint && <p className="text-[11px] text-slate-400 mt-1 ml-0.5">{hint}</p>}
    </div>
  )
}

export function OrangeButton({ children, onClick, type = 'button', loading, disabled }) {
  return (
    <motion.button
      type={type} onClick={onClick} disabled={loading || disabled}
      whileHover={!(loading || disabled) ? { y: -1 } : {}}
      whileTap={!(loading || disabled) ? { scale: 0.98 } : {}}
      className={`w-full h-12 flex items-center justify-center gap-2 rounded-2xl font-bold text-sm transition-all ${
        loading || disabled ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-orange-200 hover:shadow-lg'
      }`}
    >
      {loading ? <I.Loader size={15} /> : <>{children}<I.ArrowRight size={14} /></>}
    </motion.button>
  )
}

export function ErrorBanner({ msg }) {
  if (!msg) return null
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl px-4 py-2.5">
      <I.Alert size={14} className="shrink-0" /> {msg}
    </motion.div>
  )
}

export function StepDots({ current, total }) {
  return (
    <div className="flex items-center gap-1.5 mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`rounded-full transition-all duration-300 ${
          i === current ? 'w-5 h-2 bg-orange-500' : i < current ? 'w-2 h-2 bg-emerald-400' : 'w-2 h-2 bg-slate-200'
        }`} />
      ))}
    </div>
  )
}

/* ── Login form ──────────────────────────────────────────────────── */

function LoginForm({ onClose }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password })
      if (err) throw err
      onClose()
    } catch (err) {
      const m = err?.message || ''
      setError(/invalid login/i.test(m) ? 'E-mail ou mot de passe incorrect.' : m || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const googleSignIn = () =>
    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })

  return (
    <form onSubmit={submit} className="space-y-4">
      <button type="button" onClick={googleSignIn}
        className="w-full flex items-center justify-center gap-3 h-12 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white font-semibold text-sm text-navy-800 transition-all hover:shadow-sm">
        <I.Google size={18} /> Continuer avec Google
      </button>

      <div className="flex items-center gap-3 text-[11px] text-slate-400">
        <div className="flex-1 h-px bg-slate-100" /><span>ou par e-mail</span><div className="flex-1 h-px bg-slate-100" />
      </div>

      <FormField label="E-mail" type="email" value={email} onChange={setEmail} placeholder="vous@exemple.fr" Icon={I.Mail} />
      <FormField label="Mot de passe" type={show ? 'text' : 'password'} value={password} onChange={setPassword} placeholder="••••••••" Icon={I.Lock}
        right={<button type="button" onClick={() => setShow(v => !v)} className="text-slate-400 hover:text-navy-700 transition-colors">{show ? <I.EyeOff size={15} /> : <I.Eye size={15} />}</button>} />

      <div className="flex justify-end">
        <a href="/auth/forgot" className="text-xs text-orange-500 hover:text-orange-600 font-medium">Mot de passe oublié ?</a>
      </div>

      <ErrorBanner msg={error} />
      <OrangeButton type="submit" loading={loading}>Se connecter</OrangeButton>
    </form>
  )
}

/* ── Main RegisterTabs component ─────────────────────────────────── */

export default function RegisterTabs({ mode, setMode, tab, setTab, step, setStep, onClose }) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-5">
        <motion.h1
          key={mode}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="text-[22px] font-extrabold text-navy-900"
        >
          {mode === 'login' ? 'Bon retour !' : 'Créer un compte'}
        </motion.h1>
        <p className="text-slate-500 text-sm mt-1">
          {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà inscrit ? '}
          <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
            {mode === 'login' ? "S'inscrire gratuitement" : 'Se connecter'}
          </button>
        </p>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'login' ? (
          <motion.div key="login"
            initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 14 }}
            transition={{ duration: 0.18 }}>
            <LoginForm onClose={onClose} />
          </motion.div>
        ) : (
          <motion.div key="register"
            initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.18 }}>

            {/* Particulier / Professionnel tabs */}
            <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 mb-5">
              {[['particulier', 'Particulier'], ['professionnel', 'Professionnel']].map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === id ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-700'}`}>
                  {label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === 'particulier' ? (
                <motion.div key="pers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
                  <PersonalRegisterForm step={step} setStep={setStep} onClose={onClose} />
                </motion.div>
              ) : (
                <motion.div key="pro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
                  <ProfessionalRegisterForm step={step} setStep={setStep} onClose={onClose} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
