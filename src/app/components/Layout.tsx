import { Outlet, NavLink } from 'react-router';
import { LayoutDashboard, CheckSquare, DollarSign, TrendingUp, UserCircle, Calendar } from 'lucide-react';
import Chatbot from './Chatbot';

export default function Layout() {
  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/tasks", label: "Tasks", icon: CheckSquare },
    { to: "/events", label: "Events", icon: Calendar },
    { to: "/budget", label: "Budget", icon: DollarSign },
    { to: "/analytics", label: "Analytics", icon: TrendingUp },
  ];

  // Simulated logged-in user (in real app, this would come from auth)
  const currentUser = {
    name: 'Sarah Chen',
    netId: 'sc1234',
    team: 'Marketing'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-slate-900">ClubHub</h1>
                <p className="text-xs text-slate-500">Board Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <nav className="flex gap-1">
                {navItems.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </NavLink>
                ))}
              </nav>

              {/* User Profile */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                <UserCircle className="w-5 h-5 text-slate-600" />
                <div className="hidden md:block">
                  <p className="text-xs font-medium text-slate-900">{currentUser.name}</p>
                  <p className="text-xs text-slate-500">{currentUser.netId} • {currentUser.team}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}