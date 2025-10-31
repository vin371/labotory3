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
import { 
  Search, 
  Eye, 
  Filter,
  Wrench,
  FlaskRound,
  Settings2,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Power,
  ChevronDown,
  ChevronUp,
  Calendar,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

interface Instrument {
  id: string;
  instrumentId: string;
  name: string;
  model: string;
  type: string;
  status: "Ready" | "Processing" | "Maintenance" | "Inactive" | "Error";
  lastModified: string;
  lastCheckTime?: string;
  errorMessage?: string;
}

interface ReagentSupply {
  id: string;
  reagentName: string;
  vendorName: string;
  vendorId: string;
  orderDate: string;
  receiptDate: string;
  quantity: number;
  expirationDate: string;
  lotNumber: string;
  status: "Received" | "Partial" | "Returned";
}

interface ReagentUsage {
  id: string;
  reagentName: string;
  quantityUsed: number;
  usedBy: string;
  dateTime: string;
  testOrderId: string;
}

interface Configuration {
  id: string;
  key: string;
  description: string;
  value: string;
  type: "General" | "Specific";
  lastUpdated: string;
  isValid: boolean;
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
    lastModified: "10/20/2025 14:30",
    lastCheckTime: "10/20/2025 14:25",
  },
  {
    id: "2",
    instrumentId: "INS-002",
    name: "Chemistry Analyzer AU-680",
    model: "AU-680",
    type: "Chemistry",
    status: "Processing",
    lastModified: "10/20/2025 13:15",
    lastCheckTime: "10/20/2025 13:10",
  },
  {
    id: "3",
    instrumentId: "INS-003",
    name: "Immunology Analyzer i2000",
    model: "i2000",
    type: "Immunology",
    status: "Error",
    lastModified: "10/20/2025 12:00",
    lastCheckTime: "10/20/2025 11:55",
    errorMessage: "Calibration failed - sensor malfunction detected",
  },
  {
    id: "4",
    instrumentId: "INS-004",
    name: "Microbiology Analyzer VITEK 2",
    model: "VITEK 2",
    type: "Microbiology",
    status: "Maintenance",
    lastModified: "10/19/2025 16:45",
    lastCheckTime: "10/19/2025 16:40",
  },
  {
    id: "5",
    instrumentId: "INS-005",
    name: "Coagulation Analyzer ACL Top 500",
    model: "ACL Top 500",
    type: "Coagulation",
    status: "Inactive",
    lastModified: "10/15/2025 10:20",
    lastCheckTime: "10/15/2025 10:15",
  },
];

const mockReagentSupply: ReagentSupply[] = [
  {
    id: "1",
    reagentName: "Hemoglobin Reagent Kit",
    vendorName: "Sysmex Corporation",
    vendorId: "VEN-001",
    orderDate: "10/10/2025",
    receiptDate: "10/15/2025",
    quantity: 500,
    expirationDate: "12/31/2025",
    lotNumber: "LOT-2025-001",
    status: "Received",
  },
  {
    id: "2",
    reagentName: "Glucose Test Kit",
    vendorName: "Beckman Coulter",
    vendorId: "VEN-002",
    orderDate: "10/12/2025",
    receiptDate: "10/16/2025",
    quantity: 300,
    expirationDate: "11/30/2025",
    lotNumber: "LOT-2025-002",
    status: "Partial",
  },
  {
    id: "3",
    reagentName: "TSH Immunoassay Kit",
    vendorName: "Abbott Laboratories",
    vendorId: "VEN-003",
    orderDate: "10/05/2025",
    receiptDate: "10/08/2025",
    quantity: 200,
    expirationDate: "03/20/2026",
    lotNumber: "LOT-2025-003",
    status: "Received",
  },
];

const mockReagentUsage: ReagentUsage[] = [
  {
    id: "1",
    reagentName: "Hemoglobin Reagent Kit",
    quantityUsed: 25,
    usedBy: "Dr. Nguyễn Văn An",
    dateTime: "10/20/2025 14:30",
    testOrderId: "TO-2025-001",
  },
  {
    id: "2",
    reagentName: "Glucose Test Kit",
    quantityUsed: 15,
    usedBy: "Dr. Trần Thị Mai",
    dateTime: "10/20/2025 13:15",
    testOrderId: "TO-2025-002",
  },
  {
    id: "3",
    reagentName: "TSH Immunoassay Kit",
    quantityUsed: 10,
    usedBy: "Dr. Lê Hoàng Nam",
    dateTime: "10/20/2025 12:00",
    testOrderId: "TO-2025-003",
  },
  {
    id: "4",
    reagentName: "Hemoglobin Reagent Kit",
    quantityUsed: 20,
    usedBy: "Dr. Phạm Thị Lan",
    dateTime: "10/19/2025 16:45",
    testOrderId: "TO-2025-004",
  },
];

const mockConfigurations: Configuration[] = [
  {
    id: "1",
    key: "HL7_SERVER_URL",
    description: "HL7 Integration Server URL",
    value: "https://hl7.labsystem.com:8080",
    type: "General",
    lastUpdated: "10/15/2025",
    isValid: true,
  },
  {
    id: "2",
    key: "MAX_CONCURRENT_TESTS",
    description: "Maximum concurrent test executions",
    value: "10",
    type: "Specific",
    lastUpdated: "10/10/2025",
    isValid: true,
  },
  {
    id: "3",
    key: "BACKUP_RETENTION_DAYS",
    description: "Raw test results backup retention period",
    value: "90",
    type: "General",
    lastUpdated: "10/01/2025",
    isValid: true,
  },
  {
    id: "4",
    key: "REAGENT_LOW_THRESHOLD",
    description: "Low reagent quantity alert threshold",
    value: "50",
    type: "Specific",
    lastUpdated: "09/25/2025",
    isValid: true,
  },
  {
    id: "5",
    key: "INVALID_CONFIG_KEY",
    description: "Invalid configuration example",
    value: "",
    type: "General",
    lastUpdated: "08/15/2025",
    isValid: false,
  },
];

interface WarehouseManagementLabUserProps {
  onNavigateToDashboard?: () => void;
}

export function WarehouseManagementLabUser({ onNavigateToDashboard }: WarehouseManagementLabUserProps = {}) {
  const [activeTab, setActiveTab] = useState("instruments");

  // Instrument states
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [instrumentSearch, setInstrumentSearch] = useState("");
  const [instrumentStatusFilter, setInstrumentStatusFilter] = useState("all");
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);

  // Reagent states
  const [reagentSupply, setReagentSupply] = useState<ReagentSupply[]>(mockReagentSupply);
  const [reagentUsage, setReagentUsage] = useState<ReagentUsage[]>(mockReagentUsage);
  const [reagentSearch, setReagentSearch] = useState("");
  const [reagentStatusFilter, setReagentStatusFilter] = useState("all");
  const [isUsageExpanded, setIsUsageExpanded] = useState(false);
  const [usageSearch, setUsageSearch] = useState("");

  // Configuration states
  const [configurations, setConfigurations] = useState<Configuration[]>(mockConfigurations);
  const [configSearch, setConfigSearch] = useState("");

  // Modal states
  const [isActivateDeactivateModalOpen, setIsActivateDeactivateModalOpen] = useState(false);
  const [isViewInstrumentModalOpen, setIsViewInstrumentModalOpen] = useState(false);
  const [isSyncConfigDialogOpen, setIsSyncConfigDialogOpen] = useState(false);

  // Form states
  const [activateForm, setActivateForm] = useState({
    status: "" as "Active" | "Inactive" | "",
    reason: "",
  });
  const [activateErrors, setActivateErrors] = useState<Record<string, string>>({});

  // Filter instruments
  const filteredInstruments = instruments
    .filter(instrument => {
      const matchesSearch = 
        instrument.name.toLowerCase().includes(instrumentSearch.toLowerCase()) ||
        instrument.instrumentId.toLowerCase().includes(instrumentSearch.toLowerCase()) ||
        instrument.model.toLowerCase().includes(instrumentSearch.toLowerCase());
      
      const matchesStatus = instrumentStatusFilter === "all" || instrument.status === instrumentStatusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());

  // Filter reagent supply
  const filteredReagentSupply = reagentSupply.filter(reagent => {
    const matchesSearch = 
      reagent.reagentName.toLowerCase().includes(reagentSearch.toLowerCase()) ||
      reagent.vendorName.toLowerCase().includes(reagentSearch.toLowerCase()) ||
      reagent.vendorId.toLowerCase().includes(reagentSearch.toLowerCase());
    
    const matchesStatus = reagentStatusFilter === "all" || reagent.status === reagentStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter reagent usage
  const filteredReagentUsage = reagentUsage.filter(usage => {
    return (
      usage.reagentName.toLowerCase().includes(usageSearch.toLowerCase()) ||
      usage.usedBy.toLowerCase().includes(usageSearch.toLowerCase()) ||
      usage.testOrderId.toLowerCase().includes(usageSearch.toLowerCase())
    );
  });

  // Filter configurations
  const filteredConfigurations = configurations.filter(config => {
    return config.key.toLowerCase().includes(configSearch.toLowerCase());
  });

  // Calculate usage statistics
  const totalUsedThisMonth = filteredReagentUsage.reduce((sum, usage) => sum + usage.quantityUsed, 0);
  const totalRemaining = reagentSupply.reduce((sum, supply) => sum + supply.quantity, 0);

  // Handle activate/deactivate
  const openActivateDeactivateModal = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setActivateForm({
      status: "",
      reason: "",
    });
    setActivateErrors({});
    setIsActivateDeactivateModalOpen(true);
  };

  const validateActivateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!activateForm.status) {
      errors.status = "Please select a status";
    }

    if (activateForm.status === "Inactive" && !activateForm.reason.trim()) {
      errors.reason = "Reason is required for deactivation";
    }

    setActivateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleActivateDeactivate = () => {
    if (!validateActivateForm() || !selectedInstrument) return;

    const newStatus = activateForm.status === "Active" ? "Ready" : "Inactive";
    const updatedInstrument = {
      ...selectedInstrument,
      status: newStatus as "Ready" | "Inactive",
      lastModified: new Date().toLocaleString(),
    };

    setInstruments(instruments.map(i => i.id === selectedInstrument.id ? updatedInstrument : i));
    setIsActivateDeactivateModalOpen(false);
    toast.success("✅ Instrument status updated successfully", {
      description: `${selectedInstrument.name} is now ${newStatus}`
    });
  };

  // Handle sync configuration
  const handleSyncConfiguration = () => {
    setIsSyncConfigDialogOpen(false);
    
    // Simulate sync
    setTimeout(() => {
      toast.success("✅ Configuration synced successfully", {
        description: "Latest configuration has been synchronized from Warehouse Service"
      });
    }, 500);
  };

  // Get status badge
  const getInstrumentStatusBadge = (status: string) => {
    const styles = {
      "Ready": "bg-green-100 text-green-800 border-green-200",
      "Processing": "bg-blue-100 text-blue-800 border-blue-200",
      "Maintenance": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Inactive": "bg-gray-100 text-gray-800 border-gray-200",
      "Error": "bg-red-100 text-red-800 border-red-200",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const getReagentStatusBadge = (status: string) => {
    const styles = {
      "Received": "bg-green-100 text-green-800 border-green-200",
      "Partial": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Returned": "bg-red-100 text-red-800 border-red-200",
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
              <BreadcrumbPage className="text-[#333333]">Warehouse</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-[#333333]">Warehouse Management</h1>
          <p className="text-[#6B7280]">Manage laboratory instruments, reagents, and configurations.</p>
        </div>
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white border border-[#E0E6ED] rounded-xl p-1">
          <TabsTrigger value="instruments" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-[#007BFF] data-[state=active]:text-white">
            <Wrench className="h-4 w-4" />
            Instruments
          </TabsTrigger>
          <TabsTrigger value="reagents" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-[#007BFF] data-[state=active]:text-white">
            <FlaskRound className="h-4 w-4" />
            Reagents History
          </TabsTrigger>
          <TabsTrigger value="configurations" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-[#007BFF] data-[state=active]:text-white">
            <Settings2 className="h-4 w-4" />
            Configurations
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Instruments */}
        <TabsContent value="instruments" className="space-y-4">
          <Card className="rounded-2xl border-[#E0E6ED] shadow-sm">
            <CardHeader className="bg-gradient-to-r from-[#EAF3FF] to-white border-b border-[#E0E6ED]">
              <CardTitle>Instruments Management</CardTitle>
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
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Instruments Table */}
              {filteredInstruments.length === 0 ? (
                <div className="text-center py-12">
                  <Wrench className="h-12 w-12 text-[#6B7280] mx-auto mb-4" />
                  <p className="text-[#6B7280]">No instruments available.</p>
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
                            <TableCell className="font-medium">{instrument.instrumentId}</TableCell>
                            <TableCell>{instrument.name}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{instrument.model}</p>
                                <p className="text-sm text-[#6B7280]">{instrument.type}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getInstrumentStatusBadge(instrument.status)} rounded-lg px-2 py-1`}>
                                {instrument.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{instrument.lastModified}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openActivateDeactivateModal(instrument)}
                                  className="h-8 px-2 hover:bg-[#E8F5E9] text-[#28A745]"
                                >
                                  <Power className="h-4 w-4 mr-1.5" />
                                  Activate/Deactivate
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedInstrument(instrument);
                                    setIsViewInstrumentModalOpen(true);
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-[#F5F5F5]"
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
              )}

              {/* Warning Note */}
              <div className="mt-4 flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Inactive instruments for over 3 months will be automatically deleted by the system.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Reagents History */}
        <TabsContent value="reagents" className="space-y-4">
          {/* Vendor Supply */}
          <Card className="rounded-2xl border-[#E0E6ED] shadow-sm">
            <CardHeader className="bg-gradient-to-r from-[#EAF3FF] to-white border-b border-[#E0E6ED]">
              <CardTitle>Reagents History - Vendor Supply</CardTitle>
              <CardDescription>Track reagent orders and receipts from vendors</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {/* Search and Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                  <Input
                    placeholder="Search by reagent or vendor..."
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
                    <SelectItem value="Received">Received</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Vendor Supply Table */}
              {filteredReagentSupply.length === 0 ? (
                <div className="text-center py-12">
                  <FlaskRound className="h-12 w-12 text-[#6B7280] mx-auto mb-4" />
                  <p className="text-[#6B7280]">No Reagent Supply History Found.</p>
                </div>
              ) : (
                <div className="border border-[#E0E6ED] rounded-xl overflow-hidden">
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader className="sticky top-0 bg-[#F9FBFF] z-10">
                        <TableRow>
                          <TableHead>Reagent Name</TableHead>
                          <TableHead>Vendor Name / ID</TableHead>
                          <TableHead>Order Date</TableHead>
                          <TableHead>Receipt Date</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Expiration Date</TableHead>
                          <TableHead>Lot Number</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReagentSupply.map((reagent) => (
                          <TableRow key={reagent.id} className="hover:bg-[#F9FBFF]">
                            <TableCell className="font-medium">{reagent.reagentName}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{reagent.vendorName}</p>
                                <p className="text-sm text-[#6B7280]">{reagent.vendorId}</p>
                              </div>
                            </TableCell>
                            <TableCell>{reagent.orderDate}</TableCell>
                            <TableCell>{reagent.receiptDate}</TableCell>
                            <TableCell>{reagent.quantity}</TableCell>
                            <TableCell>{reagent.expirationDate}</TableCell>
                            <TableCell>{reagent.lotNumber}</TableCell>
                            <TableCell>
                              <Badge className={`${getReagentStatusBadge(reagent.status)} rounded-lg px-2 py-1`}>
                                {reagent.status}
                              </Badge>
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

          {/* Usage History - Collapsible */}
          <Card className="rounded-2xl border-[#E0E6ED] shadow-sm">
            <Collapsible open={isUsageExpanded} onOpenChange={setIsUsageExpanded}>
              <CardHeader className="bg-gradient-to-r from-[#EAF3FF] to-white border-b border-[#E0E6ED]">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer">
                    <div>
                      <CardTitle>Reagents Usage History</CardTitle>
                      <CardDescription>Track reagent consumption by lab users</CardDescription>
                    </div>
                    {isUsageExpanded ? (
                      <ChevronUp className="h-5 w-5 text-[#6B7280]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[#6B7280]" />
                    )}
                  </div>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="p-6">
                  {/* Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                      <Input
                        placeholder="Search by reagent name or user..."
                        value={usageSearch}
                        onChange={(e) => setUsageSearch(e.target.value)}
                        className="pl-10 rounded-xl border-[#E0E6ED]"
                      />
                    </div>
                  </div>

                  {/* Usage Table */}
                  <div className="border border-[#E0E6ED] rounded-xl overflow-hidden mb-4">
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader className="sticky top-0 bg-[#F9FBFF] z-10">
                          <TableRow>
                            <TableHead>Reagent Name</TableHead>
                            <TableHead>Quantity Used</TableHead>
                            <TableHead>Used By</TableHead>
                            <TableHead>Date / Time</TableHead>
                            <TableHead>Test Order ID</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredReagentUsage.map((usage) => (
                            <TableRow key={usage.id} className="hover:bg-[#F9FBFF]">
                              <TableCell className="font-medium">{usage.reagentName}</TableCell>
                              <TableCell>{usage.quantityUsed}</TableCell>
                              <TableCell>{usage.usedBy}</TableCell>
                              <TableCell>{usage.dateTime}</TableCell>
                              <TableCell className="text-[#007BFF]">{usage.testOrderId}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>

                  {/* Summary Bar */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#EAF3FF] to-white border border-[#E0E6ED] rounded-xl">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-[#6B7280]">Total Reagents Used This Month</p>
                        <p className="text-[#333333]">{totalUsedThisMonth}</p>
                      </div>
                      <div className="h-10 w-px bg-[#E0E6ED]" />
                      <div>
                        <p className="text-sm text-[#6B7280]">Total Remaining</p>
                        <p className="text-[#333333]">{totalRemaining}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </TabsContent>

        {/* Tab 3: Configurations */}
        <TabsContent value="configurations" className="space-y-4">
          <Card className="rounded-2xl border-[#E0E6ED] shadow-sm">
            <CardHeader className="bg-gradient-to-r from-[#EAF3FF] to-white border-b border-[#E0E6ED]">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Configurations Management</CardTitle>
                  <CardDescription>View and sync system configurations</CardDescription>
                </div>
                <Button
                  onClick={() => setIsSyncConfigDialogOpen(true)}
                  className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-xl shadow-sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Configuration
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                  <Input
                    placeholder="Search configuration key..."
                    value={configSearch}
                    onChange={(e) => setConfigSearch(e.target.value)}
                    className="pl-10 rounded-xl border-[#E0E6ED]"
                  />
                </div>
              </div>

              {/* Configurations Table */}
              <div className="border border-[#E0E6ED] rounded-xl overflow-hidden">
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-[#F9FBFF] z-10">
                      <TableRow>
                        <TableHead>Configuration Key</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Current Value</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConfigurations.map((config) => (
                        <TableRow 
                          key={config.id} 
                          className={`hover:bg-[#F9FBFF] ${!config.isValid ? "bg-red-50" : ""}`}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {!config.isValid && (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                              )}
                              {config.key}
                            </div>
                          </TableCell>
                          <TableCell>
                            {config.isValid ? (
                              config.description
                            ) : (
                              <span className="text-red-600">
                                ⚠ Missing configuration detected. Please contact administrator.
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{config.value || "-"}</TableCell>
                          <TableCell>
                            <Badge className={`rounded-lg px-2 py-1 ${
                              config.type === "General" 
                                ? "bg-blue-100 text-blue-800 border-blue-200" 
                                : "bg-purple-100 text-purple-800 border-purple-200"
                            }`}>
                              {config.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{config.lastUpdated}</TableCell>
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

      {/* Activate/Deactivate Modal */}
      <Dialog open={isActivateDeactivateModalOpen} onOpenChange={setIsActivateDeactivateModalOpen}>
        <DialogContent className="max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Activate / Deactivate Instrument</DialogTitle>
            <DialogDescription>
              Update activation status for {selectedInstrument?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select
                value={activateForm.status}
                onValueChange={(value: "Active" | "Inactive") => 
                  setActivateForm({ ...activateForm, status: value })
                }
              >
                <SelectTrigger className={`rounded-lg mt-1 ${activateErrors.status ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {activateErrors.status && (
                <p className="text-xs text-red-600 mt-1">{activateErrors.status}</p>
              )}
            </div>

            {activateForm.status === "Inactive" && (
              <div>
                <Label htmlFor="reason">Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Enter reason for deactivation..."
                  value={activateForm.reason}
                  onChange={(e) => setActivateForm({ ...activateForm, reason: e.target.value })}
                  className={`rounded-lg mt-1 ${activateErrors.reason ? "border-red-500" : ""}`}
                  rows={3}
                />
                {activateErrors.reason && (
                  <p className="text-xs text-red-600 mt-1">{activateErrors.reason}</p>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsActivateDeactivateModalOpen(false)}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleActivateDeactivate}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-lg"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Instrument Modal */}
      <Dialog open={isViewInstrumentModalOpen} onOpenChange={setIsViewInstrumentModalOpen}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle>Instrument Details</DialogTitle>
            <DialogDescription>Complete instrument information</DialogDescription>
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
              <Badge className={`${getInstrumentStatusBadge(selectedInstrument?.status || "")} rounded-lg`}>
                {selectedInstrument?.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Last Modified</p>
              <p className="text-[#333333]">{selectedInstrument?.lastModified}</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewInstrumentModalOpen(false)} className="rounded-lg">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sync Configuration Dialog */}
      <AlertDialog open={isSyncConfigDialogOpen} onOpenChange={setIsSyncConfigDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Sync Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Sync latest configuration from Warehouse Service? This will update all configuration values to match the warehouse database.
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
