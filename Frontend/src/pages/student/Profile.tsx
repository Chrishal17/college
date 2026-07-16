import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Building2, GraduationCap, Hash, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentService } from '../../services/student.service';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Avatar } from '../../components/ui/Avatar';
import type { Student } from '../../types';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await studentService.getProfile();
        setStudent(res.data.data);
        setPhone(res.data.data.phone);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await studentService.updateProfile({ phone });
      setStudent((prev) => prev ? { ...prev, phone } : prev);
      setEditing(false);
      toast.success('Profile updated');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="animate-pulse space-y-6"><div className="h-48 rounded-xl bg-gray-200 dark:bg-gray-700"/><div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700"/></div>;
  if (!student) return null;

  const infoItems = [
    { icon: Hash, label: 'Roll Number', value: student.rollNumber },
    { icon: Hash, label: 'Register Number', value: student.registerNumber },
    { icon: Building2, label: 'College Type', value: student.collegeType },
    { icon: BookOpen, label: 'Department', value: student.department },
    { icon: GraduationCap, label: 'Year', value: `Year ${student.year}` },
    { icon: BookOpen, label: 'Section', value: student.section },
  ];

  return (
    <div>
      <PageHeader title="My Profile" subtitle="View and manage your profile information" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="text-center">
            <Avatar name={student.name} size="lg" className="mx-auto" />
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">{student.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
            <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${student.verified ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700'}`}>
              {student.verified ? 'Verified' : 'Unverified'}
            </span>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"><Mail size={16}/> {student.email}</div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"><Phone size={16}/> {student.phone}</div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardTitle>Personal Information</CardTitle>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <Icon size={18} className="text-gray-400"/>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>Contact Information</CardTitle>
            <div className="mt-4">
              {editing ? (
                <div className="flex gap-3">
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="flex-1"/>
                  <Button onClick={handleSave} loading={saving}>Save</Button>
                  <Button variant="ghost" onClick={() => { setEditing(false); setPhone(student.phone); }}>Cancel</Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-400"/>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{student.phone}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit</Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
