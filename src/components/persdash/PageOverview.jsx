import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { I } from '../../lib/ui.jsx'
import { useAuth } from '../../features/auth/providers/AuthProvider.jsx'
import { supabase } from '../../lib/supabase.js'

/* ── Animated counter ──────────────────────────────────────────── */
function Count({ to, duration = 1.2 }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = to / (duration * 60)
    const id = setInterval(() => {
      start += step
      if (start >= to) { setVal(to); clearInterval(id) }
      else setVal(Math.floor(start))
    }, 1000 / 60)
    return () => clearInterval(id)
  }, [to, duration])
  return <span>{val}</span>
}

/* ── KPI Card ─────────────────────────────────────────────────── */
function KpiCard({ label, value, icon: Icon, color, sub, delay = 0, dark }) {
  const colors = {
    orange:  { ring: 'ring-orange-500/20',  icon: 'bg-orange-500',  glow: 'shadow-orange-500/20'  },
    sky:     { ring: 'ring-sky-500/20',     icon: 'bg-sky-500',     glow: 'shadow-sky-500/20'     },
    emerald: { ring: 'ring-emerald-500/20', icon: 'bg-emerald-500', glow: 'shadow-emerald-500/20' },
    rose:    { ring: 'ring-rose-500/20',    icon: 'bg-rose-500',    glow: 'shadow-rose-500/20'    },
    violet:  { ring: 'ring-violet-500/20',  icon: 'bg-violet-500',  glow: 'shadow-violet-500/20'  },
  }
  const c = colors[color] || colors.orange
  const bd = dark ? 'bg-[#1a2740] border-white/[0.08]' : 'bg-white border-slate-100'
  const tx = dark ? 'text-white'    : 'text-[#0F172A]'
  const sx = dark ? 'text-white/45' : 'text-slate-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border p-5 shadow-sm ring-1 ${c.ring} ${bd}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${c.icon} ${c.glow}`}>
          <Icon size={17} className="text-white" />
        </div>
        {sub !== undefined && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
            dark ? 'bg-white/[0.06] text-white/50' : 'bg-slate-50 text-slate-400'
          }`}>{sub}</span>
        )}
      </div>
      <p className={`text-[28px] font-extrabold leading-none mb-1 ${tx}`}>
        {typeof value === 'number' ? <Count to={value} /> : value}
      </p>
      <p className={`text-xs font-medium ${sx}`}>{label}</p>
    </motion.div>
  )
}

/* ── Activity item ─────────────────────────────────────────────── */
function ActivityItem({ icon: Icon, color, text, time, dark, delay = 0 }) {
  const tx = dark ? 'text-white/80'  : 'text-[#0F172A]'
  const sx = dark ? 'text-white/35'  : 'text-slate-400'
  const bd = dark ? 'bg-white/[0.04] border-white/[0.06]' : 'bg-slate-50 border-slate-100'
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border ${bd}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-semibold truncate ${tx}`}>{text}</p>
      </div>
      <span className={`text-[11px] shrink-0 ${sx}`}>{time}</span>
    </motion.div>
  )
}

/* ── Quick action ─────────────────────────────────────────────── */
function QuickAction({ icon: Icon, label, sub, onClick, dark, delay = 0 }) {
  const bd = dark ? 'bg-[#1a2740] border-white/[0.08] hover:border-orange-500/40 hover:bg-orange-500/[0.06]'
                  : 'bg-white border-slate-100 hover:border-orange-300 hover:bg-orange-50/40'
  const tx = dark ? 'text-white'    : 'text-[#0F172A]'
  const sx = dark ? 'text-white/40' : 'text-slate-400'
  return (
    <motion.button type="button" onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 shadow-sm ${bd}`}>
      <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center mb-3 shadow-md shadow-orange-500/25">
        <Icon size={16} className="text-white" />
      </div>
      <p className={`text-[13px] font-bold leading-tight ${tx}`}>{label}</p>
      <p className={`text-[11px] mt-0.5 ${sx}`}>{sub}</p>
    </motion.button>
  )
}

/* ── Listing mini card ────────────────────────────────────────── */
function MiniListing({ title, location, price, img, badge, delay = 0, dark }) {
  const bd = dark ? 'bg-[#1a2740] border-white/[0.08]' : 'bg-white border-slate-100'
  const tx = dark ? 'text-white'    : 'text-[#0F172A]'
  const sx = dark ? 'text-white/40' : 'text-slate-400'
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -3 }}
      className={`rounded-2xl border overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${bd}`}>
      <div className="relative h-28 overflow-hidden">
        <img src={img} alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        {badge && (
          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
            badge === 'Nouveau' ? 'bg-orange-500' : badge === 'Exclusif' ? 'bg-[#0F172A]' : 'bg-violet-500'
          }`}>{badge}</span>
        )}
        <button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
          <I.Heart size={10} className="text-slate-400" />
        </button>
      </div>
      <div className="p-3">
        <p className={`text-[12px] font-bold truncate ${tx}`}>{title}</p>
        <p className={`text-[10px] mt-0.5 flex items-center gap-1 ${sx}`}>
          <I.MapPin size={9} className="text-orange-400 shrink-0" />{location}
        </p>
        <p className={`text-[13px] font-extrabold mt-2 ${tx}`}>{price}</p>
      </div>
    </motion.div>
  )
}

/* ── Main Overview ─────────────────────────────────────────────── */
export default function PageOverview({ dark, setPage }) {
  const { user, profile } = useAuth()

  const [stats, setStats] = useState({ favoris: 0, alertes: 0, notifs: 0, recherches: 0 })
  const [loading, setLoading] = useState(true)
  const isPremium = profile?.premium_alerts === true
  const firstName = profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'vous'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('favorites').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('alerts').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('alert_notifications').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false),
    ]).then(([fav, al, notifs]) => {
      setStats({
        favoris:    fav.count || 0,
        alertes:    al.count  || 0,
        notifs:     notifs.count || 0,
        recherches: 3, // static for now
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [user])

  const bd  = dark ? 'bg-[#1a2740] border-white/[0.08]' : 'bg-white border-slate-100'
  const tx  = dark ? 'text-white'    : 'text-[#0F172A]'
  const sx  = dark ? 'text-white/40' : 'text-slate-400'
  const div = dark ? 'border-white/[0.08]' : 'border-slate-100'

  const LISTINGS = [
    { title: 'T3 lumineux Oberkampf',    location: 'Paris 11ᵉ',       price: '420 000 €',    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=200&fit=crop', badge: 'Nouveau'  },
    { title: 'Studio Bastille rénové',   location: 'Paris 11ᵉ',       price: '295 000 €',    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=200&fit=crop', badge: 'Exclusif' },
    { title: 'Appartement Nation',       location: 'Paris 12ᵉ',       price: '485 000 €',    img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=200&fit=crop', badge: null       },
    { title: 'Loft industriel Marais',   location: 'Paris 3ᵉ',        price: '1 850 €/mois', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=200&fit=crop', badge: 'Nouveau'  },
  ]

  return (
    <div className={`min-h-full p-6 ${dark ? 'bg-[#111827]' : 'bg-slate-50'}`}>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Hero greeting */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl border overflow-hidden shadow-sm relative ${bd}`}>
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0F2D50] to-[#1a3a5e] opacity-100" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 px-7 py-6 flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-orange-400 text-[11px] font-bold uppercase tracking-[0.18em] mb-1.5">
                ✦ Espace Personnel
              </p>
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                {greeting}, {firstName} 👋
              </h2>
              <p className="text-white/50 text-sm mt-1">
                {stats.notifs > 0
                  ? `Vous avez ${stats.notifs} nouvelle${stats.notifs > 1 ? 's' : ''} notification${stats.notifs > 1 ? 's' : ''}.`
                  : 'Tout est à jour — bonne journée !'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isPremium ? (
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm font-bold">
                  <I.Sparkles size={14} /> Alertes Premium actives
                </span>
              ) : (
                <button onClick={() => setPage('abonnement')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-all shadow-lg shadow-orange-500/25 hover:-translate-y-0.5">
                  <I.Bell size={14} /> Activer les alertes
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* KPI grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Biens en favoris"   value={stats.favoris}   icon={I.Heart}  color="rose"    sub="favoris"    delay={0.05} dark={dark} />
          <KpiCard label="Alertes actives"    value={stats.alertes}   icon={I.Bell}   color="orange"  sub="alertes"    delay={0.10} dark={dark} />
          <KpiCard label="Non lues"           value={stats.notifs}    icon={I.Check}  color="sky"     sub="notifs"     delay={0.15} dark={dark} />
          <KpiCard label="Recherches sauvées" value={stats.recherches} icon={I.Search} color="emerald" sub="critères"   delay={0.20} dark={dark} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Annonces pour vous */}
          <div className="lg:col-span-2 space-y-4">
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${bd}`}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
                <div>
                  <p className={`text-sm font-extrabold ${tx}`}>Annonces pour vous</p>
                  <p className={`text-[11px] mt-0.5 ${sx}`}>Selon vos alertes et favoris</p>
                </div>
                <button onClick={() => setPage('alertes')}
                  className="text-[11px] font-bold text-orange-500 hover:text-orange-600 transition flex items-center gap-1">
                  Voir tout <I.ArrowRight size={11} />
                </button>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {LISTINGS.map((l, i) => (
                  <MiniListing key={i} {...l} delay={0.08 * i} dark={dark} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — Activity + Quick actions */}
          <div className="space-y-4">

            {/* Quick actions */}
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${bd}`}>
              <div className={`px-5 py-4 border-b ${div}`}>
                <p className={`text-sm font-extrabold ${tx}`}>Actions rapides</p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                <QuickAction icon={I.Bell}   label="Créer alerte"  sub="Nouveaux biens"   onClick={() => setPage('alertes')}    dark={dark} delay={0.05} />
                <QuickAction icon={I.Search} label="Mes critères"  sub="Filtres sauvés"   onClick={() => setPage('recherches')} dark={dark} delay={0.10} />
                <QuickAction icon={I.Heart}  label="Favoris"       sub="Biens suivis"     onClick={() => setPage('favoris')}    dark={dark} delay={0.15} />
                <QuickAction icon={I.User}   label="Profil"        sub="Mes infos"        onClick={() => setPage('profil')}     dark={dark} delay={0.20} />
              </div>
            </div>

            {/* Recent activity */}
            <div className={`rounded-2xl border shadow-sm overflow-hidden ${bd}`}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
                <p className={`text-sm font-extrabold ${tx}`}>Activité récente</p>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${dark ? 'bg-white/[0.06] text-white/40' : 'bg-slate-100 text-slate-400'}`}>
                  Aujourd'hui
                </span>
              </div>
              <div className="p-3 space-y-2">
                <ActivityItem icon={I.Bell}   color="bg-orange-500" text="Nouvelle annonce : T3 Oberkampf"    time="10 min" dark={dark} delay={0.05} />
                <ActivityItem icon={I.Heart}  color="bg-rose-500"   text="Favori ajouté : Studio Bastille"    time="2 h"    dark={dark} delay={0.10} />
                <ActivityItem icon={I.TrendingDown} color="bg-sky-500" text="Baisse de prix : Loft Bastille"  time="3 h"    dark={dark} delay={0.15} />
                <ActivityItem icon={I.Search} color="bg-emerald-500" text="Alerte créée : Paris 12e ≤ 500k"  time="Hier"   dark={dark} delay={0.20} />
              </div>
            </div>

          </div>
        </div>

        {/* Premium banner — only if not subscribed */}
        {!isPremium && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="rounded-2xl overflow-hidden relative border border-orange-500/20"
            style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #1a2740 50%, #0F2D50 100%)' }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 right-0 w-64 h-32 bg-orange-500/10 blur-3xl rounded-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-400/10 blur-2xl rounded-full" />
            </div>
            <div className="relative z-10 px-6 py-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                  <I.Bell size={22} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-base">Alertes Premium — 7,50 €/mois</p>
                  <p className="text-white/50 text-sm mt-0.5">Recevez les nouvelles annonces avant tout le monde · Sans engagement</p>
                </div>
              </div>
              <button onClick={() => setPage('abonnement')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 shrink-0">
                <I.Sparkles size={14} /> S'abonner
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}
