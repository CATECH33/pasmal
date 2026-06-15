import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../../lib/ui.jsx'
import { useAuth } from '../../features/auth/providers/AuthProvider.jsx'
import { useAuthAction, svc } from '../../features/auth/hooks/useAuth.js'
import { supabase } from '../../lib/supabase.js'
import { uploadAgencyLogo, uploadAgencyCover } from '../../features/auth/services/storageService.js'

const PLAN_LABEL = { basic: 'Plan Basic', premium: 'Plan Premium', enterprise: 'Plan Enterprise' }

export default function PageProfile({ dark }) {
  const { user, profile, loadProfile } = useAuth()
  const { run, loading: saving } = useAuthAction()

  const [agency,       setAgency]       = useState(null)
  const [editMode,     setEditMode]     = useState(false)
  const [desc,         setDesc]         = useState('')
  const [phone,        setPhone]        = useState('')
  const [website,      setWebsite]      = useState('')
  const [listingCount, setListingCount] = useState(null)
  const [uploadingLogo,  setUploadingLogo]  = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)

  useEffect(() => {
    if (!user) return
    svc.getAgency(user.id)
      .then(a => {
        setAgency(a)
        setDesc(a?.description ?? '')
        setPhone(a?.phone ?? '')
        setWebsite(a?.website ?? '')
      })
      .catch(() => {})
  }, [user])

  useEffect(() => {
    if (!user) return
    supabase
      .from('listings')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'active')
      .then(({ count }) => setListingCount(count ?? 0))
  }, [user])

  const save = async () => {
    const updated = await run(() => svc.updateAgency(user.id, { description: desc, phone, website }))
    if (updated !== null) {
      setAgency(updated)
      await loadProfile(user.id)
      setEditMode(false)
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploadingLogo(true)
    try {
      const url = await uploadAgencyLogo(user.id, file)
      await svc.updateAgency(user.id, { logo_url: url })
      setAgency(prev => ({ ...prev, logo_url: url }))
    } catch (err) {
      console.error('Logo upload failed:', err)
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploadingCover(true)
    try {
      const url = await uploadAgencyCover(user.id, file)
      await svc.updateAgency(user.id, { cover_url: url })
      setAgency(prev => ({ ...prev, cover_url: url }))
    } catch (err) {
      console.error('Cover upload failed:', err)
    } finally {
      setUploadingCover(false)
    }
  }

  const cancel = () => {
    setDesc(agency?.description ?? '')
    setPhone(agency?.phone ?? '')
    setWebsite(agency?.website ?? '')
    setEditMode(false)
  }

  const verified = profile?.kyc_status === 'approved'

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
      <div className="flex items-center justify-between">
        <p className={`text-sm font-extrabold ${tx}`}>{editMode ? 'Modifier le profil' : 'Aperçu public'}</p>
        <button onClick={() => setEditMode(m => !m)}
          className="flex items-center gap-2 h-8 px-4 rounded-xl border-2 border-orange-400 text-orange-500 font-bold text-xs hover:bg-orange-50 transition">
          {editMode ? <><I.Globe size={13} /> Aperçu</> : <><I.Edit size={13} /> Modifier</>}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!editMode ? (
          <motion.div key="preview"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4">
            <div className={`rounded-2xl border overflow-hidden shadow-sm ${bd}`}>
              {/* Cover */}
              <div className="h-32 relative overflow-hidden">
                {agency?.cover_url
                  ? <img src={agency.cover_url} alt="cover" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-r from-[#0B1F3A] to-[#1a3a6b]" />}
                {/* Logo */}
                <div className="absolute bottom-0 left-5 translate-y-1/2 w-16 h-16 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-orange-500 flex items-center justify-center">
                  {agency?.logo_url
                    ? <img src={agency.logo_url} alt="logo" className="w-full h-full object-cover" />
                    : <I.Building size={22} className="text-white" />}
                </div>
              </div>

              <div className="px-5 pt-10 pb-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={`text-lg font-extrabold ${tx}`}>{agency?.name ?? '—'}</h2>
                      {verified && <I.BadgeCheck size={18} className="text-emerald-500" />}
                    </div>
                    <p className={`text-sm ${sx} mt-0.5`}>
                      {agency?.business_type ?? 'Agence'}{agency?.city ? ` · ${agency.city}` : ''}
                    </p>
                  </div>
                  {agency?.plan && (
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full">
                      {PLAN_LABEL[agency.plan] ?? agency.plan}
                    </span>
                  )}
                </div>

                {desc && (
                  <p className={`text-sm mt-3 leading-relaxed ${dark ? 'text-white/70' : 'text-slate-600'}`}>{desc}</p>
                )}

                <div className={`flex flex-wrap gap-4 mt-4 pt-4 border-t text-sm ${dark ? 'border-white/10' : 'border-slate-100'}`}>
                  {phone   && <span className={`flex items-center gap-1.5 ${sx}`}><I.Phone size={13} /> {phone}</span>}
                  {website && <span className={`flex items-center gap-1.5 ${sx}`}><I.Globe size={13} /> {website}</span>}
                  {listingCount !== null && (
                    <span className={`flex items-center gap-1.5 ${sx}`}>
                      <I.Building size={13} /> {listingCount} annonce{listingCount !== 1 ? 's' : ''} active{listingCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="edit"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4">

            {/* ── Banner / Cover upload ── */}
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${bd}`}>
              <label className="block relative h-36 cursor-pointer group">
                {agency?.cover_url
                  ? <img src={agency.cover_url} alt="cover" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-r from-[#0B1F3A] to-[#1a3a6b]" />}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {uploadingCover
                    ? <I.Loader size={20} className="text-white" />
                    : <><I.Camera size={18} className="text-white" /><span className="text-white text-sm font-bold">Changer la bannière</span></>}
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploadingCover} />
              </label>

              {/* ── Logo upload ── */}
              <div className="px-5 pt-2 pb-5 relative">
                <label className="absolute -top-8 left-5 w-16 h-16 rounded-2xl border-4 border-white shadow-lg overflow-hidden cursor-pointer group">
                  {agency?.logo_url
                    ? <img src={agency.logo_url} alt="logo" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-orange-500 flex items-center justify-center"><I.Building size={22} className="text-white" /></div>}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {uploadingLogo ? <I.Loader size={14} className="text-white" /> : <I.Camera size={14} className="text-white" />}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
                </label>
                <div className="pt-10">
                  <p className={`text-[11px] ${sx}`}>Cliquez sur la bannière ou le logo pour les modifier. Formats : JPG, PNG, WebP.</p>
                </div>
              </div>
            </div>

            {/* ── Text fields ── */}
            <div className={`rounded-2xl border shadow-sm p-5 space-y-4 ${bd}`}>
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
                <button onClick={cancel}
                  className="flex-1 h-10 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-600 hover:border-slate-300 transition">
                  Annuler
                </button>
                <button onClick={save} disabled={saving}
                  className="flex-1 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition disabled:opacity-50">
                  {saving ? 'Enregistrement…' : 'Sauvegarder'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
