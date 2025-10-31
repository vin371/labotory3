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
  Activity,
  Wrench,
  AlertTriangle,
  RefreshCw,
  Beaker,
  ScanBarcode,
  PlayCircle,
  CheckCircle2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";

interface Instrument {
  id: string;
  instrumentId: string;
  name: string;
  model: string;
  type: string;
  status: "Ready" | "Maintenance" | "Inactive";
  lastRunDate?: string;
  lastMaintenanceDate?: string;
  location?: string;
}

interface Reagent {
  id: string;
  name: string;
  lotNumber: string;
  expirationDate: string;
  quantity: number;
  vendorName: string;
  status: "In Use" | "Not In Use";
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
    lastMaintenanceDate: "10/15/2025",
    location: "Lab Room A",
  },
  {
    id: "2",
    instrumentId: "INS-002",
    name: "Chemistry Analyzer AU-680",
    model: "AU-680",
    type: "Chemistry",
    status: "Ready",
    lastRunDate: "10/19/2025",
    lastMaintenanceDate: "10/10/2025",
    location: "Lab Room B",
  },
  {
    id: "3",
    instrumentId: "INS-003",
    name: "Immunology Analyzer i2000",
    model: "i2000",
    type: "Immunology",
    status: "Maintenance",
    lastRunDate: "10/18/2025",
    lastMaintenanceDate: "10/20/2025",
    location: "Lab Room C",
  },
  {
    id: "4",
    instrumentId: "INS-004",
    name: "Microbiology Analyzer VITEK 2",
    model: "VITEK 2",
    type: "Microbiology",
    status: "Ready",
    lastRunDate: "10/20/2025",
    lastMaintenanceDate: "10/12/2025",
    location: "Lab Room D",
  },
  {
    id: "5",
    instrumentId: "INS-005",
    name: "Coagulation Analyzer ACL Top 500",
    model: "ACL Top 500",
    type: "Coagulation",
    status: "Inactive",
    lastRunDate: "10/15/2025",
    lastMaintenanceDate: "09/30/2025",
    location: "Lab Room A",
  },
];

const mockReagents: Reagent[] = [
  {
    id: "1",
    name: "Hemoglobin Reagent",
    lotNumber: "LOT-2025-001",
    expirationDate: "12/31/2025",
    quantity: 500,
    vendorName: "Sysmex Corporation",
    status: "In Use",
  },
  {
    id: "2",
    name: "Glucose Test Kit",
    lotNumber: "LOT-2025-002",
    expirationDate: "11/30/2025",
    quantity: 300,
    vendorName: "Beckman Coulter",
    status: "In Use",
  },
  {
    id: "3",
    name: "Cholesterol Reagent",
    lotNumber: "LOT-2025-003",
    expirationDate: "01/15/2026",
    quantity: 150,
    vendorName: "Roche Diagnostics",
    status: "Not In Use",
  },
  {
    id: "4",
    name: "TSH Immunoassay Kit",
    lotNumber: "LOT-2025-004",
    expirationDate: "03/20/2026",
    quantity: 200,
    vendorName: "Abbott Laboratories",
    status: "In Use",
  },
];

const mockTestOrders = [
  { id: "TO-2025-001", patientName: "Nguyễn Văn An" },
  { id: "TO-2025-002", patientName: "Trần Thị Mai" },
  { id: "TO-2025-003", patientName: "Lê Hoàng Nam" },
  { id: "TO-2025-004", patientName: "Phạm Thị Lan" },
];

export function InstrumentsManagementLabUser() {
  const { user } = useAuth();
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [reagents, setReagents] = useState<Reagent[]>(mockReagents);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [isChangeModeModalOpen, setIsChangeModeModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [isReagentModalOpen, setIsReagentModalOpen] = useState(false);
  const [isRunSampleModalOpen, setIsRunSampleModalOpen] = useState(false);
  
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [isReagentsExpanded, setIsReagentsExpanded] = useState(false);
  
  // Blood sample states
  const [barcode, setBarcode] = useState("");
  const [selectedTestOrder, setSelectedTestOrder] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Change mode form
  const [changeModeForm, setChangeModeForm] = useState({
    newMode: "" as "Ready" | "Maintenance" | "Inactive" | "",
    reason: "",
    confirmQC: false,
  });
  const [changeModeErrors, setChangeModeErrors] = useState<Record<string, string>>({});
  
  // Reagent form
  const [reagentForm, setReagentForm] = useState({
    name: "",
    lotNumber: "",
    expirationDate: "",
    quantity: "",
    vendorName: "",
  });
  const [reagentErrors, setReagentErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = {
    total: instruments.length,
    ready: instruments.filter(i => i.status === "Ready").length,
    maintenance: instruments.filter(i => i.status === "Maintenance").length,
  };

  // Filter instruments
  const filteredInstruments = instruments.filter(instrument => {
    const matchesSearch = 
      instrument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instrument.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instrument.instrumentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || instrument.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle change mode
  const handleOpenChangeMode = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setChangeModeForm({
      newMode: "",
      reason: "",
      confirmQC: false,
    });
    setChangeModeErrors({});
    setIsChangeModeModalOpen(true);
  };

  const validateChangeModeForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!changeModeForm.newMode) {
      errors.newMode = "Please select a new mode";
    }

    if ((changeModeForm.newMode === "Maintenance" || changeModeForm.newMode === "Inactive") && !changeModeForm.reason.trim()) {
      errors.reason = "Reason is required when switching to Maintenance or Inactive";
    }

    if (changeModeForm.newMode === "Ready" && !changeModeForm.confirmQC) {
      errors.confirmQC = "QC confirmation is required when switching to Ready mode";
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
    toast.success("✅ Instrument mode changed successfully", {
      description: `${selectedInstrument.name} is now ${changeModeForm.newMode}`
    });
  };

  // Handle sync configuration
  const handleSyncConfiguration = () => {
    setIsSyncDialogOpen(false);
    toast.success("✅ Configuration sync-up completed successfully", {
      description: "All instrument configurations have been synchronized"
    });
  };

  // Handle blood sample analysis
  const handleRunBloodSample = () => {
    if (!barcode.trim()) {
      toast.error("Please enter or scan a barcode");
      return;
    }

    if (!selectedTestOrder) {
      toast.error("Please select a test order");
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsRunSampleModalOpen(false);
      setBarcode("");
      setSelectedTestOrder("");
      toast.success("✅ Test completed successfully", {
        description: "Results published via HL7"
      });
    }, 3000);
  };

  // Handle reagent installation
  const validateReagentForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!reagentForm.name.trim()) {
      errors.name = "Reagent name is required";
    }

    if (!reagentForm.lotNumber.trim()) {
      errors.lotNumber = "Lot number is required";
    }

    if (!reagentForm.expirationDate) {
      errors.expirationDate = "Expiration date is required";
    } else {
      const expDate = new Date(reagentForm.expirationDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expDate <= today) {
        errors.expirationDate = "Expiration date must be in the future";
      }
    }

    if (!reagentForm.quantity || Number(reagentForm.quantity) <= 0) {
      errors.quantity = "Quantity must be greater than 0";
    }

    if (!reagentForm.vendorName.trim()) {
      errors.vendorName = "Vendor name is required";
    }

    setReagentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInstallReagent = () => {
    if (!validateReagentForm()) {
      toast.error("Validation failed", {
        description: "Please check all required fields"
      });
      return;
    }

    const newReagent: Reagent = {
      id: Date.now().toString(),
      name: reagentForm.name,
      lotNumber: reagentForm.lotNumber,
      expirationDate: reagentForm.expirationDate,
      quantity: Number(reagentForm.quantity),
      vendorName: reagentForm.vendorName,
      status: "Not In Use",
    };

    setReagents([newReagent, ...reagents]);
    setIsReagentModalOpen(false);
    resetReagentForm();
    toast.success("✅ Reagent installed successfully", {
      description: `${newReagent.name} has been added to inventory`
    });
  };

  const resetReagentForm = () => {
    setReagentForm({
      name: "",
      lotNumber: "",
      expirationDate: "",
      quantity: "",
      vendorName: "",
    });
    setReagentErrors({});
  };

  const handleDeleteReagent = (reagentId: string) => {
    setReagents(reagents.filter(r => r.id !== reagentId));
    toast.success("Reagent removed successfully");
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const styles = {
      "Ready": "bg-green-100 text-green-800 border-green-200",
      "Maintenance": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Inactive": "bg-red-100 text-red-800 border-red-200",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const getReagentStatusBadge = (status: string) => {
    const styles = {
      "In Use": "bg-blue-100 text-blue-800 border-blue-200",
      "Not In Use": "bg-gray-100 text-gray-800 border-gray-200",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm" style={{ background: "linear-gradient(135deg, #E3F2FD 0%, #ffffff 100%)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Beaker className="h-5 w-5 text-[#007BFF]" />
                  <p className="text-sm text-[#6B7280]">Total Instruments</p>
                </div>
                <p className="text-[#333333]">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm" style={{ background: "linear-gradient(135deg, #E8F5E9 0%, #ffffff 100%)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-5 w-5 text-[#28A745]" />
                  <p className="text-sm text-[#6B7280]">Active (Ready) Instruments</p>
                </div>
                <p className="text-[#333333]">{stats.ready}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm" style={{ background: "linear-gradient(135deg, #FFF9E6 0%, #ffffff 100%)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wrench className="h-5 w-5 text-[#FFC107]" />
                  <p className="text-sm text-[#6B7280]">Under Maintenance</p>
                </div>
                <p className="text-[#333333]">{stats.maintenance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blood Sample Analysis Section */}
      <Card className="rounded-xl border-[#E0E6ED] shadow-sm bg-gradient-to-r from-[#EAF3FF] to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#007BFF] rounded-xl">
                <ScanBarcode className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-[#333333]">Run Blood Sample Analysis</h3>
                <p className="text-sm text-[#6B7280]">Scan barcode and process test samples</p>
              </div>
            </div>
            <Button
              onClick={() => setIsRunSampleModalOpen(true)}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-xl shadow-sm"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Run Sample
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Instruments Table */}
      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-[#EAF3FF] to-white border-b border-[#E0E6ED]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#333333]">Laboratory Instruments</CardTitle>
              <CardDescription>View and control instrument modes</CardDescription>
            </div>
            <Button
              onClick={() => setIsSyncDialogOpen(true)}
              variant="outline"
              className="rounded-xl border-[#E0E6ED] hover:bg-[#EAF3FF]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Configuration
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Search by name or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-[#E0E6ED]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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

          {/* Table with Scroll */}
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
                      <TableHead>Name</TableHead>
                      <TableHead>Model / Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Run Date</TableHead>
                      <TableHead>Last Maintenance Date</TableHead>
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
                        <TableCell>{instrument.lastMaintenanceDate || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedInstrument(instrument);
                                setIsViewModalOpen(true);
                              }}
                              className="h-8 w-8 p-0 hover:bg-[#EAF3FF]"
                            >
                              <Eye className="h-4 w-4 text-[#007BFF]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenChangeMode(instrument)}
                              className="h-8 w-8 p-0 hover:bg-[#EAF3FF]"
                            >
                              <Settings className="h-4 w-4 text-[#6B7280]" />
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

      {/* Reagents Section */}
      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader 
          className="bg-gradient-to-r from-[#EAF3FF] to-white border-b border-[#E0E6ED] cursor-pointer hover:bg-[#F9FBFF] transition-colors"
          onClick={() => setIsReagentsExpanded(!isReagentsExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Beaker className="h-5 w-5 text-[#007BFF]" />
              <div>
                <CardTitle className="text-[#333333]">Reagents Management</CardTitle>
                <CardDescription>Manage laboratory reagents and supplies</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isReagentsExpanded && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsReagentModalOpen(true);
                  }}
                  className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-xl shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Install New Reagent
                </Button>
              )}
              {isReagentsExpanded ? (
                <ChevronUp className="h-5 w-5 text-[#6B7280]" />
              ) : (
                <ChevronDown className="h-5 w-5 text-[#6B7280]" />
              )}
            </div>
          </div>
        </CardHeader>
        {isReagentsExpanded && (
          <CardContent className="p-6">
            <div className="border border-[#E0E6ED] rounded-xl overflow-hidden">
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-[#F9FBFF] z-10">
                    <TableRow>
                      <TableHead>Reagent Name</TableHead>
                      <TableHead>Lot Number</TableHead>
                      <TableHead>Expiration Date</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Vendor Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reagents.map((reagent) => (
                      <TableRow key={reagent.id} className="hover:bg-[#F9FBFF]">
                        <TableCell className="font-medium">{reagent.name}</TableCell>
                        <TableCell>{reagent.lotNumber}</TableCell>
                        <TableCell>{reagent.expirationDate}</TableCell>
                        <TableCell>{reagent.quantity}</TableCell>
                        <TableCell>{reagent.vendorName}</TableCell>
                        <TableCell>
                          <Badge className={`${getReagentStatusBadge(reagent.status)} rounded-lg px-2 py-1`}>
                            {reagent.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReagent(reagent.id)}
                              className="h-8 px-3 hover:bg-red-50 text-red-600"
                            >
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
        )}
      </Card>

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
                  <SelectValue placeholder="Select new mode" />
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
                  placeholder="Enter reason for changing mode..."
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
                  id="confirmQC"
                  checked={changeModeForm.confirmQC}
                  onCheckedChange={(checked) => 
                    setChangeModeForm({ ...changeModeForm, confirmQC: checked as boolean })
                  }
                />
                <Label 
                  htmlFor="confirmQC" 
                  className={`cursor-pointer ${changeModeErrors.confirmQC ? "text-red-600" : ""}`}
                >
                  Confirm QC has been performed *
                </Label>
              </div>
            )}
            {changeModeErrors.confirmQC && (
              <p className="text-xs text-red-600">{changeModeErrors.confirmQC}</p>
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

      {/* View Instrument Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle>Instrument Details</DialogTitle>
            <DialogDescription>View complete instrument information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
                <p className="text-sm text-[#6B7280]">Location</p>
                <p className="text-[#333333]">{selectedInstrument?.location || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Last Run Date</p>
                <p className="text-[#333333]">{selectedInstrument?.lastRunDate || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Last Maintenance Date</p>
                <p className="text-[#333333]">{selectedInstrument?.lastMaintenanceDate || "-"}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)} className="rounded-lg">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run Blood Sample Modal */}
      <Dialog open={isRunSampleModalOpen} onOpenChange={setIsRunSampleModalOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Run Blood Sample Analysis</DialogTitle>
            <DialogDescription>Scan barcode and process test sample</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="barcode">Input / Scan Barcode</Label>
              <Input
                id="barcode"
                placeholder="Scan or enter barcode..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="rounded-lg mt-1"
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="testOrder">Select Test Order</Label>
              <Select value={selectedTestOrder} onValueChange={setSelectedTestOrder}>
                <SelectTrigger className="rounded-lg mt-1">
                  <SelectValue placeholder="Select test order" />
                </SelectTrigger>
                <SelectContent>
                  {mockTestOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.id} - {order.patientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#007BFF]">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <p className="text-sm">Sample processing...</p>
                </div>
                <Progress value={66} className="h-2" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRunSampleModalOpen(false);
                setBarcode("");
                setSelectedTestOrder("");
                setIsProcessing(false);
              }}
              className="rounded-lg"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRunBloodSample}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-lg"
              disabled={isProcessing}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Run Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Install Reagent Modal */}
      <Dialog open={isReagentModalOpen} onOpenChange={(open) => {
        setIsReagentModalOpen(open);
        if (!open) resetReagentForm();
      }}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle>Install New Reagent</DialogTitle>
            <DialogDescription>Add a new reagent to the inventory</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="reagentName">Reagent Name *</Label>
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
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsReagentModalOpen(false);
                resetReagentForm();
              }}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInstallReagent}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-lg"
            >
              Install Reagent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sync Configuration Dialog */}
      <AlertDialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sync Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to sync configurations for all instruments? This will update all instrument settings to the latest configuration.
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
