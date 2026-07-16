import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { complaintService } from '../../services/complaint.service';
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
import { STATUS_COLORS, PRIORITY_COLORS, COMPLAINT_CATEGORIES, STATUS_OPTIONS, PRIORITY_OPTIONS } from '../../constants';
import { timeAgo } from '../../utils/helpers';

const MyComplaints: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [priority, setPriority] = useState(searchParams.get('priority') || '');
  const debouncedSearch = useDebounce(search);
  const { page, limit, nextPage, prevPage, goToPage } = usePagination();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params: Record<string, string> = { page: String(page), limit: String(limit) };
        if (debouncedSearch) params.search = debouncedSearch;
        if (status) params.status = status;
        if (category) params.category = category;
        if (priority) params.priority = priority;
        const res = await complaintService.getMyComplaints(params);
        setComplaints(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [page, debouncedSearch, status, category, priority]);

  return (
    <div>
      <PageHeader title="My Complaints" subtitle="Track and manage all your complaints" />
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1"><Input placeholder="Search by title or ID..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size={18}/>} /></div>
          <Select options={STATUS_OPTIONS.map(s => ({ value: s, label: s }))} value={status} onChange={(e) => { setStatus(e.target.value); goToPage(1); }} className="w-full md:w-48" />
          <Select options={COMPLAINT_CATEGORIES.map(c => ({ value: c, label: c }))} value={category} onChange={(e) => { setCategory(e.target.value); goToPage(1); }} className="w-full md:w-48" />
          <Select options={PRIORITY_OPTIONS.map(p => ({ value: p, label: p }))} value={priority} onChange={(e) => { setPriority(e.target.value); goToPage(1); }} className="w-full md:w-40" />
        </div>
      </Card>

      {loading ? <TableSkeleton /> : complaints.length === 0 ? (
        <EmptyState title="No complaints found" description="Try adjusting your filters or raise a new complaint." />
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <Link key={c._id} to={`/complaint/${c.complaintId}`}>
              <Card className="hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{c.title}</h3>
                      <Badge className={STATUS_COLORS[c.status] || ''}>{c.status}</Badge>
                      <Badge className={PRIORITY_COLORS[c.priority] || ''}>{c.priority}</Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{c.complaintId} &middot; {c.category}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{c.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(c.createdAt)}</span>
                </div>
              </Card>
            </Link>
          ))}
          <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />
        </div>
      )}
    </div>
  );
};

export default MyComplaints;
