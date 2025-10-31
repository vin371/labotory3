import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Shield,
  UserCircle,
  FlaskConical,
  Wrench,
  Package,
  Activity,
  FileText,
  Settings,
  Bell,
  Database,
  HelpCircle,
  LogOut,
  Search,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,

} from "lucide-react";
import { UserManagement } from "./UserManagement";
import { RoleManagement } from "./RoleManagement";
import { PatientManagement } from "./PatientManagement";
import { TestOrderService } from "./TestOrderService";
import { InstrumentManagement } from "./InstrumentManagement";
import { InstrumentServiceDashboard } from "./InstrumentServiceDashboard";
import { WarehouseService } from "./WarehouseService";
import { MonitoringService } from "./MonitoringService";
import { ReportsCenter } from "./ReportsCenter";
import { Configuration } from "./Configuration";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
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
  ResponsiveContainer
} from "recharts";

interface AdminDashboardCompleteProps {
  onLogout: () => void;
  adminName?: string;
}

type TabView =
  | "dashboard"
  | "users"
  | "roles"
  | "patients"
  | "testOrders"
  | "instruments"
  | "warehouse"
  | "logs"
  | "reports"
  | "config"
  | "notifications";

export function AdminDashboardComplete({ onLogout, adminName = "Admin User" }: AdminDashboardCompleteProps) {
  const [currentTab, setCurrentTab] = useState<TabView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for charts
  const dailyTestOrders = [
    { day: "Day 1", orders: 45 },
    { day: "Day 5", orders: 52 },
    { day: "Day 10", orders: 48 },
    { day: "Day 15", orders: 61 },
    { day: "Day 20", orders: 55 },
    { day: "Day 25", orders: 67 },
    { day: "Day 30", orders: 72 },
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
    { name: "In Progress", value: 85, color: "#007BFF" },
    { name: "Completed", value: 245, color: "#28A745" },
    { name: "Reviewed", value: 180, color: "#6C757D" },
  ];

  const kpiData = [
    { label: "Total Tests", value: "1,247", change: "+12.5%", trend: "up", icon: FlaskConical, color: "#007BFF" },
    { label: "Active Users", value: "127", change: "+8.2%", trend: "up", icon: Users, color: "#28A745" },
    { label: "Pending Orders", value: "43", change: "-5.4%", trend: "down", icon: Clock, color: "#FFC107" },
    { label: "Instruments", value: "18", change: "+2", trend: "up", icon: Wrench, color: "#6C757D" },
    { label: "Reports", value: "892", change: "+15.3%", trend: "up", icon: FileText, color: "#DC3545" },
  ];

  const recentActivities = [
    { id: "LOG-001", module: "Patient Service", action: "Create Record", user: "labuser@lab.com", timestamp: "2025-10-16 14:25", result: "Success" },
    { id: "LOG-002", module: "Test Orders", action: "Complete Test", user: "labuser@lab.com", timestamp: "2025-10-16 14:20", result: "Success" },
    { id: "LOG-003", module: "Instrument Service", action: "Mode Change", user: "labuser@lab.com", timestamp: "2025-10-16 14:15", result: "Success" },
    { id: "LOG-004", module: "User Management", action: "Update User", user: "admin@lab.com", timestamp: "2025-10-16 14:10", result: "Success" },
    { id: "LOG-005", module: "Configuration", action: "Modify Config", user: "service@lab.com", timestamp: "2025-10-16 14:05", result: "Success" },
  ];

  const notifications = [
    { id: 1, message: "New test order created", time: "5 minutes ago", type: "info" },
    { id: 2, message: "Instrument maintenance due", time: "1 hour ago", type: "warning" },
    { id: 3, message: "Report generated successfully", time: "2 hours ago", type: "success" },
  ];

  const navigationItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", section: "main" },
    { id: "users", icon: Users, label: "User Management", section: "main" },
    { id: "roles", icon: Shield, label: "Role Management", section: "main" },
    { id: "patients", icon: UserCircle, label: "Patients", section: "main" },
    { id: "testOrders", icon: FlaskConical, label: "Test Orders", section: "main" },
    { id: "instruments", icon: Wrench, label: "Instruments", section: "main" },
    { id: "warehouse", icon: Package, label: "Warehouse", section: "main" },
    { id: "logs", icon: Activity, label: "Event Logs", section: "main" },
    { id: "reports", icon: FileText, label: "Reports", section: "system" },
    { id: "config", icon: Settings, label: "Configuration", section: "system" },
    { id: "notifications", icon: Bell, label: "Notifications", section: "system" },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <DashboardOverview kpiData={kpiData} dailyTestOrders={dailyTestOrders} instrumentUsage={instrumentUsage} testStatusData={testStatusData} recentActivities={recentActivities} />;
      case "users":
        return <UserManagement />;
      case "roles":
        return <RoleManagement />;
      case "patients":
        return <PatientManagement />;
      case "testOrders":
        return <TestOrderService />;
      case "instruments":
        return <InstrumentServiceDashboard />;
      case "warehouse":
        return <WarehouseService />;
      case "logs":
        return <MonitoringService />;
      case "reports":
        return <ReportsCenter />;
      case "config":
        return <Configuration />;
      case "notifications":
        return <NotificationsTab />;
      default:
        return <DashboardOverview kpiData={kpiData} dailyTestOrders={dailyTestOrders} instrumentUsage={instrumentUsage} testStatusData={testStatusData} recentActivities={recentActivities} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F9FBFF]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} flex-shrink-0 transition-all duration-300 bg-white border-r border-[#E0E6ED] flex flex-col h-screen sticky top-0 overflow-hidden`}>
        {sidebarOpen && (
          <>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007BFF] to-[#0056D2] flex items-center justify-center">
                  <FlaskConical className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-[#333333]">Lab System</h1>
                  <p className="text-xs text-[#6B7280]">Management Portal</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 px-4">
              <div className="space-y-6 pb-6">
                {/* Main Navigation */}
                <div>
                  <p className="text-xs text-[#6B7280] px-3 mb-2">MAIN MENU</p>
                  <nav className="space-y-1">
                    {navigationItems.filter(item => item.section === "main").map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentTab(item.id as TabView)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          currentTab === item.id
                            ? 'bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white shadow-lg'
                            : 'text-[#6B7280] hover:bg-[#EAF3FF] hover:text-[#007BFF]'
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
                    {navigationItems.filter(item => item.section === "system").map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentTab(item.id as TabView)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          currentTab === item.id
                            ? 'bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white shadow-lg'
                            : 'text-[#6B7280] hover:bg-[#EAF3FF] hover:text-[#007BFF]'
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
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E0E6ED] p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-lg"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div className="text-sm text-[#6B7280]">
                Dashboard / <span className="text-[#333333]">
                  {navigationItems.find(item => item.id === currentTab)?.label || "Admin Overview"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 rounded-xl border-[#E0E6ED] focus:border-[#007BFF]"
                />
              </div>

              {/* Notification Bell */}
              <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-xl relative">
                    <Bell className="h-5 w-5 text-[#6B7280]" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#DC3545] rounded-full"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-xl">
                  <DropdownMenuLabel>Recent Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications.map((notif) => (
                    <DropdownMenuItem key={notif.id} className="flex flex-col items-start gap-1 p-3">
                      <div className="flex items-start gap-2 w-full">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          notif.type === 'warning' ? 'bg-[#FFC107]' :
                          notif.type === 'success' ? 'bg-[#28A745]' :
                          'bg-[#007BFF]'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm text-[#333333]">{notif.message}</p>
                          <p className="text-xs text-[#6B7280] mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-xl flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-[#007BFF] to-[#0056D2] text-white">
                        {adminName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-sm text-[#333333]">{adminName}</p>
                      <p className="text-xs text-[#6B7280]">Administrator</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-[#6B7280]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentTab("settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentTab("help")}>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help
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

        {/* Content Area */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview({ kpiData, dailyTestOrders, instrumentUsage, testStatusData, recentActivities }: any) {
  return (
    <div className="space-y-6 pb-12">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiData.map((kpi: any, index: number) => (
          <Card key={index} className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${kpi.color}15` }}>
                  <kpi.icon className="h-6 w-6" style={{ color: kpi.color }} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${kpi.trend === 'up' ? 'text-[#28A745]' : 'text-[#DC3545]'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{kpi.change}</span>
                </div>
              </div>
              <h3 className="text-2xl text-[#333333] mb-1">{kpi.value}</h3>
              <p className="text-sm text-[#6B7280]">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Test Orders Chart */}
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333]">Daily Test Orders</CardTitle>
            <CardDescription>Last 30 days performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTestOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#007BFF" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Instrument Usage Chart */}
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333]">Instrument Usage</CardTitle>
            <CardDescription>By department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
                <XAxis dataKey="department" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" fill="#007BFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Test Status & System Health Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Status Pie Chart */}
        <Card className="lg:col-span-2 rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333]">Test Status Distribution</CardTitle>
            <CardDescription>Current test orders by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={testStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {testStatusData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Health */}
        <div className="space-y-4">
          <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#333333]">🖥️ System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">CPU</span>
                  <span className="text-xs text-[#333333]">45%</span>
                </div>
                <Progress value={45} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">Memory</span>
                  <span className="text-xs text-[#333333]">62%</span>
                </div>
                <Progress value={62} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#333333]">👥 Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl text-[#333333]">127</p>
              <p className="text-xs text-[#6B7280] mt-1">Users currently online</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activities */}
      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#333333]">Recent Activities</CardTitle>
          <CardDescription>Latest system events and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0E6ED]">
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Event ID</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Module</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Action</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">User</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Result</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((activity: any) => (
                  <tr key={activity.id} className="border-b border-[#E0E6ED] hover:bg-[#F9FBFF]">
                    <td className="py-3 px-4 text-sm text-[#333333]">{activity.id}</td>
                    <td className="py-3 px-4 text-sm text-[#333333]">{activity.module}</td>
                    <td className="py-3 px-4 text-sm text-[#333333]">{activity.action}</td>
                    <td className="py-3 px-4 text-sm text-[#333333]">{activity.user}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{activity.timestamp}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-[#28A745] text-white">{activity.result}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Warehouse Tab
function WarehouseTab() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl text-[#333333] mb-2">Warehouse Management</h2>
        <p className="text-sm text-[#6B7280]">Manage inventory, reagents, and supplies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardContent className="p-6">
            <Package className="h-8 w-8 text-blue-600 mb-3" />
            <p className="text-2xl text-[#333333]">245</p>
            <p className="text-sm text-[#6B7280]">Total Items</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardContent className="p-6">
            <AlertTriangle className="h-8 w-8 text-amber-600 mb-3" />
            <p className="text-2xl text-[#333333]">12</p>
            <p className="text-sm text-[#6B7280]">Low Stock</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardContent className="p-6">
            <CheckCircle2 className="h-8 w-8 text-green-600 mb-3" />
            <p className="text-2xl text-[#333333]">198</p>
            <p className="text-sm text-[#6B7280]">In Stock</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardContent className="p-6">
            <Clock className="h-8 w-8 text-red-600 mb-3" />
            <p className="text-2xl text-[#333333]">8</p>
            <p className="text-sm text-[#6B7280]">Expired</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Current stock status</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-8">
            Warehouse inventory management interface
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Reports Tab
function ReportsTab() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl text-[#333333] mb-2">Reports & Analytics</h2>
        <p className="text-sm text-[#6B7280]">Generate and view system reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6">
            <FileText className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg text-[#333333] mb-1">Test Reports</h3>
            <p className="text-sm text-[#6B7280]">View all test results and analysis</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6">
            <Users className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="text-lg text-[#333333] mb-1">User Reports</h3>
            <p className="text-sm text-[#6B7280]">User activity and statistics</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6">
            <Activity className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="text-lg text-[#333333] mb-1">System Reports</h3>
            <p className="text-sm text-[#6B7280]">System performance metrics</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Generated reports from the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 text-center py-8">
            Report listing and generation interface
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Notifications Tab
function NotificationsTab() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl text-[#333333] mb-2">Notifications Center</h2>
        <p className="text-sm text-[#6B7280]">Manage system notifications and alerts</p>
      </div>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-[#6B7280]">Receive notifications via email</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>System Alerts</Label>
              <p className="text-sm text-[#6B7280]">Important system notifications</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label>Test Completion</Label>
              <p className="text-sm text-[#6B7280]">Notify when tests are completed</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Backup Tab
function BackupTab() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl text-[#333333] mb-2">Backup & Maintenance</h2>
        <p className="text-sm text-[#6B7280]">Manage system backups and data recovery</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle>Automated Backups</CardTitle>
            <CardDescription>Schedule automatic backups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Enable Auto Backup</Label>
              <Switch defaultChecked />
            </div>
            <div>
              <Label>Backup Frequency</Label>
              <select className="w-full mt-2 p-2 border border-[#E0E6ED] rounded-lg">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <Button className="w-full bg-[#007BFF] hover:bg-[#0056D2]">
              <HardDrive className="h-4 w-4 mr-2" />
              Create Backup Now
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle>Recent Backups</CardTitle>
            <CardDescription>Last 5 backup operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm text-[#333333]">Backup {i}</p>
                    <p className="text-xs text-[#6B7280]">2025-10-{16 - i} 02:00 AM</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Success</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Help Tab
function HelpTab() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl text-[#333333] mb-2">Help & Support</h2>
        <p className="text-sm text-[#6B7280]">Documentation and support resources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6">
            <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg text-[#333333] mb-1">Documentation</h3>
            <p className="text-sm text-[#6B7280]">User guides and manuals</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6">
            <LifeBuoy className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="text-lg text-[#333333] mb-1">Support</h3>
            <p className="text-sm text-[#6B7280]">Contact technical support</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6">
            <HelpCircle className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="text-lg text-[#333333] mb-1">FAQs</h3>
            <p className="text-sm text-[#6B7280]">Frequently asked questions</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Common help topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {["Getting Started", "User Management Guide", "Test Order Workflow", "Instrument Configuration", "Troubleshooting"].map((topic) => (
              <div key={topic} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                <p className="text-sm text-[#333333]">{topic}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Settings Tab
function SettingsTab({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl text-[#333333] mb-2">Settings</h2>
        <p className="text-sm text-[#6B7280]">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input defaultValue="Admin User" className="mt-2" />
            </div>
            <div>
              <Label>Email</Label>
              <Input defaultValue="admin@lab.com" className="mt-2" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input defaultValue="+84 912 345 678" className="mt-2" />
            </div>
            <Button className="w-full bg-[#007BFF] hover:bg-[#0056D2]">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Password and authentication</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <Input type="password" className="mt-2" />
            </div>
            <div>
              <Label>New Password</Label>
              <Input type="password" className="mt-2" />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input type="password" className="mt-2" />
            </div>
            <Button className="w-full bg-[#007BFF] hover:bg-[#0056D2]">
              Update Password
            </Button>
            <Separator />
            <Button variant="destructive" className="w-full" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
