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
  code?: string
}

const apiBaseUrl = (import.meta.env.VITE_PHP_API_URL || 'https://health-project-er3s.onrender.com').replace(/\/$/, '')

export const authCallbackUrl = import.meta.env.VITE_AUTH_CALLBACK_URL || '/chatdashboard'
export const googleAuthUrl = `${apiBaseUrl}/auth/google-start.php`

const authErrorMessages: Record<string, string> = {
  EMAIL_NOT_FOUND: 'No account found with this email. Please sign up first.',
  WRONG_PASSWORD: 'Incorrect password. Please try again.',
  EMAIL_NOT_VERIFIED: "Your email isn't verified yet. Check your inbox (and spam folder) for the confirmation link.",
  GOOGLE_ONLY_ACCOUNT: 'This account uses Google sign-in. Please continue with Google.',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long.',
  PASSWORD_TOO_LONG: 'Password must be 72 characters or fewer.',
  INVALID_NAME_EMAIL: 'Enter a valid name and email address.',
  INVALID_EMAIL: 'Enter a valid email address.',
  INVALID_CREDENTIALS: 'Enter a valid email address and password.',
  EMAIL_SEND_FAILED: "We couldn't send the confirmation email. Please try again in a moment.",
  SERVER_ERROR: 'Something went wrong on our side. Please try again in a moment.',
  NETWORK_ERROR: 'Something went wrong on our side. Please try again in a moment.',
}

export class AuthRequestError extends Error {
  readonly code: string

  constructor(code: string, message: string) {
    super(message)
    this.name = 'AuthRequestError'
    this.code = code
  }
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof AuthRequestError) {
    return authErrorMessages[error.code] ?? error.message
  }

  return 'Something went wrong on our side. Please try again in a moment.'
}

async function requestAuth(path: string, options: RequestInit = {}): Promise<AuthResult> {
  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}/auth/${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch {
    throw new AuthRequestError('NETWORK_ERROR', authErrorMessages.NETWORK_ERROR)
  }

  let result: AuthResult
  try {
    result = await response.json() as AuthResult
  } catch {
    throw new AuthRequestError('SERVER_ERROR', authErrorMessages.SERVER_ERROR)
  }

  if (!response.ok) {
    const code = result.code || 'SERVER_ERROR'
    throw new AuthRequestError(
      code,
      authErrorMessages[code] || result.error || authErrorMessages.SERVER_ERROR,
    )
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

export function resendVerificationEmail(email: string): Promise<AuthResult> {
  return requestAuth('resend-verification.php', {
    method: 'POST',
    body: JSON.stringify({ email }),
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