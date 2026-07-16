import React from 'react';
import { cn } from '../../utils/helpers';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-lg',
};

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className }) => {
  const initials = name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '';
  if (src) {
    return <img src={src} alt={name || 'Avatar'} className={cn('rounded-full object-cover', sizes[size], className)} />;
  }
  return (
    <div className={cn('flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-semibold dark:bg-indigo-900/30 dark:text-indigo-400', sizes[size], className)}>
      {initials || <User size={size === 'sm' ? 14 : size === 'md' ? 18 : 28} />}
    </div>
  );
};
