import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'
import { supabase } from '../lib/supabase.js'
import { I, Button, PasswordStrength } from '../lib/ui.jsx'

export default function Register() {
  const navigate = useNavigate()
  const [accountType, setAccountType] = useState('personal')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [error,        setError]        = useState('')

  const signInWithGoogle = async () => {
    setOauthLoading(true); setError('')
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/app` },
      })
      if (error) throw error
    } catch (err) {
      setError(err?.message || 'Impossible de se connecter avec Google.')
      setOauthLoading(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { account_type: accountType, full_name: fullName } },
      })
      if (error) throw error
      navigate('/auth/verify-pending', { state: { email } })
    } catch (err) {
      const msg = err?.message || ''
      if (/already registered|already exists/i.test(msg)) setError('Cet e-mail est déjà utilisé.')
      else if (/password should be at least/i.test(msg)) setError('Le mot de passe doit comporter au moins 6 caractères.')
      else setError(msg || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Créez un compte"
      subtitle="Bénéficiez d'une expérience personnalisée avec du contenu en lien avec vos intérêts."
      footer={<>Vous avez déjà un compte ? <Link to="/auth/login" className="text-orange-600 font-semibold hover:underline">Se connecter</Link></>}
    >
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setAccountType('personal')}
          className={`group rounded-2xl border-2 px-4 py-4 text-left transition-all hover:-translate-y-0.5 ${accountType === 'personal' ? 'bg-slate-100 border-slate-900 shadow-soft' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${accountType === 'personal' ? 'bg-navy-900 text-white' : 'bg-slate-100 text-navy-900'}`}>
            <I.User size={18}/>
          </div>
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Particulier</div>
          <div className="font-bold text-navy-900 text-sm">Pour vous</div>
        </button>
        <button
          type="button"
          onClick={() => setAccountType('professional')}
          className={`group rounded-2xl border-2 px-4 py-4 text-left transition-all hover:-translate-y-0.5 ${accountType === 'professional' ? 'bg-slate-100 border-slate-900 shadow-soft' : 'bg-white border-slate-200 hover:border-slate-300'}`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${accountType === 'professional' ? 'bg-navy-900 text-white' : 'bg-slate-100 text-navy-900'}`}>
            <I.Building size={18}/>
          </div>
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Professionnel</div>
          <div className="font-bold text-navy-900 text-sm">Pour votre entreprise</div>
        </button>
      </div>

      <p className="text-xs text-slate-500 mb-5">
        * Vous agissez à titre professionnel ?{' '}
        <button type="button" onClick={() => setAccountType('professional')} className="font-bold text-orange-600 hover:underline">
          Créez plutôt un compte pro !
        </button>
      </p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Nom complet</label>
          <div className="flex items-center gap-3 px-4 h-12 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-orange-500/40 focus-within:border-slate-300 transition">
            <I.User size={16} className="text-slate-500" />
            <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jean Kevin PEMOU" className="flex-1 bg-transparent text-navy-900 placeholder-slate-400 text-sm focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">E-mail</label>
          <div className="flex items-center gap-3 px-4 h-12 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-orange-500/40 focus-within:border-slate-300 transition">
            <I.Mail size={16} className="text-slate-500" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.fr" className="flex-1 bg-transparent text-navy-900 placeholder-slate-400 text-sm focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Mot de passe</label>
          <div className="flex items-center gap-3 px-4 h-12 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-orange-500/40 focus-within:border-slate-300 transition">
            <I.Lock size={16} className="text-slate-500" />
            <input type={show ? 'text' : 'password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="flex-1 bg-transparent text-navy-900 placeholder-slate-400 text-sm focus:outline-none" />
            <button type="button" onClick={() => setShow(!show)} className="text-slate-500 hover:text-navy-900">
              {show ? <I.EyeOff size={16}/> : <I.Eye size={16}/>}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        {error && (
          <div className="flex items-start gap-2 px-3.5 py-2.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm">
            <I.Alert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <><I.Loader size={16}/> Création…</> : <>Continuer <I.ArrowRight size={16}/></>}
        </Button>

        <p className="text-center text-xs text-slate-500 leading-relaxed">
          En continuant, vous acceptez nos{' '}
          <a href="#" className="text-navy-900 hover:text-orange-600 underline">CGU</a> et notre{' '}
          <a href="#" className="text-navy-900 hover:text-orange-600 underline">politique de confidentialité</a>.
        </p>
      </form>
    </AuthLayout>
  )
}
