import React, { useEffect, useState } from 'react';
import { Search, Download, UserCheck, UserX, Trash2, Eye, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/admin.service';
import PageHeader from '../../components/layout/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { EmptyState } from '../../components/ui/EmptyState';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import type { Student } from '../../types';
import { downloadCSV } from '../../utils/helpers';

const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const debouncedSearch = useDebounce(search);
  const { page, nextPage, prevPage, goToPage } = usePagination();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '10' };
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await adminService.getStudents(params);
      setStudents(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStudents(); }, [page, debouncedSearch]);

  const handleStatusToggle = async (id: string, isActive: boolean) => {
    try {
      await adminService.updateStudentStatus(id, !isActive);
      toast.success(`Student ${isActive ? 'suspended' : 'activated'}`);
      fetchStudents();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await adminService.deleteStudent(id);
      toast.success('Student deleted');
      setShowModal(false);
      fetchStudents();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleExport = async () => {
    try {
      const res = await adminService.exportStudentsCSV();
      downloadCSV(res.data as unknown as string, 'students.csv');
      toast.success('CSV exported');
    } catch (err) { toast.error('Export failed'); }
  };

  return (
    <div>
      <PageHeader title="Student Management" subtitle="Manage all registered students" actions={
        <Button variant="outline" onClick={handleExport}><Download size={18}/> Export CSV</Button>
      }/>
      <Card className="mb-6">
        <Input placeholder="Search by name, email, roll number..." value={search} onChange={(e) => setSearch(e.target.value)} icon={<Search size={18}/>} />
      </Card>
      {loading ? <TableSkeleton /> : students.length === 0 ? (
        <EmptyState title="No students found" description="No students match your search criteria." />
      ) : (
        <>
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Name</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Email</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Department</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Year</th>
                    <th className="text-left p-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-right p-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {students.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900 dark:text-white">{s.name}</div>
                        <div className="text-xs text-gray-500">{s.rollNumber}</div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{s.email}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{s.department}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{s.year}</td>
                      <td className="p-4">
                        <Badge variant={s.verified ? (s.isActive ? 'success' : 'danger') : 'warning'}>
                          {s.verified ? (s.isActive ? 'Active' : 'Suspended') : 'Unverified'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => { setSelectedStudent(s); setShowModal(true); }}>
                            <Eye size={16}/>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleStatusToggle(s._id, s.isActive)}>
                            {s.isActive ? <UserX size={16} className="text-orange-500"/> : <UserCheck size={16} className="text-green-500"/>}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(s._id)}>
                            <Trash2 size={16} className="text-red-500"/>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="mt-4"><Pagination page={page} totalPages={totalPages} onPageChange={goToPage} /></div>
        </>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Student Details" size="lg">
        {selectedStudent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Name', selectedStudent.name], ['Email', selectedStudent.email],
                ['Roll Number', selectedStudent.rollNumber], ['Register Number', selectedStudent.registerNumber],
                ['Department', selectedStudent.department], ['Year', `Year ${selectedStudent.year}`],
                ['Section', selectedStudent.section], ['Phone', selectedStudent.phone],
                ['College Type', selectedStudent.collegeType],
                ['Verified', selectedStudent.verified ? 'Yes' : 'No'],
                ['Active', selectedStudent.isActive ? 'Yes' : 'No'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                  <p className="font-medium text-gray-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageStudents;
