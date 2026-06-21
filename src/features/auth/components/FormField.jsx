import React from 'react'
import { I } from '../../../lib/ui.jsx'
import { PasmalInput } from '../../../components/ui/PasmalInput'

export function FormField({ label, type = 'text', value, onChange, placeholder, icon: Icon, error }) {
  return (
    <PasmalInput
      type={type}
      label={label}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      icon={Icon ? <Icon size={15} /> : undefined}
      error={error}
    />
  )
}

export function PasswordField({ label = 'Mot de passe', value, onChange, error }) {
  return (
    <PasmalInput
      type="password"
      label={label}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="••••••••"
      icon={<I.Lock size={15} />}
      error={error}
    />
  )
}
