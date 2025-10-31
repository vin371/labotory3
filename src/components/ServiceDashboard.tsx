import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import {
  AlertTriangle,
  Beaker,
  Bell,
  ChevronDown,
  CheckCircle2,
  Database,
  Edit,
  Eye,
  FileText,
  FlaskConical,
  Layout,
  LogOut,
  Menu,
  Package,
  Plus,
  RefreshCw,
  Search,
  Server,
  Settings,
  Trash2,
  Wrench,
  XCircle,
  ShieldCheck,
  AlertCircle,
  CheckSquare
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import ServiceWarehouseService from "./ServiceWarehouseService";

type TabView = 
  | "dashboard" 
  | "instruments" 
  | "warehouse" 
  | "event-logs" 
  | "configuration" 
  | "notifications";

type InstrumentStatus = "Ready" | "Maintenance" | "Inactive" | "Error";
type ReagentStatus = "Normal" | "Low" | "Critical" | "Expired";
type SystemHealthStatus = "Operational" | "Warning" | "Error";

interface Instrument {
  id: string;
  name: string;
  model: string;
  status: InstrumentStatus;
  mode: string;
  lastSync: string;
  location: string;
}

interface Reagent {
  id: string;
  name: string;
  lotNumber: string;
  quantity: number;
  expiryDate: string;
  status: ReagentStatus;
  vendor: string;
}

interface EventLog {
  id: string;
  timestamp: string;
  eventType: string;
  operator: string;
  message: string;
  category: "System" | "Instrument" | "Reagent" | "Config";
  severity: "Info" | "Warning" | "Error";
}

interface Notification {
  id: string;
  type: "Instrument Alert" | "Reagent Warning" | "System Health";
  message: string;
  timestamp: string;
  severity: "info" | "warning" | "error";
  isRead: boolean;
}

interface SystemConfig {
  id: string;
  name: string;
  value: string;
  lastSync: string;
  category: string;
}

// Mock Data
const mockInstruments: Instrument[] = [
  {
    id: "INS-001",
    name: "Hematology Analyzer XN-1000",
    model: "XN-1000",
    status: "Ready",
    mode: "Active",
    lastSync: "2025-10-22 09:30:00",
    location: "Lab Floor 1"
  },
  {
    id: "INS-002",
    name: "Chemistry Analyzer AU-5800",
    model: "AU-5800",
    status: "Maintenance",
    mode: "Service",
    lastSync: "2025-10-22 08:15:00",
    location: "Lab Floor 2"
  },
  {
    id: "INS-003",
    name: "Immunology Analyzer DxI-800",
    model: "DxI-800",
    status: "Ready",
    mode: "Active",
    lastSync: "2025-10-22 10:00:00",
    location: "Lab Floor 1"
  },
  {
    id: "INS-004",
    name: "Coagulation Analyzer ACL-TOP",
    model: "ACL-TOP",
    status: "Inactive",
    mode: "Standby",
    lastSync: "2025-10-21 18:45:00",
    location: "Lab Floor 2"
  }
];

const mockReagents: Reagent[] = [
  {
    id: "REG-001",
    name: "CBC Reagent Kit",
    lotNumber: "LOT-2025-001",
    quantity: 450,
    expiryDate: "2026-03-15",
    status: "Normal",
    vendor: "BioSupply Co."
  },
  {
    id: "REG-002",
    name: "Chemistry Panel Solution",
    lotNumber: "LOT-2025-002",
    quantity: 120,
    expiryDate: "2026-04-20",
    status: "Low",
    vendor: "MedChem Solutions"
  },
  {
    id: "REG-003",
    name: "Immunoassay Reagent",
    lotNumber: "LOT-2025-003",
    quantity: 45,
    expiryDate: "2026-02-10",
    status: "Critical",
    vendor: "ImmunoTech Ltd."
  },
  {
    id: "REG-004",
    name: "Coagulation Test Kit",
    lotNumber: "LOT-2024-050",
    quantity: 85,
    expiryDate: "2025-11-30",
    status: "Normal",
    vendor: "CoagTest Inc."
  }
];

const mockEventLogs: EventLog[] = [
  {
    id: "EVT-001",
    timestamp: "2025-10-22 10:30:15",
    eventType: "Instrument Mode Changed",
    operator: "service01@lab.com",
    message: "Chemistry Analyzer AU-5800 switched to Maintenance mode",
    category: "Instrument",
    severity: "Info"
  },
  {
    id: "EVT-002",
    timestamp: "2025-10-22 10:15:00",
    eventType: "Test Started",
    operator: "service01@lab.com",
    message: "Test CBC-12345 started on Hematology Analyzer XN-1000",
    category: "System",
    severity: "Info"
  },
  {
    id: "EVT-003",
    timestamp: "2025-10-22 09:45:30",
    eventType: "Reagent Low Stock",
    operator: "system",
    message: "Immunoassay Reagent (LOT-2025-003) stock critical: 45 units remaining",
    category: "Reagent",
    severity: "Warning"
  },
  {
    id: "EVT-004",
    timestamp: "2025-10-22 08:45:00",
    eventType: "Test Failed",
    operator: "service01@lab.com",
    message: "Test COA-12348 failed on Coagulation Analyzer ACL-TOP - Error: Calibration required",
    category: "Instrument",
    severity: "Error"
  }
];

const mockNotifications: Notification[] = [
  {
    id: "NOT-001",
    type: "Instrument Alert",
    message: "Chemistry Analyzer AU-5800 requires calibration",
    timestamp: "2025-10-22 10:30:00",
    severity: "warning",
    isRead: false
  },
  {
    id: "NOT-002",
    type: "Reagent Warning",
    message: "Immunoassay Reagent stock critical (45 units)",
    timestamp: "2025-10-22 09:45:00",
    severity: "error",
    isRead: false
  },
  {
    id: "NOT-003",
    type: "System Health",
    message: "All systems operational",
    timestamp: "2025-10-22 09:00:00",
    severity: "info",
    isRead: true
  }
];

const mockConfigs: SystemConfig[] = [
  {
    id: "CFG-001",
    name: "Lockout Policy",
    value: "3 failed attempts",
    lastSync: "2025-10-17 14:00:00",
    category: "Security"
  },
  {
    id: "CFG-002",
    name: "AI Auto Review",
    value: "Enabled",
    lastSync: "2025-10-17 14:00:00",
    category: "Automation"
  },
  {
    id: "CFG-003",
    name: "Session Timeout",
    value: "30 minutes",
    lastSync: "2025-10-17 14:00:00",
    category: "Security"
  },
  {
    id: "CFG-004",
    name: "Result Sync Interval",
    value: "5 minutes",
    lastSync: "2025-10-17 14:00:00",
    category: "System"
  }
];

interface ServiceDashboardProps {
  onLogout: () => void;
  serviceTechName?: string;
}

export function ServiceDashboard({ onLogout, serviceTechName = "Service Technician" }: ServiceDashboardProps) {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<TabView>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // State
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [reagents, setReagents] = useState<Reagent[]>(mockReagents);
  const [eventLogs, setEventLogs] = useState<EventLog[]>(mockEventLogs);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [configs, setConfigs] = useState<SystemConfig[]>(mockConfigs);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  
  // Dialog States
  const [isInstrumentModeOpen, setIsInstrumentModeOpen] = useState(false);
  const [isAddReagentOpen, setIsAddReagentOpen] = useState(false);
  const [isEditReagentOpen, setIsEditReagentOpen] = useState(false);
  const [isDeleteReagentOpen, setIsDeleteReagentOpen] = useState(false);
  const [isViewReagentOpen, setIsViewReagentOpen] = useState(false);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  
  // Selected Items
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  const [reagentToDelete, setReagentToDelete] = useState<Reagent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventLog | null>(null);
  
  // Forms
  const [modeChangeForm, setModeChangeForm] = useState({
    mode: "",
    reason: ""
  });
  
  const [reagentForm, setReagentForm] = useState({
    name: "",
    lotNumber: "",
    quantity: 0,
    expiryDate: "",
    vendor: ""
  });

  // System Health Status
  const [systemHealth, setSystemHealth] = useState<SystemHealthStatus>("Operational");
  const [brokerStatus, setBrokerStatus] = useState<SystemHealthStatus>("Operational");
  const [serviceStatus, setServiceStatus] = useState<SystemHealthStatus>("Operational");

  // Statistics
  const activeInstruments = instruments.filter(i => i.status === "Ready").length;
  const maintenanceInstruments = instruments.filter(i => i.status === "Maintenance").length;
  const inactiveInstruments = instruments.filter(i => i.status === "Inactive").length;
  const lowReagents = reagents.filter(r => r.status === "Low" || r.status === "Critical").length;
  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const systemAlerts = eventLogs.filter(e => e.severity === "Error" || e.severity === "Warning").length;

  // Navigation items
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Layout, color: "text-[#1E88E5]" },
    { id: "instruments", label: "Instruments", icon: Wrench, color: "text-[#1E88E5]" },
    { id: "warehouse", label: "Warehouse", icon: Package, color: "text-[#4CAF50]" },
    { id: "event-logs", label: "Event Logs", icon: FileText, color: "text-[#9C27B0]" },
    { id: "configuration", label: "Configuration", icon: Settings, color: "text-[#FF9800]" },
    { id: "notifications", label: "Notifications", icon: Bell, color: "text-[#F44336]" }
  ];

  // Handlers
  const handleInstrumentModeChange = () => {
    if (!selectedInstrument || !modeChangeForm.mode) {
      toast.error("Please select a mode and provide a reason");
      return;
    }

    const statusMap: { [key: string]: InstrumentStatus } = {
      "Active": "Ready",
      "Service": "Maintenance",
      "Standby": "Inactive"
    };

    setInstruments(instruments.map(i => 
      i.id === selectedInstrument.id 
        ? { ...i, mode: modeChangeForm.mode, status: statusMap[modeChangeForm.mode] || i.status }
        : i
    ));

    toast.success(`Instrument mode changed to ${modeChangeForm.mode}`);
    setIsInstrumentModeOpen(false);
    setModeChangeForm({ mode: "", reason: "" });
  };

  const handleAddReagent = () => {
    if (!reagentForm.name || !reagentForm.lotNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newReagent: Reagent = {
      id: `REG-${String(reagents.length + 1).padStart(3, '0')}`,
      name: reagentForm.name,
      lotNumber: reagentForm.lotNumber,
      quantity: reagentForm.quantity,
      expiryDate: reagentForm.expiryDate,
      status: reagentForm.quantity > 200 ? "Normal" : reagentForm.quantity > 100 ? "Low" : "Critical",
      vendor: reagentForm.vendor
    };

    setReagents([...reagents, newReagent]);
    toast.success("✅ Reagent added successfully", {
      description: `${newReagent.name} has been added to inventory.`
    });
    setIsAddReagentOpen(false);
    setReagentForm({ name: "", lotNumber: "", quantity: 0, expiryDate: "", vendor: "" });
  };

  const handleViewReagent = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    setIsViewReagentOpen(true);
  };

  const handleEditReagent = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    setReagentForm({
      name: reagent.name,
      lotNumber: reagent.lotNumber,
      quantity: reagent.quantity,
      expiryDate: reagent.expiryDate,
      vendor: reagent.vendor
    });
    setIsEditReagentOpen(true);
  };

  const handleUpdateReagent = () => {
    if (!reagentForm.name || !reagentForm.lotNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedReagent) {
      const updatedReagent: Reagent = {
        ...selectedReagent,
        name: reagentForm.name,
        lotNumber: reagentForm.lotNumber,
        quantity: reagentForm.quantity,
        expiryDate: reagentForm.expiryDate,
        vendor: reagentForm.vendor,
        status: reagentForm.quantity > 200 ? "Normal" : reagentForm.quantity > 100 ? "Low" : "Critical"
      };

      setReagents(reagents.map(r => r.id === selectedReagent.id ? updatedReagent : r));
      toast.success("✅ Reagent updated successfully");
      setIsEditReagentOpen(false);
      setSelectedReagent(null);
      setReagentForm({ name: "", lotNumber: "", quantity: 0, expiryDate: "", vendor: "" });
    }
  };

  const handleDeleteReagent = (reagent: Reagent) => {
    setReagentToDelete(reagent);
    setIsDeleteReagentOpen(true);
  };

  const handleDeleteReagentConfirm = () => {
    if (reagentToDelete) {
      setReagents(reagents.filter(r => r.id !== reagentToDelete.id));
      toast.success("✅ Reagent deleted successfully", {
        description: `${reagentToDelete.name} has been removed from inventory.`
      });
      setIsDeleteReagentOpen(false);
      setReagentToDelete(null);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const handleClearAll = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read");
  };

  const handleSyncConfig = () => {
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setConfigs(configs.map(c => ({ ...c, lastSync: now })));
    toast.success("Configuration synced successfully");
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div className="space-y-6 mt-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-md border-[#BBDEFB] rounded-2xl bg-gradient-to-br from-[#E3F2FD] to-white hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Total Instruments</CardDescription>
            <CardTitle className="text-[#1E88E5] flex items-center justify-between">
              {instruments.length}
              <Wrench className="h-6 w-6 text-[#1E88E5] opacity-50" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm text-[#666666]">
              <div className="flex justify-between">
                <span>Active:</span>
                <span className="text-green-600">{activeInstruments}</span>
              </div>
              <div className="flex justify-between">
                <span>Maintenance:</span>
                <span className="text-yellow-600">{maintenanceInstruments}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#90CAF9] rounded-2xl bg-gradient-to-br from-[#E1F5FE] to-white hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Instruments in Maintenance</CardDescription>
            <CardTitle className="text-[#0288D1] flex items-center justify-between">
              {maintenanceInstruments}
              <Wrench className="h-6 w-6 text-[#0288D1] opacity-50" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#666666]">
              {inactiveInstruments} instruments inactive
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#A5D6A7] rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-white hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Reagent Low Stock</CardDescription>
            <CardTitle className="text-[#4CAF50] flex items-center justify-between">
              {lowReagents}
              <AlertTriangle className="h-6 w-6 text-[#FF9800] opacity-50" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#666666]">
              {reagents.filter(r => r.status === "Critical").length} critical items
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#FFCCBC] rounded-2xl bg-gradient-to-br from-[#FFF3E0] to-white hover:shadow-lg transition-all">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">System Alerts</CardDescription>
            <CardTitle className="text-[#FF9800] flex items-center justify-between">
              {systemAlerts}
              <AlertCircle className="h-6 w-6 text-[#F44336] opacity-50" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm text-[#666666]">
              <div className="flex justify-between">
                <span>Errors:</span>
                <span className="text-red-600">{eventLogs.filter(e => e.severity === "Error").length}</span>
              </div>
              <div className="flex justify-between">
                <span>Warnings:</span>
                <span className="text-yellow-600">{eventLogs.filter(e => e.severity === "Warning").length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Check Section */}
      <Card className="shadow-md border-[#BBDEFB] rounded-2xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1E88E5] flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            System Health Check
          </CardTitle>
          <CardDescription>Monitor service and broker operational status</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-[#666666]">System Health</p>
                  <p className="text-green-600">{systemHealth}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Broker Status</p>
                  <p className="text-blue-600">{brokerStatus}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Server className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Service Status</p>
                  <p className="text-purple-600">{serviceStatus}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-md border-[#CE93D8] rounded-2xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#F3E5F5] to-white border-b border-[#CE93D8]">
          <CardTitle className="text-[#9C27B0]">Recent Activity</CardTitle>
          <CardDescription>Latest system events and actions</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {eventLogs.slice(0, 5).map(event => (
              <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  event.severity === "Error" ? "bg-red-100" :
                  event.severity === "Warning" ? "bg-yellow-100" : "bg-blue-100"
                }`}>
                  {event.severity === "Error" ? <XCircle className="h-4 w-4 text-red-600" /> :
                   event.severity === "Warning" ? <AlertTriangle className="h-4 w-4 text-yellow-600" /> :
                   <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#333333]">{event.message}</p>
                  <p className="text-xs text-[#999999] mt-1">{event.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Instruments
  const renderInstruments = () => (
    <div className="space-y-6 mt-6">
      {/* Instruments Table */}
      <Card className="shadow-md border-[#BBDEFB] rounded-2xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1E88E5]">Laboratory Instruments</CardTitle>
          <CardDescription>Monitor and manage instrument operations</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1E88E5]">Instrument ID</TableHead>
                  <TableHead className="text-[#1E88E5]">Model</TableHead>
                  <TableHead className="text-[#1E88E5]">Status</TableHead>
                  <TableHead className="text-[#1E88E5]">Mode</TableHead>
                  <TableHead className="text-[#1E88E5]">Last Sync</TableHead>
                  <TableHead className="text-[#1E88E5]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instruments.map((instrument, index) => (
                  <TableRow key={instrument.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-blue-50 transition-colors`}>
                    <TableCell className="font-medium text-[#333333]">{instrument.id}</TableCell>
                    <TableCell className="text-[#666666]">{instrument.model}</TableCell>
                    <TableCell>
                      <Badge className={`${
                        instrument.status === "Ready" ? "bg-green-100 text-green-800 border-green-300" :
                        instrument.status === "Maintenance" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                        instrument.status === "Inactive" ? "bg-gray-100 text-gray-800 border-gray-300" :
                        "bg-red-100 text-red-800 border-red-300"
                      }`} variant="outline">
                        {instrument.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{instrument.mode}</TableCell>
                    <TableCell className="text-[#666666] text-sm">{instrument.lastSync}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedInstrument(instrument);
                            setIsInstrumentModeOpen(true);
                          }}
                          className="rounded-xl"
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Change Mode
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Warehouse - Using ServiceWarehouseService component
  const renderWarehouse = () => (
    <ServiceWarehouseService />
  );

  // Render Event Logs
  const renderEventLogs = () => (
    <div className="space-y-6 mt-6">
      {/* Filters */}
      <Card className="shadow-md border-[#CE93D8] rounded-2xl bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="System">System</SelectItem>
                <SelectItem value="Instrument">Instrument</SelectItem>
                <SelectItem value="Reagent">Reagent</SelectItem>
                <SelectItem value="Config">Config</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Event Logs Table */}
      <Card className="shadow-md border-[#CE93D8] rounded-2xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#F3E5F5] to-white border-b border-[#CE93D8]">
          <CardTitle className="text-[#9C27B0]">System Event Logs</CardTitle>
          <CardDescription>Monitor system activities and operations</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-[#CE93D8] rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F3E5F5] hover:bg-[#F3E5F5]">
                  <TableHead className="text-[#9C27B0]">Timestamp</TableHead>
                  <TableHead className="text-[#9C27B0]">Event Type</TableHead>
                  <TableHead className="text-[#9C27B0]">Operator</TableHead>
                  <TableHead className="text-[#9C27B0]">Message</TableHead>
                  <TableHead className="text-[#9C27B0]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventLogs
                  .filter(e => filterCategory === "all" || e.category === filterCategory)
                  .filter(e =>
                    searchQuery === "" ||
                    e.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    e.eventType.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((event, index) => (
                    <TableRow key={event.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-purple-50 transition-colors`}>
                      <TableCell className="text-[#666666] text-sm">{event.timestamp}</TableCell>
                      <TableCell className="font-medium text-[#333333]">{event.eventType}</TableCell>
                      <TableCell className="text-[#666666]">{event.operator}</TableCell>
                      <TableCell className="text-[#666666]">{event.message}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsEventDetailOpen(true);
                          }}
                          className="rounded-xl"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Configuration
  const renderConfiguration = () => (
    <div className="space-y-6 mt-6">
      {/* Sync Control */}
      <Card className="shadow-md border-[#FFE082] rounded-2xl bg-gradient-to-r from-yellow-50 to-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#666666]">Last Configuration Sync</p>
                <p className="text-[#333333]">{configs[0]?.lastSync || "Never"}</p>
              </div>
            </div>
            <Button
              onClick={handleSyncConfig}
              className="bg-[#FF9800] hover:bg-[#F57C00] rounded-xl"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Table */}
      <Card className="shadow-md border-[#FFE082] rounded-2xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#FFF8E1] to-white border-b border-[#FFE082]">
          <CardTitle className="text-[#FF9800]">System Configuration</CardTitle>
          <CardDescription>Read-only system settings and parameters</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-[#FFE082] rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FFF8E1] hover:bg-[#FFF8E1]">
                  <TableHead className="text-[#FF9800]">Configuration</TableHead>
                  <TableHead className="text-[#FF9800]">Value</TableHead>
                  <TableHead className="text-[#FF9800]">Category</TableHead>
                  <TableHead className="text-[#FF9800]">Last Sync</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config, index) => (
                  <TableRow key={config.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-orange-50 transition-colors`}>
                    <TableCell className="font-medium text-[#333333]">{config.name}</TableCell>
                    <TableCell className="text-[#666666]">{config.value}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
                        {config.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666] text-sm">{config.lastSync}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Notifications
  const renderNotifications = () => (
    <div className="space-y-6 mt-6">
      {/* Actions */}
      <div className="flex justify-between items-center">
        <Badge className="bg-blue-100 text-blue-800 border-blue-300" variant="outline">
          {unreadNotifications} Unread Notifications
        </Badge>
        <Button
          onClick={handleClearAll}
          variant="outline"
          className="rounded-xl"
        >
          <CheckSquare className="h-4 w-4 mr-2" />
          Mark All as Read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map(notification => (
          <Card 
            key={notification.id} 
            className={`shadow-md rounded-2xl transition-all ${
              notification.isRead ? 'bg-slate-50 border-slate-200' : 'bg-white border-blue-300'
            } hover:shadow-lg`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  notification.severity === "error" ? "bg-red-100" :
                  notification.severity === "warning" ? "bg-yellow-100" :
                  "bg-blue-100"
                }`}>
                  {notification.type === "Instrument Alert" && <Wrench className={`h-5 w-5 ${
                    notification.severity === "error" ? "text-red-600" :
                    notification.severity === "warning" ? "text-yellow-600" :
                    "text-blue-600"
                  }`} />}
                  {notification.type === "Reagent Warning" && <Beaker className={`h-5 w-5 ${
                    notification.severity === "error" ? "text-red-600" :
                    notification.severity === "warning" ? "text-yellow-600" :
                    "text-blue-600"
                  }`} />}
                  {notification.type === "System Health" && <ShieldCheck className={`h-5 w-5 ${
                    notification.severity === "error" ? "text-red-600" :
                    notification.severity === "warning" ? "text-yellow-600" :
                    "text-blue-600"
                  }`} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className={`${
                        notification.severity === "error" ? "bg-red-100 text-red-800 border-red-300" :
                        notification.severity === "warning" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                        "bg-blue-100 text-blue-800 border-blue-300"
                      } mb-2`} variant="outline">
                        {notification.type}
                      </Badge>
                      <p className="text-sm text-[#333333]">{notification.message}</p>
                      <p className="text-xs text-[#999999] mt-2">{notification.timestamp}</p>
                    </div>
                    {!notification.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="rounded-xl"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Mark Read
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

  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      {/* Sidebar */}
      <aside className={`${
        isSidebarOpen ? "w-72" : "w-0"
      } bg-white border-r border-[#E0E6ED] transition-all duration-300 overflow-hidden flex flex-col`}>
        {isSidebarOpen && (
          <>
            {/* Logo */}
            <div className="p-6 border-b border-[#E0E6ED]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007BFF] to-[#0056D2] flex items-center justify-center">
                  <FlaskConical className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-[#1E88E5]">Lab System</h1>
                  <p className="text-xs text-[#999999]">Service Portal</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {navigationItems.map(item => (
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
                    {item.id === "notifications" && unreadNotifications > 0 && (
                      <Badge className="ml-auto bg-red-500 text-white">{unreadNotifications}</Badge>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#E0E6ED] sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-xl"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-[#1E88E5]">Service Dashboard</h2>
                <p className="text-sm text-[#666666]">Laboratory Service Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* System Status */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-green-700">{systemHealth}</span>
              </div>

              {/* Notification Bell */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentTab("notifications")}
                className="rounded-xl relative"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#EAF3FF] transition-colors">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-[#007BFF] to-[#0056D2] text-white">
                        {serviceTechName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-sm text-[#333333]">{serviceTechName}</p>
                      <p className="text-xs text-[#6B7280]">Service Technician</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-[#6B7280]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {currentTab === "dashboard" && renderDashboard()}
            {currentTab === "instruments" && renderInstruments()}
            {currentTab === "warehouse" && renderWarehouse()}
            {currentTab === "event-logs" && renderEventLogs()}
            {currentTab === "configuration" && renderConfiguration()}
            {currentTab === "notifications" && renderNotifications()}
          </div>
        </main>
      </div>

      {/* Dialogs */}
      {/* Instrument Mode Change Dialog */}
      <Dialog open={isInstrumentModeOpen} onOpenChange={setIsInstrumentModeOpen}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1E88E5]">Change Instrument Mode</DialogTitle>
            <DialogDescription>
              Update operational mode for {selectedInstrument?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Mode</Label>
              <Select
                value={modeChangeForm.mode}
                onValueChange={(value) => setModeChangeForm({ ...modeChangeForm, mode: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                  <SelectItem value="Standby">Standby</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={modeChangeForm.reason}
                onChange={(e) => setModeChangeForm({ ...modeChangeForm, reason: e.target.value })}
                placeholder="Provide reason for mode change..."
                rows={3}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInstrumentModeOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleInstrumentModeChange} className="bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl">
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Reagent Dialog */}
      <Dialog open={isAddReagentOpen} onOpenChange={setIsAddReagentOpen}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#4CAF50]">Add New Reagent</DialogTitle>
            <DialogDescription>
              Register new reagent in warehouse inventory
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reagent Name</Label>
              <Input
                value={reagentForm.name}
                onChange={(e) => setReagentForm({ ...reagentForm, name: e.target.value })}
                placeholder="Enter reagent name"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Lot Number</Label>
              <Input
                value={reagentForm.lotNumber}
                onChange={(e) => setReagentForm({ ...reagentForm, lotNumber: e.target.value })}
                placeholder="Enter lot number"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={reagentForm.quantity || ""}
                  onChange={(e) => setReagentForm({ ...reagentForm, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={reagentForm.expiryDate}
                  onChange={(e) => setReagentForm({ ...reagentForm, expiryDate: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Input
                value={reagentForm.vendor}
                onChange={(e) => setReagentForm({ ...reagentForm, vendor: e.target.value })}
                placeholder="Enter vendor name"
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddReagentOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleAddReagent} className="bg-[#4CAF50] hover:bg-[#388E3C] rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Add Reagent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Reagent Dialog */}
      <Dialog open={isViewReagentOpen} onOpenChange={setIsViewReagentOpen}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#4CAF50]">Reagent Details</DialogTitle>
            <DialogDescription>
              View detailed information about reagent
            </DialogDescription>
          </DialogHeader>
          {selectedReagent && (
            <div className="py-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Reagent ID:</span>
                  <span className="text-[#333333]">{selectedReagent.id}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Name:</span>
                  <span className="text-[#333333]">{selectedReagent.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Lot Number:</span>
                  <span className="text-[#333333]">{selectedReagent.lotNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Quantity:</span>
                  <span className="text-[#333333]">{selectedReagent.quantity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Expiry Date:</span>
                  <span className="text-[#333333]">{selectedReagent.expiryDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Vendor:</span>
                  <span className="text-[#333333]">{selectedReagent.vendor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Status:</span>
                  <Badge className={`${
                    selectedReagent.status === "Normal" ? "bg-green-100 text-green-800 border-green-300" :
                    selectedReagent.status === "Low" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                    selectedReagent.status === "Critical" ? "bg-red-100 text-red-800 border-red-300" :
                    "bg-gray-100 text-gray-800 border-gray-300"
                  }`} variant="outline">
                    {selectedReagent.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewReagentOpen(false)} className="bg-[#4CAF50] hover:bg-[#388E3C] rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Reagent Dialog */}
      <Dialog open={isEditReagentOpen} onOpenChange={setIsEditReagentOpen}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#4CAF50]">Edit Reagent</DialogTitle>
            <DialogDescription>
              Update reagent information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reagent Name</Label>
              <Input
                value={reagentForm.name}
                onChange={(e) => setReagentForm({ ...reagentForm, name: e.target.value })}
                placeholder="Enter reagent name"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Lot Number</Label>
              <Input
                value={reagentForm.lotNumber}
                onChange={(e) => setReagentForm({ ...reagentForm, lotNumber: e.target.value })}
                placeholder="Enter lot number"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={reagentForm.quantity || ""}
                  onChange={(e) => setReagentForm({ ...reagentForm, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={reagentForm.expiryDate}
                  onChange={(e) => setReagentForm({ ...reagentForm, expiryDate: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Vendor</Label>
              <Input
                value={reagentForm.vendor}
                onChange={(e) => setReagentForm({ ...reagentForm, vendor: e.target.value })}
                placeholder="Enter vendor name"
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditReagentOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleUpdateReagent} className="bg-[#4CAF50] hover:bg-[#388E3C] rounded-xl">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Update Reagent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Reagent Confirmation Dialog */}
      <AlertDialog open={isDeleteReagentOpen} onOpenChange={setIsDeleteReagentOpen}>
        <AlertDialogContent className="bg-white rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Reagent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold text-[#333333]">{reagentToDelete?.name}</span>?
              <br />
              This action cannot be undone and will remove the reagent from inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReagentConfirm}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Event Detail Dialog */}
      <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
        <DialogContent className="bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#9C27B0]">Event Details</DialogTitle>
            <DialogDescription>
              Detailed information about system event
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Event ID:</span>
                <span className="text-[#333333]">{selectedEvent?.id}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Type:</span>
                <span className="text-[#333333]">{selectedEvent?.eventType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Category:</span>
                <Badge variant="outline">{selectedEvent?.category}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Severity:</span>
                <Badge className={`${
                  selectedEvent?.severity === "Error" ? "bg-red-100 text-red-800" :
                  selectedEvent?.severity === "Warning" ? "bg-yellow-100 text-yellow-800" :
                  "bg-blue-100 text-blue-800"
                }`} variant="outline">
                  {selectedEvent?.severity}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-1">
                <span className="text-sm text-[#666666]">Message:</span>
                <p className="text-sm text-[#333333]">{selectedEvent?.message}</p>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Operator:</span>
                <span className="text-[#333333]">{selectedEvent?.operator}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Timestamp:</span>
                <span className="text-[#333333]">{selectedEvent?.timestamp}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsEventDetailOpen(false)} className="rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
