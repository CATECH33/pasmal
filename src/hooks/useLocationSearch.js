import { useState, useCallback, useRef, useEffect } from 'react'
import cities from '../data/franceCities.json'

const RECENT_KEY = 'pasmal-recent-locations'
const DEBOUNCE_MS = 160

const POPULAR_IDS = [
  'paris', 'lyon', 'marseille', 'bordeaux', 'toulouse',
  'nice', 'nantes', 'montpellier', 'strasbourg', 'rennes',
  'lille', 'annecy',
]

/* Normalize: strip accents + lowercase */
function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/* Pre-compute normalized fields once at module load — not on every keystroke */
const citiesIdx = cities.map(c => ({
  ...c,
  _n: normalize(c.name),
  _d: normalize(c.department),
  _r: normalize(c.region),
}))

/* Score a city against a query — higher = better match */
function score(c, q) {
  const isZip = /^\d/.test(q)
  const typePenalty = c.type === 'region' ? -5 : c.type === 'department' ? -2 : c.type === 'arrondissement' ? -1 : 0

  if (isZip) {
    if (c.zipcode === q) return 100
    if (c.zipcode.startsWith(q)) return 90
    return 0
  }

  if (c._n === q) return 100 + typePenalty
  if (c._n.startsWith(q)) return 90 + (c.population || 0) / 1e6 + typePenalty
  if (c._n.includes(q)) return 70 + (c.population || 0) / 1e6 + typePenalty
  if (c._d.startsWith(q)) return 45 + typePenalty
  if (c._r.startsWith(q)) return 30 + typePenalty
  if (c._d.includes(q)) return 20 + typePenalty
  if (c._r.includes(q)) return 10 + typePenalty
  return 0
}

function search(query) {
  if (!query || query.length < 2) return []
  const q = normalize(query)
  const results = []
  for (const c of citiesIdx) {
    const s = score(c, q)
    if (s > 0) results.push({ c, s })
  }
  results.sort((a, b) => b.s - a.s)
  return results.slice(0, 12).map(({ c }) => c)
}

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || [] }
  catch { return [] }
}

function saveRecent(item, current) {
  const next = [item, ...current.filter(r => r.id !== item.id)].slice(0, 5)
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch {}
  return next
}

export function useLocationSearch() {
  const [query, setQueryRaw] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState(loadRecent)
  const [geoState, setGeoState] = useState('idle')
  const timer = useRef(null)

  const setQuery = useCallback((q) => {
    setQueryRaw(q)
    if (!q || q.trim().length < 2) {
      clearTimeout(timer.current)
      setLoading(false)
      setResults([])
      return
    }
    setLoading(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setResults(search(q.trim()))
      setLoading(false)
    }, DEBOUNCE_MS)
  }, [])

  const select = useCallback((item) => {
    setRecent(prev => saveRecent(item, prev))
    setQueryRaw(item.name)
    setResults([])
    setLoading(false)
  }, [])

  const clearQuery = useCallback(() => {
    setQueryRaw('')
    setResults([])
    setLoading(false)
  }, [])

  const geolocate = useCallback((onSuccess) => {
    if (!navigator.geolocation) { setGeoState('error'); return }
    setGeoState('loading')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setGeoState('idle')
        let best = null, bestDist = Infinity
        for (const c of citiesIdx) {
          if (!c.lat || !c.lng || c.type !== 'city') continue
          const dx = c.lat - coords.latitude
          const dy = c.lng - coords.longitude
          const dist = dx * dx + dy * dy
          if (dist < bestDist) { bestDist = dist; best = c }
        }
        if (best) { select(best); onSuccess?.(best) }
      },
      () => setGeoState('error'),
      { timeout: 8000, maximumAge: 60000 },
    )
  }, [select])

  const popular = citiesIdx.filter(c => POPULAR_IDS.includes(c.id))

  useEffect(() => () => clearTimeout(timer.current), [])

  return { query, setQuery, results, loading, recent, select, clearQuery, geolocate, geoState, popular }
}
