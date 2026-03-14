import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, CheckCircle2, Circle, User, Calendar, Flag, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
  category: string;
  team: string;
}

// Team structure
const teams = {
  'Marketing': ['Sarah Chen', 'Emma Davis'],
  'Events': ['Mike Johnson', 'Jessica Lee'],
  'Finance': ['Alex Brown', 'David Kim'],
  'Outreach': ['Rachel Martinez', 'Tom Anderson']
};

const boardMembers = [
  'Sarah Chen',
  'Mike Johnson',
  'Emma Davis',
  'Alex Brown',
  'Jessica Lee',
  'David Kim',
  'Rachel Martinez',
  'Tom Anderson'
];

const STORAGE_KEY = 'clubhub-tasks';

const defaultTasks: Task[] = [
  {
    id: 1,
    title: 'Design Spring Fundraiser Flyers',
    description: 'Create promotional materials for the upcoming fundraiser event',
    assignee: 'Sarah Chen',
    dueDate: '2026-03-18',
    priority: 'High',
    status: 'In Progress',
    category: 'Marketing',
    team: 'Marketing',
  },
  {
    id: 2,
    title: 'Book Venue for Networking Mixer',
    description: 'Research and secure venue for March 28th event',
    assignee: 'Mike Johnson',
    dueDate: '2026-03-16',
    priority: 'High',
    status: 'To Do',
    category: 'Events',
    team: 'Events',
  },
  {
    id: 3,
    title: 'Update Club Website',
    description: 'Add recent event photos and update member directory',
    assignee: 'Emma Davis',
    dueDate: '2026-03-20',
    priority: 'Medium',
    status: 'In Progress',
    category: 'Communications',
    team: 'Marketing',
  },
  {
    id: 4,
    title: 'Review Sponsorship Proposals',
    description: 'Evaluate three potential sponsors for Spring Fundraiser',
    assignee: 'Alex Brown',
    dueDate: '2026-03-17',
    priority: 'High',
    status: 'To Do',
    category: 'Finance',
    team: 'Finance',
  },
  {
    id: 5,
    title: 'Plan Community Outreach',
    description: 'Develop strategy for April community service project',
    assignee: 'Jessica Lee',
    dueDate: '2026-03-25',
    priority: 'Medium',
    status: 'To Do',
    category: 'Outreach',
    team: 'Events',
  },
  {
    id: 6,
    title: 'Send Thank You Notes',
    description: 'Write thank you notes to last event sponsors',
    assignee: 'Rachel Martinez',
    dueDate: '2026-03-15',
    priority: 'Low',
    status: 'Completed',
    category: 'Relations',
    team: 'Outreach',
  },
  {
    id: 7,
    title: 'Create Social Media Content Calendar',
    description: 'Plan Instagram and Facebook posts for next month',
    assignee: 'Sarah Chen',
    dueDate: '2026-03-22',
    priority: 'Medium',
    status: 'To Do',
    category: 'Marketing',
    team: 'Marketing',
  },
];

export default function Tasks() {
  const { user } = useAuth();

  const currentUser = user?.name ?? 'Sarah Chen';
  const currentUserTeam =
    Object.entries(teams).find(([, members]) => members.includes(currentUser))?.[0] || '';

  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === 'undefined') return defaultTasks;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Task[]) : defaultTasks;
    } catch {
      return defaultTasks;
    }
  });

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterTeam, setFilterTeam] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    assignee: currentUser,
    priority: 'Medium',
    status: 'To Do',
    category: 'General',
    team: currentUserTeam || 'Marketing',
    dueDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  const toggleTaskStatus = (taskId: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'Completed' ? 'To Do' : 'Completed';
        
        // Trigger confetti when task is completed
        if (newStatus === 'Completed') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
        
        return {
          ...task,
          status: newStatus
        };
      }
      return task;
    }));
  };

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filterStatus !== 'all' && task.status !== filterStatus) return false;
        if (filterAssignee !== 'all' && task.assignee !== filterAssignee) return false;
        if (filterTeam === 'my-team' && task.team !== currentUserTeam) return false;
        if (filterTeam === 'my-tasks' && task.assignee !== currentUser) return false;
        if (
          filterTeam !== 'all' &&
          filterTeam !== 'my-team' &&
          filterTeam !== 'my-tasks' &&
          task.team !== filterTeam
        )
          return false;
        return true;
      }),
    [tasks, filterStatus, filterAssignee, filterTeam, currentUserTeam, currentUser],
  );

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    toDo: tasks.filter(t => t.status === 'To Do').length,
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignee || !newTask.dueDate) {
      alert('Please fill in title, assignee, and due date.');
      return;
    }

    const next: Task = {
      id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
      title: newTask.title,
      description: newTask.description || '',
      assignee: newTask.assignee,
      dueDate: newTask.dueDate,
      priority: (newTask.priority as Task['priority']) || 'Medium',
      status: (newTask.status as Task['status']) || 'To Do',
      category: newTask.category || 'General',
      team: newTask.team || currentUserTeam || 'Marketing',
    };

    setTasks((prev) => [...prev, next]);
    setIsDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      assignee: currentUser,
      priority: 'Medium',
      status: 'To Do',
      category: 'General',
      team: currentUserTeam || 'Marketing',
      dueDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteTask = (taskId: number) => {
    if (!window.confirm('Delete this task?')) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50';
      case 'In Progress': return 'text-blue-600 bg-blue-50';
      case 'To Do': return 'text-slate-600 bg-slate-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">Task Management</h2>
          <p className="text-slate-600 mt-1">Coordinate and track board member responsibilities</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input
                  id="task-title"
                  placeholder="Enter task title"
                  value={newTask.title || ''}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea
                  id="task-description"
                  placeholder="Enter task description"
                  value={newTask.description || ''}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-assignee">Assign To</Label>
                  <Select
                    value={newTask.assignee}
                    onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}
                  >
                    <SelectTrigger id="task-assignee">
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent>
                      {boardMembers.map(member => (
                        <SelectItem key={member} value={member}>{member}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(value) =>
                      setNewTask({ ...newTask, priority: value as Task['priority'] })
                    }
                  >
                    <SelectTrigger id="task-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-date">Due Date</Label>
                <Input
                  id="task-date"
                  type="date"
                  value={newTask.dueDate || ''}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <Button className="w-full" type="button" onClick={handleCreateTask}>
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Info Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Logged in as: {currentUser}</p>
                <p className="text-sm text-slate-600">Team: {currentUserTeam} • Use filters to view your team's tasks or your personal assignments</p>
              </div>
            </div>
            <Badge className="bg-blue-600 text-white">
              <Users className="w-3 h-3 mr-1" />
              {currentUserTeam} Team
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Tasks</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">{taskStats.total}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">To Do</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">{taskStats.toDo}</p>
              </div>
              <Circle className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">In Progress</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">{taskStats.inProgress}</p>
              </div>
              <Circle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">{taskStats.completed}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label className="text-sm text-slate-600">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label className="text-sm text-slate-600">Filter by Assignee</Label>
              <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  {boardMembers.map(member => (
                    <SelectItem key={member} value={member}>{member}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label className="text-sm text-slate-600">Filter by Team</Label>
              <Select value={filterTeam} onValueChange={setFilterTeam}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="my-team">My Team</SelectItem>
                  <SelectItem value="my-tasks">My Tasks</SelectItem>
                  {Object.keys(teams).map(team => (
                    <SelectItem key={team} value={team}>{team}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map(task => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {task.status === 'Completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className={`font-medium text-slate-900 ${task.status === 'Completed' ? 'line-through text-slate-500' : ''}`}>
                      {task.title}
                    </h3>
                    <Badge className={getPriorityColor(task.priority)}>
                      <Flag className="w-3 h-3 mr-1" />
                      {task.priority}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <User className="w-4 h-4" />
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                    <Badge variant="outline" className="text-slate-600">
                      {task.category}
                    </Badge>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="ml-auto text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">No tasks found matching your filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}