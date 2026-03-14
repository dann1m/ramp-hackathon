import { Navigate, Outlet } from 'react-router'
import { useAuth } from './AuthContext'

/**
 * Wrap any route that requires authentication.
 * Unauthenticated users are redirected to /login.
 *
 * Usage in your router:
 *
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/" element={<Layout />}>
 *       <Route index element={<Dashboard />} />
 *       <Route path="tasks" element={<Tasks />} />
 *       ...
 *     </Route>
 *     <Route path="/orgs" element={<OrgSelect />} />
 *   </Route>
 */
export default function ProtectedRoute() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
