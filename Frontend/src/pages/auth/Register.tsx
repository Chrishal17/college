import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../components/layout/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { COMPLAINT_CATEGORIES, COLLEGE_TYPES, DEPARTMENTS, YEARS, SECTIONS } from '../../constants';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  rollNumber: z.string().min(1, 'Roll number required'),
  registerNumber: z.string().min(1, 'Register number required'),
  collegeType: z.string().min(1, 'College type required'),
  department: z.string().min(1, 'Department required'),
  year: z.string().min(1, 'Year required'),
  section: z.string().min(1, 'Section required'),
  phone: z.string().min(1, 'Phone number required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await registerUser({
        ...data,
        year: Number(data.year),
        confirmPassword: undefined,
      });
      navigate('/verify-otp', { state: { email: result.email } });
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Registration failed';
      const { toast } = await import('react-hot-toast');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Full Name" placeholder="John Doe" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" placeholder="your@email.com" error={errors.email?.message} {...register('email')} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Password" type="password" placeholder="Min 6 chars" error={errors.password?.message} {...register('password')} />
          <Input label="Confirm Password" type="password" placeholder="Confirm" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        </div>
        <Input label="Roll Number" placeholder="e.g., CS2024001" error={errors.rollNumber?.message} {...register('rollNumber')} />
        <Input label="Register Number" placeholder="e.g., REG001" error={errors.registerNumber?.message} {...register('registerNumber')} />
        <div className="grid grid-cols-2 gap-4">
          <Select label="College Type" options={COLLEGE_TYPES.map(t => ({ value: t, label: t }))} error={errors.collegeType?.message} {...register('collegeType')} />
          <Select label="Department" options={DEPARTMENTS.map(d => ({ value: d, label: d }))} error={errors.department?.message} {...register('department')} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Select label="Year" options={YEARS.map(y => ({ value: String(y), label: `Year ${y}` }))} error={errors.year?.message} {...register('year')} />
          <Select label="Section" options={SECTIONS.map(s => ({ value: s, label: s }))} error={errors.section?.message} {...register('section')} />
          <Input label="Phone" placeholder="Phone number" error={errors.phone?.message} {...register('phone')} />
        </div>
        <Button type="submit" loading={loading} className="w-full">
          <UserPlus size={18} /> Register
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign In</Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
