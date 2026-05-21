import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor,
  useSensor, useSensors, closestCorners, useDroppable,
} from '@dnd-kit/core'
import {
  SortableContext, useSortable, verticalListSortingStrategy,
  sortableKeyboardCoordinates, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { I, Button, Avatar, Badge } from '../lib/ui.jsx'

/* ============================================================
   CRM Leads — Kanban premium (HubSpot-style)
   - 5 colonnes drag-and-drop (HTML5 natif)
   - Cartes glassmorphism, animations Framer Motion
   - Mock data locale, aucun backend
   ============================================================ */

const COLUMNS = [
  { id: 'new', label: 'Nouveau lead', tone: 'orange', accent: '#FF6B00', bg: 'from-orange-50 to-orange-50/0' },
  { id: 'contacted', label: 'Contacté', tone: 'indigo', accent: '#6366F1', bg: 'from-indigo-50 to-indigo-50/0' },
  { id: 'visit', label: 'Visite', tone: 'amber', accent: '#F59E0B', bg: 'from-amber-50 to-amber-50/0' },
  { id: 'negotiation', label: 'Négociation', tone: 'navy', accent: '#0B1F3A', bg: 'from-slate-100 to-slate-50/0' },
  { id: 'won', label: 'Gagné', tone: 'emerald', accent: '#10B981', bg: 'from-emerald-50 to-emerald-50/0' },
]

const PROPERTY_TYPES = ['Studio', 'T2', 'T3', 'Maison', 'Villa', 'Colocation']
const SOURCES = ['SeLoger', 'Site PASMAL', 'Recommandation', 'Instagram', 'Salon']

const INITIAL_LEADS = [
  { id: 'l1',  status: 'new',         first: 'Camille',  last: 'Lefèvre',   city: 'Paris 11ᵉ',   type: 'T3',         budget: 480000,  score: 92, source: 'SeLoger',       lastSeen: 'Il y a 12 min', tags: ['Hot'] },
  { id: 'l2',  status: 'new',         first: 'Julien',   last: 'Moreau',    city: 'Lyon 6ᵉ',     type: 'Studio',     budget: 240000,  score: 78, source: 'Site PASMAL',   lastSeen: 'Il y a 1h' },
  { id: 'l3',  status: 'new',         first: 'Sofia',    last: 'Benali',    city: 'Marseille',   type: 'T2',         budget: 195000,  score: 65, source: 'Instagram',     lastSeen: 'Il y a 3h' },
  { id: 'l4',  status: 'contacted',   first: 'Marc',     last: 'Dubois',    city: 'Bordeaux',    type: 'Maison',     budget: 720000,  score: 88, source: 'Recommandation',lastSeen: 'Hier' },
  { id: 'l5',  status: 'contacted',   first: 'Élodie',   last: 'Garnier',   city: 'Nantes',      type: 'T3',         budget: 365000,  score: 71, source: 'SeLoger',       lastSeen: 'Hier' },
  { id: 'l6',  status: 'contacted',   first: 'Thomas',   last: 'Robert',    city: 'Toulouse',    type: 'Colocation', budget: 850,     score: 54, source: 'Salon',         lastSeen: 'Il y a 2j' },
  { id: 'l7',  status: 'visit',       first: 'Inès',     last: 'Martin',    city: 'Paris 8ᵉ',    type: 'Villa',      budget: 1850000, score: 94, source: 'Recommandation',lastSeen: 'Aujourd\'hui', tags: ['VIP'] },
  { id: 'l8',  status: 'visit',       first: 'Antoine',  last: 'Petit',     city: 'Nice',        type: 'T2',         budget: 320000,  score: 82, source: 'SeLoger',       lastSeen: 'Il y a 3j' },
  { id: 'l9',  status: 'negotiation', first: 'Léa',      last: 'Bernard',   city: 'Lille',       type: 'T3',         budget: 295000,  score: 86, source: 'Site PASMAL',   lastSeen: 'Il y a 4j', tags: ['Offre'] },
  { id: 'l10', status: 'negotiation', first: 'Karim',    last: 'Hamidi',    city: 'Strasbourg',  type: 'Maison',     budget: 540000,  score: 79, source: 'SeLoger',       lastSeen: 'Il y a 5j' },
  { id: 'l11', status: 'won',         first: 'Charlotte',last: 'Lemoine',   city: 'Rennes',      type: 'T2',         budget: 248000,  score: 100,source: 'Recommandation',lastSeen: 'La semaine dernière', tags: ['Signé'] },
  { id: 'l12', status: 'won',         first: 'Hugo',     last: 'Vincent',   city: 'Montpellier', type: 'Studio',     budget: 178000,  score: 100,source: 'Site PASMAL',   lastSeen: 'La semaine dernière' },
]

const AVATARS = {
  l1: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  l4: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  l7: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
  l11: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
}

const fmtBudget = (n) => n.toLocaleString('fr-FR') + ' €'

export default function CRM() {
  const [leads, setLeads] = useState(INITIAL_LEADS)
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  const [minBudget, setMinBudget] = useState('')
  const [activeId, setActiveId] = useState(null)

  /* ----------- dnd-kit sensors ----------- */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const isColumnId = (id) => COLUMNS.some((c) => c.id === id)
  const findLead = (id) => leads.find((l) => l.id === id)

  const onDragStart = (event) => setActiveId(event.active.id)

  /* While dragging across columns, update the lead's status live so
     the card visually re-homes itself in the new column. */
  const onDragOver = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const activeLead = findLead(active.id); if (!activeLead) return

    // Dropping on a column placeholder (e.g. empty column)
    if (isColumnId(over.id)) {
      if (activeLead.status !== over.id) {
        setLeads((prev) => prev.map((l) => (l.id === active.id ? { ...l, status: over.id } : l)))
      }
      return
    }

    // Dropping above another card — change column if needed and insert before
    const overLead = findLead(over.id); if (!overLead) return
    if (activeLead.status !== overLead.status) {
      setLeads((prev) => {
        const next = prev.map((l) => (l.id === active.id ? { ...l, status: overLead.status } : l))
        const oldIdx = next.findIndex((l) => l.id === active.id)
        const newIdx = next.findIndex((l) => l.id === over.id)
        if (oldIdx === -1 || newIdx === -1) return next
        return arrayMove(next, oldIdx, newIdx)
      })
    }
  }

  /* On drop: commit within-column reorder if any. */
  const onDragEnd = (event) => {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return
    if (isColumnId(over.id)) return
    const oldIdx = leads.findIndex((l) => l.id === active.id)
    const newIdx = leads.findIndex((l) => l.id === over.id)
    if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
      setLeads(arrayMove(leads, oldIdx, newIdx))
    }
  }

  const onDragCancel = () => setActiveId(null)
  const activeLead = activeId ? findLead(activeId) : null

  /* ----------- Filtering ----------- */
  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (search) {
        const q = search.toLowerCase()
        if (!`${l.first} ${l.last} ${l.city} ${l.type}`.toLowerCase().includes(q)) return false
      }
      if (sourceFilter && l.source !== sourceFilter) return false
      if (minBudget && l.budget < Number(minBudget)) return false
      return true
    })
  }, [leads, search, sourceFilter, minBudget])

  const grouped = useMemo(() => {
    const g = Object.fromEntries(COLUMNS.map((c) => [c.id, []]))
    filtered.forEach((l) => { if (g[l.status]) g[l.status].push(l) })
    return g
  }, [filtered])

  /* ----------- Stats ----------- */
  const totalPipeline = leads.filter((l) => l.status !== 'won').reduce((s, l) => s + l.budget, 0)
  const wonValue = leads.filter((l) => l.status === 'won').reduce((s, l) => s + l.budget, 0)
  const winRate = leads.length ? Math.round((leads.filter((l) => l.status === 'won').length / leads.length) * 100) : 0

  const resetFilters = () => { setSearch(''); setSourceFilter(''); setMinBudget('') }

  return (
    <div className="space-y-6 relative">
      {/* Decorative gradient blobs for glassmorphism backdrop */}
      <div className="absolute -top-10 left-1/4 w-[420px] h-[420px] rounded-full bg-orange-200 blur-3xl opacity-25 pointer-events-none -z-0" />
      <div className="absolute top-40 -right-20 w-[460px] h-[460px] rounded-full bg-indigo-200 blur-3xl opacity-25 pointer-events-none -z-0" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <div>
            <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Pipeline commercial</div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-navy-900 tracking-tight">CRM Leads</h1>
            <p className="text-slate-600 mt-1 text-sm">{leads.length} leads · {COLUMNS.length} étapes · {winRate}% de taux de gain</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><I.Download size={14}/> Exporter</Button>
            <Button size="sm"><I.Plus size={14}/> Nouveau lead</Button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard icon={I.TrendingUp} label="Valeur pipeline" value={fmtBudget(totalPipeline)} tone="orange" />
          <StatCard icon={I.CheckCircle} label="Valeur gagnée" value={fmtBudget(wonValue)} tone="emerald" />
          <StatCard icon={I.Users} label="Leads actifs" value={leads.filter((l) => l.status !== 'won').length} tone="indigo" />
          <StatCard icon={I.BadgeCheck} label="Taux de gain" value={`${winRate}%`} tone="navy" />
        </div>

        {/* Filters bar (glass) */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-soft rounded-2xl p-2 mb-5 flex items-center gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3 h-10 bg-white/70 border border-slate-100 rounded-xl">
            <I.Search size={14} className="text-slate-400"/>
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un lead, une ville, un type…"
              className="flex-1 bg-transparent text-sm text-navy-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="h-10 px-3 bg-white/70 border border-slate-100 rounded-xl text-sm text-navy-900 focus:outline-none">
            <option value="">Toutes les sources</option>
            {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-2 px-3 h-10 bg-white/70 border border-slate-100 rounded-xl">
            <I.Tag size={14} className="text-slate-400"/>
            <input
              type="number" value={minBudget} onChange={(e) => setMinBudget(e.target.value)}
              placeholder="Budget min." className="w-28 bg-transparent text-sm text-navy-900 placeholder-slate-400 focus:outline-none"
            />
          </div>
          {(search || sourceFilter || minBudget) && (
            <button onClick={resetFilters} className="text-xs text-slate-500 hover:text-orange-600 px-2 flex items-center gap-1">
              <I.X size={12}/> Effacer
            </button>
          )}
        </div>

        {/* Kanban board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 lg:-mx-8 px-4 lg:px-8 snap-x snap-mandatory lg:snap-none">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                col={col}
                cards={grouped[col.id] || []}
                activeId={activeId}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{ duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }}>
            {activeLead ? <LeadCard lead={activeLead} overlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}

/* ============================================================
   Kanban column — droppable, hosts a SortableContext
   ============================================================ */
function KanbanColumn({ col, cards, activeId }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id })
  const value = cards.reduce((s, l) => s + l.budget, 0)
  const showActiveHint = isOver && activeId

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-[88vw] sm:w-[340px] snap-center rounded-3xl border transition-all ${
        showActiveHint ? 'border-orange-300 bg-orange-50/60 shadow-card' : 'border-white/40 bg-white/55 backdrop-blur-xl'
      }`}
    >
      {/* Column header */}
      <div className={`relative rounded-t-3xl px-4 py-3.5 bg-gradient-to-b ${col.bg}`}>
        <span className="absolute top-0 left-4 right-4 h-[3px] rounded-b-full" style={{ background: col.accent }} />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: col.accent }} />
            <h3 className="font-bold text-navy-900 text-sm">{col.label}</h3>
            <span className="text-xs font-semibold text-slate-500 bg-white border border-slate-100 rounded-full px-2 py-0.5">{cards.length}</span>
          </div>
          <button className="w-7 h-7 rounded-lg hover:bg-white/80 text-slate-500 hover:text-navy-900 flex items-center justify-center transition">
            <I.Plus size={14}/>
          </button>
        </div>
        {value > 0 && (
          <div className="text-[11px] text-slate-500 mt-1">Valeur : <span className="font-semibold text-navy-900">{fmtBudget(value)}</span></div>
        )}
      </div>

      {/* Cards (sortable) */}
      <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="p-3 space-y-2.5 min-h-[120px] max-h-[calc(100vh-360px)] overflow-y-auto no-scrollbar">
          <AnimatePresence>
            {cards.map((lead) => (
              <SortableLeadCard key={lead.id} lead={lead} />
            ))}
          </AnimatePresence>
          {cards.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">Glissez un lead ici</div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

/* ============================================================
   Sortable wrapper around LeadCard
   ============================================================ */
function SortableLeadCard({ lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard lead={lead} dragging={isDragging} />
    </div>
  )
}

/* ============================================================
   Lead card (glassmorphism, draggable)
   ============================================================ */
function LeadCard({ lead, dragging = false, overlay = false }) {
  const score = lead.score
  const scoreColor = score >= 85 ? '#10B981' : score >= 65 ? '#F59E0B' : '#94A3B8'
  const avatarSrc = AVATARS[lead.id]

  return (
    <motion.article
      initial={overlay ? false : { opacity: 0, y: 8 }}
      animate={overlay ? { scale: 1.03 } : { opacity: dragging ? 0.35 : 1, y: 0, scale: 1 }}
      exit={overlay ? undefined : { opacity: 0, y: -8 }}
      whileHover={overlay ? undefined : { y: -3 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className={`group bg-white/85 backdrop-blur-md border rounded-2xl p-3.5 select-none cursor-grab active:cursor-grabbing ${
        overlay ? 'border-orange-200 shadow-cardHover rotate-1' : 'border-white/60 shadow-soft hover:shadow-card'
      }`}
    >
      {/* Header row: avatar + name + score */}
      <div className="flex items-start gap-3">
        <Avatar name={`${lead.first} ${lead.last}`} src={avatarSrc} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <div className="font-semibold text-navy-900 text-[13px] truncate">{lead.first} {lead.last}</div>
            {lead.tags?.includes('VIP') && (
              <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md tracking-wider">VIP</span>
            )}
            {lead.tags?.includes('Hot') && (
              <span className="text-[9px] font-extrabold uppercase bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-md tracking-wider">Hot</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
            <I.MapPin size={10}/> {lead.city}
          </div>
        </div>

        {/* Lead score gauge */}
        <div className="flex flex-col items-end shrink-0">
          <div className="relative w-9 h-9">
            <svg viewBox="0 0 36 36" className="w-9 h-9 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#E2E8F0" strokeWidth="3"/>
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke={scoreColor} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 94.25} 94.25`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-navy-900">
              {score}
            </div>
          </div>
        </div>
      </div>

      {/* Property type + budget */}
      <div className="mt-3 flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
        <div className="inline-flex items-center gap-1 bg-slate-100 text-navy-900 text-[11px] font-semibold px-2 py-1 rounded-md">
          <I.Building size={11} className="text-orange-600"/> {lead.type}
        </div>
        <div className="text-[13px] font-extrabold text-navy-900 tracking-tight">{fmtBudget(lead.budget)}</div>
      </div>

      {/* Footer: source + actions */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
        <span className="truncate">{lead.source} · {lead.lastSeen}</span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button title="Appeler" className="w-6 h-6 rounded-md hover:bg-emerald-50 hover:text-emerald-600 flex items-center justify-center"><I.Phone size={12}/></button>
          <button title="E-mail" className="w-6 h-6 rounded-md hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center"><I.Mail size={12}/></button>
          <button title="Message" className="w-6 h-6 rounded-md hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center"><I.MessageSquare size={12}/></button>
          <button title="Plus" className="w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center"><I.MoreH size={12}/></button>
        </div>
      </div>
    </motion.article>
  )
}

/* ============================================================
   Small KPI strip card
   ============================================================ */
function StatCard({ icon: Icon, label, value, tone = 'orange' }) {
  const tones = {
    orange: 'bg-orange-50 text-orange-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    navy: 'bg-navy-900 text-white',
  }
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-4 shadow-soft flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${tones[tone]} flex items-center justify-center shrink-0`}>
        <Icon size={18}/>
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-slate-500 truncate">{label}</div>
        <div className="font-extrabold text-navy-900 text-base lg:text-lg truncate">{value}</div>
      </div>
    </div>
  )
}
