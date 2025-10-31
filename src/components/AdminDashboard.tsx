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
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Filter,
  Plus,
  Save,
  RotateCcw,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { UserManagement } from "./UserManagement";
import { RoleManagement } from "./RoleManagement";
import { PatientManagement } from "./PatientManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
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

interface AdminDashboardProps {
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
  | "notifications" 
  | "backup" 
  | "help" 
  | "settings";

export function AdminDashboard({ onLogout, adminName = "Admin User" }: AdminDashboardProps) {
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
    {
      title: "Total Patients",
      value: "2,458",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "#007BFF"
    },
    {
      title: "Active Test Orders",
      value: "342",
      change: "+8.3%",
      trend: "up",
      icon: FlaskConical,
      color: "#28A745"
    },
    {
      title: "Instruments in Use",
      value: "24/28",
      change: "+2",
      trend: "up",
      icon: Wrench,
      color: "#17A2B8"
    },
    {
      title: "Low Stock Reagents",
      value: "8",
      change: "-3",
      trend: "down",
      icon: AlertTriangle,
      color: "#FFC107"
    },
    {
      title: "Monthly Revenue",
      value: "$124,580",
      change: "+15.2%",
      trend: "up",
      icon: DollarSign,
      color: "#28A745"
    },
  ];

  const recentActivities = [
    { id: "E_00012", module: "TestOrder", action: "Create", user: "labuser01", timestamp: "2025-10-16 10:30", result: "Success" },
    { id: "E_00011", module: "Patient", action: "Update", user: "admin01", timestamp: "2025-10-16 10:15", result: "Success" },
    { id: "E_00010", module: "Instrument", action: "Maintenance", user: "techuser02", timestamp: "2025-10-16 09:45", result: "Success" },
    { id: "E_00009", module: "Warehouse", action: "Restock", user: "manager01", timestamp: "2025-10-16 09:20", result: "Success" },
    { id: "E_00008", module: "User", action: "Create", user: "admin01", timestamp: "2025-10-16 08:55", result: "Success" },
  ];

  const notifications = [
    { id: 1, type: "warning", message: "Low stock alert: Reagent ABC-123 below threshold", time: "5 min ago" },
    { id: 2, type: "info", message: "Instrument maintenance scheduled for tomorrow", time: "1 hour ago" },
    { id: 3, type: "success", message: "New test order created successfully", time: "2 hours ago" },
    { id: 4, type: "warning", message: "System backup completed with warnings", time: "3 hours ago" },
  ];

  const navigationItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard Overview", section: "main" },
    { id: "users", icon: Users, label: "User Management", section: "admin" },
    { id: "roles", icon: Shield, label: "Role Management", section: "admin" },
    { id: "patients", icon: UserCircle, label: "Patients", section: "main" },
    { id: "testOrders", icon: FlaskConical, label: "Test Orders", section: "main" },
    { id: "instruments", icon: Wrench, label: "Instruments", section: "main" },
    { id: "warehouse", icon: Package, label: "Warehouse", section: "main" },
    { id: "logs", icon: Activity, label: "Monitoring Logs", section: "system" },
    { id: "reports", icon: FileText, label: "Reports", section: "main" },
    { id: "config", icon: Settings, label: "System Configuration", section: "system" },
    { id: "notifications", icon: Bell, label: "Notifications", section: "system" },
    { id: "backup", icon: Database, label: "Backup & Maintenance", section: "system" },
    { id: "help", icon: HelpCircle, label: "Help & Support", section: "system" },
    { id: "settings", icon: Settings, label: "Settings", section: "user" },
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
        return <TestOrdersTab />;
      case "instruments":
        return <InstrumentsTab />;
      case "warehouse":
        return <WarehouseTab />;
      case "logs":
        return <MonitoringLogsTab />;
      case "reports":
        return <ReportsTab />;
      case "config":
        return <SystemConfigTab />;
      case "notifications":
        return <NotificationsTab />;
      case "backup":
        return <BackupMaintenanceTab />;
      case "help":
        return <HelpSupportTab />;
      case "settings":
        return <SettingsTab onLogout={onLogout} />;
      default:
        return <DashboardOverview kpiData={kpiData} dailyTestOrders={dailyTestOrders} instrumentUsage={instrumentUsage} testStatusData={testStatusData} recentActivities={recentActivities} />;
    }
  };

  return (
    <div className="h-screen flex bg-[#F9FBFF]">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-white border-r border-[#E0E6ED] flex flex-col overflow-hidden`}>
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

        <Separator className="bg-[#E0E6ED]" />

        <ScrollArea className="flex-1 px-3">
          <div className="py-4">
            <p className="px-3 mb-2 text-xs text-[#6B7280] tracking-wider">ADMINISTRATION</p>
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id as TabView)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    currentTab === item.id
                      ? "bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white shadow-md"
                      : "text-[#6B7280] hover:bg-[#EAF3FF] hover:text-[#007BFF]"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </ScrollArea>

        {/* Admin Card */}
        <div className="p-4 border-t border-[#E0E6ED]">
          <div className="bg-[#F9FBFF] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10 bg-gradient-to-br from-[#007BFF] to-[#0056D2]">
                <AvatarFallback className="text-white">AU</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm text-[#333333]">{adminName}</p>
                <Badge className="bg-[#7C3AED] text-white text-xs">Admin</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full rounded-lg border-[#E0E6ED] text-[#333333] hover:bg-[#EAF3FF]" size="sm">
                Change Password
              </Button>
              <Button 
                onClick={onLogout}
                variant="outline" 
                className="w-full rounded-lg border-[#DC3545] text-[#DC3545] hover:bg-red-50" 
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-[#E0E6ED] px-6 py-4">
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
                  placeholder="Search data, users or tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 rounded-xl border-[#E0E6ED] focus:border-[#007BFF]"
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

              {/* User Avatar Dropdown */}
              <DropdownMenu open={showUserMenu} onOpenChange={setShowUserMenu}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="rounded-xl gap-2">
                    <Avatar className="h-8 w-8 bg-gradient-to-br from-[#007BFF] to-[#0056D2]">
                      <AvatarFallback className="text-white text-xs">AU</AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-[#6B7280]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentTab("settings")}>
                    <UserCircle className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentTab("settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="text-[#DC3545]">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <ScrollArea className="flex-1 p-6">
          {renderContent()}
        </ScrollArea>
      </div>
    </div>
  );
}

// TAB 1: Dashboard Overview
function DashboardOverview({ kpiData, dailyTestOrders, instrumentUsage, testStatusData, recentActivities }: any) {
  return (
    <div className="space-y-6">
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
              <p className="text-2xl text-[#333333] mb-1">{kpi.value}</p>
              <p className="text-sm text-[#6B7280]">{kpi.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333]">Daily Test Orders (30 days)</CardTitle>
            <CardDescription>Overview of test orders over the last month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
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

        {/* Bar Chart */}
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333]">Instrument Usage by Department</CardTitle>
            <CardDescription>Percentage of instruments actively in use</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
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

      {/* Pie Chart and Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#333333]">Test Status Distribution</CardTitle>
            <CardDescription>Current status of all test orders</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Right-side Widgets */}
        <div className="space-y-4">
          <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#333333]">🧠 AI Auto Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">Status</span>
                <Switch defaultChecked />
              </div>
              <p className="text-xs text-[#6B7280] mt-2">Automatically review test results using AI</p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-[#333333]">🩺 System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#6B7280]">CPU Usage</span>
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

      {/* Recent Activities Table */}
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

// TAB 2: User Management - Now using the UserManagement component

// TAB 3: Role Management
function RoleManagementTab() {
  const roles = [
    { id: 1, name: "Admin", description: "Full system access", users: 3, updated: "2025-10-10" },
    { id: 2, name: "Manager", description: "Manage operations", users: 8, updated: "2025-10-12" },
    { id: 3, name: "Lab User", description: "Perform lab tests", users: 25, updated: "2025-10-14" },
    { id: 4, name: "Service User", description: "Instrument maintenance", users: 12, updated: "2025-10-15" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#333333]">Role Management</h2>
          <p className="text-sm text-[#6B7280] mt-1">Define roles and assign permissions</p>
        </div>
        <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Role
        </Button>
      </div>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0E6ED]">
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Role Name</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Description</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Assigned Users</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Last Updated</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b border-[#E0E6ED] hover:bg-[#F9FBFF]">
                    <td className="py-3 px-4 text-sm text-[#333333]">{role.name}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{role.description}</td>
                    <td className="py-3 px-4 text-sm text-[#333333]">{role.users} users</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{role.updated}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg text-[#DC3545]">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

// TAB 4: Patients
function PatientsTab() {
  const patients = [
    { id: "P001", name: "Michael Chen", gender: "Male", dob: "1985-05-12", phone: "+1-555-0101", lastTest: "2025-10-10" },
    { id: "P002", name: "Sarah Johnson", gender: "Female", dob: "1990-08-23", phone: "+1-555-0102", lastTest: "2025-10-14" },
    { id: "P003", name: "David Wilson", gender: "Male", dob: "1978-03-15", phone: "+1-555-0103", lastTest: "2025-10-15" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#333333]">Patient Management</h2>
          <p className="text-sm text-[#6B7280] mt-1">Manage patient records and histories</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl hover:shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </div>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Input placeholder="Search patients..." className="max-w-xs rounded-xl border-[#E0E6ED]" />
            <Select>
              <SelectTrigger className="w-40 rounded-xl border-[#E0E6ED]">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0E6ED]">
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Patient ID</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Name</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Gender</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Date of Birth</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Phone</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Last Test</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b border-[#E0E6ED] hover:bg-[#F9FBFF]">
                    <td className="py-3 px-4 text-sm text-[#333333]">{patient.id}</td>
                    <td className="py-3 px-4 text-sm text-[#333333]">{patient.name}</td>
                    <td className="py-3 px-4 text-sm text-[#333333]">{patient.gender}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{patient.dob}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{patient.phone}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{patient.lastTest}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg text-[#DC3545]">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

// TAB 5: Test Orders
function TestOrdersTab() {
  const testOrders = [
    { id: "TO-001", patient: "Michael Chen", testType: "Complete Blood Count", status: "Completed", technician: "Dr. Smith", date: "2025-10-15" },
    { id: "TO-002", patient: "Sarah Johnson", testType: "Lipid Panel", status: "In Progress", technician: "Dr. Lee", date: "2025-10-16" },
    { id: "TO-003", patient: "David Wilson", testType: "Glucose Test", status: "Pending", technician: "Dr. Brown", date: "2025-10-16" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-[#28A745] text-white";
      case "In Progress": return "bg-[#007BFF] text-white";
      case "Pending": return "bg-[#FFC107] text-white";
      case "Reviewed": return "bg-[#6C757D] text-white";
      default: return "bg-[#6C757D] text-white";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#333333]">Test Orders</h2>
          <p className="text-sm text-[#6B7280] mt-1">Manage all laboratory test orders</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl hover:shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Create Test Order
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-white border border-[#E0E6ED] rounded-xl p-1">
          <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg">Pending</TabsTrigger>
          <TabsTrigger value="progress" className="rounded-lg">In Progress</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-lg">Completed</TabsTrigger>
          <TabsTrigger value="reviewed" className="rounded-lg">Reviewed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Input placeholder="Search test orders..." className="max-w-xs rounded-xl border-[#E0E6ED]" />
                <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter by Date
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E0E6ED]">
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Patient</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Test Type</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Status</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Assigned Technician</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Created Date</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testOrders.map((order) => (
                      <tr key={order.id} className="border-b border-[#E0E6ED] hover:bg-[#F9FBFF]">
                        <td className="py-3 px-4 text-sm text-[#333333]">{order.id}</td>
                        <td className="py-3 px-4 text-sm text-[#333333]">{order.patient}</td>
                        <td className="py-3 px-4 text-sm text-[#333333]">{order.testType}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#6B7280]">{order.technician}</td>
                        <td className="py-3 px-4 text-sm text-[#6B7280]">{order.date}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="rounded-lg">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-lg">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// TAB 6: Instruments
function InstrumentsTab() {
  const instruments = [
    { id: "INS-001", name: "Hematology Analyzer", status: "Active", lastMaint: "2025-10-01", nextSchedule: "2025-11-01" },
    { id: "INS-002", name: "Chemistry Analyzer", status: "Active", lastMaint: "2025-09-28", nextSchedule: "2025-10-28" },
    { id: "INS-003", name: "Immunoassay System", status: "Maintenance", lastMaint: "2025-10-15", nextSchedule: "2025-11-15" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#333333]">Instruments</h2>
          <p className="text-sm text-[#6B7280] mt-1">Manage laboratory instruments and maintenance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
            Log Maintenance
          </Button>
          <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl hover:shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Instrument
          </Button>
        </div>
      </div>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0E6ED]">
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Instrument ID</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Name</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Last Maintenance</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Next Schedule</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {instruments.map((instrument) => (
                  <tr key={instrument.id} className="border-b border-[#E0E6ED] hover:bg-[#F9FBFF]">
                    <td className="py-3 px-4 text-sm text-[#333333]">{instrument.id}</td>
                    <td className="py-3 px-4 text-sm text-[#333333]">{instrument.name}</td>
                    <td className="py-3 px-4">
                      <Badge className={instrument.status === "Active" ? "bg-[#28A745] text-white" : "bg-[#FFC107] text-white"}>
                        {instrument.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{instrument.lastMaint}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{instrument.nextSchedule}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
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

// TAB 7: Warehouse
function WarehouseTab() {
  const reagents = [
    { id: 1, name: "Hematology Reagent A", quantity: 45, expiry: "2026-03-15", instrument: "INS-001", status: "Normal" },
    { id: 2, name: "Chemistry Buffer B", quantity: 8, expiry: "2025-12-20", instrument: "INS-002", status: "Low Stock" },
    { id: 3, name: "Immunoassay Kit C", quantity: 120, expiry: "2026-06-30", instrument: "INS-003", status: "Normal" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#333333]">Warehouse</h2>
          <p className="text-sm text-[#6B7280] mt-1">Manage reagents and inventory</p>
        </div>
        <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl hover:shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Add Reagent
        </Button>
      </div>

      <Tabs defaultValue="reagents" className="space-y-4">
        <TabsList className="bg-white border border-[#E0E6ED] rounded-xl p-1">
          <TabsTrigger value="reagents" className="rounded-lg">Reagents</TabsTrigger>
          <TabsTrigger value="config" className="rounded-lg">Configuration</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg">History</TabsTrigger>
        </TabsList>

        <TabsContent value="reagents">
          <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E0E6ED]">
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Name</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Quantity</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Expiry Date</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Linked Instrument</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Status</th>
                      <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reagents.map((reagent) => (
                      <tr key={reagent.id} className={`border-b border-[#E0E6ED] hover:bg-[#F9FBFF] ${reagent.status === "Low Stock" ? "bg-yellow-50" : ""}`}>
                        <td className="py-3 px-4 text-sm text-[#333333]">{reagent.name}</td>
                        <td className="py-3 px-4 text-sm text-[#333333]">{reagent.quantity}</td>
                        <td className="py-3 px-4 text-sm text-[#6B7280]">{reagent.expiry}</td>
                        <td className="py-3 px-4 text-sm text-[#6B7280]">{reagent.instrument}</td>
                        <td className="py-3 px-4">
                          <Badge className={reagent.status === "Normal" ? "bg-[#28A745] text-white" : "bg-[#FFC107] text-white"}>
                            {reagent.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="rounded-lg">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="rounded-lg text-[#DC3545]">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// TAB 8: Monitoring Logs
function MonitoringLogsTab() {
  const logs = [
    { id: "E_00015", module: "TestOrder", user: "labuser01", action: "Create", timestamp: "2025-10-16 11:30", result: "Success" },
    { id: "E_00014", module: "Patient", user: "admin01", action: "Update", timestamp: "2025-10-16 11:15", result: "Success" },
    { id: "E_00013", module: "Instrument", user: "techuser02", action: "Maintenance", timestamp: "2025-10-16 10:45", result: "Warning" },
    { id: "E_00012", module: "Warehouse", user: "manager01", action: "Restock", timestamp: "2025-10-16 10:20", result: "Success" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#333333]">Monitoring Logs</h2>
          <p className="text-sm text-[#6B7280] mt-1">System activity and audit logs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-[#6B7280] mb-1">Total Logs</p>
            <p className="text-2xl text-[#333333]">1,247</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-[#6B7280] mb-1">Errors</p>
            <p className="text-2xl text-[#DC3545]">12</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-[#6B7280] mb-1">Warnings</p>
            <p className="text-2xl text-[#FFC107]">38</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-[#6B7280] mb-1">Info</p>
            <p className="text-2xl text-[#007BFF]">1,197</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Input placeholder="Search logs..." className="max-w-xs rounded-xl border-[#E0E6ED]" />
            <Select>
              <SelectTrigger className="w-40 rounded-xl border-[#E0E6ED]">
                <SelectValue placeholder="Module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="test">Test Order</SelectItem>
                <SelectItem value="patient">Patient</SelectItem>
                <SelectItem value="instrument">Instrument</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40 rounded-xl border-[#E0E6ED]">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0E6ED]">
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Event ID</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Module</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">User</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Action</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Result</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-[#E0E6ED] hover:bg-[#F9FBFF]">
                    <td className="py-3 px-4 text-sm text-[#333333]">{log.id}</td>
                    <td className="py-3 px-4 text-sm text-[#333333]">{log.module}</td>
                    <td className="py-3 px-4 text-sm text-[#333333]">{log.user}</td>
                    <td className="py-3 px-4 text-sm text-[#333333]">{log.action}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{log.timestamp}</td>
                    <td className="py-3 px-4">
                      <Badge className={log.result === "Success" ? "bg-[#28A745] text-white" : "bg-[#FFC107] text-white"}>
                        {log.result}
                      </Badge>
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

// TAB 9: Reports
function ReportsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#333333]">Reports</h2>
        <p className="text-sm text-[#6B7280] mt-1">Generate and export system reports</p>
      </div>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#333333]">Report Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Date Range</Label>
              <Select>
                <SelectTrigger className="rounded-xl border-[#E0E6ED] mt-1">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Department</Label>
              <Select>
                <SelectTrigger className="rounded-xl border-[#E0E6ED] mt-1">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="hema">Hematology</SelectItem>
                  <SelectItem value="chem">Chemistry</SelectItem>
                  <SelectItem value="micro">Microbiology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select>
                <SelectTrigger className="rounded-xl border-[#E0E6ED] mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#007BFF]15 flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#007BFF]" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-[#333333]">Patient Summary Report</CardTitle>
                <CardDescription className="mt-1">Overview of all patient records and statistics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#28A745]15 flex items-center justify-center">
                <FlaskConical className="h-6 w-6 text-[#28A745]" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-[#333333]">Test Order Summary</CardTitle>
                <CardDescription className="mt-1">Detailed analysis of all test orders</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#17A2B8]15 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-[#17A2B8]" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-[#333333]">Instrument Maintenance Report</CardTitle>
                <CardDescription className="mt-1">Maintenance history and schedules</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#FFC107]15 flex items-center justify-center">
                <Package className="h-6 w-6 text-[#FFC107]" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-[#333333]">Reagent Consumption Report</CardTitle>
                <CardDescription className="mt-1">Track reagent usage and inventory</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// TAB 10: System Configuration
function SystemConfigTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#333333]">System Configuration</h2>
        <p className="text-sm text-[#6B7280] mt-1">Configure system settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333] flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#007BFF]" />
              Security Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Password Minimum Length</Label>
              <Input type="number" defaultValue="8" className="rounded-xl border-[#E0E6ED] mt-1" />
            </div>
            <div>
              <Label>Maximum Login Attempts</Label>
              <Input type="number" defaultValue="3" className="rounded-xl border-[#E0E6ED] mt-1" />
            </div>
            <div>
              <Label>Session Timeout (minutes)</Label>
              <Input type="number" defaultValue="30" className="rounded-xl border-[#E0E6ED] mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="2fa" />
              <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333] flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#007BFF]" />
              AI Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Auto Review Confidence Threshold (%)</Label>
              <Input type="number" defaultValue="85" className="rounded-xl border-[#E0E6ED] mt-1" />
            </div>
            <div>
              <Label>AI Model Version</Label>
              <Select>
                <SelectTrigger className="rounded-xl border-[#E0E6ED] mt-1">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1">Version 1.0</SelectItem>
                  <SelectItem value="v2">Version 2.0 (Latest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="autoReview" defaultChecked />
              <Label htmlFor="autoReview">Enable Auto Review</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="aiAlerts" defaultChecked />
              <Label htmlFor="aiAlerts">Enable AI Alerts</Label>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333] flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#007BFF]" />
              Email Server Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>SMTP Server</Label>
              <Input defaultValue="smtp.lab.com" className="rounded-xl border-[#E0E6ED] mt-1" />
            </div>
            <div>
              <Label>Port</Label>
              <Input type="number" defaultValue="587" className="rounded-xl border-[#E0E6ED] mt-1" />
            </div>
            <div>
              <Label>Username</Label>
              <Input defaultValue="admin@lab.com" className="rounded-xl border-[#E0E6ED] mt-1" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" defaultValue="********" className="rounded-xl border-[#E0E6ED] mt-1" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333] flex items-center gap-2">
              <Database className="h-5 w-5 text-[#007BFF]" />
              Backup Schedule Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Backup Frequency</Label>
              <Select>
                <SelectTrigger className="rounded-xl border-[#E0E6ED] mt-1">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Backup Time</Label>
              <Input type="time" defaultValue="02:00" className="rounded-xl border-[#E0E6ED] mt-1" />
            </div>
            <div>
              <Label>Retention Period (days)</Label>
              <Input type="number" defaultValue="30" className="rounded-xl border-[#E0E6ED] mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="autoBackup" defaultChecked />
              <Label htmlFor="autoBackup">Enable Automatic Backup</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Default
        </Button>
        <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl">
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>
    </div>
  );
}

// TAB 11: Notifications
function NotificationsTab() {
  const systemNotifications = [
    {
      id: 1,
      type: "warning",
      title: "Low Reagent Stock Alert",
      message: "Reagent ABC-123 has fallen below the minimum threshold. Current stock: 8 units.",
      time: "5 minutes ago",
      read: false
    },
    {
      id: 2,
      type: "info",
      title: "Scheduled Maintenance",
      message: "Instrument INS-002 (Chemistry Analyzer) is scheduled for maintenance tomorrow at 9:00 AM.",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      type: "success",
      title: "New Test Order Created",
      message: "Test order TO-003 has been successfully created for patient Michael Chen.",
      time: "2 hours ago",
      read: true
    },
    {
      id: 4,
      type: "warning",
      title: "Backup Completed with Warnings",
      message: "System backup completed successfully but some log files were skipped due to size limitations.",
      time: "3 hours ago",
      read: true
    },
    {
      id: 5,
      type: "error",
      title: "Failed Login Attempt",
      message: "Multiple failed login attempts detected from IP 192.168.1.105. Account has been temporarily locked.",
      time: "5 hours ago",
      read: true
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle2 className="h-5 w-5 text-[#28A745]" />;
      case "warning": return <AlertTriangle className="h-5 w-5 text-[#FFC107]" />;
      case "error": return <X className="h-5 w-5 text-[#DC3545]" />;
      default: return <Bell className="h-5 w-5 text-[#007BFF]" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#333333]">Notifications</h2>
          <p className="text-sm text-[#6B7280] mt-1">System alerts and notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-40 rounded-xl border-[#E0E6ED]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
            Mark all as Read
          </Button>
          <Button variant="outline" className="rounded-xl border-[#DC3545] text-[#DC3545]">
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {systemNotifications.map((notif) => (
          <Card key={notif.id} className={`rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer ${!notif.read ? 'bg-[#EAF3FF]' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-[#333333]">{notif.title}</h4>
                    {!notif.read && <div className="w-2 h-2 bg-[#007BFF] rounded-full mt-1.5" />}
                  </div>
                  <p className="text-sm text-[#6B7280] mb-2">{notif.message}</p>
                  <div className="flex items-center gap-4">
                    <p className="text-xs text-[#6B7280] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {notif.time}
                    </p>
                    {!notif.read && (
                      <Button variant="ghost" size="sm" className="text-xs text-[#007BFF] h-auto p-0">
                        Mark as read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// TAB 12: Backup & Maintenance
function BackupMaintenanceTab() {
  const backups = [
    { id: 1, date: "2025-10-16 02:00", status: "Success", size: "2.4 GB" },
    { id: 2, date: "2025-10-15 02:00", status: "Success", size: "2.3 GB" },
    { id: 3, date: "2025-10-14 02:00", status: "Warning", size: "2.5 GB" },
    { id: 4, date: "2025-10-13 02:00", status: "Success", size: "2.2 GB" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-[#333333]">Backup & Maintenance</h2>
          <p className="text-sm text-[#6B7280] mt-1">Manage system backups and maintenance tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Backup
          </Button>
          <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl">
            <Database className="h-4 w-4 mr-2" />
            Manual Backup
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-[#6B7280] mb-1">Total Backups</p>
            <p className="text-2xl text-[#333333]">24</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-[#6B7280] mb-1">Total Size</p>
            <p className="text-2xl text-[#333333]">58.7 GB</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardContent className="p-4">
            <p className="text-sm text-[#6B7280] mb-1">Last Backup</p>
            <p className="text-2xl text-[#333333]">2 hours ago</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#333333]">Backup History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E0E6ED]">
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Date & Time</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Status</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">File Size</th>
                  <th className="text-left py-3 px-4 text-sm text-[#6B7280]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((backup) => (
                  <tr key={backup.id} className="border-b border-[#E0E6ED] hover:bg-[#F9FBFF]">
                    <td className="py-3 px-4 text-sm text-[#333333]">{backup.date}</td>
                    <td className="py-3 px-4">
                      <Badge className={backup.status === "Success" ? "bg-[#28A745] text-white" : "bg-[#FFC107] text-white"}>
                        {backup.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#6B7280]">{backup.size}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="rounded-lg text-[#007BFF]">
                          <Download className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg text-[#DC3545]">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#333333]">Maintenance Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-[#F9FBFF] rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-[#28A745] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Database optimization completed</p>
                <p className="text-xs text-[#6B7280] mt-1">2025-10-16 03:00 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#F9FBFF] rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-[#28A745] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Temporary files cleaned (2.3 GB freed)</p>
                <p className="text-xs text-[#6B7280] mt-1">2025-10-15 03:00 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-[#F9FBFF] rounded-xl">
              <CheckCircle2 className="h-5 w-5 text-[#28A745] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#333333]">Log rotation completed</p>
                <p className="text-xs text-[#6B7280] mt-1">2025-10-14 03:00 AM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// TAB 13: Help & Support
function HelpSupportTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#333333]">Help & Support</h2>
        <p className="text-sm text-[#6B7280] mt-1">Get help and contact support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#007BFF]15 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="h-8 w-8 text-[#007BFF]" />
            </div>
            <h3 className="text-[#333333] mb-2">Help Center</h3>
            <p className="text-sm text-[#6B7280] mb-4">Browse documentation and guides</p>
            <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl w-full">
              Visit Help Center
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#28A745]15 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-[#28A745]" />
            </div>
            <h3 className="text-[#333333] mb-2">Documentation</h3>
            <p className="text-sm text-[#6B7280] mb-4">Access system documentation</p>
            <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl w-full">
              View Docs
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm hover:shadow-md transition-all cursor-pointer">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#FFC107]15 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-[#FFC107]" />
            </div>
            <h3 className="text-[#333333] mb-2">Contact Support</h3>
            <p className="text-sm text-[#6B7280] mb-4">Send us a message</p>
            <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl w-full">
              Contact Us
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#333333]">Contact Support</CardTitle>
          <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Your Name</Label>
              <Input placeholder="Enter your name" className="rounded-xl border-[#E0E6ED] mt-1" />
            </div>
            <div>
              <Label>Email Address</Label>
              <Input type="email" placeholder="Enter your email" className="rounded-xl border-[#E0E6ED] mt-1" />
            </div>
          </div>
          <div>
            <Label>Subject</Label>
            <Input placeholder="What's this about?" className="rounded-xl border-[#E0E6ED] mt-1" />
          </div>
          <div>
            <Label>Message</Label>
            <Textarea placeholder="Describe your issue or question..." className="rounded-xl border-[#E0E6ED] mt-1 min-h-32" />
          </div>
          <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl">
            <Mail className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#333333]">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#007BFF]15 flex items-center justify-center">
              <Phone className="h-5 w-5 text-[#007BFF]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Phone</p>
              <p className="text-[#333333]">+1 (555) 123-4567</p>
            </div>
          </div>
          <Separator className="bg-[#E0E6ED]" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#28A745]15 flex items-center justify-center">
              <Mail className="h-5 w-5 text-[#28A745]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Email</p>
              <p className="text-[#333333]">support@labsystem.com</p>
            </div>
          </div>
          <Separator className="bg-[#E0E6ED]" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFC107]15 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-[#FFC107]" />
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Address</p>
              <p className="text-[#333333]">123 Medical Plaza, San Francisco, CA 94102</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// TAB 14: Settings
function SettingsTab({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#333333]">Settings</h2>
        <p className="text-sm text-[#6B7280] mt-1">Manage your preferences and account settings</p>
      </div>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#333333]">User Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Language</Label>
            <Select>
              <SelectTrigger className="rounded-xl border-[#E0E6ED] mt-1">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="vi">Vietnamese</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Theme</Label>
            <Select>
              <SelectTrigger className="rounded-xl border-[#E0E6ED] mt-1">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Timezone</Label>
            <Select>
              <SelectTrigger className="rounded-xl border-[#E0E6ED] mt-1">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                <SelectItem value="est">Eastern Time (EST)</SelectItem>
                <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#333333]">Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-xs text-[#6B7280] mt-1">Receive email alerts for important events</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator className="bg-[#E0E6ED]" />
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-xs text-[#6B7280] mt-1">Receive push notifications in the app</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator className="bg-[#E0E6ED]" />
          <div className="flex items-center justify-between">
            <div>
              <Label>Low Stock Alerts</Label>
              <p className="text-xs text-[#6B7280] mt-1">Get notified when reagents are low</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
          Cancel
        </Button>
        <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white rounded-xl">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      <Card className="rounded-xl border-[#DC3545] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#DC3545]">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[#6B7280]">Once you logout, you will need to sign in again to access the system.</p>
          <Button 
            onClick={onLogout}
            variant="outline" 
            className="rounded-xl border-[#DC3545] text-[#DC3545] hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
