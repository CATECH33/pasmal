import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { I } from '../lib/ui.jsx'
import { LeftPanel } from './AuthLayout.jsx'
import RegisterTabs from './RegisterTabs.jsx'

export default function AuthModal({ isOpen, onClose, initialMode = 'login', initialTab = 'particulier' }) {
  const [mode, setMode] = useState(initialMode)
  const [tab,  setTab]  = useState(initialTab)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (isOpen) { setMode(initialMode); setTab(initialTab); setStep(0) }
  }, [isOpen, initialMode, initialTab])

  const handleClose = () => {
    onClose()
    setTimeout(() => { setMode('login'); setTab('particulier'); setStep(0) }, 350)
  }

  const handleModeChange = (m) => { setMode(m); setStep(0) }
  const handleTabChange  = (t) => { setTab(t);  setStep(0) }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[199] bg-navy-900/65 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal shell */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 28 }}
            transition={{ type: 'spring', damping: 26, stiffness: 290 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
          >
            <div
              className="relative w-full max-w-3xl bg-white rounded-[28px] shadow-2xl overflow-hidden flex pointer-events-auto"
              style={{ maxHeight: '92vh' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 shadow-sm hover:bg-white flex items-center justify-center text-slate-400 hover:text-navy-900 transition-all hover:scale-110"
              >
                <I.X size={15} />
              </button>

              {/* Left decorative panel */}
              <LeftPanel />

              {/* Right — form area */}
              <div className="flex-1 overflow-y-auto bg-white">
                <div className="min-h-full flex flex-col justify-center px-7 py-9 sm:px-10">
                  <RegisterTabs
                    mode={mode}
                    setMode={handleModeChange}
                    tab={tab}
                    setTab={handleTabChange}
                    step={step}
                    setStep={setStep}
                    onClose={handleClose}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
