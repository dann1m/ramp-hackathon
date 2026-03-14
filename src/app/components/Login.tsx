import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { LayoutDashboard, UserCircle2, UserPlus } from 'lucide-react'
import { useAuth } from './AuthContext'

type Tab = 'login' | 'signup'

export default function Login() {
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState<Tab>('login')

  // Shared fields
  const [name, setName] = useState('')
  const [netId, setNetId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'officer' | 'member'>('officer')
  const [error, setError] = useState<string | null>(null)

  const resetForm = () => {
    setName('')
    setNetId('')
    setPassword('')
    setConfirmPassword('')
    setRole('officer')
    setError(null)
  }

  const switchTab = (next: Tab) => {
    resetForm()
    setTab(next)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const result = login(netId, password)
    if (!result.ok) {
      setError(result.error ?? 'Login failed.')
      return
    }
    navigate('/orgs', { replace: true })
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const result = signup(name, netId, password, role)
    if (!result.ok) {
      setError(result.error ?? 'Sign up failed.')
      return
    }
    navigate('/orgs', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border-slate-200">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Welcome to</p>
              <CardTitle className="text-xl">ClubHub Board Portal</CardTitle>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === 'login'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab('signup')}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                tab === 'signup'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Create Account
            </button>
          </div>
        </CardHeader>

        <CardContent>
          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="netId">NetID</Label>
                <Input
                  id="netId"
                  value={netId}
                  onChange={(e) => setNetId(e.target.value)}
                  placeholder="Enter your NetID"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                <UserCircle2 className="w-4 h-4 mr-2" />
                Sign In
              </Button>

              <p className="text-center text-xs text-slate-500">
                No account yet?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('signup')}
                  className="text-blue-600 hover:underline"
                >
                  Create one
                </button>
              </p>
            </form>
          )}

          {/* ── SIGN UP ── */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="su-name">Full Name</Label>
                <Input
                  id="su-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="su-netId">NetID</Label>
                <Input
                  id="su-netId"
                  value={netId}
                  onChange={(e) => setNetId(e.target.value)}
                  placeholder="Enter your NetID"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="su-password">Password</Label>
                <Input
                  id="su-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="su-confirm">Confirm Password</Label>
                <Input
                  id="su-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as 'officer' | 'member')}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="officer">
                      <div className="flex flex-col">
                        <span className="font-medium">Officer</span>
                        <span className="text-xs text-slate-500">
                          Full access: manage tasks, events, budget, and analytics.
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="member">
                      <div className="flex flex-col">
                        <span className="font-medium">Member</span>
                        <span className="text-xs text-slate-500">
                          Read-only: view events and dashboard.
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                <UserPlus className="w-4 h-4 mr-2" />
                Create Account
              </Button>

              <p className="text-center text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('login')}
                  className="text-blue-600 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
