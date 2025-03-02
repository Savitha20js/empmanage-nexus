
import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  className,
  actions,
}) => {
  return (
    <div className={cn(
      'flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 mb-6',
      className
    )}>
      <div className="space-y-1 mb-4 sm:mb-0">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default Header;
