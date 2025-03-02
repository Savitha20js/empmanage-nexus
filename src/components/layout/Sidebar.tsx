
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  DollarSign, 
  Calendar, 
  ClipboardList, 
  Clock,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  
  const navItems = [
    { 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      href: '/dashboard' 
    },
    { 
      label: 'Payroll', 
      icon: <DollarSign size={20} />, 
      href: '/payroll' 
    },
    { 
      label: 'Attendance', 
      icon: <Calendar size={20} />, 
      href: '/attendance' 
    },
    { 
      label: 'Activity Log', 
      icon: <ClipboardList size={20} />, 
      href: '/activity-log' 
    },
  ];

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full z-30 transition-all duration-300 ease-in-out bg-sidebar border-r border-sidebar-border shadow-sm flex flex-col",
      collapsed ? "w-[70px]" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn(
          "flex items-center overflow-hidden transition-all duration-300",
          collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
        )}>
          <h2 className="font-bold text-lg">EMS</h2>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-sidebar-accent transition-colors duration-200"
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("transition-transform duration-300", collapsed ? "rotate-180" : "rotate-0")}
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) => cn(
                "sidebar-item group",
                isActive && "sidebar-item-active",
                collapsed && "justify-center px-2"
              )}
            >
              <span>{item.icon}</span>
              <span className={cn(
                "transition-all duration-300",
                collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100"
              )}>
                {item.label}
              </span>
              {collapsed && (
                <div className="absolute left-full ml-2 rounded-md px-2 py-1 bg-popover text-popover-foreground text-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center mb-4 overflow-hidden",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            {user?.name.charAt(0)}
          </div>
          <div className={cn(
            "ml-2 transition-all duration-300",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size={collapsed ? "icon" : "default"}
          onClick={logout}
          className={cn(
            "w-full transition-all",
            collapsed && "p-2"
          )}
        >
          <LogOut size={16} className="mr-2" />
          <span className={cn(
            "transition-all duration-300",
            collapsed ? "w-0 overflow-hidden hidden" : "w-auto"
          )}>
            Logout
          </span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
