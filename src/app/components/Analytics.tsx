import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, Trophy, BarChart3 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useOrgs } from './OrgContext';
import { DEMO_ORG_ID } from '../data/demoClub';

type TimePeriod = 'day' | 'month' | 'year';

export default function Analytics() {
  const { currentOrg } = useOrgs();
  const isDemoOrg = currentOrg?.id === DEMO_ORG_ID;
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month');

  if (!isDemoOrg) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Analytics & Insights</h2>
          <p className="text-slate-600 mt-1">Visualize event performance and financial metrics</p>
        </div>
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-slate-700 font-medium">No analytics data yet for this organization.</p>
            <p className="text-sm text-slate-500 mt-2">
              Add completed events with attendance and budget transactions to generate insights.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Event ROI Data with dates and attendance
  const eventROIData = [
    { name: 'Fall Mixer', revenue: 2400, cost: 800, roi: 3.0, attendees: 85, date: '2025-10-15', expectedAttendees: 75, successRate: 113 },
    { name: 'Winter Gala', revenue: 5200, cost: 1500, roi: 3.47, attendees: 120, date: '2025-12-10', expectedAttendees: 100, successRate: 120 },
    { name: 'Career Fair', revenue: 3600, cost: 1200, roi: 3.0, attendees: 200, date: '2026-01-20', expectedAttendees: 150, successRate: 133 },
    { name: 'Alumni Event', revenue: 4100, cost: 1100, roi: 3.73, attendees: 95, date: '2026-02-14', expectedAttendees: 90, successRate: 106 },
    { name: 'Spring Social', revenue: 1800, cost: 600, roi: 3.0, attendees: 70, date: '2026-03-08', expectedAttendees: 80, successRate: 88 },
  ];

  // Daily data (last 30 days)
  const dailyData = [
    { date: 'Mar 1', revenue: 120, costs: 40, attendance: 15 },
    { date: 'Mar 3', revenue: 180, costs: 60, attendance: 22 },
    { date: 'Mar 5', revenue: 150, costs: 50, attendance: 18 },
    { date: 'Mar 8', revenue: 1800, costs: 600, attendance: 70 },
    { date: 'Mar 10', revenue: 220, costs: 80, attendance: 28 },
    { date: 'Mar 12', revenue: 190, costs: 65, attendance: 24 },
    { date: 'Mar 14', revenue: 160, costs: 55, attendance: 20 },
  ];

  // Monthly Revenue vs Costs
  const monthlyData = [
    { month: 'Oct', revenue: 2400, costs: 800, attendance: 85 },
    { month: 'Nov', revenue: 3200, costs: 1100, attendance: 92 },
    { month: 'Dec', revenue: 5200, costs: 1500, attendance: 120 },
    { month: 'Jan', revenue: 2800, costs: 900, attendance: 78 },
    { month: 'Feb', revenue: 4100, costs: 1100, attendance: 95 },
    { month: 'Mar', revenue: 3600, costs: 1200, attendance: 110 },
  ];

  // Yearly data
  const yearlyData = [
    { year: '2023', revenue: 14200, costs: 4800, attendance: 450 },
    { year: '2024', revenue: 18600, costs: 6200, attendance: 580 },
    { year: '2025', revenue: 21300, costs: 6600, attendance: 570 },
  ];

  // Budget Distribution
  const budgetDistribution = [
    { name: 'Events', value: 3000, color: '#3b82f6' },
    { name: 'Marketing', value: 1200, color: '#a855f7' },
    { name: 'Operations', value: 800, color: '#22c55e' },
    { name: 'Outreach', value: 900, color: '#f97316' },
    { name: 'Technology', value: 600, color: '#ec4899' },
  ];

  // Get data based on selected time period
  const getTimeSeriesData = () => {
    switch (timePeriod) {
      case 'day':
        return dailyData;
      case 'month':
        return monthlyData;
      case 'year':
        return yearlyData;
      default:
        return monthlyData;
    }
  };

  const timeSeriesData = getTimeSeriesData();
  const xAxisKey = timePeriod === 'day' ? 'date' : timePeriod === 'month' ? 'month' : 'year';

  // Calculate totals
  const totalRevenue = eventROIData.reduce((sum, event) => sum + event.revenue, 0);
  const totalCosts = eventROIData.reduce((sum, event) => sum + event.cost, 0);
  const averageROI = eventROIData.reduce((sum, event) => sum + event.roi, 0) / eventROIData.length;
  const totalAttendees = eventROIData.reduce((sum, event) => sum + event.attendees, 0);
  const averageSuccessRate = eventROIData.reduce((sum, event) => sum + event.successRate, 0) / eventROIData.length;
  const netProfit = totalRevenue - totalCosts;

  // Top performing event
  const topEvent = eventROIData.reduce((prev, current) => (prev.roi > current.roi) ? prev : current);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Analytics & Insights</h2>
          <p className="text-slate-600 mt-1">Visualize event performance and financial metrics</p>
        </div>
        
        {/* Time Period Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <Button
            variant={timePeriod === 'day' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTimePeriod('day')}
            className={timePeriod === 'day' ? '' : 'hover:bg-slate-200'}
          >
            Day
          </Button>
          <Button
            variant={timePeriod === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTimePeriod('month')}
            className={timePeriod === 'month' ? '' : 'hover:bg-slate-200'}
          >
            Month
          </Button>
          <Button
            variant={timePeriod === 'year' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setTimePeriod('year')}
            className={timePeriod === 'year' ? '' : 'hover:bg-slate-200'}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Average ROI</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">{averageROI.toFixed(2)}x</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">+0.5x from Q4</p>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Net Profit</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">${netProfit.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <p className="text-xs text-green-600">+18% from last period</p>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Attendees</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">{totalAttendees}</p>
                <p className="text-xs text-slate-500 mt-1">Across {eventROIData.length} events</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Success Rate</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">{averageSuccessRate.toFixed(0)}%</p>
                <p className="text-xs text-slate-500 mt-1">Attendance vs Expected</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Trophy className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performer Highlight */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-purple-900">Top Performing Event</h3>
              </div>
              <p className="text-2xl font-semibold text-purple-900">{topEvent.name}</p>
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <p className="text-xs text-purple-600">ROI</p>
                  <p className="font-semibold text-purple-900">{topEvent.roi}x</p>
                </div>
                <div>
                  <p className="text-xs text-purple-600">Revenue</p>
                  <p className="font-semibold text-purple-900">${topEvent.revenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-600">Attendees</p>
                  <p className="font-semibold text-purple-900">{topEvent.attendees}</p>
                </div>
                <div>
                  <p className="text-xs text-purple-600">Success Rate</p>
                  <p className="font-semibold text-purple-900">{topEvent.successRate}%</p>
                </div>
              </div>
            </div>
            <Badge className="bg-purple-600 text-white">Best ROI</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Time-Based Chart - Main Feature */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Over Time - {timePeriod === 'day' ? 'Daily' : timePeriod === 'month' ? 'Monthly' : 'Yearly'}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {timePeriod === 'day' ? 'Last 30 Days' : timePeriod === 'month' ? 'Last 6 Months' : 'Last 3 Years'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#22c55e" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                name="Revenue ($)" 
              />
              <Area 
                type="monotone" 
                dataKey="costs" 
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCosts)" 
                name="Costs ($)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event ROI Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Event ROI Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventROIData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                <Bar dataKey="cost" fill="#f97316" name="Cost ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Trends by Time Period */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends - {timePeriod === 'day' ? 'Daily' : timePeriod === 'month' ? 'Monthly' : 'Yearly'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="attendance" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  name="Attendees"
                  dot={{ fill: '#8b5cf6', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Budget Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {budgetDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Event Success Rate (Attendance vs Expected) */}
        <Card>
          <CardHeader>
            <CardTitle>Event Success Rate by Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventROIData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="expectedAttendees" fill="#94a3b8" name="Expected" />
                <Bar dataKey="attendees" fill="#10b981" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Event Performance Table with Attendance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Event Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Event</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Cost</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Profit</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">ROI</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Attendees</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Expected</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Success</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Cost/Person</th>
                </tr>
              </thead>
              <tbody>
                {eventROIData.map((event, index) => {
                  const profit = event.revenue - event.cost;
                  const costPerPerson = event.cost / event.attendees;
                  
                  return (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-900">{event.name}</td>
                      <td className="py-3 px-4 text-right text-green-600">${event.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-red-600">${event.cost.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-900">${profit.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge className="bg-purple-100 text-purple-700">{event.roi.toFixed(2)}x</Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-900">{event.attendees}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{event.expectedAttendees}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge 
                          className={
                            event.successRate >= 100 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-orange-100 text-orange-700'
                          }
                        >
                          {event.successRate}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600">${costPerPerson.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-semibold">
                  <td className="py-3 px-4 text-slate-900">Total / Avg</td>
                  <td className="py-3 px-4 text-right text-green-600">${totalRevenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-red-600">${totalCosts.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-slate-900">${netProfit.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <Badge className="bg-purple-100 text-purple-700">{averageROI.toFixed(2)}x</Badge>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-900">{totalAttendees}</td>
                  <td className="py-3 px-4 text-right text-slate-600">
                    {eventROIData.reduce((sum, e) => sum + e.expectedAttendees, 0)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Badge className="bg-blue-100 text-blue-700">{averageSuccessRate.toFixed(0)}%</Badge>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600">
                    ${(totalCosts / totalAttendees).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
