import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Send, User as UserIcon, Clock, MapPin, Tag, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/admin.service';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Input } from '../../components/ui/Input';
import { CardSkeleton } from '../../components/ui/Skeleton';
import type { Complaint } from '../../types';
import { STATUS_COLORS, PRIORITY_COLORS, STATUS_OPTIONS } from '../../constants';
import { formatDateTime } from '../../utils/helpers';

const AdminComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [assignedStaff, setAssignedStaff] = useState('');
  const [remarkText, setRemarkText] = useState('');
  const [updating, setUpdating] = useState(false);
  const [remarkLoading, setRemarkLoading] = useState(false);

  const fetchComplaint = async () => {
    try {
      const res = await adminService.getComplaintById(id!);
      setComplaint(res.data.data);
      setStatus(res.data.data.status);
      setAdminRemarks(res.data.data.adminRemarks || '');
      setResolutionNotes(res.data.data.resolutionNotes || '');
      setAssignedStaff(res.data.data.assignedStaff || '');
    } catch (err: any) {
      toast.error('Complaint not found');
      navigate('/admin/complaints');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (id) fetchComplaint(); }, [id]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const data: Record<string, unknown> = { status };
      if (adminRemarks) data.adminRemarks = adminRemarks;
      if (resolutionNotes) data.resolutionNotes = resolutionNotes;
      if (assignedStaff) data.assignedStaff = assignedStaff;
      await adminService.updateComplaintStatus(id!, data);
      toast.success('Complaint updated');
      fetchComplaint();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setUpdating(false); }
  };

  const handleRemark = async () => {
    if (!remarkText.trim()) return;
    setRemarkLoading(true);
    try {
      await adminService.addRemark(id!, remarkText);
      toast.success('Remark added');
      setRemarkText('');
      fetchComplaint();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setRemarkLoading(false); }
  };

  if (loading) return <CardSkeleton />;
  if (!complaint) return null;
  const student = typeof complaint.studentId === 'object' ? complaint.studentId : null;

  return (
    <div>
      <PageHeader title={complaint.title} subtitle={complaint.complaintId} actions={
        <Link to="/admin/complaints"><Button variant="ghost"><ArrowLeft size={18}/> Back</Button></Link>
      }/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className={STATUS_COLORS[complaint.status]}>{complaint.status}</Badge>
              <Badge className={PRIORITY_COLORS[complaint.priority]}>{complaint.priority}</Badge>
              <Badge>{complaint.category}</Badge>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{complaint.description}</p>
            {complaint.images?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {complaint.images.map((img, i) => (
                  <img key={i} src={img.startsWith('http') ? img : `http://localhost:5000/uploads/${img}`} alt="" className="w-24 h-24 object-cover rounded-lg border"/>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardTitle>Timeline</CardTitle>
            <div className="mt-4 space-y-4">
              {[...complaint.timeline].reverse().map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 mt-1.5"/>
                    {i < complaint.timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1"/>}
                  </div>
                  <div className="pb-4">
                    <Badge className={STATUS_COLORS[entry.status]}>{entry.status}</Badge>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{entry.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(entry.updatedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Add Remark</CardTitle>
            <div className="mt-4 flex gap-3">
              <Textarea placeholder="Type a remark..." value={remarkText} onChange={(e) => setRemarkText(e.target.value)} className="flex-1" rows={2}/>
              <Button onClick={handleRemark} loading={remarkLoading} disabled={!remarkText.trim()}><Send size={18}/></Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Student Info */}
          {student && (
            <Card>
              <CardTitle>Student Details</CardTitle>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><UserIcon size={16}/> <span>{(student as any).name}</span></div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Tag size={16}/> <span>{(student as any).rollNumber}</span></div>
                <div className="text-gray-600 dark:text-gray-400 ml-6">{(student as any).email}</div>
                <div className="text-gray-600 dark:text-gray-400 ml-6">{(student as any).department} - Year {(student as any).year}</div>
              </div>
            </Card>
          )}

          {/* Update Panel */}
          <Card>
            <CardTitle>Update Complaint</CardTitle>
            <div className="mt-4 space-y-4">
              <Select label="Status" options={STATUS_OPTIONS.map(s => ({ value: s, label: s }))} value={status} onChange={(e) => setStatus(e.target.value)}/>
              <Input label="Assigned Staff" value={assignedStaff} onChange={(e) => setAssignedStaff(e.target.value)} placeholder="Staff member name" icon={<UserIcon size={18}/>}/>
              <Textarea label="Admin Remarks" value={adminRemarks} onChange={(e) => setAdminRemarks(e.target.value)} rows={3} placeholder="Add remarks..."/>
              <Textarea label="Resolution Notes" value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} rows={3} placeholder="Resolution details..."/>
              <Button onClick={handleUpdate} loading={updating} className="w-full"><Save size={18}/> Update Complaint</Button>
            </div>
          </Card>

          {/* Location */}
          {(complaint.location?.building || complaint.location?.roomNumber) && (
            <Card>
              <CardTitle>Location</CardTitle>
              <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {complaint.location.building && <div className="flex items-center gap-2"><MapPin size={16}/> Building: {complaint.location.building}</div>}
                {complaint.location.floor && <div className="flex items-center gap-2"><MapPin size={16}/> Floor: {complaint.location.floor}</div>}
                {complaint.location.roomNumber && <div className="flex items-center gap-2"><MapPin size={16}/> Room: {complaint.location.roomNumber}</div>}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintDetail;
