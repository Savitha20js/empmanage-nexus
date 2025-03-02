
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  trend = 'neutral',
  className,
  onClick,
}) => {
  const trendColorClass = 
    trend === 'up' 
      ? 'text-green-500' 
      : trend === 'down' 
        ? 'text-red-500' 
        : 'text-gray-500';

  return (
    <div 
      className={cn(
        'stat-card flex flex-col',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold">{value}</div>
        
        {change !== undefined && (
          <div className={cn("text-sm flex items-center", trendColorClass)}>
            {trend === 'up' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                <path d="M8 4L12.6464 8.64645L11.9393 9.35355L8.5 5.91421L8.5 12L7.5 12L7.5 5.91421L4.06066 9.35355L3.35355 8.64645L8 4Z" fill="currentColor" />
              </svg>
            )}
            {trend === 'down' && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                <path d="M8 12L3.35355 7.35355L4.06066 6.64645L7.5 10.0858L7.5 4L8.5 4L8.5 10.0858L11.9393 6.64645L12.6464 7.35355L8 12Z" fill="currentColor" />
              </svg>
            )}
            {change > 0 ? `+${change}%` : `${change}%`}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
