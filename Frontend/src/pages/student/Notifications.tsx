import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { notificationService } from '../../services/notification.service';
import PageHeader from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import type { Notification } from '../../types';
import { timeAgo } from '../../utils/helpers';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.unreadCount);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    toast.success('All notifications marked as read');
  };

  const markRead = async (id: string) => {
    await notificationService.markRead(id);
    setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const deleteNotif = async (id: string) => {
    await notificationService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <div>
      <PageHeader title="Notifications" subtitle={`${unreadCount} unread notifications`} actions={
        unreadCount > 0 ? <Button variant="outline" onClick={markAllRead}><CheckCheck size={18}/> Mark All Read</Button> : null
      }/>
      {loading ? <div className="space-y-3">{Array.from({length:5}).map((_,i)=><div key={i} className="h-20 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"/>)}</div>
      : notifications.length === 0 ? <EmptyState icon={<Bell size={40}/>} title="No notifications" description="You're all caught up!" />
      : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card key={n._id} className={`transition-all ${!n.read ? 'border-l-4 border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1" onClick={() => !n.read && markRead(n._id)}>
                  <h4 className={`font-medium ${!n.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{n.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{timeAgo(n.createdAt)}</p>
                </div>
                <button onClick={() => deleteNotif(n._id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 size={16}/>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
