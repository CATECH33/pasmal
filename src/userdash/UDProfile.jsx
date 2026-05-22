import React, { useState, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase.js'
import { I, Badge } from '../lib/ui.jsx'

const Camera = (p) => <svg width={p?.size||20} height={p?.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={p?.className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
const Key   = (p) => <svg width={p?.size||20} height={p?.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={p?.className}><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>
const Phone = (p) => <svg width={p?.size||20} height={p?.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={p?.className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 12 19.79 19.79 0 0 1 1.07 3.4A2 2 0 0 1 3.07 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>

function Section({ title, icon: Icon, children, dark }) {
  const card = dark ? 'bg-[#0F1A2E] border-white/10' : 'bg-white border-slate-100'
  const txt  = dark ? 'text-white' : 'text-navy-900'
  return (
    <div className={`rounded-3xl border shadow-soft overflow-hidden ${card}`}>
      <div className={`flex items-center gap-2.5 px-6 py-4 border-b ${dark ? 'border-white/10' : 'border-slate-100'}`}>
        {Icon && <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Icon size={15}/></div>}
        <span className={`font-bold ${txt}`}>{title}</span>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

function Field({ label, dark, children }) {
  const sub = dark ? 'text-white/50' : 'text-slate-500'
  return (
    <div>
      <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${sub}`}>{label}</label>
      {children}
    </div>
  )
}

function Input({ dark, ...props }) {
  return (
    <input
      className={`w-full h-11 px-4 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-300 transition ${
        dark
          ? 'bg-white/5 border-white/10 text-white placeholder-white/30'
          : 'bg-slate-50 border-slate-200 text-navy-900 placeholder-slate-400'
      }`}
      {...props}
    />
  )
}

function SaveButton({ loading, saved, dark, onClick }) {
  return (
    <button onClick={onClick} disabled={loading}
      className={`h-10 px-6 rounded-2xl text-sm font-semibold transition flex items-center gap-2 ${
        saved
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-60'
      }`}>
      {loading ? <><I.Loader size={14}/> Enregistrement…</> : saved ? <><I.Check size={14}/> Enregistré</> : 'Enregistrer'}
    </button>
  )
}

export default function UDProfile() {
  const { dark } = useOutletContext()
  const fileRef = useRef(null)

  const txt  = dark ? 'text-white' : 'text-navy-900'
  const sub  = dark ? 'text-white/50' : 'text-slate-500'
  const card = dark ? 'bg-[#0F1A2E] border-white/10' : 'bg-white border-slate-100'
  const divider = dark ? 'border-white/10' : 'border-slate-100'

  // Form states
  const [avatar, setAvatar]       = useState(null)
  const [firstName, setFirstName] = useState('Jean Kevin')
  const [lastName, setLastName]   = useState('PEMOU')
  const [email, setEmail]         = useState('jk.pemou@exemple.fr')
  const [phone, setPhone]         = useState('+33 6 12 34 56 78')
  const [bio, setBio]             = useState('')
  const [city, setCity]           = useState('Paris')
  const [infoSaved, setInfoSaved] = useState(false)
  const [infoLoading, setInfoLoading] = useState(false)

  const [currentPw, setCurrentPw]   = useState('')
  const [newPw, setNewPw]           = useState('')
  const [confirmPw, setConfirmPw]   = useState('')
  const [showPw, setShowPw]         = useState(false)
  const [pwError, setPwError]       = useState('')
  const [pwSaved, setPwSaved]       = useState(false)
  const [pwLoading, setPwLoading]   = useState(false)

  const [notifEmail, setNotifEmail]   = useState(true)
  const [notifPush, setNotifPush]     = useState(true)
  const [notifMatch, setNotifMatch]   = useState(true)
  const [notifPrice, setNotifPrice]   = useState(true)
  const [notifNewsl, setNotifNewsl]   = useState(false)
  const [notifSaved, setNotifSaved]   = useState(false)

  const [showDelete, setShowDelete]   = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setAvatar(URL.createObjectURL(file))
  }

  const saveInfo = async () => {
    setInfoLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setInfoLoading(false)
    setInfoSaved(true)
    setTimeout(() => setInfoSaved(false), 3000)
  }

  const savePw = async () => {
    setPwError('')
    if (newPw.length < 8) { setPwError('Le mot de passe doit contenir au moins 8 caractères.'); return }
    if (newPw !== confirmPw) { setPwError('Les mots de passe ne correspondent pas.'); return }
    setPwLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setPwLoading(false)
    setPwSaved(true)
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    setTimeout(() => setPwSaved(false), 3000)
  }

  const saveNotif = async () => {
    await new Promise(r => setTimeout(r, 400))
    setNotifSaved(true)
    setTimeout(() => setNotifSaved(false), 2500)
  }

  const Toggle = ({ value, onChange }) => (
    <button onClick={() => onChange(!value)}
      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${value ? 'bg-orange-600' : dark ? 'bg-white/20' : 'bg-slate-200'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? 'left-6' : 'left-1'}`}/>
    </button>
  )

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Compte</div>
        <h1 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${txt}`}>Mon profil</h1>
        <p className={`text-sm mt-1 ${sub}`}>Gérez vos informations personnelles et préférences.</p>
      </div>

      {/* Avatar + identity header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl border shadow-soft p-6 flex items-center gap-5 ${card}`}>
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-navy-900 flex items-center justify-center">
            {avatar
              ? <img src={avatar} alt="avatar" className="w-full h-full object-cover"/>
              : <span className="text-white text-2xl font-extrabold">{initials}</span>
            }
          </div>
          <button onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-soft transition">
            <Camera size={13}/>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className={`font-extrabold text-lg ${txt}`}>{firstName} {lastName}</div>
          <div className={`text-sm ${sub}`}>{email}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge tone="orange">Plan Pro</Badge>
            <Badge tone="emerald">KYC vérifié</Badge>
          </div>
        </div>
      </motion.div>

      {/* Personal info */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}>
        <Section title="Informations personnelles" icon={I.User} dark={dark}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Prénom" dark={dark}>
                <Input dark={dark} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom"/>
              </Field>
              <Field label="Nom" dark={dark}>
                <Input dark={dark} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom"/>
              </Field>
            </div>
            <Field label="E-mail" dark={dark}>
              <div className={`flex items-center gap-3 h-11 px-4 rounded-2xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <I.Mail size={14} className={sub}/>
                <span className={`text-sm flex-1 ${txt}`}>{email}</span>
                <Badge tone="emerald">Vérifié</Badge>
              </div>
            </Field>
            <Field label="Téléphone" dark={dark}>
              <div className={`flex items-center gap-3 h-11 px-4 rounded-2xl border ${dark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <Phone size={14} className={sub}/>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  className={`flex-1 bg-transparent text-sm focus:outline-none ${dark ? 'text-white placeholder-white/30' : 'text-navy-900 placeholder-slate-400'}`}
                  placeholder="+33 6 …"/>
              </div>
            </Field>
            <Field label="Ville" dark={dark}>
              <Input dark={dark} value={city} onChange={e => setCity(e.target.value)} placeholder="Paris"/>
            </Field>
            <Field label="Bio (optionnel)" dark={dark}>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Quelques mots sur vous…"
                className={`w-full px-4 py-3 rounded-2xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-300 transition ${
                  dark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'bg-slate-50 border-slate-200 text-navy-900 placeholder-slate-400'
                }`}/>
            </Field>
            <div className="flex justify-end pt-1">
              <SaveButton loading={infoLoading} saved={infoSaved} dark={dark} onClick={saveInfo}/>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Password */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
        <Section title="Sécurité — Mot de passe" icon={Key} dark={dark}>
          <div className="space-y-4">
            <Field label="Mot de passe actuel" dark={dark}>
              <div className={`flex items-center gap-3 h-11 px-4 rounded-2xl border transition focus-within:ring-2 focus-within:ring-orange-500/30 focus-within:border-orange-300 ${dark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <I.Lock size={14} className={sub}/>
                <input type={showPw ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                  placeholder="••••••••"
                  className={`flex-1 bg-transparent text-sm focus:outline-none ${dark ? 'text-white placeholder-white/30' : 'text-navy-900 placeholder-slate-400'}`}/>
              </div>
            </Field>
            <Field label="Nouveau mot de passe" dark={dark}>
              <div className={`flex items-center gap-3 h-11 px-4 rounded-2xl border transition focus-within:ring-2 focus-within:ring-orange-500/30 focus-within:border-orange-300 ${dark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <I.Lock size={14} className={sub}/>
                <input type={showPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)}
                  placeholder="8 caractères minimum"
                  className={`flex-1 bg-transparent text-sm focus:outline-none ${dark ? 'text-white placeholder-white/30' : 'text-navy-900 placeholder-slate-400'}`}/>
                <button type="button" onClick={() => setShowPw(s => !s)} className={`transition ${dark ? 'text-white/40 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                  {showPw ? <I.EyeOff size={14}/> : <I.Eye size={14}/>}
                </button>
              </div>
              {/* Strength bar */}
              {newPw.length > 0 && (() => {
                const score = (newPw.length >= 8 ? 1 : 0) + (/[A-Z]/.test(newPw) ? 1 : 0) + (/[0-9]/.test(newPw) ? 1 : 0) + (/[^A-Za-z0-9]/.test(newPw) ? 1 : 0)
                const colors = ['bg-rose-500','bg-rose-500','bg-amber-500','bg-emerald-500','bg-emerald-500']
                const labels = ['Très faible','Faible','Moyen','Fort','Excellent']
                return (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[0,1,2,3].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i < score ? colors[score] : dark ? 'bg-white/10' : 'bg-slate-200'}`}/>)}
                    </div>
                    <div className={`text-[11px] mt-1 ${sub}`}>{labels[score]}</div>
                  </div>
                )
              })()}
            </Field>
            <Field label="Confirmer le mot de passe" dark={dark}>
              <div className={`flex items-center gap-3 h-11 px-4 rounded-2xl border transition focus-within:ring-2 focus-within:ring-orange-500/30 focus-within:border-orange-300 ${dark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <I.Lock size={14} className={sub}/>
                <input type={showPw ? 'text' : 'password'} value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                  placeholder="Répétez le nouveau mot de passe"
                  className={`flex-1 bg-transparent text-sm focus:outline-none ${dark ? 'text-white placeholder-white/30' : 'text-navy-900 placeholder-slate-400'}`}/>
              </div>
            </Field>
            {pwError && (
              <div className="flex items-center gap-2 text-sm text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-3 py-2 rounded-xl">
                <I.Alert size={14} className="shrink-0"/> {pwError}
              </div>
            )}
            <div className="flex justify-end pt-1">
              <SaveButton loading={pwLoading} saved={pwSaved} dark={dark} onClick={savePw}/>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Notification preferences */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
        <Section title="Préférences de notifications" icon={I.Bell} dark={dark}>
          <div className="space-y-4">
            {[
              { label: 'Notifications par e-mail',        sub: 'Résumés et alertes envoyés par mail',         val: notifEmail, set: setNotifEmail },
              { label: 'Notifications push',              sub: 'Alertes instantanées dans le navigateur',     val: notifPush,  set: setNotifPush  },
              { label: 'Nouvelles correspondances',       sub: 'Quand une annonce correspond à vos alertes',  val: notifMatch, set: setNotifMatch  },
              { label: 'Baisses de prix',                 sub: 'Quand un favori baisse de prix',              val: notifPrice, set: setNotifPrice  },
              { label: 'Newsletter PASMAL',               sub: 'Actualités du marché et conseils (mensuel)',  val: notifNewsl, set: setNotifNewsl  },
            ].map(({ label, sub: s, val, set }) => (
              <div key={label} className={`flex items-center justify-between py-3 border-b last:border-0 ${divider}`}>
                <div>
                  <div className={`text-sm font-medium ${txt}`}>{label}</div>
                  <div className={`text-xs mt-0.5 ${sub}`}>{s}</div>
                </div>
                <Toggle value={val} onChange={set}/>
              </div>
            ))}
            <div className="flex justify-end pt-1">
              <SaveButton loading={false} saved={notifSaved} dark={dark} onClick={saveNotif}/>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
        <div className={`rounded-3xl border p-6 ${dark ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50/50 border-rose-100'}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-rose-600 font-bold mb-0.5">Zone de danger</div>
              <div className={`text-sm ${sub}`}>La suppression est irréversible. Toutes vos données seront effacées.</div>
            </div>
            <button onClick={() => setShowDelete(true)}
              className="h-9 px-4 rounded-full border border-rose-300 text-rose-600 text-sm font-semibold hover:bg-rose-600 hover:text-white transition">
              Supprimer mon compte
            </button>
          </div>
        </div>
      </motion.div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDelete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowDelete(false); setDeleteConfirm('') }}
              className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50"/>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto rounded-3xl p-8 z-50 shadow-cardHover ${dark ? 'bg-[#0F1A2E]' : 'bg-white'}`}>
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <I.Trash size={22}/>
              </div>
              <h2 className={`text-xl font-extrabold text-center mb-2 ${txt}`}>Supprimer mon compte ?</h2>
              <p className={`text-sm text-center mb-5 ${sub}`}>
                Cette action est irréversible. Toutes vos annonces, favoris et données seront définitivement supprimés.
              </p>
              <div className="mb-4">
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${sub}`}>
                  Tapez <span className="text-rose-500 font-bold">SUPPRIMER</span> pour confirmer
                </label>
                <Input dark={dark} value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} placeholder="SUPPRIMER"/>
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowDelete(false); setDeleteConfirm('') }}
                  className={`flex-1 h-11 rounded-2xl text-sm font-semibold transition ${dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-navy-900'}`}>
                  Annuler
                </button>
                <button
                  disabled={deleteConfirm !== 'SUPPRIMER'}
                  className="flex-1 h-11 rounded-2xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white transition disabled:opacity-40 disabled:cursor-not-allowed">
                  Supprimer définitivement
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
