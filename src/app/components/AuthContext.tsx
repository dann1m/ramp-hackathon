import React, { createContext, useContext, useEffect, useState } from 'react'

type Role = 'officer' | 'member'

export interface User {
  name: string
  netId: string
  team: string
  role: Role
}

// Stored separately from the session — never exposed outside this module
interface StoredCredential {
  netId: string
  passwordHash: string // We use a simple hash since we have no backend
  name: string
  team: string
  role: Role
}

interface AuthContextValue {
  user: User | null
  login: (netId: string, password: string) => { ok: boolean; error?: string }
  signup: (name: string, netId: string, password: string, role: Role) => { ok: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const SESSION_KEY = 'clubhub-auth-user'
const CREDENTIALS_KEY = 'clubhub-auth-credentials'

// Deterministic hash — good enough for a localStorage-backed demo; not for production
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0
  }
  return hash.toString(16)
}

function loadCredentials(): StoredCredential[] {
  try {
    const raw = window.localStorage.getItem(CREDENTIALS_KEY)
    return raw ? (JSON.parse(raw) as StoredCredential[]) : []
  } catch {
    return []
  }
}

function saveCredentials(creds: StoredCredential[]): void {
  window.localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds))
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const stored = window.localStorage.getItem(SESSION_KEY)
      return stored ? (JSON.parse(stored) as User) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(SESSION_KEY)
    }
  }, [user])

  const signup = (
    name: string,
    netId: string,
    password: string,
    role: Role,
  ): { ok: boolean; error?: string } => {
    const trimmedNetId = netId.trim().toLowerCase()

    if (!name.trim() || !trimmedNetId || !password) {
      return { ok: false, error: 'All fields are required.' }
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' }
    }

    const creds = loadCredentials()
    if (creds.some((c) => c.netId === trimmedNetId)) {
      return { ok: false, error: 'An account with this NetID already exists.' }
    }

    const newCred: StoredCredential = {
      netId: trimmedNetId,
      passwordHash: simpleHash(password),
      name: name.trim(),
      team: 'Unassigned',
      role,
    }
    saveCredentials([...creds, newCred])

    // Log the user in immediately after sign-up
    setUser({ name: newCred.name, netId: newCred.netId, team: newCred.team, role: newCred.role })
    return { ok: true }
  }

  const login = (netId: string, password: string): { ok: boolean; error?: string } => {
    const trimmedNetId = netId.trim().toLowerCase()

    if (!trimmedNetId || !password) {
      return { ok: false, error: 'Please enter your NetID and password.' }
    }

    const creds = loadCredentials()
    const match = creds.find((c) => c.netId === trimmedNetId)

    if (!match) {
      return { ok: false, error: 'No account found with that NetID.' }
    }
    if (match.passwordHash !== simpleHash(password)) {
      return { ok: false, error: 'Incorrect password.' }
    }

    setUser({ name: match.name, netId: match.netId, team: match.team, role: match.role })
    return { ok: true }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
