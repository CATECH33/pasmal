import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const PREFS = ['Acheter', 'Louer', 'Investir']

export default function PageProfil({ dark }) {
  const [editing, setEditing] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [form, setForm] = useState({
    firstName: 'Jean', lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    city: 'Paris',
    pref: 'Acheter',
  })
  const [draft, setDraft] = useState(form)
  const fileRef = useRef()

  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const inp = dark
    ? 'bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-orange-500'
    : 'bg-slate-50 border-slate-200 text-navy-900 placeholder-slate-300 focus:border-orange-500'

  const handleSave = () => { setForm(draft); setEditing(false) }
  const handleCancel = () => { setDraft(form); setEditing(false) }

  const initials = `${form.firstName[0]}${form.lastName[0]}`.toUpperCase()

  return (
    <div className="p-6 space-y-5 max-w-xl mx-auto">
      {/* Avatar + identity */}
      <div className={`rounded-2xl border shadow-sm p-5 ${bd}`}>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow">
              {avatar
                ? <img src={avatar} alt="" className="w-full h-full object-cover" />
                : <span className="text-xl font-extrabold text-white">{initials}</span>
              }
            </div>
            {editing && (
              <>
                <button onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center shadow">
                  <I.Camera size={11} className="text-white" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0]
                    if (f) setAvatar(URL.createObjectURL(f))
                  }} />
              </>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-base font-extrabold ${tx}`}>{form.firstName} {form.lastName}</p>
            <p className={`text-xs mt-0.5 ${sx}`}>{form.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`flex items-center gap-1 text-[11px] ${sx}`}><I.MapPin size={11}/>{form.city}</span>
              <span className="text-[11px] font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">{form.pref}</span>
            </div>
          </div>
          <button onClick={() => { setDraft(form); setEditing(e => !e) }}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-bold transition ${
              dark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}>
            <I.Edit size={12}/> {editing ? 'Annuler' : 'Modifier'}
          </button>
        </div>
      </div>

      {/* Edit form */}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className={`rounded-2xl border shadow-sm p-5 space-y-4 ${bd}`}>
              <p className={`text-sm font-extrabold ${tx}`}>Modifier le profil</p>
              <div className="grid grid-cols-2 gap-3">
                {[['firstName','Prénom'],['lastName','Nom']].map(([k,label]) => (
                  <div key={k}>
                    <label className={`text-xs font-bold ${sx} block mb-1`}>{label}</label>
                    <input value={draft[k]} onChange={e => setDraft(p => ({ ...p, [k]: e.target.value }))}
                      className={`w-full h-9 rounded-xl border px-3 text-sm outline-none transition ${inp}`} />
                  </div>
                ))}
              </div>
              <div>
                <label className={`text-xs font-bold ${sx} block mb-1`}>E-mail</label>
                <input value={draft.email} onChange={e => setDraft(p => ({ ...p, email: e.target.value }))}
                  className={`w-full h-9 rounded-xl border px-3 text-sm outline-none transition ${inp}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-xs font-bold ${sx} block mb-1`}>Téléphone</label>
                  <input value={draft.phone} onChange={e => setDraft(p => ({ ...p, phone: e.target.value }))}
                    className={`w-full h-9 rounded-xl border px-3 text-sm outline-none transition ${inp}`} />
                </div>
                <div>
                  <label className={`text-xs font-bold ${sx} block mb-1`}>Ville</label>
                  <input value={draft.city} onChange={e => setDraft(p => ({ ...p, city: e.target.value }))}
                    className={`w-full h-9 rounded-xl border px-3 text-sm outline-none transition ${inp}`} />
                </div>
              </div>
              <div>
                <label className={`text-xs font-bold ${sx} block mb-1`}>Projet principal</label>
                <div className="flex gap-2">
                  {PREFS.map(p => (
                    <button key={p} onClick={() => setDraft(d => ({ ...d, pref: p }))}
                      className={`flex-1 h-9 rounded-xl text-xs font-bold transition ${
                        draft.pref === p ? 'bg-orange-500 text-white' : dark ? 'bg-white/10 text-white/60 hover:bg-white/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}>{p}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={handleSave}
                  className="flex-1 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition">
                  Enregistrer
                </button>
                <button onClick={handleCancel}
                  className={`flex-1 h-9 rounded-xl text-xs font-bold transition ${dark ? 'bg-white/10 text-white/60 hover:bg-white/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                  Annuler
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security */}
      <div className={`rounded-2xl border shadow-sm ${bd}`}>
        <div className={`px-5 py-4 border-b ${dark ? 'border-white/10' : 'border-slate-100'}`}>
          <p className={`text-sm font-extrabold ${tx}`}>Sécurité</p>
        </div>
        <div className="divide-y" style={{ borderColor: dark ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}>
          {[
            { label: 'Mot de passe', val: '••••••••••', Icon: I.Key },
            { label: 'Compte connecté', val: form.email, Icon: I.Mail },
          ].map(({ label, val, Icon }, i) => (
            <div key={i} className={`flex items-center gap-4 px-5 py-3.5 ${dark ? 'hover:bg-white/5' : 'hover:bg-slate-50'} transition cursor-pointer`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${dark ? 'bg-white/10' : 'bg-slate-100'}`}>
                <Icon size={14} className={sx} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${tx}`}>{label}</p>
                <p className={`text-[11px] ${sx}`}>{val}</p>
              </div>
              <I.ChevronRight size={14} className={sx} />
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className={`rounded-2xl border border-rose-200 shadow-sm p-5 ${dark ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50'}`}>
        <p className={`text-sm font-extrabold text-rose-600 mb-1`}>Zone de danger</p>
        <p className={`text-xs ${sx} mb-3`}>Ces actions sont irréversibles. Procédez avec précaution.</p>
        <button className="h-8 px-4 rounded-xl border border-rose-300 text-xs font-bold text-rose-600 hover:bg-rose-100 transition">
          Supprimer mon compte
        </button>
      </div>
    </div>
  )
}
