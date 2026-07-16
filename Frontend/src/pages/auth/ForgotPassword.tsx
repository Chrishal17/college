import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('OTP sent to your email');
      setStep('otp');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await authService.resetPassword(email, otp, newPassword);
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {step === 'email' ? (
        <>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Forgot Password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your email to receive a reset OTP.</p>
          <div className="space-y-4">
            <Input label="Email" type="email" icon={<Mail size={18} />} placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button onClick={handleSendOTP} loading={loading} className="w-full">
              <Mail size={18} /> Send OTP
            </Button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter the OTP and your new password.</p>
          <div className="space-y-4">
            <Input label="OTP" icon={<KeyRound size={18} />} placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <Input label="New Password" type="password" icon={<Lock size={18} />} placeholder="Min 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Button onClick={handleReset} loading={loading} className="w-full">
              Reset Password
            </Button>
          </div>
        </>
      )}
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">Back to Login</Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
