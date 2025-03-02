
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/ui/StatCard';
import Header from '@/components/ui/Header';
import DataTable from '@/components/ui/DataTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Users, DollarSign, Calendar, Clock, Bell, BarChart } from 'lucide-react';

// Type definition for employee metrics
type EmployeeMetric = {
  id: number;
  name: string;
  department: string;
  attendance: string;
  productivity: string;
  lastActive: string;
};

type Announcement = {
  id: number;
  title: string;
  content: string;
  date: string;
};

// Mock data for dashboard
const employeeMetrics: EmployeeMetric[] = [
  { id: 1, name: 'John Smith', department: 'Engineering', attendance: '92%', productivity: '87%', lastActive: '2 hours ago' },
  { id: 2, name: 'Sarah Johnson', department: 'HR', attendance: '96%', productivity: '91%', lastActive: '40 minutes ago' },
  { id: 3, name: 'Michael Brown', department: 'Marketing', attendance: '89%', productivity: '84%', lastActive: '1 day ago' },
  { id: 4, name: 'Emily Davis', department: 'Sales', attendance: '94%', productivity: '88%', lastActive: '3 hours ago' },
  { id: 5, name: 'David Wilson', department: 'Finance', attendance: '97%', productivity: '90%', lastActive: '5 hours ago' },
];

const announcements: Announcement[] = [
  { id: 1, title: 'Company Meeting', content: 'There will be a company-wide meeting on Friday at 3 PM.', date: '2023-05-20' },
  { id: 2, title: 'Holiday Notice', content: 'The office will be closed on Monday for the national holiday.', date: '2023-05-18' },
  { id: 3, title: 'New Health Benefits', content: 'New health benefits will be available starting next month.', date: '2023-05-15' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const metricsColumns = [
    { key: 'name' as keyof EmployeeMetric, header: 'Employee Name' },
    { key: 'department' as keyof EmployeeMetric, header: 'Department' },
    { key: 'attendance' as keyof EmployeeMetric, header: 'Attendance' },
    { key: 'productivity' as keyof EmployeeMetric, header: 'Productivity' },
    { key: 'lastActive' as keyof EmployeeMetric, header: 'Last Active' },
  ];

  const announcementColumns = [
    { key: 'title' as keyof Announcement, header: 'Title' },
    { key: 'content' as keyof Announcement, header: 'Content' },
    { key: 'date' as keyof Announcement, header: 'Date' },
  ];

  return (
    <MainLayout title="Dashboard" subtitle="Welcome back, overview of your workspace">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Employees" 
          value="48" 
          icon={<Users size={18} />} 
          change={5} 
          trend="up" 
        />
        <StatCard 
          title="Average Attendance" 
          value="92%" 
          icon={<Calendar size={18} />} 
          change={2} 
          trend="up" 
        />
        <StatCard 
          title="This Month Payroll" 
          value="$125,400" 
          icon={<DollarSign size={18} />} 
          change={8} 
          trend="up" 
        />
        <StatCard 
          title="Working Hours" 
          value="176h" 
          icon={<Clock size={18} />} 
          change={0} 
          trend="neutral" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2 section-card">
          <CardHeader className="pb-2">
            <CardTitle>Employee Performance</CardTitle>
            <CardDescription>Overview of employee metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable 
              data={employeeMetrics} 
              columns={metricsColumns} 
            />
          </CardContent>
        </Card>

        <Card className="section-card">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Announcements</CardTitle>
                <CardDescription>Latest company updates</CardDescription>
              </div>
              {isAdmin && (
                <Button size="sm" variant="outline">
                  <Bell className="h-4 w-4 mr-1" />
                  <span>New</span>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <h4 className="font-medium">{announcement.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(announcement.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {isAdmin && (
        <Card className="section-card">
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>Monitor key organizational metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="attendance">
              <TabsList className="mb-6">
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
              </TabsList>
              <TabsContent value="attendance" className="h-72 flex items-center justify-center">
                <div className="text-center text-muted-foreground flex flex-col items-center">
                  <BarChart className="mb-2 h-10 w-10" />
                  <p>Attendance analytics visualization would appear here</p>
                  <p className="text-sm">Data visualization not implemented in this demo</p>
                </div>
              </TabsContent>
              <TabsContent value="performance" className="h-72 flex items-center justify-center">
                <div className="text-center text-muted-foreground flex flex-col items-center">
                  <BarChart className="mb-2 h-10 w-10" />
                  <p>Performance analytics visualization would appear here</p>
                  <p className="text-sm">Data visualization not implemented in this demo</p>
                </div>
              </TabsContent>
              <TabsContent value="payroll" className="h-72 flex items-center justify-center">
                <div className="text-center text-muted-foreground flex flex-col items-center">
                  <BarChart className="mb-2 h-10 w-10" />
                  <p>Payroll analytics visualization would appear here</p>
                  <p className="text-sm">Data visualization not implemented in this demo</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </MainLayout>
  );
};

export default Dashboard;
