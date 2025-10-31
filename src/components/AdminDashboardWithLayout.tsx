import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { AdminTabView } from "./AdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Users,
  FlaskConical,
  Wrench,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { UserManagement } from "./UserManagement";
import { RoleManagement } from "./RoleManagement";
import { PatientManagement } from "./PatientManagement";

interface AdminDashboardWithLayoutProps {
  onLogout: () => void;
  adminName?: string;
  adminEmail?: string;
}

export function AdminDashboardWithLayout({
  onLogout,
  adminName = "Admin User",
  adminEmail = "admin@labware.com",
}: AdminDashboardWithLayoutProps) {
  const [currentTab, setCurrentTab] = useState<AdminTabView>("dashboard");

  // Sample data for charts
  const dailyTestOrders = [
    { day: "Mon", orders: 45 },
    { day: "Tue", orders: 52 },
    { day: "Wed", orders: 48 },
    { day: "Thu", orders: 61 },
    { day: "Fri", orders: 55 },
    { day: "Sat", orders: 67 },
    { day: "Sun", orders: 72 },
  ];

  const instrumentUsage = [
    { department: "Hematology", usage: 85 },
    { department: "Chemistry", usage: 72 },
    { department: "Microbiology", usage: 68 },
    { department: "Immunology", usage: 55 },
    { department: "Pathology", usage: 62 },
  ];

  const testStatusData = [
    { name: "Pending", value: 120, color: "#FFC107" },
    { name: "In Progress", value: 85, color: "#1976D2" },
    { name: "Completed", value: 245, color: "#28A745" },
    { name: "Reviewed", value: 180, color: "#6C757D" },
  ];

  const kpiData = [
    {
      title: "Total Patients",
      value: "2,458",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "#1976D2",
    },
    {
      title: "Active Test Orders",
      value: "342",
      change: "+8.3%",
      trend: "up",
      icon: FlaskConical,
      color: "#28A745",
    },
    {
      title: "Instruments in Use",
      value: "24/28",
      change: "+2",
      trend: "up",
      icon: Wrench,
      color: "#17A2B8",
    },
    {
      title: "Low Stock Reagents",
      value: "8",
      change: "-3",
      trend: "down",
      icon: AlertTriangle,
      color: "#FFC107",
    },
    {
      title: "Monthly Revenue",
      value: "$124,580",
      change: "+15.2%",
      trend: "up",
      icon: DollarSign,
      color: "#28A745",
    },
  ];

  const recentActivities = [
    {
      id: "E_00012",
      module: "TestOrder",
      action: "Create",
      user: "labuser01",
      timestamp: "2025-10-28 10:30",
      result: "Success",
    },
    {
      id: "E_00011",
      module: "Patient",
      action: "Update",
      user: "admin01",
      timestamp: "2025-10-28 10:15",
      result: "Success",
    },
    {
      id: "E_00010",
      module: "Instrument",
      action: "Maintenance",
      user: "techuser02",
      timestamp: "2025-10-28 09:45",
      result: "Success",
    },
    {
      id: "E_00009",
      module: "Warehouse",
      action: "Restock",
      user: "manager01",
      timestamp: "2025-10-28 09:20",
      result: "Success",
    },
    {
      id: "E_00008",
      module: "User",
      action: "Create",
      user: "admin01",
      timestamp: "2025-10-28 08:55",
      result: "Success",
    },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case "users":
        return <UserManagement />;
      case "roles":
        return <RoleManagement />;
      case "patients":
        return <PatientManagement />;
      case "dashboard":
      default:
        return (
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-slate-800 mb-2">Admin Dashboard</h1>
                <p className="text-slate-600">
                  Welcome back, {adminName}! Here's what's happening today.
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Generate Report
              </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {kpiData.map((kpi, index) => {
                const Icon = kpi.icon;
                return (
                  <Card key={index} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${kpi.color}15` }}
                        >
                          <Icon className="h-6 w-6" style={{ color: kpi.color }} />
                        </div>
                        {kpi.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <h3 className="text-slate-800 mb-1">{kpi.value}</h3>
                      <p className="text-sm text-slate-600 mb-2">{kpi.title}</p>
                      <p
                        className={`text-sm ${
                          kpi.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {kpi.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Test Orders Chart */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800">Daily Test Orders</CardTitle>
                  <CardDescription>Last 7 days overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyTestOrders}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="day" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#1976D2"
                        strokeWidth={2}
                        dot={{ fill: "#1976D2", r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Test Status Distribution */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800">Test Status Distribution</CardTitle>
                  <CardDescription>Current status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={testStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {testStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Instrument Usage & Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Instrument Usage */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800">Instrument Usage by Department</CardTitle>
                  <CardDescription>Current utilization rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={instrumentUsage}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="department" stroke="#64748B" />
                      <YAxis stroke="#64748B" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E2E8F0",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="usage" fill="#1976D2" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-slate-800">Recent Activities</CardTitle>
                  <CardDescription>Latest system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-slate-800">
                              {activity.action} in{" "}
                              <span className="font-medium">{activity.module}</span>
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {activity.id}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">
                            by {activity.user} • {activity.timestamp}
                          </p>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    View All Activities
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <AdminLayout
      adminName={adminName}
      adminEmail={adminEmail}
      onLogout={onLogout}
      currentTab={currentTab}
      onTabChange={setCurrentTab}
    >
      {renderContent()}
    </AdminLayout>
  );
}
