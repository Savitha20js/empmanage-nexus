
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/ui/Header';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Filter, Download, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

// Mock attendance data for admin view
const attendanceRecords = [
  { 
    id: 1, 
    employeeId: 101, 
    employeeName: 'John Smith', 
    department: 'Engineering',
    checkIn: '2023-06-01T08:55:00',
    checkOut: '2023-06-01T17:05:00',
    totalHours: '8.17',
    status: 'Present',
  },
  { 
    id: 2, 
    employeeId: 102, 
    employeeName: 'Sarah Johnson', 
    department: 'HR',
    checkIn: '2023-06-01T09:02:00',
    checkOut: '2023-06-01T17:30:00',
    totalHours: '8.47',
    status: 'Present',
  },
  { 
    id: 3, 
    employeeId: 103, 
    employeeName: 'Michael Brown', 
    department: 'Marketing',
    checkIn: null,
    checkOut: null,
    totalHours: '0',
    status: 'Absent',
  },
  { 
    id: 4, 
    employeeId: 104, 
    employeeName: 'Emily Davis', 
    department: 'Sales',
    checkIn: '2023-06-01T08:45:00',
    checkOut: '2023-06-01T16:50:00',
    totalHours: '8.08',
    status: 'Present',
  },
  { 
    id: 5, 
    employeeId: 105, 
    employeeName: 'David Wilson', 
    department: 'Finance',
    checkIn: '2023-06-01T09:15:00',
    checkOut: null,
    totalHours: 'In Progress',
    status: 'Present',
  },
];

// Mock data for leave requests (admin view)
const leaveRequests = [
  {
    id: 1,
    employeeId: 102,
    employeeName: 'Sarah Johnson',
    department: 'HR',
    leaveType: 'Vacation',
    startDate: '2023-06-15',
    endDate: '2023-06-20',
    reason: 'Family vacation',
    status: 'Pending',
  },
  {
    id: 2,
    employeeId: 104,
    employeeName: 'Emily Davis',
    department: 'Sales',
    leaveType: 'Sick Leave',
    startDate: '2023-06-10',
    endDate: '2023-06-12',
    reason: 'Fever and cold',
    status: 'Approved',
  },
  {
    id: 3,
    employeeId: 101,
    employeeName: 'John Smith',
    department: 'Engineering',
    leaveType: 'Personal Leave',
    startDate: '2023-06-25',
    endDate: '2023-06-25',
    reason: 'Personal reasons',
    status: 'Rejected',
  },
];

// Mock personal attendance data (employee view)
const myAttendanceHistory = [
  {
    id: 1,
    date: '2023-06-01',
    checkIn: '08:55 AM',
    checkOut: '05:05 PM',
    totalHours: '8.17',
    status: 'Present',
  },
  {
    id: 2,
    date: '2023-05-31',
    checkIn: '09:02 AM',
    checkOut: '05:10 PM',
    totalHours: '8.13',
    status: 'Present',
  },
  {
    id: 3,
    date: '2023-05-30',
    checkIn: '08:47 AM',
    checkOut: '05:15 PM',
    totalHours: '8.47',
    status: 'Present',
  },
  {
    id: 4,
    date: '2023-05-29',
    checkIn: '09:05 AM',
    checkOut: '05:30 PM',
    totalHours: '8.42',
    status: 'Present',
  },
  {
    id: 5,
    date: '2023-05-26',
    checkIn: '-',
    checkOut: '-',
    totalHours: '0',
    status: 'Leave',
  },
];

// Mock personal leave requests (employee view)
const myLeaveRequests = [
  {
    id: 1,
    leaveType: 'Personal Leave',
    startDate: '2023-06-25',
    endDate: '2023-06-25',
    reason: 'Personal reasons',
    status: 'Rejected',
    comment: 'Insufficient team coverage',
  },
  {
    id: 2,
    leaveType: 'Sick Leave',
    startDate: '2023-05-26',
    endDate: '2023-05-26',
    reason: 'Migraine',
    status: 'Approved',
    comment: '',
  },
];

const Attendance = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState(isAdmin ? "daily" : "myAttendance");
  const [date, setDate] = useState<Date>(new Date());
  const [showCheckInOut, setShowCheckInOut] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  // Admin view columns
  const attendanceColumns = [
    { key: 'employeeName', header: 'Employee' },
    { key: 'department', header: 'Department' },
    { 
      key: 'checkIn', 
      header: 'Check In',
      render: (row: any) => row.checkIn ? format(new Date(row.checkIn), 'hh:mm a') : '-'
    },
    { 
      key: 'checkOut', 
      header: 'Check Out',
      render: (row: any) => row.checkOut ? format(new Date(row.checkOut), 'hh:mm a') : '-'
    },
    { key: 'totalHours', header: 'Total Hours' },
    { 
      key: 'status', 
      header: 'Status',
      render: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'Present' ? 'bg-green-100 text-green-800' :
          row.status === 'Absent' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  const leaveRequestColumns = [
    { key: 'employeeName', header: 'Employee' },
    { key: 'department', header: 'Department' },
    { key: 'leaveType', header: 'Leave Type' },
    { 
      key: 'startDate', 
      header: 'Start Date',
      render: (row: any) => format(new Date(row.startDate), 'MMM dd, yyyy')
    },
    { 
      key: 'endDate', 
      header: 'End Date',
      render: (row: any) => format(new Date(row.endDate), 'MMM dd, yyyy')
    },
    { key: 'reason', header: 'Reason' },
    { 
      key: 'status', 
      header: 'Status',
      render: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'Approved' ? 'bg-green-100 text-green-800' :
          row.status === 'Rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: any) => row.status === 'Pending' && (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600" onClick={() => handleLeaveAction(row.id, 'approve')}>
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleLeaveAction(row.id, 'reject')}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  // Employee view columns
  const myAttendanceColumns = [
    { 
      key: 'date', 
      header: 'Date',
      render: (row: any) => format(new Date(row.date), 'MMM dd, yyyy')
    },
    { key: 'checkIn', header: 'Check In' },
    { key: 'checkOut', header: 'Check Out' },
    { key: 'totalHours', header: 'Total Hours' },
    { 
      key: 'status', 
      header: 'Status',
      render: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'Present' ? 'bg-green-100 text-green-800' :
          row.status === 'Absent' ? 'bg-red-100 text-red-800' :
          row.status === 'Leave' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  const myLeaveRequestColumns = [
    { key: 'leaveType', header: 'Leave Type' },
    { 
      key: 'startDate', 
      header: 'Start Date',
      render: (row: any) => format(new Date(row.startDate), 'MMM dd, yyyy')
    },
    { 
      key: 'endDate', 
      header: 'End Date',
      render: (row: any) => format(new Date(row.endDate), 'MMM dd, yyyy')
    },
    { key: 'reason', header: 'Reason' },
    { 
      key: 'status', 
      header: 'Status',
      render: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'Approved' ? 'bg-green-100 text-green-800' :
          row.status === 'Rejected' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status}
        </span>
      )
    },
    { 
      key: 'comment', 
      header: 'Comment',
      render: (row: any) => row.comment || '-'
    }
  ];

  const handleCheckIn = () => {
    const now = new Date();
    const timeString = format(now, 'hh:mm a');
    
    setCheckedIn(true);
    toast.success(`Successfully checked in at ${timeString}`);
    
    // In a real app, you would send this to the server
    console.log('Check in time:', now.toISOString());
  };

  const handleCheckOut = () => {
    const now = new Date();
    const timeString = format(now, 'hh:mm a');
    
    setCheckedOut(true);
    toast.success(`Successfully checked out at ${timeString}`);
    
    // In a real app, you would send this to the server
    console.log('Check out time:', now.toISOString());
    
    // Hide the check-in/out panel after completing both
    setTimeout(() => {
      setShowCheckInOut(false);
    }, 2000);
  };

  const handleLeaveAction = (id: number, action: 'approve' | 'reject') => {
    // In a real app, you would update the server
    toast.success(`Leave request ${action === 'approve' ? 'approved' : 'rejected'}`);
  };

  return (
    <MainLayout title="Attendance Management" subtitle="Track employee attendance and manage leaves">
      {!isAdmin && showCheckInOut && (
        <Card className="mb-6 section-card border-blue-100">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-medium flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Today's Attendance
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(), 'EEEE, MMMM dd, yyyy')}
                </p>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  className="min-w-[120px]"
                  onClick={handleCheckIn}
                  disabled={checkedIn}
                >
                  {checkedIn ? 'Checked In' : 'Check In'}
                </Button>
                <Button 
                  variant="outline"
                  className="min-w-[120px]"
                  onClick={handleCheckOut}
                  disabled={!checkedIn || checkedOut}
                >
                  {checkedOut ? 'Checked Out' : 'Check Out'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="section-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Attendance</CardTitle>
              <CardDescription>
                {isAdmin 
                  ? "Track and manage employee attendance records" 
                  : "View your attendance history and manage leave requests"
                }
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {format(date, 'MMM dd, yyyy')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              {isAdmin && (
                <>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    <span>Filter</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    <span>Export</span>
                  </Button>
                </>
              )}
              
              {!isAdmin && (
                <Button size="sm">
                  <span>Request Leave</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isAdmin ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
                <TabsTrigger value="leaves">Leave Requests</TabsTrigger>
              </TabsList>
              <TabsContent value="daily">
                <DataTable 
                  data={attendanceRecords} 
                  columns={attendanceColumns} 
                />
              </TabsContent>
              <TabsContent value="leaves">
                <DataTable 
                  data={leaveRequests} 
                  columns={leaveRequestColumns} 
                />
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="myAttendance">My Attendance</TabsTrigger>
                <TabsTrigger value="myLeaves">My Leave Requests</TabsTrigger>
              </TabsList>
              <TabsContent value="myAttendance">
                <DataTable 
                  data={myAttendanceHistory} 
                  columns={myAttendanceColumns} 
                />
              </TabsContent>
              <TabsContent value="myLeaves">
                <DataTable 
                  data={myLeaveRequests} 
                  columns={myLeaveRequestColumns} 
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="section-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Present Days</p>
                  <div className="text-2xl font-bold">19/22</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Absent Days</p>
                  <div className="text-2xl font-bold">1/22</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Leave Days</p>
                  <div className="text-2xl font-bold">2/22</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="section-card md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Leaves</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <p>No upcoming leaves scheduled</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};

export default Attendance;
