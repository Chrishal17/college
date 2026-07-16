import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertCircle, CheckCircle2, Clock, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminService } from '../../services/admin.service';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/Skeleton';
import type { AdminDashboardStats } from '../../types';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../constants';
import { formatDateTime, timeAgo } from '../../utils/helpers';

const COLORS = ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const res = await adminService.getDashboard(); setStats(res.data.data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-4 gap-6">{Array.from({length:4}).map((_,i)=><CardSkeleton key={i}/>)}</div>;

  const cards = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'bg-indigo-500' },
    { label: 'Total Complaints', value: stats?.totalComplaints || 0, icon: AlertCircle, color: 'bg-blue-500' },
    { label: 'Resolved', value: stats?.resolvedComplaints || 0, icon: CheckCircle2, color: 'bg-green-500' },
    { label: 'Critical', value: stats?.criticalComplaints || 0, icon: AlertTriangle, color: 'bg-red-500' },
    { label: 'Pending', value: stats?.pendingComplaints || 0, icon: Clock, color: 'bg-yellow-500' },
    { label: "Today's", value: stats?.todayComplaints || 0, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Verified', value: stats?.verifiedStudents || 0, icon: Users, color: 'bg-teal-500' },
    { label: 'Pending Verify', value: stats?.pendingStudents || 0, icon: Clock, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Overview of the entire system" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-500 dark:text-gray-400">{label}</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p></div>
              <div className={`p-3 rounded-xl ${color} text-white`}><Icon size={22}/></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Pie Chart */}
        <Card>
          <CardTitle>Complaints by Category</CardTitle>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats?.charts.categoryStats.map(c => ({ name: c._id, value: c.count })) || []} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {stats?.charts.categoryStats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Priority Bar Chart */}
        <Card>
          <CardTitle>Priority Distribution</CardTitle>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.charts.priorityStats.map(p => ({ name: p._id, count: p.count })) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Bar Chart */}
        <Card>
          <CardTitle>Department Wise Complaints</CardTitle>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.charts.departmentStats.map(d => ({ name: d._id, count: d.count })) || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Trend */}
        <Card>
          <CardTitle>Monthly Complaints</CardTitle>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.charts.monthlyStats.map(m => ({ name: `${m._id.month}/${m._id.year}`, count: m.count })) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Complaints</CardTitle>
            <Link to="/admin/complaints"><Button variant="ghost" size="sm"><Eye size={16}/> View All</Button></Link>
          </div>
          <div className="space-y-3">
            {stats?.recentComplaints?.slice(0, 5).map((c) => (
              <Link key={c._id} to={`/admin/complaint/${c.complaintId}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{c.title}</p>
                  <p className="text-xs text-gray-500">{c.complaintId} &middot; {timeAgo(c.createdAt)}</p>
                </div>
                <Badge className={STATUS_COLORS[c.status] || ''}>{c.status}</Badge>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Students</CardTitle>
            <Link to="/admin/students"><Button variant="ghost" size="sm"><Eye size={16}/> View All</Button></Link>
          </div>
          <div className="space-y-3">
            {stats?.recentStudents?.slice(0, 5).map((s) => (
              <div key={s._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.email} &middot; {s.department}</p>
                </div>
                <Badge variant={s.verified ? 'success' : 'warning'}>{s.verified ? 'Verified' : 'Pending'}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
