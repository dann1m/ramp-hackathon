import { RouterProvider } from 'react-router'
import { router } from './routes.tsx'
import { AuthProvider } from './components/AuthContext'
import { OrgProvider } from './components/OrgContext'

function App() {
  return (
    <AuthProvider>
      <OrgProvider>
        <RouterProvider router={router} />
      </OrgProvider>
    </AuthProvider>
  )
}

export default App;