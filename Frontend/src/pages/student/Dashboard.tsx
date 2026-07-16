import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Clock, CheckCircle2, AlertTriangle, FileText, Bell, Plus } from 'lucide-react';
import { studentService } from '../../services/student.service';
import PageHeader from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/Skeleton';
import type { DashboardStats } from '../../types';
import { formatDateTime, timeAgo } from '../../utils/helpers';
import { STATUS_COLORS } from '../../constants';

const statCards = [
  { key: 'totalComplaints', label: 'Total Complaints', icon: FileText, color: 'bg-indigo-500', link: '/my-complaints' },
  { key: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-500', link: '/my-complaints?status=Pending' },
  { key: 'resolved', label: 'Resolved', icon: CheckCircle2, color: 'bg-green-500', link: '/my-complaints?status=Resolved' },
  { key: 'critical', label: 'Critical', icon: AlertTriangle, color: 'bg-red-500', link: '/my-complaints?priority=Critical' },
] as const;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await studentService.getDashboardStats();
        setStats(res.data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{Array.from({length:4}).map((_,i)=><CardSkeleton key={i}/>)}</div>;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's an overview of your complaints." actions={
        <Link to="/raise-complaint"><Button><Plus size={18}/> Raise Complaint</Button></Link>
      }/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(({ key, label, icon: Icon, color, link }) => (
          <Link key={key} to={link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{(stats as any)?.[key] ?? 0}</p>
                </div>
                <div className={`p-3 rounded-xl ${color} text-white`}><Icon size={24}/></div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Complaints</h3>
            {stats?.recentComplaints?.length ? (
              <div className="space-y-3">
                {stats.recentComplaints.map((c) => (
                  <Link key={c._id} to={`/complaint/${c.complaintId}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{c.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{c.complaintId} &middot; {timeAgo(c.createdAt)}</p>
                    </div>
                    <Badge className={`${STATUS_COLORS[c.status]}`}>{c.status}</Badge>
                  </Link>
                ))}
              </div>
            ) : <p className="text-gray-500 dark:text-gray-400 text-sm">No complaints yet.</p>}
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/raise-complaint" className="flex items-center gap-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                <AlertCircle size={20}/><span className="font-medium">Raise New Complaint</span>
              </Link>
              <Link to="/my-complaints" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <FileText size={20} className="text-gray-600 dark:text-gray-400"/><span className="font-medium text-gray-700 dark:text-gray-300">View All Complaints</span>
              </Link>
              <Link to="/notifications" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell size={20} className="text-gray-600 dark:text-gray-400"/>
                <span className="font-medium text-gray-700 dark:text-gray-300">Notifications</span>
                {stats?.unreadNotificationCount ? <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{stats.unreadNotificationCount}</span> : null}
              </Link>
            </div>
            {stats?.latestNotification && (
              <div className="mt-4 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">{stats.latestNotification.title}</p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">{stats.latestNotification.message}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
