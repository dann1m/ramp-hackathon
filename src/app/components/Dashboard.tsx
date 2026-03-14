import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CheckCircle2, Clock, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { Link } from 'react-router'
import { useOrgs } from './OrgContext'
import { DEMO_ORG_ID } from '../data/demoClub'

export default function Dashboard() {
  const { currentOrg } = useOrgs()
  const isDemoOrg = currentOrg?.id === DEMO_ORG_ID
  const totalAllocated = 6500
  const totalSpent = 4250
  const budgetRemaining = totalAllocated - totalSpent

  const stats = [
    {
      title: 'Active Tasks',
      value: '12',
      change: '+3 this week',
      icon: CheckCircle2,
      link: '/app/tasks',
    },
    {
      title: 'Budget Used',
      value: `$${totalSpent.toLocaleString()}`,
      change: `${((totalSpent / totalAllocated) * 100).toFixed(1)}% of total`,
      icon: DollarSign,
      link: '/app/budget',
    },
    {
      title: 'Budget Remaining',
      value: `$${budgetRemaining.toLocaleString()}`,
      change: `${((budgetRemaining / totalAllocated) * 100).toFixed(1)}% available`,
      icon: TrendingUp,
      link: '/app/budget',
    },
    {
      title: 'Avg Event ROI',
      value: '3.2x',
      change: '+0.5x from last quarter',
      icon: TrendingUp,
      link: '/app/analytics',
    },
  ]

  const upcomingEvents = [
    { name: 'Spring Fundraiser', date: 'March 20, 2026', budget: '$2,500', status: 'Planning' },
    { name: 'Networking Mixer', date: 'March 28, 2026', budget: '$800', status: 'Ready' },
    { name: 'Community Outreach', date: 'April 5, 2026', budget: '$1,200', status: 'Draft' },
  ]

  const recentActivity = [
    { user: 'Sarah Chen', action: 'completed task "Design event flyers"', time: '2 hours ago' },
    { user: 'Mike Johnson', action: 'updated budget for Spring Fundraiser', time: '4 hours ago' },
    { user: 'Emma Davis', action: 'assigned task to Alex Brown', time: '6 hours ago' },
    { user: 'Alex Brown', action: 'created new event "Alumni Dinner"', time: '1 day ago' },
  ]

  const emptyStats = [
    { title: 'Active Tasks', value: '0', change: 'No tasks yet', icon: CheckCircle2, link: '/app/tasks' },
    { title: 'Budget Used', value: '$0', change: 'Start by adding categories', icon: DollarSign, link: '/app/budget' },
    { title: 'Budget Remaining', value: '$0', change: 'No budget configured', icon: TrendingUp, link: '/app/budget' },
    { title: 'Avg Event ROI', value: 'N/A', change: 'No completed events yet', icon: TrendingUp, link: '/app/analytics' },
  ]

  const viewStats = isDemoOrg ? stats : emptyStats
  const viewEvents = isDemoOrg ? upcomingEvents : []
  const viewActivity = isDemoOrg ? recentActivity : []

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl text-foreground">Overview</h2>
        <p className="max-w-2xl text-muted-foreground">
          {isDemoOrg
            ? 'A steady view of your club&apos;s tasks, events, attendance flow, and funding.'
            : 'This organization is new. Add your first tasks, events, and transactions to build your dashboard.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {viewStats.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="group h-full cursor-pointer hover:-translate-y-0.5">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="mt-2 text-2xl text-foreground">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <div className="rounded-xl bg-muted p-3 text-primary transition-colors group-hover:bg-primary/10">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Events
              </span>
              <Link to="/app/events" className="text-sm text-primary hover:opacity-80">
                View all
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {viewEvents.map((event) => (
                <div key={event.name} className="flex items-center justify-between rounded-2xl bg-muted p-4">
                  <div>
                    <p className="font-medium text-foreground">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{event.budget}</p>
                    <span className="inline-flex rounded-full bg-background px-2.5 py-1 text-xs text-muted-foreground">
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
              {viewEvents.length === 0 && (
                <div className="rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">
                  No upcoming events yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {viewActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                    {activity.user[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
              {viewActivity.length === 0 && (
                <div className="rounded-2xl bg-muted p-6 text-center text-sm text-muted-foreground">
                  Activity will appear here after your team starts working.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
