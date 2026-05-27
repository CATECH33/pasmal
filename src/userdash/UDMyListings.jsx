import React, { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { I, Badge } from '../lib/ui.jsx'

const LISTINGS = [
  {
    id: 1,
    title: 'Appartement T3 lumineux — Bastille',
    type: 'Appartement',
    transaction: 'Vente',
    price: 680000,
    surface: 74,
    rooms: 3,
    city: 'Paris 11e',
    status: 'active',
    views: 1243,
    contacts: 18,
    publishedAt: '2026-05-01',
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=70',
  },
  {
    id: 2,
    title: 'Studio moderne — République',
    type: 'Studio',
    transaction: 'Location',
    price: 1100,
    surface: 28,
    rooms: 1,
    city: 'Paris 10e',
    status: 'active',
    views: 842,
    contacts: 31,
    publishedAt: '2026-04-20',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70',
  },
  {
    id: 3,
    title: 'Maison avec jardin — Chartrons',
    type: 'Maison',
    transaction: 'Vente',
    price: 498000,
    surface: 110,
    rooms: 5,
    city: 'Bordeaux',
    status: 'paused',
    views: 327,
    contacts: 7,
    publishedAt: '2026-03-15',
    img: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=70',
  },
  {
    id: 4,
    title: 'T2 vue Saone — Confluence',
    type: 'Appartement',
    transaction: 'Vente',
    price: 295000,
    surface: 48,
    rooms: 2,
    city: 'Lyon 2e',
    status: 'expired',
    views: 580,
    contacts: 12,
    publishedAt: '2026-01-10',
    img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=70',
  },
]

const STATUS_CFG = {
  active:  { label: 'Actif',    tone: 'emerald', dot: '#10B981' },
  paused:  { label: 'En pause', tone: 'amber',   dot: '#F59E0B' },
  expired: { label: 'Expire',   tone: 'slate',   dot: '#94A3B8' },
}

const TABS = ['Toutes', 'Actives', 'En pause', 'Expirees']
const TAB_STATUS = { 'Toutes': null, 'Actives': 'active', 'En pause': 'paused', 'Expirees': 'expired' }

function fmt(n) { return n.toLocaleString('fr-FR') }

export default function UDMyListings() {
  const { dark } = useOutletContext()
  const [tab, setTab]               = useState('Toutes')
  const [listings, setListings]     = useState(LISTINGS)
  const [confirmDelete, setConfirm] = useState(null)

  const txt  = dark ? 'text-white'           : 'text-navy-900'
  const sub  = dark ? 'text-white/50'        : 'text-slate-500'
  const card = dark ? 'bg-[#0F1A2E] border-white/10' : 'bg-white border-slate-100'
  const chip = dark ? 'bg-white/10 text-white/70'    : 'bg-slate-100 text-slate-600'

  const filterStatus = TAB_STATUS[tab]
  const filtered = filterStatus ? listings.filter(l => l.status === filterStatus) : listings

  const activeCount    = listings.filter(l => l.status === 'active').length
  const totalViews     = listings.reduce((s, l) => s + l.views, 0)
  const totalContacts  = listings.reduce((s, l) => s + l.contacts, 0)

  const togglePause = (id) => setListings(ls =>
    ls.map(l => l.id === id ? { ...l, status: l.status === 'active' ? 'paused' : 'active' } : l)
  )

  const handleDelete = (id) => { setListings(ls => ls.filter(l => l.id !== id)); setConfirm(null) }

  const tabCount = (t) => {
    const s = TAB_STATUS[t]
    return s ? listings.filter(l => l.status === s).length : listings.length
  }

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Publication</div>
          <h1 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${txt}`}>Mes annonces</h1>
          <p className={`text-sm mt-1 ${sub}`}>Gerez et suivez vos annonces publiees sur PASMAL.</p>
        </div>
        <Link to="/"
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold h-10 px-5 rounded-full transition">
          <I.Plus size={16}/> Nouvelle annonce
        </Link>
      </div>

      {/* ── Stats ───────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { Icon: I.Building,      label: 'Annonces actives', value: activeCount },
          { Icon: I.Eye,           label: 'Vues totales',     value: fmt(totalViews) },
          { Icon: I.MessageSquare, label: 'Contacts recus',   value: totalContacts },
        ].map(({ Icon, label, value }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`rounded-2xl border p-4 shadow-soft ${card}`}>
            <div className={`flex items-center gap-1.5 text-xs font-medium mb-2 ${sub}`}>
              <Icon size={13}/> {label}
            </div>
            <div className={`text-2xl font-extrabold ${txt}`}>{value}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <div className={`inline-flex items-center gap-1 p-1 rounded-2xl ${dark ? 'bg-white/5' : 'bg-slate-100'}`}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition ${
              tab === t
                ? 'bg-orange-600 text-white shadow-sm'
                : dark ? 'text-white/60 hover:text-white' : 'text-slate-600 hover:text-navy-900'
            }`}>
            {t}
            <span className={`ml-1.5 text-[11px] ${tab === t ? 'text-orange-100' : sub}`}>
              ({tabCount(t)})
            </span>
          </button>
        ))}
      </div>

      {/* ── Listing cards ───────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className={`rounded-3xl border p-12 text-center shadow-soft ${card}`}>
          <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
            <I.Building size={24} className="text-orange-500"/>
          </div>
          <div className={`text-base font-bold ${txt}`}>Aucune annonce ici</div>
          <div className={`text-sm mt-1 ${sub}`}>Publiez votre premier bien pour commencer.</div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l, i) => {
            const s = STATUS_CFG[l.status]
            return (
              <motion.div key={l.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className={`rounded-3xl border p-4 flex gap-4 transition-shadow hover:shadow-card ${card} ${
                  l.status === 'expired' ? 'opacity-60' : ''
                }`}>

                {/* Photo */}
                <div className="shrink-0">
                  <img src={l.img} alt={l.title}
                    className={`w-28 h-24 rounded-2xl object-cover ${l.status === 'paused' ? 'grayscale' : ''}`}/>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">

                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <div className={`font-bold truncate ${txt}`}>{l.title}</div>
                      <div className={`flex items-center gap-1 text-xs mt-0.5 ${sub}`}>
                        <I.MapPin size={11}/> {l.city}
                        <span className="mx-1 opacity-40">·</span>
                        Publie le {new Date(l.publishedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.dot }}/>
                      <Badge tone={s.tone}>{s.label}</Badge>
                    </div>
                  </div>

                  {/* Chips */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${chip}`}>{l.type}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${chip}`}>{l.surface} m²</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${chip}`}>{l.rooms} piece{l.rooms > 1 ? 's' : ''}</span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      l.transaction === 'Vente'
                        ? (dark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-700')
                        : (dark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-700')
                    }`}>{l.transaction}</span>
                  </div>

                  {/* Price + stats + actions */}
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex items-center gap-4">
                      <div className={`text-base font-extrabold ${txt}`}>
                        {fmt(l.price)} {'€'}{l.transaction === 'Location' ? '/mois' : ''}
                      </div>
                      <div className={`flex items-center gap-3 text-xs ${sub}`}>
                        <span className="flex items-center gap-1"><I.Eye size={11}/> {fmt(l.views)}</span>
                        <span className="flex items-center gap-1"><I.MessageSquare size={11}/> {l.contacts} contacts</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button className={`flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold transition ${
                        dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-navy-900'
                      }`}>
                        <I.Edit size={12}/> Modifier
                      </button>

                      {l.status !== 'expired' && (
                        <button onClick={() => togglePause(l.id)}
                          className={`flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold transition ${
                            dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-navy-900'
                          }`}>
                          {l.status === 'active'
                            ? <><I.EyeOff size={12}/> Pause</>
                            : <><I.Eye    size={12}/> Reprendre</>}
                        </button>
                      )}

                      {l.status === 'active' && (
                        <button className="flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white transition">
                          <I.Zap size={12}/> Booster
                        </button>
                      )}

                      <button onClick={() => setConfirm(l.id)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                          dark ? 'text-white/30 hover:bg-rose-500/20 hover:text-rose-400' : 'text-slate-300 hover:bg-rose-50 hover:text-rose-500'
                        }`}>
                        <I.Trash size={13}/>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ── Delete confirmation modal ────────────────────────── */}
      <AnimatePresence>
        {confirmDelete !== null && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirm(null)}
              className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50"/>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className={`fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto rounded-3xl p-8 z-50 shadow-cardHover ${
                dark ? 'bg-[#0F1A2E]' : 'bg-white'
              }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${dark ? 'bg-rose-500/20' : 'bg-rose-50'}`}>
                <I.Trash size={24} className="text-rose-500"/>
              </div>
              <h2 className={`text-xl font-extrabold text-center mb-2 ${txt}`}>Supprimer cette annonce ?</h2>
              <p className={`text-sm text-center mb-6 ${sub}`}>Cette action est irreversible. Le bien sera definitvement retire de PASMAL.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirm(null)}
                  className={`flex-1 h-11 rounded-2xl text-sm font-semibold transition ${
                    dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-navy-900'
                  }`}>
                  Annuler
                </button>
                <button onClick={() => handleDelete(confirmDelete)}
                  className="flex-1 h-11 rounded-2xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white transition">
                  Supprimer
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
