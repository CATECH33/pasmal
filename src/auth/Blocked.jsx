import React from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from './AuthLayout.jsx'
import { I, Button } from '../lib/ui.jsx'

export default function Blocked() {
  return (
    <AuthLayout
      title="Compte temporairement suspendu"
      subtitle="Notre système de modération a détecté une activité inhabituelle sur votre compte. Notre équipe est en train d'examiner votre dossier."
    >
      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-start gap-3 mb-6">
        <I.Alert size={20} className="text-rose-600 mt-0.5 shrink-0" />
        <div className="text-sm leading-relaxed">
          <div className="font-semibold text-navy-900">Pourquoi suis-je suspendu ?</div>
          <ul className="mt-2 text-slate-600 space-y-1.5 list-disc list-inside text-[13px]">
            <li>Tentatives de connexion suspectes répétées</li>
            <li>Signalement(s) par d'autres utilisateurs</li>
            <li>Détection d'annonces dupliquées ou frauduleuses</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <Button as="a" href="mailto:support@pasmal.fr" className="w-full">
          <I.Mail size={16}/> Contacter le support
        </Button>
        <Button as={Link} to="/" variant="outline" className="w-full">
          Retour à l'accueil
        </Button>
      </div>

      <div className="mt-6 text-xs text-slate-500 leading-relaxed">
        Référence du dossier : <span className="font-mono text-navy-900">#PSM-2026-04A</span>. Notre équipe vous répond en moins de 24h ouvrées.
      </div>
    </AuthLayout>
  )
}
