import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { DollarSign, TrendingDown, TrendingUp, Plus, PieChart, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface BudgetCategory {
  id: number;
  name: string;
  allocated: number;
  spent: number;
  color: string;
}

interface Transaction {
  id: number;
  category: string;
  description: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
}

export default function Budget() {
  const totalBudget = 6500;
  
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: 1, name: 'Events', allocated: 3000, spent: 2150, color: 'bg-blue-500' },
    { id: 2, name: 'Marketing', allocated: 1200, spent: 850, color: 'bg-purple-500' },
    { id: 3, name: 'Operations', allocated: 800, spent: 650, color: 'bg-green-500' },
    { id: 4, name: 'Outreach', allocated: 900, spent: 400, color: 'bg-orange-500' },
    { id: 5, name: 'Technology', allocated: 600, spent: 200, color: 'bg-pink-500' },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, category: 'Events', description: 'Winter Gala Venue Deposit', amount: -1200, date: '2026-03-10', type: 'expense' },
    { id: 2, category: 'Marketing', description: 'Social Media Ads', amount: -350, date: '2026-03-12', type: 'expense' },
    { id: 3, category: 'Events', description: 'Sponsorship - Tech Corp', amount: 1500, date: '2026-03-08', type: 'income' },
    { id: 4, category: 'Operations', description: 'Office Supplies', amount: -125, date: '2026-03-11', type: 'expense' },
    { id: 5, category: 'Marketing', description: 'Print Materials', amount: -275, date: '2026-03-09', type: 'expense' },
    { id: 6, category: 'Outreach', description: 'Community Event Supplies', amount: -180, date: '2026-03-13', type: 'expense' },
    { id: 7, category: 'Events', description: 'February Mixer Catering', amount: -450, date: '2026-02-15', type: 'expense' },
    { id: 8, category: 'Marketing', description: 'January Campaign', amount: -225, date: '2026-01-20', type: 'expense' },
    { id: 9, category: 'Events', description: 'January Alumni Dinner', amount: -950, date: '2026-01-28', type: 'expense' },
    { id: 10, category: 'Technology', description: 'Website Hosting (Feb)', amount: -50, date: '2026-02-01', type: 'expense' },
    { id: 11, category: 'Operations', description: 'February Office Rent', amount: -300, date: '2026-02-01', type: 'expense' },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalAllocated - totalSpent;
  const budgetUsagePercent = (totalSpent / totalAllocated) * 100;

  // Filter transactions by month
  const filteredTransactions = selectedMonth === 'all' 
    ? transactions 
    : transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const transactionMonth = transactionDate.toLocaleString('en-US', { year: 'numeric', month: 'long' });
        return transactionMonth === selectedMonth;
      });

  // Get unique months from transactions
  const uniqueMonths = Array.from(new Set(
    transactions.map(t => new Date(t.date).toLocaleString('en-US', { year: 'numeric', month: 'long' }))
  )).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Calculate monthly spending
  const monthlySpending = selectedMonth === 'all' 
    ? totalSpent 
    : filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Budget Management</h2>
          <p className="text-slate-600 mt-1">Track spending and allocations across categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="transaction-type">Type</Label>
                <Select>
                  <SelectTrigger id="transaction-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transaction-category">Category</Label>
                <Select>
                  <SelectTrigger id="transaction-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transaction-description">Description</Label>
                <Input id="transaction-description" placeholder="Enter description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transaction-amount">Amount ($)</Label>
                <Input id="transaction-amount" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transaction-date">Date</Label>
                <Input id="transaction-date" type="date" />
              </div>
              <Button className="w-full">Add Transaction</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Month Filter */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <div className="flex-1">
              <Label htmlFor="month-filter" className="text-sm font-medium text-slate-700">Filter by Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger id="month-filter" className="mt-1 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {uniqueMonths.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedMonth !== 'all' && (
              <div className="text-right">
                <p className="text-sm text-slate-600">Spending in {selectedMonth}</p>
                <p className="text-2xl font-semibold text-slate-900">${monthlySpending.toLocaleString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Budget</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">${totalAllocated.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Spent</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">${totalSpent.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">{budgetUsagePercent.toFixed(1)}% of budget</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Remaining</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">${remainingBudget.toLocaleString()}</p>
                <p className="text-xs text-slate-500 mt-1">{(100 - budgetUsagePercent).toFixed(1)}% available</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600">Categories</p>
                <p className="text-2xl font-semibold text-slate-900 mt-2">{categories.length}</p>
                <p className="text-xs text-slate-500 mt-1">Active allocations</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <PieChart className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Budget by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categories.map(category => {
              const percentage = (category.spent / category.allocated) * 100;
              const remaining = category.allocated - category.spent;
              const isOverBudget = category.spent > category.allocated;
              
              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="font-medium text-slate-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-slate-900">
                        ${category.spent.toLocaleString()} / ${category.allocated.toLocaleString()}
                      </span>
                      {isOverBudget ? (
                        <Badge variant="destructive" className="ml-2">Over Budget</Badge>
                      ) : (
                        <span className="text-sm text-slate-600 ml-2">(${remaining.toLocaleString()} left)</span>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={Math.min(percentage, 100)} className="h-2" />
                    {isOverBudget && (
                      <div className="absolute top-0 left-0 h-2 bg-red-500 rounded-full" style={{ width: '100%' }} />
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{percentage.toFixed(1)}% used</span>
                    <span>{isOverBudget ? `${(percentage - 100).toFixed(1)}% over budget` : `${(100 - percentage).toFixed(1)}% remaining`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedMonth === 'all' ? 'Recent Transactions' : `Transactions - ${selectedMonth}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No transactions found for this month.</p>
            ) : (
              filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Badge variant="outline" className="text-xs">{transaction.category}</Badge>
                      <p className="font-medium text-slate-900">{transaction.description}</p>
                    </div>
                    <p className="text-sm text-slate-600">
                      {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className={`text-right ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    <p className="font-semibold text-lg">
                      {transaction.type === 'income' ? '+' : ''}{transaction.amount < 0 ? transaction.amount : `+${transaction.amount}`}
                    </p>
                    <p className="text-xs capitalize">{transaction.type}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}