import React, { useState } from 'react';
import { Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { studentService } from '../../services/student.service';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import PageHeader from '../../components/layout/PageHeader';
import { Card, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Moon, Sun, LogOut } from 'lucide-react';

const Settings: React.FC = () => {
  const { logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) { toast.error('Fill in all fields'); return; }
    if (newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await studentService.updatePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="Settings" />
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardTitle>Appearance</CardTitle>
          <button onClick={toggleDarkMode} className="mt-4 flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon size={20}/> : <Sun size={20}/>}
              <span className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</span>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform mt-0.5 ${darkMode ? 'translate-x-5.5 ml-0.5' : 'translate-x-0.5'}`}/>
            </div>
          </button>
        </Card>

        <Card>
          <CardTitle>Change Password</CardTitle>
          <div className="mt-4 space-y-4">
            <Input label="Current Password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} icon={<Lock size={18}/>} />
            <Input label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} icon={<Lock size={18}/>} placeholder="Min 6 characters" />
            <Button onClick={handlePasswordChange} loading={loading}><Save size={18}/> Update Password</Button>
          </div>
        </Card>

        <Card className="border-red-200 dark:border-red-800">
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Logout</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sign out of your account</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => { logout(); window.location.href = '/login'; }}>
              <LogOut size={16}/> Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
