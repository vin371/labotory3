import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  Filter,
  Download,
  Wrench,
  Package,
  Settings,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  PlayCircle,
  PauseCircle,
  Copy,
  FileText,
  Database,
  Calendar,
  User,
  Beaker,
  BarChart3,
  Zap,
  Shield,
  Archive,
  Power
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";

type SubTab = "instruments" | "reagents" | "configurations";

interface Instrument {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  manufacturer: string;
  installationDate: string;
  status: "Ready" | "Processing" | "Maintenance" | "Error" | "Inactive";
  associatedReagents: string[];
  associatedConfigurations: string[];
  createdDate: string;
  createdBy: string;
  lastUpdated: string;
  isActive: boolean;
  deactivationDate?: string;
  scheduledDeletionDate?: string;
  deletionStatus?: "Scheduled" | "Cancelled" | "Deleted";
}

interface VendorSupply {
  id: string;
  reagentName: string;
  catalogNumber: string;
  manufacturer: string;
  casNumber: string;
  vendorName: string;
  vendorId: string;
  poNumber: string;
  orderDate: string;
  receiptDate: string;
  quantityReceived: number;
  unitOfMeasure: string;
  lotNumber: string;
  expirationDate: string;
  receivedBy: string;
  storageLocation: string;
  status: "Received" | "Partial" | "Returned";
}

interface UsageHistory {
  id: string;
  reagentName: string;
  quantityUsed: number;
  dateTimeOfUse: string;
  user: string;
  actionType: "Used" | "Adjusted" | "Returned";
}

interface Configuration {
  id: string;
  name: string;
  description: string;
  parameterType: "Numeric" | "Text" | "Boolean";
  defaultValue: string;
  currentValue: string;
  effectiveDate: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
  isDeleted?: boolean;
}

interface SpecificConfiguration {
  id: string;
  instrumentModel: string;
  parameterName: string;
  description: string;
  value: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
  isDeleted?: boolean;
}

type ConfigSubTab = "general" | "specific";

// Mock Data
const mockInstruments: Instrument[] = [
  {
    id: "INS-001",
    name: "Hematology Analyzer XN-1000",
    model: "XN-1000",
    serialNumber: "SN-XN1000-001",
    manufacturer: "Hematology",
    installationDate: "01/15/2024",
    status: "Ready",
    associatedReagents: ["CBC Reagent Kit", "Hemoglobin Reagent"],
    associatedConfigurations: ["Auto-calibration", "QC Settings"],
    createdDate: "2024-01-15 09:00:00",
    createdBy: "admin@lab.com",
    lastUpdated: "10/20/2025 14:30",
    isActive: true
  },
  {
    id: "INS-002",
    name: "Chemistry Analyzer AU-680",
    model: "AU-680",
    serialNumber: "SN-AU680-002",
    manufacturer: "Chemistry",
    installationDate: "03/20/2024",
    status: "Processing",
    associatedReagents: ["Glucose Reagent", "Lipid Panel Reagent"],
    associatedConfigurations: ["Temperature Control", "Sample Volume"],
    createdDate: "2024-03-20 10:30:00",
    createdBy: "admin@lab.com",
    lastUpdated: "10/20/2025 13:15",
    isActive: true
  },
  {
    id: "INS-003",
    name: "Immunology Analyzer i2000",
    model: "i2000",
    serialNumber: "SN-i2000-003",
    manufacturer: "Immunology",
    installationDate: "05/10/2024",
    status: "Error",
    associatedReagents: ["Immunoassay Reagent"],
    associatedConfigurations: ["Detection Settings"],
    createdDate: "2024-05-10 08:00:00",
    createdBy: "admin@lab.com",
    lastUpdated: "10/20/2025 12:00",
    isActive: true
  },
  {
    id: "INS-004",
    name: "Microbiology Analyzer VITEK 2",
    model: "VITEK 2",
    serialNumber: "SN-VITEK2-004",
    manufacturer: "Microbiology",
    installationDate: "06/15/2024",
    status: "Maintenance",
    associatedReagents: ["Culture Media", "Identification Reagent"],
    associatedConfigurations: ["Incubation Settings"],
    createdDate: "2024-06-15 10:00:00",
    createdBy: "admin@lab.com",
    lastUpdated: "10/19/2025 16:45",
    isActive: true
  },
  {
    id: "INS-005",
    name: "Coagulation Analyzer ACL Top 500",
    model: "ACL Top 500",
    serialNumber: "SN-ACL500-005",
    manufacturer: "Coagulation",
    installationDate: "07/20/2024",
    status: "Inactive",
    associatedReagents: ["PT Reagent", "APTT Reagent"],
    associatedConfigurations: ["Timer Settings"],
    createdDate: "2024-07-20 11:00:00",
    createdBy: "admin@lab.com",
    lastUpdated: "10/15/2025 10:20",
    isActive: false,
    deactivationDate: "2025-10-15",
    scheduledDeletionDate: "2026-01-15",
    deletionStatus: "Scheduled"
  }
];

const mockVendorSupplies: VendorSupply[] = [
  {
    id: "VS-001",
    reagentName: "CBC Reagent Kit",
    catalogNumber: "CAT-CBC-2024",
    manufacturer: "ReagentCorp",
    casNumber: "12345-67-8",
    vendorName: "MedSupply Vietnam",
    vendorId: "VENDOR-001",
    poNumber: "PO-2024-1001",
    orderDate: "2024-09-01",
    receiptDate: "2024-09-15",
    quantityReceived: 100,
    unitOfMeasure: "kits",
    lotNumber: "LOT-2024-Q3-001",
    expirationDate: "2025-09-14",
    receivedBy: "warehouse@lab.com",
    storageLocation: "Refrigerator A, Shelf 2",
    status: "Received"
  },
  {
    id: "VS-002",
    reagentName: "Glucose Reagent",
    catalogNumber: "CAT-GLU-500",
    manufacturer: "ChemLab Pro",
    casNumber: "98765-43-2",
    vendorName: "LabSupplies Ltd",
    vendorId: "VENDOR-002",
    poNumber: "PO-2024-1002",
    orderDate: "2024-10-01",
    receiptDate: "2024-10-10",
    quantityReceived: 50,
    unitOfMeasure: "bottles",
    lotNumber: "LOT-2024-Q4-002",
    expirationDate: "2026-10-09",
    receivedBy: "warehouse@lab.com",
    storageLocation: "Cabinet B, Row 3",
    status: "Received"
  }
];

const mockUsageHistory: UsageHistory[] = [
  {
    id: "UH-001",
    reagentName: "CBC Reagent Kit",
    quantityUsed: 5,
    dateTimeOfUse: "2025-10-16 09:30:00",
    user: "labuser01@lab.com",
    actionType: "Used"
  },
  {
    id: "UH-002",
    reagentName: "Glucose Reagent",
    quantityUsed: 2,
    dateTimeOfUse: "2025-10-16 14:15:00",
    user: "labuser02@lab.com",
    actionType: "Used"
  },
  {
    id: "UH-003",
    reagentName: "Hemoglobin Reagent",
    quantityUsed: 1,
    dateTimeOfUse: "2025-10-17 10:00:00",
    user: "labuser01@lab.com",
    actionType: "Adjusted"
  }
];

// Parameter List from SRS 2.4
const parameterList = [
  { name: "Lockout Policy", type: "Numeric" as const, description: "Maximum failed login attempts before account lockout", defaultValue: "5" },
  { name: "AI Auto Review", type: "Boolean" as const, description: "Enable automatic AI-based result validation", defaultValue: "true" },
  { name: "Session Timeout", type: "Numeric" as const, description: "User session timeout duration (in minutes)", defaultValue: "30" },
  { name: "Password Policy", type: "Text" as const, description: "Password complexity requirements", defaultValue: "Strong" },
  { name: "Expired Password", type: "Numeric" as const, description: "Password expiration period (in days)", defaultValue: "90" },
  { name: "Automatic Deactivation", type: "Boolean" as const, description: "Auto-deactivate inactive instruments after 30 days", defaultValue: "true" }
];

const mockGeneralConfigurations: Configuration[] = [
  {
    id: "GCF-001",
    name: "Lockout Policy",
    description: "Maximum failed login attempts before account lockout",
    parameterType: "Numeric",
    defaultValue: "5",
    currentValue: "3",
    effectiveDate: "2024-01-01",
    lastModifiedBy: "admin@lab.com",
    lastModifiedOn: "2025-10-15 10:20"
  },
  {
    id: "GCF-002",
    name: "AI Auto Review",
    description: "Enable automatic AI-based result validation",
    parameterType: "Boolean",
    defaultValue: "false",
    currentValue: "true",
    effectiveDate: "2024-01-01",
    lastModifiedBy: "admin@lab.com",
    lastModifiedOn: "2025-10-16 09:10"
  },
  {
    id: "GCF-003",
    name: "Session Timeout",
    description: "User session timeout duration (in minutes)",
    parameterType: "Numeric",
    defaultValue: "15",
    currentValue: "20",
    effectiveDate: "2024-01-01",
    lastModifiedBy: "admin@lab.com",
    lastModifiedOn: "2025-10-10 08:00"
  },
  {
    id: "GCF-004",
    name: "Password Policy",
    description: "Password complexity requirements",
    parameterType: "Text",
    defaultValue: "8–12 chars",
    currentValue: "10–14 chars",
    effectiveDate: "2024-01-01",
    lastModifiedBy: "admin@lab.com",
    lastModifiedOn: "2025-10-12 13:45"
  },
  {
    id: "GCF-005",
    name: "Expired Password",
    description: "Password expiration period (in days)",
    parameterType: "Numeric",
    defaultValue: "90",
    currentValue: "60",
    effectiveDate: "2024-01-01",
    lastModifiedBy: "admin@lab.com",
    lastModifiedOn: "2025-10-05 16:30"
  },
  {
    id: "GCF-006",
    name: "Automatic Deactivation",
    description: "Auto-deactivate inactive instruments after 30 days",
    parameterType: "Boolean",
    defaultValue: "true",
    currentValue: "true",
    effectiveDate: "2024-01-01",
    lastModifiedBy: "admin@lab.com",
    lastModifiedOn: "2025-10-02 14:00"
  }
];

const mockSpecificConfigurations: SpecificConfiguration[] = [
  {
    id: "SC001",
    instrumentModel: "CentriMax 5000",
    parameterName: "Auto-calibration Interval",
    description: "Adjusts calibration frequency for centrifuge",
    value: "12 hours",
    lastModifiedBy: "admin@lab.com",
    lastModifiedOn: "2025-10-12 09:30"
  },
  {
    id: "SC002",
    instrumentModel: "SpectroLite X",
    parameterName: "QC Settings",
    description: "Quality control frequency per day",
    value: "Twice Daily",
    lastModifiedBy: "admin@lab.com",
    lastModifiedOn: "2025-10-14 10:00"
  },
  {
    id: "SC003",
    instrumentModel: "Hemolyzer 7",
    parameterName: "Enable Debug Mode",
    description: "Enables diagnostic logs for analyzer",
    value: "True",
    lastModifiedBy: "admin@lab.com",
    lastModifiedOn: "2025-10-15 15:45"
  }
];

const availableReagents = ["CBC Reagent Kit", "Hemoglobin Reagent", "Glucose Reagent", "Lipid Panel Reagent", "PCR Master Mix", "DNA Polymerase"];
const availableConfigs = ["Auto-calibration", "QC Settings", "Temperature Control", "Sample Volume", "Cycle Parameters", "Enable Debug Mode"];

export function WarehouseService() {
  const { user: currentUser } = useAuth();
  const [currentSubTab, setCurrentSubTab] = useState<SubTab>("instruments");
  
  // Instruments State
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [searchInstrument, setSearchInstrument] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAddInstrumentOpen, setIsAddInstrumentOpen] = useState(false);
  const [isViewInstrumentOpen, setIsViewInstrumentOpen] = useState(false);
  const [isEditInstrumentOpen, setIsEditInstrumentOpen] = useState(false);
  const [isDeleteInstrumentOpen, setIsDeleteInstrumentOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [instrumentToDelete, setInstrumentToDelete] = useState<Instrument | null>(null);
  const [cloneFromExisting, setCloneFromExisting] = useState(false);
  const [cloneSource, setCloneSource] = useState("");

  // Reagents State
  const [vendorSupplies, setVendorSupplies] = useState<VendorSupply[]>(mockVendorSupplies);
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>(mockUsageHistory);
  const [searchReagent, setSearchReagent] = useState("");
  const [filterVendor, setFilterVendor] = useState("all");
  const [searchUsage, setSearchUsage] = useState("");

  // Configurations State
  const [configSubTab, setConfigSubTab] = useState<ConfigSubTab>("general");
  const [generalConfigurations, setGeneralConfigurations] = useState<Configuration[]>(mockGeneralConfigurations);
  const [specificConfigurations, setSpecificConfigurations] = useState<SpecificConfiguration[]>(mockSpecificConfigurations);
  const [searchConfig, setSearchConfig] = useState("");
  const [filterParamType, setFilterParamType] = useState("all");
  const [isAddConfigOpen, setIsAddConfigOpen] = useState(false);
  const [isAddSpecificConfigOpen, setIsAddSpecificConfigOpen] = useState(false);
  const [isEditGeneralConfigOpen, setIsEditGeneralConfigOpen] = useState(false);
  const [isEditSpecificConfigOpen, setIsEditSpecificConfigOpen] = useState(false);
  const [isDeleteGeneralConfigOpen, setIsDeleteGeneralConfigOpen] = useState(false);
  const [isDeleteSpecificConfigOpen, setIsDeleteSpecificConfigOpen] = useState(false);
  const [selectedGeneralConfig, setSelectedGeneralConfig] = useState<Configuration | null>(null);
  const [selectedSpecificConfig, setSelectedSpecificConfig] = useState<SpecificConfiguration | null>(null);

  // Instrument Form State
  const [instrumentForm, setInstrumentForm] = useState({
    name: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    installationDate: "",
    associatedReagents: [] as string[],
    associatedConfigurations: [] as string[]
  });

  const [instrumentErrors, setInstrumentErrors] = useState({
    name: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    installationDate: ""
  });

  // Configuration Form State
  const [configForm, setConfigForm] = useState({
    name: "",
    description: "",
    parameterType: "Text" as "Numeric" | "Text" | "Boolean",
    defaultValue: "",
    currentValue: "",
    effectiveDate: ""
  });

  const [configErrors, setConfigErrors] = useState({
    name: "",
    defaultValue: "",
    currentValue: "",
    effectiveDate: ""
  });

  // Specific Configuration Form State
  const [specificConfigForm, setSpecificConfigForm] = useState({
    instrumentModel: "",
    parameterName: "",
    description: "",
    value: ""
  });

  const [specificConfigErrors, setSpecificConfigErrors] = useState({
    instrumentModel: "",
    parameterName: "",
    value: ""
  });

  // Filter Instruments
  const filteredInstruments = instruments.filter(inst => {
    const matchesSearch = 
      inst.name.toLowerCase().includes(searchInstrument.toLowerCase()) ||
      inst.model.toLowerCase().includes(searchInstrument.toLowerCase()) ||
      inst.serialNumber.toLowerCase().includes(searchInstrument.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || inst.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Statistics
  const instrumentStats = {
    total: instruments.length,
    ready: instruments.filter(i => i.status === "Ready").length,
    processing: instruments.filter(i => i.status === "Processing").length,
    maintenance: instruments.filter(i => i.status === "Maintenance").length,
    error: instruments.filter(i => i.status === "Error").length,
    inactive: instruments.filter(i => i.status === "Inactive").length
  };

  // Validate Instrument Form
  const validateInstrumentForm = (): boolean => {
    const errors = {
      name: "",
      model: "",
      serialNumber: "",
      manufacturer: "",
      installationDate: ""
    };

    if (!instrumentForm.name.trim()) {
      errors.name = "Instrument name is required";
    } else {
      const duplicate = instruments.find(i => 
        i.name.toLowerCase() === instrumentForm.name.toLowerCase() && 
        (!selectedInstrument || i.id !== selectedInstrument.id)
      );
      if (duplicate) {
        errors.name = "Instrument already exists";
      }
    }

    if (!instrumentForm.model.trim()) {
      errors.model = "Model/Type is required";
    }

    if (!instrumentForm.serialNumber.trim()) {
      errors.serialNumber = "Serial number is required";
    }

    if (!instrumentForm.manufacturer.trim()) {
      errors.manufacturer = "Manufacturer is required";
    }

    if (!instrumentForm.installationDate) {
      errors.installationDate = "Installation date is required (MM/DD/YYYY)";
    } else {
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
      if (!dateRegex.test(instrumentForm.installationDate)) {
        errors.installationDate = "Date must be in MM/DD/YYYY format";
      }
    }

    setInstrumentErrors(errors);
    return !Object.values(errors).some(err => err !== "");
  };

  // Instrument CRUD Operations
  const handleAddInstrument = () => {
    if (!validateInstrumentForm()) {
      toast.error("Validation failed", {
        description: "Please fix the errors in the form"
      });
      return;
    }

    const newInstrument: Instrument = {
      id: `INST-${String(instruments.length + 1).padStart(3, "0")}`,
      name: instrumentForm.name,
      model: instrumentForm.model,
      serialNumber: instrumentForm.serialNumber,
      manufacturer: instrumentForm.manufacturer,
      installationDate: instrumentForm.installationDate,
      status: "Ready",
      associatedReagents: instrumentForm.associatedReagents,
      associatedConfigurations: instrumentForm.associatedConfigurations,
      createdDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      createdBy: currentUser?.email || "admin@lab.com",
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19),
      isActive: true
    };

    setInstruments([newInstrument, ...instruments]);
    setIsAddInstrumentOpen(false);
    resetInstrumentForm();

    toast.success("✅ Instrument added successfully!", {
      description: `${newInstrument.name} has been created.`
    });

    console.log(`[INSTRUMENT_CREATED] ${newInstrument.id}, Reagents: ${newInstrument.associatedReagents.join(', ')}, Configs: ${newInstrument.associatedConfigurations.join(', ')}, By: ${newInstrument.createdBy}`);
  };

  const handleCloneInstrument = () => {
    if (cloneSource && cloneFromExisting) {
      const source = instruments.find(i => i.id === cloneSource);
      if (source) {
        setInstrumentForm({
          name: `${source.name} (Copy)`,
          model: source.model,
          serialNumber: "",
          manufacturer: source.manufacturer,
          installationDate: "",
          associatedReagents: [...source.associatedReagents],
          associatedConfigurations: [...source.associatedConfigurations]
        });
        toast.info("📋 Cloned from existing instrument");
      }
    }
  };

  const handleViewInstrument = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setIsViewInstrumentOpen(true);
  };

  const handleEditInstrument = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setInstrumentForm({
      name: instrument.name,
      model: instrument.model,
      serialNumber: instrument.serialNumber,
      manufacturer: instrument.manufacturer,
      installationDate: instrument.installationDate,
      associatedReagents: instrument.associatedReagents,
      associatedConfigurations: instrument.associatedConfigurations
    });
    setInstrumentErrors({ name: "", model: "", serialNumber: "", manufacturer: "", installationDate: "" });
    setIsEditInstrumentOpen(true);
  };

  const handleUpdateInstrument = () => {
    if (!validateInstrumentForm()) {
      toast.error("Validation failed", {
        description: "Please fix the errors in the form"
      });
      return;
    }

    if (selectedInstrument) {
      const updatedInstrument = {
        ...selectedInstrument,
        name: instrumentForm.name,
        model: instrumentForm.model,
        serialNumber: instrumentForm.serialNumber,
        manufacturer: instrumentForm.manufacturer,
        installationDate: instrumentForm.installationDate,
        associatedReagents: instrumentForm.associatedReagents,
        associatedConfigurations: instrumentForm.associatedConfigurations,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      setInstruments(instruments.map(i => i.id === selectedInstrument.id ? updatedInstrument : i));
      setIsEditInstrumentOpen(false);
      setSelectedInstrument(null);
      resetInstrumentForm();

      toast.success("✅ Instrument updated successfully!");
      console.log(`[INSTRUMENT_UPDATED] ${updatedInstrument.id}, By: ${currentUser?.email}`);
    }
  };

  const handleDeleteInstrument = (instrument: Instrument) => {
    setInstrumentToDelete(instrument);
    setIsDeleteInstrumentOpen(true);
  };

  const handleDeleteInstrumentConfirm = () => {
    if (instrumentToDelete) {
      setInstruments(instruments.filter(i => i.id !== instrumentToDelete.id));

      toast.success("✅ Instrument deleted successfully!", {
        description: `${instrumentToDelete.name} has been removed.`
      });

      console.log(`[INSTRUMENT_DELETED] ${instrumentToDelete.id}, By: ${currentUser?.email}`);

      setIsDeleteInstrumentOpen(false);
      setInstrumentToDelete(null);
    }
  };

  const handleToggleActive = (instrument: Instrument) => {
    const newStatus = !instrument.isActive;
    const updated = {
      ...instrument,
      isActive: newStatus,
      status: newStatus ? "Ready" : "Inactive" as "Ready" | "Processing" | "Maintenance" | "Error" | "Inactive",
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ...(newStatus ? { 
        deactivationDate: undefined,
        scheduledDeletionDate: undefined,
        deletionStatus: undefined
      } : {
        deactivationDate: new Date().toISOString().split('T')[0],
        scheduledDeletionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deletionStatus: "Scheduled" as "Scheduled" | "Cancelled" | "Deleted"
      })
    };

    setInstruments(instruments.map(i => i.id === instrument.id ? updated : i));

    if (newStatus) {
      toast.success("✅ Instrument activated", {
        description: "Deletion schedule has been cancelled."
      });
    } else {
      toast.warning("⚠️ Instrument deactivated", {
        description: "Auto-delete scheduled in 3 months."
      });
    }

    console.log(`[INSTRUMENT_${newStatus ? 'ACTIVATED' : 'DEACTIVATED'}] ${instrument.id}, By: ${currentUser?.email}`);
  };

  const handleRecheckStatus = (instrument: Instrument) => {
    toast.info("🔄 Rechecking instrument status...");
    
    setTimeout(() => {
      const randomStatuses: ("Ready" | "Processing" | "Maintenance" | "Error")[] = ["Ready", "Processing", "Error"];
      const newStatus = randomStatuses[Math.floor(Math.random() * randomStatuses.length)];
      
      const updated = {
        ...instrument,
        status: newStatus,
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };

      setInstruments(instruments.map(i => i.id === instrument.id ? updated : i));

      if (newStatus === "Error") {
        toast.error("❌ Instrument status: Error", {
          description: "Communication failure detected. Please check connections."
        });
      } else {
        toast.success(`✅ Instrument status: ${newStatus}`);
      }

      console.log(`[INSTRUMENT_STATUS_RECHECK] ${instrument.id}, New Status: ${newStatus}`);
    }, 1500);
  };

  const handleCancelDeletion = (instrument: Instrument) => {
    const updated = {
      ...instrument,
      deletionStatus: "Cancelled" as "Scheduled" | "Cancelled" | "Deleted"
    };

    setInstruments(instruments.map(i => i.id === instrument.id ? updated : i));
    toast.success("✅ Deletion cancelled");
    console.log(`[DELETION_CANCELLED] ${instrument.id}`);
  };

  const handleForceDelete = (instrument: Instrument) => {
    setInstruments(instruments.filter(i => i.id !== instrument.id));
    toast.success("✅ Instrument force deleted");
    console.log(`[FORCE_DELETE] ${instrument.id}, By: ${currentUser?.email}`);
  };

  const resetInstrumentForm = () => {
    setInstrumentForm({
      name: "",
      model: "",
      serialNumber: "",
      manufacturer: "",
      installationDate: "",
      associatedReagents: [],
      associatedConfigurations: []
    });
    setInstrumentErrors({ name: "", model: "", serialNumber: "", manufacturer: "", installationDate: "" });
    setCloneFromExisting(false);
    setCloneSource("");
  };

  // Configuration Operations
  const validateConfigForm = (): boolean => {
    const errors = {
      name: "",
      defaultValue: "",
      currentValue: "",
      effectiveDate: ""
    };

    if (!configForm.name.trim()) {
      errors.name = "Configuration name is required";
    } else {
      const duplicate = generalConfigurations.find(c => 
        c.name.toLowerCase() === configForm.name.toLowerCase() && 
        !c.isDeleted &&
        (!selectedGeneralConfig || c.id !== selectedGeneralConfig.id)
      );
      if (duplicate) {
        errors.name = "Configuration already exists";
      }
    }

    if (!configForm.defaultValue.trim()) {
      errors.defaultValue = "Default value is required";
    }

    if (!configForm.currentValue.trim()) {
      errors.currentValue = "Current value is required";
    }

    if (!configForm.effectiveDate) {
      errors.effectiveDate = "Effective date is required";
    }

    setConfigErrors(errors);
    return !Object.values(errors).some(err => err !== "");
  };

  const handleAddConfig = () => {
    if (!configForm.name.trim()) {
      toast.error("Please select a configuration from the Parameter List");
      return;
    }
    if (!configForm.currentValue.trim()) {
      toast.error("Current value is required");
      return;
    }

    const newConfig: Configuration = {
      id: `GCF-${String(generalConfigurations.length + 1).padStart(3, "0")}`,
      name: configForm.name,
      description: configForm.description,
      parameterType: configForm.parameterType,
      defaultValue: configForm.defaultValue,
      currentValue: configForm.currentValue,
      effectiveDate: new Date().toISOString().split('T')[0],
      lastModifiedBy: currentUser?.email || "admin@lab.com",
      lastModifiedOn: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')
    };

    setGeneralConfigurations([newConfig, ...generalConfigurations]);
    setIsAddConfigOpen(false);
    resetConfigForm();

    toast.success("✅ Configuration created successfully!", {
      description: "Changes synced to all services."
    });

    console.log(`[CONFIG_CREATED] ${newConfig.id}, By: ${newConfig.lastModifiedBy}`);
  };

  const handleEditGeneralConfig = (config: Configuration) => {
    setSelectedGeneralConfig(config);
    setConfigForm({
      name: config.name,
      description: config.description,
      parameterType: config.parameterType,
      defaultValue: config.defaultValue,
      currentValue: config.currentValue,
      effectiveDate: config.effectiveDate
    });
    setConfigErrors({ name: "", defaultValue: "", currentValue: "", effectiveDate: "" });
    setIsEditGeneralConfigOpen(true);
  };

  const handleUpdateGeneralConfig = () => {
    if (!configForm.currentValue.trim()) {
      toast.error("Current value is required");
      return;
    }

    if (selectedGeneralConfig) {
      const updatedConfig = {
        ...selectedGeneralConfig,
        currentValue: configForm.currentValue,
        lastModifiedBy: currentUser?.email || "admin@lab.com",
        lastModifiedOn: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')
      };

      setGeneralConfigurations(generalConfigurations.map(c => c.id === selectedGeneralConfig.id ? updatedConfig : c));
      setIsEditGeneralConfigOpen(false);
      setSelectedGeneralConfig(null);
      resetConfigForm();

      toast.success("✅ Configuration updated successfully!", {
        description: "Configuration updated and synced."
      });

      console.log(`[CONFIG_UPDATED] ${updatedConfig.id}, Changed: currentValue, By: ${updatedConfig.lastModifiedBy}`);
    }
  };

  const handleDeleteGeneralConfig = (config: Configuration) => {
    setSelectedGeneralConfig(config);
    setIsDeleteGeneralConfigOpen(true);
  };

  const handleDeleteGeneralConfigConfirm = () => {
    if (selectedGeneralConfig) {
      setGeneralConfigurations(generalConfigurations.map(c => 
        c.id === selectedGeneralConfig.id ? { ...c, isDeleted: true } : c
      ));

      toast.success("✅ Configuration deleted successfully!", {
        description: "Deletion synced to all services."
      });

      console.log(`[CONFIG_DELETED] ${selectedGeneralConfig.id}, By: ${currentUser?.email}`);

      setIsDeleteGeneralConfigOpen(false);
      setSelectedGeneralConfig(null);
    }
  };

  const resetConfigForm = () => {
    setConfigForm({
      name: "",
      description: "",
      parameterType: "Text",
      defaultValue: "",
      currentValue: "",
      effectiveDate: ""
    });
    setConfigErrors({ name: "", defaultValue: "", currentValue: "", effectiveDate: "" });
  };

  const resetSpecificConfigForm = () => {
    setSpecificConfigForm({
      instrumentModel: "",
      parameterName: "",
      description: "",
      value: ""
    });
    setSpecificConfigErrors({ instrumentModel: "", parameterName: "", value: "" });
  };

  // Specific Configuration Handlers
  const handleAddSpecificConfig = () => {
    if (!specificConfigForm.instrumentModel.trim()) {
      toast.error("Please select an instrument model");
      return;
    }
    if (!specificConfigForm.parameterName.trim()) {
      toast.error("Please select a parameter name");
      return;
    }
    if (!specificConfigForm.value.trim()) {
      toast.error("Value is required");
      return;
    }

    const newConfig: SpecificConfiguration = {
      id: `SC${String(specificConfigurations.length + 1).padStart(3, "0")}`,
      instrumentModel: specificConfigForm.instrumentModel,
      parameterName: specificConfigForm.parameterName,
      description: specificConfigForm.description,
      value: specificConfigForm.value,
      lastModifiedBy: currentUser?.email || "admin@lab.com",
      lastModifiedOn: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')
    };

    setSpecificConfigurations([newConfig, ...specificConfigurations]);
    setIsAddSpecificConfigOpen(false);
    resetSpecificConfigForm();

    toast.success("✅ Specific configuration saved!", {
      description: "Changes synced to all connected services."
    });

    console.log(`[SPECIFIC_CONFIG_CREATED] ${newConfig.id}, By: ${newConfig.lastModifiedBy}`);
  };

  const handleEditSpecificConfig = (config: SpecificConfiguration) => {
    setSelectedSpecificConfig(config);
    setSpecificConfigForm({
      instrumentModel: config.instrumentModel,
      parameterName: config.parameterName,
      description: config.description,
      value: config.value
    });
    setSpecificConfigErrors({ instrumentModel: "", parameterName: "", value: "" });
    setIsEditSpecificConfigOpen(true);
  };

  const handleUpdateSpecificConfig = () => {
    if (!specificConfigForm.value.trim()) {
      toast.error("Value is required");
      return;
    }

    if (selectedSpecificConfig) {
      const updatedConfig = {
        ...selectedSpecificConfig,
        value: specificConfigForm.value,
        description: specificConfigForm.description,
        lastModifiedBy: currentUser?.email || "admin@lab.com",
        lastModifiedOn: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '')
      };

      setSpecificConfigurations(specificConfigurations.map(c => c.id === selectedSpecificConfig.id ? updatedConfig : c));
      setIsEditSpecificConfigOpen(false);
      setSelectedSpecificConfig(null);
      resetSpecificConfigForm();

      toast.success("✅ Specific configuration updated!", {
        description: "Changes synced to all connected services."
      });

      console.log(`[SPECIFIC_CONFIG_UPDATED] ${updatedConfig.id}, By: ${updatedConfig.lastModifiedBy}`);
    }
  };

  const handleDeleteSpecificConfig = (config: SpecificConfiguration) => {
    setSelectedSpecificConfig(config);
    setIsDeleteSpecificConfigOpen(true);
  };

  const handleDeleteSpecificConfigConfirm = () => {
    if (selectedSpecificConfig) {
      setSpecificConfigurations(specificConfigurations.map(c => 
        c.id === selectedSpecificConfig.id ? { ...c, isDeleted: true } : c
      ));

      toast.success("✅ Specific configuration deleted!", {
        description: "Deletion synced to all services."
      });

      console.log(`[SPECIFIC_CONFIG_DELETED] ${selectedSpecificConfig.id}, By: ${currentUser?.email}`);

      setIsDeleteSpecificConfigOpen(false);
      setSelectedSpecificConfig(null);
    }
  };

  const handleExportVendorSupplies = () => {
    toast.success("📊 Exporting to Excel...", {
      description: `${vendorSupplies.length} vendor supply records will be exported.`
    });

    setTimeout(() => {
      toast.success("✅ Excel file ready: Vendor_Supply_History.xlsx");
      console.log(`[EXPORT_VENDOR_SUPPLIES] Records: ${vendorSupplies.length}`);
    }, 1500);
  };

  const handleExportUsageHistory = () => {
    toast.success("📊 Exporting usage history...", {
      description: `${usageHistory.length} usage records will be exported.`
    });

    setTimeout(() => {
      toast.success("✅ File ready: Reagent_Usage_History.xlsx");
      console.log(`[EXPORT_USAGE] Records: ${usageHistory.length}`);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Error":
        return "bg-red-100 text-red-800 border-red-200";
      case "Inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Ready":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Processing":
        return <PlayCircle className="h-4 w-4" />;
      case "Maintenance":
        return <Wrench className="h-4 w-4" />;
      case "Error":
        return <XCircle className="h-4 w-4" />;
      case "Inactive":
        return <PauseCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const styles = {
      "Ready": "bg-green-100 text-green-800 border-green-200",
      "Processing": "bg-blue-100 text-blue-800 border-blue-200",
      "Maintenance": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Error": "bg-red-100 text-red-800 border-red-200",
      "Inactive": "bg-gray-100 text-gray-800 border-gray-200",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  // Render Content based on SubTab
  const renderContent = () => {
    switch (currentSubTab) {
      case "instruments":
        return renderInstruments();
      case "reagents":
        return renderReagents();
      case "configurations":
        return renderConfigurations();
      default:
        return renderInstruments();
    }
  };

  // Render Instruments Tab
  const renderInstruments = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="shadow-md border-[#B3D9FF] bg-gradient-to-br from-[#E3F2FD] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Total</p>
                <p className="text-3xl font-semibold text-[#1976D2]">{instrumentStats.total}</p>
              </div>
              <Wrench className="h-8 w-8 text-[#1976D2] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#A5D6A7] bg-gradient-to-br from-[#E8F5E9] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Ready</p>
                <p className="text-3xl font-semibold text-[#388E3C]">{instrumentStats.ready}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-[#388E3C] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#90CAF9] bg-gradient-to-br from-[#E3F2FD] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Processing</p>
                <p className="text-3xl font-semibold text-[#1976D2]">{instrumentStats.processing}</p>
              </div>
              <PlayCircle className="h-8 w-8 text-[#1976D2] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#FFE082] bg-gradient-to-br from-[#FFF8E1] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Maintenance</p>
                <p className="text-3xl font-semibold text-[#F57C00]">{instrumentStats.maintenance}</p>
              </div>
              <Wrench className="h-8 w-8 text-[#F57C00] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#EF9A9A] bg-gradient-to-br from-[#FFEBEE] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Error</p>
                <p className="text-3xl font-semibold text-[#D32F2F]">{instrumentStats.error}</p>
              </div>
              <XCircle className="h-8 w-8 text-[#D32F2F] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#CFD8DC] bg-gradient-to-br from-[#ECEFF1] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Inactive</p>
                <p className="text-3xl font-semibold text-[#546E7A]">{instrumentStats.inactive}</p>
              </div>
              <PauseCircle className="h-8 w-8 text-[#546E7A] opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instruments List */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1976D2]">Instruments Management</CardTitle>
              <CardDescription className="text-[#555555]">
                View and manage laboratory instruments
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Search instruments..."
                value={searchInstrument}
                onChange={(e) => setSearchInstrument(e.target.value)}
                className="pl-10 rounded-xl border-[#E0E6ED]"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px] rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Error">Error</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Table - Simple Lab User Style */}
          <div className="flex items-center gap-3 mb-6">
            <Dialog open={isAddInstrumentOpen} onOpenChange={(open) => {
              setIsAddInstrumentOpen(open);
              if (!open) resetInstrumentForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-xl shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Instrument
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-[#1976D2]">Add New Instrument</DialogTitle>
                  <DialogDescription>Create a new instrument with optional reagents and configurations</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4">
                  <div className="grid gap-4 py-4">
                    {/* Clone Option */}
                    <div className="flex items-center gap-3 p-3 bg-[#E3F2FD] rounded-lg">
                      <Checkbox
                        checked={cloneFromExisting}
                        onCheckedChange={(checked) => {
                          setCloneFromExisting(!!checked);
                          if (!checked) setCloneSource("");
                        }}
                      />
                      <Label className="text-[#1976D2] cursor-pointer">Clone from existing instrument</Label>
                    </div>

                    {cloneFromExisting && (
                      <div className="grid gap-2">
                        <Label>Select Source Instrument</Label>
                        <div className="flex gap-2">
                          <Select value={cloneSource} onValueChange={setCloneSource}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose instrument to clone" />
                            </SelectTrigger>
                            <SelectContent>
                              {instruments.filter(i => i.isActive).map(inst => (
                                <SelectItem key={inst.id} value={inst.id}>
                                  {inst.name} ({inst.model})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button variant="outline" onClick={handleCloneInstrument}>
                            <Copy className="h-4 w-4 mr-2" />
                            Clone
                          </Button>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="grid gap-2">
                      <Label htmlFor="name">Instrument Name *</Label>
                      <Input
                        id="name"
                        value={instrumentForm.name}
                        onChange={(e) => setInstrumentForm({ ...instrumentForm, name: e.target.value })}
                        className={instrumentErrors.name ? "border-red-500" : ""}
                      />
                      {instrumentErrors.name && <p className="text-xs text-red-600">{instrumentErrors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="model">Model / Type *</Label>
                        <Input
                          id="model"
                          value={instrumentForm.model}
                          onChange={(e) => setInstrumentForm({ ...instrumentForm, model: e.target.value })}
                          className={instrumentErrors.model ? "border-red-500" : ""}
                        />
                        {instrumentErrors.model && <p className="text-xs text-red-600">{instrumentErrors.model}</p>}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="serialNumber">Serial Number *</Label>
                        <Input
                          id="serialNumber"
                          value={instrumentForm.serialNumber}
                          onChange={(e) => setInstrumentForm({ ...instrumentForm, serialNumber: e.target.value })}
                          className={instrumentErrors.serialNumber ? "border-red-500" : ""}
                        />
                        {instrumentErrors.serialNumber && <p className="text-xs text-red-600">{instrumentErrors.serialNumber}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="manufacturer">Manufacturer *</Label>
                        <Input
                          id="manufacturer"
                          value={instrumentForm.manufacturer}
                          onChange={(e) => setInstrumentForm({ ...instrumentForm, manufacturer: e.target.value })}
                          className={instrumentErrors.manufacturer ? "border-red-500" : ""}
                        />
                        {instrumentErrors.manufacturer && <p className="text-xs text-red-600">{instrumentErrors.manufacturer}</p>}
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="installationDate">Installation Date (MM/DD/YYYY) *</Label>
                        <Input
                          id="installationDate"
                          placeholder="MM/DD/YYYY"
                          value={instrumentForm.installationDate}
                          onChange={(e) => setInstrumentForm({ ...instrumentForm, installationDate: e.target.value })}
                          className={instrumentErrors.installationDate ? "border-red-500" : ""}
                        />
                        {instrumentErrors.installationDate && <p className="text-xs text-red-600">{instrumentErrors.installationDate}</p>}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Associated Reagents (optional)</Label>
                      <div className="grid grid-cols-2 gap-2 p-3 bg-[#F5F5F5] rounded-lg max-h-32 overflow-y-auto">
                        {availableReagents.map(reagent => (
                          <div key={reagent} className="flex items-center gap-2">
                            <Checkbox
                              checked={instrumentForm.associatedReagents.includes(reagent)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setInstrumentForm({
                                    ...instrumentForm,
                                    associatedReagents: [...instrumentForm.associatedReagents, reagent]
                                  });
                                } else {
                                  setInstrumentForm({
                                    ...instrumentForm,
                                    associatedReagents: instrumentForm.associatedReagents.filter(r => r !== reagent)
                                  });
                                }
                              }}
                            />
                            <Label className="text-sm">{reagent}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label>Associated Configurations (optional)</Label>
                      <div className="grid grid-cols-2 gap-2 p-3 bg-[#F5F5F5] rounded-lg max-h-32 overflow-y-auto">
                        {availableConfigs.map(config => (
                          <div key={config} className="flex items-center gap-2">
                            <Checkbox
                              checked={instrumentForm.associatedConfigurations.includes(config)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setInstrumentForm({
                                    ...instrumentForm,
                                    associatedConfigurations: [...instrumentForm.associatedConfigurations, config]
                                  });
                                } else {
                                  setInstrumentForm({
                                    ...instrumentForm,
                                    associatedConfigurations: instrumentForm.associatedConfigurations.filter(c => c !== config)
                                  });
                                }
                              }}
                            />
                            <Label className="text-sm">{config}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddInstrumentOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#1976D2] hover:bg-[#1565C0]" onClick={handleAddInstrument}>
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="rounded-xl" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

            <Button variant="outline" className="rounded-xl border-[#1976D2] text-[#1976D2]">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Data Table - Simplified Lab User Style */}
          {filteredInstruments.length === 0 ? (
            <div className="text-center py-12">
              <Beaker className="h-12 w-12 text-[#6B7280] mx-auto mb-4" />
              <p className="text-[#6B7280]">No Instruments Available</p>
            </div>
          ) : (
            <div className="border border-[#E0E6ED] rounded-xl overflow-hidden">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-[#F9FBFF] z-10">
                    <TableRow>
                      <TableHead>Instrument ID</TableHead>
                      <TableHead>Instrument Name</TableHead>
                      <TableHead>Model / Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstruments.map((instrument) => (
                      <TableRow key={instrument.id} className="hover:bg-[#F9FBFF]">
                        <TableCell className="font-medium">{instrument.id}</TableCell>
                        <TableCell>{instrument.name}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{instrument.model}</p>
                            <p className="text-sm text-[#6B7280]">{instrument.manufacturer}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadgeColor(instrument.status)} rounded-lg px-3 py-1`}>
                            {instrument.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{instrument.lastUpdated}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              onClick={() => {
                                const newStatus = instrument.status === "Ready" ? "Maintenance" : "Ready";
                                handleToggleActive(instrument);
                                toast.success(`${newStatus === "Ready" ? "Activated" : "Deactivated"}`, {
                                  description: `${instrument.name} is now ${newStatus}`
                                });
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 hover:bg-[#E8F5E9] text-[#28A745]"
                            >
                              <Power className="h-4 w-4 mr-1.5" />
                              Activate/Deactivate
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewInstrument(instrument)}
                              className="h-8 w-8 p-0 hover:bg-[#F5F5F5]"
                            >
                              <Eye className="h-4 w-4 text-[#6B7280]" />
                            </Button>
                            <Button
                              onClick={() => handleEditInstrument(instrument)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-[#FFF3E0]"
                            >
                              <Edit className="h-4 w-4 text-[#F57C00]" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instrument Status Monitor */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1976D2] flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Instrument Status Monitor
          </CardTitle>
          <CardDescription className="text-[#555555]">
            Real-time operational status of all instruments
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instruments.filter(i => i.isActive).map(instrument => (
              <Card key={instrument.id} className={`border-2 ${
                instrument.status === "Error" ? "border-red-300 bg-red-50" :
                instrument.status === "Ready" ? "border-green-300 bg-green-50" :
                instrument.status === "Processing" ? "border-blue-300 bg-blue-50" :
                "border-yellow-300 bg-yellow-50"
              } shadow-sm rounded-xl`}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-[#333333]">{instrument.name}</p>
                        <p className="text-sm text-[#666666]">{instrument.model}</p>
                      </div>
                      {getStatusIcon(instrument.status)}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#666666]">Current State:</span>
                        <Badge variant="outline" className={`${getStatusColor(instrument.status)} rounded-full`}>
                          {instrument.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#666666]">Last Checked:</span>
                        <span className="text-[#333333]">{instrument.lastUpdated}</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleRecheckStatus(instrument)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Recheck Status
                    </Button>

                    {instrument.status === "Error" && (
                      <div className="p-2 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-xs text-red-800">⚠️ Communication failure detected</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto Delete Scheduler */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1976D2] flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Auto Delete Scheduler
          </CardTitle>
          <CardDescription className="text-[#555555]">
            Manage automatic removal of deactivated instruments
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {instruments.filter(i => i.deletionStatus).length === 0 ? (
            <div className="text-center py-8">
              <Archive className="h-12 w-12 text-[#BBDEFB] mx-auto mb-4" />
              <p className="text-[#666666]">No scheduled deletions</p>
            </div>
          ) : (
            <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#1976D2]">Instrument Name</TableHead>
                    <TableHead className="text-[#1976D2]">Deactivation Date</TableHead>
                    <TableHead className="text-[#1976D2]">Scheduled Deletion Date</TableHead>
                    <TableHead className="text-[#1976D2]">Status</TableHead>
                    <TableHead className="text-[#1976D2] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instruments.filter(i => i.deletionStatus).map(instrument => (
                    <TableRow key={instrument.id} className="hover:bg-[#F5F5F5]">
                      <TableCell className="font-medium text-[#333333]">{instrument.name}</TableCell>
                      <TableCell className="text-[#666666]">{instrument.deactivationDate}</TableCell>
                      <TableCell className="text-[#666666]">{instrument.scheduledDeletionDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          instrument.deletionStatus === "Scheduled" ? "bg-yellow-100 text-yellow-800 border-yellow-200 rounded-full" :
                          instrument.deletionStatus === "Cancelled" ? "bg-green-100 text-green-800 border-green-200 rounded-full" :
                          "bg-red-100 text-red-800 border-red-200 rounded-full"
                        }>
                          {instrument.deletionStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {instrument.deletionStatus === "Scheduled" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelDeletion(instrument)}
                                className="text-green-600 border-green-300 hover:bg-green-50"
                              >
                                Cancel Deletion
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleForceDelete(instrument)}
                              >
                                Force Delete Now
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewInstrumentOpen} onOpenChange={setIsViewInstrumentOpen}>
        <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1976D2]">Instrument Details</DialogTitle>
            <DialogDescription>Complete information about this instrument</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            {selectedInstrument && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666]">Instrument ID</Label>
                    <p className="text-[#333333] mt-1 font-semibold">{selectedInstrument.id}</p>
                  </div>
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666]">Name</Label>
                    <p className="text-[#333333] mt-1">{selectedInstrument.name}</p>
                  </div>
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666]">Model / Type</Label>
                    <p className="text-[#333333] mt-1">{selectedInstrument.model}</p>
                  </div>
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666]">Serial Number</Label>
                    <p className="text-[#333333] mt-1">{selectedInstrument.serialNumber}</p>
                  </div>
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666]">Manufacturer</Label>
                    <p className="text-[#333333] mt-1">{selectedInstrument.manufacturer}</p>
                  </div>
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666]">Installation Date</Label>
                    <p className="text-[#333333] mt-1">{selectedInstrument.installationDate}</p>
                  </div>
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666]">Status</Label>
                    <Badge variant="outline" className={`${getStatusColor(selectedInstrument.status)} mt-1`}>
                      {selectedInstrument.status}
                    </Badge>
                  </div>
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666]">Active</Label>
                    <p className="text-[#333333] mt-1">{selectedInstrument.isActive ? "Yes" : "No"}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4">
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666] mb-2 block">Associated Reagents</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedInstrument.associatedReagents.length > 0 ? (
                        selectedInstrument.associatedReagents.map(reagent => (
                          <Badge key={reagent} variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                            {reagent}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-[#999999]">No reagents assigned</p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666] mb-2 block">Associated Configurations</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedInstrument.associatedConfigurations.length > 0 ? (
                        selectedInstrument.associatedConfigurations.map(config => (
                          <Badge key={config} variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                            {config}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-[#999999]">No configurations assigned</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewInstrumentOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-[#1976D2] hover:bg-[#1565C0]"
              onClick={() => {
                setIsViewInstrumentOpen(false);
                selectedInstrument && handleEditInstrument(selectedInstrument);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog - Similar to Add Dialog */}
      <Dialog open={isEditInstrumentOpen} onOpenChange={setIsEditInstrumentOpen}>
        <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1976D2]">Edit Instrument</DialogTitle>
            <DialogDescription>Update instrument information</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Instrument Name *</Label>
                <Input
                  id="edit-name"
                  value={instrumentForm.name}
                  onChange={(e) => setInstrumentForm({ ...instrumentForm, name: e.target.value })}
                  className={instrumentErrors.name ? "border-red-500" : ""}
                />
                {instrumentErrors.name && <p className="text-xs text-red-600">{instrumentErrors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-model">Model / Type *</Label>
                  <Input
                    id="edit-model"
                    value={instrumentForm.model}
                    onChange={(e) => setInstrumentForm({ ...instrumentForm, model: e.target.value })}
                    className={instrumentErrors.model ? "border-red-500" : ""}
                  />
                  {instrumentErrors.model && <p className="text-xs text-red-600">{instrumentErrors.model}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-serialNumber">Serial Number *</Label>
                  <Input
                    id="edit-serialNumber"
                    value={instrumentForm.serialNumber}
                    onChange={(e) => setInstrumentForm({ ...instrumentForm, serialNumber: e.target.value })}
                    className={instrumentErrors.serialNumber ? "border-red-500" : ""}
                  />
                  {instrumentErrors.serialNumber && <p className="text-xs text-red-600">{instrumentErrors.serialNumber}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-manufacturer">Manufacturer *</Label>
                  <Input
                    id="edit-manufacturer"
                    value={instrumentForm.manufacturer}
                    onChange={(e) => setInstrumentForm({ ...instrumentForm, manufacturer: e.target.value })}
                    className={instrumentErrors.manufacturer ? "border-red-500" : ""}
                  />
                  {instrumentErrors.manufacturer && <p className="text-xs text-red-600">{instrumentErrors.manufacturer}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-installationDate">Installation Date (MM/DD/YYYY) *</Label>
                  <Input
                    id="edit-installationDate"
                    value={instrumentForm.installationDate}
                    onChange={(e) => setInstrumentForm({ ...instrumentForm, installationDate: e.target.value })}
                    className={instrumentErrors.installationDate ? "border-red-500" : ""}
                  />
                  {instrumentErrors.installationDate && <p className="text-xs text-red-600">{instrumentErrors.installationDate}</p>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Associated Reagents</Label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-[#F5F5F5] rounded-lg max-h-32 overflow-y-auto">
                  {availableReagents.map(reagent => (
                    <div key={reagent} className="flex items-center gap-2">
                      <Checkbox
                        checked={instrumentForm.associatedReagents.includes(reagent)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setInstrumentForm({
                              ...instrumentForm,
                              associatedReagents: [...instrumentForm.associatedReagents, reagent]
                            });
                          } else {
                            setInstrumentForm({
                              ...instrumentForm,
                              associatedReagents: instrumentForm.associatedReagents.filter(r => r !== reagent)
                            });
                          }
                        }}
                      />
                      <Label className="text-sm">{reagent}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Associated Configurations</Label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-[#F5F5F5] rounded-lg max-h-32 overflow-y-auto">
                  {availableConfigs.map(config => (
                    <div key={config} className="flex items-center gap-2">
                      <Checkbox
                        checked={instrumentForm.associatedConfigurations.includes(config)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setInstrumentForm({
                              ...instrumentForm,
                              associatedConfigurations: [...instrumentForm.associatedConfigurations, config]
                            });
                          } else {
                            setInstrumentForm({
                              ...instrumentForm,
                              associatedConfigurations: instrumentForm.associatedConfigurations.filter(c => c !== config)
                            });
                          }
                        }}
                      />
                      <Label className="text-sm">{config}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditInstrumentOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#1976D2] hover:bg-[#1565C0]" onClick={handleUpdateInstrument}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteInstrumentOpen} onOpenChange={setIsDeleteInstrumentOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#D32F2F]">Delete Instrument</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{instrumentToDelete?.name}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInstrumentConfirm}
              className="bg-[#D32F2F] hover:bg-[#B71C1C]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  // Render Reagents Tab
  const renderReagents = () => (
    <div className="space-y-6">
      {/* Vendor Supply History */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1976D2] flex items-center gap-2">
                <Package className="h-5 w-5" />
                Vendor Supply History
              </CardTitle>
              <CardDescription className="text-[#555555]">
                Track all reagent shipments from vendors (Read-only)
              </CardDescription>
            </div>
            <Button
              variant="outline"
              className="border-[#1976D2] text-[#1976D2] rounded-xl"
              onClick={handleExportVendorSupplies}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
              <Input
                type="text"
                placeholder="Search by reagent name or vendor..."
                value={searchReagent}
                onChange={(e) => setSearchReagent(e.target.value)}
                className="pl-10 bg-white border-[#BBDEFB] rounded-xl"
              />
            </div>

            <Select value={filterVendor} onValueChange={setFilterVendor}>
              <SelectTrigger className="bg-white rounded-xl border-[#BBDEFB]">
                <Filter className="h-4 w-4 mr-2 text-[#1976D2]" />
                <SelectValue placeholder="Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                <SelectItem value="VENDOR-001">MedSupply Vietnam</SelectItem>
                <SelectItem value="VENDOR-002">LabSupplies Ltd</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="rounded-xl" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Vendor Supply Table */}
          <div className="border border-[#BBDEFB] rounded-xl overflow-x-auto bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1976D2]">Reagent Name</TableHead>
                  <TableHead className="text-[#1976D2]">Catalog #</TableHead>
                  <TableHead className="text-[#1976D2]">Manufacturer</TableHead>
                  <TableHead className="text-[#1976D2]">CAS #</TableHead>
                  <TableHead className="text-[#1976D2]">Vendor Name</TableHead>
                  <TableHead className="text-[#1976D2]">Vendor ID</TableHead>
                  <TableHead className="text-[#1976D2]">PO Number</TableHead>
                  <TableHead className="text-[#1976D2]">Order Date</TableHead>
                  <TableHead className="text-[#1976D2]">Receipt Date</TableHead>
                  <TableHead className="text-[#1976D2]">Quantity</TableHead>
                  <TableHead className="text-[#1976D2]">Unit</TableHead>
                  <TableHead className="text-[#1976D2]">Lot #</TableHead>
                  <TableHead className="text-[#1976D2]">Expiration</TableHead>
                  <TableHead className="text-[#1976D2]">Received By</TableHead>
                  <TableHead className="text-[#1976D2]">Storage</TableHead>
                  <TableHead className="text-[#1976D2]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendorSupplies
                  .filter(vs => 
                    (searchReagent === "" || 
                      vs.reagentName.toLowerCase().includes(searchReagent.toLowerCase()) ||
                      vs.vendorName.toLowerCase().includes(searchReagent.toLowerCase())) &&
                    (filterVendor === "all" || vs.vendorId === filterVendor)
                  )
                  .map((supply) => (
                    <TableRow key={supply.id} className="hover:bg-[#F5F5F5]">
                      <TableCell className="font-medium text-[#333333]">{supply.reagentName}</TableCell>
                      <TableCell className="text-[#666666]">{supply.catalogNumber}</TableCell>
                      <TableCell className="text-[#666666]">{supply.manufacturer}</TableCell>
                      <TableCell className="text-[#666666]">{supply.casNumber}</TableCell>
                      <TableCell className="text-[#666666]">{supply.vendorName}</TableCell>
                      <TableCell className="text-[#666666]">{supply.vendorId}</TableCell>
                      <TableCell className="text-[#666666]">{supply.poNumber}</TableCell>
                      <TableCell className="text-[#666666]">{supply.orderDate}</TableCell>
                      <TableCell className="text-[#666666]">{supply.receiptDate}</TableCell>
                      <TableCell className="text-[#666666]">{supply.quantityReceived}</TableCell>
                      <TableCell className="text-[#666666]">{supply.unitOfMeasure}</TableCell>
                      <TableCell className="text-[#666666]">{supply.lotNumber}</TableCell>
                      <TableCell className="text-[#666666]">{supply.expirationDate}</TableCell>
                      <TableCell className="text-[#666666]">{supply.receivedBy}</TableCell>
                      <TableCell className="text-[#666666]">{supply.storageLocation}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          supply.status === "Received" ? "bg-green-100 text-green-800 border-green-200 rounded-full" :
                          supply.status === "Partial" ? "bg-yellow-100 text-yellow-800 border-yellow-200 rounded-full" :
                          "bg-red-100 text-red-800 border-red-200 rounded-full"
                        }>
                          {supply.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {vendorSupplies.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
              <p className="text-[#666666]">No Vendor Supply Data Available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reagents Usage History */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1976D2] flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Reagents Usage History
              </CardTitle>
              <CardDescription className="text-[#555555]">
                Complete usage history of reagents (Auto-logged, Read-only)
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-[#1976D2] text-[#1976D2] rounded-xl"
                onClick={handleExportUsageHistory}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="rounded-xl">
                <FileText className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
              <Input
                type="text"
                placeholder="Search by reagent name or user..."
                value={searchUsage}
                onChange={(e) => setSearchUsage(e.target.value)}
                className="pl-10 bg-white border-[#BBDEFB] rounded-xl"
              />
            </div>

            <Button variant="outline" className="rounded-xl" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Usage History Table */}
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1976D2]">Reagent Name</TableHead>
                  <TableHead className="text-[#1976D2]">Quantity Used</TableHead>
                  <TableHead className="text-[#1976D2]">Date / Time of Use</TableHead>
                  <TableHead className="text-[#1976D2]">User</TableHead>
                  <TableHead className="text-[#1976D2]">Action Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usageHistory
                  .filter(uh => 
                    searchUsage === "" ||
                    uh.reagentName.toLowerCase().includes(searchUsage.toLowerCase()) ||
                    uh.user.toLowerCase().includes(searchUsage.toLowerCase())
                  )
                  .map((usage) => (
                    <TableRow key={usage.id} className="hover:bg-[#F5F5F5]">
                      <TableCell className="font-medium text-[#333333]">{usage.reagentName}</TableCell>
                      <TableCell className="text-[#666666]">{usage.quantityUsed}</TableCell>
                      <TableCell className="text-[#666666]">{usage.dateTimeOfUse}</TableCell>
                      <TableCell className="text-[#666666]">{usage.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          usage.actionType === "Used" ? "bg-blue-100 text-blue-800 border-blue-200 rounded-full" :
                          usage.actionType === "Adjusted" ? "bg-yellow-100 text-yellow-800 border-yellow-200 rounded-full" :
                          "bg-green-100 text-green-800 border-green-200 rounded-full"
                        }>
                          {usage.actionType}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {usageHistory.length === 0 && (
            <div className="text-center py-12">
              <Beaker className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
              <p className="text-[#666666]">No usage history available</p>
            </div>
          )}

          <div className="mt-4 p-3 bg-[#E3F2FD] rounded-lg border border-[#90CAF9]">
            <p className="text-xs text-[#1976D2]">
              <strong>🔒 Security Notice:</strong> All usage data is auto-logged, tamper-proof, and restricted to authorized users only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Configurations Tab
  const renderConfigurations = () => (
    <div className="space-y-6">
      {/* Sub-tabs for Configurations */}
      <Card className="shadow-md border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Button
              variant={configSubTab === "general" ? "default" : "outline"}
              onClick={() => setConfigSubTab("general")}
              className={`rounded-xl whitespace-nowrap ${
                configSubTab === "general"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              General Configurations
            </Button>
            <Button
              variant={configSubTab === "specific" ? "default" : "outline"}
              onClick={() => setConfigSubTab("specific")}
              className={`rounded-xl whitespace-nowrap ${
                configSubTab === "specific"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <Database className="h-4 w-4 mr-2" />
              Specific Configurations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* General Configurations Tab Content */}
      {configSubTab === "general" && (
        <>
          <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#1976D2] flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    General Configurations
                  </CardTitle>
                  <CardDescription className="text-[#555555]">
                    System-level settings that apply across all instruments
                  </CardDescription>
                </div>
            <Dialog open={isAddConfigOpen} onOpenChange={(open) => {
              setIsAddConfigOpen(open);
              if (!open) resetConfigForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-xl shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Configuration
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white max-w-2xl rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-[#1976D2]">Create General Configuration</DialogTitle>
                  <DialogDescription>Select a parameter from the Parameter List and set its value</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="config-name">Configuration Name *</Label>
                    <Select
                      value={configForm.name}
                      onValueChange={(value) => {
                        const param = parameterList.find(p => p.name === value);
                        if (param) {
                          setConfigForm({
                            ...configForm,
                            name: param.name,
                            description: param.description,
                            parameterType: param.type,
                            defaultValue: param.defaultValue
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select from Parameter List" />
                      </SelectTrigger>
                      <SelectContent>
                        {parameterList.map(param => (
                          <SelectItem key={param.name} value={param.name}>
                            {param.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {configForm.name && (
                    <>
                      <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea
                          value={configForm.description}
                          disabled
                          className="bg-gray-50"
                          rows={2}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Parameter Type</Label>
                          <Input
                            value={configForm.parameterType}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label>Default Value</Label>
                          <Input
                            value={configForm.defaultValue}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="config-currentValue">Current Value *</Label>
                        <Input
                          id="config-currentValue"
                          value={configForm.currentValue}
                          onChange={(e) => setConfigForm({ ...configForm, currentValue: e.target.value })}
                          placeholder="Enter current value"
                        />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddConfigOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#1976D2] hover:bg-[#1565C0]" onClick={handleAddConfig}>
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
              <Input
                type="text"
                placeholder="Search by configuration name..."
                value={searchConfig}
                onChange={(e) => setSearchConfig(e.target.value)}
                className="pl-10 bg-white border-[#BBDEFB] rounded-xl"
              />
            </div>

            <Select value={filterParamType} onValueChange={setFilterParamType}>
              <SelectTrigger className="bg-white rounded-xl border-[#BBDEFB]">
                <Filter className="h-4 w-4 mr-2 text-[#1976D2]" />
                <SelectValue placeholder="Parameter Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Numeric">Numeric</SelectItem>
                <SelectItem value="Text">Text</SelectItem>
                <SelectItem value="Boolean">Boolean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Configurations Table */}
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            {generalConfigurations.filter(c => !c.isDeleted).length === 0 ? (
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
                <p className="text-[#666666]">Configuration not found</p>
                <p className="text-sm text-[#999999] mt-2">No configurations match your search</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#1976D2]">Config Name</TableHead>
                    <TableHead className="text-[#1976D2]">Parameter Type</TableHead>
                    <TableHead className="text-[#1976D2]">Default Value</TableHead>
                    <TableHead className="text-[#1976D2]">Current Value</TableHead>
                    <TableHead className="text-[#1976D2]">Last Modified By</TableHead>
                    <TableHead className="text-[#1976D2]">Last Modified On</TableHead>
                    <TableHead className="text-[#1976D2] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generalConfigurations
                    .filter(c => 
                      !c.isDeleted &&
                      (searchConfig === "" || c.name.toLowerCase().includes(searchConfig.toLowerCase())) &&
                      (filterParamType === "all" || c.parameterType === filterParamType)
                    )
                    .map((config) => (
                      <TableRow key={config.id} className="hover:bg-[#F5F5F5]">
                        <TableCell className="font-medium text-[#333333]">{config.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            config.parameterType === "Numeric" ? "bg-blue-100 text-blue-800 border-blue-200 rounded-full" :
                            config.parameterType === "Boolean" ? "bg-purple-100 text-purple-800 border-purple-200 rounded-full" :
                            "bg-green-100 text-green-800 border-green-200 rounded-full"
                          }>
                            {config.parameterType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#666666]">{config.defaultValue}</TableCell>
                        <TableCell className="font-semibold text-[#333333]">{config.currentValue}</TableCell>
                        <TableCell className="text-[#666666]">{config.lastModifiedBy}</TableCell>
                        <TableCell className="text-[#666666]">{config.lastModifiedOn}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditGeneralConfig(config)}
                              className="text-[#F57C00] hover:text-[#E65100] hover:bg-[#FFF8E1]"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteGeneralConfig(config)}
                              className="text-[#D32F2F] hover:text-[#B71C1C] hover:bg-[#FFEBEE]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="mt-4 p-3 bg-[#E3F2FD] rounded-lg border border-[#90CAF9]">
            <p className="text-xs text-[#1976D2]">
              <strong>🔄 Auto-Sync:</strong> All configuration changes are automatically synced to all connected services.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Edit General Configuration Dialog */}
      <Dialog open={isEditGeneralConfigOpen} onOpenChange={setIsEditGeneralConfigOpen}>
        <DialogContent className="bg-white max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1976D2]">Modify Configuration</DialogTitle>
            <DialogDescription>Update configuration value and description</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Configuration Name</Label>
              <Input value={configForm.name} disabled className="bg-gray-100" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-config-description">Description</Label>
              <Textarea
                id="edit-config-description"
                value={configForm.description}
                onChange={(e) => setConfigForm({ ...configForm, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Parameter Type</Label>
              <Input value={configForm.parameterType} disabled className="bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Default Value</Label>
                <Input value={configForm.defaultValue} disabled className="bg-gray-100" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-config-currentValue">Current Value *</Label>
                <Input
                  id="edit-config-currentValue"
                  value={configForm.currentValue}
                  onChange={(e) => setConfigForm({ ...configForm, currentValue: e.target.value })}
                  className={configErrors.currentValue ? "border-red-500" : ""}
                />
                {configErrors.currentValue && <p className="text-xs text-red-600">{configErrors.currentValue}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditGeneralConfigOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#1976D2] hover:bg-[#1565C0]" onClick={handleUpdateGeneralConfig}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete General Configuration Dialog */}
      <AlertDialog open={isDeleteGeneralConfigOpen} onOpenChange={setIsDeleteGeneralConfigOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#D32F2F]">Delete Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the configuration <strong>{selectedGeneralConfig?.name}</strong>?
              This will sync the deletion to all connected services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGeneralConfigConfirm}
              className="bg-[#D32F2F] hover:bg-[#B71C1C]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
        </>
      )}

      {/* Specific Configurations Tab Content */}
      {configSubTab === "specific" && (
        <>
          <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
            <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#1976D2] flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Specific Configurations
                  </CardTitle>
                  <CardDescription className="text-[#555555]">
                    Instrument-level configuration parameters
                  </CardDescription>
                </div>
                <Dialog open={isAddSpecificConfigOpen} onOpenChange={(open) => {
                  setIsAddSpecificConfigOpen(open);
                  if (!open) resetSpecificConfigForm();
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-xl shadow-md">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Specific Configuration
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white max-w-2xl rounded-xl">
                    <DialogHeader>
                      <DialogTitle className="text-[#1976D2]">Create Specific Configuration</DialogTitle>
                      <DialogDescription>Add instrument-specific configuration parameter</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="specific-instrument">Instrument Model *</Label>
                        <Select
                          value={specificConfigForm.instrumentModel}
                          onValueChange={(value) => setSpecificConfigForm({ ...specificConfigForm, instrumentModel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select instrument model" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CentriMax 5000">CentriMax 5000</SelectItem>
                            <SelectItem value="SpectroLite X">SpectroLite X</SelectItem>
                            <SelectItem value="Hemolyzer 7">Hemolyzer 7</SelectItem>
                            <SelectItem value="XN-1000">XN-1000</SelectItem>
                            <SelectItem value="AU-680">AU-680</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="specific-param">Parameter Name *</Label>
                        <Select
                          value={specificConfigForm.parameterName}
                          onValueChange={(value) => {
                            const descriptions: Record<string, string> = {
                              "Auto-calibration Interval": "Adjusts calibration frequency for the instrument",
                              "QC Settings": "Quality control frequency per day",
                              "Enable Debug Mode": "Enables diagnostic logs for analyzer",
                              "Temperature Control": "Operating temperature range",
                              "Sample Volume": "Default sample volume for tests"
                            };
                            setSpecificConfigForm({
                              ...specificConfigForm,
                              parameterName: value,
                              description: descriptions[value] || ""
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select parameter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Auto-calibration Interval">Auto-calibration Interval</SelectItem>
                            <SelectItem value="QC Settings">QC Settings</SelectItem>
                            <SelectItem value="Enable Debug Mode">Enable Debug Mode</SelectItem>
                            <SelectItem value="Temperature Control">Temperature Control</SelectItem>
                            <SelectItem value="Sample Volume">Sample Volume</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {specificConfigForm.parameterName && (
                        <>
                          <div className="grid gap-2">
                            <Label>Description</Label>
                            <Textarea
                              value={specificConfigForm.description}
                              onChange={(e) => setSpecificConfigForm({ ...specificConfigForm, description: e.target.value })}
                              rows={2}
                            />
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="specific-value">Value *</Label>
                            <Input
                              id="specific-value"
                              value={specificConfigForm.value}
                              onChange={(e) => setSpecificConfigForm({ ...specificConfigForm, value: e.target.value })}
                              placeholder="Enter configuration value"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddSpecificConfigOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-[#1976D2] hover:bg-[#1565C0]" onClick={handleAddSpecificConfig}>
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                  <Input
                    type="text"
                    placeholder="Search by instrument or parameter name..."
                    value={searchConfig}
                    onChange={(e) => setSearchConfig(e.target.value)}
                    className="pl-10 bg-white border-[#BBDEFB] rounded-xl"
                  />
                </div>

                <Select value="all">
                  <SelectTrigger className="bg-white rounded-xl border-[#BBDEFB]">
                    <Filter className="h-4 w-4 mr-2 text-[#1976D2]" />
                    <SelectValue placeholder="All Instruments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Instruments</SelectItem>
                    <SelectItem value="CentriMax 5000">CentriMax 5000</SelectItem>
                    <SelectItem value="SpectroLite X">SpectroLite X</SelectItem>
                    <SelectItem value="Hemolyzer 7">Hemolyzer 7</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Specific Configurations Table */}
              <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
                {specificConfigurations.filter(c => !c.isDeleted).length === 0 ? (
                  <div className="text-center py-12">
                    <Database className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
                    <p className="text-[#666666]">No specific configurations available</p>
                    <p className="text-sm text-[#999999] mt-2">Click 'Create Specific Configuration' to add one</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                        <TableHead className="text-[#1976D2]">Config ID</TableHead>
                        <TableHead className="text-[#1976D2]">Instrument Model</TableHead>
                        <TableHead className="text-[#1976D2]">Parameter Name</TableHead>
                        <TableHead className="text-[#1976D2]">Description</TableHead>
                        <TableHead className="text-[#1976D2]">Value</TableHead>
                        <TableHead className="text-[#1976D2]">Last Modified By</TableHead>
                        <TableHead className="text-[#1976D2]">Last Modified On</TableHead>
                        <TableHead className="text-[#1976D2] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {specificConfigurations
                        .filter(c => 
                          !c.isDeleted &&
                          (searchConfig === "" || 
                           c.instrumentModel.toLowerCase().includes(searchConfig.toLowerCase()) ||
                           c.parameterName.toLowerCase().includes(searchConfig.toLowerCase()))
                        )
                        .map((config) => (
                          <TableRow key={config.id} className="hover:bg-[#F5F5F5]">
                            <TableCell className="font-medium text-[#333333]">{config.id}</TableCell>
                            <TableCell className="text-[#666666]">{config.instrumentModel}</TableCell>
                            <TableCell className="font-medium text-[#333333]">{config.parameterName}</TableCell>
                            <TableCell className="text-[#666666] text-sm">{config.description}</TableCell>
                            <TableCell className="font-semibold text-[#1976D2]">{config.value}</TableCell>
                            <TableCell className="text-[#666666]">{config.lastModifiedBy}</TableCell>
                            <TableCell className="text-[#666666]">{config.lastModifiedOn}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditSpecificConfig(config)}
                                  className="text-[#F57C00] hover:text-[#E65100] hover:bg-[#FFF8E1]"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteSpecificConfig(config)}
                                  className="text-[#D32F2F] hover:text-[#B71C1C] hover:bg-[#FFEBEE]"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              <div className="mt-4 p-3 bg-[#E3F2FD] rounded-lg border border-[#90CAF9]">
                <p className="text-xs text-[#1976D2]">
                  <strong>🔄 Auto-Sync:</strong> All configuration changes are automatically synchronized to connected services.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Edit Specific Configuration Dialog */}
          <Dialog open={isEditSpecificConfigOpen} onOpenChange={setIsEditSpecificConfigOpen}>
            <DialogContent className="bg-white max-w-2xl rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-[#1976D2]">Edit Specific Configuration</DialogTitle>
                <DialogDescription>Update configuration value and description</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Instrument Model</Label>
                  <Input value={specificConfigForm.instrumentModel} disabled className="bg-gray-50" />
                </div>

                <div className="grid gap-2">
                  <Label>Parameter Name</Label>
                  <Input value={specificConfigForm.parameterName} disabled className="bg-gray-50" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-specific-description">Description</Label>
                  <Textarea
                    id="edit-specific-description"
                    value={specificConfigForm.description}
                    onChange={(e) => setSpecificConfigForm({ ...specificConfigForm, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-specific-value">Value *</Label>
                  <Input
                    id="edit-specific-value"
                    value={specificConfigForm.value}
                    onChange={(e) => setSpecificConfigForm({ ...specificConfigForm, value: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditSpecificConfigOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#1976D2] hover:bg-[#1565C0]" onClick={handleUpdateSpecificConfig}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Specific Configuration Dialog */}
          <AlertDialog open={isDeleteSpecificConfigOpen} onOpenChange={setIsDeleteSpecificConfigOpen}>
            <AlertDialogContent className="bg-white rounded-xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#D32F2F]">Delete Specific Configuration</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the configuration <strong>{selectedSpecificConfig?.parameterName}</strong> for <strong>{selectedSpecificConfig?.instrumentModel}</strong>?
                  This will sync the deletion to all connected services.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteSpecificConfigConfirm}
                  className="bg-[#D32F2F] hover:bg-[#B71C1C]"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#666666]">
        <span>Administration</span>
        <span>/</span>
        <span className="text-[#1976D2] font-medium">Warehouse Management</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[#1976D2] mb-2">Warehouse Service</h1>
        <p className="text-[#555555]">
          Manage instruments, reagents history, and system configurations
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <Card className="shadow-md border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button
              variant={currentSubTab === "instruments" ? "default" : "outline"}
              onClick={() => setCurrentSubTab("instruments")}
              className={`rounded-xl whitespace-nowrap ${
                currentSubTab === "instruments"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <Wrench className="h-4 w-4 mr-2" />
              1️⃣ Instruments
            </Button>

            <Button
              variant={currentSubTab === "reagents" ? "default" : "outline"}
              onClick={() => setCurrentSubTab("reagents")}
              className={`rounded-xl whitespace-nowrap ${
                currentSubTab === "reagents"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <Package className="h-4 w-4 mr-2" />
              2️⃣ Reagents History
            </Button>

            <Button
              variant={currentSubTab === "configurations" ? "default" : "outline"}
              onClick={() => setCurrentSubTab("configurations")}
              className={`rounded-xl whitespace-nowrap ${
                currentSubTab === "configurations"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              3️⃣ Configurations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Content based on selected sub-tab */}
      {renderContent()}
    </div>
  );
}
