
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/ui/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Filter, Clock, User } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';

// Mock activity log data
const activityLogData = [
  { id: 1, username: 'admin@example.com', action: 'Login', timestamp: '2023-05-20 08:30:45', ipAddress: '192.168.1.1', status: 'Success' },
  { id: 2, username: 'john@example.com', action: 'Login', timestamp: '2023-05-20 09:15:20', ipAddress: '192.168.1.2', status: 'Success' },
  { id: 3, username: 'sarah@example.com', action: 'Failed Login', timestamp: '2023-05-20 10:05:12', ipAddress: '192.168.1.3', status: 'Failed' },
  { id: 4, username: 'admin@example.com', action: 'View Payroll', timestamp: '2023-05-20 11:30:45', ipAddress: '192.168.1.1', status: 'Success' },
  { id: 5, username: 'john@example.com', action: 'Update Profile', timestamp: '2023-05-20 13:45:22', ipAddress: '192.168.1.2', status: 'Success' },
  { id: 6, username: 'admin@example.com', action: 'Generate Report', timestamp: '2023-05-20 14:30:45', ipAddress: '192.168.1.1', status: 'Success' },
  { id: 7, username: 'jane@example.com', action: 'Login', timestamp: '2023-05-20 15:10:33', ipAddress: '192.168.1.4', status: 'Success' },
  { id: 8, username: 'admin@example.com', action: 'Logout', timestamp: '2023-05-20 17:30:45', ipAddress: '192.168.1.1', status: 'Success' },
  { id: 9, username: 'john@example.com', action: 'Logout', timestamp: '2023-05-20 18:05:12', ipAddress: '192.168.1.2', status: 'Success' },
  { id: 10, username: 'unknown', action: 'Failed Login', timestamp: '2023-05-20 20:15:30', ipAddress: '192.168.1.5', status: 'Failed' },
];

type ActivityLog = {
  id: number;
  username: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  status: string;
};

const ActivityLog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const columns = [
    { key: 'username' as keyof ActivityLog, header: 'Username' },
    { key: 'action' as keyof ActivityLog, header: 'Action' },
    { key: 'timestamp' as keyof ActivityLog, header: 'Timestamp' },
    { key: 'ipAddress' as keyof ActivityLog, header: 'IP Address' },
    { 
      key: 'status' as keyof ActivityLog, 
      header: 'Status',
      render: (item: ActivityLog) => (
        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
          item.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {item.status}
        </span>
      )
    },
  ];

  const filteredData = activityLogData.filter(item => {
    const matchesSearch = item.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || item.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <Header 
          title="Login Activity Log" 
          subtitle="Monitor and analyze system access activities"
          actions={
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Log
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                Today's Logins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">24</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-500" />
                Unique Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">8</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2 text-red-500" />
                Failed Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by username or action..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center w-full md:w-1/2 gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="Login">Login</SelectItem>
                    <SelectItem value="Logout">Logout</SelectItem>
                    <SelectItem value="Failed">Failed Attempts</SelectItem>
                    <SelectItem value="Update">Updates</SelectItem>
                    <SelectItem value="Generate">Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DataTable columns={columns} data={filteredData} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ActivityLog;
