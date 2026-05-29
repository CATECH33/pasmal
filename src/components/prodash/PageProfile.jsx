import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

export default function PageProfile({ dark }) {
  const [editMode, setEditMode] = useState(false)
  const [desc, setDesc] = useState('Agence immobilière premium spécialisée dans les biens de prestige à Paris et en Île-de-France. 15 ans d\'expérience, 500+ transactions réussies.')
  const [phone, setPhone] = useState('+33 1 23 45 67 89')
  const [website, setWebsite] = useState('https://dupont-immo.fr')

  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'
  const inputCls = `w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all ${
    dark
      ? 'bg-white/10 border-white/20 text-white placeholder-white/30 focus:border-orange-400'
      : 'bg-white border-slate-200 text-navy-900 placeholder-slate-400 focus:border-orange-400 focus:shadow-[0_0_0_3px_rgba(251,146,60,0.10)]'
  }`

  return (
    <div className="p-6 space-y-5 max-w-3xl mx-auto">
      {/* Preview toggle */}
      <div className="flex items-center justify-between">
        <p className={`text-sm font-extrabold ${tx}`}>{editMode ? 'Modifier le profil' : 'Aperçu public'}</p>
        <button onClick={() => setEditMode(m => !m)}
          className="flex items-center gap-2 h-8 px-4 rounded-xl border-2 border-orange-400 text-orange-500 font-bold text-xs hover:bg-orange-50 transition">
          {editMode ? <><I.Globe size={13}/> Aperçu</> : <><I.Edit size={13}/> Modifier</>}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!editMode ? (
          <motion.div key="preview"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4">
            {/* Cover + Logo */}
            <div className={`rounded-2xl border overflow-hidden shadow-sm ${bd}`}>
              <div className="h-32 bg-gradient-to-r from-[#0B1F3A] to-[#1a3a6b] relative">
                <div className="absolute bottom-0 left-5 translate-y-1/2 w-16 h-16 rounded-2xl border-4 border-white bg-orange-500 flex items-center justify-center shadow-lg">
                  <I.Building size={22} className="text-white" />
                </div>
              </div>
              <div className="px-5 pt-10 pb-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={`text-lg font-extrabold ${tx}`}>Agence Dupont Immobilier</h2>
                      <I.BadgeCheck size={18} className="text-emerald-500" />
                    </div>
                    <p className={`text-sm ${sx} mt-0.5`}>Agence immobilière · Paris & ÎdF</p>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">Plan Visibilité</span>
                </div>
                <p className={`text-sm mt-3 leading-relaxed ${dark ? 'text-white/70' : 'text-slate-600'}`}>{desc}</p>
                <div className={`flex flex-wrap gap-4 mt-4 pt-4 border-t text-sm ${dark ? 'border-white/10' : 'border-slate-100'}`}>
                  <span className={`flex items-center gap-1.5 ${sx}`}><I.Phone size={13}/> {phone}</span>
                  <span className={`flex items-center gap-1.5 ${sx}`}><I.Globe size={13}/> {website}</span>
                  <span className={`flex items-center gap-1.5 ${sx}`}><I.Building size={13}/> 8 annonces actives</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="edit"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`rounded-2xl border shadow-sm p-5 space-y-4 ${bd}`}>
            <div>
              <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${sx}`}>Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4}
                className={`${inputCls} resize-none`} placeholder="Décrivez votre agence…" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${sx}`}>Téléphone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${sx}`}>Site web</label>
                <input value={website} onChange={e => setWebsite(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditMode(false)}
                className="flex-1 h-10 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-600 hover:border-slate-300 transition">
                Annuler
              </button>
              <button onClick={() => setEditMode(false)}
                className="flex-1 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition">
                Sauvegarder
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
