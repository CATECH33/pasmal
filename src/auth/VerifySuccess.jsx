import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import AuthLayout from './AuthLayout.jsx'
import { I, Button } from '../lib/ui.jsx'

export default function VerifySuccess() {
  return (
    <AuthLayout
      title="Votre e-mail est confirmé"
      subtitle="Bienvenue dans PASMAL ! Votre compte est désormais activé et vous pouvez commencer à publier vos annonces."
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.45, duration: 0.7 }}
        className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6"
      >
        <I.Check size={36}/>
      </motion.div>

      <div className="space-y-3 mb-8">
        {[
          'Accès complet à votre tableau de bord',
          'Publication d\'annonces illimitée',
          'Messagerie sécurisée avec les acquéreurs',
        ].map((t) => (
          <div key={t} className="flex items-center gap-3 text-sm text-navy-900">
            <I.CheckCircle size={18} className="text-emerald-500 shrink-0" /> {t}
          </div>
        ))}
      </div>

      <Button as={Link} to="/app" className="w-full">
        Accéder à mon tableau de bord <I.ArrowRight size={16}/>
      </Button>
    </AuthLayout>
  )
}
