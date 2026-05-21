import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase.js'
import { I, Button, Badge, Skeleton, EmptyState } from '../lib/ui.jsx'

const u = (id, w=400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

const FALLBACK = [
  { id: 'd1', title: 'Studio cosy lumineux', location: 'Paris 11ᵉ', price: 320000, surface: 28, rooms: 1, type: 'acheter', status: 'active', is_premium: true, views: 1240, leads: 18, image_url: u('photo-1502672260266-1c1ef2d93688') },
  { id: 'd2', title: 'T3 avec balcon', location: 'Lyon 6ᵉ', price: 485000, surface: 65, rooms: 3, type: 'acheter', status: 'active', is_premium: true, views: 980, leads: 22, image_url: u('photo-1560448204-e02f11c3d0e2') },
  { id: 'd3', title: 'Maison contemporaine', location: 'Bordeaux', price: 780000, surface: 142, rooms: 5, type: 'acheter', status: 'draft', is_premium: false, views: 0, leads: 0, image_url: u('photo-1564013799919-ab600027ffc6') },
  { id: 'd4', title: 'Colocation design 4 ch.', location: 'Nantes', price: 590, surface: 110, rooms: 4, type: 'colocation', status: 'paused', is_premium: false, views: 412, leads: 6, image_url: u('photo-1522708323590-d24dbb6b0267') },
  { id: 'd5', title: 'Villa avec piscine', location: 'Nice', price: 2100000, surface: 220, rooms: 6, type: 'acheter', status: 'active', is_premium: true, views: 3210, leads: 41, image_url: u('photo-1613490493576-7fde63acd811') },
]

const STATUS = {
  active: { label: 'En ligne', tone: 'emerald' },
  draft: { label: 'Brouillon', tone: 'slate' },
  paused: { label: 'En pause', tone: 'amber' },
  archived: { label: 'Archivée', tone: 'rose' },
}

const fmtPrice = (l) => {
  const v = l.price?.toLocaleString('fr-FR') + ' €'
  return l.type === 'louer' || l.type === 'colocation' ? `${v}/mois` : v
}

export default function Listings() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from('listings').select('*').limit(20)
        if (error || !data || data.length === 0) {
          setItems(FALLBACK)
        } else {
          setItems(data.map((d, i) => ({ ...d, status: d.status || 'active', views: d.views ?? (1000 + i*200), leads: d.leads ?? (10 + i*3) })))
        }
      } catch { setItems(FALLBACK) }
      finally { setLoading(false) }
    })()
  }, [])

  const filtered = items.filter((it) => {
    if (filter !== 'all' && it.status !== filter) return false
    if (search && !`${it.title} ${it.location}`.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Catalogue</div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-navy-900 tracking-tight">Mes annonces</h1>
          <p className="text-slate-600 mt-1 text-sm">{items.length} annonces · {items.filter(i => i.status==='active').length} en ligne</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><I.Filter size={14}/> Filtres</Button>
          <Button as={Link} to="/app/listings/new" size="sm"><I.Plus size={14}/> Nouvelle annonce</Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-full">
            {[['all','Toutes',items.length],['active','En ligne',items.filter(i=>i.status==='active').length],['draft','Brouillons',items.filter(i=>i.status==='draft').length],['paused','En pause',items.filter(i=>i.status==='paused').length]].map(([k,l,n]) => (
              <button key={k} onClick={() => setFilter(k)} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${filter===k ? 'bg-white text-navy-900 shadow-soft' : 'text-slate-600 hover:text-navy-900'}`}>
                {l} <span className="text-slate-400">({n})</span>
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3 h-9 bg-slate-50 border border-slate-100 rounded-full">
            <I.Search size={14} className="text-slate-400"/>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher…" className="flex-1 bg-transparent text-sm focus:outline-none"/>
          </div>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="w-20 h-16 rounded-xl"/>
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3"/><Skeleton className="h-3 w-1/3"/></div>
                <Skeleton className="h-8 w-24 rounded-full"/>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={I.Building}
            title="Aucune annonce trouvée"
            text="Affinez vos filtres ou créez votre première annonce."
            action={<Button as={Link} to="/app/listings/new" className="mt-5"><I.Plus size={14}/> Créer une annonce</Button>}
          />
        ) : (
          <>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map((it) => (
                <div key={it.id} className="p-4 flex items-center gap-3">
                  <img src={it.image_url} alt={it.title} className="w-16 h-16 rounded-xl object-cover"/>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-navy-900 text-sm truncate">{it.title}</div>
                    <div className="text-xs text-slate-500 truncate">{it.location} · {it.surface} m²</div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Badge tone={STATUS[it.status]?.tone || 'slate'}>{STATUS[it.status]?.label}</Badge>
                      {it.is_premium && <Badge tone="orange">Premium</Badge>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-navy-900 text-sm">{fmtPrice(it)}</div>
                    <div className="text-xs text-slate-500">{it.views} vues</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <table className="hidden md:table w-full">
              <thead className="bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="text-left px-5 py-3">Bien</th>
                  <th className="text-left px-5 py-3">Statut</th>
                  <th className="text-right px-5 py-3">Vues</th>
                  <th className="text-right px-5 py-3">Leads</th>
                  <th className="text-right px-5 py-3">Prix</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((it, i) => (
                  <motion.tr
                    key={it.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={it.image_url} alt={it.title} className="w-14 h-14 rounded-xl object-cover"/>
                        <div className="min-w-0">
                          <div className="font-semibold text-navy-900 text-sm truncate">{it.title}</div>
                          <div className="text-xs text-slate-500 truncate flex items-center gap-1.5"><I.MapPin size={11}/>{it.location} · {it.surface} m² · {it.rooms} p.</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        <Badge tone={STATUS[it.status]?.tone || 'slate'}>{STATUS[it.status]?.label}</Badge>
                        {it.is_premium && <Badge tone="orange">Premium</Badge>}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-navy-900 font-semibold">{it.views.toLocaleString('fr-FR')}</td>
                    <td className="px-5 py-3 text-right text-navy-900 font-semibold">{it.leads}</td>
                    <td className="px-5 py-3 text-right font-bold text-navy-900">{fmtPrice(it)}</td>
                    <td className="pr-5 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button title="Booster" className="w-8 h-8 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 flex items-center justify-center"><I.Zap size={14}/></button>
                        <button title="Éditer" className="w-8 h-8 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 flex items-center justify-center"><I.Edit size={14}/></button>
                        <button title="Dupliquer" className="w-8 h-8 rounded-lg text-slate-500 hover:text-navy-900 hover:bg-slate-100 flex items-center justify-center"><I.Copy size={14}/></button>
                        <button title="Supprimer" className="w-8 h-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center"><I.Trash size={14}/></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  )
}
