import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'
import { supabase } from '../lib/supabase.js'
import { I, Button, PasswordStrength } from '../lib/ui.jsx'

export default function Reset() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setLoading(true); setError('')
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      navigate('/auth/login', { state: { success: 'Mot de passe modifié. Connectez-vous.' } })
    } catch (err) {
      setError(err?.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Choisissez un nouveau mot de passe"
      subtitle="Pour des raisons de sécurité, votre nouveau mot de passe ne doit pas être identique à l'ancien."
      footer={<Link to="/auth/login" className="text-orange-600 font-semibold hover:underline">Retour à la connexion</Link>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Nouveau mot de passe</label>
          <div className="flex items-center gap-3 px-4 h-12 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-orange-500/40 focus-within:border-slate-300 transition">
            <I.Lock size={16} className="text-slate-500" />
            <input type={show ? 'text' : 'password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="flex-1 bg-transparent text-navy-900 placeholder-slate-400 text-sm focus:outline-none" />
            <button type="button" onClick={() => setShow(!show)} className="text-slate-500 hover:text-navy-900">
              {show ? <I.EyeOff size={16}/> : <I.Eye size={16}/>}
            </button>
          </div>
          <PasswordStrength password={password} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Confirmer le mot de passe</label>
          <div className="flex items-center gap-3 px-4 h-12 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-orange-500/40 focus-within:border-slate-300 transition">
            <I.Lock size={16} className="text-slate-500" />
            <input type={show ? 'text' : 'password'} required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" className="flex-1 bg-transparent text-navy-900 placeholder-slate-400 text-sm focus:outline-none" />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 px-3.5 py-2.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm">
            <I.Alert size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <><I.Loader size={16}/> Enregistrement…</> : <>Enregistrer le mot de passe <I.ArrowRight size={16}/></>}
        </Button>
      </form>
    </AuthLayout>
  )
}
