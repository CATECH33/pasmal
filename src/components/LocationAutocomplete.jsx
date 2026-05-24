import React, { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocationSearch } from '../hooks/useLocationSearch.js'

/* ── inline icons (no lucide-react) ─────────────────────── */
const svgBase = (size = 16) => ({
  width: size, height: size, viewBox: '0 0 24 24',
  fill: 'none', stroke: 'currentColor', strokeWidth: 2,
  strokeLinecap: 'round', strokeLinejoin: 'round',
})
const IcPin     = (p) => <svg {...svgBase(p.size)}><path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
const IcX       = (p) => <svg {...svgBase(p.size)}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
const IcNav     = (p) => <svg {...svgBase(p.size)}><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg>
const IcClock   = (p) => <svg {...svgBase(p.size)}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
const IcSpin    = (p) => <svg {...svgBase(p.size)} className="animate-spin"><line x1="12" x2="12" y1="2" y2="6"/><line x1="12" x2="12" y1="18" y2="22"/><line x1="4.93" x2="7.76" y1="4.93" y2="7.76"/><line x1="16.24" x2="19.07" y1="16.24" y2="19.07"/><line x1="2" x2="6" y1="12" y2="12"/><line x1="18" x2="22" y1="12" y2="12"/></svg>
const IcMapArea = (p) => <svg {...svgBase(p.size)}><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
const IcTrend   = (p) => <svg {...svgBase(p.size)}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>

/* ── type config ─────────────────────────────────────────── */
const TYPE_META = {
  city:          { label: 'Ville',          Icon: IcPin,     color: 'text-orange-500' },
  arrondissement:{ label: 'Arrondissement', Icon: IcPin,     color: 'text-orange-400' },
  department:    { label: 'Département',    Icon: IcMapArea, color: 'text-indigo-500' },
  region:        { label: 'Région',         Icon: IcMapArea, color: 'text-violet-500' },
}

/* ── highlight matching substring ───────────────────────── */
function Highlight({ text, query }) {
  if (!query) return <span>{text}</span>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <span>
      {text.slice(0, idx)}
      <span className="font-bold text-orange-600">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </span>
  )
}

/* ── single result row ───────────────────────────────────── */
function CityRow({ city, query, active, onSelect, onHover }) {
  const meta = TYPE_META[city.type] || TYPE_META.city
  const { Icon, color } = meta
  const subtitle = [city.department, city.region].filter(Boolean).join(', ')
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onSelect(city) }}
      onMouseEnter={onHover}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
        active ? 'bg-orange-50' : 'hover:bg-slate-50'
      }`}
    >
      <div className={`shrink-0 ${color}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-900 truncate">
          <Highlight text={city.name} query={query} />
        </div>
        {subtitle && (
          <div className="text-xs text-slate-400 truncate">{subtitle}</div>
        )}
      </div>
      {city.zipcode && city.type !== 'department' && city.type !== 'region' && (
        <span className="shrink-0 text-[11px] text-slate-400 font-mono">{city.zipcode}</span>
      )}
    </button>
  )
}

/* ── section header ──────────────────────────────────────── */
function SectionHeader({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-3 pb-1">
      <Icon size={12} className="text-slate-400" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  )
}

/* ── main component ──────────────────────────────────────── */
export default function LocationAutocomplete({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Paris, Lyon, Bordeaux…',
  className = '',
}) {
  const { query, setQuery, results, loading, recent, select, clearQuery, geolocate, geoState, popular } =
    useLocationSearch()
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef(null)
  const wrapRef  = useRef(null)

  /* Sync external value → internal query on mount */
  useEffect(() => {
    if (value && !query) setQuery(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Click outside → close */
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* Propagate text changes up */
  useEffect(() => { onChange?.(query) }, [query, onChange])

  /* What to show in the dropdown */
  const showRecent   = open && !query && recent.length > 0
  const showPopular  = open && !query
  const showResults  = open && query.length >= 2
  const showDropdown = open && (showRecent || showPopular || showResults)

  /* Flat list for keyboard nav */
  const flatList = showResults
    ? results
    : [...(showRecent ? recent : []), ...(showPopular ? popular : [])]

  const handleSelect = useCallback((city) => {
    select(city)
    onChange?.(city.name)
    onSelect?.(city)
    setOpen(false)
    setActiveIdx(-1)
  }, [select, onChange, onSelect])

  const handleKeyDown = useCallback((e) => {
    if (!showDropdown) { if (e.key !== 'Escape') setOpen(true); return }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIdx((i) => Math.min(i + 1, flatList.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIdx((i) => Math.max(i - 1, -1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIdx >= 0 && flatList[activeIdx]) handleSelect(flatList[activeIdx])
        break
      case 'Escape':
        setOpen(false)
        setActiveIdx(-1)
        inputRef.current?.blur()
        break
    }
  }, [showDropdown, flatList, activeIdx, handleSelect])

  const handleInputChange = (e) => {
    setQuery(e.target.value)
    setActiveIdx(-1)
    setOpen(true)
  }

  const handleGeolocate = () => {
    geolocate((city) => {
      onChange?.(city.name)
      onSelect?.(city)
      setOpen(false)
    })
  }

  /* Render popular section title based on content */
  const renderDropdown = () => {
    if (showResults) {
      if (loading) {
        return (
          <div className="flex items-center justify-center gap-2 py-8 text-slate-400 text-sm">
            <IcSpin size={16} /> Recherche…
          </div>
        )
      }
      if (results.length === 0) {
        return (
          <div className="py-8 text-center">
            <div className="text-2xl mb-2">🗺️</div>
            <div className="text-sm font-medium text-slate-600">Aucun résultat</div>
            <div className="text-xs text-slate-400 mt-1">Essayez "{query.slice(0,1).toUpperCase() + query.slice(1)}"</div>
          </div>
        )
      }

      /* Group by type */
      const arrondissements = results.filter((c) => c.type === 'arrondissement')
      const citiesOnly      = results.filter((c) => c.type === 'city')
      const depts           = results.filter((c) => c.type === 'department')
      const regions         = results.filter((c) => c.type === 'region')

      let globalIdx = 0
      const renderGroup = (items, header) => {
        if (!items.length) return null
        return (
          <div key={header}>
            {header && <SectionHeader icon={IcPin} label={header} />}
            {items.map((city) => {
              const idx = globalIdx++
              return <CityRow key={city.id} city={city} query={query} active={activeIdx === idx} onSelect={handleSelect} onHover={() => setActiveIdx(idx)} />
            })}
          </div>
        )
      }

      return (
        <>
          {renderGroup(arrondissements, arrondissements.length ? 'Arrondissements' : null)}
          {renderGroup(citiesOnly, citiesOnly.length && (arrondissements.length || depts.length || regions.length) ? 'Villes' : null)}
          {renderGroup(depts, depts.length ? 'Départements' : null)}
          {renderGroup(regions, regions.length ? 'Régions' : null)}
        </>
      )
    }

    let globalIdx = 0
    return (
      <>
        {/* Geolocation button */}
        <div className="px-3 pt-3 pb-1">
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); handleGeolocate() }}
            disabled={geoState === 'loading'}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors text-orange-700 disabled:opacity-50"
          >
            {geoState === 'loading'
              ? <IcSpin size={16} />
              : <IcNav size={16} />
            }
            <span className="text-sm font-medium">
              {geoState === 'loading' ? 'Localisation…' : geoState === 'error' ? 'Localisation impossible' : 'Utiliser ma position'}
            </span>
          </button>
        </div>

        {/* Recent searches */}
        {showRecent && (
          <div className="mt-1">
            <SectionHeader icon={IcClock} label="Recherches récentes" />
            {recent.map((city) => {
              const idx = globalIdx++
              return <CityRow key={city.id} city={city} query="" active={activeIdx === idx} onSelect={handleSelect} onHover={() => setActiveIdx(idx)} />
            })}
          </div>
        )}

        {/* Popular cities */}
        {showPopular && (
          <div className="mt-1">
            <SectionHeader icon={IcTrend} label="Villes populaires" />
            {popular.map((city) => {
              const idx = globalIdx++
              return <CityRow key={city.id} city={city} query="" active={activeIdx === idx} onSelect={handleSelect} onHover={() => setActiveIdx(idx)} />
            })}
          </div>
        )}

        <div className="h-2" />
      </>
    )
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* Input row */}
      <div className="flex items-center gap-2 w-full">
        <IcPin size={16} className="text-orange-500 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="flex-1 min-w-0 bg-transparent text-navy-900 placeholder-slate-400 text-sm focus:outline-none"
          style={{ color: '#0F172A' }}
        />
        {query && (
          <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); clearQuery(); onChange?.(''); onSelect?.(null); inputRef.current?.focus() }}
            className="shrink-0 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <IcX size={13} />
          </button>
        )}
        {loading && !query && <IcSpin size={13} className="text-slate-400 shrink-0" />}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
            style={{ minWidth: 280, maxHeight: 380, overflowY: 'auto' }}
          >
            {renderDropdown()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
