import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CheckCircle2, Clock, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router';

export default function Dashboard() {
  const totalBudget = 6500;
  const totalAllocated = 6500;
  const totalSpent = 4250;
  const budgetRemaining = totalAllocated - totalSpent;
  
  const stats = [
    {
      title: 'Active Tasks',
      value: '12',
      change: '+3 this week',
      icon: CheckCircle2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/tasks'
    },
    {
      title: 'Budget Used',
      value: `$${totalSpent.toLocaleString()}`,
      change: `${((totalSpent / totalAllocated) * 100).toFixed(1)}% of total`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/budget'
    },
    {
      title: 'Budget Remaining',
      value: `$${budgetRemaining.toLocaleString()}`,
      change: `${((budgetRemaining / totalAllocated) * 100).toFixed(1)}% available`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      link: '/budget'
    },
    {
      title: 'Avg Event ROI',
      value: '3.2x',
      change: '+0.5x from last quarter',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/analytics'
    },
  ];

  const upcomingEvents = [
    { name: 'Spring Fundraiser', date: 'March 20, 2026', budget: '$2,500', status: 'Planning' },
    { name: 'Networking Mixer', date: 'March 28, 2026', budget: '$800', status: 'Ready' },
    { name: 'Community Outreach', date: 'April 5, 2026', budget: '$1,200', status: 'Draft' },
  ];

  const recentActivity = [
    { user: 'Sarah Chen', action: 'completed task "Design event flyers"', time: '2 hours ago' },
    { user: 'Mike Johnson', action: 'updated budget for Spring Fundraiser', time: '4 hours ago' },
    { user: 'Emma Davis', action: 'assigned task to Alex Brown', time: '6 hours ago' },
    { user: 'Alex Brown', action: 'created new event "Alumni Dinner"', time: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-semibold text-slate-900">Welcome back! 👋</h2>
        <p className="text-slate-600 mt-1">Here's what's happening with your club today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} to={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-semibold text-slate-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-slate-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Upcoming Events
              </span>
              <Link to="/events">
                <span className="text-sm font-normal text-blue-600 hover:text-blue-700">View All →</span>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{event.name}</p>
                    <p className="text-sm text-slate-600">{event.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{event.budget}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.status === 'Ready' ? 'bg-green-100 text-green-700' :
                      event.status === 'Planning' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-white font-medium">{activity.user[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-900">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}