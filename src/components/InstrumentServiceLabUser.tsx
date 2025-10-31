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
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import {
  Activity,
  AlertTriangle,
  Beaker,
  CheckCircle2,
  Clock,
  Database,
  Download,
  Edit,
  FileText,
  Filter,
  FlaskConical,
  Loader2,
  PlayCircle,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  Wrench,
  Zap,
  BarChart3,
  Calendar,
  Eye,
  XCircle,
  Send,
  Package,
  ClipboardList,
  Server
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

type MainTab = "overview" | "test-flow" | "reagents" | "config" | "audit";
type TestFlowTab = "mode-change" | "blood-analysis" | "hl7-publish" | "sync-results" | "manual-delete" | "auto-delete";
type ReagentsTab = "install" | "modify" | "delete" | "inventory";

type InstrumentMode = "Ready" | "Maintenance" | "Inactive";
type InstrumentStatus = "Ready" | "Maintenance" | "Inactive";
type TestStatus = "Running" | "Completed" | "Failed" | "Pending";
type HL7Status = "Published" | "Failed" | "Pending";
type SyncStatus = "Completed" | "Missing Results" | "Pending";
type ReagentStatus = "In Use" | "Not In Use" | "Expired";

interface Instrument {
  id: string;
  name: string;
  mode: InstrumentMode;
  operator: string;
  lastUpdated: string;
  model: string;
  serialNumber: string;
}

interface BloodTest {
  id: string;
  testOrderId: string;
  barcode: string;
  instrumentId: string;
  status: TestStatus;
  startTime: string;
  endTime?: string;
  resultId?: string;
  progress: number;
}

interface HL7Message {
  id: string;
  testOrderId: string;
  status: HL7Status;
  destination: string;
  timestamp: string;
  rawMessage?: string;
  errorMessage?: string;
}

interface SyncLog {
  id: string;
  testOrderIds: string[];
  status: SyncStatus;
  duration: string;
  operator: string;
  timestamp: string;
}

interface RawResult {
  id: string;
  testOrderId: string;
  barcode: string;
  createdOn: string;
  status: "Sent" | "Stored";
  size: string;
}

interface Reagent {
  id: string;
  name: string;
  lotNumber: string;
  quantity: number;
  expirationDate: string;
  vendorName: string;
  vendorContact: string;
  status: ReagentStatus;
  installedBy: string;
  installedDate: string;
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

// Mock Data - Lab User scoped
const mockInstruments: Instrument[] = [
  {
    id: "INS-001",
    name: "Hematology Analyzer XN-1000",
    mode: "Ready",
    operator: "labuser01@lab.com",
    lastUpdated: "2025-10-17 14:30:00",
    model: "XN-1000",
    serialNumber: "SN-2024-0001"
  },
  {
    id: "INS-002",
    name: "Chemistry Analyzer AU-5800",
    mode: "Maintenance",
    operator: "labuser02@lab.com",
    lastUpdated: "2025-10-17 10:15:00",
    model: "AU-5800",
    serialNumber: "SN-2024-0002"
  },
  {
    id: "INS-003",
    name: "Immunology Analyzer DxI-800",
    mode: "Ready",
    operator: "labuser03@lab.com",
    lastUpdated: "2025-10-17 13:45:00",
    model: "DxI-800",
    serialNumber: "SN-2024-0003"
  },
  {
    id: "INS-005",
    name: "Urinalysis Analyzer UA-6600",
    mode: "Ready",
    operator: "labuser01@lab.com",
    lastUpdated: "2025-10-17 12:00:00",
    model: "UA-6600",
    serialNumber: "SN-2024-0005"
  }
];

const mockBloodTests: BloodTest[] = [
  {
    id: "TEST-001",
    testOrderId: "TO-2025-10-17-001",
    barcode: "BC-20251017-001",
    instrumentId: "INS-001",
    status: "Running",
    startTime: "2025-10-17 14:30:00",
    progress: 65
  },
  {
    id: "TEST-002",
    testOrderId: "TO-2025-10-17-002",
    barcode: "BC-20251017-002",
    instrumentId: "INS-003",
    status: "Running",
    startTime: "2025-10-17 14:45:00",
    progress: 40
  },
  {
    id: "TEST-003",
    testOrderId: "TO-2025-10-17-003",
    barcode: "BC-20251017-003",
    instrumentId: "INS-001",
    status: "Completed",
    startTime: "2025-10-17 13:00:00",
    endTime: "2025-10-17 13:25:00",
    resultId: "RES-2025-10-17-003"
  }
];

const mockHL7Messages: HL7Message[] = [
  {
    id: "HL7-001",
    testOrderId: "TO-2025-10-17-003",
    status: "Published",
    destination: "Test Order Service",
    timestamp: "2025-10-17 13:26:00"
  },
  {
    id: "HL7-002",
    testOrderId: "TO-2025-10-16-045",
    status: "Published",
    destination: "Monitoring Service",
    timestamp: "2025-10-16 18:30:00"
  },
  {
    id: "HL7-003",
    testOrderId: "TO-2025-10-16-046",
    status: "Failed",
    destination: "Test Order Service",
    timestamp: "2025-10-16 19:15:00",
    errorMessage: "Connection timeout"
  }
];

const mockSyncLogs: SyncLog[] = [
  {
    id: "SYNC-001",
    testOrderIds: ["TO-2025-10-17-001", "TO-2025-10-17-002"],
    status: "Completed",
    duration: "45s",
    operator: "labuser01@lab.com",
    timestamp: "2025-10-17 14:00:00"
  },
  {
    id: "SYNC-002",
    testOrderIds: ["TO-2025-10-16-050"],
    status: "Missing Results",
    duration: "30s",
    operator: "labuser02@lab.com",
    timestamp: "2025-10-16 20:15:00"
  }
];

const mockRawResults: RawResult[] = [
  {
    id: "RAW-001",
    testOrderId: "TO-2025-10-15-023",
    barcode: "BC-20251015-023",
    createdOn: "2025-10-15 16:30:00",
    status: "Sent",
    size: "2.4 MB"
  },
  {
    id: "RAW-002",
    testOrderId: "TO-2025-10-14-089",
    barcode: "BC-20251014-089",
    createdOn: "2025-10-14 10:15:00",
    status: "Stored",
    size: "1.8 MB"
  }
];

const mockReagents: Reagent[] = [
  {
    id: "REG-001",
    name: "CBC Reagent Kit",
    lotNumber: "LOT-2025-001",
    quantity: 450,
    expirationDate: "2026-03-15",
    vendorName: "BioSupply Co.",
    vendorContact: "+1-555-0123",
    status: "In Use",
    installedBy: "labuser01@lab.com",
    installedDate: "2025-10-01"
  },
  {
    id: "REG-002",
    name: "Chemistry Panel Solution",
    lotNumber: "LOT-2025-002",
    quantity: 320,
    expirationDate: "2026-04-20",
    vendorName: "MedChem Solutions",
    vendorContact: "+1-555-0124",
    status: "In Use",
    installedBy: "labuser02@lab.com",
    installedDate: "2025-09-28"
  },
  {
    id: "REG-003",
    name: "Immunoassay Reagent",
    lotNumber: "LOT-2025-003",
    quantity: 180,
    expirationDate: "2026-02-10",
    vendorName: "ImmunoTech Ltd.",
    vendorContact: "+1-555-0125",
    status: "Not In Use",
    installedBy: "labuser03@lab.com",
    installedDate: "2025-09-15"
  },
  {
    id: "REG-004",
    name: "Coagulation Test Reagent",
    lotNumber: "LOT-2024-050",
    quantity: 85,
    expirationDate: "2025-11-30",
    vendorName: "CoagTest Inc.",
    vendorContact: "+1-555-0126",
    status: "Expired",
    installedBy: "labuser02@lab.com",
    installedDate: "2024-12-01"
  },
  {
    id: "REG-005",
    name: "Urinalysis Test Strips",
    lotNumber: "LOT-2025-005",
    quantity: 420,
    expirationDate: "2026-06-25",
    vendorName: "UroMed Supplies",
    vendorContact: "+1-555-0127",
    status: "In Use",
    installedBy: "labuser01@lab.com",
    installedDate: "2025-10-05"
  }
];

const mockAuditLogs: AuditLog[] = [
  {
    id: "AUD-001",
    action: "Change Instrument Mode",
    module: "Instrument Service",
    user: "labuser02@lab.com",
    timestamp: "2025-10-17 10:15:00",
    details: "Chemistry Analyzer AU-5800 (INS-002): Ready → Maintenance. Reason: Scheduled calibration required",
    result: "Success"
  },
  {
    id: "AUD-002",
    action: "Install Reagent",
    module: "Reagents Management",
    user: "labuser01@lab.com",
    timestamp: "2025-10-17 08:30:00",
    details: "CBC Reagent Kit (LOT-2025-001) installed. Qty: 500",
    result: "Success"
  },
  {
    id: "AUD-003",
    action: "Start Blood Analysis",
    module: "Instrument Service",
    user: "labuser01@lab.com",
    timestamp: "2025-10-17 09:30:00",
    details: "Test TEST-001 started on Hematology Analyzer XN-1000. Barcode: BC-20251017-001",
    result: "Success"
  }
];

export function InstrumentServiceLabUser() {
  const { user } = useAuth();
  const [mainTab, setMainTab] = useState<MainTab>("overview");
  const [testFlowTab, setTestFlowTab] = useState<TestFlowTab>("mode-change");
  const [reagentsTab, setReagentsTab] = useState<ReagentsTab>("install");

  // State Management
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [reagents, setReagents] = useState<Reagent[]>(mockReagents);
  const [bloodTests, setBloodTests] = useState<BloodTest[]>(mockBloodTests);
  const [hl7Messages, setHL7Messages] = useState<HL7Message[]>(mockHL7Messages);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>(mockSyncLogs);
  const [rawResults, setRawResults] = useState<RawResult[]>(mockRawResults);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Dialog States
  const [isModeChangeOpen, setIsModeChangeOpen] = useState(false);
  const [isBloodTestOpen, setIsBloodTestOpen] = useState(false);
  const [isHL7DetailOpen, setIsHL7DetailOpen] = useState(false);
  const [isDeleteRawOpen, setIsDeleteRawOpen] = useState(false);
  const [isReagentFormOpen, setIsReagentFormOpen] = useState(false);
  const [isReagentDeleteOpen, setIsReagentDeleteOpen] = useState(false);
  const [isConfigSyncOpen, setIsConfigSyncOpen] = useState(false);
  const [isSyncResultOpen, setIsSyncResultOpen] = useState(false);
  const [syncResult, setSyncResult] = useState({
    instrument: "",
    generalConfig: "OK",
    specificConfig: "OK",
    performedBy: "",
    date: ""
  });

  // Selected Items
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [selectedHL7, setSelectedHL7] = useState<HL7Message | null>(null);
  const [selectedRawResult, setSelectedRawResult] = useState<RawResult | null>(null);
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);

  // Form States
  const [modeChangeForm, setModeChangeForm] = useState({
    newMode: "Ready" as InstrumentMode,
    reason: "",
    qcPassed: false
  });

  const [bloodTestForm, setBloodTestForm] = useState({
    testOrderId: "",
    barcode: "",
    instrumentId: "",
    runType: "single" as "single" | "batch"
  });

  const [reagentForm, setReagentForm] = useState({
    name: "",
    lotNumber: "",
    quantity: 0,
    expirationDate: "",
    vendorName: "",
    vendorContact: ""
  });

  const [configSyncForm, setConfigSyncForm] = useState({
    instrumentId: "",
    configType: "General" as "General" | "Specific"
  });

  // Statistics
  const readyInstruments = instruments.filter(i => i.mode === "Ready").length;
  const maintenanceInstruments = instruments.filter(i => i.mode === "Maintenance").length;
  const runningTests = bloodTests.filter(t => t.status === "Running").length;
  const completedTests = bloodTests.filter(t => t.status === "Completed").length;

  // Chart Data
  const modeDistributionData = [
    { name: "Ready", value: instruments.filter(i => i.mode === "Ready").length, color: "#4CAF50" },
    { name: "Maintenance", value: instruments.filter(i => i.mode === "Maintenance").length, color: "#FF9800" },
    { name: "Inactive", value: instruments.filter(i => i.mode === "Inactive").length, color: "#9E9E9E" }
  ];

  const testActivityData = [
    { day: "Mon", tests: 45 },
    { day: "Tue", tests: 52 },
    { day: "Wed", tests: 48 },
    { day: "Thu", tests: 61 },
    { day: "Fri", tests: 55 },
    { day: "Sat", tests: 38 },
    { day: "Sun", tests: 28 }
  ];

  // Handlers
  const handleModeChange = () => {
    if (!selectedInstrument) return;

    if (
      (modeChangeForm.newMode === "Maintenance" || modeChangeForm.newMode === "Inactive") &&
      !modeChangeForm.reason.trim()
    ) {
      toast.error("Please provide a reason for this change");
      return;
    }

    if (modeChangeForm.newMode === "Ready" && !modeChangeForm.qcPassed) {
      toast.error("Please confirm QC checks have passed");
      return;
    }

    setInstruments(
      instruments.map(inst =>
        inst.id === selectedInstrument.id
          ? { ...inst, mode: modeChangeForm.newMode, lastUpdated: new Date().toLocaleString(), operator: user?.email || "Unknown" }
          : inst
      )
    );

    toast.success(`Instrument mode changed to ${modeChangeForm.newMode}`);
    setIsModeChangeOpen(false);
    setModeChangeForm({ newMode: "Ready", reason: "", qcPassed: false });
  };

  const handleStartBloodTest = () => {
    if (!bloodTestForm.barcode || !bloodTestForm.instrumentId) {
      toast.error("Please fill in required fields");
      return;
    }

    const newTest: BloodTest = {
      id: `TEST-${Date.now()}`,
      testOrderId: bloodTestForm.testOrderId || `TO-${Date.now()}`,
      barcode: bloodTestForm.barcode,
      instrumentId: bloodTestForm.instrumentId,
      status: "Running",
      startTime: new Date().toLocaleString(),
      progress: 0
    };

    setBloodTests([newTest, ...bloodTests]);
    toast.success("Blood sample analysis started");
    setIsBloodTestOpen(false);
    setBloodTestForm({ testOrderId: "", barcode: "", instrumentId: "", runType: "single" });
  };

  const handlePublishHL7 = (destination: string) => {
    const completedTest = bloodTests.find(t => t.status === "Completed");
    if (!completedTest) {
      toast.error("No completed tests to publish");
      return;
    }

    const newMessage: HL7Message = {
      id: `HL7-${Date.now()}`,
      testOrderId: completedTest.testOrderId,
      status: "Published",
      destination,
      timestamp: new Date().toLocaleString()
    };

    setHL7Messages([newMessage, ...hl7Messages]);
    toast.success(`HL7 message published to ${destination}`);
  };

  const handleSyncResults = () => {
    const testIds = bloodTests.filter(t => t.status === "Completed").map(t => t.testOrderId);
    
    const newLog: SyncLog = {
      id: `SYNC-${Date.now()}`,
      testOrderIds: testIds,
      status: "Completed",
      duration: "32s",
      operator: user?.email || "Unknown",
      timestamp: new Date().toLocaleString()
    };

    setSyncLogs([newLog, ...syncLogs]);
    toast.success("Results synchronized successfully");
  };

  const handleDeleteRawResult = () => {
    if (!selectedRawResult) return;

    setRawResults(rawResults.filter(r => r.id !== selectedRawResult.id));
    toast.success("Raw result deleted successfully");
    setIsDeleteRawOpen(false);
    setSelectedRawResult(null);
  };

  const handleInstallReagent = () => {
    if (!reagentForm.name || !reagentForm.lotNumber || reagentForm.quantity <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newReagent: Reagent = {
      id: `REG-${Date.now()}`,
      name: reagentForm.name,
      lotNumber: reagentForm.lotNumber,
      quantity: reagentForm.quantity,
      expirationDate: reagentForm.expirationDate,
      vendorName: reagentForm.vendorName,
      vendorContact: reagentForm.vendorContact,
      status: "In Use",
      installedBy: user?.email || "Unknown",
      installedDate: new Date().toLocaleDateString()
    };

    setReagents([newReagent, ...reagents]);
    toast.success("Reagent installed successfully");
    setIsReagentFormOpen(false);
    setReagentForm({ name: "", lotNumber: "", quantity: 0, expirationDate: "", vendorName: "", vendorContact: "" });
  };

  const handleModifyReagentStatus = (reagent: Reagent, newStatus: ReagentStatus) => {
    setReagents(
      reagents.map(r => (r.id === reagent.id ? { ...r, status: newStatus } : r))
    );
    toast.success(`Reagent status updated to ${newStatus}`);
  };

  const handleDeleteReagent = () => {
    if (!selectedReagent) return;

    setReagents(reagents.filter(r => r.id !== selectedReagent.id));
    toast.success("Reagent deleted successfully");
    setIsReagentDeleteOpen(false);
    setSelectedReagent(null);
  };

  const handleConfigSync = () => {
    if (!configSyncForm.instrumentId) {
      toast.error("Please select an instrument");
      return;
    }

    const selectedInst = instruments.find(i => i.id === configSyncForm.instrumentId);
    
    // Simulate sync process
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    setSyncResult({
      instrument: selectedInst?.name || "Unknown",
      generalConfig: configSyncForm.configType === "General" || configSyncForm.configType === "Specific" ? "OK" : "Skipped",
      specificConfig: configSyncForm.configType === "Specific" || configSyncForm.configType === "General" ? "OK" : "Skipped",
      performedBy: user?.email || "labuser01@lab.com",
      date: formattedDate
    });

    toast.success(`${configSyncForm.configType} configuration synced successfully`);
    setIsConfigSyncOpen(false);
    setIsSyncResultOpen(true);
    setConfigSyncForm({ instrumentId: "", configType: "General" });
  };

  // Render Overview
  const renderOverview = () => (
    <div className="space-y-6 mt-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-gradient-to-br from-[#E3F2FD] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Total Instruments</CardDescription>
            <CardTitle className="text-[#1E88E5]">{instruments.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-[#666666]">
              <Activity className="h-4 w-4 mr-2 text-[#1E88E5]" />
              <span>{readyInstruments} Ready</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-[#A5D6A7] rounded-xl bg-gradient-to-br from-[#E8F5E9] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Running Tests</CardDescription>
            <CardTitle className="text-[#4CAF50]">{runningTests}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-[#666666]">
              <FlaskConical className="h-4 w-4 mr-2 text-[#4CAF50]" />
              <span>{completedTests} Completed Today</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-[#FFE082] rounded-xl bg-gradient-to-br from-[#FFF8E1] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Maintenance</CardDescription>
            <CardTitle className="text-[#FF9800]">{maintenanceInstruments}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-[#666666]">
              <Wrench className="h-4 w-4 mr-2 text-[#FF9800]" />
              <span>Instruments Offline</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-[#A5D6A7] rounded-xl bg-gradient-to-br from-[#E8F5E9] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Reagents Stock</CardDescription>
            <CardTitle className="text-[#4CAF50]">{reagents.filter(r => r.status === "In Use").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-[#666666]">
              <Beaker className="h-4 w-4 mr-2 text-[#4CAF50]" />
              <span>Active Reagents</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Instrument Mode Distribution */}
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
            <CardTitle className="text-[#1E88E5]">Instrument Status Distribution</CardTitle>
            <CardDescription>Current operational modes</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={modeDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {modeDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Test Activity Chart */}
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
            <CardTitle className="text-[#1E88E5]">Weekly Test Activity</CardTitle>
            <CardDescription>Tests performed per day</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={testActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="day" stroke="#666666" />
                <YAxis stroke="#666666" />
                <Tooltip />
                <Bar dataKey="tests" fill="#1E88E5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1E88E5]">Recent Activity</CardTitle>
          <CardDescription>Latest operations in your laboratory</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start space-x-3 p-3 bg-[#F5F5F5] rounded-xl">
                <div className={`p-2 rounded-lg ${log.result === "Success" ? "bg-green-100" : "bg-red-100"}`}>
                  {log.result === "Success" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#333333]">{log.action}</p>
                  <p className="text-xs text-[#666666] mt-1">{log.details}</p>
                  <p className="text-xs text-[#999999] mt-1">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Test Flow
  const renderTestFlow = () => (
    <div className="space-y-6 mt-6">
      {/* Test Flow Subtabs */}
      <Card className="shadow-md border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={testFlowTab === "mode-change" ? "default" : "outline"}
              onClick={() => setTestFlowTab("mode-change")}
              className={`rounded-xl ${
                testFlowTab === "mode-change"
                  ? "bg-[#1E88E5] hover:bg-[#1976D2] text-white"
                  : "border-[#BBDEFB] text-[#1E88E5] hover:bg-[#E3F2FD]"
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Change Mode
            </Button>

            <Button
              variant={testFlowTab === "blood-analysis" ? "default" : "outline"}
              onClick={() => setTestFlowTab("blood-analysis")}
              className={`rounded-xl ${
                testFlowTab === "blood-analysis"
                  ? "bg-[#1E88E5] hover:bg-[#1976D2] text-white"
                  : "border-[#BBDEFB] text-[#1E88E5] hover:bg-[#E3F2FD]"
              }`}
            >
              <FlaskConical className="h-4 w-4 mr-2" />
              Blood Analysis
            </Button>

            <Button
              variant={testFlowTab === "hl7-publish" ? "default" : "outline"}
              onClick={() => setTestFlowTab("hl7-publish")}
              className={`rounded-xl ${
                testFlowTab === "hl7-publish"
                  ? "bg-[#1E88E5] hover:bg-[#1976D2] text-white"
                  : "border-[#BBDEFB] text-[#1E88E5] hover:bg-[#E3F2FD]"
              }`}
            >
              <Send className="h-4 w-4 mr-2" />
              HL7 Publishing
            </Button>

            <Button
              variant={testFlowTab === "sync-results" ? "default" : "outline"}
              onClick={() => setTestFlowTab("sync-results")}
              className={`rounded-xl ${
                testFlowTab === "sync-results"
                  ? "bg-[#1E88E5] hover:bg-[#1976D2] text-white"
                  : "border-[#BBDEFB] text-[#1E88E5] hover:bg-[#E3F2FD]"
              }`}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Results
            </Button>

            <Button
              variant={testFlowTab === "manual-delete" ? "default" : "outline"}
              onClick={() => setTestFlowTab("manual-delete")}
              className={`rounded-xl ${
                testFlowTab === "manual-delete"
                  ? "bg-[#1E88E5] hover:bg-[#1976D2] text-white"
                  : "border-[#BBDEFB] text-[#1E88E5] hover:bg-[#E3F2FD]"
              }`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Manual Delete
            </Button>

            <Button
              variant={testFlowTab === "auto-delete" ? "default" : "outline"}
              onClick={() => setTestFlowTab("auto-delete")}
              className={`rounded-xl ${
                testFlowTab === "auto-delete"
                  ? "bg-[#1E88E5] hover:bg-[#1976D2] text-white"
                  : "border-[#BBDEFB] text-[#1E88E5] hover:bg-[#E3F2FD]"
              }`}
            >
              <Database className="h-4 w-4 mr-2" />
              Auto Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Content Based on Subtab */}
      {testFlowTab === "mode-change" && renderModeChange()}
      {testFlowTab === "blood-analysis" && renderBloodAnalysis()}
      {testFlowTab === "hl7-publish" && renderHL7Publishing()}
      {testFlowTab === "sync-results" && renderSyncResults()}
      {testFlowTab === "manual-delete" && renderManualDelete()}
      {testFlowTab === "auto-delete" && renderAutoDelete()}
    </div>
  );

  // Render Mode Change
  const renderModeChange = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <CardTitle className="text-[#1E88E5]">Change Instrument Mode</CardTitle>
        <CardDescription>Set operational status of instruments in your laboratory</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filterMode === "all" ? "default" : "outline"}
            onClick={() => setFilterMode("all")}
            className={`rounded-xl ${
              filterMode === "all" ? "bg-[#1E88E5] hover:bg-[#1976D2]" : "border-[#BBDEFB] text-[#1E88E5] hover:bg-[#E3F2FD]"
            }`}
          >
            All Instruments
          </Button>
          <Button
            variant={filterMode === "Ready" ? "default" : "outline"}
            onClick={() => setFilterMode("Ready")}
            className={`rounded-xl ${
              filterMode === "Ready" ? "bg-[#4CAF50] hover:bg-[#388E3C]" : "border-[#A5D6A7] text-[#4CAF50] hover:bg-[#E8F5E9]"
            }`}
          >
            Ready
          </Button>
          <Button
            variant={filterMode === "Maintenance" ? "default" : "outline"}
            onClick={() => setFilterMode("Maintenance")}
            className={`rounded-xl ${
              filterMode === "Maintenance"
                ? "bg-[#FF9800] hover:bg-[#F57C00]"
                : "border-[#FFE082] text-[#FF9800] hover:bg-[#FFF8E1]"
            }`}
          >
            Maintenance
          </Button>
          <Button
            variant={filterMode === "Inactive" ? "default" : "outline"}
            onClick={() => setFilterMode("Inactive")}
            className={`rounded-xl ${
              filterMode === "Inactive"
                ? "bg-[#9E9E9E] hover:bg-[#757575]"
                : "border-[#E0E0E0] text-[#9E9E9E] hover:bg-[#F5F5F5]"
            }`}
          >
            Inactive
          </Button>
        </div>

        {/* Instruments Table */}
        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                <TableHead className="text-[#1E88E5]">Instrument ID</TableHead>
                <TableHead className="text-[#1E88E5]">Name</TableHead>
                <TableHead className="text-[#1E88E5]">Current Mode</TableHead>
                <TableHead className="text-[#1E88E5]">Operator</TableHead>
                <TableHead className="text-[#1E88E5]">Last Updated</TableHead>
                <TableHead className="text-[#1E88E5] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instruments
                .filter(inst => filterMode === "all" || inst.mode === filterMode)
                .map((inst) => (
                  <TableRow key={inst.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">{inst.id}</TableCell>
                    <TableCell className="text-[#666666]">{inst.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          inst.mode === "Ready"
                            ? "bg-green-100 text-green-800"
                            : inst.mode === "Maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {inst.mode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{inst.operator}</TableCell>
                    <TableCell className="text-[#666666]">{inst.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedInstrument(inst);
                          setModeChangeForm({ newMode: inst.mode, reason: "", qcPassed: false });
                          setIsModeChangeOpen(true);
                        }}
                        className="rounded-xl border-[#1E88E5] text-[#1E88E5] hover:bg-[#E3F2FD]"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Change Mode
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  // Render Blood Analysis
  const renderBloodAnalysis = () => (
    <div className="space-y-6">
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1E88E5]">Blood Sample Analysis</CardTitle>
              <CardDescription>Execute and monitor blood testing workflows</CardDescription>
            </div>
            <Button
              onClick={() => setIsBloodTestOpen(true)}
              className="bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Start New Analysis
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Running Tests */}
          {bloodTests.filter(t => t.status === "Running").length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#333333] mb-3">🔄 Tests in Progress</h3>
              <div className="space-y-3">
                {bloodTests
                  .filter(t => t.status === "Running")
                  .map(test => (
                    <Card key={test.id} className="bg-[#E3F2FD] border-[#90CAF9]">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-sm font-medium text-[#1E88E5]">
                              {test.testOrderId}
                            </p>
                            <p className="text-xs text-[#666666]">
                              Barcode: {test.barcode} | Started: {test.startTime}
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Running</Badge>
                        </div>
                        <Progress value={test.progress} className="h-2" />
                        <p className="text-xs text-[#666666] mt-2">{test.progress}% Complete</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Completed Tests */}
          <div>
            <h3 className="text-sm font-medium text-[#333333] mb-3">✅ Completed Tests</h3>
            <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#1E88E5]">Test Order ID</TableHead>
                    <TableHead className="text-[#1E88E5]">Barcode</TableHead>
                    <TableHead className="text-[#1E88E5]">Instrument</TableHead>
                    <TableHead className="text-[#1E88E5]">Start Time</TableHead>
                    <TableHead className="text-[#1E88E5]">End Time</TableHead>
                    <TableHead className="text-[#1E88E5]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloodTests
                    .filter(t => t.status === "Completed")
                    .map(test => (
                      <TableRow key={test.id} className="hover:bg-[#F5F5F5]">
                        <TableCell className="font-medium text-[#333333]">{test.testOrderId}</TableCell>
                        <TableCell className="text-[#666666]">{test.barcode}</TableCell>
                        <TableCell className="text-[#666666]">{test.instrumentId}</TableCell>
                        <TableCell className="text-[#666666]">{test.startTime}</TableCell>
                        <TableCell className="text-[#666666]">{test.endTime}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Completed</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render HL7 Publishing
  const renderHL7Publishing = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <CardTitle className="text-[#1E88E5]">HL7 Publishing</CardTitle>
        <CardDescription>Publish test results to external services</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handlePublishHL7("Test Order Service")}
            className="bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl"
          >
            <Send className="h-4 w-4 mr-2" />
            Publish to Test Order Service
          </Button>
          <Button
            onClick={() => handlePublishHL7("Monitoring Service")}
            variant="outline"
            className="rounded-xl border-[#1E88E5] text-[#1E88E5] hover:bg-[#E3F2FD]"
          >
            <Database className="h-4 w-4 mr-2" />
            Backup to Monitoring Service
          </Button>
        </div>

        {/* Publishing Logs */}
        <div>
          <h3 className="text-sm font-medium text-[#333333] mb-3">Recent Publishing Logs</h3>
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1E88E5]">Time</TableHead>
                  <TableHead className="text-[#1E88E5]">Message ID</TableHead>
                  <TableHead className="text-[#1E88E5]">Test Order ID</TableHead>
                  <TableHead className="text-[#1E88E5]">Destination</TableHead>
                  <TableHead className="text-[#1E88E5]">Status</TableHead>
                  <TableHead className="text-[#1E88E5] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hl7Messages.map(msg => (
                  <TableRow key={msg.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="text-[#666666]">{msg.timestamp}</TableCell>
                    <TableCell className="font-medium text-[#333333]">{msg.id}</TableCell>
                    <TableCell className="text-[#666666]">{msg.testOrderId}</TableCell>
                    <TableCell className="text-[#666666]">{msg.destination}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          msg.status === "Published"
                            ? "bg-green-100 text-green-800"
                            : msg.status === "Failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {msg.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedHL7(msg);
                          setIsHL7DetailOpen(true);
                        }}
                        className="rounded-xl text-[#1E88E5] hover:bg-[#E3F2FD]"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render Sync Results
  const renderSyncResults = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#1E88E5]">Sync & Maintenance</CardTitle>
            <CardDescription>Synchronize test results and manage data</CardDescription>
          </div>
          <Button
            onClick={handleSyncResults}
            className="bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Results
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                <TableHead className="text-[#1E88E5]">Sync ID</TableHead>
                <TableHead className="text-[#1E88E5]">Test Orders</TableHead>
                <TableHead className="text-[#1E88E5]">Status</TableHead>
                <TableHead className="text-[#1E88E5]">Duration</TableHead>
                <TableHead className="text-[#1E88E5]">Operator</TableHead>
                <TableHead className="text-[#1E88E5]">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {syncLogs.map(log => (
                <TableRow key={log.id} className="hover:bg-[#F5F5F5]">
                  <TableCell className="font-medium text-[#333333]">{log.id}</TableCell>
                  <TableCell className="text-[#666666]">{log.testOrderIds.length} orders</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        log.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : log.status === "Missing Results"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#666666]">{log.duration}</TableCell>
                  <TableCell className="text-[#666666]">{log.operator}</TableCell>
                  <TableCell className="text-[#666666]">{log.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  // Render Manual Delete
  const renderManualDelete = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <CardTitle className="text-[#1E88E5]">Manual Delete Raw Data</CardTitle>
        <CardDescription>Remove stored raw test results manually</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                <TableHead className="text-[#1E88E5]">Raw Result ID</TableHead>
                <TableHead className="text-[#1E88E5]">Test Order ID</TableHead>
                <TableHead className="text-[#1E88E5]">Barcode</TableHead>
                <TableHead className="text-[#1E88E5]">Created On</TableHead>
                <TableHead className="text-[#1E88E5]">Status</TableHead>
                <TableHead className="text-[#1E88E5]">Size</TableHead>
                <TableHead className="text-[#1E88E5] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rawResults.map(raw => (
                <TableRow key={raw.id} className="hover:bg-[#F5F5F5]">
                  <TableCell className="font-medium text-[#333333]">{raw.id}</TableCell>
                  <TableCell className="text-[#666666]">{raw.testOrderId}</TableCell>
                  <TableCell className="text-[#666666]">{raw.barcode}</TableCell>
                  <TableCell className="text-[#666666]">{raw.createdOn}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={raw.status === "Sent" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {raw.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#666666]">{raw.size}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedRawResult(raw);
                        setIsDeleteRawOpen(true);
                      }}
                      className="rounded-xl"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  // Render Auto Delete
  const renderAutoDelete = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <CardTitle className="text-[#1E88E5]">Auto-Delete Policy</CardTitle>
        <CardDescription>Automatic cleanup of inactive instruments</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-[#FF9800] mt-0.5" />
            <div>
              <p className="text-sm text-[#333333]">
                Inactive instruments will be automatically deleted after 3 months of inactivity.
              </p>
              <p className="text-xs text-[#666666] mt-2">
                This policy helps maintain database efficiency and ensures only active instruments are tracked.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                <TableHead className="text-[#1E88E5]">Instrument ID</TableHead>
                <TableHead className="text-[#1E88E5]">Name</TableHead>
                <TableHead className="text-[#1E88E5]">Status</TableHead>
                <TableHead className="text-[#1E88E5]">Inactive Since</TableHead>
                <TableHead className="text-[#1E88E5]">Days Remaining</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instruments
                .filter(i => i.mode === "Inactive")
                .map(inst => (
                  <TableRow key={inst.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">{inst.id}</TableCell>
                    <TableCell className="text-[#666666]">{inst.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        Inactive
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{inst.lastUpdated}</TableCell>
                    <TableCell className="text-[#666666]">89 days</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  // Render Reagents
  const renderReagents = () => (
    <div className="space-y-6 mt-6">
      {/* Reagents Subtabs */}
      <Card className="shadow-md border-[#A5D6A7] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={reagentsTab === "install" ? "default" : "outline"}
              onClick={() => setReagentsTab("install")}
              className={`rounded-xl ${
                reagentsTab === "install"
                  ? "bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                  : "border-[#A5D6A7] text-[#4CAF50] hover:bg-[#E8F5E9]"
              }`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Install Reagent
            </Button>

            <Button
              variant={reagentsTab === "modify" ? "default" : "outline"}
              onClick={() => setReagentsTab("modify")}
              className={`rounded-xl ${
                reagentsTab === "modify"
                  ? "bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                  : "border-[#A5D6A7] text-[#4CAF50] hover:bg-[#E8F5E9]"
              }`}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modify Status
            </Button>

            <Button
              variant={reagentsTab === "delete" ? "default" : "outline"}
              onClick={() => setReagentsTab("delete")}
              className={`rounded-xl ${
                reagentsTab === "delete"
                  ? "bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                  : "border-[#A5D6A7] text-[#4CAF50] hover:bg-[#E8F5E9]"
              }`}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Reagent
            </Button>

            <Button
              variant={reagentsTab === "inventory" ? "default" : "outline"}
              onClick={() => setReagentsTab("inventory")}
              className={`rounded-xl ${
                reagentsTab === "inventory"
                  ? "bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                  : "border-[#A5D6A7] text-[#4CAF50] hover:bg-[#E8F5E9]"
              }`}
            >
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </Button>
          </div>
        </CardContent>
      </Card>

      {reagentsTab === "install" && renderReagentInstall()}
      {reagentsTab === "modify" && renderReagentModify()}
      {reagentsTab === "delete" && renderReagentDelete()}
      {reagentsTab === "inventory" && renderReagentInventory()}
    </div>
  );

  // Render Reagent Install
  const renderReagentInstall = () => (
    <Card className="shadow-lg border-[#A5D6A7] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E8F5E9] to-white border-b border-[#A5D6A7]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#4CAF50]">Install New Reagent</CardTitle>
            <CardDescription>Add reagents to your laboratory inventory</CardDescription>
          </div>
          <Button
            onClick={() => setIsReagentFormOpen(true)}
            className="bg-[#4CAF50] hover:bg-[#388E3C] rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Reagent
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-[#FF9800] mt-0.5" />
            <div>
              <p className="text-sm text-[#333333]">Expired reagents cannot be installed.</p>
              <p className="text-xs text-[#666666] mt-1">Please verify expiration dates before installation.</p>
            </div>
          </div>
        </div>

        <div className="border border-[#A5D6A7] rounded-xl overflow-hidden">
          {reagents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E8F5E9] hover:bg-[#E8F5E9]">
                  <TableHead className="text-[#4CAF50]">Reagent Name</TableHead>
                  <TableHead className="text-[#4CAF50]">Lot Number</TableHead>
                  <TableHead className="text-[#4CAF50]">Quantity</TableHead>
                  <TableHead className="text-[#4CAF50]">Expiry Date</TableHead>
                  <TableHead className="text-[#4CAF50]">Vendor</TableHead>
                  <TableHead className="text-[#4CAF50]">Installed By</TableHead>
                  <TableHead className="text-[#4CAF50]">Installed Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reagents.map(reagent => (
                  <TableRow key={reagent.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">{reagent.name}</TableCell>
                    <TableCell className="text-[#666666]">{reagent.lotNumber}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${
                        reagent.quantity < 200 ? "bg-red-100 text-red-800" :
                        reagent.quantity < 350 ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {reagent.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{reagent.expirationDate}</TableCell>
                    <TableCell className="text-[#666666]">
                      <div>
                        <p className="text-sm">{reagent.vendorName}</p>
                        <p className="text-xs text-[#999999]">{reagent.vendorContact}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#666666]">{reagent.installedBy}</TableCell>
                    <TableCell className="text-[#666666]">{reagent.installedDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center">
              <Beaker className="h-12 w-12 text-[#CCCCCC] mx-auto mb-4" />
              <p className="text-[#999999]">No reagents installed yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Render Reagent Modify
  const renderReagentModify = () => (
    <Card className="shadow-lg border-[#A5D6A7] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E8F5E9] to-white border-b border-[#A5D6A7]">
        <CardTitle className="text-[#4CAF50]">Modify Reagent Status</CardTitle>
        <CardDescription>Update reagent usage status</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="border border-[#A5D6A7] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E8F5E9] hover:bg-[#E8F5E9]">
                <TableHead className="text-[#4CAF50]">Reagent Name</TableHead>
                <TableHead className="text-[#4CAF50]">Lot Number</TableHead>
                <TableHead className="text-[#4CAF50]">Status</TableHead>
                <TableHead className="text-[#4CAF50]">Quantity</TableHead>
                <TableHead className="text-[#4CAF50] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reagents.map(reagent => (
                <TableRow key={reagent.id} className="hover:bg-[#F5F5F5]">
                  <TableCell className="font-medium text-[#333333]">{reagent.name}</TableCell>
                  <TableCell className="text-[#666666]">{reagent.lotNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${
                      reagent.status === "In Use" ? "bg-green-100 text-green-800" :
                      reagent.status === "Not In Use" ? "bg-gray-100 text-gray-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {reagent.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#666666]">{reagent.quantity}</TableCell>
                  <TableCell className="text-right">
                    <Select
                      value={reagent.status}
                      onValueChange={(value: ReagentStatus) => handleModifyReagentStatus(reagent, value)}
                    >
                      <SelectTrigger className="w-32 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Use">In Use</SelectItem>
                        <SelectItem value="Not In Use">Not In Use</SelectItem>
                        <SelectItem value="Expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  // Render Reagent Delete
  const renderReagentDelete = () => (
    <Card className="shadow-lg border-[#A5D6A7] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E8F5E9] to-white border-b border-[#A5D6A7]">
        <CardTitle className="text-[#4CAF50]">Delete Reagent</CardTitle>
        <CardDescription>Remove reagents from inventory</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="border border-[#A5D6A7] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E8F5E9] hover:bg-[#E8F5E9]">
                <TableHead className="text-[#4CAF50]">Reagent Name</TableHead>
                <TableHead className="text-[#4CAF50]">Lot Number</TableHead>
                <TableHead className="text-[#4CAF50]">Status</TableHead>
                <TableHead className="text-[#4CAF50]">Quantity</TableHead>
                <TableHead className="text-[#4CAF50]">Expiry Date</TableHead>
                <TableHead className="text-[#4CAF50] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reagents.map(reagent => (
                <TableRow key={reagent.id} className="hover:bg-[#F5F5F5]">
                  <TableCell className="font-medium text-[#333333]">{reagent.name}</TableCell>
                  <TableCell className="text-[#666666]">{reagent.lotNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${
                      reagent.status === "In Use" ? "bg-green-100 text-green-800" :
                      reagent.status === "Not In Use" ? "bg-gray-100 text-gray-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {reagent.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#666666]">{reagent.quantity}</TableCell>
                  <TableCell className="text-[#666666]">{reagent.expirationDate}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedReagent(reagent);
                        setIsReagentDeleteOpen(true);
                      }}
                      className="rounded-xl"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  // Render Reagent Inventory
  const renderReagentInventory = () => (
    <Card className="shadow-lg border-[#A5D6A7] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E8F5E9] to-white border-b border-[#A5D6A7]">
        <CardTitle className="text-[#4CAF50]">Reagent Inventory</CardTitle>
        <CardDescription>Complete overview of all reagents</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="border border-[#A5D6A7] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#E8F5E9] hover:bg-[#E8F5E9]">
                <TableHead className="text-[#4CAF50]">Reagent Name</TableHead>
                <TableHead className="text-[#4CAF50]">Lot Number</TableHead>
                <TableHead className="text-[#4CAF50]">Quantity</TableHead>
                <TableHead className="text-[#4CAF50]">Status</TableHead>
                <TableHead className="text-[#4CAF50]">Expiry Date</TableHead>
                <TableHead className="text-[#4CAF50]">Vendor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reagents.map(reagent => (
                <TableRow key={reagent.id} className="hover:bg-[#F5F5F5]">
                  <TableCell className="font-medium text-[#333333]">{reagent.name}</TableCell>
                  <TableCell className="text-[#666666]">{reagent.lotNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${
                      reagent.quantity < 200 ? "bg-red-100 text-red-800" :
                      reagent.quantity < 350 ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {reagent.quantity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${
                      reagent.status === "In Use" ? "bg-green-100 text-green-800" :
                      reagent.status === "Not In Use" ? "bg-gray-100 text-gray-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {reagent.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#666666]">{reagent.expirationDate}</TableCell>
                  <TableCell className="text-[#666666]">
                    <div>
                      <p className="text-sm">{reagent.vendorName}</p>
                      <p className="text-xs text-[#999999]">{reagent.vendorContact}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  // Render Config
  const renderConfig = () => {
    const configStatusData = [
      {
        id: "INS-001",
        name: "Hematology Analyzer XN-1000",
        configType: "General + Specific",
        lastSynced: "2025-10-17 07:00:00",
        status: "Synced",
        statusColor: "green"
      },
      {
        id: "INS-002",
        name: "Chemistry Analyzer AU-5800",
        configType: "General + Specific",
        lastSynced: "2025-10-17 07:00:00",
        status: "Synced",
        statusColor: "green"
      },
      {
        id: "INS-003",
        name: "Immunology Analyzer Dxl-800",
        configType: "Specific Only",
        lastSynced: "2025-10-17 06:30:00",
        status: "Pending",
        statusColor: "yellow"
      },
      {
        id: "INS-004",
        name: "Coagulation Analyzer ACL-TOP",
        configType: "General Only",
        lastSynced: "2025-10-16 22:00:00",
        status: "Warning",
        statusColor: "yellow"
      }
    ];

    return (
      <div className="space-y-6 mt-6">
        {/* Top Info Banner */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-100 border border-orange-200 rounded-2xl p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-[#333333]">Sync-up Instrument Configuration</h3>
              <p className="text-sm text-[#666666]">
                Synchronize general and specific instrument settings for your laboratory
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Configuration Card */}
          <Card className="shadow-md border-orange-200 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-100 hover:shadow-lg transition-all">
            <CardHeader className="border-b border-orange-200">
              <CardTitle className="text-[#F59E0B] flex items-center gap-2">
                <Database className="h-5 w-5" />
                General Configuration
              </CardTitle>
              <CardDescription className="text-[#666666]">
                Sync general instrument settings
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setConfigSyncForm({ ...configSyncForm, configType: "General" });
                    setIsConfigSyncOpen(true);
                  }}
                  className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl h-12 shadow-md hover:shadow-lg transition-all"
                  size="lg"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  🔁 Sync General Config
                </Button>

                <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-[#333333] mb-3">
                    <strong>Last Synced Configurations:</strong>
                  </p>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg">
                      <span className="text-[#666666] flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Default Settings
                      </span>
                      <span className="text-[#999999] text-xs">2025-10-17 07:00:00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg">
                      <span className="text-[#666666] flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        QC Parameters
                      </span>
                      <span className="text-[#999999] text-xs">2025-10-17 07:00:00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs text-[#666666] flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Configurations apply only to instruments in your lab. 
                      {user?.role === "admin" && " As Admin, you can sync globally."}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specific Configuration Card */}
          <Card className="shadow-md border-orange-200 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-100 hover:shadow-lg transition-all">
            <CardHeader className="border-b border-orange-200">
              <CardTitle className="text-[#F59E0B] flex items-center gap-2">
                <Server className="h-5 w-5" />
                Specific Configuration
              </CardTitle>
              <CardDescription className="text-[#666666]">
                Sync instrument-specific settings
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    setConfigSyncForm({ ...configSyncForm, configType: "Specific" });
                    setIsConfigSyncOpen(true);
                  }}
                  className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl h-12 shadow-md hover:shadow-lg transition-all"
                  size="lg"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  🔁 Sync Specific Config
                </Button>

                <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm">
                  <p className="text-sm text-[#333333] mb-3">
                    <strong>Last Synced Configurations:</strong>
                  </p>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg">
                      <span className="text-[#666666] flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Calibration Data
                      </span>
                      <span className="text-[#999999] text-xs">2025-10-17 06:30:00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg">
                      <span className="text-[#666666] flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Test Protocols
                      </span>
                      <span className="text-[#999999] text-xs">2025-10-17 06:30:00</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-xs text-[#666666] flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>
                      Specific configs are customized per instrument model and include calibration curves and test protocols.
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Status Table */}
        <Card className="shadow-md border-orange-200 rounded-2xl bg-white">
          <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-orange-200">
            <CardTitle className="text-[#F59E0B] flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Configuration Status
            </CardTitle>
            <CardDescription>Current sync status for all instruments</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="border border-orange-200 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-50 hover:to-orange-50">
                    <TableHead className="text-[#F59E0B]">Instrument</TableHead>
                    <TableHead className="text-[#F59E0B]">Config Type</TableHead>
                    <TableHead className="text-[#F59E0B]">Last Synced</TableHead>
                    <TableHead className="text-[#F59E0B]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configStatusData.map((item, index) => (
                    <TableRow 
                      key={item.id} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-orange-50 transition-colors`}
                    >
                      <TableCell className="font-medium text-[#333333]">{item.name}</TableCell>
                      <TableCell className="text-[#666666]">{item.configType}</TableCell>
                      <TableCell className="text-[#666666] text-sm">{item.lastSynced}</TableCell>
                      <TableCell>
                        <Badge 
                          className={`${
                            item.statusColor === "green" 
                              ? "bg-green-100 text-green-800 border-green-300" 
                              : item.statusColor === "yellow"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-red-100 text-red-800 border-red-300"
                          } flex items-center gap-1 w-fit`}
                          variant="outline"
                        >
                          {item.status === "Synced" && <CheckCircle2 className="h-3 w-3" />}
                          {item.status === "Pending" && <Clock className="h-3 w-3" />}
                          {item.status === "Warning" && <AlertTriangle className="h-3 w-3" />}
                          {item.status === "Error" && <XCircle className="h-3 w-3" />}
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Last Sync Summary Panel */}
        <Card className="shadow-md border-blue-200 rounded-2xl bg-gradient-to-r from-blue-50 to-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-[#333333]">
                    <strong>Last Sync Completed by:</strong> {user?.email || "labuser01@lab.com"}
                  </p>
                  <p className="text-xs text-[#999999]">at 10:30 AM, Oct 22, 2025</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-300" variant="outline">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Success
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render Audit
  const renderAudit = () => (
    <div className="space-y-6 mt-6">
      <Card className="shadow-lg border-[#CE93D8] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#F3E5F5] to-white border-b border-[#CE93D8]">
          <CardTitle className="text-[#9C27B0]">Audit Trail</CardTitle>
          <CardDescription>Activity logs from your laboratory</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-[#E3F2FD] border border-[#90CAF9] rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-[#1E88E5]" />
              <p className="text-sm text-[#333333]">
                Showing only activity from your laboratory
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search actions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="Change Instrument Mode">Mode Changes</SelectItem>
                <SelectItem value="Install Reagent">Reagent Install</SelectItem>
                <SelectItem value="Start Blood Analysis">Blood Analysis</SelectItem>
                <SelectItem value="Sync-Up Configuration">Config Sync</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Audit Logs Table */}
          <div className="border border-[#CE93D8] rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F3E5F5] hover:bg-[#F3E5F5]">
                  <TableHead className="text-[#9C27B0]">Timestamp</TableHead>
                  <TableHead className="text-[#9C27B0]">Action</TableHead>
                  <TableHead className="text-[#9C27B0]">Module</TableHead>
                  <TableHead className="text-[#9C27B0]">Performed By</TableHead>
                  <TableHead className="text-[#9C27B0]">Details</TableHead>
                  <TableHead className="text-[#9C27B0]">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs
                  .filter(log => 
                    (filterStatus === "all" || log.action === filterStatus) &&
                    (searchQuery === "" || 
                      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      log.details.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map(log => (
                    <TableRow key={log.id} className="hover:bg-[#F5F5F5]">
                      <TableCell className="text-[#666666]">{log.timestamp}</TableCell>
                      <TableCell className="font-medium text-[#333333]">{log.action}</TableCell>
                      <TableCell className="text-[#666666]">{log.module}</TableCell>
                      <TableCell className="text-[#666666]">{log.user}</TableCell>
                      <TableCell className="text-[#666666] max-w-md truncate">{log.details}</TableCell>
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
    </div>
  );

  return (
    <div className="p-6 bg-[#FAFAFA] min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-[#1E88E5] mb-2">Instrument Service Dashboard</h1>
        <p className="text-[#555555]">
          Operate and monitor instruments, reagents, and configurations for your laboratory
        </p>
      </div>

      {/* Main Tabs */}
      <Card className="shadow-md border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={mainTab === "overview" ? "default" : "outline"}
              onClick={() => setMainTab("overview")}
              className={`rounded-xl ${
                mainTab === "overview"
                  ? "bg-[#1E88E5] hover:bg-[#1976D2] text-white"
                  : "border-[#BBDEFB] text-[#1E88E5] hover:bg-[#E3F2FD]"
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </Button>

            <Button
              variant={mainTab === "test-flow" ? "default" : "outline"}
              onClick={() => setMainTab("test-flow")}
              className={`rounded-xl ${
                mainTab === "test-flow"
                  ? "bg-[#1E88E5] hover:bg-[#1976D2] text-white"
                  : "border-[#BBDEFB] text-[#1E88E5] hover:bg-[#E3F2FD]"
              }`}
            >
              <FlaskConical className="h-4 w-4 mr-2" />
              Instrument Test Flow
            </Button>

            <Button
              variant={mainTab === "reagents" ? "default" : "outline"}
              onClick={() => setMainTab("reagents")}
              className={`rounded-xl ${
                mainTab === "reagents"
                  ? "bg-[#4CAF50] hover:bg-[#388E3C] text-white"
                  : "border-[#A5D6A7] text-[#4CAF50] hover:bg-[#E8F5E9]"
              }`}
            >
              <Beaker className="h-4 w-4 mr-2" />
              Reagents Management
            </Button>

            <Button
              variant={mainTab === "config" ? "default" : "outline"}
              onClick={() => setMainTab("config")}
              className={`rounded-xl ${
                mainTab === "config"
                  ? "bg-[#FF9800] hover:bg-[#F57C00] text-white"
                  : "border-[#FFE082] text-[#FF9800] hover:bg-[#FFF8E1]"
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuration Management
            </Button>

            <Button
              variant={mainTab === "audit" ? "default" : "outline"}
              onClick={() => setMainTab("audit")}
              className={`rounded-xl ${
                mainTab === "audit"
                  ? "bg-[#9C27B0] hover:bg-[#7B1FA2] text-white"
                  : "border-[#CE93D8] text-[#9C27B0] hover:bg-[#F3E5F5]"
              }`}
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              Audit Trail
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Content */}
      {mainTab === "overview" && renderOverview()}
      {mainTab === "test-flow" && renderTestFlow()}
      {mainTab === "reagents" && renderReagents()}
      {mainTab === "config" && renderConfig()}
      {mainTab === "audit" && renderAudit()}

      {/* Dialogs */}
      {/* Mode Change Dialog */}
      <Dialog open={isModeChangeOpen} onOpenChange={setIsModeChangeOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1E88E5]">Change Instrument Mode</DialogTitle>
            <DialogDescription>
              Set operational status for {selectedInstrument?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="mode">New Mode</Label>
              <Select
                value={modeChangeForm.newMode}
                onValueChange={(value: InstrumentMode) => setModeChangeForm({ ...modeChangeForm, newMode: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(modeChangeForm.newMode === "Maintenance" || modeChangeForm.newMode === "Inactive") && (
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  value={modeChangeForm.reason}
                  onChange={(e) => setModeChangeForm({ ...modeChangeForm, reason: e.target.value })}
                  placeholder="Please provide a reason for this change..."
                  rows={3}
                  className="rounded-xl"
                />
              </div>
            )}

            {modeChangeForm.newMode === "Ready" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="qc"
                  checked={modeChangeForm.qcPassed}
                  onCheckedChange={(checked) => setModeChangeForm({ ...modeChangeForm, qcPassed: checked === true })}
                />
                <Label htmlFor="qc" className="text-sm">
                  QC checks have passed and instrument is verified ready
                </Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModeChangeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleModeChange} className="bg-[#1E88E5] hover:bg-[#1976D2]">
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blood Test Dialog */}
      <Dialog open={isBloodTestOpen} onOpenChange={setIsBloodTestOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1E88E5]">Start Blood Sample Analysis</DialogTitle>
            <DialogDescription>
              Execute blood testing workflow on selected instrument
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="testOrderId">Test Order ID (Optional)</Label>
              <Input
                id="testOrderId"
                value={bloodTestForm.testOrderId}
                onChange={(e) => setBloodTestForm({ ...bloodTestForm, testOrderId: e.target.value })}
                placeholder="Leave empty to auto-create"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="barcode">Sample Barcode *</Label>
              <Input
                id="barcode"
                value={bloodTestForm.barcode}
                onChange={(e) => setBloodTestForm({ ...bloodTestForm, barcode: e.target.value })}
                placeholder="Scan or enter barcode"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="instrument">Instrument *</Label>
              <Select
                value={bloodTestForm.instrumentId}
                onValueChange={(value) => setBloodTestForm({ ...bloodTestForm, instrumentId: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select instrument" />
                </SelectTrigger>
                <SelectContent>
                  {instruments
                    .filter(i => i.mode === "Ready")
                    .map(inst => (
                      <SelectItem key={inst.id} value={inst.id}>
                        {inst.name} ({inst.id})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="runType">Run Type</Label>
              <Select
                value={bloodTestForm.runType}
                onValueChange={(value: "single" | "batch") => setBloodTestForm({ ...bloodTestForm, runType: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Sample</SelectItem>
                  <SelectItem value="batch">Batch Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBloodTestOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStartBloodTest} className="bg-[#1E88E5] hover:bg-[#1976D2]">
              Start Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* HL7 Detail Dialog */}
      <Dialog open={isHL7DetailOpen} onOpenChange={setIsHL7DetailOpen}>
        <DialogContent className="bg-white rounded-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1E88E5]">HL7 Message Details</DialogTitle>
            <DialogDescription>Message ID: {selectedHL7?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Test Order ID</Label>
                <p className="text-sm text-[#666666] mt-1">{selectedHL7?.testOrderId}</p>
              </div>
              <div>
                <Label>Destination</Label>
                <p className="text-sm text-[#666666] mt-1">{selectedHL7?.destination}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge
                  variant="outline"
                  className={
                    selectedHL7?.status === "Published"
                      ? "bg-green-100 text-green-800"
                      : selectedHL7?.status === "Failed"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {selectedHL7?.status}
                </Badge>
              </div>
              <div>
                <Label>Timestamp</Label>
                <p className="text-sm text-[#666666] mt-1">{selectedHL7?.timestamp}</p>
              </div>
            </div>
            {selectedHL7?.errorMessage && (
              <div>
                <Label>Error Message</Label>
                <p className="text-sm text-red-600 mt-1">{selectedHL7.errorMessage}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHL7DetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Raw Result Confirmation */}
      <AlertDialog open={isDeleteRawOpen} onOpenChange={setIsDeleteRawOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1E88E5]">Delete Raw Result</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete raw result {selectedRawResult?.id}?
              This action cannot be undone and will free up {selectedRawResult?.size} of storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRawResult} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reagent Form Dialog */}
      <Dialog open={isReagentFormOpen} onOpenChange={setIsReagentFormOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#4CAF50]">Install New Reagent</DialogTitle>
            <DialogDescription>Add a new reagent to your laboratory inventory</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reagentName">Reagent Name *</Label>
              <Input
                id="reagentName"
                value={reagentForm.name}
                onChange={(e) => setReagentForm({ ...reagentForm, name: e.target.value })}
                placeholder="Enter reagent name"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lotNumber">Lot Number *</Label>
              <Input
                id="lotNumber"
                value={reagentForm.lotNumber}
                onChange={(e) => setReagentForm({ ...reagentForm, lotNumber: e.target.value })}
                placeholder="Enter lot number"
                className="rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={reagentForm.quantity || ""}
                  onChange={(e) => setReagentForm({ ...reagentForm, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="rounded-xl"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={reagentForm.expirationDate}
                  onChange={(e) => setReagentForm({ ...reagentForm, expirationDate: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="vendorName">Vendor Name</Label>
              <Input
                id="vendorName"
                value={reagentForm.vendorName}
                onChange={(e) => setReagentForm({ ...reagentForm, vendorName: e.target.value })}
                placeholder="Enter vendor name"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="vendorContact">Vendor Contact</Label>
              <Input
                id="vendorContact"
                value={reagentForm.vendorContact}
                onChange={(e) => setReagentForm({ ...reagentForm, vendorContact: e.target.value })}
                placeholder="Enter vendor contact"
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReagentFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInstallReagent} className="bg-[#4CAF50] hover:bg-[#388E3C]">
              Install Reagent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reagent Delete Confirmation */}
      <AlertDialog open={isReagentDeleteOpen} onOpenChange={setIsReagentDeleteOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#4CAF50]">Delete Reagent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete reagent "{selectedReagent?.name}" (Lot: {selectedReagent?.lotNumber})?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReagent} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Config Sync Dialog */}
      <Dialog open={isConfigSyncOpen} onOpenChange={setIsConfigSyncOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#FF9800]">Sync Configuration</DialogTitle>
            <DialogDescription>
              Sync {configSyncForm.configType.toLowerCase()} configuration to selected instrument
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="configInstrument">Select Instrument *</Label>
              <Select
                value={configSyncForm.instrumentId}
                onValueChange={(value) => setConfigSyncForm({ ...configSyncForm, instrumentId: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select instrument" />
                </SelectTrigger>
                <SelectContent>
                  {instruments.map(inst => (
                    <SelectItem key={inst.id} value={inst.id}>
                      {inst.name} ({inst.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-[#E3F2FD] border border-[#90CAF9] rounded-xl p-4">
              <p className="text-sm text-[#333333]">
                This will sync {configSyncForm.configType.toLowerCase()} configuration settings to the selected instrument.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigSyncOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfigSync} className="bg-[#FF9800] hover:bg-[#F57C00]">
              Sync Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sync Result Success Dialog */}
      <Dialog open={isSyncResultOpen} onOpenChange={setIsSyncResultOpen}>
        <DialogContent className="bg-white rounded-2xl max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-green-600 text-xl">Sync Completed Successfully</DialogTitle>
                <DialogDescription className="text-sm">
                  Configuration synchronization finished
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666666]">Instrument:</span>
                <span className="text-sm text-[#333333]">{syncResult.instrument}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666666]">General Config:</span>
                <Badge className="bg-green-100 text-green-800 border-green-300" variant="outline">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {syncResult.generalConfig}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666666]">Specific Config:</span>
                <Badge className="bg-green-100 text-green-800 border-green-300" variant="outline">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {syncResult.specificConfig}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666666]">Performed By:</span>
                <span className="text-xs text-[#999999]">{syncResult.performedBy}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666666]">Date:</span>
                <span className="text-xs text-[#999999]">{syncResult.date}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsSyncResultOpen(false);
                // Navigate to audit trail
                // setMainTab("audit");
              }}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              📜 View Event Log
            </Button>
            <Button 
              onClick={() => setIsSyncResultOpen(false)}
              className="flex-1 bg-[#1E88E5] hover:bg-[#1976D2]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
