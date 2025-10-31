import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
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

// Mock Data
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
    id: "INS-004",
    name: "Coagulation Analyzer ACL-TOP",
    mode: "Inactive",
    operator: "service@lab.com",
    lastUpdated: "2025-10-16 16:20:00",
    model: "ACL-TOP",
    serialNumber: "SN-2024-0004"
  },
  {
    id: "INS-005",
    name: "Urinalysis Analyzer UA-6600",
    mode: "Ready",
    operator: "labuser01@lab.com",
    lastUpdated: "2025-10-17 12:00:00",
    model: "UA-6600",
    serialNumber: "SN-2024-0005"
  },
  {
    id: "INS-006",
    name: "Blood Gas Analyzer ABL90",
    mode: "Ready",
    operator: "labuser02@lab.com",
    lastUpdated: "2025-10-17 11:20:00",
    model: "ABL90",
    serialNumber: "SN-2024-0006"
  }
];

const mockReagents: Reagent[] = [
  {
    id: "REG-001",
    name: "CBC Reagent Kit",
    lotNumber: "LOT-2025-001",
    quantity: 500,
    expirationDate: "2025-12-31",
    vendorName: "MedSupply Inc.",
    vendorContact: "vendor@medsupply.com",
    status: "In Use",
    installedBy: "labuser01@lab.com",
    installedDate: "2025-10-01"
  },
  {
    id: "REG-002",
    name: "Chemistry Panel Reagent",
    lotNumber: "LOT-2025-002",
    quantity: 250,
    expirationDate: "2025-11-30",
    vendorName: "LabChem Solutions",
    vendorContact: "sales@labchem.com",
    status: "In Use",
    installedBy: "labuser02@lab.com",
    installedDate: "2025-09-15"
  },
  {
    id: "REG-003",
    name: "Immunoassay Reagent",
    lotNumber: "LOT-2025-003",
    quantity: 100,
    expirationDate: "2026-01-15",
    vendorName: "BioReagents Ltd.",
    vendorContact: "info@bioreagents.com",
    status: "Not In Use",
    installedBy: "labuser03@lab.com",
    installedDate: "2025-10-10"
  },
  {
    id: "REG-004",
    name: "Coagulation Reagent",
    lotNumber: "LOT-2025-004",
    quantity: 180,
    expirationDate: "2025-11-15",
    vendorName: "MedSupply Inc.",
    vendorContact: "vendor@medsupply.com",
    status: "In Use",
    installedBy: "labuser01@lab.com",
    installedDate: "2025-09-20"
  },
  {
    id: "REG-005",
    name: "Urinalysis Test Strips",
    lotNumber: "LOT-2025-005",
    quantity: 420,
    expirationDate: "2026-02-28",
    vendorName: "LabChem Solutions",
    vendorContact: "sales@labchem.com",
    status: "In Use",
    installedBy: "labuser02@lab.com",
    installedDate: "2025-10-05"
  },
  {
    id: "REG-006",
    name: "Blood Gas Cartridge",
    lotNumber: "LOT-2025-006",
    quantity: 75,
    expirationDate: "2025-10-30",
    vendorName: "BioReagents Ltd.",
    vendorContact: "info@bioreagents.com",
    status: "In Use",
    installedBy: "labuser03@lab.com",
    installedDate: "2025-09-01"
  }
];

const mockBloodTests: BloodTest[] = [
  {
    id: "TEST-001",
    testOrderId: "TO-2025-10-17-001",
    barcode: "BC-20251017-001",
    instrumentId: "INS-001",
    status: "Completed",
    startTime: "2025-10-17 09:30:00",
    endTime: "2025-10-17 09:45:00",
    resultId: "RES-001",
    progress: 100
  },
  {
    id: "TEST-002",
    testOrderId: "TO-2025-10-17-002",
    barcode: "BC-20251017-002",
    instrumentId: "INS-003",
    status: "Completed",
    startTime: "2025-10-17 10:00:00",
    endTime: "2025-10-17 10:20:00",
    resultId: "RES-002",
    progress: 100
  },
  {
    id: "TEST-003",
    testOrderId: "TO-2025-10-17-003",
    barcode: "BC-20251017-003",
    instrumentId: "INS-001",
    status: "Failed",
    startTime: "2025-10-17 11:15:00",
    endTime: "2025-10-17 11:18:00",
    progress: 100
  },
  {
    id: "TEST-004",
    testOrderId: "TO-2025-10-17-004",
    barcode: "BC-20251017-004",
    instrumentId: "INS-005",
    status: "Completed",
    startTime: "2025-10-17 12:00:00",
    endTime: "2025-10-17 12:12:00",
    resultId: "RES-004",
    progress: 100
  },
  {
    id: "TEST-005",
    testOrderId: "TO-2025-10-17-005",
    barcode: "BC-20251017-005",
    instrumentId: "INS-006",
    status: "Completed",
    startTime: "2025-10-17 13:30:00",
    endTime: "2025-10-17 13:42:00",
    resultId: "RES-005",
    progress: 100
  }
];

const mockHL7Messages: HL7Message[] = [
  {
    id: "HL7-001",
    testOrderId: "TO-2025-10-17-001",
    status: "Published",
    destination: "Test Order Service",
    timestamp: "2025-10-17 09:45:30",
    rawMessage: `MSH|^~\\&|LAB|FACILITY|HIS|HOSPITAL|20251017094530||ORU^R01|MSG001|P|2.5
PID|1||PAT123456||DOE^JOHN^A||19800515|M
OBR|1||TO-2025-10-17-001|CBC^Complete Blood Count||20251017093000
OBX|1|NM|WBC^White Blood Cell Count||7.5|10^3/uL|4.0-11.0|N|||F
OBX|2|NM|RBC^Red Blood Cell Count||4.8|10^6/uL|4.5-5.5|N|||F
OBX|3|NM|HGB^Hemoglobin||14.2|g/dL|13.5-17.5|N|||F
OBX|4|NM|HCT^Hematocrit||42.5|%|38.8-50.0|N|||F`
  },
  {
    id: "HL7-002",
    testOrderId: "TO-2025-10-17-002",
    status: "Published",
    destination: "Monitoring Service",
    timestamp: "2025-10-17 10:20:45",
    rawMessage: `MSH|^~\\&|LAB|FACILITY|HIS|HOSPITAL|20251017102045||ORU^R01|MSG002|P|2.5
PID|1||PAT789012||SMITH^JANE^B||19750320|F
OBR|1||TO-2025-10-17-002|IMMUNO^Immunology Panel||20251017100000
OBX|1|NM|IGA^Immunoglobulin A||235|mg/dL|70-400|N|||F
OBX|2|NM|IGG^Immunoglobulin G||1150|mg/dL|700-1600|N|||F
OBX|3|NM|IGM^Immunoglobulin M||142|mg/dL|40-230|N|||F`
  },
  {
    id: "HL7-003",
    testOrderId: "TO-2025-10-17-003",
    status: "Failed",
    destination: "Test Order Service",
    timestamp: "2025-10-17 11:18:00",
    rawMessage: `MSH|^~\\&|LAB|FACILITY|HIS|HOSPITAL|20251017111800||ORU^R01|MSG003|P|2.5
PID|1||PAT345678||JOHNSON^ROBERT^C||19900710|M
OBR|1||TO-2025-10-17-003|CBC^Complete Blood Count||20251017111500`,
    errorMessage: "Connection timeout - Failed to send to destination server"
  },
  {
    id: "HL7-004",
    testOrderId: "TO-2025-10-17-004",
    status: "Published",
    destination: "Test Order Service",
    timestamp: "2025-10-17 12:12:30",
    rawMessage: `MSH|^~\\&|LAB|FACILITY|HIS|HOSPITAL|20251017121230||ORU^R01|MSG004|P|2.5
PID|1||PAT567890||WILLIAMS^MARY^D||19850425|F
OBR|1||TO-2025-10-17-004|UA^Urinalysis||20251017120000
OBX|1|ST|COLOR^Color||Yellow||||F
OBX|2|ST|CLARITY^Clarity||Clear||||F
OBX|3|NM|PH^pH||6.0||5.0-8.0|N|||F
OBX|4|ST|PROTEIN^Protein||Negative||||F`
  },
  {
    id: "HL7-005",
    testOrderId: "TO-2025-10-17-005",
    status: "Published",
    destination: "Monitoring Service",
    timestamp: "2025-10-17 13:42:50",
    rawMessage: `MSH|^~\\&|LAB|FACILITY|HIS|HOSPITAL|20251017134250||ORU^R01|MSG005|P|2.5
PID|1||PAT234567||DAVIS^MICHAEL^E||19920815|M
OBR|1||TO-2025-10-17-005|BG^Blood Gas||20251017133000
OBX|1|NM|PH^pH||7.40||7.35-7.45|N|||F
OBX|2|NM|PCO2^Partial CO2||38|mmHg|35-45|N|||F
OBX|3|NM|PO2^Partial O2||95|mmHg|80-100|N|||F
OBX|4|NM|HCO3^Bicarbonate||24|mEq/L|22-26|N|||F`
  }
];

const mockSyncLogs: SyncLog[] = [
  {
    id: "SYNC-001",
    testOrderIds: ["TO-2025-10-17-001", "TO-2025-10-17-002"],
    status: "Completed",
    duration: "2.3s",
    operator: "admin@lab.com",
    timestamp: "2025-10-17 10:30:00"
  },
  {
    id: "SYNC-002",
    testOrderIds: ["TO-2025-10-17-003"],
    status: "Missing Results",
    duration: "5.1s",
    operator: "admin@lab.com",
    timestamp: "2025-10-17 11:25:00"
  },
  {
    id: "SYNC-003",
    testOrderIds: ["TO-2025-10-17-004", "TO-2025-10-17-005"],
    status: "Completed",
    duration: "1.8s",
    operator: "labuser01@lab.com",
    timestamp: "2025-10-17 13:50:00"
  },
  {
    id: "SYNC-004",
    testOrderIds: ["TO-2025-10-16-045", "TO-2025-10-16-046", "TO-2025-10-16-047"],
    status: "Completed",
    duration: "3.2s",
    operator: "admin@lab.com",
    timestamp: "2025-10-16 18:00:00"
  }
];

const mockRawResults: RawResult[] = [
  {
    id: "RAW-001",
    testOrderId: "TO-2025-10-15-023",
    barcode: "BC-20251015-023",
    createdOn: "2025-10-15 14:30:00",
    status: "Sent",
    size: "2.4 MB"
  },
  {
    id: "RAW-002",
    testOrderId: "TO-2025-10-15-024",
    barcode: "BC-20251015-024",
    createdOn: "2025-10-15 15:15:00",
    status: "Sent",
    size: "1.8 MB"
  },
  {
    id: "RAW-003",
    testOrderId: "TO-2025-10-16-001",
    barcode: "BC-20251016-001",
    createdOn: "2025-10-16 08:00:00",
    status: "Stored",
    size: "3.1 MB"
  },
  {
    id: "RAW-004",
    testOrderId: "TO-2025-10-16-012",
    barcode: "BC-20251016-012",
    createdOn: "2025-10-16 11:45:00",
    status: "Sent",
    size: "2.7 MB"
  },
  {
    id: "RAW-005",
    testOrderId: "TO-2025-10-16-028",
    barcode: "BC-20251016-028",
    createdOn: "2025-10-16 16:20:00",
    status: "Sent",
    size: "2.2 MB"
  },
  {
    id: "RAW-006",
    testOrderId: "TO-2025-10-17-001",
    barcode: "BC-20251017-001",
    createdOn: "2025-10-17 09:45:00",
    status: "Stored",
    size: "2.9 MB"
  }
];

const mockAuditLogs: AuditLog[] = [
  {
    id: "AUD-001",
    action: "Change Instrument Mode",
    module: "Instrument Service",
    user: "admin@lab.com",
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
  },
  {
    id: "AUD-004",
    action: "Sync-Up Configuration",
    module: "Configuration Management",
    user: "admin@lab.com",
    timestamp: "2025-10-17 07:00:00",
    details: "General configuration synced for Hematology Analyzer XN-1000 (INS-001)",
    result: "Success"
  },
  {
    id: "AUD-005",
    action: "Delete Raw Test Result",
    module: "Instrument Service",
    user: "admin@lab.com",
    timestamp: "2025-10-16 20:00:00",
    details: "Deleted result RAW-001 for Test Order TO-2025-10-15-023. Size freed: 2.4 MB",
    result: "Success"
  },
  {
    id: "AUD-006",
    action: "Modify Reagent Status",
    module: "Reagents Management",
    user: "labuser02@lab.com",
    timestamp: "2025-10-16 14:30:00",
    details: "Immunoassay Reagent (REG-003): In Use → Not In Use",
    result: "Success"
  },
  {
    id: "AUD-007",
    action: "Start Blood Analysis",
    module: "Instrument Service",
    user: "labuser03@lab.com",
    timestamp: "2025-10-17 10:00:00",
    details: "Test TEST-002 started on Immunology Analyzer DxI-800. Barcode: BC-20251017-002",
    result: "Success"
  },
  {
    id: "AUD-008",
    action: "Change Instrument Mode",
    module: "Instrument Service",
    user: "service@lab.com",
    timestamp: "2025-10-16 16:20:00",
    details: "Coagulation Analyzer ACL-TOP (INS-004): Ready → Inactive. Reason: Equipment malfunction - awaiting service",
    result: "Success"
  },
  {
    id: "AUD-009",
    action: "Install Reagent",
    module: "Reagents Management",
    user: "labuser02@lab.com",
    timestamp: "2025-10-05 09:15:00",
    details: "Urinalysis Test Strips (LOT-2025-005) installed. Qty: 420",
    result: "Success"
  },
  {
    id: "AUD-010",
    action: "Sync-Up Configuration",
    module: "Configuration Management",
    user: "admin@lab.com",
    timestamp: "2025-10-15 06:30:00",
    details: "Specific configuration synced for Blood Gas Analyzer ABL90 (INS-006)",
    result: "Success"
  }
];

export function InstrumentServiceDashboard() {
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
  const stats = {
    totalInstruments: instruments.length,
    activeInstruments: instruments.filter(i => i.mode === "Ready").length,
    maintenanceCount: instruments.filter(i => i.mode === "Maintenance").length,
    totalReagents: reagents.filter(r => r.status === "In Use").length,
    lowStockReagents: reagents.filter(r => r.quantity < 200).length,
    pendingTests: bloodTests.filter(t => t.status === "Running").length,
    completedTests: bloodTests.filter(t => t.status === "Completed").length
  };

  // Reagent Level Chart Data
  const reagentChartData = reagents.map(r => ({
    name: r.name.substring(0, 20),
    quantity: r.quantity,
    fill: r.quantity < 200 ? "#F44336" : r.quantity < 350 ? "#FFC107" : "#4CAF50"
  }));

  // Test Status Pie Chart Data
  const testStatusData = [
    { name: "Completed", value: 156, color: "#4CAF50" },
    { name: "Running", value: 24, color: "#2196F3" },
    { name: "Failed", value: 8, color: "#F44336" },
    { name: "Pending", value: 12, color: "#FFC107" }
  ];

  // Add Audit Log
  const addAuditLog = (action: string, module: string, details: string, result: "Success" | "Failed" = "Success") => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      action,
      module,
      user: user?.email || "system",
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details,
      result
    };
    setAuditLogs([newLog, ...auditLogs]);
    console.log(`[AUDIT_LOG] ${action} - ${module}: ${details} by ${newLog.user}`);
  };

  // Handle Mode Change
  const handleModeChange = () => {
    if (!selectedInstrument) return;

    if ((modeChangeForm.newMode === "Maintenance" || modeChangeForm.newMode === "Inactive") && !modeChangeForm.reason) {
      toast.error("Reason required", {
        description: "Please provide a reason for changing to Maintenance or Inactive mode"
      });
      return;
    }

    if (modeChangeForm.newMode === "Ready" && !modeChangeForm.qcPassed) {
      toast.error("QC Check required", {
        description: "Please confirm that QC checks have passed"
      });
      return;
    }

    const oldMode = selectedInstrument.mode;
    const updatedInstruments = instruments.map(inst =>
      inst.id === selectedInstrument.id
        ? {
            ...inst,
            mode: modeChangeForm.newMode,
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }
        : inst
    );

    setInstruments(updatedInstruments);
    addAuditLog(
      "Change Instrument Mode",
      "Instrument Service",
      `${selectedInstrument.name} (${selectedInstrument.id}): ${oldMode} → ${modeChangeForm.newMode}. Reason: ${modeChangeForm.reason || "QC Passed"}`
    );

    toast.success("✅ Mode changed successfully!", {
      description: `${selectedInstrument.name} is now in ${modeChangeForm.newMode} mode`
    });

    setIsModeChangeOpen(false);
    setSelectedInstrument(null);
    setModeChangeForm({ newMode: "Ready", reason: "", qcPassed: false });
  };

  // Handle Blood Test Start
  const handleBloodTestStart = () => {
    if (!bloodTestForm.barcode || !bloodTestForm.instrumentId) {
      toast.error("Required fields missing", {
        description: "Barcode and Instrument are required"
      });
      return;
    }

    const instrument = instruments.find(i => i.id === bloodTestForm.instrumentId);
    if (!instrument) {
      toast.error("Invalid instrument");
      return;
    }

    if (instrument.mode !== "Ready") {
      toast.error("Instrument not ready", {
        description: `${instrument.name} is in ${instrument.mode} mode`
      });
      return;
    }

    const newTest: BloodTest = {
      id: `TEST-${Date.now()}`,
      testOrderId: bloodTestForm.testOrderId || `TO-${Date.now()}`,
      barcode: bloodTestForm.barcode,
      instrumentId: bloodTestForm.instrumentId,
      status: "Running",
      startTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      progress: 0
    };

    setBloodTests([newTest, ...bloodTests]);
    addAuditLog(
      "Start Blood Analysis",
      "Instrument Service",
      `Test ${newTest.id} started on ${instrument.name}. Barcode: ${bloodTestForm.barcode}`
    );

    toast.success("🧪 Blood analysis started!", {
      description: `Test running on ${instrument.name}`
    });

    // Simulate progress
    simulateTestProgress(newTest.id);

    setIsBloodTestOpen(false);
    setBloodTestForm({ testOrderId: "", barcode: "", instrumentId: "", runType: "single" });
  };

  // Simulate Test Progress
  const simulateTestProgress = (testId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setBloodTests(prev =>
        prev.map(test =>
          test.id === testId
            ? { ...test, progress: Math.min(progress, 100) }
            : test
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        // Complete test
        setTimeout(() => {
          const resultId = `RES-${Date.now()}`;
          setBloodTests(prev =>
            prev.map(test =>
              test.id === testId
                ? {
                    ...test,
                    status: "Completed",
                    endTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    resultId
                  }
                : test
            )
          );

          // Auto-create HL7 message
          const newHL7: HL7Message = {
            id: `HL7-${Date.now()}`,
            testOrderId: bloodTests.find(t => t.id === testId)?.testOrderId || "",
            status: "Published",
            destination: "Test Order Service",
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            rawMessage: `MSH|^~\\&|LAB|FACILITY|||||ORU^R01|||2.5\nPID|||${testId}|||\nOBR|1||${resultId}||^\nOBX|1||||||`
          };
          setHL7Messages([newHL7, ...hl7Messages]);

          toast.success("✅ Test completed!", {
            description: `Results published via HL7: ${resultId}`
          });
        }, 500);
      }
    }, 1000);
  };

  // Handle Delete Raw Result
  const handleDeleteRawResult = () => {
    if (!selectedRawResult) return;

    if (selectedRawResult.status !== "Sent") {
      toast.error("Cannot delete", {
        description: "Results must be sent/backed up before deletion"
      });
      return;
    }

    setRawResults(rawResults.filter(r => r.id !== selectedRawResult.id));
    addAuditLog(
      "Delete Raw Test Result",
      "Instrument Service",
      `Deleted result ${selectedRawResult.id} for Test Order ${selectedRawResult.testOrderId}. Size freed: ${selectedRawResult.size}`
    );

    toast.success("✅ Raw result deleted!", {
      description: `Memory freed: ${selectedRawResult.size}`
    });

    setIsDeleteRawOpen(false);
    setSelectedRawResult(null);
  };

  // Handle Install Reagent
  const handleInstallReagent = () => {
    if (!reagentForm.name || !reagentForm.lotNumber || reagentForm.quantity <= 0 || !reagentForm.expirationDate) {
      toast.error("Validation failed", {
        description: "Please fill in all required fields"
      });
      return;
    }

    const expiryDate = new Date(reagentForm.expirationDate);
    const today = new Date();
    if (expiryDate <= today) {
      toast.error("Invalid expiration date", {
        description: "Expiration date must be in the future"
      });
      return;
    }

    const newReagent: Reagent = {
      id: `REG-${String(reagents.length + 1).padStart(3, "0")}`,
      name: reagentForm.name,
      lotNumber: reagentForm.lotNumber,
      quantity: reagentForm.quantity,
      expirationDate: reagentForm.expirationDate,
      vendorName: reagentForm.vendorName,
      vendorContact: reagentForm.vendorContact,
      status: "In Use",
      installedBy: user?.email || "admin",
      installedDate: new Date().toISOString().split('T')[0]
    };

    setReagents([newReagent, ...reagents]);
    addAuditLog(
      "Install Reagent",
      "Reagents Management",
      `${newReagent.name} (${newReagent.lotNumber}) installed. Qty: ${newReagent.quantity}`
    );

    toast.success("✅ Reagent installed successfully!", {
      description: `${newReagent.name} is now in use`
    });

    setIsReagentFormOpen(false);
    setReagentForm({
      name: "",
      lotNumber: "",
      quantity: 0,
      expirationDate: "",
      vendorName: "",
      vendorContact: ""
    });
  };

  // Handle Modify Reagent Status
  const handleModifyReagentStatus = (reagent: Reagent, newStatus: ReagentStatus) => {
    if (reagent.status === newStatus) {
      toast.error("No change detected", {
        description: "Status is already set to this value"
      });
      return;
    }

    const updatedReagents = reagents.map(r =>
      r.id === reagent.id ? { ...r, status: newStatus } : r
    );

    setReagents(updatedReagents);
    addAuditLog(
      "Modify Reagent Status",
      "Reagents Management",
      `${reagent.name} (${reagent.id}): ${reagent.status} → ${newStatus}`
    );

    toast.success("✅ Reagent status updated!", {
      description: `${reagent.name} is now ${newStatus}`
    });
  };

  // Handle Delete Reagent
  const handleDeleteReagent = () => {
    if (!selectedReagent) return;

    setReagents(reagents.filter(r => r.id !== selectedReagent.id));
    addAuditLog(
      "Delete Reagent",
      "Reagents Management",
      `Deleted ${selectedReagent.name} (${selectedReagent.id})`
    );

    toast.success("✅ Reagent deleted successfully!");

    setIsReagentDeleteOpen(false);
    setSelectedReagent(null);
  };

  // Handle Config Sync
  const handleConfigSync = () => {
    if (!configSyncForm.instrumentId) {
      toast.error("Instrument required", {
        description: "Please select an instrument"
      });
      return;
    }

    const instrument = instruments.find(i => i.id === configSyncForm.instrumentId);
    if (!instrument) {
      toast.error("Invalid Instrument ID");
      return;
    }

    toast.info("🔄 Syncing configuration...", {
      description: "Please wait"
    });

    setTimeout(() => {
      addAuditLog(
        "Sync-Up Configuration",
        "Configuration Management",
        `${configSyncForm.configType} configuration synced for ${instrument.name} (${instrument.id})`
      );

      toast.success("✅ Configuration synced successfully!", {
        description: `${configSyncForm.configType} settings applied to ${instrument.name}`
      });

      setIsConfigSyncOpen(false);
      setConfigSyncForm({ instrumentId: "", configType: "General" });
    }, 2000);
  };

  // Render Overview Tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md border-[#B3D9FF] bg-gradient-to-br from-[#E3F2FD] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Total Instruments</p>
                <p className="text-3xl font-semibold text-[#1E88E5]">{stats.totalInstruments}</p>
              </div>
              <Wrench className="h-8 w-8 text-[#1E88E5] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#A5D6A7] bg-gradient-to-br from-[#E8F5E9] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Active (Ready)</p>
                <p className="text-3xl font-semibold text-[#4CAF50]">{stats.activeInstruments}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-[#4CAF50] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#FFE082] bg-gradient-to-br from-[#FFF8E1] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Maintenance</p>
                <p className="text-3xl font-semibold text-[#FFA726]">{stats.maintenanceCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-[#FFA726] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#B3D9FF] bg-gradient-to-br from-[#E3F2FD] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Reagents in Use</p>
                <p className="text-3xl font-semibold text-[#1E88E5]">{stats.totalReagents}</p>
              </div>
              <Beaker className="h-8 w-8 text-[#1E88E5] opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health & Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instrument Status */}
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
            <CardTitle className="text-[#1E88E5]">Instrument Status Overview</CardTitle>
            <CardDescription>Live status of all instruments</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {instruments.map(inst => (
                <div key={inst.id} className="flex items-center justify-between p-3 bg-[#F5F6FA] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      inst.mode === "Ready" ? "bg-green-500" :
                      inst.mode === "Maintenance" ? "bg-yellow-500" :
                      "bg-red-500"
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-[#333333]">{inst.name}</p>
                      <p className="text-xs text-[#666666]">{inst.id}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${
                    inst.mode === "Ready" ? "bg-green-100 text-green-800 border-green-200" :
                    inst.mode === "Maintenance" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                    "bg-red-100 text-red-800 border-red-200"
                  }`}>
                    {inst.mode}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reagent Levels */}
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
          <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
            <CardTitle className="text-[#1E88E5]">Reagent Inventory Levels</CardTitle>
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

      {/* Quick Actions */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1E88E5]">Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => setMainTab("test-flow")}
              className="bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl h-auto py-6 flex flex-col items-start gap-2"
            >
              <FlaskConical className="h-6 w-6" />
              <div className="text-left">
                <p className="font-medium">Blood Testing</p>
                <p className="text-xs opacity-90">Execute sample analysis</p>
              </div>
            </Button>

            <Button
              onClick={() => {
                setMainTab("reagents");
                setReagentsTab("install");
              }}
              className="bg-[#4CAF50] hover:bg-[#388E3C] rounded-xl h-auto py-6 flex flex-col items-start gap-2"
            >
              <Beaker className="h-6 w-6" />
              <div className="text-left">
                <p className="font-medium">Install Reagent</p>
                <p className="text-xs opacity-90">Add new reagents</p>
              </div>
            </Button>

            <Button
              onClick={() => setMainTab("config")}
              className="bg-[#FF9800] hover:bg-[#F57C00] rounded-xl h-auto py-6 flex flex-col items-start gap-2"
            >
              <Settings className="h-6 w-6" />
              <div className="text-left">
                <p className="font-medium">Sync Configuration</p>
                <p className="text-xs opacity-90">Update instrument settings</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Test Flow Tab
  const renderTestFlow = () => (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <Card className="shadow-md border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={testFlowTab === "mode-change" ? "default" : "outline"}
              onClick={() => setTestFlowTab("mode-change")}
              className={testFlowTab === "mode-change" ? "bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl" : "rounded-xl"}
            >
              <Settings className="h-4 w-4 mr-2" />
              Change Mode
            </Button>
            <Button
              variant={testFlowTab === "blood-analysis" ? "default" : "outline"}
              onClick={() => setTestFlowTab("blood-analysis")}
              className={testFlowTab === "blood-analysis" ? "bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl" : "rounded-xl"}
            >
              <FlaskConical className="h-4 w-4 mr-2" />
              Blood Analysis
            </Button>
            <Button
              variant={testFlowTab === "hl7-publish" ? "default" : "outline"}
              onClick={() => setTestFlowTab("hl7-publish")}
              className={testFlowTab === "hl7-publish" ? "bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl" : "rounded-xl"}
            >
              <Send className="h-4 w-4 mr-2" />
              HL7 Publishing
            </Button>
            <Button
              variant={testFlowTab === "sync-results" ? "default" : "outline"}
              onClick={() => setTestFlowTab("sync-results")}
              className={testFlowTab === "sync-results" ? "bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl" : "rounded-xl"}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Results
            </Button>
            <Button
              variant={testFlowTab === "manual-delete" ? "default" : "outline"}
              onClick={() => setTestFlowTab("manual-delete")}
              className={testFlowTab === "manual-delete" ? "bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl" : "rounded-xl"}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Manual Delete
            </Button>
            <Button
              variant={testFlowTab === "auto-delete" ? "default" : "outline"}
              onClick={() => setTestFlowTab("auto-delete")}
              className={testFlowTab === "auto-delete" ? "bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl" : "rounded-xl"}
            >
              <Clock className="h-4 w-4 mr-2" />
              Auto Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Content */}
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
        <CardDescription>Set operational status of instruments</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Filter Chips */}
        <div className="flex gap-2 mb-4">
          <Badge
            variant="outline"
            className={`cursor-pointer ${filterMode === "all" ? "bg-[#1E88E5] text-white" : ""}`}
            onClick={() => setFilterMode("all")}
          >
            All Instruments
          </Badge>
          <Badge
            variant="outline"
            className={`cursor-pointer ${filterMode === "Ready" ? "bg-green-100 text-green-800" : ""}`}
            onClick={() => setFilterMode("Ready")}
          >
            ✅ Ready
          </Badge>
          <Badge
            variant="outline"
            className={`cursor-pointer ${filterMode === "Maintenance" ? "bg-yellow-100 text-yellow-800" : ""}`}
            onClick={() => setFilterMode("Maintenance")}
          >
            🧰 Maintenance
          </Badge>
          <Badge
            variant="outline"
            className={`cursor-pointer ${filterMode === "Inactive" ? "bg-red-100 text-red-800" : ""}`}
            onClick={() => setFilterMode("Inactive")}
          >
            ⚠️ Inactive
          </Badge>
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
                .map(inst => (
                  <TableRow key={inst.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">{inst.id}</TableCell>
                    <TableCell className="text-[#666666]">{inst.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${
                        inst.mode === "Ready" ? "bg-green-100 text-green-800 border-green-200" :
                        inst.mode === "Maintenance" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                        "bg-red-100 text-red-800 border-red-200"
                      }`}>
                        {inst.mode}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{inst.operator}</TableCell>
                    <TableCell className="text-[#666666]">{inst.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedInstrument(inst);
                            setModeChangeForm({ newMode: inst.mode, reason: "", qcPassed: false });
                            setIsModeChangeOpen(true);
                          }}
                          className="text-[#1E88E5] hover:text-[#1976D2] hover:bg-[#E3F2FD]"
                        >
                          <Edit className="h-4 w-4 mr-1" />
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
  );

  // Render Blood Analysis
  const renderBloodAnalysis = () => (
    <div className="space-y-6">
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div>
            <CardTitle className="text-[#1E88E5]">Blood Sample Analysis</CardTitle>
            <CardDescription>Execute and monitor blood testing workflows</CardDescription>
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
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-[#1E88E5]">{test.barcode}</p>
                            <p className="text-xs text-[#666666]">Test Order: {test.testOrderId}</p>
                          </div>
                          <Badge className="bg-[#2196F3] text-white">Running</Badge>
                        </div>
                        <Progress value={test.progress} className="h-2" />
                        <p className="text-xs text-[#666666] mt-2">{test.progress}% complete</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* Results Log */}
          <h3 className="text-sm font-medium text-[#333333] mb-3">📋 Test Results Log</h3>
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
            {bloodTests.length === 0 ? (
              <div className="text-center py-12 bg-[#F5F6FA]">
                <FlaskConical className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
                <p className="text-[#666666]">No tests recorded yet</p>
                <p className="text-sm text-[#999999] mt-2">Start a new blood analysis to see results here</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#1E88E5]">Barcode</TableHead>
                    <TableHead className="text-[#1E88E5]">Test Order ID</TableHead>
                    <TableHead className="text-[#1E88E5]">Status</TableHead>
                    <TableHead className="text-[#1E88E5]">Start Time</TableHead>
                    <TableHead className="text-[#1E88E5]">End Time</TableHead>
                    <TableHead className="text-[#1E88E5]">Result ID</TableHead>
                    <TableHead className="text-[#1E88E5]">Instrument</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloodTests.map(test => (
                    <TableRow key={test.id} className="hover:bg-[#F5F5F5]">
                      <TableCell className="font-medium text-[#333333]">{test.barcode}</TableCell>
                      <TableCell className="text-[#666666]">{test.testOrderId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${
                          test.status === "Completed" ? "bg-green-100 text-green-800" :
                          test.status === "Running" ? "bg-blue-100 text-blue-800" :
                          test.status === "Failed" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {test.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#666666]">{test.startTime}</TableCell>
                      <TableCell className="text-[#666666]">{test.endTime || "-"}</TableCell>
                      <TableCell className="text-[#666666]">{test.resultId || "-"}</TableCell>
                      <TableCell className="text-[#666666]">
                        {instruments.find(i => i.id === test.instrumentId)?.name}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render HL7 Publishing
  const renderHL7Publishing = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <CardTitle className="text-[#1E88E5]">HL7 Result Publishing Log</CardTitle>
        <CardDescription>Monitor HL7 message publishing status</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* KPI Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-[#E8F5E9] border-[#A5D6A7]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#555555] mb-1">Successful Messages</p>
                  <p className="text-3xl font-semibold text-[#4CAF50]">
                    {hl7Messages.filter(m => m.status === "Published").length}
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-[#4CAF50] opacity-70" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#FFEBEE] border-[#FFCDD2]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#555555] mb-1">Failed Attempts</p>
                  <p className="text-3xl font-semibold text-[#F44336]">
                    {hl7Messages.filter(m => m.status === "Failed").length}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-[#F44336] opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages Table */}
        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
          {hl7Messages.length === 0 ? (
            <div className="text-center py-12 bg-[#F5F6FA]">
              <Send className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
              <p className="text-[#666666]">No HL7 messages yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1E88E5]">Message ID</TableHead>
                  <TableHead className="text-[#1E88E5]">Test Order</TableHead>
                  <TableHead className="text-[#1E88E5]">Status</TableHead>
                  <TableHead className="text-[#1E88E5]">Destination</TableHead>
                  <TableHead className="text-[#1E88E5]">Timestamp</TableHead>
                  <TableHead className="text-[#1E88E5] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hl7Messages.map(msg => (
                  <TableRow key={msg.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">{msg.id}</TableCell>
                    <TableCell className="text-[#666666]">{msg.testOrderId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${
                        msg.status === "Published" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {msg.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{msg.destination}</TableCell>
                    <TableCell className="text-[#666666]">{msg.timestamp}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedHL7(msg);
                          setIsHL7DetailOpen(true);
                        }}
                        className="text-[#1E88E5] hover:bg-[#E3F2FD]"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View HL7
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Render Sync Results
  const renderSyncResults = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <CardTitle className="text-[#1E88E5]">Test Results Sync-Up</CardTitle>
        <CardDescription>Synchronization between Instrument Service and Monitoring Service</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Sync Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-[#E3F2FD] border-[#90CAF9]">
            <CardContent className="pt-6">
              <p className="text-sm text-[#555555] mb-1">Last Sync Time</p>
              <p className="text-lg font-medium text-[#1E88E5]">
                {new Date().toISOString().replace('T', ' ').substring(0, 19)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#FFF8E1] border-[#FFE082]">
            <CardContent className="pt-6">
              <p className="text-sm text-[#555555] mb-1">Pending Sync Requests</p>
              <p className="text-lg font-medium text-[#FFA726]">
                {syncLogs.filter(s => s.status === "Pending").length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#E8F5E9] border-[#A5D6A7]">
            <CardContent className="pt-6">
              <p className="text-sm text-[#555555] mb-1">Synced Test Orders</p>
              <p className="text-lg font-medium text-[#4CAF50]">
                {syncLogs.filter(s => s.status === "Completed").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => {
              toast.info("🔄 Manual sync initiated...");
              setTimeout(() => {
                toast.success("✅ Sync completed successfully!");
              }, 2000);
            }}
            className="bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl"
          >
            <Zap className="h-4 w-4 mr-2" />
            Manual Sync
          </Button>
        </div>

        {/* Sync Logs Table */}
        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
          {syncLogs.length === 0 ? (
            <div className="text-center py-12 bg-[#F5F6FA]">
              <RefreshCw className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
              <p className="text-[#666666]">No sync logs available</p>
            </div>
          ) : (
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
                    <TableCell className="text-[#666666]">{log.testOrderIds.join(", ")}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${
                        log.status === "Completed" ? "bg-green-100 text-green-800" :
                        log.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
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
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Render Manual Delete (continuing in next part due to length)
  const renderManualDelete = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <CardTitle className="text-[#1E88E5]">Manual Delete Raw Test Results</CardTitle>
        <CardDescription>Free instrument memory by deleting backed-up results</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
          {rawResults.length === 0 ? (
            <div className="text-center py-12 bg-[#F5F6FA]">
              <Database className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
              <p className="text-[#666666]">No raw results stored</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1E88E5]">Result ID</TableHead>
                  <TableHead className="text-[#1E88E5]">Test Order ID</TableHead>
                  <TableHead className="text-[#1E88E5]">Barcode</TableHead>
                  <TableHead className="text-[#1E88E5]">Created On</TableHead>
                  <TableHead className="text-[#1E88E5]">Status</TableHead>
                  <TableHead className="text-[#1E88E5]">Size</TableHead>
                  <TableHead className="text-[#1E88E5] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rawResults.map(result => (
                  <TableRow key={result.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">{result.id}</TableCell>
                    <TableCell className="text-[#666666]">{result.testOrderId}</TableCell>
                    <TableCell className="text-[#666666]">{result.barcode}</TableCell>
                    <TableCell className="text-[#666666]">{result.createdOn}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${
                        result.status === "Sent" ? "bg-green-100 text-green-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {result.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{result.size}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRawResult(result);
                          setIsDeleteRawOpen(true);
                        }}
                        className="text-[#F44336] hover:bg-[#FFEBEE]"
                        disabled={result.status !== "Sent"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Render Auto Delete
  const renderAutoDelete = () => (
    <div className="space-y-6">
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1E88E5]">Auto Delete Schedule</CardTitle>
          <CardDescription>Automated cleanup job configuration</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#F5F6FA] border-[#E0E0E0]">
              <CardContent className="pt-6">
                <p className="text-sm text-[#555555] mb-1">Frequency</p>
                <p className="text-lg font-medium text-[#1E88E5]">Daily</p>
              </CardContent>
            </Card>

            <Card className="bg-[#F5F6FA] border-[#E0E0E0]">
              <CardContent className="pt-6">
                <p className="text-sm text-[#555555] mb-1">Last Run</p>
                <p className="text-lg font-medium text-[#1E88E5]">2025-10-17 02:00 AM</p>
              </CardContent>
            </Card>

            <Card className="bg-[#F5F6FA] border-[#E0E0E0]">
              <CardContent className="pt-6">
                <p className="text-sm text-[#555555] mb-1">Next Run</p>
                <p className="text-lg font-medium text-[#1E88E5]">2025-10-18 02:00 AM</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1E88E5]">Auto-Deletion Audit Panel</CardTitle>
          <CardDescription>Automated cleanup events with full traceability</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-12 bg-[#F5F6FA] rounded-lg">
            <Clock className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
            <p className="text-[#666666]">No auto-deletion events recorded</p>
            <p className="text-sm text-[#999999] mt-2">Events will appear here after the next scheduled run</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Reagents Tab
  const renderReagents = () => (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <Card className="shadow-md border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={reagentsTab === "install" ? "default" : "outline"}
              onClick={() => setReagentsTab("install")}
              className={reagentsTab === "install" ? "bg-[#4CAF50] hover:bg-[#388E3C] rounded-xl" : "rounded-xl"}
            >
              <Plus className="h-4 w-4 mr-2" />
              Install Reagent
            </Button>
            <Button
              variant={reagentsTab === "modify" ? "default" : "outline"}
              onClick={() => setReagentsTab("modify")}
              className={reagentsTab === "modify" ? "bg-[#4CAF50] hover:bg-[#388E3C] rounded-xl" : "rounded-xl"}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modify Status
            </Button>
            <Button
              variant={reagentsTab === "delete" ? "default" : "outline"}
              onClick={() => setReagentsTab("delete")}
              className={reagentsTab === "delete" ? "bg-[#4CAF50] hover:bg-[#388E3C] rounded-xl" : "rounded-xl"}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Reagent
            </Button>
            <Button
              variant={reagentsTab === "inventory" ? "default" : "outline"}
              onClick={() => setReagentsTab("inventory")}
              className={reagentsTab === "inventory" ? "bg-[#4CAF50] hover:bg-[#388E3C] rounded-xl" : "rounded-xl"}
            >
              <Package className="h-4 w-4 mr-2" />
              Inventory View
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Content */}
      {reagentsTab === "install" && renderReagentInstall()}
      {reagentsTab === "modify" && renderReagentModify()}
      {reagentsTab === "delete" && renderReagentDelete()}
      {reagentsTab === "inventory" && renderReagentInventory()}
    </div>
  );

  // Render Reagent Install
  const renderReagentInstall = () => (
    <div className="space-y-6">
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E8F5E9] to-white border-b border-[#A5D6A7]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#4CAF50]">Install New Reagent</CardTitle>
              <CardDescription>Add reagents and link them to vendors</CardDescription>
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
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
            {reagents.length === 0 ? (
              <div className="text-center py-12 bg-[#F5F6FA]">
                <Beaker className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
                <p className="text-[#666666]">No reagents installed</p>
              </div>
            ) : (
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Reagent Modify
  const renderReagentModify = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E8F5E9] to-white border-b border-[#A5D6A7]">
        <CardTitle className="text-[#4CAF50]">Modify Reagent Status</CardTitle>
        <CardDescription>Update reagent usage status</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
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
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#FFEBEE] to-white border-b border-[#FFCDD2]">
        <CardTitle className="text-[#F44336]">Delete Reagents</CardTitle>
        <CardDescription>Remove reagent entries from the system</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#FFEBEE] hover:bg-[#FFEBEE]">
                <TableHead className="text-[#F44336]">Reagent Name</TableHead>
                <TableHead className="text-[#F44336]">Lot Number</TableHead>
                <TableHead className="text-[#F44336]">Status</TableHead>
                <TableHead className="text-[#F44336]">Expiry Date</TableHead>
                <TableHead className="text-[#F44336] text-right">Actions</TableHead>
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
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {reagent.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#666666]">{reagent.expirationDate}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedReagent(reagent);
                        setIsReagentDeleteOpen(true);
                      }}
                      className="text-[#F44336] hover:bg-[#FFEBEE]"
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
      </CardContent>
    </Card>
  );

  // Render Reagent Inventory
  const renderReagentInventory = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#E8F5E9] border-[#A5D6A7]">
          <CardContent className="pt-6">
            <p className="text-sm text-[#555555] mb-1">Total Reagents</p>
            <p className="text-3xl font-semibold text-[#4CAF50]">{reagents.length}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#FFEBEE] border-[#FFCDD2]">
          <CardContent className="pt-6">
            <p className="text-sm text-[#555555] mb-1">Low Stock (&lt;200)</p>
            <p className="text-3xl font-semibold text-[#F44336]">
              {reagents.filter(r => r.quantity < 200).length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#FFF8E1] border-[#FFE082]">
          <CardContent className="pt-6">
            <p className="text-sm text-[#555555] mb-1">In Use</p>
            <p className="text-3xl font-semibold text-[#FFA726]">
              {reagents.filter(r => r.status === "In Use").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Chart */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E8F5E9] to-white border-b border-[#A5D6A7]">
          <CardTitle className="text-[#4CAF50]">Reagent Stock Levels</CardTitle>
          <CardDescription>Visual overview of current inventory</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reagentChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" name="Quantity" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  // Render Config Tab
  const renderConfig = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#1E88E5]">Configuration Sync-Up</CardTitle>
            <CardDescription>Synchronize instrument configurations (General + Specific)</CardDescription>
          </div>
          <Button
            onClick={() => setIsConfigSyncOpen(true)}
            className="bg-[#FF9800] hover:bg-[#F57C00] rounded-xl"
          >
            <Zap className="h-4 w-4 mr-2" />
            Sync Configuration
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instructions */}
          <Card className="bg-[#E3F2FD] border-[#90CAF9]">
            <CardHeader>
              <CardTitle className="text-sm text-[#1E88E5]">📋 Sync Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-[#666666]">
                <li>✓ Select instrument from dropdown</li>
                <li>✓ Choose configuration type (General/Specific)</li>
                <li>✓ Click "Sync Now" to apply settings</li>
                <li>✓ Verify sync status in logs below</li>
              </ul>
            </CardContent>
          </Card>

          {/* Recent Syncs */}
          <Card className="bg-[#F5F6FA] border-[#E0E0E0]">
            <CardHeader>
              <CardTitle className="text-sm text-[#333333]">🕐 Recent Syncs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditLogs
                  .filter(log => log.action === "Sync-Up Configuration")
                  .slice(0, 3)
                  .map(log => (
                    <div key={log.id} className="text-xs text-[#666666] p-2 bg-white rounded">
                      <p className="font-medium">{log.details}</p>
                      <p className="text-[#999999]">{log.timestamp}</p>
                    </div>
                  ))}
                {auditLogs.filter(log => log.action === "Sync-Up Configuration").length === 0 && (
                  <p className="text-xs text-[#999999]">No sync logs available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );

  // Render Audit Trail
  const renderAudit = () => (
    <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
      <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
        <CardTitle className="text-[#1E88E5]">Audit Trail - Global Event Log</CardTitle>
        <CardDescription>Complete traceability of all actions in Instrument Service</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
          {auditLogs.length === 0 ? (
            <div className="text-center py-12 bg-[#F5F6FA]">
              <ClipboardList className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
              <p className="text-[#666666]">No audit logs yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1E88E5]">Audit ID</TableHead>
                  <TableHead className="text-[#1E88E5]">Action</TableHead>
                  <TableHead className="text-[#1E88E5]">Module</TableHead>
                  <TableHead className="text-[#1E88E5]">User</TableHead>
                  <TableHead className="text-[#1E88E5]">Timestamp</TableHead>
                  <TableHead className="text-[#1E88E5]">Details</TableHead>
                  <TableHead className="text-[#1E88E5]">Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map(log => (
                  <TableRow key={log.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">{log.id}</TableCell>
                    <TableCell className="text-[#666666]">{log.action}</TableCell>
                    <TableCell className="text-[#666666]">{log.module}</TableCell>
                    <TableCell className="text-[#666666]">{log.user}</TableCell>
                    <TableCell className="text-[#666666]">{log.timestamp}</TableCell>
                    <TableCell className="text-[#666666] max-w-md">{log.details}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${
                        log.result === "Success" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {log.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#666666]">
        <span>Administration</span>
        <span>/</span>
        <span className="text-[#1E88E5] font-medium">Instrument Service Dashboard</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[#1E88E5] mb-2">Instrument Service Dashboard</h1>
        <p className="text-[#555555]">
          Complete visibility and control over laboratory instruments, reagents, and configurations
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
            <Button onClick={handleBloodTestStart} className="bg-[#1E88E5] hover:bg-[#1976D2]">
              <PlayCircle className="h-4 w-4 mr-2" />
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
            <DialogDescription>
              Raw HL7 message for {selectedHL7?.testOrderId}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label className="mb-2 block">Raw HL7 Message (Read-only)</Label>
            <pre className="text-xs font-mono bg-[#F5F6FA] p-4 rounded-lg border border-[#E0E0E0] overflow-x-auto">
              {selectedHL7?.rawMessage}
            </pre>
            {selectedHL7?.errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Error:</strong> {selectedHL7.errorMessage}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHL7DetailOpen(false)}>
              Close
            </Button>
            {selectedHL7?.status === "Failed" && (
              <Button className="bg-[#1E88E5] hover:bg-[#1976D2]">
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-publish
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Raw Result Dialog */}
      <AlertDialog open={isDeleteRawOpen} onOpenChange={setIsDeleteRawOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-[#F44336]">Delete Raw Test Result</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              This data will be permanently deleted from instrument memory.
              <br /><br />
              <strong>Result ID:</strong> {selectedRawResult?.id}<br />
              <strong>Test Order:</strong> {selectedRawResult?.testOrderId}<br />
              <strong>Memory to free:</strong> {selectedRawResult?.size}<br />
              <br />
              Deletion is only allowed if results are successfully backed up.
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRawResult}
              className="bg-[#F44336] hover:bg-[#D32F2F]"
            >
              Delete Result
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reagent Form Dialog */}
      <Dialog open={isReagentFormOpen} onOpenChange={setIsReagentFormOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#4CAF50]">Install New Reagent</DialogTitle>
            <DialogDescription>
              Add reagent and link to vendor information
            </DialogDescription>
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
                onChange={(e) => setReagentForm({ ...reagentForm, quantity: parseInt(e.target.value) || 0 })}
                placeholder="0"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expiryDate">Expiration Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={reagentForm.expirationDate}
                onChange={(e) => setReagentForm({ ...reagentForm, expirationDate: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="vendorName">Vendor Name</Label>
              <Input
                id="vendorName"
                value={reagentForm.vendorName}
                onChange={(e) => setReagentForm({ ...reagentForm, vendorName: e.target.value })}
                placeholder="e.g., MedSupply Inc."
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="vendorContact">Vendor Contact</Label>
              <Input
                id="vendorContact"
                value={reagentForm.vendorContact}
                onChange={(e) => setReagentForm({ ...reagentForm, vendorContact: e.target.value })}
                placeholder="e.g., vendor@medsupply.com"
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReagentFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInstallReagent} className="bg-[#4CAF50] hover:bg-[#388E3C]">
              <Plus className="h-4 w-4 mr-2" />
              Install Reagent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Reagent Dialog */}
      <AlertDialog open={isReagentDeleteOpen} onOpenChange={setIsReagentDeleteOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-[#F44336]">Delete Reagent</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedReagent?.name}</strong>?
              <br /><br />
              <strong>Lot Number:</strong> {selectedReagent?.lotNumber}<br />
              <strong>Quantity:</strong> {selectedReagent?.quantity}<br />
              <br />
              This action will remove the reagent from the system and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReagent}
              className="bg-[#F44336] hover:bg-[#D32F2F]"
            >
              Delete Reagent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Config Sync Dialog */}
      <Dialog open={isConfigSyncOpen} onOpenChange={setIsConfigSyncOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#FF9800]">Sync-Up Configuration</DialogTitle>
            <DialogDescription>
              Synchronize instrument configurations
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="syncInstrument">Instrument ID *</Label>
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

            <div className="grid gap-2">
              <Label htmlFor="configType">Configuration Type</Label>
              <Select
                value={configSyncForm.configType}
                onValueChange={(value: "General" | "Specific") => setConfigSyncForm({ ...configSyncForm, configType: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General Configuration</SelectItem>
                  <SelectItem value="Specific">Specific Configuration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-[#FFF8E1] border border-[#FFE082] rounded-lg">
              <p className="text-sm text-[#F57C00]">
                <strong>ℹ️ Note:</strong> Configuration sync will apply settings including firmware version, calibration parameters, and model-specific configurations.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigSyncOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfigSync} className="bg-[#FF9800] hover:bg-[#F57C00]">
              <Zap className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
