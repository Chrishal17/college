import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RotateCcw, Send, Clock, MapPin, Tag, AlertTriangle, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { complaintService } from '../../services/complaint.service';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { CardSkeleton } from '../../components/ui/Skeleton';
import type { Complaint } from '../../types';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../constants';
import { formatDateTime } from '../../utils/helpers';

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [reopenMessage, setReopenMessage] = useState('');
  const [reopenLoading, setReopenLoading] = useState(false);

  const fetchComplaint = async () => {
    try {
      const res = await complaintService.getById(id!);
      setComplaint(res.data.data);
    } catch (err: any) {
      toast.error('Complaint not found');
      navigate('/my-complaints');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (id) fetchComplaint(); }, [id]);

  const handleReply = async () => {
    if (!reply.trim()) return;
    setReplyLoading(true);
    try {
      await complaintService.addReply(id!, reply);
      toast.success('Reply added');
      setReply('');
      fetchComplaint();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setReplyLoading(false); }
  };

  const handleAccept = async () => {
    try {
      await complaintService.acceptResolution(id!);
      toast.success('Resolution accepted');
      fetchComplaint();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleReopen = async () => {
    setReopenLoading(true);
    try {
      await complaintService.reopen(id!, reopenMessage || 'Reopening complaint');
      toast.success('Complaint reopened');
      setReopenMessage('');
      fetchComplaint();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setReopenLoading(false); }
  };

  if (loading) return <CardSkeleton />;
  if (!complaint) return null;

  return (
    <div>
      <PageHeader title={complaint.title} subtitle={complaint.complaintId} actions={
        <Link to="/my-complaints"><Button variant="ghost"><ArrowLeft size={18}/> Back</Button></Link>
      }/>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge className={STATUS_COLORS[complaint.status] || ''}>{complaint.status}</Badge>
              <Badge className={PRIORITY_COLORS[complaint.priority] || ''}>{complaint.priority}</Badge>
              <Badge>{complaint.category}</Badge>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{complaint.description}</p>
            {complaint.images?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {complaint.images.map((img, i) => (
                  <img key={i} src={img.startsWith('http') ? img : `http://localhost:5000/uploads/${img}`} alt="" className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600" />
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
                    <div className="w-3 h-3 rounded-full bg-indigo-500 mt-1.5" />
                    {i < complaint.timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />}
                  </div>
                  <div className="pb-4">
                    <Badge className={STATUS_COLORS[entry.status] || ''}>{entry.status}</Badge>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{entry.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDateTime(entry.updatedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Add Reply</CardTitle>
            <div className="mt-4 flex gap-3">
              <Textarea placeholder="Type your reply..." value={reply} onChange={(e) => setReply(e.target.value)} className="flex-1" rows={2} />
              <Button onClick={handleReply} loading={replyLoading} disabled={!reply.trim()}><Send size={18}/></Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardTitle>Details</CardTitle>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Tag size={16}/> <span>{complaint.complaintId}</span></div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><Clock size={16}/> <span>Created: {formatDateTime(complaint.createdAt)}</span></div>
              {(complaint.location?.building || complaint.location?.roomNumber) && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin size={16}/>
                  <span>{[complaint.location.building, complaint.location.floor, complaint.location.roomNumber].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {complaint.assignedStaff && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><UserIcon size={16}/> <span>Assigned: {complaint.assignedStaff}</span></div>
              )}
            </div>
          </Card>

          {complaint.adminRemarks && (
            <Card>
              <CardTitle>Admin Remarks</CardTitle>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{complaint.adminRemarks}</p>
            </Card>
          )}

          {complaint.resolutionNotes && (
            <Card>
              <CardTitle>Resolution</CardTitle>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{complaint.resolutionNotes}</p>
            </Card>
          )}

          {complaint.status === 'Resolved' && (
            <Card className="border-green-200 dark:border-green-800">
              <CardTitle className="text-green-700 dark:text-green-400">Resolution Verification</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-4">This complaint has been resolved. Please verify the resolution.</p>
              <div className="flex gap-3">
                <Button onClick={handleAccept} className="bg-green-600 hover:bg-green-700"><CheckCircle2 size={18}/> Accept</Button>
                <Button variant="danger" onClick={() => document.getElementById('reopen-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  <RotateCcw size={18}/> Reopen
                </Button>
              </div>
            </Card>
          )}

          {complaint.status === 'Resolved' && (
            <Card id="reopen-section">
              <CardTitle>Reopen Complaint</CardTitle>
              <Textarea placeholder="Reason for reopening..." value={reopenMessage} onChange={(e) => setReopenMessage(e.target.value)} className="mt-2" rows={3} />
              <Button variant="danger" className="mt-3" onClick={handleReopen} loading={reopenLoading}><RotateCcw size={18}/> Reopen</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
