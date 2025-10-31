import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { 
  Search, 
  Plus, 
  Eye, 
  Settings,
  RefreshCw,
  ChevronRight,
  Filter,
  Trash2,
  Edit,
  PlayCircle,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

interface Instrument {
  id: string;
  instrumentId: string;
  name: string;
  model: string;
  type: string;
  status: "Ready" | "Maintenance" | "Inactive";
  lastRunDate?: string;
}

interface Reagent {
  id: string;
  name: string;
  quantity: number;
  expirationDate: string;
  vendorName: string;
  vendorId: string;
  lotNumber: string;
  status: "In Use" | "Not in Use";
}

interface RawTestResult {
  id: string;
  testOrderId: string;
  sampleBarcode: string;
  date: string;
  status: "Backed-up" | "Pending" | "Sent";
}

// Mock data
const mockInstruments: Instrument[] = [
  {
    id: "1",
    instrumentId: "INS-001",
    name: "Hematology Analyzer XN-1000",
    model: "XN-1000",
    type: "Hematology",
    status: "Ready",
    lastRunDate: "10/20/2025",
  },
  {
    id: "2",
    instrumentId: "INS-002",
    name: "Chemistry Analyzer AU-680",
    model: "AU-680",
    type: "Chemistry",
    status: "Ready",
    lastRunDate: "10/19/2025",
  },
  {
    id: "3",
    instrumentId: "INS-003",
    name: "Immunology Analyzer i2000",
    model: "i2000",
    type: "Immunology",
    status: "Maintenance",
    lastRunDate: "10/18/2025",
  },
  {
    id: "4",
    instrumentId: "INS-004",
    name: "Microbiology Analyzer VITEK 2",
    model: "VITEK 2",
    type: "Microbiology",
    status: "Ready",
    lastRunDate: "10/20/2025",
  },
  {
    id: "5",
    instrumentId: "INS-005",
    name: "Coagulation Analyzer ACL Top 500",
    model: "ACL Top 500",
    type: "Coagulation",
    status: "Inactive",
    lastRunDate: "10/15/2025",
  },
];

const mockReagents: Reagent[] = [
  {
    id: "1",
    name: "Hemoglobin Reagent",
    quantity: 500,
    expirationDate: "12/31/2025",
    vendorName: "Sysmex Corporation",
    vendorId: "VEN-001",
    lotNumber: "LOT-2025-001",
    status: "In Use",
  },
  {
    id: "2",
    name: "Glucose Test Kit",
    quantity: 300,
    expirationDate: "11/30/2025",
    vendorName: "Beckman Coulter",
    vendorId: "VEN-002",
    lotNumber: "LOT-2025-002",
    status: "In Use",
  },
  {
    id: "3",
    name: "Cholesterol Reagent",
    quantity: 150,
    expirationDate: "01/15/2026",
    vendorName: "Roche Diagnostics",
    vendorId: "VEN-003",
    lotNumber: "LOT-2025-003",
    status: "Not in Use",
  },
];

const mockRawResults: RawTestResult[] = [
  {
    id: "1",
    testOrderId: "TO-2025-001",
    sampleBarcode: "BAR-2025-001",
    date: "10/20/2025 14:30",
    status: "Backed-up",
  },
  {
    id: "2",
    testOrderId: "TO-2025-002",
    sampleBarcode: "BAR-2025-002",
    date: "10/20/2025 13:15",
    status: "Sent",
  },
  {
    id: "3",
    testOrderId: "TO-2025-003",
    sampleBarcode: "BAR-2025-003",
    date: "10/20/2025 12:00",
    status: "Pending",
  },
  {
    id: "4",
    testOrderId: "TO-2025-004",
    sampleBarcode: "BAR-2025-004",
    date: "10/19/2025 16:45",
    status: "Backed-up",
  },
];

interface InstrumentManagementTabbedProps {
  onNavigateToDashboard?: () => void;
}

export function InstrumentManagementTabbed({ onNavigateToDashboard }: InstrumentManagementTabbedProps = {}) {
  const [activeTab, setActiveTab] = useState("instruments");

  // Instrument states
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [instrumentSearch, setInstrumentSearch] = useState("");
  const [instrumentStatusFilter, setInstrumentStatusFilter] = useState("all");
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);

  // Reagent states
  const [reagents, setReagents] = useState<Reagent[]>(mockReagents);
  const [reagentSearch, setReagentSearch] = useState("");
  const [reagentStatusFilter, setReagentStatusFilter] = useState("all");
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);

  // Raw test results states
  const [rawResults, setRawResults] = useState<RawTestResult[]>(mockRawResults);
  const [rawResultSearch, setRawResultSearch] = useState("");
  const [rawResultStatusFilter, setRawResultStatusFilter] = useState("all");
  const [selectedRawResult, setSelectedRawResult] = useState<RawTestResult | null>(null);

  // Modal states
  const [isChangeModeModalOpen, setIsChangeModeModalOpen] = useState(false);
  const [isAnalyzeSampleModalOpen, setIsAnalyzeSampleModalOpen] = useState(false);
  const [isViewInstrumentModalOpen, setIsViewInstrumentModalOpen] = useState(false);
  const [isAddReagentModalOpen, setIsAddReagentModalOpen] = useState(false);
  const [isEditReagentModalOpen, setIsEditReagentModalOpen] = useState(false);
  const [isDeleteReagentDialogOpen, setIsDeleteReagentDialogOpen] = useState(false);
  const [isDeleteRawResultDialogOpen, setIsDeleteRawResultDialogOpen] = useState(false);
  const [isSyncConfigDialogOpen, setIsSyncConfigDialogOpen] = useState(false);

  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Form states
  const [changeModeForm, setChangeModeForm] = useState({
    newMode: "" as "Ready" | "Maintenance" | "Inactive" | "",
    reason: "",
    qcCheck: false,
  });

  const [analyzeSampleForm, setAnalyzeSampleForm] = useState({
    sampleBarcode: "",
    testOrderId: "",
  });

  const [reagentForm, setReagentForm] = useState({
    name: "",
    quantity: "",
    expirationDate: "",
    vendorName: "",
    vendorId: "",
    lotNumber: "",
  });

  const [editReagentStatus, setEditReagentStatus] = useState<"In Use" | "Not in Use">("In Use");

  // Validation errors
  const [changeModeErrors, setChangeModeErrors] = useState<Record<string, string>>({});
  const [analyzeSampleErrors, setAnalyzeSampleErrors] = useState<Record<string, string>>({});
  const [reagentErrors, setReagentErrors] = useState<Record<string, string>>({});



  // Filter instruments
  const filteredInstruments = instruments.filter(instrument => {
    const matchesSearch = 
      instrument.name.toLowerCase().includes(instrumentSearch.toLowerCase()) ||
      instrument.instrumentId.toLowerCase().includes(instrumentSearch.toLowerCase()) ||
      instrument.model.toLowerCase().includes(instrumentSearch.toLowerCase());
    
    const matchesStatus = instrumentStatusFilter === "all" || instrument.status === instrumentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter reagents
  const filteredReagents = reagents.filter(reagent => {
    const matchesSearch = 
      reagent.name.toLowerCase().includes(reagentSearch.toLowerCase()) ||
      reagent.vendorName.toLowerCase().includes(reagentSearch.toLowerCase());
    
    const matchesStatus = reagentStatusFilter === "all" || reagent.status === reagentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter raw results
  const filteredRawResults = rawResults.filter(result => {
    const matchesSearch = 
      result.testOrderId.toLowerCase().includes(rawResultSearch.toLowerCase()) ||
      result.sampleBarcode.toLowerCase().includes(rawResultSearch.toLowerCase());
    
    const matchesStatus = rawResultStatusFilter === "all" || result.status === rawResultStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle change mode
  const validateChangeModeForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!changeModeForm.newMode) {
      errors.newMode = "Please select a new mode";
    }

    if ((changeModeForm.newMode === "Maintenance" || changeModeForm.newMode === "Inactive") && !changeModeForm.reason.trim()) {
      errors.reason = "Reason is required for Maintenance or Inactive mode";
    }

    if (changeModeForm.newMode === "Ready" && !changeModeForm.qcCheck) {
      errors.qcCheck = "QC check is required for Ready mode";
    }

    setChangeModeErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangeMode = () => {
    if (!validateChangeModeForm() || !selectedInstrument) return;

    const updatedInstrument = {
      ...selectedInstrument,
      status: changeModeForm.newMode as "Ready" | "Maintenance" | "Inactive",
    };

    setInstruments(instruments.map(i => i.id === selectedInstrument.id ? updatedInstrument : i));
    setIsChangeModeModalOpen(false);
    toast.success("✅ Instrument mode updated successfully", {
      description: `${selectedInstrument.name} is now ${changeModeForm.newMode}`
    });
  };

  const openChangeModeModal = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setChangeModeForm({
      newMode: "",
      reason: "",
      qcCheck: false,
    });
    setChangeModeErrors({});
    setIsChangeModeModalOpen(true);
  };

  // Handle analyze sample
  const validateAnalyzeSampleForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!analyzeSampleForm.sampleBarcode.trim()) {
      errors.sampleBarcode = "Sample barcode is required";
    }

    setAnalyzeSampleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAnalyzeSample = () => {
    if (!validateAnalyzeSampleForm()) return;

    // Check reagent availability (mock)
    const hasReagent = true;
    if (!hasReagent) {
      toast.error("⚠️ Insufficient reagent", {
        description: "Please install required reagent before analysis"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisComplete(false);

    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          setTimeout(() => {
            setIsAnalyzeSampleModalOpen(false);
            setAnalyzeSampleForm({ sampleBarcode: "", testOrderId: "" });
            setAnalysisComplete(false);
            toast.success("✅ Sample analysis completed successfully", {
              description: "Results have been recorded"
            });
          }, 1500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const openAnalyzeSampleModal = () => {
    setAnalyzeSampleForm({ sampleBarcode: "", testOrderId: "" });
    setAnalyzeSampleErrors({});
    setIsAnalyzeSampleModalOpen(true);
  };

  // Handle reagent operations
  const validateReagentForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!reagentForm.name.trim()) {
      errors.name = "Reagent name is required";
    }

    if (!reagentForm.quantity || Number(reagentForm.quantity) <= 0) {
      errors.quantity = "Quantity must be greater than 0";
    }

    if (!reagentForm.expirationDate) {
      errors.expirationDate = "Expiration date is required";
    } else {
      const expDate = new Date(reagentForm.expirationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expDate <= today) {
        errors.expirationDate = "Expiration date must be after today";
      }
    }

    if (!reagentForm.vendorName.trim()) {
      errors.vendorName = "Vendor name is required";
    }

    if (!reagentForm.vendorId.trim()) {
      errors.vendorId = "Vendor ID is required";
    }

    if (!reagentForm.lotNumber.trim()) {
      errors.lotNumber = "Lot number is required";
    }

    setReagentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddReagent = () => {
    if (!validateReagentForm()) return;

    const newReagent: Reagent = {
      id: Date.now().toString(),
      name: reagentForm.name,
      quantity: Number(reagentForm.quantity),
      expirationDate: reagentForm.expirationDate,
      vendorName: reagentForm.vendorName,
      vendorId: reagentForm.vendorId,
      lotNumber: reagentForm.lotNumber,
      status: "Not in Use",
    };

    setReagents([newReagent, ...reagents]);
    setIsAddReagentModalOpen(false);
    resetReagentForm();
    toast.success("✅ Reagent installed successfully", {
      description: `${newReagent.name} has been added to inventory`
    });
  };

  const resetReagentForm = () => {
    setReagentForm({
      name: "",
      quantity: "",
      expirationDate: "",
      vendorName: "",
      vendorId: "",
      lotNumber: "",
    });
    setReagentErrors({});
  };

  const openEditReagentModal = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    setEditReagentStatus(reagent.status);
    setIsEditReagentModalOpen(true);
  };

  const handleEditReagent = () => {
    if (!selectedReagent) return;

    if (selectedReagent.status === editReagentStatus) {
      toast.error("⚠️ No change detected", {
        description: "This reagent is already in that state"
      });
      return;
    }

    const updatedReagent = {
      ...selectedReagent,
      status: editReagentStatus,
    };

    setReagents(reagents.map(r => r.id === selectedReagent.id ? updatedReagent : r));
    setIsEditReagentModalOpen(false);
    toast.success("✅ Reagent updated successfully", {
      description: `Status changed to ${editReagentStatus}`
    });
  };

  const openDeleteReagentDialog = (reagent: Reagent) => {
    setSelectedReagent(reagent);
    setIsDeleteReagentDialogOpen(true);
  };

  const handleDeleteReagent = () => {
    if (!selectedReagent) return;

    setReagents(reagents.filter(r => r.id !== selectedReagent.id));
    setIsDeleteReagentDialogOpen(false);
    toast.success("✅ Reagent deleted successfully");
  };

  // Handle raw test result operations
  const openDeleteRawResultDialog = (result: RawTestResult) => {
    setSelectedRawResult(result);
    setIsDeleteRawResultDialogOpen(true);
  };

  const handleDeleteRawResult = () => {
    if (!selectedRawResult) return;

    if (selectedRawResult.status !== "Backed-up") {
      toast.error("⚠️ Cannot delete", {
        description: "Only backed-up results can be deleted"
      });
      return;
    }

    setRawResults(rawResults.filter(r => r.id !== selectedRawResult.id));
    setIsDeleteRawResultDialogOpen(false);
    toast.success("✅ Raw test result deleted successfully");
  };

  // Handle sync configuration
  const handleSyncConfiguration = () => {
    // Check permission (mock)
    const isAdminOrSupervisor = false;
    
    if (!isAdminOrSupervisor) {
      toast.error("⚠️ Permission denied", {
        description: "Only Admin or Supervisor can perform this action"
      });
      setIsSyncConfigDialogOpen(false);
      return;
    }

    toast.success("✅ Configuration synced successfully");
    setIsSyncConfigDialogOpen(false);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const styles = {
      "Ready": "bg-green-100 text-green-800 border-green-200",
      "Maintenance": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Inactive": "bg-red-100 text-red-800 border-red-200",
      "In Use": "bg-blue-100 text-blue-800 border-blue-200",
      "Not in Use": "bg-gray-100 text-gray-800 border-gray-200",
      "Backed-up": "bg-green-100 text-green-800 border-green-200",
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Sent": "bg-blue-100 text-blue-800 border-blue-200",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header with Breadcrumb */}
      <div className="space-y-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToDashboard?.();
                }}
                className="text-[#6B7280] hover:text-[#007BFF] transition-colors cursor-pointer"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[#333333]">Instruments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-[#333333]">Instrument Management</h1>
          <p className="text-[#6B7280]">Manage laboratory instruments, analyze samples, and handle reagents efficiently.</p>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-[#E0E6ED] rounded-xl p-1">
          <TabsTrigger value="instruments" className="rounded-lg data-[state=active]:bg-[#007BFF] data-[state=active]:text-white">
            Instrument List
          </TabsTrigger>
          <TabsTrigger value="reagents" className="rounded-lg data-[state=active]:bg-[#007BFF] data-[state=active]:text-white">
            Reagents
          </TabsTrigger>
          <TabsTrigger value="rawResults" className="rounded-lg data-[state=active]:bg-[#007BFF] data-[state=active]:text-white">
            Raw Test Results
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Instrument List */}
        <TabsContent value="instruments" className="space-y-4">
          <Card className="rounded-2xl border-[#E0E6ED] shadow-sm">
            <CardHeader className="bg-gradient-to-r from-[#EAF3FF] to-white border-b border-[#E0E6ED]">
              <CardTitle>Instrument List</CardTitle>
              <CardDescription>View and manage laboratory instruments</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Search and Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                  <Input
                    placeholder="Search instruments..."
                    value={instrumentSearch}
                    onChange={(e) => setInstrumentSearch(e.target.value)}
                    className="pl-10 rounded-xl border-[#E0E6ED]"
                  />
                </div>
                <Select value={instrumentStatusFilter} onValueChange={setInstrumentStatusFilter}>
                  <SelectTrigger className="w-[200px] rounded-xl">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Ready">Ready</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Instruments Table */}
              <div className="border border-[#E0E6ED] rounded-xl overflow-hidden">
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-[#F9FBFF] z-10">
                      <TableRow>
                        <TableHead>Instrument ID</TableHead>
                        <TableHead>Instrument Name</TableHead>
                        <TableHead>Model / Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Run Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInstruments.map((instrument) => (
                        <TableRow key={instrument.id} className="hover:bg-[#F9FBFF]">
                          <TableCell className="font-medium">{instrument.instrumentId}</TableCell>
                          <TableCell>{instrument.name}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{instrument.model}</p>
                              <p className="text-sm text-[#6B7280]">{instrument.type}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadge(instrument.status)} rounded-lg px-2 py-1`}>
                              {instrument.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{instrument.lastRunDate || "-"}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openChangeModeModal(instrument)}
                                className="h-8 px-3 hover:bg-[#EAF3FF] text-[#007BFF]"
                              >
                                <Settings className="h-4 w-4 mr-1" />
                                Change Mode
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openAnalyzeSampleModal()}
                                className="h-8 px-3 hover:bg-[#E8F5E9] text-[#28A745]"
                              >
                                <PlayCircle className="h-4 w-4 mr-1" />
                                Analyze Sample
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedInstrument(instrument);
                                  setIsViewInstrumentModalOpen(true);
                                }}
                                className="h-8 w-8 p-0 hover:bg-[#EAF3FF]"
                              >
                                <Eye className="h-4 w-4 text-[#6B7280]" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Reagents */}
        <TabsContent value="reagents" className="space-y-4">
          <Card className="rounded-2xl border-[#E0E6ED] shadow-sm">
            <CardHeader className="bg-gradient-to-r from-[#EAF3FF] to-white border-b border-[#E0E6ED]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reagents Management</CardTitle>
                  <CardDescription>Manage laboratory reagents and supplies</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    resetReagentForm();
                    setIsAddReagentModalOpen(true);
                  }}
                  className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-xl shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reagent
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Search and Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                  <Input
                    placeholder="Search reagents..."
                    value={reagentSearch}
                    onChange={(e) => setReagentSearch(e.target.value)}
                    className="pl-10 rounded-xl border-[#E0E6ED]"
                  />
                </div>
                <Select value={reagentStatusFilter} onValueChange={setReagentStatusFilter}>
                  <SelectTrigger className="w-[200px] rounded-xl">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="In Use">In Use</SelectItem>
                    <SelectItem value="Not in Use">Not in Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reagents Table */}
              <div className="border border-[#E0E6ED] rounded-xl overflow-hidden">
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-[#F9FBFF] z-10">
                      <TableRow>
                        <TableHead>Reagent Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Expiration Date</TableHead>
                        <TableHead>Vendor Name / ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReagents.map((reagent) => (
                        <TableRow key={reagent.id} className="hover:bg-[#F9FBFF]">
                          <TableCell className="font-medium">{reagent.name}</TableCell>
                          <TableCell>{reagent.quantity}</TableCell>
                          <TableCell>{reagent.expirationDate}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{reagent.vendorName}</p>
                              <p className="text-sm text-[#6B7280]">{reagent.vendorId}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadge(reagent.status)} rounded-lg px-2 py-1`}>
                              {reagent.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditReagentModal(reagent)}
                                className="h-8 px-3 hover:bg-[#EAF3FF] text-[#007BFF]"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteReagentDialog(reagent)}
                                className="h-8 px-3 hover:bg-red-50 text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Raw Test Results */}
        <TabsContent value="rawResults" className="space-y-4">
          <Card className="rounded-2xl border-[#E0E6ED] shadow-sm">
            <CardHeader className="bg-gradient-to-r from-[#EAF3FF] to-white border-b border-[#E0E6ED]">
              <CardTitle>Raw Test Results Management</CardTitle>
              <CardDescription>View and manage raw test results</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Search and Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                  <Input
                    placeholder="Search by test order or barcode..."
                    value={rawResultSearch}
                    onChange={(e) => setRawResultSearch(e.target.value)}
                    className="pl-10 rounded-xl border-[#E0E6ED]"
                  />
                </div>
                <Select value={rawResultStatusFilter} onValueChange={setRawResultStatusFilter}>
                  <SelectTrigger className="w-[200px] rounded-xl">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Backed-up">Backed-up</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Sent">Sent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Raw Results Table */}
              <div className="border border-[#E0E6ED] rounded-xl overflow-hidden">
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-[#F9FBFF] z-10">
                      <TableRow>
                        <TableHead>Test Order ID</TableHead>
                        <TableHead>Sample Barcode</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRawResults.map((result) => (
                        <TableRow key={result.id} className="hover:bg-[#F9FBFF]">
                          <TableCell className="font-medium">{result.testOrderId}</TableCell>
                          <TableCell>{result.sampleBarcode}</TableCell>
                          <TableCell>{result.date}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadge(result.status)} rounded-lg px-2 py-1`}>
                              {result.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openDeleteRawResultDialog(result)}
                                disabled={result.status !== "Backed-up"}
                                className="h-8 px-3 hover:bg-red-50 text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Sync Configuration Button */}
      <Button
        onClick={() => setIsSyncConfigDialogOpen(true)}
        className="fixed bottom-8 right-8 rounded-full w-14 h-14 bg-[#007BFF] hover:bg-[#0056D2] text-white shadow-lg"
      >
        <RefreshCw className="h-6 w-6" />
      </Button>

      {/* Change Mode Modal */}
      <Dialog open={isChangeModeModalOpen} onOpenChange={setIsChangeModeModalOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Change Instrument Mode</DialogTitle>
            <DialogDescription>
              Update the operational mode for {selectedInstrument?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Current Mode</Label>
              <Input
                value={selectedInstrument?.status || ""}
                disabled
                className="bg-gray-50 rounded-lg mt-1"
              />
            </div>

            <div>
              <Label htmlFor="newMode">New Mode *</Label>
              <Select
                value={changeModeForm.newMode}
                onValueChange={(value: "Ready" | "Maintenance" | "Inactive") => 
                  setChangeModeForm({ ...changeModeForm, newMode: value })
                }
              >
                <SelectTrigger className={`rounded-lg mt-1 ${changeModeErrors.newMode ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {changeModeErrors.newMode && (
                <p className="text-xs text-red-600 mt-1">{changeModeErrors.newMode}</p>
              )}
            </div>

            {(changeModeForm.newMode === "Maintenance" || changeModeForm.newMode === "Inactive") && (
              <div>
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason..."
                  value={changeModeForm.reason}
                  onChange={(e) => setChangeModeForm({ ...changeModeForm, reason: e.target.value })}
                  className={`rounded-lg mt-1 ${changeModeErrors.reason ? "border-red-500" : ""}`}
                  rows={3}
                />
                {changeModeErrors.reason && (
                  <p className="text-xs text-red-600 mt-1">{changeModeErrors.reason}</p>
                )}
              </div>
            )}

            {changeModeForm.newMode === "Ready" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="qcCheck"
                  checked={changeModeForm.qcCheck}
                  onCheckedChange={(checked) => 
                    setChangeModeForm({ ...changeModeForm, qcCheck: checked as boolean })
                  }
                />
                <Label 
                  htmlFor="qcCheck" 
                  className={`cursor-pointer ${changeModeErrors.qcCheck ? "text-red-600" : ""}`}
                >
                  QC check passed *
                </Label>
              </div>
            )}
            {changeModeErrors.qcCheck && (
              <p className="text-xs text-red-600">{changeModeErrors.qcCheck}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsChangeModeModalOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeMode}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-lg"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analyze Sample Modal */}
      <Dialog open={isAnalyzeSampleModalOpen} onOpenChange={setIsAnalyzeSampleModalOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Analyze Sample</DialogTitle>
            <DialogDescription>Start sample analysis process</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="sampleBarcode">Sample Barcode *</Label>
              <Input
                id="sampleBarcode"
                placeholder="Enter or scan barcode..."
                value={analyzeSampleForm.sampleBarcode}
                onChange={(e) => setAnalyzeSampleForm({ ...analyzeSampleForm, sampleBarcode: e.target.value })}
                className={`rounded-lg mt-1 ${analyzeSampleErrors.sampleBarcode ? "border-red-500" : ""}`}
                disabled={isAnalyzing}
              />
              {analyzeSampleErrors.sampleBarcode && (
                <p className="text-xs text-red-600 mt-1">{analyzeSampleErrors.sampleBarcode}</p>
              )}
            </div>

            <div>
              <Label htmlFor="testOrderId">Test Order ID (Optional)</Label>
              <Input
                id="testOrderId"
                placeholder="Enter test order ID..."
                value={analyzeSampleForm.testOrderId}
                onChange={(e) => setAnalyzeSampleForm({ ...analyzeSampleForm, testOrderId: e.target.value })}
                className="rounded-lg mt-1"
                disabled={isAnalyzing}
              />
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#007BFF]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Analyzing sample...</p>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            )}

            {analysisComplete && (
              <div className="flex items-center gap-2 text-[#28A745]">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm">Analysis completed successfully!</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAnalyzeSampleModalOpen(false);
                setAnalyzeSampleForm({ sampleBarcode: "", testOrderId: "" });
                setIsAnalyzing(false);
                setAnalysisComplete(false);
              }}
              className="rounded-lg"
              disabled={isAnalyzing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAnalyzeSample}
              className="bg-[#28A745] hover:bg-[#1E7E34] text-white rounded-lg"
              disabled={isAnalyzing || analysisComplete}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Start Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Instrument Modal */}
      <Dialog open={isViewInstrumentModalOpen} onOpenChange={setIsViewInstrumentModalOpen}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle>Instrument Details</DialogTitle>
            <DialogDescription>View complete instrument information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <p className="text-sm text-[#6B7280]">Instrument ID</p>
              <p className="text-[#333333]">{selectedInstrument?.instrumentId}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Name</p>
              <p className="text-[#333333]">{selectedInstrument?.name}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Model</p>
              <p className="text-[#333333]">{selectedInstrument?.model}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Type</p>
              <p className="text-[#333333]">{selectedInstrument?.type}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Status</p>
              <Badge className={`${getStatusBadge(selectedInstrument?.status || "")} rounded-lg`}>
                {selectedInstrument?.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Last Run Date</p>
              <p className="text-[#333333]">{selectedInstrument?.lastRunDate || "-"}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewInstrumentModalOpen(false)} className="rounded-lg">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Reagent Modal */}
      <Dialog open={isAddReagentModalOpen} onOpenChange={(open) => {
        setIsAddReagentModalOpen(open);
        if (!open) resetReagentForm();
      }}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle>Install New Reagent</DialogTitle>
            <DialogDescription>Add a new reagent to the inventory</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="reagentName">Name *</Label>
              <Input
                id="reagentName"
                placeholder="Enter reagent name"
                value={reagentForm.name}
                onChange={(e) => setReagentForm({ ...reagentForm, name: e.target.value })}
                className={`rounded-lg mt-1 ${reagentErrors.name ? "border-red-500" : ""}`}
              />
              {reagentErrors.name && <p className="text-xs text-red-600 mt-1">{reagentErrors.name}</p>}
            </div>

            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                value={reagentForm.quantity}
                onChange={(e) => setReagentForm({ ...reagentForm, quantity: e.target.value })}
                className={`rounded-lg mt-1 ${reagentErrors.quantity ? "border-red-500" : ""}`}
              />
              {reagentErrors.quantity && <p className="text-xs text-red-600 mt-1">{reagentErrors.quantity}</p>}
            </div>

            <div>
              <Label htmlFor="expirationDate">Expiration Date *</Label>
              <Input
                id="expirationDate"
                type="date"
                value={reagentForm.expirationDate}
                onChange={(e) => setReagentForm({ ...reagentForm, expirationDate: e.target.value })}
                className={`rounded-lg mt-1 ${reagentErrors.expirationDate ? "border-red-500" : ""}`}
              />
              {reagentErrors.expirationDate && <p className="text-xs text-red-600 mt-1">{reagentErrors.expirationDate}</p>}
            </div>

            <div>
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input
                id="vendorName"
                placeholder="Enter vendor name"
                value={reagentForm.vendorName}
                onChange={(e) => setReagentForm({ ...reagentForm, vendorName: e.target.value })}
                className={`rounded-lg mt-1 ${reagentErrors.vendorName ? "border-red-500" : ""}`}
              />
              {reagentErrors.vendorName && <p className="text-xs text-red-600 mt-1">{reagentErrors.vendorName}</p>}
            </div>

            <div>
              <Label htmlFor="vendorId">Vendor ID *</Label>
              <Input
                id="vendorId"
                placeholder="VEN-XXX"
                value={reagentForm.vendorId}
                onChange={(e) => setReagentForm({ ...reagentForm, vendorId: e.target.value })}
                className={`rounded-lg mt-1 ${reagentErrors.vendorId ? "border-red-500" : ""}`}
              />
              {reagentErrors.vendorId && <p className="text-xs text-red-600 mt-1">{reagentErrors.vendorId}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="lotNumber">Lot Number *</Label>
              <Input
                id="lotNumber"
                placeholder="LOT-XXXX-XXX"
                value={reagentForm.lotNumber}
                onChange={(e) => setReagentForm({ ...reagentForm, lotNumber: e.target.value })}
                className={`rounded-lg mt-1 ${reagentErrors.lotNumber ? "border-red-500" : ""}`}
              />
              {reagentErrors.lotNumber && <p className="text-xs text-red-600 mt-1">{reagentErrors.lotNumber}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddReagentModalOpen(false);
                resetReagentForm();
              }}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddReagent}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-lg"
            >
              Install Reagent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Reagent Modal */}
      <Dialog open={isEditReagentModalOpen} onOpenChange={setIsEditReagentModalOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Reagent Status</DialogTitle>
            <DialogDescription>
              Update status for {selectedReagent?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Current Status</Label>
              <Input
                value={selectedReagent?.status || ""}
                disabled
                className="bg-gray-50 rounded-lg mt-1"
              />
            </div>

            <div>
              <Label htmlFor="newStatus">New Status</Label>
              <Select
                value={editReagentStatus}
                onValueChange={(value: "In Use" | "Not in Use") => setEditReagentStatus(value)}
              >
                <SelectTrigger className="rounded-lg mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Use">In Use</SelectItem>
                  <SelectItem value="Not in Use">Not in Use</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditReagentModalOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditReagent}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-lg"
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Reagent Dialog */}
      <AlertDialog open={isDeleteReagentDialogOpen} onOpenChange={setIsDeleteReagentDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reagent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reagent? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteReagent}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Raw Result Dialog */}
      <AlertDialog open={isDeleteRawResultDialogOpen} onOpenChange={setIsDeleteRawResultDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm deletion of raw result? Only backed-up results can be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRawResult}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Sync Configuration Dialog */}
      <AlertDialog open={isSyncConfigDialogOpen} onOpenChange={setIsSyncConfigDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sync Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to sync configuration for this instrument?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSyncConfiguration}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-lg"
            >
              Sync Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
