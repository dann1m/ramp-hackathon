import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'

export interface OrgMember {
  netId: string
  role: 'officer' | 'member'
  email?: string
  teamId?: string | null
}

export interface OrgTeam {
  id: string
  name: string
}

export interface Organization {
  id: string
  name: string
  createdAt: string
  ownerNetId: string
  teams: OrgTeam[]
  members: OrgMember[]
  inviteCode: string
}

interface OrgContextValue {
  organizations: Organization[]
  currentOrg: Organization | null
  selectOrg: (id: string) => void
  createOrg: (name: string, teamNames?: string[]) => void
  addTeamsToOrg: (orgId: string, teamNames: string[]) => void
  assignSelfToTeam: (orgId: string, teamId: string | null) => void
  addMemberByEmail: (orgId: string, email: string, role?: 'officer' | 'member') => void
  joinOrgWithCode: (inviteCode: string) => void
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

  const createOrg = (name: string, teamNames: string[] = []) => {
    if (!user?.netId) return
    const id = `${user.netId}-${Date.now()}`
    const inviteCode = `INV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

    const teams: OrgTeam[] = teamNames
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t, idx) => ({
        id: `${id}-team-${idx}-${t.toLowerCase().replace(/\s+/g, '-')}`,
        name: t,
      }))

    const org: Organization = {
      id,
      name: name.trim() || 'New Organization',
      createdAt: new Date().toISOString(),
      ownerNetId: user.netId,
      teams,
      members: [
        {
          netId: user.netId,
          role: user.role,
          email: undefined,
          teamId: null,
        },
      ],
      inviteCode,
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

  const addTeamsToOrg = (orgId: string, teamNames: string[]) => {
    if (!user?.netId || teamNames.length === 0) return
    setOrgsByUser((prev) => {
      const updated = { ...prev }
      const allOrgs = Object.values(updated).flat()
      const targetOrg = allOrgs.find((o) => o.id === orgId)
      if (!targetOrg) return prev

      const existingTeamNames = new Set(targetOrg.teams.map((t) => t.name.toLowerCase()))
      const newTeams: OrgTeam[] = []
      teamNames.forEach((t, idx) => {
        const trimmed = t.trim()
        if (!trimmed) return
        if (existingTeamNames.has(trimmed.toLowerCase())) return
        newTeams.push({
          id: `${orgId}-team-extra-${Date.now()}-${idx}`,
          name: trimmed,
        })
      })
      if (newTeams.length === 0) return prev

      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].map((org) =>
          org.id === orgId ? { ...org, teams: [...org.teams, ...newTeams] } : org,
        )
      })
      return updated
    })
  }

  const assignSelfToTeam = (orgId: string, teamId: string | null) => {
    if (!user?.netId) return
    setOrgsByUser((prev) => {
      const updated: Record<string, Organization[]> = {}
      for (const [netId, orgs] of Object.entries(prev)) {
        updated[netId] = orgs.map((org) => {
          if (org.id !== orgId) return org
          const members = org.members.map((m) =>
            m.netId === user.netId ? { ...m, teamId } : m,
          )
          return { ...org, members }
        })
      }
      return updated
    })
  }

  const addMemberByEmail = (orgId: string, email: string, role: 'officer' | 'member' = 'member') => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return
    setOrgsByUser((prev) => {
      const updated: Record<string, Organization[]> = {}

      for (const [netId, orgs] of Object.entries(prev)) {
        updated[netId] = orgs.map((org) => {
          if (org.id !== orgId) return org

          const alreadyMember = org.members.some(
            (m) => m.email?.toLowerCase() === trimmedEmail.toLowerCase(),
          )
          if (alreadyMember) return org

          const newMember: OrgMember = {
            netId: trimmedEmail, // placeholder until they sign in and claim it
            role,
            email: trimmedEmail,
            teamId: null,
          }

          return { ...org, members: [...org.members, newMember] }
        })
      }

      return updated
    })
  }

  const joinOrgWithCode = (inviteCode: string) => {
    if (!user?.netId) return
    const trimmed = inviteCode.trim()
    if (!trimmed) return

    setOrgsByUser((prev) => {
      const updated: Record<string, Organization[]> = { ...prev }
      const allOrgs: Organization[] = Object.values(prev).flat()
      const targetOrg = allOrgs.find(
        (o) => o.inviteCode.toUpperCase() === trimmed.toUpperCase(),
      )
      if (!targetOrg) return prev

      const isAlreadyMember = targetOrg.members.some(
        (m) => m.netId === user.netId || m.email?.toLowerCase() === user.netId.toLowerCase(),
      )

      const newMember: OrgMember | null = isAlreadyMember
        ? null
        : {
            netId: user.netId,
            role: 'member',
            email: undefined,
            teamId: null,
          }

      const updatedOrg: Organization = {
        ...targetOrg,
        members: newMember ? [...targetOrg.members, newMember] : targetOrg.members,
      }

      // Attach org to this user
      const userOrgs = updated[user.netId] || []
      const existsForUser = userOrgs.some((o) => o.id === updatedOrg.id)
      updated[user.netId] = existsForUser ? userOrgs : [...userOrgs, updatedOrg]

      // Also update the org in any other user's list
      Object.keys(updated).forEach((netId) => {
        updated[netId] = updated[netId].map((org) =>
          org.id === updatedOrg.id ? updatedOrg : org,
        )
      })

      return updated
    })
  }

  return (
    <OrgContext.Provider
      value={{
        organizations,
        currentOrg,
        selectOrg,
        createOrg,
        addTeamsToOrg,
        assignSelfToTeam,
        addMemberByEmail,
        joinOrgWithCode,
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

