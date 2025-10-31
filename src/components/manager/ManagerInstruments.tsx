import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Wrench,
  Search,
  Eye,
  Settings,
  CheckCircle2,
  X,
  AlertTriangle,
  Clock,
  Beaker,
  Package,
  Activity,
  TrendingUp,
  TrendingDown,
  FlaskConical,
  Edit,
  Trash2,
  Plus,
  Download,
  ClipboardList,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import {
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

type MainTab = "overview" | "test-flow" | "reagents" | "config" | "audit";
type ReagentsTab = "install" | "modify" | "delete" | "inventory";

type InstrumentMode = "Ready" | "Maintenance" | "Calibration" | "Inactive";

interface Instrument {
  id: string;
  name: string;
  type: string;
  mode: InstrumentMode;
  status: "Online" | "Offline" | "Error";
  operator: string;
  location: string;
  lastUpdated: string;
  serialNumber: string;
  model: string;
}

interface Reagent {
  id: string;
  name: string;
  lotNumber: string;
  quantity: number;
  expirationDate: string;
  status: "In Use" | "Not In Use" | "Expired";
  vendorName: string;
  vendorContact: string;
}

interface AuditLog {
  id: string;
  action: string;
  module: string;
  user: string;
  timestamp: string;
  details: string;
  result: "Success" | "Failed";
}

interface Configuration {
  id: string;
  instrumentId: string;
  instrumentName: string;
  configType: "General" | "Specific";
  version: string;
  lastUpdated: string;
  parameters: string;
}

const mockInstruments: Instrument[] = [
  {
    id: "INS-001",
    name: "Hematology Analyzer XN-1000",
    type: "Hematology",
    mode: "Ready",
    status: "Online",
    operator: "labuser1@lab.com",
    location: "Lab Room 1",
    lastUpdated: "2025-10-21 14:30:00",
    serialNumber: "XN1000-2024-001",
    model: "XN-1000",
  },
  {
    id: "INS-002",
    name: "Chemistry Analyzer AU-5800",
    type: "Chemistry",
    mode: "Maintenance",
    status: "Offline",
    operator: "labuser2@lab.com",
    location: "Lab Room 2",
    lastUpdated: "2025-10-21 13:15:00",
    serialNumber: "AU5800-2024-002",
    model: "AU-5800",
  },
  {
    id: "INS-003",
    name: "Immunoassay Analyzer DXI-800",
    type: "Immunology",
    mode: "Ready",
    status: "Online",
    operator: "labuser3@lab.com",
    location: "Lab Room 3",
    lastUpdated: "2025-10-21 14:25:00",
    serialNumber: "DXI800-2024-003",
    model: "DXI-800",
  },
  {
    id: "INS-004",
    name: "Coagulation Analyzer ACL-TOP",
    type: "Coagulation",
    mode: "Ready",
    status: "Online",
    operator: "service@lab.com",
    location: "Lab Room 4",
    lastUpdated: "2025-10-21 16:20:00",
    serialNumber: "ACLTOP-2024-004",
    model: "ACL-TOP",
  },
  {
    id: "INS-005",
    name: "Urinalysis Analyzer UX-2000",
    type: "Urinalysis",
    mode: "Calibration",
    status: "Online",
    operator: "labuser4@lab.com",
    location: "Lab Room 5",
    lastUpdated: "2025-10-21 12:50:00",
    serialNumber: "UX2000-2024-005",
    model: "UX-2000",
  },
];

const mockReagents: Reagent[] = [
  {
    id: "REA-001",
    name: "CBC Reagent Kit",
    lotNumber: "LOT-2025-001",
    quantity: 450,
    expirationDate: "2025-12-31",
    status: "In Use",
    vendorName: "Sysmex Corporation",
    vendorContact: "contact@sysmex.com",
  },
  {
    id: "REA-002",
    name: "Chemistry Reagent Panel A",
    lotNumber: "LOT-2025-002",
    quantity: 180,
    expirationDate: "2025-11-30",
    status: "In Use",
    vendorName: "Beckman Coulter",
    vendorContact: "support@beckman.com",
  },
  {
    id: "REA-003",
    name: "Immunoassay Calibrator",
    lotNumber: "LOT-2025-003",
    quantity: 520,
    expirationDate: "2026-01-15",
    status: "In Use",
    vendorName: "Abbott Diagnostics",
    vendorContact: "service@abbott.com",
  },
  {
    id: "REA-004",
    name: "Coagulation QC Kit",
    lotNumber: "LOT-2024-128",
    quantity: 85,
    expirationDate: "2025-10-25",
    status: "In Use",
    vendorName: "Werfen",
    vendorContact: "info@werfen.com",
  },
  {
    id: "REA-005",
    name: "Urinalysis Strips",
    lotNumber: "LOT-2024-089",
    quantity: 30,
    expirationDate: "2025-10-20",
    status: "Expired",
    vendorName: "Siemens Healthineers",
    vendorContact: "support@siemens-healthineers.com",
  },
];

const mockAuditLogs: AuditLog[] = [
  {
    id: "AUD-001",
    action: "Change Instrument Mode",
    module: "Instrument Service",
    user: "manager@lab.com",
    timestamp: "2025-10-21 14:30:00",
    details: "XN-1000 (INS-001): Maintenance → Ready",
    result: "Success",
  },
  {
    id: "AUD-002",
    action: "Install Reagent",
    module: "Reagent Management",
    user: "labuser1@lab.com",
    timestamp: "2025-10-21 13:15:00",
    details: "CBC Reagent Kit (REA-001) installed - Qty: 450",
    result: "Success",
  },
  {
    id: "AUD-003",
    action: "Modify Reagent",
    module: "Reagent Management",
    user: "manager@lab.com",
    timestamp: "2025-10-21 12:20:00",
    details: "Chemistry Reagent Panel A (REA-002) - Quantity updated to 180",
    result: "Success",
  },
  {
    id: "AUD-004",
    action: "Delete Reagent",
    module: "Reagent Management",
    user: "manager@lab.com",
    timestamp: "2025-10-21 11:05:00",
    details: "Expired reagent removed: Urinalysis Strips (REA-005)",
    result: "Success",
  },
];

const mockConfigurations: Configuration[] = [
  {
    id: "CFG-001",
    instrumentId: "INS-001",
    instrumentName: "Hematology Analyzer XN-1000",
    configType: "General",
    version: "v2.1.3",
    lastUpdated: "2025-10-15 10:30:00",
    parameters: "Firmware: v2.1.3, Calibration: Standard, QC: Daily",
  },
  {
    id: "CFG-002",
    instrumentId: "INS-002",
    instrumentName: "Chemistry Analyzer AU-5800",
    configType: "Specific",
    version: "v3.0.1",
    lastUpdated: "2025-10-14 15:20:00",
    parameters: "Firmware: v3.0.1, Sample Volume: 150µL, Throughput: 800 tests/hr",
  },
  {
    id: "CFG-003",
    instrumentId: "INS-003",
    instrumentName: "Immunoassay Analyzer DXI-800",
    configType: "General",
    version: "v1.8.5",
    lastUpdated: "2025-10-13 09:45:00",
    parameters: "Firmware: v1.8.5, Assay Type: Chemiluminescence, Calibration: Weekly",
  },
];

export function ManagerInstruments() {
  const [mainTab, setMainTab] = useState<MainTab>("overview");
  const [reagentsTab, setReagentsTab] = useState<ReagentsTab>("install");
  
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [reagents, setReagents] = useState<Reagent[]>(mockReagents);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [configurations] = useState<Configuration[]>(mockConfigurations);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isModeChangeOpen, setIsModeChangeOpen] = useState(false);
  const [isReagentFormOpen, setIsReagentFormOpen] = useState(false);
  const [isReagentEditOpen, setIsReagentEditOpen] = useState(false);
  const [isReagentDeleteOpen, setIsReagentDeleteOpen] = useState(false);

  const [modeChangeForm, setModeChangeForm] = useState({
    instrumentId: "",
    fromMode: "",
    toMode: "",
    reason: "",
    qcPassed: false,
  });

  const [reagentForm, setReagentForm] = useState({
    name: "",
    lotNumber: "",
    quantity: 0,
    expirationDate: "",
    vendorName: "",
    vendorContact: "",
  });

  // Statistics
  const stats = {
    totalInstruments: instruments.length,
    online: instruments.filter((i) => i.status === "Online").length,
    ready: instruments.filter((i) => i.mode === "Ready").length,
    maintenance: instruments.filter((i) => i.mode === "Maintenance").length,
    totalReagents: reagents.filter((r) => r.status === "In Use").length,
    lowStock: reagents.filter((r) => r.quantity < 200).length,
  };

  // Chart Data
  const reagentChartData = reagents.map((r) => ({
    name: r.name.substring(0, 15),
    quantity: r.quantity,
    fill: r.quantity < 100 ? "#F44336" : r.quantity < 200 ? "#FFC107" : "#4CAF50",
  }));

  const testStatusData = [
    { name: "Completed", value: 156, color: "#4CAF50" },
    { name: "Running", value: 24, color: "#2196F3" },
    { name: "Failed", value: 8, color: "#F44336" },
    { name: "Pending", value: 12, color: "#FFC107" },
  ];

  // Add Audit Log
  const addAuditLog = (action: string, module: string, details: string, result: "Success" | "Failed" = "Success") => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      action,
      module,
      user: "manager@lab.com",
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      details,
      result,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // Handlers
  const handleViewDetails = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setIsDetailOpen(true);
  };

  const handleOpenModeChange = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setModeChangeForm({
      instrumentId: instrument.id,
      fromMode: instrument.mode,
      toMode: "",
      reason: "",
      qcPassed: false,
    });
    setIsModeChangeOpen(true);
  };

  const handleSubmitModeChange = () => {
    if (!modeChangeForm.toMode || !modeChangeForm.reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (modeChangeForm.toMode === "Ready" && !modeChangeForm.qcPassed) {
      toast.error("QC Check required to set Ready mode");
      return;
    }

    // Update instrument mode
    setInstruments(
      instruments.map((inst) =>
        inst.id === modeChangeForm.instrumentId
          ? {
              ...inst,
              mode: modeChangeForm.toMode as InstrumentMode,
              lastUpdated: new Date().toISOString().replace("T", " ").substring(0, 19),
            }
          : inst
      )
    );

    addAuditLog(
      "Change Instrument Mode",
      "Instrument Service",
      `${selectedInstrument?.name} (${modeChangeForm.instrumentId}): ${modeChangeForm.fromMode} → ${modeChangeForm.toMode}. Reason: ${modeChangeForm.reason}`
    );

    toast.success("Mode changed successfully!");
    setIsModeChangeOpen(false);
    setSelectedInstrument(null);
  };

  const handleInstallReagent = () => {
    if (!reagentForm.name || !reagentForm.lotNumber || !reagentForm.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newReagent: Reagent = {
      id: `REA-${String(reagents.length + 1).padStart(3, "0")}`,
      name: reagentForm.name,
      lotNumber: reagentForm.lotNumber,
      quantity: reagentForm.quantity,
      expirationDate: reagentForm.expirationDate,
      status: "In Use",
      vendorName: reagentForm.vendorName,
      vendorContact: reagentForm.vendorContact,
    };

    setReagents([newReagent, ...reagents]);
    addAuditLog(
      "Install Reagent",
      "Reagent Management",
      `${newReagent.name} (${newReagent.id}) installed - Qty: ${newReagent.quantity}`
    );

    toast.success("Reagent installed successfully!");
    setIsReagentFormOpen(false);
    setReagentForm({
      name: "",
      lotNumber: "",
      quantity: 0,
      expirationDate: "",
      vendorName: "",
      vendorContact: "",
    });
  };

  const handleModifyReagent = () => {
    if (!selectedReagent || !reagentForm.quantity) {
      toast.error("Please provide valid quantity");
      return;
    }

    setReagents(
      reagents.map((r) =>
        r.id === selectedReagent.id
          ? {
              ...r,
              quantity: reagentForm.quantity,
              expirationDate: reagentForm.expirationDate || r.expirationDate,
              vendorName: reagentForm.vendorName || r.vendorName,
              vendorContact: reagentForm.vendorContact || r.vendorContact,
            }
          : r
      )
    );

    addAuditLog(
      "Modify Reagent",
      "Reagent Management",
      `${selectedReagent.name} (${selectedReagent.id}) - Quantity updated to ${reagentForm.quantity}`
    );

    toast.success("Reagent updated successfully!");
    setIsReagentEditOpen(false);
    setSelectedReagent(null);
  };

  const handleDeleteReagent = () => {
    if (!selectedReagent) return;

    setReagents(reagents.filter((r) => r.id !== selectedReagent.id));
    addAuditLog(
      "Delete Reagent",
      "Reagent Management",
      `Reagent removed: ${selectedReagent.name} (${selectedReagent.id})`
    );

    toast.success("Reagent deleted successfully!");
    setIsReagentDeleteOpen(false);
    setSelectedReagent(null);
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "Ready":
        return "bg-green-100 text-green-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Calibration":
        return "bg-blue-100 text-blue-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online":
        return "bg-green-100 text-green-800";
      case "Offline":
        return "bg-gray-100 text-gray-800";
      case "Error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredInstruments = instruments.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inst.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReagents = reagents.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render Overview Tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-gradient-to-br from-[#E3F2FD] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">All Instruments</CardDescription>
            <CardTitle className="text-[#007BFF]">{stats.totalInstruments}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#A5D6A7] rounded-xl bg-gradient-to-br from-[#E8F5E9] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">Online</CardDescription>
            <CardTitle className="text-[#28A745]">{stats.online}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#FFE082] rounded-xl bg-gradient-to-br from-[#FFF8E1] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">Total Reagents</CardDescription>
            <CardTitle className="text-[#FFC107]">{stats.totalReagents}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#EF9A9A] rounded-xl bg-gradient-to-br from-[#FFEBEE] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">Low Stock</CardDescription>
            <CardTitle className="text-[#DC3545]">{stats.lowStock}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Status */}
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
            <CardTitle className="text-[#007BFF]">Test Status Distribution</CardTitle>
            <CardDescription>Overall test execution status</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={testStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {testStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reagent Levels */}
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
            <CardTitle className="text-[#007BFF]">Reagent Inventory Levels</CardTitle>
            <CardDescription>Current stock levels by reagent type</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={reagentChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Instrument Status Overview */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#007BFF]">Instrument Status Overview</CardTitle>
          <CardDescription>Live status of all instruments</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {instruments.map((inst) => (
              <div key={inst.id} className="flex items-center justify-between p-3 bg-[#F9FBFF] rounded-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      inst.mode === "Ready"
                        ? "bg-green-500"
                        : inst.mode === "Maintenance"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="text-sm text-[#333333]">{inst.name}</p>
                    <p className="text-xs text-[#666666]">{inst.id}</p>
                  </div>
                </div>
                <Badge variant="outline" className={getModeColor(inst.mode)}>
                  {inst.mode}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#007BFF]">Quick Actions</CardTitle>
          <CardDescription>Common management tasks</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setMainTab("test-flow")}
              className="bg-[#007BFF] hover:bg-[#0056D2] rounded-xl h-auto py-6 flex flex-col items-start gap-2"
            >
              <Settings className="h-6 w-6" />
              <div className="text-left">
                <p>Change Mode</p>
                <p className="text-xs opacity-90">Manage instrument modes</p>
              </div>
            </Button>

            <Button
              onClick={() => {
                setMainTab("reagents");
                setReagentsTab("install");
              }}
              className="bg-[#28A745] hover:bg-[#218838] rounded-xl h-auto py-6 flex flex-col items-start gap-2"
            >
              <Beaker className="h-6 w-6" />
              <div className="text-left">
                <p>Install Reagent</p>
                <p className="text-xs opacity-90">Add new reagent</p>
              </div>
            </Button>

            <Button
              onClick={() => setMainTab("audit")}
              className="bg-[#9C27B0] hover:bg-[#7B1FA2] rounded-xl h-auto py-6 flex flex-col items-start gap-2"
            >
              <ClipboardList className="h-6 w-6" />
              <div className="text-left">
                <p>View Audit Trail</p>
                <p className="text-xs opacity-90">Review activity logs</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Test Flow Tab (Change Mode Only)
  const renderTestFlow = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <CardTitle className="text-[#007BFF]">Change Instrument Mode</CardTitle>
        <CardDescription>Set operational status of instruments</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
          <Input
            placeholder="Search instruments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-[#E0E6ED]"
          />
        </div>

        {/* Instruments Table */}
        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                <TableHead className="text-[#007BFF]">Instrument ID</TableHead>
                <TableHead className="text-[#007BFF]">Name</TableHead>
                <TableHead className="text-[#007BFF]">Current Mode</TableHead>
                <TableHead className="text-[#007BFF]">Operator</TableHead>
                <TableHead className="text-[#007BFF]">Last Updated</TableHead>
                <TableHead className="text-[#007BFF] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstruments.map((instrument) => (
                <TableRow key={instrument.id} className="hover:bg-[#F9FBFF]">
                  <TableCell className="font-medium text-[#333333]">{instrument.id}</TableCell>
                  <TableCell className="text-[#666666]">{instrument.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getModeColor(instrument.mode)}>
                      {instrument.mode}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#666666]">{instrument.operator}</TableCell>
                  <TableCell className="text-[#666666]">{instrument.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(instrument)}
                      className="rounded-xl text-[#007BFF] hover:bg-[#E3F2FD]"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredInstruments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#6B7280]">
                    No instruments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  // Render Reagents Management Tab
  const renderReagents = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <CardTitle className="text-[#007BFF]">Reagents Management</CardTitle>
        <CardDescription>Manage laboratory reagents and inventory</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={reagentsTab} onValueChange={(v) => setReagentsTab(v as ReagentsTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="install">Install</TabsTrigger>
            <TabsTrigger value="modify">Modify</TabsTrigger>
            <TabsTrigger value="delete">Delete</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>

          {/* Install Tab */}
          <TabsContent value="install" className="space-y-4">
            <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#007BFF]">Reagent ID</TableHead>
                    <TableHead className="text-[#007BFF]">Name</TableHead>
                    <TableHead className="text-[#007BFF]">Lot Number</TableHead>
                    <TableHead className="text-[#007BFF]">Quantity</TableHead>
                    <TableHead className="text-[#007BFF]">Status</TableHead>
                    <TableHead className="text-[#007BFF]">Expiration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reagents
                    .filter((r) => r.status === "In Use")
                    .map((reagent) => (
                      <TableRow key={reagent.id} className="hover:bg-[#F9FBFF]">
                        <TableCell className="font-medium text-[#333333]">{reagent.id}</TableCell>
                        <TableCell className="text-[#666666]">{reagent.name}</TableCell>
                        <TableCell className="text-[#666666]">{reagent.lotNumber}</TableCell>
                        <TableCell className="text-[#666666]">{reagent.quantity}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            {reagent.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#666666]">{reagent.expirationDate}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Modify Tab */}
          <TabsContent value="modify" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Search reagents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-[#E0E6ED]"
              />
            </div>

            <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#007BFF]">Reagent ID</TableHead>
                    <TableHead className="text-[#007BFF]">Name</TableHead>
                    <TableHead className="text-[#007BFF]">Quantity</TableHead>
                    <TableHead className="text-[#007BFF]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReagents.map((reagent) => (
                    <TableRow key={reagent.id} className="hover:bg-[#F9FBFF]">
                      <TableCell className="font-medium text-[#333333]">{reagent.id}</TableCell>
                      <TableCell className="text-[#666666]">{reagent.name}</TableCell>
                      <TableCell className="text-[#666666]">{reagent.quantity}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            reagent.status === "In Use"
                              ? "bg-green-100 text-green-800"
                              : reagent.status === "Expired"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {reagent.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Delete Tab */}
          <TabsContent value="delete" className="space-y-4">
            <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#007BFF]">Reagent ID</TableHead>
                    <TableHead className="text-[#007BFF]">Name</TableHead>
                    <TableHead className="text-[#007BFF]">Lot Number</TableHead>
                    <TableHead className="text-[#007BFF]">Status</TableHead>
                    <TableHead className="text-[#007BFF]">Expiration</TableHead>
                    <TableHead className="text-[#007BFF] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reagents.map((reagent) => (
                    <TableRow key={reagent.id} className="hover:bg-[#F9FBFF]">
                      <TableCell className="font-medium text-[#333333]">{reagent.id}</TableCell>
                      <TableCell className="text-[#666666]">{reagent.name}</TableCell>
                      <TableCell className="text-[#666666]">{reagent.lotNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            reagent.status === "Expired"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {reagent.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#666666]">{reagent.expirationDate}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedReagent(reagent);
                            setIsReagentDeleteOpen(true);
                          }}
                          className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-[#E8F5E9] border-[#A5D6A7]">
                <CardContent className="pt-6">
                  <p className="text-sm text-[#666666] mb-1">Total Reagents</p>
                  <p className="text-[#28A745]">{reagents.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-[#FFE082] border-[#FFE082]">
                <CardContent className="pt-6">
                  <p className="text-sm text-[#666666] mb-1">Low Stock</p>
                  <p className="text-[#FFC107]">{stats.lowStock}</p>
                </CardContent>
              </Card>
              <Card className="bg-[#FFEBEE] border-[#EF9A9A]">
                <CardContent className="pt-6">
                  <p className="text-sm text-[#666666] mb-1">Expired</p>
                  <p className="text-red-600">
                    {reagents.filter((r) => r.status === "Expired").length}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#007BFF]">Reagent ID</TableHead>
                    <TableHead className="text-[#007BFF]">Name</TableHead>
                    <TableHead className="text-[#007BFF]">Lot Number</TableHead>
                    <TableHead className="text-[#007BFF]">Quantity</TableHead>
                    <TableHead className="text-[#007BFF]">Status</TableHead>
                    <TableHead className="text-[#007BFF]">Vendor</TableHead>
                    <TableHead className="text-[#007BFF]">Expiration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reagents.map((reagent) => (
                    <TableRow key={reagent.id} className="hover:bg-[#F9FBFF]">
                      <TableCell className="font-medium text-[#333333]">{reagent.id}</TableCell>
                      <TableCell className="text-[#666666]">{reagent.name}</TableCell>
                      <TableCell className="text-[#666666]">{reagent.lotNumber}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            reagent.quantity < 100
                              ? "bg-red-100 text-red-800"
                              : reagent.quantity < 200
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {reagent.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            reagent.status === "In Use"
                              ? "bg-green-100 text-green-800"
                              : reagent.status === "Expired"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {reagent.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#666666]">{reagent.vendorName}</TableCell>
                      <TableCell className="text-[#666666]">{reagent.expirationDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  // Render Configuration Tab
  const renderConfiguration = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <CardTitle className="text-[#007BFF]">Configuration Management</CardTitle>
        <CardDescription>View instrument configurations</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                <TableHead className="text-[#007BFF]">Config ID</TableHead>
                <TableHead className="text-[#007BFF]">Instrument</TableHead>
                <TableHead className="text-[#007BFF]">Type</TableHead>
                <TableHead className="text-[#007BFF]">Version</TableHead>
                <TableHead className="text-[#007BFF]">Parameters</TableHead>
                <TableHead className="text-[#007BFF]">Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configurations.map((config) => (
                <TableRow key={config.id} className="hover:bg-[#F9FBFF]">
                  <TableCell className="font-medium text-[#333333]">{config.id}</TableCell>
                  <TableCell className="text-[#666666]">{config.instrumentName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        config.configType === "General"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }
                    >
                      {config.configType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#666666]">{config.version}</TableCell>
                  <TableCell className="text-[#666666] text-sm">{config.parameters}</TableCell>
                  <TableCell className="text-[#666666]">{config.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  // Render Audit Trail Tab
  const renderAuditTrail = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <CardTitle className="text-[#007BFF]">Audit Trail</CardTitle>
        <CardDescription>Complete activity log for all operations</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                <TableHead className="text-[#007BFF]">Log ID</TableHead>
                <TableHead className="text-[#007BFF]">Action</TableHead>
                <TableHead className="text-[#007BFF]">Module</TableHead>
                <TableHead className="text-[#007BFF]">User</TableHead>
                <TableHead className="text-[#007BFF]">Details</TableHead>
                <TableHead className="text-[#007BFF]">Timestamp</TableHead>
                <TableHead className="text-[#007BFF]">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-[#F9FBFF]">
                  <TableCell className="font-medium text-[#333333]">{log.id}</TableCell>
                  <TableCell className="text-[#666666]">{log.action}</TableCell>
                  <TableCell className="text-[#666666]">{log.module}</TableCell>
                  <TableCell className="text-[#666666]">{log.user}</TableCell>
                  <TableCell className="text-[#666666] text-sm">{log.details}</TableCell>
                  <TableCell className="text-[#666666]">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        log.result === "Success"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {log.result}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#007BFF] mb-2">Instrument Service Dashboard</h1>
        <p className="text-[#6B7280]">
          Complete visibility and control over laboratory instruments, reagents, and configurations
        </p>
      </div>

      {/* Main Tabs */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <Tabs value={mainTab} onValueChange={(v) => setMainTab(v as MainTab)} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="overview" className="rounded-xl">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="test-flow" className="rounded-xl">
                <FlaskConical className="h-4 w-4 mr-2" />
                Instrument Test Flow
              </TabsTrigger>
              <TabsTrigger value="reagents" className="rounded-xl">
                <Beaker className="h-4 w-4 mr-2" />
                Reagents Management
              </TabsTrigger>
              <TabsTrigger value="config" className="rounded-xl">
                <Settings className="h-4 w-4 mr-2" />
                Configuration Management
              </TabsTrigger>
              <TabsTrigger value="audit" className="rounded-xl">
                <ClipboardList className="h-4 w-4 mr-2" />
                Audit Trail
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">{renderOverview()}</TabsContent>
            <TabsContent value="test-flow">{renderTestFlow()}</TabsContent>
            <TabsContent value="reagents">{renderReagents()}</TabsContent>
            <TabsContent value="config">{renderConfiguration()}</TabsContent>
            <TabsContent value="audit">{renderAuditTrail()}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialogs */}
      {/* Instrument Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-white rounded-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#007BFF]">Instrument Details</DialogTitle>
            <DialogDescription>Complete instrument information</DialogDescription>
          </DialogHeader>

          {selectedInstrument && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#999999]">Instrument ID</p>
                  <p className="text-sm text-[#333333]">{selectedInstrument.id}</p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Serial Number</p>
                  <p className="text-sm text-[#333333]">{selectedInstrument.serialNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Name</p>
                  <p className="text-sm text-[#333333]">{selectedInstrument.name}</p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Type</p>
                  <p className="text-sm text-[#333333]">{selectedInstrument.type}</p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Current Mode</p>
                  <Badge variant="outline" className={getModeColor(selectedInstrument.mode)}>
                    {selectedInstrument.mode}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Status</p>
                  <Badge variant="outline" className={getStatusColor(selectedInstrument.status)}>
                    {selectedInstrument.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Operator</p>
                  <p className="text-sm text-[#333333]">{selectedInstrument.operator}</p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Location</p>
                  <p className="text-sm text-[#333333]">{selectedInstrument.location}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-[#999999]">Last Updated</p>
                  <p className="text-sm text-[#333333]">{selectedInstrument.lastUpdated}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDetailOpen(false)} className="rounded-xl">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mode Change Dialog */}
      <Dialog open={isModeChangeOpen} onOpenChange={setIsModeChangeOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#007BFF]">Change Instrument Mode</DialogTitle>
            <DialogDescription>
              Change operational mode for {selectedInstrument?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="instrumentId">Instrument ID</Label>
              <Input
                id="instrumentId"
                value={modeChangeForm.instrumentId}
                disabled
                className="rounded-xl bg-gray-100"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fromMode">Current Mode</Label>
              <Input
                id="fromMode"
                value={modeChangeForm.fromMode}
                disabled
                className="rounded-xl bg-gray-100"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="toMode">New Mode *</Label>
              <Select
                value={modeChangeForm.toMode}
                onValueChange={(value) => setModeChangeForm({ ...modeChangeForm, toMode: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select new mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Calibration">Calibration</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Change *</Label>
              <Textarea
                id="reason"
                value={modeChangeForm.reason}
                onChange={(e) => setModeChangeForm({ ...modeChangeForm, reason: e.target.value })}
                placeholder="Explain the reason for mode change..."
                rows={4}
                className="rounded-xl"
              />
            </div>

            {modeChangeForm.toMode === "Ready" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="qcPassed"
                  checked={modeChangeForm.qcPassed}
                  onCheckedChange={(checked) =>
                    setModeChangeForm({ ...modeChangeForm, qcPassed: checked as boolean })
                  }
                />
                <Label htmlFor="qcPassed" className="text-sm">
                  QC checks have passed
                </Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModeChangeOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitModeChange}
              className="bg-[#007BFF] hover:bg-[#0056D2] rounded-xl"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reagent Install Dialog */}
      <Dialog open={isReagentFormOpen} onOpenChange={setIsReagentFormOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#28A745]">Install New Reagent</DialogTitle>
            <DialogDescription>Add reagent and link to vendor information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reagentName">Reagent Name *</Label>
              <Input
                id="reagentName"
                value={reagentForm.name}
                onChange={(e) => setReagentForm({ ...reagentForm, name: e.target.value })}
                placeholder="e.g., CBC Reagent Kit"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lotNumber">Lot Number *</Label>
              <Input
                id="lotNumber"
                value={reagentForm.lotNumber}
                onChange={(e) => setReagentForm({ ...reagentForm, lotNumber: e.target.value })}
                placeholder="e.g., LOT-2025-001"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={reagentForm.quantity || ""}
                onChange={(e) =>
                  setReagentForm({ ...reagentForm, quantity: parseInt(e.target.value) || 0 })
                }
                placeholder="e.g., 500"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expirationDate">Expiration Date *</Label>
              <Input
                id="expirationDate"
                type="date"
                value={reagentForm.expirationDate}
                onChange={(e) =>
                  setReagentForm({ ...reagentForm, expirationDate: e.target.value })
                }
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="vendorName">Vendor Name</Label>
              <Input
                id="vendorName"
                value={reagentForm.vendorName}
                onChange={(e) => setReagentForm({ ...reagentForm, vendorName: e.target.value })}
                placeholder="e.g., Sysmex Corporation"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="vendorContact">Vendor Contact</Label>
              <Input
                id="vendorContact"
                value={reagentForm.vendorContact}
                onChange={(e) =>
                  setReagentForm({ ...reagentForm, vendorContact: e.target.value })
                }
                placeholder="e.g., contact@sysmex.com"
                className="rounded-xl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReagentFormOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInstallReagent}
              className="bg-[#28A745] hover:bg-[#218838] rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Install Reagent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reagent Edit Dialog */}
      <Dialog open={isReagentEditOpen} onOpenChange={setIsReagentEditOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#FFC107]">Modify Reagent</DialogTitle>
            <DialogDescription>Update reagent information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editQuantity">Quantity *</Label>
              <Input
                id="editQuantity"
                type="number"
                value={reagentForm.quantity || ""}
                onChange={(e) =>
                  setReagentForm({ ...reagentForm, quantity: parseInt(e.target.value) || 0 })
                }
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editExpiration">Expiration Date</Label>
              <Input
                id="editExpiration"
                type="date"
                value={reagentForm.expirationDate}
                onChange={(e) =>
                  setReagentForm({ ...reagentForm, expirationDate: e.target.value })
                }
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editVendorName">Vendor Name</Label>
              <Input
                id="editVendorName"
                value={reagentForm.vendorName}
                onChange={(e) => setReagentForm({ ...reagentForm, vendorName: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editVendorContact">Vendor Contact</Label>
              <Input
                id="editVendorContact"
                value={reagentForm.vendorContact}
                onChange={(e) =>
                  setReagentForm({ ...reagentForm, vendorContact: e.target.value })
                }
                className="rounded-xl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReagentEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleModifyReagent}
              className="bg-[#FFC107] hover:bg-[#F57C00] rounded-xl"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Reagent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reagent Delete Dialog */}
      <AlertDialog open={isReagentDeleteOpen} onOpenChange={setIsReagentDeleteOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Reagent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reagent?
              <br />
              <br />
              <strong>Reagent ID:</strong> {selectedReagent?.id}
              <br />
              <strong>Name:</strong> {selectedReagent?.name}
              <br />
              <strong>Lot Number:</strong> {selectedReagent?.lotNumber}
              <br />
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReagent}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
