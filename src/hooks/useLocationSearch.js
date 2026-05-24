import { useState, useCallback, useRef, useEffect } from 'react'
import cities from '../data/franceCities.json'

const RECENT_KEY = 'pasmal-recent-locations'
const DEBOUNCE_MS = 180

const POPULAR_IDS = [
  'paris', 'lyon', 'marseille', 'bordeaux', 'toulouse',
  'nice', 'nantes', 'montpellier', 'strasbourg', 'rennes',
  'lille', 'annecy',
]

/* Normalize: strip accents + lowercase for fuzzy matching */
function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

/* Score a city against a query — higher = better match */
function score(city, q) {
  const n = normalize(city.name)
  const z = city.zipcode || ''
  const d = normalize(city.department)
  const r = normalize(city.region)
  if (n.startsWith(q)) return 100 + (city.population || 0) / 1e6
  if (z.startsWith(q)) return 90
  if (n.includes(q)) return 70 + (city.population || 0) / 1e6
  if (d.startsWith(q)) return 40
  if (r.startsWith(q)) return 30
  if (d.includes(q)) return 20
  if (r.includes(q)) return 10
  return 0
}

function search(query) {
  if (!query || query.length < 2) return []
  const q = normalize(query)
  return cities
    .map((c) => ({ city: c, s: score(c, q) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 12)
    .map(({ city }) => city)
}

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || [] }
  catch { return [] }
}

function saveRecent(item, current) {
  const next = [item, ...current.filter((r) => r.id !== item.id)].slice(0, 5)
  try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch {}
  return next
}

export function useLocationSearch() {
  const [query, setQueryRaw] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [recent, setRecent] = useState(loadRecent)
  const [geoState, setGeoState] = useState('idle') // idle | loading | error
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
    setRecent((prev) => saveRecent(item, prev))
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
        /* Find nearest city in our dataset */
        let best = null, bestDist = Infinity
        for (const c of cities) {
          if (!c.lat || !c.lng) continue
          const dx = c.lat - coords.latitude
          const dy = c.lng - coords.longitude
          const dist = dx * dx + dy * dy
          if (dist < bestDist) { bestDist = dist; best = c }
        }
        if (best) {
          select(best)
          onSuccess?.(best)
        }
      },
      () => setGeoState('error'),
      { timeout: 8000, maximumAge: 60000 },
    )
  }, [select])

  const popular = cities.filter((c) => POPULAR_IDS.includes(c.id))

  useEffect(() => () => clearTimeout(timer.current), [])

  return { query, setQuery, results, loading, recent, select, clearQuery, geolocate, geoState, popular }
}
