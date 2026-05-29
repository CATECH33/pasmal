import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I, PasswordStrength } from '../lib/ui.jsx'
import { supabase } from '../lib/supabase.js'
import { OrangeButton, ErrorBanner, StepDots } from './RegisterTabs.jsx'

/* ── Project choices ──────────────────────────────────────────────── */
const PROJECT_TYPES = [
  { id: 'acheter',  label: 'Acheter',             Icon: I.Home,       desc: 'Résidence principale ou secondaire', color: '#F97316' },
  { id: 'louer',    label: 'Louer',               Icon: I.MapPin,     desc: 'Trouver votre prochain logement',   color: '#3B82F6' },
  { id: 'investir', label: 'Investir',            Icon: I.TrendingUp, desc: 'Patrimoine & rendement locatif',    color: '#8B5CF6' },
  { id: 'publier',  label: 'Publier une annonce', Icon: I.Upload,     desc: 'Vendre ou louer votre bien',        color: '#10B981' },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/* ── Floating-label input ─────────────────────────────────────────── */
function FloatInput({ label, type = 'text', value, onChange, onBlur, icon: Icon, right, error, hint, autoComplete, disabled }) {
  const [focused, setFocused] = useState(false)
  const filled = (value?.length ?? 0) > 0
  const up = focused || filled

  return (
    <div>
      <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
        disabled ? 'bg-slate-50 border-slate-100 cursor-not-allowed' :
        error    ? 'border-rose-400 bg-rose-50/20 shadow-[0_0_0_3px_rgba(251,113,133,0.08)]' :
        focused  ? 'border-orange-400 bg-white shadow-[0_0_0_4px_rgba(251,146,60,0.10)]' :
                   'border-slate-200 bg-white hover:border-slate-300'
      }`}>
        {Icon && (
          <span className={`absolute left-4 flex-shrink-0 pointer-events-none transition-colors duration-200 ${
            disabled ? 'text-slate-300' : error ? 'text-rose-400' : focused ? 'text-orange-400' : 'text-slate-400'
          }`}>
            <Icon size={15} />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.() }}
          autoComplete={autoComplete}
          disabled={disabled}
          placeholder=""
          style={{ height: 56 }}
          className={`w-full bg-transparent outline-none text-sm text-navy-900 transition-all duration-150 ${
            Icon ? 'pl-10' : 'pl-4'
          } ${right ? 'pr-12' : 'pr-4'} ${up ? 'pt-5 pb-1.5' : 'py-4'}`}
        />
        <label className={`absolute pointer-events-none select-none transition-all duration-200 ${
          Icon ? 'left-10' : 'left-4'
        } ${up
          ? `top-2 text-[10px] font-bold uppercase tracking-wider ${error ? 'text-rose-400' : focused ? 'text-orange-500' : 'text-slate-400'}`
          : 'top-1/2 -translate-y-1/2 text-sm text-slate-400'
        }`}>
          {label}
        </label>
        {right && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p key="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-1.5 ml-1 text-xs text-rose-500 flex items-center gap-1">
            <I.Alert size={11} /> {error}
          </motion.p>
        )}
        {hint && !error && (
          <p key="hint" className="mt-1.5 ml-1 text-[11px] text-slate-400">{hint}</p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Custom checkbox ──────────────────────────────────────────────── */
function Checkbox({ checked, onChange, error }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
        checked ? 'bg-orange-500 border-orange-500' : error ? 'border-rose-400' : 'border-slate-300 hover:border-orange-400'
      }`}>
      <AnimatePresence>
        {checked && (
          <motion.span key="chk" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
            <I.Check size={11} className="text-white" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

/* ── Back button ──────────────────────────────────────────────────── */
function BackBtn({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-navy-700 transition-colors mb-5">
      <I.ChevronLeft size={13} /> Retour
    </button>
  )
}

/* ── Step header ──────────────────────────────────────────────────── */
function StepHeader({ title, sub }) {
  return (
    <div className="mb-1">
      <p className="text-base font-extrabold text-navy-900">{title}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
  )
}

/* ── Phone auto-format ────────────────────────────────────────────── */
function fmtPhone(raw) {
  const d = raw.replace(/\D/g, '').slice(0, 10)
  return (d.match(/.{1,2}/g) || []).join(' ')
}

/* ═══════════════════════════════════════════════════════════════════
   PersonalRegisterForm
   ══════════════════════════════════════════════════════════════════ */
export default function PersonalRegisterForm({ step, setStep, onClose }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '',
    email: '', password: '', confirm: '',
    phone: '', city: '', projectType: '',
    avatar: null, avatarUrl: '',
    terms: false, newsletter: false,
  })
  const [errors, setErrors] = useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [showCnf, setShowCnf] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [drag, setDrag] = useState(false)
  const fileRef = useRef()

  /* Revoke object URL on unmount */
  useEffect(() => () => { if (form.avatarUrl) URL.revokeObjectURL(form.avatarUrl) }, [])

  const set = k => v => setForm(f => ({ ...f, [k]: v }))
  const clr = k => setErrors(e => ({ ...e, [k]: '' }))

  /* ── Validators ─────────────────────────── */
  const v0 = () => {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Prénom requis'
    if (!form.lastName.trim())  e.lastName  = 'Nom requis'
    setErrors(e); return !Object.keys(e).length
  }
  const v1 = () => {
    const e = {}
    if (!EMAIL_RE.test(form.email)) e.email    = 'Adresse e-mail invalide'
    if (form.password.length < 8)   e.password = 'Minimum 8 caractères'
    if (form.confirm !== form.password) e.confirm = 'Les mots de passe ne correspondent pas'
    setErrors(e); return !Object.keys(e).length
  }
  const v2 = () => {
    const e = {}
    if (!form.projectType) e.projectType = 'Veuillez choisir un projet'
    setErrors(e); return !Object.keys(e).length
  }

  const next = (validator) => { if (!validator || validator()) { setErrors({}); setStep(s => s + 1) } }

  /* ── Avatar upload ──────────────────────── */
  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (form.avatarUrl) URL.revokeObjectURL(form.avatarUrl)
    const url = URL.createObjectURL(file)
    setForm(f => ({ ...f, avatar: file, avatarUrl: url }))
  }, [form.avatarUrl])

  /* ── Submit ─────────────────────────────── */
  const handleSubmit = async () => {
    if (!form.terms) { setErrors({ terms: 'Veuillez accepter les CGU pour continuer.' }); return }
    setLoading(true); setErrors({})
    try {
      const { error: err } = await supabase.auth.signUp({
        email: form.email, password: form.password,
        options: {
          data: {
            first_name: form.firstName, last_name: form.lastName,
            phone: form.phone, city: form.city,
            project_type: form.projectType, newsletter: form.newsletter,
            account_type: 'personal',
          },
        },
      })
      if (err) throw err
      setDone(true)
    } catch (err) {
      const m = err?.message || ''
      setErrors({ submit: /already/i.test(m) ? 'Cet e-mail est déjà utilisé.' : m || 'Une erreur est survenue.' })
    } finally {
      setLoading(false)
    }
  }

  /* ── Done ───────────────────────────────── */
  if (done) return (
    <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 270, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
        <I.CheckCircle size={30} className="text-emerald-600" />
      </motion.div>
      <h2 className="text-xl font-extrabold text-navy-900 mb-2">Bienvenue, {form.firstName} !</h2>
      <p className="text-slate-500 text-sm mb-5 leading-relaxed max-w-xs mx-auto">
        Votre compte a été créé. Vérifiez votre e-mail pour activer votre accès PASMAL.
      </p>
      <button onClick={onClose}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-7 py-3 rounded-2xl text-sm transition-colors">
        Commencer l'exploration
      </button>
    </motion.div>
  )

  return (
    <div>
      <StepDots current={step} total={4} />
      <AnimatePresence mode="wait">

        {/* ═══════ Step 0 — Identité ═══════════════════════════ */}
        {step === 0 && (
          <motion.div key="s0"
            initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.17 }} className="space-y-4">
            <StepHeader title="Votre identité" sub="Commençons par faire connaissance." />
            <div className="grid grid-cols-2 gap-3">
              <FloatInput label="Prénom" value={form.firstName} icon={I.User} autoComplete="given-name"
                error={errors.firstName}
                onChange={v => { set('firstName')(v); clr('firstName') }} />
              <FloatInput label="Nom" value={form.lastName} icon={I.User} autoComplete="family-name"
                error={errors.lastName}
                onChange={v => { set('lastName')(v); clr('lastName') }} />
            </div>
            <OrangeButton disabled={!form.firstName || !form.lastName} onClick={() => next(v0)}>
              Continuer
            </OrangeButton>
          </motion.div>
        )}

        {/* ═══════ Step 1 — Accès ══════════════════════════════ */}
        {step === 1 && (
          <motion.div key="s1"
            initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.17 }} className="space-y-4">
            <BackBtn onClick={() => setStep(0)} />
            <StepHeader title="Vos accès" sub="Sécurisez votre compte PASMAL." />

            <FloatInput label="Adresse e-mail" type="email" value={form.email}
              icon={I.Mail} autoComplete="email" error={errors.email}
              onChange={v => { set('email')(v); clr('email') }}
              onBlur={() => {
                if (form.email && !EMAIL_RE.test(form.email))
                  setErrors(e => ({ ...e, email: 'Adresse e-mail invalide' }))
              }} />

            <div>
              <FloatInput label="Mot de passe" type={showPwd ? 'text' : 'password'} value={form.password}
                icon={I.Lock} autoComplete="new-password" error={errors.password}
                onChange={v => { set('password')(v); clr('password') }}
                right={
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="text-slate-400 hover:text-navy-700 transition-colors">
                    {showPwd ? <I.EyeOff size={15} /> : <I.Eye size={15} />}
                  </button>
                } />
              {form.password && <PasswordStrength password={form.password} />}
            </div>

            <FloatInput label="Confirmer le mot de passe" type={showCnf ? 'text' : 'password'} value={form.confirm}
              icon={I.Lock} autoComplete="new-password" error={errors.confirm}
              onChange={v => { set('confirm')(v); clr('confirm') }}
              right={
                <button type="button" onClick={() => setShowCnf(v => !v)}
                  className="text-slate-400 hover:text-navy-700 transition-colors">
                  {showCnf ? <I.EyeOff size={15} /> : <I.Eye size={15} />}
                </button>
              } />

            <OrangeButton disabled={!form.email || !form.password || !form.confirm} onClick={() => next(v1)}>
              Continuer
            </OrangeButton>
          </motion.div>
        )}

        {/* ═══════ Step 2 — Profil ═════════════════════════════ */}
        {step === 2 && (
          <motion.div key="s2"
            initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.17 }} className="space-y-5">
            <BackBtn onClick={() => setStep(1)} />
            <StepHeader title="Votre profil" sub="Personnalisez votre expérience PASMAL." />

            {/* Phone + City */}
            <div className="grid grid-cols-2 gap-3">
              <FloatInput label="Téléphone" type="tel" value={form.phone} icon={I.Phone}
                autoComplete="tel" hint="Format : 06 12 34 56 78"
                onChange={v => set('phone')(fmtPhone(v))} />
              <FloatInput label="Ville" value={form.city} icon={I.MapPin}
                autoComplete="address-level2" onChange={set('city')} />
            </div>

            {/* Avatar upload */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Photo de profil{' '}
                <span className="normal-case font-normal text-slate-400">(optionnel)</span>
              </p>
              <div
                role="button" tabIndex={0}
                className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed cursor-pointer select-none transition-all duration-200 ${
                  drag
                    ? 'border-orange-400 bg-orange-50 scale-[1.01]'
                    : 'border-slate-200 bg-slate-50/60 hover:border-orange-300 hover:bg-orange-50/30'
                }`}
                style={{ height: 110 }}
                onClick={() => fileRef.current?.click()}
                onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]) }}>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => handleFile(e.target.files[0])} />

                {form.avatarUrl ? (
                  <>
                    <img src={form.avatarUrl} alt="Aperçu" className="w-14 h-14 rounded-full object-cover shadow" />
                    <button type="button"
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors"
                      onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, avatar: null, avatarUrl: '' })) }}>
                      <I.X size={11} />
                    </button>
                    <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                      <I.Check size={12} /> Photo chargée
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                      <I.Upload size={18} />
                    </div>
                    <p className="text-xs text-slate-500 text-center leading-relaxed">
                      <span className="font-semibold text-orange-500">Cliquez</span> ou déposez votre photo<br />
                      <span className="text-slate-400 text-[11px]">JPG, PNG, WebP · Max 5 Mo</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Project type */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Quel est votre projet ?
              </p>
              {errors.projectType && (
                <p className="mb-2 text-xs text-rose-500 flex items-center gap-1">
                  <I.Alert size={11} /> {errors.projectType}
                </p>
              )}
              <div className="grid grid-cols-2 gap-2">
                {PROJECT_TYPES.map(({ id, label, Icon, desc, color }) => {
                  const sel = form.projectType === id
                  return (
                    <button key={id} type="button"
                      onClick={() => { set('projectType')(id); clr('projectType') }}
                      className={`relative flex items-start gap-2.5 px-3.5 py-3 rounded-2xl border-2 text-left transition-all ${
                        sel
                          ? 'bg-orange-50 border-orange-400 shadow-[0_0_0_3px_rgba(251,146,60,0.10)]'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                        style={{ background: sel ? color + '20' : '#f1f5f9', color: sel ? color : '#94a3b8' }}>
                        <Icon size={15} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-bold leading-tight ${sel ? 'text-orange-600' : 'text-navy-800'}`}>{label}</p>
                        <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{desc}</p>
                      </div>
                      {sel && (
                        <I.Check size={13} className="text-orange-500 absolute top-3 right-3 flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <OrangeButton onClick={() => next(v2)}>Continuer</OrangeButton>
          </motion.div>
        )}

        {/* ═══════ Step 3 — Finalisation ═══════════════════════ */}
        {step === 3 && (
          <motion.div key="s3"
            initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.17 }} className="space-y-5">
            <BackBtn onClick={() => setStep(2)} />
            <StepHeader title="Récapitulatif" sub="Tout est bon ? On crée votre compte." />

            {/* Summary card */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5">
              {form.avatarUrl && (
                <div className="flex justify-center mb-3">
                  <img src={form.avatarUrl} alt="avatar" className="w-14 h-14 rounded-full object-cover shadow" />
                </div>
              )}
              {[
                ['Nom',       `${form.firstName} ${form.lastName}`],
                ['E-mail',    form.email],
                ...(form.phone ? [['Téléphone', form.phone]] : []),
                ...(form.city  ? [['Ville',     form.city]]  : []),
                ['Projet',    PROJECT_TYPES.find(p => p.id === form.projectType)?.label || '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500 flex-shrink-0">{k}</span>
                  <span className="font-semibold text-navy-800 truncate ml-3 max-w-[58%] text-right capitalize">{v}</span>
                </div>
              ))}
            </div>

            {/* CGU */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={form.terms} onChange={v => { set('terms')(v); clr('terms') }} error={errors.terms} />
                <span className="text-xs text-slate-500 leading-relaxed mt-0.5">
                  J'accepte les{' '}
                  <span className="text-orange-500 font-semibold hover:underline cursor-pointer">Conditions Générales d'Utilisation</span>
                  {' '}et la{' '}
                  <span className="text-orange-500 font-semibold hover:underline cursor-pointer">politique de confidentialité</span>
                  {' '}de PASMAL.{' '}
                  <span className="text-rose-500 font-semibold">*</span>
                </span>
              </label>
              {errors.terms && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-rose-500 flex items-center gap-1 ml-8">
                  <I.Alert size={11} /> {errors.terms}
                </motion.p>
              )}

              {/* Newsletter */}
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox checked={form.newsletter} onChange={set('newsletter')} />
                <span className="text-xs text-slate-500 leading-relaxed mt-0.5">
                  Je souhaite recevoir les tendances du marché, les offres exclusives et les conseils immobiliers de PASMAL.{' '}
                  <span className="text-slate-400">(optionnel)</span>
                </span>
              </label>
            </div>

            {errors.submit && <ErrorBanner msg={errors.submit} />}
            <OrangeButton loading={loading} onClick={handleSubmit}>Créer mon compte</OrangeButton>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
