import React, { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import PageHeader from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import type { Complaint } from '../../types';
import { STATUS_COLORS, PRIORITY_COLORS, STATUS_OPTIONS, COMPLAINT_CATEGORIES, PRIORITY_OPTIONS } from '../../constants';
import { formatDateTime, timeAgo } from '../../utils/helpers';

const ManageComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const debouncedSearch = useDebounce(search);
  const { page, nextPage, prevPage, goToPage } = usePagination();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '10' };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status) params.status = status;
      if (category) params.category = category;
      if (priority) params.priority = priority;
      const res = await adminService.getComplaints(params);
      setComplaints(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, [page, debouncedSearch, status, category, priority]);

  return (
    <div>
      <PageHeader title="Complaint Management" subtitle="Manage all complaints from students" />
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1"><Input placeholder="Search complaints..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size={18}/>} /></div>
          <Select options={STATUS_OPTIONS.map(s => ({ value: s, label: s }))} value={status} onChange={(e) => { setStatus(e.target.value); goToPage(1); }} className="w-full md:w-48"/>
          <Select options={COMPLAINT_CATEGORIES.map(c => ({ value: c, label: c }))} value={category} onChange={(e) => { setCategory(e.target.value); goToPage(1); }} className="w-full md:w-48"/>
          <Select options={PRIORITY_OPTIONS.map(p => ({ value: p, label: p }))} value={priority} onChange={(e) => { setPriority(e.target.value); goToPage(1); }} className="w-full md:w-40"/>
        </div>
      </Card>

      {loading ? <TableSkeleton /> : complaints.length === 0 ? (
        <EmptyState title="No complaints found" description="Adjust your filters or wait for new complaints." />
      ) : (
        <>
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Complaint ID</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Title</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Student</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Category</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Priority</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
                    <th className="text-right p-4 font-medium text-gray-500 dark:text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {complaints.map((c) => {
                    const student = typeof c.studentId === 'object' ? c.studentId : null;
                    return (
                      <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="p-4 font-mono text-xs text-gray-600 dark:text-gray-400">{c.complaintId}</td>
                        <td className="p-4 font-medium text-gray-900 dark:text-white max-w-[200px] truncate">{c.title}</td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">{student?.name || 'Anonymous'}</td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">{c.category}</td>
                        <td className="p-4"><Badge className={PRIORITY_COLORS[c.priority]}>{c.priority}</Badge></td>
                        <td className="p-4"><Badge className={STATUS_COLORS[c.status]}>{c.status}</Badge></td>
                        <td className="p-4 text-gray-500 text-xs">{timeAgo(c.createdAt)}</td>
                        <td className="p-4 text-right">
                          <Link to={`/admin/complaint/${c.complaintId}`}>
                            <Button variant="ghost" size="sm"><Eye size={16}/></Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="mt-4"><Pagination page={page} totalPages={totalPages} onPageChange={goToPage} /></div>
        </>
      )}
    </div>
  );
};

export default ManageComplaints;
