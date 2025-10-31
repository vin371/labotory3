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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  ClipboardList, 
  Download, 
  Filter, 
  ArrowUpDown,
  Clock,
  CheckCircle2,
  FileDown,
  Printer,
  Bot,
  MessageSquare,
  Calendar,
  FileText,
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

interface TestOrder {
  id: string;
  orderId: string;
  patientName: string;
  patientDOB: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  patientAddress?: string;
  patientPhone: string;
  patientEmail?: string;
  status: "Pending" | "In Progress" | "Completed" | "Reviewed" | "AI Reviewed";
  createdDate: string;
  createdBy: string;
  runDate?: string;
  runBy?: string;
  results?: TestResult[];
  comments?: Comment[];
  instrumentId?: string;
  instrumentName?: string;
}

interface TestResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: "Normal" | "Low" | "High" | "Critical";
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

// Mock data
const mockTestOrders: TestOrder[] = [
  {
    id: "1",
    orderId: "TO-2025-001",
    patientName: "Nguyễn Văn An",
    patientDOB: "01/15/1985",
    patientAge: 40,
    patientGender: "Male",
    patientAddress: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    patientPhone: "0912345678",
    patientEmail: "nguyenvanan@email.com",
    status: "Completed",
    createdDate: "10/18/2025",
    createdBy: "Dr. Trần Thị B",
    runDate: "10/19/2025",
    runBy: "Lab User",
    instrumentId: "INS-001",
    instrumentName: "Hematology Analyzer XN-1000",
    results: [
      { parameter: "WBC", value: "7.2", unit: "10^9/L", referenceRange: "4.0-11.0", flag: "Normal" },
      { parameter: "RBC", value: "4.8", unit: "10^12/L", referenceRange: "4.5-5.5", flag: "Normal" },
      { parameter: "Hemoglobin", value: "14.5", unit: "g/dL", referenceRange: "13.0-17.0", flag: "Normal" },
      { parameter: "Hematocrit", value: "42.3", unit: "%", referenceRange: "40-50", flag: "Normal" },
    ],
    comments: [
      { id: "c1", author: "Lab User", content: "Sample received in good condition", timestamp: "10/19/2025 08:30 AM" },
      { id: "c2", author: "Lab User", content: "Test completed successfully", timestamp: "10/19/2025 10:45 AM" },
    ]
  },
  {
    id: "2",
    orderId: "TO-2025-002",
    patientName: "Trần Thị Mai",
    patientDOB: "03/22/1992",
    patientAge: 33,
    patientGender: "Female",
    patientAddress: "456 Nguyễn Huệ, Quận 1, TP.HCM",
    patientPhone: "0923456789",
    patientEmail: "tranthimai@email.com",
    status: "Pending",
    createdDate: "10/20/2025",
    createdBy: "Dr. Nguyễn Văn C",
  },
  {
    id: "3",
    orderId: "TO-2025-003",
    patientName: "Lê Hoàng Nam",
    patientDOB: "07/10/1978",
    patientAge: 47,
    patientGender: "Male",
    patientAddress: "789 Pasteur, Quận 3, TP.HCM",
    patientPhone: "0934567890",
    status: "AI Reviewed",
    createdDate: "10/17/2025",
    createdBy: "Dr. Phạm Thị D",
    runDate: "10/18/2025",
    runBy: "Lab User",
    instrumentId: "INS-002",
    instrumentName: "Chemistry Analyzer AU-680",
    results: [
      { parameter: "Glucose", value: "105", unit: "mg/dL", referenceRange: "70-100", flag: "High" },
      { parameter: "Cholesterol", value: "220", unit: "mg/dL", referenceRange: "<200", flag: "High" },
      { parameter: "Triglycerides", value: "145", unit: "mg/dL", referenceRange: "<150", flag: "Normal" },
    ],
    comments: [
      { id: "c3", author: "AI System", content: "Elevated glucose and cholesterol levels detected. Recommend follow-up.", timestamp: "10/18/2025 02:15 PM" },
    ]
  },
  {
    id: "4",
    orderId: "TO-2025-004",
    patientName: "Phạm Thị Lan",
    patientDOB: "11/05/1995",
    patientAge: 30,
    patientGender: "Female",
    patientAddress: "321 Võ Văn Tần, Quận 3, TP.HCM",
    patientPhone: "0945678901",
    patientEmail: "phamthilan@email.com",
    status: "In Progress",
    createdDate: "10/19/2025",
    createdBy: "Dr. Hoàng Văn E",
    runDate: "10/20/2025",
    runBy: "Lab User",
    instrumentId: "INS-001",
    instrumentName: "Hematology Analyzer XN-1000",
  },
  {
    id: "5",
    orderId: "TO-2025-005",
    patientName: "Võ Minh Tuấn",
    patientDOB: "09/18/1988",
    patientAge: 37,
    patientGender: "Male",
    patientAddress: "654 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    patientPhone: "0956789012",
    status: "Reviewed",
    createdDate: "10/16/2025",
    createdBy: "Dr. Lý Thị F",
    runDate: "10/17/2025",
    runBy: "Lab User",
    instrumentId: "INS-003",
    instrumentName: "Immunology Analyzer i2000",
    results: [
      { parameter: "TSH", value: "2.5", unit: "mIU/L", referenceRange: "0.4-4.0", flag: "Normal" },
      { parameter: "T4", value: "8.2", unit: "μg/dL", referenceRange: "5.0-12.0", flag: "Normal" },
    ],
    comments: [
      { id: "c4", author: "Lab User", content: "Thyroid function tests within normal limits", timestamp: "10/17/2025 11:30 AM" },
      { id: "c5", author: "Dr. Lý Thị F", content: "Results reviewed and approved", timestamp: "10/17/2025 03:00 PM" },
    ]
  },
];

interface TestOrderManagementProps {
  onNavigateToDashboard?: () => void;
}

export function TestOrderManagement({ onNavigateToDashboard }: TestOrderManagementProps = {}) {
  const { user } = useAuth();
  const [testOrders, setTestOrders] = useState<TestOrder[]>(mockTestOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    patientName: "",
    patientDOB: "",
    patientAge: 0,
    patientGender: "Male" as "Male" | "Female" | "Other",
    patientAddress: "",
    patientPhone: "",
    patientEmail: "",
  });

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Comment state
  const [newComment, setNewComment] = useState("");

  // Calculate age from DOB
  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const [month, day, year] = dob.split("/").map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle DOB change and auto-calculate age
  const handleDOBChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      patientDOB: value,
      patientAge: calculateAge(value)
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }

    if (!formData.patientDOB) {
      newErrors.patientDOB = "Date of birth is required";
    } else {
      // Validate DOB format MM/DD/YYYY
      const dobRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
      if (!dobRegex.test(formData.patientDOB)) {
        newErrors.patientDOB = "Date must be in MM/DD/YYYY format";
      }
    }

    if (!formData.patientPhone.trim()) {
      newErrors.patientPhone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.patientPhone.replace(/\D/g, ''))) {
      newErrors.patientPhone = "Phone number must be 10 digits";
    }

    if (formData.patientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patientEmail)) {
      newErrors.patientEmail = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Filter and search orders
  const filteredOrders = testOrders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    const matchesDate = !dateFilter || order.createdDate === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  // No pagination - show all filtered orders with scroll

  // Statistics
  const stats = {
    total: testOrders.length,
    pending: testOrders.filter(o => o.status === "Pending").length,
    completed: testOrders.filter(o => o.status === "Completed").length,
    reviewed: testOrders.filter(o => o.status === "Reviewed" || o.status === "AI Reviewed").length,
  };

  // Handle create order
  const handleCreateOrder = () => {
    if (!validateForm()) {
      toast.error("Validation failed", {
        description: "Please check all required fields"
      });
      return;
    }

    const newOrder: TestOrder = {
      id: Date.now().toString(),
      orderId: `TO-2025-${String(testOrders.length + 1).padStart(3, "0")}`,
      patientName: formData.patientName,
      patientDOB: formData.patientDOB,
      patientAge: formData.patientAge,
      patientGender: formData.patientGender,
      patientAddress: formData.patientAddress,
      patientPhone: formData.patientPhone,
      patientEmail: formData.patientEmail,
      status: "Pending",
      createdDate: new Date().toLocaleDateString("en-US"),
      createdBy: user?.fullName || "Unknown",
    };

    setTestOrders([newOrder, ...testOrders]);
    setIsCreateModalOpen(false);
    resetForm();
    toast.success("✅ Test Order Created Successfully", {
      description: `Order ${newOrder.orderId} for ${newOrder.patientName} has been created.`
    });
  };

  // Handle view order
  const handleViewOrder = (order: TestOrder) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  // Handle edit order
  const handleEditOrder = (order: TestOrder) => {
    setSelectedOrder(order);
    setFormData({
      patientName: order.patientName,
      patientDOB: order.patientDOB,
      patientAge: order.patientAge,
      patientGender: order.patientGender,
      patientAddress: order.patientAddress || "",
      patientPhone: order.patientPhone,
      patientEmail: order.patientEmail || "",
    });
    setIsEditModalOpen(true);
  };

  // Handle update order
  const handleUpdateOrder = () => {
    if (!validateForm() || !selectedOrder) return;

    const updatedOrder = {
      ...selectedOrder,
      patientName: formData.patientName,
      patientDOB: formData.patientDOB,
      patientAge: formData.patientAge,
      patientGender: formData.patientGender,
      patientAddress: formData.patientAddress,
      patientPhone: formData.patientPhone,
      patientEmail: formData.patientEmail,
    };

    setTestOrders(testOrders.map(o => o.id === selectedOrder.id ? updatedOrder : o));
    setIsEditModalOpen(false);
    resetForm();
    toast.success("✅ Test Order Updated Successfully");
  };

  // Handle delete order
  const handleDeleteOrder = () => {
    if (!selectedOrder) return;

    setTestOrders(testOrders.filter(o => o.id !== selectedOrder.id));
    setIsDeleteDialogOpen(false);
    setSelectedOrder(null);
    toast.success("✅ Test Order Deleted Successfully", {
      description: `Order ${selectedOrder.orderId} has been removed.`
    });
  };

  // Handle mark as reviewed
  const handleMarkAsReviewed = () => {
    if (!selectedOrder) return;

    const updatedOrder = { ...selectedOrder, status: "Reviewed" as const };
    setTestOrders(testOrders.map(o => o.id === selectedOrder.id ? updatedOrder : o));
    setSelectedOrder(updatedOrder);
    toast.success("✅ Marked as Reviewed");
  };

  // Handle AI review
  const handleAIReview = () => {
    if (!selectedOrder) return;

    const aiComment: Comment = {
      id: Date.now().toString(),
      author: "AI System",
      content: "Automated analysis completed. All parameters within acceptable ranges. No critical findings detected.",
      timestamp: new Date().toLocaleString("en-US"),
    };

    const updatedOrder = {
      ...selectedOrder,
      status: "AI Reviewed" as const,
      comments: [...(selectedOrder.comments || []), aiComment]
    };

    setTestOrders(testOrders.map(o => o.id === selectedOrder.id ? updatedOrder : o));
    setSelectedOrder(updatedOrder);
    toast.success("✅ AI Auto Review Completed", {
      description: "Analysis has been added to comments"
    });
  };

  // Handle add comment
  const handleAddComment = () => {
    if (!selectedOrder || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: user?.fullName || "Unknown",
      content: newComment,
      timestamp: new Date().toLocaleString("en-US"),
    };

    const updatedOrder = {
      ...selectedOrder,
      comments: [...(selectedOrder.comments || []), comment]
    };

    setTestOrders(testOrders.map(o => o.id === selectedOrder.id ? updatedOrder : o));
    setSelectedOrder(updatedOrder);
    setNewComment("");
    toast.success("Comment added");
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    toast.success("📤 Exporting to Excel", {
      description: `${filteredOrders.length} test orders will be exported.`
    });
  };

  // Handle print PDF
  const handlePrintPDF = () => {
    if (!selectedOrder) return;
    toast.success("🖨️ Printing Test Result", {
      description: `Generating PDF for ${selectedOrder.orderId}`
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      patientName: "",
      patientDOB: "",
      patientAge: 0,
      patientGender: "Male",
      patientAddress: "",
      patientPhone: "",
      patientEmail: "",
    });
    setErrors({});
    setSelectedOrder(null);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const styles = {
      "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
      "Completed": "bg-green-100 text-green-800 border-green-200",
      "Reviewed": "bg-purple-100 text-purple-800 border-purple-200",
      "AI Reviewed": "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  // Get flag badge color
  const getFlagBadge = (flag: string) => {
    const styles = {
      "Normal": "bg-green-100 text-green-800",
      "Low": "bg-blue-100 text-blue-800",
      "High": "bg-orange-100 text-orange-800",
      "Critical": "bg-red-100 text-red-800",
    };
    return styles[flag as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

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
              <BreadcrumbPage className="text-[#333333]">Test Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-xl border-[#E0E6ED] shadow-sm" style={{ background: "linear-gradient(135deg, #E3F2FD 0%, #ffffff 100%)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ClipboardList className="h-5 w-5 text-[#007BFF]" />
                  <p className="text-sm text-[#6B7280]">Total Test Orders</p>
                </div>
                <p className="text-[#333333]">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm" style={{ background: "linear-gradient(135deg, #FFF9E6 0%, #ffffff 100%)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-5 w-5 text-[#FFC107]" />
                  <p className="text-sm text-[#6B7280]">Pending Tests</p>
                </div>
                <p className="text-[#333333]">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm" style={{ background: "linear-gradient(135deg, #E8F5E9 0%, #ffffff 100%)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-[#28A745]" />
                  <p className="text-sm text-[#6B7280]">Completed Tests</p>
                </div>
                <p className="text-[#333333]">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E0E6ED] shadow-sm" style={{ background: "linear-gradient(135deg, #F3E5F5 0%, #ffffff 100%)" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="h-5 w-5 text-[#9C27B0]" />
                  <p className="text-sm text-[#6B7280]">Reviewed / AI Reviewed</p>
                </div>
                <p className="text-[#333333]">{stats.reviewed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="rounded-xl border-[#E0E6ED] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-[#EAF3FF] to-white border-b border-[#E0E6ED]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#333333]">Test Orders</CardTitle>
              <CardDescription>Manage all patient test orders</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleExportExcel}
                variant="outline"
                className="rounded-xl border-[#E0E6ED] hover:bg-[#EAF3FF]"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Search by Patient or Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-[#E0E6ED]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Reviewed">Reviewed</SelectItem>
                <SelectItem value="AI Reviewed">AI Reviewed</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-[180px] rounded-xl border-[#E0E6ED]"
            />
          </div>

          {/* Table with Scroll */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-12 w-12 text-[#6B7280] mx-auto mb-4" />
              <p className="text-[#6B7280]">No Data Available</p>
            </div>
          ) : (
            <div className="border border-[#E0E6ED] rounded-xl overflow-hidden">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-[#F9FBFF] z-10">
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Run Date</TableHead>
                      <TableHead>Run By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-[#F9FBFF]">
                        <TableCell className="font-medium">{order.patientName}</TableCell>
                        <TableCell>{order.patientAge}</TableCell>
                        <TableCell>{order.patientGender}</TableCell>
                        <TableCell>{order.patientPhone}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadge(order.status)} rounded-lg px-2 py-1`}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.createdDate}</TableCell>
                        <TableCell>{order.createdBy}</TableCell>
                        <TableCell>{order.runDate || "-"}</TableCell>
                        <TableCell>{order.runBy || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle>{isEditModalOpen ? "Edit Test Order" : "Create New Test Order"}</DialogTitle>
            <DialogDescription>
              {isEditModalOpen ? "Update test order information" : "Enter patient information to create a new test order"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    placeholder="Enter patient name"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className={`rounded-lg ${errors.patientName ? "border-red-500" : ""}`}
                  />
                  {errors.patientName && <p className="text-xs text-red-600 mt-1">{errors.patientName}</p>}
                </div>

                <div>
                  <Label htmlFor="patientDOB">Date of Birth (MM/DD/YYYY) *</Label>
                  <Input
                    id="patientDOB"
                    placeholder="MM/DD/YYYY"
                    value={formData.patientDOB}
                    onChange={(e) => handleDOBChange(e.target.value)}
                    className={`rounded-lg ${errors.patientDOB ? "border-red-500" : ""}`}
                  />
                  {errors.patientDOB && <p className="text-xs text-red-600 mt-1">{errors.patientDOB}</p>}
                </div>

                <div>
                  <Label htmlFor="patientAge">Age (Auto-calculated)</Label>
                  <Input
                    id="patientAge"
                    value={formData.patientAge || ""}
                    disabled
                    className="rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <Label htmlFor="patientGender">Gender *</Label>
                  <Select
                    value={formData.patientGender}
                    onValueChange={(value: "Male" | "Female" | "Other") => setFormData({ ...formData, patientGender: value })}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="patientPhone">Phone Number *</Label>
                  <Input
                    id="patientPhone"
                    placeholder="0912345678"
                    value={formData.patientPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, patientPhone: value });
                    }}
                    className={`rounded-lg ${errors.patientPhone ? "border-red-500" : ""}`}
                  />
                  {errors.patientPhone && <p className="text-xs text-red-600 mt-1">{errors.patientPhone}</p>}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="patientEmail">Email (Optional)</Label>
                  <Input
                    id="patientEmail"
                    type="email"
                    placeholder="patient@email.com"
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                    className={`rounded-lg ${errors.patientEmail ? "border-red-500" : ""}`}
                  />
                  {errors.patientEmail && <p className="text-xs text-red-600 mt-1">{errors.patientEmail}</p>}
                </div>

                <div className="col-span-2">
                  <Label htmlFor="patientAddress">Address</Label>
                  <Textarea
                    id="patientAddress"
                    placeholder="Enter patient address"
                    value={formData.patientAddress}
                    onChange={(e) => setFormData({ ...formData, patientAddress: e.target.value })}
                    className="rounded-lg"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={isEditModalOpen ? handleUpdateOrder : handleCreateOrder}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-lg"
            >
              {isEditModalOpen ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal with Tabs */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl rounded-xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Test Order Details - {selectedOrder?.orderId}</DialogTitle>
            <DialogDescription>View complete test order information</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-4">
              <TabsContent value="overview" className="space-y-4 pr-4">
                {/* Patient Info */}
                <Card className="rounded-lg border-[#E0E6ED]">
                  <CardHeader className="bg-[#F9FBFF]">
                    <CardTitle className="text-base">Patient Information</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#6B7280]">Patient ID</p>
                        <p className="text-[#333333]">{selectedOrder?.orderId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Name</p>
                        <p className="text-[#333333]">{selectedOrder?.patientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Age</p>
                        <p className="text-[#333333]">{selectedOrder?.patientAge} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Gender</p>
                        <p className="text-[#333333]">{selectedOrder?.patientGender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Phone</p>
                        <p className="text-[#333333]">{selectedOrder?.patientPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Email</p>
                        <p className="text-[#333333]">{selectedOrder?.patientEmail || "-"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-[#6B7280]">Address</p>
                        <p className="text-[#333333]">{selectedOrder?.patientAddress || "-"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Test Info */}
                <Card className="rounded-lg border-[#E0E6ED]">
                  <CardHeader className="bg-[#F9FBFF]">
                    <CardTitle className="text-base">Test Information</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-[#6B7280]">Order ID</p>
                        <p className="text-[#333333]">{selectedOrder?.orderId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Status</p>
                        <Badge className={`${getStatusBadge(selectedOrder?.status || "")} rounded-lg`}>
                          {selectedOrder?.status}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Created On</p>
                        <p className="text-[#333333]">{selectedOrder?.createdDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Created By</p>
                        <p className="text-[#333333]">{selectedOrder?.createdBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Run On</p>
                        <p className="text-[#333333]">{selectedOrder?.runDate || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#6B7280]">Run By</p>
                        <p className="text-[#333333]">{selectedOrder?.runBy || "-"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Linked Instrument */}
                {selectedOrder?.instrumentId && (
                  <Card className="rounded-lg border-[#E0E6ED]">
                    <CardHeader className="bg-[#F9FBFF]">
                      <CardTitle className="text-base">Linked Instrument</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#6B7280]">Instrument ID</p>
                          <p className="text-[#333333]">{selectedOrder?.instrumentId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280]">Instrument Name</p>
                          <p className="text-[#333333]">{selectedOrder?.instrumentName}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="results" className="pr-4">
                {selectedOrder?.results && selectedOrder.results.length > 0 ? (
                  <div className="border border-[#E0E6ED] rounded-xl overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#F9FBFF]">
                          <TableHead>Parameter</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Reference Range</TableHead>
                          <TableHead>Flag</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.results.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{result.parameter}</TableCell>
                            <TableCell>{result.value}</TableCell>
                            <TableCell>{result.unit}</TableCell>
                            <TableCell>{result.referenceRange}</TableCell>
                            <TableCell>
                              <Badge className={`${getFlagBadge(result.flag)} rounded-lg px-2 py-1`}>
                                {result.flag}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-[#6B7280] mx-auto mb-4" />
                    <p className="text-[#6B7280]">No test results available</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="comments" className="space-y-4 pr-4">
                {/* Comments List */}
                <div className="space-y-3">
                  {selectedOrder?.comments && selectedOrder.comments.length > 0 ? (
                    selectedOrder.comments.map((comment) => (
                      <Card key={comment.id} className="rounded-lg border-[#E0E6ED]">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <MessageSquare className="h-5 w-5 text-[#007BFF] mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-[#333333]">{comment.author}</p>
                                <p className="text-xs text-[#6B7280]">{comment.timestamp}</p>
                              </div>
                              <p className="text-sm text-[#6B7280]">{comment.content}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-[#6B7280] mx-auto mb-4" />
                      <p className="text-[#6B7280]">No comments yet</p>
                    </div>
                  )}
                </div>

                {/* Add Comment Box */}
                <Card className="rounded-lg border-[#E0E6ED] bg-[#F9FBFF]">
                  <CardContent className="p-4">
                    <Label htmlFor="newComment" className="mb-2 block">Add Comment</Label>
                    <Textarea
                      id="newComment"
                      placeholder="Enter your comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-3 rounded-lg"
                      rows={3}
                    />
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-lg"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>

          <DialogFooter className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              {selectedOrder?.status === "Completed" && (
                <>
                  <Button
                    onClick={handleMarkAsReviewed}
                    variant="outline"
                    className="rounded-lg"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Reviewed
                  </Button>
                  <Button
                    onClick={handleAIReview}
                    variant="outline"
                    className="rounded-lg"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    AI Auto Review
                  </Button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedOrder?.status === "Completed" && (
                <Button
                  onClick={handlePrintPDF}
                  variant="outline"
                  className="rounded-lg"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print PDF
                </Button>
              )}
              <Button
                onClick={() => setIsViewModalOpen(false)}
                className="rounded-lg"
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this test order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrder}
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
