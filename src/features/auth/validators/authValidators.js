export const isValidEmail = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v ?? '').trim())

export const isValidPassword = (v) =>
  typeof v === 'string' && v.length >= 8

export function validateRegisterForm({ email, password }) {
  if (!email)                return 'L\'e-mail est requis.'
  if (!isValidEmail(email))  return 'Adresse e-mail invalide.'
  if (!password)             return 'Le mot de passe est requis.'
  if (!isValidPassword(password)) return 'Le mot de passe doit comporter au moins 8 caractères.'
  return null
}

export function validateLoginForm({ email, password }) {
  if (!email)    return 'L\'e-mail est requis.'
  if (!password) return 'Le mot de passe est requis.'
  return null
}

export function friendlyAuthError(message = '') {
  if (!message) return 'Une erreur inattendue est survenue.'

  if (/already registered|already exists/i.test(message))
    return 'Cet e-mail est déjà utilisé.'

  if (/invalid login credentials|invalid credentials/i.test(message))
    return 'E-mail ou mot de passe incorrect.'

  if (/password should be at least/i.test(message))
    return 'Le mot de passe doit comporter au moins 8 caractères.'

  if (/email not confirmed/i.test(message))
    return 'Vérifiez votre boîte mail pour confirmer votre compte.'

  if (/rate limit|only request this after|too many requests/i.test(message))
    return 'Trop de tentatives. Veuillez patienter quelques secondes.'

  if (/signup.*disabled|registrations.*disabled/i.test(message))
    return 'Les inscriptions sont temporairement désactivées.'

  if (/token.*expired|invalid.*token|expired.*token/i.test(message))
    return 'Ce lien a expiré ou est invalide. Refaites une demande de réinitialisation.'

  if (/same password|should be different/i.test(message))
    return 'Le nouveau mot de passe doit être différent de l\'ancien.'

  if (/user not found/i.test(message))
    return 'Aucun compte trouvé avec cet e-mail.'

  if (/invalid api key/i.test(message))
    return 'Clé API Supabase invalide (VITE_SUPABASE_ANON_KEY). Vérifiez votre fichier .env.'

  if (/placeholder\.supabase\.co|placeholder/i.test(message))
    return 'Configuration Supabase manquante — VITE_SUPABASE_URL absent du fichier .env.'

  // Erreurs réseau — on montre le message brut Supabase au lieu de le masquer
  if (/failed to fetch/i.test(message)) {
    const url = import.meta.env.VITE_SUPABASE_URL
    if (!url) return 'VITE_SUPABASE_URL absent du fichier .env — le client Supabase utilise un placeholder.'
    return `Impossible de joindre Supabase (${url}). Vérifiez votre connexion internet ou un bloqueur de publicités.`
  }
  if (/networkerror|network request failed|load failed|fetch/i.test(message))
    return `Erreur réseau : ${message}`

  return message || 'Une erreur est survenue.'
}
