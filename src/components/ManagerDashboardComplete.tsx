import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Shield,
  FlaskConical,
  Wrench,
  Package,
  Activity,
  FileText,
  Settings,
  Bell,
  LogOut,
  Search,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckSquare,
} from "lucide-react";
import { ManagerUserManagement } from "./manager/ManagerUserManagement";
import { ManagerRoleManagement } from "./manager/ManagerRoleManagement";
import { TestOrderManagement } from "./TestOrderManagement";
import { ManagerInstruments } from "./manager/ManagerInstruments";
import { ManagerWarehouse } from "./manager/ManagerWarehouse";
import { EventLogsManagement } from "./EventLogsManagement";
import { ReportsPage } from "./ReportsPage";
import { ManagerConfiguration } from "./manager/ManagerConfiguration";
import { ManagerNotifications } from "./manager/ManagerNotifications";
import { ManagerStaffApprovals } from "./manager/ManagerStaffApprovals";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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

interface ManagerDashboardCompleteProps {
  onLogout: () => void;
  managerName?: string;
}

type TabView =
  | "dashboard"
  | "users"
  | "roles"
  | "testOrders"
  | "instruments"
  | "warehouse"
  | "logs"
  | "reports"
  | "config"
  | "notifications"
  | "approvals";

// Dashboard Overview Component
function DashboardOverview({ kpiData, dailyTestOrders, instrumentUsage, testStatusData, recentActivities }: any) {
  const COLORS = ["#FFC107", "#007BFF", "#28A745", "#6C757D"];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-gradient-to-r from-[#E3F2FD] to-white">
        <CardContent className="pt-6">
          <h2 className="text-[#007BFF] mb-1">Welcome to Lab Manager Portal 👋</h2>
          <p className="text-[#6B7280]">Manage your laboratory operations and staff</p>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi: any, index: number) => (
          <Card
            key={index}
            className="shadow-lg border-[#BBDEFB] rounded-xl bg-white hover:shadow-xl transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-[#6B7280]">{kpi.label}</CardDescription>
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${kpi.color}20` }}>
                <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <h2 className="text-[#333333]">{kpi.value}</h2>
                <div
                  className={`flex items-center text-sm ${
                    kpi.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpi.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {kpi.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Test Orders */}
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
            <CardTitle className="text-[#007BFF]">Daily Test Orders</CardTitle>
            <CardDescription>Test volume for your laboratory</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTestOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="day" stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#007BFF"
                  strokeWidth={2}
                  dot={{ fill: "#007BFF", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Instrument Usage */}
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
            <CardTitle className="text-[#007BFF]">Instrument Usage Rate</CardTitle>
            <CardDescription>Department-wise instrument utilization</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="department" stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip />
                <Bar dataKey="usage" fill="#007BFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Test Status & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Status Distribution */}
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
            <CardTitle className="text-[#007BFF]">Reagent Stock Status</CardTitle>
            <CardDescription>Current inventory distribution</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={testStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {testStatusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
            <CardTitle className="text-[#007BFF]">Recent Activity</CardTitle>
            <CardDescription>Latest actions in your laboratory</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {recentActivities.map((activity: any) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-[#F9FBFF] rounded-xl">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Activity className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#333333]">
                        <span className="font-medium">{activity.user}</span> performed{" "}
                        <span className="font-medium">{activity.action}</span> in {activity.module}
                      </p>
                      <p className="text-xs text-[#999999] mt-1">{activity.timestamp}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {activity.result}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Panel */}
      <Card className="shadow-lg border-[#FFE082] rounded-xl bg-gradient-to-r from-[#FFF8E1] to-white">
        <CardHeader>
          <CardTitle className="text-[#FF9800]">Alerts & Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#FFE082]">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Package className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Low reagent stock warning</p>
                <p className="text-xs text-[#666666]">CBC Reagent Kit below minimum threshold</p>
              </div>
              <Button size="sm" variant="outline" className="rounded-xl">
                View
              </Button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#90CAF9]">
              <div className="p-2 rounded-lg bg-blue-100">
                <Wrench className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Mode change requests pending</p>
                <p className="text-xs text-[#666666]">2 instruments require approval</p>
              </div>
              <Button size="sm" variant="outline" className="rounded-xl">
                View
              </Button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#CE93D8]">
              <div className="p-2 rounded-lg bg-purple-100">
                <CheckSquare className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Unapproved tests</p>
                <p className="text-xs text-[#666666]">5 test orders awaiting approval</p>
              </div>
              <Button size="sm" variant="outline" className="rounded-xl">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ManagerDashboardComplete({
  onLogout,
  managerName = "Manager User",
}: ManagerDashboardCompleteProps) {
  const [currentTab, setCurrentTab] = useState<TabView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for charts (lab-scoped)
  const dailyTestOrders = [
    { day: "Day 1", orders: 35 },
    { day: "Day 5", orders: 42 },
    { day: "Day 10", orders: 38 },
    { day: "Day 15", orders: 51 },
    { day: "Day 20", orders: 45 },
    { day: "Day 25", orders: 57 },
    { day: "Day 30", orders: 62 },
  ];

  const instrumentUsage = [
    { department: "Hematology", usage: 85 },
    { department: "Chemistry", usage: 72 },
    { department: "Microbiology", usage: 68 },
    { department: "Immunology", usage: 55 },
  ];

  const testStatusData = [
    { name: "In Stock", value: 120, color: "#28A745" },
    { name: "Low Stock", value: 45, color: "#FFC107" },
    { name: "Critical", value: 15, color: "#DC3545" },
    { name: "Expired", value: 8, color: "#6C757D" },
  ];

  const kpiData = [
    {
      label: "Total Tests (Lab)",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: FlaskConical,
      color: "#007BFF",
    },
    {
      label: "Active Staff",
      value: "18",
      change: "+2",
      trend: "up",
      icon: Users,
      color: "#28A745",
    },
    {
      label: "Instruments Online",
      value: "8",
      change: "100%",
      trend: "up",
      icon: Wrench,
      color: "#6C757D",
    },
    {
      label: "Pending Approvals",
      value: "7",
      change: "+3",
      trend: "up",
      icon: CheckSquare,
      color: "#FFC107",
    },
  ];

  const recentActivities = [
    {
      id: "LOG-001",
      module: "Test Orders",
      action: "Approved Test",
      user: "Dr. Sarah Chen",
      timestamp: "2025-10-21 14:25",
      result: "Success",
    },
    {
      id: "LOG-002",
      module: "Instruments",
      action: "Mode Change",
      user: "John Miller",
      timestamp: "2025-10-21 14:20",
      result: "Success",
    },
    {
      id: "LOG-003",
      module: "Warehouse",
      action: "Refill Request",
      user: "Lisa Wong",
      timestamp: "2025-10-21 14:15",
      result: "Pending",
    },
    {
      id: "LOG-004",
      module: "User Management",
      action: "Add Staff",
      user: "Manager",
      timestamp: "2025-10-21 14:10",
      result: "Success",
    },
  ];

  const navigationItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", section: "main" },
    { id: "users", icon: Users, label: "User Management", section: "main" },
    { id: "roles", icon: Shield, label: "Role Management", section: "main" },
    { id: "testOrders", icon: FlaskConical, label: "Test Orders", section: "main" },
    { id: "instruments", icon: Wrench, label: "Instruments", section: "main" },
    { id: "warehouse", icon: Package, label: "Warehouse", section: "main" },
    { id: "logs", icon: Activity, label: "Event Logs", section: "main" },
    { id: "reports", icon: FileText, label: "Reports", section: "system" },
    { id: "config", icon: Settings, label: "Configuration", section: "system" },
    { id: "notifications", icon: Bell, label: "Notifications", section: "system" },
    { id: "approvals", icon: CheckSquare, label: "Staff Approvals", section: "system" },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return (
          <DashboardOverview
            kpiData={kpiData}
            dailyTestOrders={dailyTestOrders}
            instrumentUsage={instrumentUsage}
            testStatusData={testStatusData}
            recentActivities={recentActivities}
          />
        );
      case "users":
        return <ManagerUserManagement />;
      case "roles":
        return <ManagerRoleManagement />;
      case "testOrders":
        return <TestOrderManagement onNavigateToDashboard={() => setCurrentTab("dashboard")} />;
      case "instruments":
        return <ManagerInstruments />;
      case "warehouse":
        return <ManagerWarehouse />;
      case "logs":
        return <EventLogsManagement onNavigateToDashboard={() => setCurrentTab("dashboard")} />;
      case "reports":
        return <ReportsPage onNavigateToDashboard={() => setCurrentTab("dashboard")} />;
      case "config":
        return <ManagerConfiguration />;
      case "notifications":
        return <ManagerNotifications />;
      case "approvals":
        return <ManagerStaffApprovals />;
      default:
        return (
          <DashboardOverview
            kpiData={kpiData}
            dailyTestOrders={dailyTestOrders}
            instrumentUsage={instrumentUsage}
            testStatusData={testStatusData}
            recentActivities={recentActivities}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F9FBFF]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } flex-shrink-0 transition-all duration-300 bg-white border-r border-[#E0E6ED] flex flex-col h-screen sticky top-0 overflow-hidden`}
      >
        {sidebarOpen && (
          <>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007BFF] to-[#0056D2] flex items-center justify-center">
                  <FlaskConical className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-[#333333]">Lab System</h1>
                  <p className="text-xs text-[#6B7280]">Manager Portal</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 px-4">
              <div className="space-y-6 pb-6">
                {/* Main Navigation */}
                <div>
                  <p className="text-xs text-[#6B7280] px-3 mb-2">MAIN MENU</p>
                  <nav className="space-y-1">
                    {navigationItems
                      .filter((item) => item.section === "main")
                      .map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setCurrentTab(item.id as TabView)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            currentTab === item.id
                              ? "bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white shadow-lg"
                              : "text-[#6B7280] hover:bg-[#EAF3FF] hover:text-[#007BFF]"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                  </nav>
                </div>

                <Separator />

                {/* System Settings */}
                <div>
                  <p className="text-xs text-[#6B7280] px-3 mb-2">SYSTEM</p>
                  <nav className="space-y-1">
                    {navigationItems
                      .filter((item) => item.section === "system")
                      .map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setCurrentTab(item.id as TabView)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                            currentTab === item.id
                              ? "bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white shadow-lg"
                              : "text-[#6B7280] hover:bg-[#EAF3FF] hover:text-[#007BFF]"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                  </nav>
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E0E6ED] sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-xl"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* Global Search */}
              <div className="relative w-96 hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-[#E0E6ED] focus:border-[#007BFF]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentTab("notifications")}
                className="rounded-xl relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-xl flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-[#007BFF] to-[#0056D2] text-white">
                        {managerName.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-sm text-[#333333]">{managerName}</p>
                      <p className="text-xs text-[#6B7280]">Lab Manager</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-[#6B7280]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-[1600px] mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6">
              <p className="text-sm text-[#6B7280]">
                Dashboard /{" "}
                {navigationItems.find((item) => item.id === currentTab)?.label || "Dashboard"}
              </p>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
