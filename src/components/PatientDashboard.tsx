import { useState } from "react";
import { 
  Home, 
  FlaskConical, 
  FileText, 
  History, 
  User, 
  LogOut, 
  Search, 
  Bell, 
  Calendar,
  Download,
  Eye,
  TrendingUp,
  Clock,
  ArrowUp,
  ArrowDown,
  X,
  Filter,
  ChevronDown,
  UserCircle,
  Heart,
  Stethoscope,
  Mail,
  Phone,
  Upload,
  Check,
  BarChart3,
  Info,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { UpcomingTestDetail } from "./UpcomingTestDetail";
import { AddToCalendarModal } from "./AddToCalendarModal";

interface PatientDashboardProps {
  onLogout: () => void;
  patientName?: string;
}

type MenuItem = "dashboard" | "test-results" | "medical-records" | "test-history" | "profile" | "notifications";

interface TestResult {
  id: string;
  testName: string;
  date: string;
  status: "Completed" | "Pending" | "Cancelled";
  result: "Normal" | "Abnormal" | "Pending";
  technician?: string;
  parameters?: TestParameter[];
  doctorComment?: string;
  trend?: "up" | "down" | "stable";
}

interface TestParameter {
  name: string;
  result: string;
  unit: string;
  normalRange: string;
  flag?: "high" | "low" | "normal";
}

interface Notification {
  id: string;
  type: "success" | "info" | "warning";
  message: string;
  time: string;
  read: boolean;
}

export function PatientDashboard({ onLogout, patientName = "John Doe" }: PatientDashboardProps) {
  const [currentView, setCurrentView] = useState<MenuItem>("dashboard");
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [showUpcomingTestDetail, setShowUpcomingTestDetail] = useState(false);
  const [showAddToCalendar, setShowAddToCalendar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [testTypeFilter, setTestTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("2025");
  const [monthFilter, setMonthFilter] = useState("all");
  const [notificationFilter, setNotificationFilter] = useState<"all" | "unread" | "read">("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: "1", type: "success", message: "✅ Your CBC test result is now available.", time: "2 hours ago", read: false },
    { id: "2", type: "info", message: "📅 Appointment scheduled for tomorrow at 10:30 AM.", time: "5 hours ago", read: false },
    { id: "3", type: "warning", message: "⚠️ Please review your lipid panel results with your doctor.", time: "1 day ago", read: true },
    { id: "4", type: "success", message: "✅ Your prescription has been sent to the pharmacy.", time: "2 days ago", read: true },
  ]);

  const [profileData, setProfileData] = useState({
    fullName: patientName,
    email: "patient@lab.com",
    phone: "+1 (555) 123-4567",
    language: "English",
    age: "35",
    gender: "Male",
    dateOfBirth: "1990-05-15",
    bloodType: "O+",
    allergies: "Penicillin, Latex",
    chronicConditions: "None",
    medicalHistory: "Appendectomy (2015)"
  });

  // Mock data
  const recentTests: TestResult[] = [
    {
      id: "TST-001",
      testName: "Complete Blood Count (CBC)",
      date: "2025-01-10",
      status: "Completed",
      result: "Normal",
      technician: "Dr. Sarah Smith",
      trend: "stable",
      parameters: [
        { name: "White Blood Cells", result: "7.5", unit: "10^3/μL", normalRange: "4.5-11.0", flag: "normal" },
        { name: "Red Blood Cells", result: "5.2", unit: "10^6/μL", normalRange: "4.5-5.5", flag: "normal" },
        { name: "Hemoglobin", result: "14.5", unit: "g/dL", normalRange: "13.5-17.5", flag: "normal" },
        { name: "Platelets", result: "250", unit: "10^3/μL", normalRange: "150-400", flag: "normal" },
      ],
      doctorComment: "All parameters within normal range. Continue regular health maintenance."
    },
    {
      id: "TST-002",
      testName: "Lipid Panel",
      date: "2025-01-08",
      status: "Completed",
      result: "Abnormal",
      technician: "Dr. Michael Johnson",
      trend: "up",
      parameters: [
        { name: "Total Cholesterol", result: "245", unit: "mg/dL", normalRange: "< 200", flag: "high" },
        { name: "LDL Cholesterol", result: "160", unit: "mg/dL", normalRange: "< 100", flag: "high" },
        { name: "HDL Cholesterol", result: "45", unit: "mg/dL", normalRange: "> 40", flag: "normal" },
        { name: "Triglycerides", result: "180", unit: "mg/dL", normalRange: "< 150", flag: "high" },
      ],
      doctorComment: "Elevated cholesterol levels detected. Recommend dietary modifications and follow-up in 3 months."
    },
    {
      id: "TST-003",
      testName: "Thyroid Function Test",
      date: "2025-01-05",
      status: "Completed",
      result: "Normal",
      technician: "Dr. Emily Davis",
      trend: "stable",
    },
    {
      id: "TST-004",
      testName: "Vitamin D Level",
      date: "2025-01-12",
      status: "Pending",
      result: "Pending",
      technician: "Dr. Sarah Smith",
      trend: "stable",
    },
    {
      id: "TST-005",
      testName: "Glucose Fasting",
      date: "2024-12-20",
      status: "Completed",
      result: "Normal",
      technician: "Dr. Robert Lee",
      trend: "down",
    },
    {
      id: "TST-006",
      testName: "Liver Function Test",
      date: "2024-12-15",
      status: "Completed",
      result: "Normal",
      technician: "Dr. Emily Davis",
      trend: "stable",
    },
    {
      id: "TST-007",
      testName: "Kidney Function Test",
      date: "2024-11-28",
      status: "Completed",
      result: "Normal",
      technician: "Dr. Michael Johnson",
      trend: "stable",
    },
  ];

  const upcomingAppointment = {
    testName: "Annual Physical Exam",
    date: "2025-01-20",
    time: "10:30 AM",
    labRoom: "Room 204",
    contact: "+1 (555) 123-4567",
    status: "Scheduled"
  };

  const nextVisit = {
    date: "2025-02-15",
    time: "2:00 PM",
    doctor: "Dr. Sarah Johnson",
    phone: "+1 (555) 123-4567"
  };

  const doctorNotes = [
    {
      date: "2025-01-10",
      doctor: "Dr. Sarah Johnson",
      note: "Patient's blood work looks excellent. Continue current lifestyle and diet. Schedule follow-up in 6 months."
    },
    {
      date: "2025-01-08",
      doctor: "Dr. Michael Johnson",
      note: "Cholesterol levels are slightly elevated. Recommend reducing saturated fat intake and increasing physical activity. Follow-up test in 3 months."
    },
    {
      date: "2024-12-20",
      doctor: "Dr. Robert Lee",
      note: "Glucose levels are well-controlled. No changes needed to current diabetes management plan."
    },
  ];

  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-[#10B981] text-white";
      case "Pending": return "bg-[#F59E0B] text-white";
      case "Cancelled": return "bg-[#EF4444] text-white";
      default: return "bg-[#CBD5E1] text-[#0F172A]";
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case "Normal": return "bg-[#10B981] text-white";
      case "Abnormal": return "bg-[#EF4444] text-white";
      case "Pending": return "bg-[#F59E0B] text-white";
      default: return "bg-[#CBD5E1] text-[#0F172A]";
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up": return <ArrowUp className="h-4 w-4 text-[#EF4444]" />;
      case "down": return <ArrowDown className="h-4 w-4 text-[#10B981]" />;
      case "stable": return <div className="h-1 w-4 bg-[#64748B] rounded"></div>;
      default: return null;
    }
  };

  const menuItems = [
    { id: "dashboard" as MenuItem, icon: Home, label: "Dashboard" },
    { id: "test-results" as MenuItem, icon: FlaskConical, label: "My Test Results" },
    { id: "medical-records" as MenuItem, icon: FileText, label: "Medical Records" },
    { id: "test-history" as MenuItem, icon: History, label: "Test History" },
    { id: "profile" as MenuItem, icon: User, label: "Profile" },
    { id: "notifications" as MenuItem, icon: Bell, label: "Notifications" },
  ];

  const filteredTests = recentTests.filter(test => {
    const matchesSearch = test.testName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         test.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = testTypeFilter === "all" || test.testName.includes(testTypeFilter);
    const matchesStatus = statusFilter === "all" || test.status === statusFilter;
    const matchesYear = yearFilter === "all" || test.date.startsWith(yearFilter);
    const matchesMonth = monthFilter === "all" || test.date.includes(`-${monthFilter}-`);
    
    return matchesSearch && matchesType && matchesStatus && matchesYear && matchesMonth;
  });

  const filteredNotifications = notifications.filter(notif => {
    if (notificationFilter === "all") return true;
    if (notificationFilter === "unread") return !notif.read;
    if (notificationFilter === "read") return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const toggleNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: !n.read } : n
    ));
  };

  // Statistics for test history
  const testsByMonth = [
    { month: "Jan", count: 3 },
    { month: "Feb", count: 2 },
    { month: "Mar", count: 4 },
    { month: "Apr", count: 3 },
    { month: "May", count: 5 },
    { month: "Jun", count: 2 },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-[#CBD5E1] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#CBD5E1]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1976D2] flex items-center justify-center">
              <FlaskConical className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-[#0F172A]">Laboratory</h3>
              <p className="text-xs text-[#64748B]">Management</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    currentView === item.id
                      ? "bg-[#1976D2] text-white"
                      : "text-[#64748B] hover:bg-[#E3F2FD] hover:text-[#1976D2]"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.id === "notifications" && unreadCount > 0 && (
                    <span className="ml-auto bg-[#EF4444] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-[#CBD5E1] px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-[#0F172A]">Welcome, {patientName} 👋</h1>
              <p className="text-sm text-[#64748B]">{getTodayDate()}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification */}
              <button 
                onClick={() => setCurrentView("notifications")}
                className="relative p-2 rounded-2xl hover:bg-[#E3F2FD] transition-all"
              >
                <Bell className="h-5 w-5 text-[#64748B]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full"></span>
                )}
              </button>

              {/* Profile Avatar with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="cursor-pointer hover:ring-2 hover:ring-[#1976D2] transition-all">
                      <AvatarFallback className="bg-[#1976D2] text-white">
                        {patientName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl border-[#CBD5E1]">
                  <DropdownMenuLabel className="text-[#0F172A]">
                    <div>
                      <p>{patientName}</p>
                      <p className="text-xs text-[#64748B] font-normal">{profileData.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#CBD5E1]" />
                  <DropdownMenuItem 
                    onClick={() => setCurrentView("profile")}
                    className="cursor-pointer rounded-xl mx-1 focus:bg-[#E3F2FD] focus:text-[#1976D2]"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setCurrentView("notifications")}
                    className="cursor-pointer rounded-xl mx-1 focus:bg-[#E3F2FD] focus:text-[#1976D2]"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-[#EF4444] text-white text-xs rounded-full px-2 py-0.5">
                        {unreadCount}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#CBD5E1]" />
                  <DropdownMenuItem 
                    onClick={onLogout}
                    className="cursor-pointer rounded-xl mx-1 text-[#EF4444] focus:bg-red-50 focus:text-[#EF4444]"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <ScrollArea className="flex-1 h-full">
          <div className="p-8">
          {/* 1. Dashboard Overview */}
          {currentView === "dashboard" && (
            <div className="space-y-6">
              {/* Banner */}
              <div className="bg-gradient-to-r from-[#1976D2] to-[#1565C0] rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3">
                  <Info className="h-6 w-6" />
                  <p className="text-lg">You have 1 upcoming test appointment today.</p>
                </div>
              </div>

              {/* Three Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Upcoming Test */}
                <Card className="rounded-2xl border-[#CBD5E1] shadow-sm hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-2xl bg-[#E3F2FD] flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-[#1976D2]" />
                      </div>
                      <CardTitle className="text-[#0F172A]">Upcoming Test</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#0F172A] mb-2">{upcomingAppointment.testName}</p>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-[#64748B]">
                        <Calendar className="h-4 w-4" />
                        {upcomingAppointment.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#64748B]">
                        <Clock className="h-4 w-4" />
                        {upcomingAppointment.time}
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowUpcomingTestDetail(true)}
                      className="w-full bg-gradient-to-r from-[#1976D2] to-[#1565C0] hover:from-[#1565C0] hover:to-[#0D47A1] text-white rounded-2xl"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                {/* Last Test Result */}
                <Card className="rounded-2xl border-[#CBD5E1] shadow-sm hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-2xl bg-[#E3F2FD] flex items-center justify-center">
                        <FlaskConical className="h-5 w-5 text-[#1976D2]" />
                      </div>
                      <CardTitle className="text-[#0F172A]">Last Test Result</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#0F172A] mb-2">{recentTests[0].testName}</p>
                    <div className="flex items-center gap-2 text-sm text-[#64748B] mb-3">
                      <Calendar className="h-4 w-4" />
                      {recentTests[0].date}
                    </div>
                    <Badge className={getResultColor(recentTests[0].result)}>
                      {recentTests[0].result}
                    </Badge>
                    <div className="mt-3 flex items-center gap-2 text-sm text-[#1976D2]">
                      <TrendingUp className="h-4 w-4" />
                      <span>All parameters normal</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Appointment */}
                <Card className="rounded-2xl border-[#CBD5E1] shadow-sm hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-2xl bg-[#E3F2FD] flex items-center justify-center">
                        <Clock className="h-5 w-5 text-[#1976D2]" />
                      </div>
                      <CardTitle className="text-[#0F172A]">Next Appointment</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#0F172A] mb-2">{upcomingAppointment.labRoom}</p>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-[#64748B]">
                        <Calendar className="h-4 w-4" />
                        {upcomingAppointment.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#64748B]">
                        <Clock className="h-4 w-4" />
                        {upcomingAppointment.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#64748B]">
                        <Phone className="h-4 w-4" />
                        {upcomingAppointment.contact}
                      </div>
                    </div>
                    <Button 
                      onClick={() => setShowAddToCalendar(true)}
                      variant="outline"
                      className="w-full border-[#CBD5E1] rounded-2xl hover:bg-[#E3F2FD]"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Test Results Table */}
              <div>
                <h2 className="text-xl text-[#0F172A] mb-4">Recent Test Results</h2>
                <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#E3F2FD] border-b border-[#CBD5E1]">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm text-[#0F172A] first:rounded-tl-2xl">Test ID</th>
                            <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Test Name</th>
                            <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Date</th>
                            <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Status</th>
                            <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Result</th>
                            <th className="px-6 py-4 text-left text-sm text-[#0F172A] last:rounded-tr-2xl">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentTests.slice(0, 5).map((test) => (
                            <tr 
                              key={test.id}
                              className="border-b border-[#CBD5E1] hover:bg-[#E3F2FD] transition-colors last:border-0"
                            >
                              <td className="px-6 py-4 text-sm text-[#64748B]">{test.id}</td>
                              <td className="px-6 py-4 text-sm text-[#0F172A]">{test.testName}</td>
                              <td className="px-6 py-4 text-sm text-[#64748B]">{test.date}</td>
                              <td className="px-6 py-4">
                                <Badge className={getStatusColor(test.status)}>
                                  {test.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <Badge className={getResultColor(test.result)}>
                                  {test.result}
                                </Badge>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => setSelectedTest(test)}
                                    disabled={test.status !== "Completed"}
                                    className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white rounded-xl"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={test.status !== "Completed"}
                                    className="border-[#CBD5E1] rounded-xl hover:bg-[#E0F2FE]"
                                  >
                                    <Download className="h-4 w-4" />
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
            </div>
          )}

          {/* 2. My Test Results */}
          {currentView === "test-results" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-[#0F172A]">My Test Results</h2>
              </div>

              {/* Search and Filters */}
              <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                        <Input
                          placeholder="Search by test name or ID..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-[#F8FAFC] border-[#CBD5E1] rounded-2xl"
                        />
                      </div>
                    </div>
                    <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
                      <SelectTrigger className="rounded-2xl border-[#CBD5E1]">
                        <SelectValue placeholder="Test Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Blood">Blood Tests</SelectItem>
                        <SelectItem value="Lipid">Lipid Panel</SelectItem>
                        <SelectItem value="Thyroid">Thyroid</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="rounded-2xl border-[#CBD5E1]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Results Table */}
              <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#E3F2FD] border-b border-[#CBD5E1]">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A] first:rounded-tl-2xl">Test ID</th>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Test Name</th>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Date</th>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Result</th>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Status</th>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Trend</th>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A] last:rounded-tr-2xl">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTests.map((test) => (
                          <tr 
                            key={test.id}
                            className="border-b border-[#CBD5E1] hover:bg-[#E3F2FD] transition-colors last:border-0"
                          >
                            <td className="px-6 py-4 text-sm text-[#64748B]">{test.id}</td>
                            <td className="px-6 py-4 text-sm text-[#0F172A]">{test.testName}</td>
                            <td className="px-6 py-4 text-sm text-[#64748B]">{test.date}</td>
                            <td className="px-6 py-4">
                              <Badge className={getResultColor(test.result)}>
                                {test.result}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={getStatusColor(test.status)}>
                                {test.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {getTrendIcon(test.trend)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Button
                                size="sm"
                                onClick={() => setSelectedTest(test)}
                                disabled={test.status !== "Completed"}
                                className="bg-gradient-to-r from-[#1976D2] to-[#1565C0] hover:from-[#1565C0] hover:to-[#0D47A1] text-white rounded-xl"
                              >
                                View Result
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 3. Medical Records */}
          {currentView === "medical-records" && (
            <div className="space-y-6">
              <h2 className="text-2xl text-[#0F172A]">My Medical Records</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#E3F2FD] flex items-center justify-center">
                        <UserCircle className="h-5 w-5 text-[#1976D2]" />
                      </div>
                      <CardTitle className="text-[#0F172A]">Personal Information</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-[#64748B]">Full Name</p>
                      <p className="text-[#0F172A]">{profileData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Age</p>
                      <p className="text-[#0F172A]">{profileData.age} years old</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Gender</p>
                      <p className="text-[#0F172A]">{profileData.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Date of Birth</p>
                      <p className="text-[#0F172A]">{profileData.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Phone</p>
                      <p className="text-[#0F172A]">{profileData.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Email</p>
                      <p className="text-[#0F172A]">{profileData.email}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Information */}
                <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#E3F2FD] flex items-center justify-center">
                        <Heart className="h-5 w-5 text-[#1976D2]" />
                      </div>
                      <CardTitle className="text-[#0F172A]">Medical Information</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-[#64748B]">Blood Type</p>
                      <p className="text-[#0F172A]">{profileData.bloodType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Known Allergies</p>
                      <p className="text-[#0F172A]">{profileData.allergies}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Chronic Conditions</p>
                      <p className="text-[#0F172A]">{profileData.chronicConditions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#64748B]">Medical History</p>
                      <p className="text-[#0F172A]">{profileData.medicalHistory}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Doctor's Notes */}
              <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#E3F2FD] flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-[#1976D2]" />
                    </div>
                    <CardTitle className="text-[#0F172A]">Doctor's Notes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {doctorNotes.map((note, index) => (
                    <div key={index} className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1]">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-[#1976D2]">{note.doctor}</p>
                        <p className="text-xs text-[#64748B]">{note.date}</p>
                      </div>
                      <p className="text-sm text-[#0F172A]">{note.note}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* 4. Test History */}
          {currentView === "test-history" && (
            <div className="space-y-6">
              <h2 className="text-2xl text-[#0F172A]">Test History</h2>

              {/* Filters */}
              <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger className="rounded-2xl border-[#CBD5E1]">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={monthFilter} onValueChange={setMonthFilter}>
                      <SelectTrigger className="rounded-2xl border-[#CBD5E1]">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Months</SelectItem>
                        <SelectItem value="01">January</SelectItem>
                        <SelectItem value="02">February</SelectItem>
                        <SelectItem value="12">December</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
                      <SelectTrigger className="rounded-2xl border-[#CBD5E1]">
                        <SelectValue placeholder="Test Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Blood">Blood Tests</SelectItem>
                        <SelectItem value="Lipid">Lipid Panel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* History Table */}
              <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#E3F2FD] border-b border-[#CBD5E1]">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A] first:rounded-tl-2xl">Test ID</th>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Test Name</th>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Date</th>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Status</th>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Result</th>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Technician</th>
                          <th className="px-6 py-4 text-left text-sm text-[#0F172A] last:rounded-tr-2xl">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTests.map((test) => (
                          <tr 
                            key={test.id}
                            className="border-b border-[#CBD5E1] hover:bg-[#E3F2FD] transition-colors last:border-0"
                          >
                            <td className="px-6 py-4 text-sm text-[#64748B]">{test.id}</td>
                            <td className="px-6 py-4 text-sm text-[#0F172A]">{test.testName}</td>
                            <td className="px-6 py-4 text-sm text-[#64748B]">{test.date}</td>
                            <td className="px-6 py-4">
                              <Badge className={getStatusColor(test.status)}>
                                {test.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className={getResultColor(test.result)}>
                                {test.result}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#64748B]">{test.technician}</td>
                            <td className="px-6 py-4">
                              <Button
                                size="sm"
                                onClick={() => setSelectedTest(test)}
                                disabled={test.status !== "Completed"}
                                className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white rounded-xl"
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics Chart */}
              <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#0F172A]">Tests Per Month</CardTitle>
                  <CardDescription className="text-[#64748B]">Number of tests conducted each month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between gap-4">
                    {testsByMonth.map((item) => (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-[#2563EB] to-[#60A5FA] rounded-t-2xl transition-all hover:from-[#1D4ED8] hover:to-[#3B82F6]"
                          style={{ height: `${(item.count / 5) * 100}%` }}
                        ></div>
                        <p className="text-xs text-[#64748B]">{item.month}</p>
                        <p className="text-sm text-[#0F172A]">{item.count}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 5. Profile */}
          {currentView === "profile" && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-2xl text-[#0F172A]">My Profile</h2>

              <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                <CardContent className="pt-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#CBD5E1]">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="bg-[#1976D2] text-white text-2xl">
                        {profileData.fullName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl text-[#0F172A] mb-2">{profileData.fullName}</h3>
                      <p className="text-sm text-[#64748B] mb-4">{profileData.email}</p>
                      <Button 
                        variant="outline"
                        className="rounded-2xl border-[#CBD5E1] hover:bg-[#E3F2FD]"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Update Avatar
                      </Button>
                    </div>
                  </div>

                  {/* Profile Fields */}
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="fullName" className="text-[#0F172A]">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        className="mt-2 rounded-2xl border-[#CBD5E1] bg-[#F8FAFC]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-[#0F172A]">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="mt-2 rounded-2xl border-[#CBD5E1] bg-[#F8FAFC]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-[#0F172A]">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="mt-2 rounded-2xl border-[#CBD5E1] bg-[#F8FAFC]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="language" className="text-[#0F172A]">Language Preference</Label>
                      <Select value={profileData.language} onValueChange={(val) => setProfileData({...profileData, language: val})}>
                        <SelectTrigger className="mt-2 rounded-2xl border-[#CBD5E1] bg-[#F8FAFC]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="my-6 bg-[#CBD5E1]" />

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white rounded-2xl">
                        <Check className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline"
                        className="rounded-2xl border-[#CBD5E1] hover:bg-[#E3F2FD]"
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 6. Notifications */}
          {currentView === "notifications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl text-[#0F172A]">Notifications</h2>
                <Button
                  variant="outline"
                  onClick={markAllAsRead}
                  className="rounded-2xl border-[#CBD5E1] hover:bg-[#E3F2FD]"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              </div>

              {/* Filter */}
              <div className="flex gap-2">
                <Button
                  variant={notificationFilter === "all" ? "default" : "outline"}
                  onClick={() => setNotificationFilter("all")}
                  className={`rounded-2xl ${notificationFilter === "all" ? "bg-[#1976D2]" : "border-[#CBD5E1]"}`}
                >
                  All
                </Button>
                <Button
                  variant={notificationFilter === "unread" ? "default" : "outline"}
                  onClick={() => setNotificationFilter("unread")}
                  className={`rounded-2xl ${notificationFilter === "unread" ? "bg-[#1976D2]" : "border-[#CBD5E1]"}`}
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  variant={notificationFilter === "read" ? "default" : "outline"}
                  onClick={() => setNotificationFilter("read")}
                  className={`rounded-2xl ${notificationFilter === "read" ? "bg-[#1976D2]" : "border-[#CBD5E1]"}`}
                >
                  Read
                </Button>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {filteredNotifications.map((notif) => (
                  <Card 
                    key={notif.id}
                    className={`rounded-2xl border-[#CBD5E1] shadow-sm cursor-pointer transition-all ${
                      !notif.read ? "bg-[#E3F2FD] hover:bg-[#BBDEFB]" : "bg-white hover:bg-[#F8FAFC]"
                    }`}
                    onClick={() => toggleNotificationRead(notif.id)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                          notif.type === "success" ? "bg-green-100" :
                          notif.type === "warning" ? "bg-orange-100" :
                          "bg-blue-100"
                        }`}>
                          {notif.type === "success" && <Check className="h-5 w-5 text-green-600" />}
                          {notif.type === "warning" && <AlertCircle className="h-5 w-5 text-orange-600" />}
                          {notif.type === "info" && <Info className="h-5 w-5 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-[#0F172A] mb-1">{notif.message}</p>
                          <p className="text-sm text-[#64748B]">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-[#1976D2] rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-[#CBD5E1]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#64748B]">
              <p>© 2025 Laboratory Management System</p>
              <div className="flex gap-6">
                <a href="#" className="text-[#1976D2] hover:underline">Help</a>
                <a href="#" className="text-[#1976D2] hover:underline">Privacy Policy</a>
                <a href="#" className="text-[#1976D2] hover:underline">Contact Support</a>
              </div>
            </div>
          </footer>
          </div>
        </ScrollArea>
      </div>

      {/* Upcoming Test Detail Modal */}
      <UpcomingTestDetail
        open={showUpcomingTestDetail}
        onClose={() => setShowUpcomingTestDetail(false)}
        testData={{
          testId: "LAB-TEST-2025-001",
          testName: upcomingAppointment.testName,
          department: "General Laboratory",
          labRoom: upcomingAppointment.labRoom,
          technician: "Dr. Sarah Smith",
          date: upcomingAppointment.date,
          time: upcomingAppointment.time,
          duration: "45 minutes",
          sampleType: "Blood",
          status: "Scheduled"
        }}
        patientData={{
          name: patientName,
          id: "PT-2025-001",
          email: profileData.email,
          phone: profileData.phone,
          age: profileData.age,
          gender: profileData.gender
        }}
        labInfo={{
          address: "123 Medical Plaza, San Francisco, CA 94102",
          hotline: upcomingAppointment.contact
        }}
      />

      {/* Add to Calendar Modal (from Dashboard) */}
      <AddToCalendarModal
        open={showAddToCalendar}
        onClose={() => setShowAddToCalendar(false)}
        appointmentData={{
          testName: upcomingAppointment.testName,
          date: upcomingAppointment.date,
          time: upcomingAppointment.time,
          location: "General Laboratory",
          labRoom: upcomingAppointment.labRoom,
          technician: "Dr. Sarah Smith",
          duration: "45 minutes",
          status: upcomingAppointment.status
        }}
      />

      {/* Test Detail Modal */}
      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent className="max-w-4xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#0F172A] flex items-center justify-between">
              Test Result Detail
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTest(null)}
                className="rounded-2xl"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogTitle>
            <DialogDescription className="sr-only">
              View detailed test results including parameters, values, and doctor's comments
            </DialogDescription>
          </DialogHeader>

          {selectedTest && (
            <div className="space-y-6">
              {/* Patient Info Summary */}
              <div className="bg-[#E3F2FD] rounded-2xl p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#64748B]">Patient Name</p>
                    <p className="text-[#0F172A]">{patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Test Name</p>
                    <p className="text-[#0F172A]">{selectedTest.testName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Test ID</p>
                    <p className="text-[#0F172A]">{selectedTest.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#64748B]">Test Date</p>
                    <p className="text-[#0F172A]">{selectedTest.date}</p>
                  </div>
                </div>
              </div>

              {/* Parameters Table */}
              {selectedTest.parameters && (
                <div className="rounded-2xl border border-[#CBD5E1] overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#E3F2FD]">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Parameter</th>
                        <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Result</th>
                        <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Unit</th>
                        <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Normal Range</th>
                        <th className="px-6 py-4 text-left text-sm text-[#0F172A]">Flag</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTest.parameters.map((param, index) => (
                        <tr key={index} className="border-t border-[#CBD5E1]">
                          <td className="px-6 py-4 text-sm text-[#0F172A]">{param.name}</td>
                          <td className="px-6 py-4 text-sm text-[#0F172A]">{param.result}</td>
                          <td className="px-6 py-4 text-sm text-[#64748B]">{param.unit}</td>
                          <td className="px-6 py-4 text-sm text-[#64748B]">{param.normalRange}</td>
                          <td className="px-6 py-4">
                            {param.flag === "high" && (
                              <span className="flex items-center gap-1 text-[#EF4444]">
                                <ArrowUp className="h-4 w-4" />
                                High
                              </span>
                            )}
                            {param.flag === "low" && (
                              <span className="flex items-center gap-1 text-[#EF4444]">
                                <ArrowDown className="h-4 w-4" />
                                Low
                              </span>
                            )}
                            {param.flag === "normal" && (
                              <span className="text-[#10B981]">Normal</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Doctor's Comment */}
              {selectedTest.doctorComment && (
                <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#CBD5E1]">
                  <h4 className="text-[#0F172A] mb-2">Doctor's Comment</h4>
                  <p className="text-[#64748B]">{selectedTest.doctorComment}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="rounded-2xl border-[#CBD5E1]"
                  onClick={() => setSelectedTest(null)}
                >
                  Close
                </Button>
                <Button className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white rounded-2xl">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
