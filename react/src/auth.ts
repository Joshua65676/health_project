export type AuthUser = {
  id: number
  name: string
  email: string
}

export type UserPreferences = {
  responseStyle: 'concise' | 'balanced' | 'detailed'
  saveHistory: boolean
}

type AuthResult = {
  user?: AuthUser
  preferences?: UserPreferences
  message?: string
  error?: string
}

const apiBaseUrl = (import.meta.env.VITE_PHP_API_URL || 'http://localhost:8083').replace(/\/$/, '')

export const authCallbackUrl = import.meta.env.VITE_AUTH_CALLBACK_URL || '/chatdashboard'
export const googleAuthUrl = `${apiBaseUrl}/auth/google-start.php`

async function requestAuth(path: string, options: RequestInit = {}): Promise<AuthResult> {
  const response = await fetch(`${apiBaseUrl}/auth/${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const result = await response.json() as AuthResult

  if (!response.ok) {
    throw new Error(result.error || 'Authentication request failed.')
  }

  return result
}

export function signUp(name: string, email: string, password: string): Promise<AuthResult> {
  return requestAuth('register.php', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  })
}

export function signIn(email: string, password: string, remember: boolean): Promise<AuthResult> {
  return requestAuth('login.php', {
    method: 'POST',
    body: JSON.stringify({ email, password, remember }),
  })
}

export function getCurrentUser(): Promise<AuthResult> {
  return requestAuth('me.php', { method: 'GET' })
}

export function updateProfile(name: string): Promise<AuthResult> {
  return requestAuth('profile.php', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export async function getUserPreferences(): Promise<UserPreferences> {
  const result = await requestAuth('preferences.php', { method: 'GET' })
  return result.preferences ?? { responseStyle: 'balanced', saveHistory: true }
}

export async function saveUserPreferences(preferences: UserPreferences): Promise<UserPreferences> {
  const result = await requestAuth('preferences.php', {
    method: 'POST',
    body: JSON.stringify(preferences),
  })
  return result.preferences ?? preferences
}

export function signOut(): Promise<AuthResult> {
  return requestAuth('logout.php', { method: 'POST', body: '{}' })
}