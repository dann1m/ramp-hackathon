import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'

export interface Organization {
  id: string
  name: string
  createdAt: string
}

interface OrgContextValue {
  organizations: Organization[]
  currentOrg: Organization | null
  selectOrg: (id: string) => void
  createOrg: (name: string) => void
}

const OrgContext = createContext<OrgContextValue | undefined>(undefined)

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [orgsByUser, setOrgsByUser] = useState<Record<string, Organization[]>>({})
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null)

  // Load all org data from localStorage once
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem('clubhub-organizations')
      if (raw) {
        const parsed = JSON.parse(raw) as {
          orgsByUser: Record<string, Organization[]>
          currentOrgByUser: Record<string, string | null>
        }
        setOrgsByUser(parsed.orgsByUser || {})
        if (user?.netId && parsed.currentOrgByUser?.[user.netId]) {
          setCurrentOrgId(parsed.currentOrgByUser[user.netId])
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // When user changes, update currentOrgId from stored mapping
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem('clubhub-organizations')
      if (!raw) {
        setCurrentOrgId(null)
        return
      }
      const parsed = JSON.parse(raw) as {
        orgsByUser: Record<string, Organization[]>
        currentOrgByUser: Record<string, string | null>
      }
      if (user?.netId) {
        setCurrentOrgId(parsed.currentOrgByUser?.[user.netId] || null)
      } else {
        setCurrentOrgId(null)
      }
    } catch {
      setCurrentOrgId(null)
    }
  }, [user?.netId])

  // Persist org data + per-user currentOrg mapping
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = window.localStorage.getItem('clubhub-organizations')
      const prev = raw
        ? (JSON.parse(raw) as {
            orgsByUser: Record<string, Organization[]>
            currentOrgByUser: Record<string, string | null>
          })
        : { orgsByUser: {}, currentOrgByUser: {} }

      const currentOrgByUser = { ...prev.currentOrgByUser }
      if (user?.netId) {
        currentOrgByUser[user.netId] = currentOrgId
      }

      window.localStorage.setItem(
        'clubhub-organizations',
        JSON.stringify({
          orgsByUser,
          currentOrgByUser,
        }),
      )
    } catch {
      // ignore
    }
  }, [orgsByUser, currentOrgId, user?.netId])

  const organizations = useMemo(() => {
    if (!user?.netId) return []
    return orgsByUser[user.netId] || []
  }, [orgsByUser, user?.netId])

  const currentOrg = useMemo(
    () => organizations.find((org) => org.id === currentOrgId) || null,
    [organizations, currentOrgId],
  )

  const selectOrg = (id: string) => {
    if (!organizations.find((o) => o.id === id)) return
    setCurrentOrgId(id)
  }

  const createOrg = (name: string) => {
    if (!user?.netId) return
    const id = `${user.netId}-${Date.now()}`
    const org: Organization = {
      id,
      name: name.trim() || 'New Organization',
      createdAt: new Date().toISOString(),
    }

    setOrgsByUser((prev) => {
      const existing = prev[user.netId] || []
      return {
        ...prev,
        [user.netId]: [...existing, org],
      }
    })
    setCurrentOrgId(id)
  }

  return (
    <OrgContext.Provider
      value={{
        organizations,
        currentOrg,
        selectOrg,
        createOrg,
      }}
    >
      {children}
    </OrgContext.Provider>
  )
}

export function useOrgs() {
  const ctx = useContext(OrgContext)
  if (!ctx) {
    throw new Error('useOrgs must be used within OrgProvider')
  }
  return ctx
}

