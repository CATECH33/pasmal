import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { I, Badge } from '../lib/ui.jsx'

const Layers = (p) => <svg width={p?.size||20} height={p?.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={p?.className}><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
const StickyNote = (p) => <svg width={p?.size||20} height={p?.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={p?.className}><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/></svg>
const Scale = (p) => <svg width={p?.size||20} height={p?.size||20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={p?.className}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>

const COLLECTIONS = [
  { id: 'all',       label: 'Tous les favoris', count: 12 },
  { id: 'paris',     label: 'Paris',            count: 5  },
  { id: 'invest',    label: 'Investissement',   count: 4  },
  { id: 'vacances',  label: 'Résidence sec.',   count: 3  },
]

const PROPERTIES = [
  { id: 1, col: 'paris',    title: 'T3 Paris 11e',            price: '680 000 €', size: 74,  rooms: 3, loc: 'Paris 11e',        img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=70', note: 'Voir pour le double séjour' },
  { id: 2, col: 'paris',    title: 'Studio Bastille',          price: '295 000 €', size: 28,  rooms: 1, loc: 'Paris 4e',         img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70', note: '' },
  { id: 3, col: 'invest',   title: 'T2 Nantes Île de Nantes', price: '198 000 €', size: 48,  rooms: 2, loc: 'Nantes',           img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=70', note: 'Rentabilité ~5.2%' },
  { id: 4, col: 'paris',    title: 'T4 Montmartre',            price: '950 000 €', size: 98,  rooms: 4, loc: 'Paris 18e',        img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=70', note: '' },
  { id: 5, col: 'invest',   title: 'Appart. Lyon Part-Dieu',  price: '320 000 €', size: 55,  rooms: 2, loc: 'Lyon 3e',          img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=70', note: 'À renégocier' },
  { id: 6, col: 'vacances', title: 'Villa Nice Cimiez',        price: '1 100 000 €', size: 180, rooms: 6, loc: 'Nice',          img: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=70', note: 'Budget trop élevé?' },
  { id: 7, col: 'paris',    title: 'T2 République',            price: '490 000 €', size: 52,  rooms: 2, loc: 'Paris 3e',         img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=70', note: '' },
  { id: 8, col: 'invest',   title: 'Studio Bordeaux Gare',    price: '165 000 €', size: 26,  rooms: 1, loc: 'Bordeaux',         img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&q=70', note: '' },
  { id: 9, col: 'vacances', title: 'Chalet Megève',            price: '890 000 €', size: 120, rooms: 5, loc: 'Megève',           img: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400&q=70', note: 'Saison hiver' },
]

function NoteModal({ prop, dark, onSave, onClose }) {
  const [note, setNote] = useState(prop.note)
  const txt  = dark ? 'text-white' : 'text-navy-900'
  const sub  = dark ? 'text-white/50' : 'text-slate-500'
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-50"/>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className={`fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto rounded-3xl p-6 z-50 shadow-cardHover ${dark ? 'bg-[#0F1A2E]' : 'bg-white'}`}>
        <div className="flex items-center gap-2 mb-4">
          <StickyNote size={18} className="text-orange-500"/>
          <div className={`font-bold ${txt}`}>Note — {prop.title}</div>
        </div>
        <textarea value={note} onChange={e => setNote(e.target.value)} rows={4}
          placeholder="Ajouter une note personnelle…"
          className={`w-full rounded-2xl border px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition ${
            dark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'bg-slate-50 border-slate-200 text-navy-900 placeholder-slate-400'
          }`}/>
        <div className="flex gap-3 mt-4">
          <button onClick={onClose} className={`flex-1 h-10 rounded-2xl text-sm font-semibold transition ${dark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 hover:bg-slate-200 text-navy-900'}`}>Annuler</button>
          <button onClick={() => { onSave(prop.id, note); onClose() }} className="flex-1 h-10 rounded-2xl text-sm font-semibold bg-orange-600 hover:bg-orange-700 text-white transition">Enregistrer</button>
        </div>
      </motion.div>
    </>
  )
}

export default function UDFavorites() {
  const { dark } = useOutletContext()
  const [activeCol, setActiveCol] = useState('all')
  const [properties, setProperties] = useState(PROPERTIES)
  const [selected, setSelected] = useState([])
  const [compareMode, setCompareMode] = useState(false)
  const [noteTarget, setNoteTarget] = useState(null)

  const txt  = dark ? 'text-white' : 'text-navy-900'
  const sub  = dark ? 'text-white/50' : 'text-slate-500'
  const card = dark ? 'bg-[#0F1A2E] border-white/10' : 'bg-white border-slate-100'

  const visible = activeCol === 'all' ? properties : properties.filter(p => p.col === activeCol)
  const removeFav = (id) => setProperties(ps => ps.filter(p => p.id !== id))
  const saveNote  = (id, note) => setProperties(ps => ps.map(p => p.id === id ? { ...p, note } : p))

  const toggleSelect = (id) => {
    setSelected(s =>
      s.includes(id) ? s.filter(x => x !== id) : s.length < 3 ? [...s, id] : s
    )
  }

  const compareProps = properties.filter(p => selected.includes(p.id))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-1">Ma sélection</div>
          <h1 className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${txt}`}>Favoris</h1>
          <p className={`text-sm mt-1 ${sub}`}>{properties.length} biens sauvegardés · {COLLECTIONS.length - 1} collections</p>
        </div>
        <button onClick={() => { setCompareMode(m => !m); setSelected([]) }}
          className={`inline-flex items-center gap-2 h-9 px-4 rounded-full text-sm font-semibold transition border ${
            compareMode
              ? 'bg-navy-900 text-white border-navy-900'
              : dark ? 'border-white/20 text-white hover:bg-white/10' : 'border-slate-200 text-navy-900 hover:bg-slate-100'
          }`}>
          <Scale size={14}/> {compareMode ? 'Arrêter la comparaison' : 'Comparer'}
        </button>
      </div>

      {compareMode && (
        <div className={`rounded-2xl border p-4 text-sm ${dark ? 'bg-orange-500/10 border-orange-500/20 text-orange-300' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
          <span className="font-semibold">Mode comparaison :</span> Sélectionnez 2 ou 3 biens puis cliquez sur "Comparer".
          {selected.length >= 2 && (
            <button className="ml-3 underline font-bold">Lancer la comparaison ({selected.length})</button>
          )}
        </div>
      )}

      {/* Collections tabs */}
      <div className="flex gap-2 flex-wrap">
        {COLLECTIONS.map(c => (
          <button key={c.id} onClick={() => setActiveCol(c.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition ${
              activeCol === c.id
                ? 'bg-navy-900 text-white shadow-soft'
                : dark ? 'bg-white/10 text-white/70 hover:bg-white/20' : 'bg-white text-navy-700 border border-slate-200 hover:bg-slate-50'
            }`}>
            <Layers size={13}/>
            {c.label}
            <span className={`text-[11px] font-bold px-1.5 rounded-full ${activeCol === c.id ? 'bg-white/20' : dark ? 'bg-white/10' : 'bg-slate-100'}`}>
              {c.count}
            </span>
          </button>
        ))}
        <button className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition ${
          dark ? 'border-white/20 text-white/60 hover:bg-white/10' : 'border-dashed border-slate-300 text-slate-500 hover:bg-slate-50'
        }`}>
          <I.Plus size={13}/> Nouvelle collection
        </button>
      </div>

      {/* Property grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {visible.map((p, i) => {
            const isSelected = selected.includes(p.id)
            return (
              <motion.div key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className={`rounded-3xl border overflow-hidden shadow-soft transition-all ${card}
                  ${isSelected ? 'ring-2 ring-orange-500 shadow-glow' : ''}
                `}
                onClick={() => compareMode && toggleSelect(p.id)}
              >
                {/* Image */}
                <div className="relative h-48">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent"/>
                  {/* Compare checkbox */}
                  {compareMode && (
                    <div className={`absolute top-3 left-3 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                      isSelected ? 'bg-orange-500 border-orange-500' : 'border-white/70 bg-black/20'
                    }`}>
                      {isSelected && <I.Check size={12} className="text-white"/>}
                    </div>
                  )}
                  {/* Heart remove */}
                  <button onClick={(e) => { e.stopPropagation(); removeFav(p.id) }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-rose-500 backdrop-blur-sm text-white flex items-center justify-center transition">
                    <I.Heart size={14} fill="currentColor"/>
                  </button>
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="text-base font-extrabold">{p.price}</div>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <div className={`font-semibold text-sm ${txt} mb-1`}>{p.title}</div>
                  <div className={`flex items-center gap-3 text-xs ${sub} mb-3`}>
                    <span className="flex items-center gap-1"><I.MapPin size={11}/> {p.loc}</span>
                    <span className="flex items-center gap-1"><I.Maximize size={11}/> {p.size} m²</span>
                    <span className="flex items-center gap-1"><I.Bed size={11}/> {p.rooms} p.</span>
                  </div>
                  {/* Note preview */}
                  {p.note && (
                    <div className={`text-xs px-3 py-2 rounded-xl mb-3 italic ${dark ? 'bg-white/5 text-white/50' : 'bg-slate-50 text-slate-500'}`}>
                      "{p.note}"
                    </div>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); setNoteTarget(p) }}
                    className={`flex items-center gap-1.5 text-xs font-medium transition ${dark ? 'text-white/50 hover:text-white' : 'text-slate-400 hover:text-navy-900'}`}>
                    <StickyNote size={12}/> {p.note ? 'Modifier la note' : 'Ajouter une note'}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {visible.length === 0 && (
        <div className={`rounded-3xl border p-12 text-center shadow-soft ${card}`}>
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <I.Heart size={24}/>
          </div>
          <div className={`font-bold text-lg ${txt}`}>Aucun favori dans cette collection</div>
          <div className={`text-sm mt-1 ${sub}`}>Ajoutez des biens à cette collection depuis la recherche.</div>
        </div>
      )}

      {/* Note modal */}
      <AnimatePresence>
        {noteTarget && (
          <NoteModal prop={noteTarget} dark={dark} onSave={saveNote} onClose={() => setNoteTarget(null)}/>
        )}
      </AnimatePresence>

      {/* Compare panel */}
      <AnimatePresence>
        {compareMode && selected.length >= 2 && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed inset-x-4 bottom-6 max-w-5xl mx-auto rounded-3xl shadow-cardHover border overflow-hidden z-40"
            style={{ background: dark ? '#0F1A2E' : '#fff', borderColor: dark ? 'rgba(255,255,255,0.1)' : '#E2E8F0' }}>
            <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: dark ? 'rgba(255,255,255,0.08)' : '#F1F5F9' }}>
              <div className={`font-bold ${txt}`}>Comparaison — {selected.length} biens</div>
              <button onClick={() => setSelected([])} className={`p-1.5 rounded-xl transition ${dark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-slate-100 text-slate-500'}`}>
                <I.X size={16}/>
              </button>
            </div>
            <div className={`grid grid-cols-${compareProps.length} divide-x`} style={{ '--tw-divide-opacity': 1, borderColor: dark ? 'rgba(255,255,255,0.05)' : '#F8FAFC' }}>
              {compareProps.map(p => (
                <div key={p.id} className="p-5">
                  <img src={p.img} alt="" className="w-full h-28 object-cover rounded-2xl mb-3"/>
                  <div className={`font-semibold text-sm ${txt}`}>{p.title}</div>
                  <div className="text-orange-500 font-bold">{p.price}</div>
                  <div className={`text-xs mt-2 space-y-1 ${sub}`}>
                    <div>{p.size} m² · {p.rooms} pièces</div>
                    <div>{p.loc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
