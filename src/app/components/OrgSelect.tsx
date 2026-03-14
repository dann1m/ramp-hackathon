import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAuth } from './AuthContext'
import { useOrgs } from './OrgContext'
import { Building2, PlusCircle, ArrowRight } from 'lucide-react'

export default function OrgSelect() {
  const { user } = useAuth()
  const { organizations, currentOrg, selectOrg, createOrg } = useOrgs()
  const navigate = useNavigate()
  const [orgName, setOrgName] = useState('')

  if (!user) {
    navigate('/login', { replace: true })
    return null
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgName.trim()) {
      alert('Please enter an organization name.')
      return
    }
    createOrg(orgName.trim())
    setOrgName('')
    navigate('/', { replace: true })
  }

  const handleSelect = (id: string) => {
    selectOrg(id)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid gap-6 md:grid-cols-[1.3fr,1fr]">
        <Card className="shadow-md border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Choose your organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Welcome, <span className="font-medium text-slate-900">{user.name}</span>. Select the club
              or organization you want to manage today, or create a new one.
            </p>

            {organizations.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
                <p className="text-sm text-slate-600">
                  You are not in any organizations yet. Create your first club on the right.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => handleSelect(org.id)}
                    className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                      currentOrg?.id === org.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-medium text-slate-900">{org.name}</p>
                      <p className="text-xs text-slate-500">
                        Joined on {new Date(org.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-purple-600" />
              Create a new organization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org-name">Organization name</Label>
                <Input
                  id="org-name"
                  placeholder="e.g., ACM, Women in Business, Robotics Club"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
              </div>
              <p className="text-xs text-slate-500">
                As an {user.role === 'officer' ? 'officer' : 'member'}, you can create a new club workspace.
                Later, we could invite other members by email or share a join link.
              </p>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create organization
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

