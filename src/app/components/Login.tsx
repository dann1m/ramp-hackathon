import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { LayoutDashboard, UserCircle2 } from 'lucide-react'
import { useAuth } from './AuthContext'

const teams = ['Marketing', 'Events', 'Finance', 'Outreach'] as const
type Team = (typeof teams)[number]

const presetUsers = [
  { name: 'Sarah Chen', netId: 'sc1234', team: 'Marketing' as Team },
  { name: 'Mike Johnson', netId: 'mj2345', team: 'Events' as Team },
  { name: 'Alex Brown', netId: 'ab3456', team: 'Finance' as Team },
  { name: 'Rachel Martinez', netId: 'rm4567', team: 'Outreach' as Team },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [selectedPreset, setSelectedPreset] = useState<string>('Sarah Chen')
  const [role, setRole] = useState<'officer' | 'member'>('officer')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const base = presetUsers.find((u) => u.name === selectedPreset) ?? presetUsers[0]

    login({
      ...base,
      role,
    })

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
          <p className="text-sm text-slate-600">
            Sign in as a board member or general member to access the club management dashboard.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Who are you?</Label>
              <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {presetUsers.map((user) => (
                    <SelectItem key={user.netId} value={user.name}>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-slate-500">
                          {user.netId} • {user.team}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as 'officer' | 'member')}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="officer">
                    <div className="flex flex-col">
                      <span className="font-medium">Officer</span>
                      <span className="text-xs text-slate-500">
                        Full access: can manage tasks, events, budget, and analytics.
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="member">
                    <div className="flex flex-col">
                      <span className="font-medium">Member</span>
                      <span className="text-xs text-slate-500">
                        Read-only: can view events and dashboard, limited access elsewhere.
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              <UserCircle2 className="w-4 h-4 mr-2" />
              Continue to dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

