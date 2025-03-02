import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Header from '@/components/ui/Header';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { Download, FileSpreadsheet, Filter, Plus, DollarSign, PieChart, Clock } from 'lucide-react';

// Mock payroll data
const payrollHistory = [
  { 
    id: 1, 
    employeeId: 101, 
    employeeName: 'John Smith', 
    department: 'Engineering',
    position: 'Senior Developer',
    baseSalary: 75000,
    overtimePay: 1200,
    bonus: 3000,
    deductions: 1850,
    netPay: 77350,
    payDate: '2023-05-01',
    status: 'Paid'
  },
  { 
    id: 2, 
    employeeId: 102, 
    employeeName: 'Sarah Johnson', 
    department: 'HR',
    position: 'HR Manager',
    baseSalary: 65000,
    overtimePay: 0,
    bonus: 2000,
    deductions: 1600,
    netPay: 65400,
    payDate: '2023-05-01',
    status: 'Paid'
  },
  { 
    id: 3, 
    employeeId: 103, 
    employeeName: 'Michael Brown', 
    department: 'Marketing',
    position: 'Marketing Specialist',
    baseSalary: 60000,
    overtimePay: 800,
    bonus: 1500,
    deductions: 1400,
    netPay: 60900,
    payDate: '2023-05-01',
    status: 'Paid'
  },
  { 
    id: 4, 
    employeeId: 104, 
    employeeName: 'Emily Davis', 
    department: 'Sales',
    position: 'Sales Representative',
    baseSalary: 55000,
    overtimePay: 1500,
    bonus: 4000,
    deductions: 1300,
    netPay: 59200,
    payDate: '2023-05-01',
    status: 'Paid'
  },
  { 
    id: 5, 
    employeeId: 105, 
    employeeName: 'David Wilson', 
    department: 'Finance',
    position: 'Financial Analyst',
    baseSalary: 70000,
    overtimePay: 500,
    bonus: 2000,
    deductions: 1700,
    netPay: 70800,
    payDate: '2023-05-01',
    status: 'Paid'
  },
];

// Current month payroll data (for admin)
const currentMonthPayroll = [
  { 
    id: 1, 
    employeeId: 101, 
    employeeName: 'John Smith', 
    department: 'Engineering',
    position: 'Senior Developer',
    baseSalary: 75000,
    overtimePay: 1400,
    bonus: 0,
    deductions: 1850,
    netPay: 74550,
    status: 'Pending'
  },
  { 
    id: 2, 
    employeeId: 102, 
    employeeName: 'Sarah Johnson', 
    department: 'HR',
    position: 'HR Manager',
    baseSalary: 65000,
    overtimePay: 0,
    bonus: 0,
    deductions: 1600,
    netPay: 63400,
    status: 'Pending'
  },
  { 
    id: 3, 
    employeeId: 103, 
    employeeName: 'Michael Brown', 
    department: 'Marketing',
    position: 'Marketing Specialist',
    baseSalary: 60000,
    overtimePay: 900,
    bonus: 0,
    deductions: 1400,
    netPay: 59500,
    status: 'Pending'
  },
  { 
    id: 4, 
    employeeId: 104, 
    employeeName: 'Emily Davis', 
    department: 'Sales',
    position: 'Sales Representative',
    baseSalary: 55000,
    overtimePay: 1200,
    bonus: 0,
    deductions: 1300,
    netPay: 54900,
    status: 'Pending'
  },
  { 
    id: 5, 
    employeeId: 105, 
    employeeName: 'David Wilson', 
    department: 'Finance',
    position: 'Financial Analyst',
    baseSalary: 70000,
    overtimePay: 600,
    bonus: 0,
    deductions: 1700,
    netPay: 68900,
    status: 'Pending'
  },
];

// For employee view - filter to just their own data
const myPayrollHistory = [
  { 
    id: 1, 
    payPeriod: 'May 2023',
    baseSalary: 75000 / 12,
    overtimePay: 1200,
    bonus: 3000,
    deductions: 1850,
    netPay: 77350 / 12,
    payDate: '2023-05-01',
    status: 'Paid'
  },
  { 
    id: 2, 
    payPeriod: 'April 2023',
    baseSalary: 75000 / 12,
    overtimePay: 950,
    bonus: 0,
    deductions: 1820,
    netPay: (75000 / 12) + 950 - 1820,
    payDate: '2023-04-01',
    status: 'Paid'
  },
  { 
    id: 3, 
    payPeriod: 'March 2023',
    baseSalary: 75000 / 12,
    overtimePay: 1050,
    bonus: 0,
    deductions: 1800,
    netPay: (75000 / 12) + 1050 - 1800,
    payDate: '2023-03-01',
    status: 'Paid'
  },
];

const Payroll = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState(isAdmin ? "current" : "history");

  // Define columns for the tables
  const adminCurrentColumns = [
    { key: 'employeeName', header: 'Employee' },
    { key: 'department', header: 'Department' },
    { key: 'position', header: 'Position' },
    { 
      key: 'baseSalary', 
      header: 'Base Salary',
      render: (row: any) => `$${(row.baseSalary / 12).toFixed(2)}`
    },
    { 
      key: 'overtimePay', 
      header: 'Overtime Pay',
      render: (row: any) => `$${row.overtimePay.toFixed(2)}`
    },
    { 
      key: 'netPay', 
      header: 'Net Pay',
      render: (row: any) => `$${(row.netPay / 12).toFixed(2)}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'Paid' ? 'bg-green-100 text-green-800' :
          row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const adminHistoryColumns = [
    { key: 'employeeName', header: 'Employee' },
    { key: 'department', header: 'Department' },
    { 
      key: 'payDate', 
      header: 'Pay Date',
      render: (row: any) => new Date(row.payDate).toLocaleDateString()
    },
    { 
      key: 'baseSalary', 
      header: 'Base Salary',
      render: (row: any) => `$${(row.baseSalary / 12).toFixed(2)}`
    },
    { 
      key: 'netPay', 
      header: 'Net Pay',
      render: (row: any) => `$${(row.netPay / 12).toFixed(2)}`
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'Paid' ? 'bg-green-100 text-green-800' :
          row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  const employeePayrollColumns = [
    { key: 'payPeriod', header: 'Pay Period' },
    { 
      key: 'baseSalary', 
      header: 'Base Salary',
      render: (row: any) => `$${row.baseSalary.toFixed(2)}`
    },
    { 
      key: 'overtimePay', 
      header: 'Overtime Pay',
      render: (row: any) => `$${row.overtimePay.toFixed(2)}`
    },
    { 
      key: 'bonus', 
      header: 'Bonus',
      render: (row: any) => `$${row.bonus.toFixed(2)}`
    },
    { 
      key: 'deductions', 
      header: 'Deductions',
      render: (row: any) => `$${row.deductions.toFixed(2)}`
    },
    { 
      key: 'netPay', 
      header: 'Net Pay',
      render: (row: any) => `$${row.netPay.toFixed(2)}`
    },
    { 
      key: 'payDate', 
      header: 'Pay Date',
      render: (row: any) => new Date(row.payDate).toLocaleDateString()
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (row: any) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === 'Paid' ? 'bg-green-100 text-green-800' :
          row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <MainLayout title="Payroll Management" subtitle="Track and manage employee compensation">
      <Card className="section-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Payroll</CardTitle>
              <CardDescription>
                {isAdmin 
                  ? "Manage and process employee compensation" 
                  : "View your payment history and details"
                }
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {isAdmin && (
                <>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    <span>Filter</span>
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-1" />
                    <span>Export</span>
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    <span>Process Payroll</span>
                  </Button>
                </>
              )}
              {!isAdmin && (
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  <span>Download Slips</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isAdmin ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="current">Current Month</TabsTrigger>
                <TabsTrigger value="history">Payment History</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="current">
                <DataTable 
                  data={currentMonthPayroll} 
                  columns={adminCurrentColumns} 
                />
              </TabsContent>
              <TabsContent value="history">
                <DataTable 
                  data={payrollHistory} 
                  columns={adminHistoryColumns} 
                />
              </TabsContent>
              <TabsContent value="analytics" className="h-72 flex items-center justify-center">
                <div className="text-center text-muted-foreground flex flex-col items-center">
                  <PieChart className="mb-2 h-10 w-10" />
                  <p>Payroll analytics visualization would appear here</p>
                  <p className="text-sm">Data visualization not implemented in this demo</p>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <DataTable 
              data={myPayrollHistory} 
              columns={employeePayrollColumns} 
            />
          )}
        </CardContent>
      </Card>
      
      {!isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="section-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <DollarSign className="h-5 w-5 mr-1 text-blue-500" />
                Current Monthly Salary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$6,250.00</div>
              <p className="text-sm text-muted-foreground mt-1">Base monthly salary</p>
            </CardContent>
          </Card>
          
          <Card className="section-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-1 text-blue-500" />
                Overtime This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12.5 hrs</div>
              <p className="text-sm text-muted-foreground mt-1">$1,400.00 additional pay</p>
            </CardContent>
          </Card>
          
          <Card className="section-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <PiggyBank className="h-5 w-5 mr-1 text-blue-500" />
                Year-to-Date Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$31,250.00</div>
              <p className="text-sm text-muted-foreground mt-1">Including bonuses and overtime</p>
            </CardContent>
          </Card>
        </div>
      )}
    </MainLayout>
  );
};

// Missing icon
function PiggyBank(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
      <path d="M2 9v1c0 1.1.9 2 2 2h1" />
      <path d="M16 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </svg>
  );
}

export default Payroll;
