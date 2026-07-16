import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';

const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex((v) => !v);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleVerify = async () => {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) {
      toast.error('Please enter the complete OTP');
      return;
    }
    setLoading(true);
    try {
      await authService.verifyOTP(email, otpStr);
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await authService.resendOTP(email);
      toast.success('OTP resent successfully');
      setResendTimer(60);
      setCanResend(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
          <ShieldCheck size={32} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Verify Your Email</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Enter the 6-digit OTP sent to<br />
          <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>
        </p>
      </div>
      <div className="flex justify-center gap-3 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400"
          />
        ))}
      </div>
      <Button onClick={handleVerify} loading={loading} className="w-full">
        Verify OTP
      </Button>
      <div className="mt-4 text-center">
        {canResend ? (
          <button onClick={handleResend} className="text-sm text-indigo-600 hover:text-indigo-500 font-medium flex items-center gap-1 mx-auto">
            <RotateCcw size={14} /> Resend OTP
          </button>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Resend OTP in {resendTimer}s
          </p>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyOTP;
