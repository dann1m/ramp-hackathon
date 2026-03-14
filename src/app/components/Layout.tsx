import { Outlet, NavLink, useNavigate } from 'react-router'
import { LayoutDashboard, CheckSquare, DollarSign, TrendingUp, UserCircle, Calendar, LogOut, Building2 } from 'lucide-react'
import Chatbot from './Chatbot'
import { useAuth } from './AuthContext'
import { useOrgs } from './OrgContext'
import logo from '../../assets/logo.png'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { currentOrg } = useOrgs()

  const isOfficer = user?.role === 'officer'

  const navItems = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ...(isOfficer
      ? [
          { to: '/app/tasks', label: 'Tasks', icon: CheckSquare },
          { to: '/app/events', label: 'Events', icon: Calendar },
          { to: '/app/budget', label: 'Budget', icon: DollarSign },
          { to: '/app/analytics', label: 'Analytics', icon: TrendingUp },
        ]
      : [{ to: '/app/events', label: 'Events', icon: Calendar }]),
  ]

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90">
        <div className="mx-auto flex h-auto w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
              <img src={logo} alt="ClubHub logo" className="h-full w-full scale-125 object-cover" />
            </div>
            <div>
              <h1 className="flex items-center gap-2 text-base text-foreground">
                ClubHub
                {currentOrg && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    {currentOrg.name}
                  </span>
                )}
              </h1>
              <p className="text-xs text-muted-foreground">Board management for Cornell clubs</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <nav className="flex flex-wrap items-center gap-1 rounded-2xl bg-card p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-all duration-200 ease-in-out ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(0,0,0,0.06)]'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>

            {user && (
              <div className="flex items-center gap-2 rounded-2xl bg-card px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
                <div className="hidden text-left md:block">
                  <p className="text-xs font-medium text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.netId} • {user.team} • {isOfficer ? 'Officer' : 'Member'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-1 inline-flex items-center justify-center rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <Chatbot />
    </div>
  )
}
