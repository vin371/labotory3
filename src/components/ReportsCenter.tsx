import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { 
  Search, 
  Filter,
  Download,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  Printer,
  Eye,
  Mail,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  FileDown,
  Send,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

type TabView = "export-excel" | "print-results";

interface TestOrder {
  id: string;
  testOrderId: string;
  patientName: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  phoneNumber: string;
  status: "Completed" | "Pending" | "In Progress";
  createdBy: string;
  createdOn: string;
  runBy: string;
  runOn: string;
  testResults?: TestResult[];
  comments?: string;
}

interface TestResult {
  testName: string;
  result: string;
  unit: string;
  referenceRange: string;
  flag: "Normal" | "High" | "Low" | "Critical";
}

// Mock Data
const mockTestOrders: TestOrder[] = [
  {
    id: "TO-001",
    testOrderId: "TO-2025-1234",
    patientName: "Nguyen Van An",
    gender: "Male",
    dateOfBirth: "1985-05-15",
    phoneNumber: "+84 912 345 678",
    status: "Completed",
    createdBy: "admin@lab.com",
    createdOn: "2025-10-15 09:30:00",
    runBy: "labuser01@lab.com",
    runOn: "2025-10-15 14:30:00",
    testResults: [
      { testName: "WBC (White Blood Cell)", result: "7.5", unit: "10^9/L", referenceRange: "4.0-10.0", flag: "Normal" },
      { testName: "RBC (Red Blood Cell)", result: "5.2", unit: "10^12/L", referenceRange: "4.5-5.5", flag: "Normal" },
      { testName: "Hemoglobin", result: "15.8", unit: "g/dL", referenceRange: "13.5-17.5", flag: "Normal" },
      { testName: "Glucose", result: "125", unit: "mg/dL", referenceRange: "70-100", flag: "High" }
    ],
    comments: "Fasting glucose slightly elevated. Recommend repeat test and dietary consultation."
  },
  {
    id: "TO-002",
    testOrderId: "TO-2025-1235",
    patientName: "Tran Thi Binh",
    gender: "Female",
    dateOfBirth: "1992-08-22",
    phoneNumber: "+84 987 654 321",
    status: "Completed",
    createdBy: "admin@lab.com",
    createdOn: "2025-10-16 10:15:00",
    runBy: "labuser02@lab.com",
    runOn: "2025-10-16 15:45:00",
    testResults: [
      { testName: "WBC (White Blood Cell)", result: "6.8", unit: "10^9/L", referenceRange: "4.0-10.0", flag: "Normal" },
      { testName: "RBC (Red Blood Cell)", result: "4.1", unit: "10^12/L", referenceRange: "4.0-5.0", flag: "Normal" },
      { testName: "Hemoglobin", result: "12.5", unit: "g/dL", referenceRange: "12.0-16.0", flag: "Normal" },
      { testName: "Platelets", result: "180", unit: "10^9/L", referenceRange: "150-400", flag: "Normal" }
    ],
    comments: "All results within normal range. No further action required."
  },
  {
    id: "TO-003",
    testOrderId: "TO-2025-1236",
    patientName: "Le Van Cuong",
    gender: "Male",
    dateOfBirth: "1978-03-10",
    phoneNumber: "+84 908 765 432",
    status: "Pending",
    createdBy: "labuser01@lab.com",
    createdOn: "2025-10-17 08:00:00",
    runBy: "",
    runOn: ""
  },
  {
    id: "TO-004",
    testOrderId: "TO-2025-1237",
    patientName: "Pham Thi Dao",
    gender: "Female",
    dateOfBirth: "2000-11-30",
    phoneNumber: "+84 913 456 789",
    status: "In Progress",
    createdBy: "admin@lab.com",
    createdOn: "2025-10-17 09:45:00",
    runBy: "labuser01@lab.com",
    runOn: "2025-10-17 11:00:00"
  },
  {
    id: "TO-005",
    testOrderId: "TO-2025-1238",
    patientName: "Hoang Van Em",
    gender: "Male",
    dateOfBirth: "1995-07-18",
    phoneNumber: "+84 920 111 222",
    status: "Completed",
    createdBy: "labuser02@lab.com",
    createdOn: "2025-10-17 11:30:00",
    runBy: "labuser02@lab.com",
    runOn: "2025-10-17 14:15:00",
    testResults: [
      { testName: "Total Cholesterol", result: "240", unit: "mg/dL", referenceRange: "< 200", flag: "High" },
      { testName: "LDL Cholesterol", result: "160", unit: "mg/dL", referenceRange: "< 100", flag: "High" },
      { testName: "HDL Cholesterol", result: "35", unit: "mg/dL", referenceRange: "> 40", flag: "Low" },
      { testName: "Triglycerides", result: "220", unit: "mg/dL", referenceRange: "< 150", flag: "High" }
    ],
    comments: "Lipid panel shows elevated cholesterol and triglycerides. Recommend lifestyle modifications and follow-up in 3 months."
  }
];

interface ReportsCenterProps {
  onNavigateToDashboard?: () => void;
}

export function ReportsCenter({ onNavigateToDashboard }: ReportsCenterProps = {}) {
  const { user: currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<TabView>("export-excel");
  
  // Filter State
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCreatedBy, setFilterCreatedBy] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Test Orders State
  const [testOrders, setTestOrders] = useState<TestOrder[]>(mockTestOrders);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<TestOrder | null>(null);
  
  // Export/Print State
  const [isExporting, setIsExporting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [printProgress, setPrintProgress] = useState(0);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  
  // Statistics
  const stats = {
    totalOrders: testOrders.length,
    completed: testOrders.filter(o => o.status === "Completed").length,
    pending: testOrders.filter(o => o.status === "Pending").length,
    inProgress: testOrders.filter(o => o.status === "In Progress").length,
    lastExported: "2025-10-16 15:30:00",
    lastPrinted: "2025-10-17 10:15:00"
  };

  // Filter Test Orders
  const filteredOrders = testOrders.filter(order => {
    const matchesSearch = 
      order.testOrderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phoneNumber.includes(searchQuery);
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesCreatedBy = filterCreatedBy === "all" || order.createdBy === filterCreatedBy;
    
    let matchesDateRange = true;
    if (dateFrom && dateTo) {
      const orderDate = new Date(order.createdOn);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      matchesDateRange = orderDate >= fromDate && orderDate <= toDate;
    }
    
    return matchesSearch && matchesStatus && matchesCreatedBy && matchesDateRange;
  });

  // Handle Select All
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  // Handle Individual Selection
  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  // Validate File Name
  const sanitizeFileName = (name: string): string => {
    // Remove special characters except hyphens and underscores
    return name.replace(/[^a-zA-Z0-9-_]/g, "");
  };

  // Handle Export to Excel
  const handleExportExcel = () => {
    if (selectedOrders.length === 0) {
      toast.error("❌ No orders selected", {
        description: "Please select at least one test order to export."
      });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    const selectedOrdersData = testOrders.filter(o => selectedOrders.includes(o.id));
    const patientNames = selectedOrdersData.length === 1 
      ? sanitizeFileName(selectedOrdersData[0].patientName)
      : "Multiple";
    const dateExport = new Date().toISOString().split('T')[0];
    const fileName = `TestOrders-${patientNames}-${dateExport}.xlsx`;

    toast.info("📊 Preparing Excel export...", {
      description: `File: ${fileName}`
    });

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          
          toast.success("✅ Export completed successfully!", {
            description: `${selectedOrders.length} test order(s) exported to ${fileName}`
          });

          console.log(`[EXPORT_EXCEL] Orders: ${selectedOrders.length}, File: ${fileName}, By: ${currentUser?.email}`);
          
          // Clear selection
          setSelectedOrders([]);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  // Handle Print Preview
  const handlePrintPreview = (order: TestOrder) => {
    if (order.status !== "Completed") {
      toast.error("❌ Cannot print", {
        description: "Only completed test orders can be printed."
      });
      return;
    }

    setSelectedOrderForPrint(order);
    setIsPrintPreviewOpen(true);
  };

  // Handle Print/Download PDF
  const handlePrintPDF = (downloadOnly: boolean = false) => {
    if (!selectedOrderForPrint) return;

    setIsPrintPreviewOpen(false);
    setIsPrinting(true);
    setPrintProgress(0);

    const patientName = sanitizeFileName(selectedOrderForPrint.patientName);
    const datePrint = new Date().toISOString().split('T')[0];
    const fileName = `Detail-${patientName}-${datePrint}.pdf`;

    toast.info(downloadOnly ? "📥 Preparing PDF download..." : "🖨️ Print in progress...", {
      description: `File: ${fileName}`
    });

    const interval = setInterval(() => {
      setPrintProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPrinting(false);
          
          if (downloadOnly) {
            toast.success("✅ PDF downloaded successfully!", {
              description: `File: ${fileName}`
            });
          } else {
            toast.success("✅ Print completed successfully!", {
              description: `Document sent to printer.`
            });
          }

          console.log(`[${downloadOnly ? 'DOWNLOAD_PDF' : 'PRINT_PDF'}] Order: ${selectedOrderForPrint.testOrderId}, File: ${fileName}, By: ${currentUser?.email}`);
          
          setSelectedOrderForPrint(null);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Handle Send Email
  const handleSendEmail = () => {
    if (!selectedOrderForPrint) return;
    if (!emailAddress || !emailAddress.includes('@')) {
      toast.error("❌ Invalid email address");
      return;
    }

    setIsSendEmailOpen(false);
    
    const patientName = sanitizeFileName(selectedOrderForPrint.patientName);
    const datePrint = new Date().toISOString().split('T')[0];
    const fileName = `Detail-${patientName}-${datePrint}.pdf`;

    toast.info("📧 Sending email...", {
      description: `To: ${emailAddress}`
    });

    setTimeout(() => {
      toast.success("✅ Email sent successfully!", {
        description: `Test results sent to ${emailAddress}`
      });

      console.log(`[SEND_EMAIL] Order: ${selectedOrderForPrint.testOrderId}, To: ${emailAddress}, File: ${fileName}, By: ${currentUser?.email}`);
      
      setSelectedOrderForPrint(null);
      setEmailAddress("");
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "In Progress":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "Pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getFlagColor = (flag: string) => {
    switch (flag) {
      case "Normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "High":
      case "Low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Render Export Excel Tab
  const renderExportExcel = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md border-[#B3D9FF] bg-gradient-to-br from-[#E3F2FD] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Total Orders</p>
                <p className="text-3xl font-semibold text-[#1976D2]">{stats.totalOrders}</p>
              </div>
              <FileText className="h-8 w-8 text-[#1976D2] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#A5D6A7] bg-gradient-to-br from-[#E8F5E9] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Completed</p>
                <p className="text-3xl font-semibold text-[#388E3C]">{stats.completed}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-[#388E3C] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#FFE082] bg-gradient-to-br from-[#FFF8E1] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Pending</p>
                <p className="text-3xl font-semibold text-[#F57C00]">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-[#F57C00] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#90CAF9] bg-gradient-to-br from-[#E3F2FD] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">In Progress</p>
                <p className="text-3xl font-semibold text-[#1976D2]">{stats.inProgress}</p>
              </div>
              <Loader2 className="h-8 w-8 text-[#1976D2] opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1976D2]">Filter & Search</CardTitle>
          <CardDescription className="text-[#555555]">
            Refine your test order list
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dateFrom" className="text-sm">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-white border-[#BBDEFB] rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateTo" className="text-sm">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-white border-[#BBDEFB] rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-sm">Test Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-white rounded-xl border-[#BBDEFB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm">Created By</Label>
              <Select value={filterCreatedBy} onValueChange={setFilterCreatedBy}>
                <SelectTrigger className="bg-white rounded-xl border-[#BBDEFB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin@lab.com">admin@lab.com</SelectItem>
                  <SelectItem value="labuser01@lab.com">labuser01@lab.com</SelectItem>
                  <SelectItem value="labuser02@lab.com">labuser02@lab.com</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="search" className="text-sm">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Order ID, name, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-[#BBDEFB] rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-[#666666]">
              {selectedOrders.length > 0 ? (
                <span className="font-medium text-[#1976D2]">{selectedOrders.length} order(s) selected</span>
              ) : (
                <span>Select orders to export</span>
              )}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handleExportExcel}
                disabled={isExporting || selectedOrders.length === 0}
                className="bg-[#1976D2] hover:bg-[#1565C0] rounded-xl"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export to Excel
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Export Progress */}
          {isExporting && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-blue-800 font-medium">Exporting test orders...</p>
                <p className="text-sm text-blue-600">{exportProgress}%</p>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Orders Table */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1976D2]">Test Orders List</CardTitle>
          <CardDescription className="text-[#555555]">
            {filteredOrders.length === 0 
              ? "No Data Found. Showing all current month's orders." 
              : `${filteredOrders.length} order(s) found - Latest first`}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
                <p className="text-[#666666]">No Data Found</p>
                <p className="text-sm text-[#999999] mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#1976D2] w-12">
                      <Checkbox
                        checked={selectedOrders.length === filteredOrders.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="text-[#1976D2]">Test Order ID</TableHead>
                    <TableHead className="text-[#1976D2]">Patient Name</TableHead>
                    <TableHead className="text-[#1976D2]">Gender</TableHead>
                    <TableHead className="text-[#1976D2]">Date of Birth</TableHead>
                    <TableHead className="text-[#1976D2]">Phone Number</TableHead>
                    <TableHead className="text-[#1976D2]">Status</TableHead>
                    <TableHead className="text-[#1976D2]">Created By</TableHead>
                    <TableHead className="text-[#1976D2]">Created On</TableHead>
                    <TableHead className="text-[#1976D2]">Run By</TableHead>
                    <TableHead className="text-[#1976D2]">Run On</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-[#F5F5F5]">
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) => handleSelectOrder(order.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-[#333333]">{order.testOrderId}</TableCell>
                      <TableCell className="text-[#666666]">{order.patientName}</TableCell>
                      <TableCell className="text-[#666666]">{order.gender}</TableCell>
                      <TableCell className="text-[#666666]">{order.dateOfBirth}</TableCell>
                      <TableCell className="text-[#666666]">{order.phoneNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(order.status)} rounded-full flex items-center gap-1 w-fit`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#666666]">{order.createdBy}</TableCell>
                      <TableCell className="text-[#666666]">{order.createdOn}</TableCell>
                      <TableCell className="text-[#666666]">{order.runBy || "-"}</TableCell>
                      <TableCell className="text-[#666666]">{order.runOn || "-"}</TableCell>
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

  // Render Print Results Tab
  const renderPrintResults = () => (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="shadow-md border-[#90CAF9] bg-gradient-to-r from-[#E3F2FD] to-white rounded-xl">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Printer className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-blue-800 mb-1">Print Test Results</h3>
              <p className="text-sm text-blue-700">
                Generate detailed patient test results in PDF format. Only completed orders can be printed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Bar - Same as Export */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1976D2]">Filter & Search</CardTitle>
          <CardDescription className="text-[#555555]">
            Find test orders to print
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dateFrom2" className="text-sm">Date From</Label>
              <Input
                id="dateFrom2"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-white border-[#BBDEFB] rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dateTo2" className="text-sm">Date To</Label>
              <Input
                id="dateTo2"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-white border-[#BBDEFB] rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label className="text-sm">Test Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-white rounded-xl border-[#BBDEFB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-sm">Created By</Label>
              <Select value={filterCreatedBy} onValueChange={setFilterCreatedBy}>
                <SelectTrigger className="bg-white rounded-xl border-[#BBDEFB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="admin@lab.com">admin@lab.com</SelectItem>
                  <SelectItem value="labuser01@lab.com">labuser01@lab.com</SelectItem>
                  <SelectItem value="labuser02@lab.com">labuser02@lab.com</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="search2" className="text-sm">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
                <Input
                  id="search2"
                  type="text"
                  placeholder="Order ID, name, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-[#BBDEFB] rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Print Progress */}
          {isPrinting && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-blue-800 font-medium">Print in progress...</p>
                <p className="text-sm text-blue-600">{printProgress}%</p>
              </div>
              <Progress value={printProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Orders Table */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1976D2]">Completed Test Orders</CardTitle>
          <CardDescription className="text-[#555555]">
            Only completed orders are available for printing
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            {filteredOrders.filter(o => o.status === "Completed").length === 0 ? (
              <div className="text-center py-12">
                <Printer className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
                <p className="text-[#666666]">No Completed Orders</p>
                <p className="text-sm text-[#999999] mt-2">No orders available for printing</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#1976D2]">Test Order ID</TableHead>
                    <TableHead className="text-[#1976D2]">Patient Name</TableHead>
                    <TableHead className="text-[#1976D2]">Gender</TableHead>
                    <TableHead className="text-[#1976D2]">Phone Number</TableHead>
                    <TableHead className="text-[#1976D2]">Created On</TableHead>
                    <TableHead className="text-[#1976D2]">Run By</TableHead>
                    <TableHead className="text-[#1976D2] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.filter(o => o.status === "Completed").map((order) => (
                    <TableRow key={order.id} className="hover:bg-[#F5F5F5]">
                      <TableCell className="font-medium text-[#333333]">{order.testOrderId}</TableCell>
                      <TableCell className="text-[#666666]">{order.patientName}</TableCell>
                      <TableCell className="text-[#666666]">{order.gender}</TableCell>
                      <TableCell className="text-[#666666]">{order.phoneNumber}</TableCell>
                      <TableCell className="text-[#666666]">{order.createdOn}</TableCell>
                      <TableCell className="text-[#666666]">{order.runBy}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePrintPreview(order)}
                          className="text-[#1976D2] hover:text-[#1565C0] hover:bg-[#E3F2FD] rounded-xl"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview & Print
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
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
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
              <BreadcrumbPage className="text-[#333333]">Reports</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-[#333333]">Reports Center</h1>
          <p className="text-[#6B7280]">
            Export and print detailed patient test order reports
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card className="shadow-md border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Button
              variant={currentTab === "export-excel" ? "default" : "outline"}
              onClick={() => setCurrentTab("export-excel")}
              className={`rounded-xl ${
                currentTab === "export-excel"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel
            </Button>

            <Button
              variant={currentTab === "print-results" ? "default" : "outline"}
              onClick={() => setCurrentTab("print-results")}
              className={`rounded-xl ${
                currentTab === "print-results"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print Test Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Content */}
      {currentTab === "export-excel" && renderExportExcel()}
      {currentTab === "print-results" && renderPrintResults()}

      {/* Footer Summary */}
      <Card className="shadow-md border-[#BBDEFB] rounded-xl bg-gradient-to-r from-[#E3F2FD] to-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#666666]">Last Exported</p>
              <p className="text-[#333333] font-medium">{stats.lastExported}</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <p className="text-sm text-[#666666]">Last Printed</p>
              <p className="text-[#333333] font-medium">{stats.lastPrinted}</p>
            </div>
            <Separator orientation="vertical" className="h-12" />
            <div>
              <p className="text-sm text-[#666666]">Audit Log</p>
              <p className="text-[#1976D2] text-sm">All actions logged automatically</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Preview Dialog */}
      <Dialog open={isPrintPreviewOpen} onOpenChange={setIsPrintPreviewOpen}>
        <DialogContent className="bg-white max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1976D2]">Print Preview</DialogTitle>
            <DialogDescription>
              Review before printing or downloading PDF
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            {selectedOrderForPrint && (
              <div className="space-y-6 py-4">
                {/* Test Order Info */}
                <div>
                  <h3 className="text-[#1976D2] mb-3">Test Order Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Test Order ID</Label>
                      <p className="text-[#333333] mt-1 font-semibold">{selectedOrderForPrint.testOrderId}</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Patient Name</Label>
                      <p className="text-[#333333] mt-1">{selectedOrderForPrint.patientName}</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Gender</Label>
                      <p className="text-[#333333] mt-1">{selectedOrderForPrint.gender}</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Date of Birth</Label>
                      <p className="text-[#333333] mt-1">{selectedOrderForPrint.dateOfBirth}</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Phone Number</Label>
                      <p className="text-[#333333] mt-1">{selectedOrderForPrint.phoneNumber}</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Status</Label>
                      <Badge variant="outline" className={`${getStatusColor(selectedOrderForPrint.status)} mt-1`}>
                        {selectedOrderForPrint.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Test Results */}
                {selectedOrderForPrint.testResults && selectedOrderForPrint.testResults.length > 0 && (
                  <div>
                    <h3 className="text-[#1976D2] mb-3">Test Results</h3>
                    <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                            <TableHead className="text-[#1976D2]">Test Name</TableHead>
                            <TableHead className="text-[#1976D2]">Result</TableHead>
                            <TableHead className="text-[#1976D2]">Unit</TableHead>
                            <TableHead className="text-[#1976D2]">Reference Range</TableHead>
                            <TableHead className="text-[#1976D2]">Flag</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrderForPrint.testResults.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium text-[#333333]">{result.testName}</TableCell>
                              <TableCell className="text-[#666666]">{result.result}</TableCell>
                              <TableCell className="text-[#666666]">{result.unit}</TableCell>
                              <TableCell className="text-[#666666]">{result.referenceRange}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`${getFlagColor(result.flag)} rounded-full`}>
                                  {result.flag}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}

                {/* Comments */}
                {selectedOrderForPrint.comments && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-[#1976D2] mb-3">Comments</h3>
                      <div className="p-4 bg-[#FFF8E1] border border-[#FFE082] rounded-lg">
                        <p className="text-[#333333]">{selectedOrderForPrint.comments}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPrintPreviewOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsSendEmailOpen(true);
                setIsPrintPreviewOpen(false);
              }}
              className="border-[#1976D2] text-[#1976D2]"
            >
              <Mail className="h-4 w-4 mr-2" />
              Send via Email
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePrintPDF(true)}
              className="border-[#1976D2] text-[#1976D2]"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button
              onClick={() => handlePrintPDF(false)}
              className="bg-[#1976D2] hover:bg-[#1565C0]"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Email Dialog */}
      <Dialog open={isSendEmailOpen} onOpenChange={setIsSendEmailOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1976D2]">Send via Email</DialogTitle>
            <DialogDescription>
              Enter recipient email address
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="patient@example.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSendEmailOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} className="bg-[#1976D2] hover:bg-[#1565C0]">
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
