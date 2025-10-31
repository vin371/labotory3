import { useState } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  TestTube,
  Package,
  FileText,
  Bell,
  FlaskConical,
  Search,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Activity,
  LogOut,
  Settings,
  HelpCircle,
  Users,
  Cpu,
  HardDrive,
} from "lucide-react";
import { TestOrderManagement } from "./TestOrderManagement";
import { InstrumentServiceLabUser } from "./InstrumentServiceLabUser";
import { WarehouseManagementLabUser } from "./WarehouseManagementLabUser";
import { EventLogsManagement } from "./EventLogsManagement";
import { ReportsPage } from "./ReportsPage";
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

interface LabUserDashboardProps {
  onLogout: () => void;
  labUserName?: string;
}

type TabView =
  | "dashboard"
  | "testOrders"
  | "instruments"
  | "warehouse"
  | "logs"
  | "reports";

export function LabUserDashboard({ onLogout, labUserName = "Lab User" }: LabUserDashboardProps) {
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
    { department: "Hematology", usage: 450 },
    { department: "Chemistry", usage: 680 },
    { department: "Microbiology", usage: 320 },
    { department: "Immunology", usage: 240 },
    { department: "Molecular", usage: 180 },
  ];

  const testStatusData = [
    { name: "In Progress", value: 156, color: "#FFC107" },
    { name: "Completed", value: 892, color: "#28A745" },
    { name: "Pending", value: 234, color: "#007BFF" },
  ];

  const kpiData = [
    { label: "Total Tests", value: "1,282", change: "+12.5%", trend: "up", icon: FlaskConical, color: "#007BFF" },
    { label: "Pending Orders", value: "234", change: "+8.2%", trend: "up", icon: Clock, color: "#FFC107" },
    { label: "Instruments Active", value: "18/20", change: "90%", trend: "up", icon: TestTube, color: "#28A745" },
    { label: "Completed Reports", value: "892", change: "+15.3%", trend: "up", icon: FileText, color: "#6C757D" },
  ];

  const recentActivities = [
    { id: "LOG-001", module: "Test Orders", action: "Create Order", user: "labuser@lab.com", timestamp: "2025-10-20 14:25", result: "Success" },
    { id: "LOG-002", module: "Test Orders", action: "Complete Test", user: "labuser@lab.com", timestamp: "2025-10-20 14:20", result: "Success" },
    { id: "LOG-003", module: "Instrument Service", action: "Mode Change", user: "labuser@lab.com", timestamp: "2025-10-20 14:15", result: "Success" },
    { id: "LOG-004", module: "Warehouse", action: "Update Reagent", user: "labuser@lab.com", timestamp: "2025-10-20 14:10", result: "Success" },
    { id: "LOG-005", module: "Reports", action: "Generate Report", user: "labuser@lab.com", timestamp: "2025-10-20 14:05", result: "Success" },
  ];

  const notifications = [
    { id: 1, message: "New test order created - TO-1234", time: "5 minutes ago", type: "info" },
    { id: 2, message: "Instrument calibration required", time: "1 hour ago", type: "warning" },
    { id: 3, message: "Monthly report generated", time: "2 hours ago", type: "success" },
    { id: 4, message: "Reagent stock low - Chemistry", time: "3 hours ago", type: "warning" },
  ];

  const navigationItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", section: "main" },
    { id: "testOrders", icon: ClipboardList, label: "Test Orders", section: "main" },
    { id: "instruments", icon: TestTube, label: "Instruments", section: "main" },
    { id: "warehouse", icon: Package, label: "Warehouse", section: "main" },
    { id: "logs", icon: Activity, label: "Event Logs", section: "main" },
    { id: "reports", icon: FileText, label: "Reports", section: "system" },
  ];

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <DashboardOverview kpiData={kpiData} dailyTestOrders={dailyTestOrders} instrumentUsage={instrumentUsage} testStatusData={testStatusData} recentActivities={recentActivities} />;
      case "testOrders":
        return <TestOrderManagement onNavigateToDashboard={() => setCurrentTab("dashboard")} />;
      case "instruments":
        return <InstrumentServiceLabUser />;
      case "warehouse":
        return <WarehouseManagementLabUser onNavigateToDashboard={() => setCurrentTab("dashboard")} />;
      case "logs":
        return <EventLogsManagement onNavigateToDashboard={() => setCurrentTab("dashboard")} />;
      case "reports":
        return <ReportsPage onNavigateToDashboard={() => setCurrentTab("dashboard")} />;
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
                  {navigationItems.find(item => item.id === currentTab)?.label || "Lab User Dashboard"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
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
                        {labUserName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-sm text-[#333333]">{labUserName}</p>
                      <p className="text-xs text-[#6B7280]">Lab Technician</p>
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
                  <DropdownMenuItem>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E0E6ED",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#007BFF"
                  strokeWidth={2}
                  dot={{ fill: "#007BFF", r: 4 }}
                  name="Test Orders"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Instrument Usage Chart */}
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333]">Instrument Usage by Department</CardTitle>
            <CardDescription>Total tests processed this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={instrumentUsage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E6ED" />
                <XAxis dataKey="department" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E0E6ED",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="usage" fill="#007BFF" radius={[8, 8, 0, 0]} name="Tests Processed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Status Distribution */}
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333]">Test Status Distribution</CardTitle>
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
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                    border: "1px solid #E0E6ED",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {testStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-[#6B7280]">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333]">System Health</CardTitle>
            <CardDescription>Real-time performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* CPU Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-[#007BFF]" />
                  <span className="text-sm text-[#6B7280]">CPU Usage</span>
                </div>
                <span className="text-sm text-[#333333]">68%</span>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-[#6B7280] mt-1">Normal operating range</p>
            </div>

            {/* Memory Usage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-[#007BFF]" />
                  <span className="text-sm text-[#6B7280]">Memory Usage</span>
                </div>
                <span className="text-sm text-[#333333]">5.8 GB / 8 GB</span>
              </div>
              <Progress value={72.5} className="h-2" />
              <p className="text-xs text-[#6B7280] mt-1">72.5% utilized</p>
            </div>

            {/* Database Load */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#007BFF]" />
                  <span className="text-sm text-[#6B7280]">Database Load</span>
                </div>
                <span className="text-sm text-[#28A745]">Low</span>
              </div>
              <Progress value={35} className="h-2" />
              <p className="text-xs text-[#6B7280] mt-1">Optimal performance</p>
            </div>

            {/* Active Connections */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#007BFF]" />
                  <span className="text-sm text-[#6B7280]">Active Connections</span>
                </div>
                <span className="text-sm text-[#333333]">24/50</span>
              </div>
              <Progress value={48} className="h-2" />
              <p className="text-xs text-[#6B7280] mt-1">48% capacity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader>
          <CardTitle className="text-[#333333]">Recent Activities</CardTitle>
          <CardDescription>Latest system events and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity: any) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-[#F9FBFF] rounded-lg hover:bg-[#EAF3FF] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#007BFF] to-[#0056D2] flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#333333]">{activity.module} - {activity.action}</p>
                    <p className="text-xs text-[#6B7280]">{activity.user} • {activity.timestamp}</p>
                  </div>
                </div>
                <Badge className={`${
                  activity.result === 'Success' ? 'bg-[#28A745]' : 'bg-[#DC3545]'
                } text-white`}>
                  {activity.result}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


