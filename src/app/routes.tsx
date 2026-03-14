import { createBrowserRouter, Navigate, isRouteErrorResponse, useRouteError } from 'react-router'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Tasks from './components/Tasks'
import Budget from './components/Budget'
import Analytics from './components/Analytics'
import Events from './components/Events'
import AttendanceCheckin from './components/AttendanceCheckin'
import Login from './components/Login'
import OrgSelect from './components/OrgSelect'
import { Button } from './components/ui/button'
import { useAuth } from './components/AuthContext'
import { useOrgs } from './components/OrgContext'

function RouteErrorBoundary() {
  const error = useRouteError()

  let title = 'Something went wrong'
  let description = 'Please return to the app home and try again.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      title = 'Page not found'
      description = 'That page does not exist. You can return to the login page.'
    } else {
      title = `${error.status} ${error.statusText}`
      description = typeof error.data === 'string' ? error.data : description
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <h1 className="text-2xl text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <Button className="mt-6 w-full" onClick={() => (window.location.href = '/')}>
          Back to Login
        </Button>
      </div>
    </div>
  )
}

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
    path: '/',
    Component: Login,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/login',
    element: <Navigate to="/" replace />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/orgs',
    Component: OrgSelect,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/app',
    Component: ProtectedLayout,
    errorElement: <RouteErrorBoundary />,
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
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
