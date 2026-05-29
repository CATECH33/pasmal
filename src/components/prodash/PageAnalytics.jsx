import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { I } from '../../lib/ui.jsx'

const WEEKS = [
  { w:'S1', views:210, clicks:18 }, { w:'S2', views:340, clicks:29 },
  { w:'S3', views:290, clicks:22 }, { w:'S4', views:480, clicks:41 },
  { w:'S5', views:390, clicks:33 }, { w:'S6', views:510, clicks:44 },
  { w:'S7', views:620, clicks:55 }, { w:'S8', views:480, clicks:38 },
]
const MAX_VIEWS = Math.max(...WEEKS.map(w => w.views))

const TOP_LISTINGS = [
  { title:'App. Marais 3P',   views:312, ctr:'14%', bar:62 },
  { title:'Villa Neuilly 5P', views:189, ctr:'9%',  bar:38 },
  { title:'Loft Bastille 2P', views:445, ctr:'18%', bar:89 },
  { title:'T4 Boulogne',      views:201, ctr:'11%', bar:40 },
]

function BarGroup({ item, maxV, dark, i }) {
  const ref = useRef()
  const inView = useInView(ref, { once: true })
  const h = Math.round((item.views / maxV) * 80)
  const hc = Math.round((item.clicks / maxV) * 80)
  return (
    <div ref={ref} className="flex-1 flex flex-col items-center gap-1">
      <div className="flex items-end gap-0.5" style={{ height: 80 }}>
        <motion.div className="w-3 rounded-t-sm bg-orange-500"
          initial={{ height: 0 }} animate={{ height: inView ? h : 0 }}
          transition={{ duration: 0.5, delay: i * 0.07 }} />
        <motion.div className="w-3 rounded-t-sm bg-sky-400"
          initial={{ height: 0 }} animate={{ height: inView ? hc : 0 }}
          transition={{ duration: 0.5, delay: i * 0.07 + 0.1 }} />
      </div>
      <span className={`text-[9px] font-bold ${dark ? 'text-white/40' : 'text-slate-400'}`}>{item.w}</span>
    </div>
  )
}

export default function PageAnalytics({ dark }) {
  const bd = dark ? 'bg-[#1f2937] border-white/10' : 'bg-white border-slate-200'
  const tx = dark ? 'text-white' : 'text-navy-900'
  const sx = dark ? 'text-white/50' : 'text-slate-400'

  return (
    <div className="p-6 space-y-5 max-w-5xl mx-auto">
      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Vues (30j)',         value:'1 247', sub:'↑ 12% vs mois dernier', c:'orange' },
          { label:'Clics (30j)',        value:'89',    sub:'↑ 5% vs mois dernier',  c:'sky'    },
          { label:'Taux de conversion', value:'7,1%',  sub:'Moyenne secteur : 5%',  c:'emerald'},
        ].map(({ label, value, sub, c }) => (
          <div key={label} className={`rounded-2xl border p-4 shadow-sm ${bd}`}>
            <p className={`text-2xl font-extrabold ${tx}`}>{value}</p>
            <p className={`text-xs font-semibold mt-0.5 ${sx}`}>{label}</p>
            <p className={`text-[11px] mt-1 ${c === 'orange' ? 'text-orange-500' : c === 'sky' ? 'text-sky-500' : 'text-emerald-500'}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Grouped bar chart */}
      <div className={`rounded-2xl border shadow-sm p-5 ${bd}`}>
        <div className="flex items-center justify-between mb-4">
          <p className={`text-sm font-extrabold ${tx}`}>Vues & Clics — 8 semaines</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-orange-500 inline-block" />Vues</span>
            <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-sm bg-sky-400 inline-block" />Clics</span>
          </div>
        </div>
        <div className="flex items-end gap-3">
          {WEEKS.map((w, i) => <BarGroup key={w.w} item={w} maxV={MAX_VIEWS} dark={dark} i={i} />)}
        </div>
      </div>

      {/* Top listings */}
      <div className={`rounded-2xl border shadow-sm ${bd}`}>
        <div className={`px-5 py-4 border-b ${dark ? 'border-white/10' : 'border-slate-100'}`}>
          <p className={`text-sm font-extrabold ${tx}`}>Meilleures annonces</p>
        </div>
        <div className="divide-y" style={{ borderColor: dark ? 'rgba(255,255,255,0.05)' : '#f8fafc' }}>
          {TOP_LISTINGS.map((l, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5">
              <span className={`text-xs font-bold w-5 ${sx}`}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${tx} truncate`}>{l.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`flex-1 h-1.5 rounded-full ${dark ? 'bg-white/10' : 'bg-slate-100'}`}>
                    <motion.div className="h-full rounded-full bg-orange-500"
                      initial={{ width: 0 }} animate={{ width: `${l.bar}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }} />
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${tx}`}>{l.views}</p>
                <p className={`text-[11px] ${sx}`}>CTR {l.ctr}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
