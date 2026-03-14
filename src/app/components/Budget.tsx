import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { DollarSign, TrendingDown, TrendingUp, Plus, PieChart, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useOrgs } from './OrgContext';
import { cloneDemoBudgetCategories, cloneDemoTransactions, DEMO_ORG_ID } from '../data/demoClub';

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

const getBudgetCategoriesStorageKey = (orgId: string) => `clubhub-budget-categories:${orgId}`;
const getBudgetTransactionsStorageKey = (orgId: string) => `clubhub-budget-transactions:${orgId}`;

export default function Budget() {
  const { currentOrg } = useOrgs();

  const [categories, setCategories] = useState<BudgetCategory[]>(() => {
    if (typeof window === 'undefined' || !currentOrg?.id) return [];
    try {
      const stored = window.localStorage.getItem(getBudgetCategoriesStorageKey(currentOrg.id));
      if (stored) return JSON.parse(stored) as BudgetCategory[];
      return currentOrg.id === DEMO_ORG_ID ? (cloneDemoBudgetCategories() as BudgetCategory[]) : [];
    } catch {
      return currentOrg.id === DEMO_ORG_ID ? (cloneDemoBudgetCategories() as BudgetCategory[]) : [];
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window === 'undefined' || !currentOrg?.id) return [];
    try {
      const stored = window.localStorage.getItem(getBudgetTransactionsStorageKey(currentOrg.id));
      if (stored) return JSON.parse(stored) as Transaction[];
      return currentOrg.id === DEMO_ORG_ID ? (cloneDemoTransactions() as Transaction[]) : [];
    } catch {
      return currentOrg.id === DEMO_ORG_ID ? (cloneDemoTransactions() as Transaction[]) : [];
    }
  });
  const [isBudgetLoaded, setIsBudgetLoaded] = useState(false);

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [newCategory, setNewCategory] = useState<{ name: string; allocated: number; color: string }>({
    name: '',
    allocated: 0,
    color: 'bg-blue-500',
  });

  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (!currentOrg?.id) {
      setCategories([]);
      setTransactions([]);
      setSelectedMonth('all');
      setIsBudgetLoaded(true);
      return;
    }

    setIsBudgetLoaded(false);
    setSelectedMonth('all');
    try {
      const storedCategories = window.localStorage.getItem(getBudgetCategoriesStorageKey(currentOrg.id));
      const storedTransactions = window.localStorage.getItem(getBudgetTransactionsStorageKey(currentOrg.id));

      setCategories(
        storedCategories
          ? (JSON.parse(storedCategories) as BudgetCategory[])
          : currentOrg.id === DEMO_ORG_ID
            ? (cloneDemoBudgetCategories() as BudgetCategory[])
            : [],
      );
      setTransactions(
        storedTransactions
          ? (JSON.parse(storedTransactions) as Transaction[])
          : currentOrg.id === DEMO_ORG_ID
            ? (cloneDemoTransactions() as Transaction[])
            : [],
      );
    } catch {
      setCategories(currentOrg.id === DEMO_ORG_ID ? (cloneDemoBudgetCategories() as BudgetCategory[]) : []);
      setTransactions(currentOrg.id === DEMO_ORG_ID ? (cloneDemoTransactions() as Transaction[]) : []);
    } finally {
      setIsBudgetLoaded(true);
    }
  }, [currentOrg?.id]);

  useEffect(() => {
    if (!currentOrg?.id || !isBudgetLoaded) return;
    try {
      window.localStorage.setItem(getBudgetCategoriesStorageKey(currentOrg.id), JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories, currentOrg?.id, isBudgetLoaded]);

  useEffect(() => {
    if (!currentOrg?.id || !isBudgetLoaded) return;
    try {
      window.localStorage.setItem(getBudgetTransactionsStorageKey(currentOrg.id), JSON.stringify(transactions));
    } catch {
      // ignore
    }
  }, [transactions, currentOrg?.id, isBudgetLoaded]);

  const totalAllocated = categories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const remainingBudget = totalAllocated - totalSpent;
  const budgetUsagePercent = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  // Filter transactions by month
  const filteredTransactions = useMemo(
    () =>
      selectedMonth === 'all'
        ? transactions
        : transactions.filter((t) => {
            const transactionDate = new Date(t.date);
            const transactionMonth = transactionDate.toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
            });
            return transactionMonth === selectedMonth;
          }),
    [transactions, selectedMonth],
  );

  // Get unique months from transactions
  const uniqueMonths = useMemo(
    () =>
      Array.from(
        new Set(
          transactions.map((t) =>
            new Date(t.date).toLocaleString('en-US', { year: 'numeric', month: 'long' }),
          ),
        ),
      ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()),
    [transactions],
  );

  // Calculate monthly spending
  const monthlySpending =
    selectedMonth === 'all'
      ? totalSpent
      : filteredTransactions
          .filter((t) => t.type === 'expense')
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const handleAddTransaction = () => {
    if (categories.length === 0) {
      alert('Please create at least one budget category before adding a transaction.');
      return;
    }

    if (!newTransaction.category || !newTransaction.amount || !newTransaction.date || !newTransaction.type) {
      alert('Please fill in type, category, amount, and date.');
      return;
    }

    const amountNumber = Number(newTransaction.amount);
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      alert('Amount must be a positive number.');
      return;
    }

    const isExpense = newTransaction.type === 'expense';
    const signedAmount = isExpense ? -Math.abs(amountNumber) : Math.abs(amountNumber);

    const tx: Transaction = {
      id: transactions.length ? Math.max(...transactions.map((t) => t.id)) + 1 : 1,
      category: newTransaction.category,
      description: newTransaction.description || '',
      amount: signedAmount,
      date: newTransaction.date,
      type: newTransaction.type,
    };

    setTransactions((prev) => [...prev, tx]);

    // Update category spent
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === tx.category
          ? {
              ...cat,
              spent: Math.max(
                0,
                cat.spent + (isExpense ? amountNumber : -amountNumber),
              ),
            }
          : cat,
      ),
    );

    setIsDialogOpen(false);
    setNewTransaction({
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleAddCategory = () => {
    const trimmedName = newCategory.name.trim();
    if (!trimmedName) {
      alert('Please enter a category name.');
      return;
    }

    if (!Number.isFinite(newCategory.allocated) || newCategory.allocated <= 0) {
      alert('Allocated budget must be greater than 0.');
      return;
    }

    if (categories.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase())) {
      alert('A category with this name already exists.');
      return;
    }

    const nextCategory: BudgetCategory = {
      id: categories.length ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
      name: trimmedName,
      allocated: Number(newCategory.allocated),
      spent: 0,
      color: newCategory.color,
    };

    setCategories((prev) => [...prev, nextCategory]);
    setNewCategory({ name: '', allocated: 0, color: 'bg-blue-500' });
    setIsCategoryDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Budget Management</h2>
          <p className="text-slate-600 mt-1">Track spending and allocations across categories</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Budget Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">Category name</Label>
                  <Input
                    id="category-name"
                    placeholder="e.g., Events"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-allocated">Allocated budget ($)</Label>
                  <Input
                    id="category-allocated"
                    type="number"
                    min="1"
                    placeholder="1000"
                    value={newCategory.allocated || ''}
                    onChange={(e) =>
                      setNewCategory((prev) => ({ ...prev, allocated: Number(e.target.value) }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-color">Color tag</Label>
                  <Select
                    value={newCategory.color}
                    onValueChange={(value) => setNewCategory((prev) => ({ ...prev, color: value }))}
                  >
                    <SelectTrigger id="category-color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-blue-500">Blue</SelectItem>
                      <SelectItem value="bg-purple-500">Purple</SelectItem>
                      <SelectItem value="bg-green-500">Green</SelectItem>
                      <SelectItem value="bg-orange-500">Orange</SelectItem>
                      <SelectItem value="bg-pink-500">Pink</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" type="button" onClick={handleAddCategory}>
                  Save Category
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={categories.length === 0}>
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {categories.length === 0 ? (
                  <p className="text-sm text-slate-600">
                    Create at least one budget category first.
                  </p>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="transaction-type">Type</Label>
                      <Select
                        value={newTransaction.type}
                        onValueChange={(value) =>
                          setNewTransaction({ ...newTransaction, type: value as 'expense' | 'income' })
                        }
                      >
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
                      <Select
                        value={newTransaction.category}
                        onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                      >
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
                      <Input
                        id="transaction-description"
                        placeholder="Enter description"
                        value={newTransaction.description || ''}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transaction-amount">Amount ($)</Label>
                      <Input
                        id="transaction-amount"
                        type="number"
                        placeholder="0.00"
                        value={newTransaction.amount || ''}
                        onChange={(e) =>
                          setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="transaction-date">Date</Label>
                      <Input
                        id="transaction-date"
                        type="date"
                        value={newTransaction.date || ''}
                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                      />
                    </div>
                    <Button className="w-full" type="button" onClick={handleAddTransaction}>
                      Add Transaction
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
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
            {categories.length === 0 && (
              <div className="rounded-lg bg-slate-50 p-6 text-center">
                <p className="text-sm text-slate-600">No budget categories yet.</p>
                <p className="mt-1 text-xs text-slate-500">
                  Click <span className="font-medium">Add Category</span> to set up your first allocation.
                </p>
              </div>
            )}
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
