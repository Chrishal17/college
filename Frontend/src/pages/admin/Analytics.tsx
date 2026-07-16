import React, { useEffect, useState } from 'react';
import { BarChart3, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminService } from '../../services/admin.service';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardTitle } from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/Skeleton';
import type { AdminDashboardStats } from '../../types';

const COLORS = ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'];

const Analytics: React.FC = () => {
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

  if (loading) return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{Array.from({length:4}).map((_,i)=><CardSkeleton key={i}/>)}</div>;

  const categoryData = stats?.charts.categoryStats.map(c => ({ name: c._id, value: c.count })) || [];
  const deptData = stats?.charts.departmentStats.map(d => ({ name: d._id, count: d.count })) || [];
  const priorityData = stats?.charts.priorityStats.map(p => ({ name: p._id, count: p.count })) || [];
  const monthlyData = stats?.charts.monthlyStats.map(m => ({
    name: `${m._id.month}/${m._id.year}`,
    count: m.count,
  })).reverse() || [];

  const summaryCards = [
    { label: 'Total Complaints', value: stats?.totalComplaints || 0, icon: AlertCircle, color: 'bg-indigo-500' },
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Resolution Rate', value: stats ? `${Math.round((stats.resolvedComplaints / (stats.totalComplaints || 1)) * 100)}%` : '0%', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Critical Pending', value: stats?.criticalComplaints || 0, icon: AlertCircle, color: 'bg-red-500' },
  ];

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Detailed analytics and reports" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${color} text-white`}><Icon size={22}/></div>
              <div><p className="text-sm text-gray-500 dark:text-gray-400">{label}</p><p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p></div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>Category Distribution</CardTitle>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={2} dataKey="value" label={({ name, percent }: any) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Department Complaints</CardTitle>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Priority Distribution</CardTitle>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {priorityData.map((entry, i) => {
                    const colorMap: Record<string, string> = { Low: '#3b82f6', Medium: '#f59e0b', High: '#f97316', Critical: '#ef4444' };
                    return <Cell key={i} fill={colorMap[entry.name] || COLORS[i]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle>Monthly Trend</CardTitle>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
