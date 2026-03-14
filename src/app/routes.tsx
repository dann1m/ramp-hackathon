import { createBrowserRouter, Navigate } from 'react-router'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import Budget from './components/Budget'
import Analytics from './components/Analytics'
import Events from './components/Events'
import AttendanceCheckin from './components/AttendanceCheckin'
import Login from './components/Login'
import OrgSelect from './components/OrgSelect'
import { useAuth } from './components/AuthContext'
import { useOrgs } from './components/OrgContext'

function ProtectedLayout() {
  const { user } = useAuth()
  const { currentOrg } = useOrgs()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!currentOrg) {
    return <Navigate to="/orgs" replace />
  }

  return <Layout />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/orgs',
    Component: OrgSelect,
  },
  {
    path: '/',
    Component: ProtectedLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'tasks', Component: Tasks },
      { path: 'budget', Component: Budget },
      { path: 'analytics', Component: Analytics },
      { path: 'events', Component: Events },
    ],
  },
  {
    path: '/attendance/:eventId',
    Component: AttendanceCheckin,
  },
])