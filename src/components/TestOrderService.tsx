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
import { Progress } from "./ui/progress";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  ClipboardList, 
  Download, 
  Filter, 
  RefreshCw,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlayCircle,
  CheckCheck,
  AlertCircle,
  Printer,
  FileDown,
  MessageSquare,
  Brain,
  Settings,
  Database,
  BarChart3,
  TrendingUp,
  Zap
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";

type SubTab = "manage" | "results" | "comments" | "reports";

interface TestOrder {
  id: string;
  orderId: string;
  patientName: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  email: string;
  status: "Pending" | "Cancelled" | "Completed";
  createdDate: string;
  createdBy: string;
  runDate?: string;
  runBy?: string;
  isDeleted?: boolean;
}

interface TestResult {
  id: string;
  orderId: string;
  patientName: string;
  testName: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  status: "Normal" | "Abnormal" | "Critical";
  reviewedBy?: string;
  reviewStatus: "Pending" | "Reviewed" | "AI Reviewed";
  reviewDate?: string;
  flagged: boolean;
}

interface Comment {
  id: string;
  testOrderId: string;
  author: string;
  content: string;
  dateAdded: string;
}

interface FlaggingRule {
  id: string;
  parameterName: string;
  threshold: string;
  ruleVersion: string;
  updatedOn: string;
  source: string;
}

// Mock Data
const mockTestOrders: TestOrder[] = [
  {
    id: "TO-0001",
    orderId: "TO-0001",
    patientName: "John Smith",
    age: 40,
    gender: "Male",
    phoneNumber: "+84 912345678",
    dateOfBirth: "01/12/1985",
    address: "123 Main Street, District 1, HCMC",
    email: "john.smith@email.com",
    status: "Completed",
    createdDate: "2025-10-15 08:30:00",
    createdBy: "admin@lab.com",
    runDate: "2025-10-15 14:00:00",
    runBy: "labuser01"
  },
  {
    id: "TO-0002",
    orderId: "TO-0002",
    patientName: "Emily Johnson",
    age: 33,
    gender: "Female",
    phoneNumber: "+84 923456789",
    dateOfBirth: "05/20/1992",
    address: "456 Oak Avenue, District 3, HCMC",
    email: "emily.j@email.com",
    status: "Pending",
    createdDate: "2025-10-16 09:15:00",
    createdBy: "admin@lab.com"
  },
  {
    id: "TO-0003",
    orderId: "TO-0003",
    patientName: "Michael Brown",
    age: 47,
    gender: "Male",
    phoneNumber: "+84 934567890",
    dateOfBirth: "11/08/1978",
    address: "789 Pine Road, District 7, HCMC",
    email: "m.brown@email.com",
    status: "Completed",
    createdDate: "2025-10-14 10:00:00",
    createdBy: "manager@lab.com",
    runDate: "2025-10-14 16:30:00",
    runBy: "labuser02"
  }
];

const mockTestResults: TestResult[] = [
  {
    id: "TR-001",
    orderId: "TO-0001",
    patientName: "John Smith",
    testName: "Glucose",
    resultValue: "95",
    unit: "mg/dL",
    referenceRange: "70-100",
    status: "Normal",
    reviewedBy: "Dr. Wilson",
    reviewStatus: "Reviewed",
    reviewDate: "2025-10-15 15:00:00",
    flagged: false
  },
  {
    id: "TR-002",
    orderId: "TO-0001",
    patientName: "John Smith",
    testName: "Cholesterol",
    resultValue: "230",
    unit: "mg/dL",
    referenceRange: "<200",
    status: "Abnormal",
    reviewedBy: "AI System",
    reviewStatus: "AI Reviewed",
    reviewDate: "2025-10-15 14:30:00",
    flagged: true
  },
  {
    id: "TR-003",
    orderId: "TO-0003",
    patientName: "Michael Brown",
    testName: "Hemoglobin",
    resultValue: "14.2",
    unit: "g/dL",
    referenceRange: "13.5-17.5",
    status: "Normal",
    reviewStatus: "Pending",
    flagged: false
  }
];

const mockComments: Comment[] = [
  {
    id: "C-001",
    testOrderId: "TO-0001",
    author: "Dr. Wilson",
    content: "Patient shows slightly elevated cholesterol. Recommend lifestyle changes.",
    dateAdded: "2025-10-15 15:30:00"
  },
  {
    id: "C-002",
    testOrderId: "TO-0003",
    author: "Lab Tech",
    content: "Sample received in good condition. Processing completed.",
    dateAdded: "2025-10-14 16:45:00"
  }
];

const mockFlaggingRules: FlaggingRule[] = [
  {
    id: "FR-001",
    parameterName: "Glucose",
    threshold: ">100 or <70",
    ruleVersion: "v2.1",
    updatedOn: "2025-10-01",
    source: "System Config"
  },
  {
    id: "FR-002",
    parameterName: "Cholesterol",
    threshold: ">200",
    ruleVersion: "v2.1",
    updatedOn: "2025-10-01",
    source: "System Config"
  },
  {
    id: "FR-003",
    parameterName: "Hemoglobin",
    threshold: "<12 or >18",
    ruleVersion: "v2.1",
    updatedOn: "2025-10-01",
    source: "System Config"
  }
];

export function TestOrderService() {
  const { user: currentUser } = useAuth();
  const [currentSubTab, setCurrentSubTab] = useState<SubTab>("manage");
  
  // Test Orders State
  const [testOrders, setTestOrders] = useState<TestOrder[]>(mockTestOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TestOrder | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<TestOrder | null>(null);

  // Test Results State
  const [testResults, setTestResults] = useState<TestResult[]>(mockTestResults);
  const [aiReviewEnabled, setAiReviewEnabled] = useState(false);
  const [hl7ProcessedCount, setHl7ProcessedCount] = useState(1247);
  const [hl7ErrorCount, setHl7ErrorCount] = useState(3);
  const [lastSyncTime, setLastSyncTime] = useState("2025-10-17 10:30:00");
  const [pendingSyncCount, setPendingSyncCount] = useState(15);

  // Comments State
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [isAddCommentOpen, setIsAddCommentOpen] = useState(false);
  const [isEditCommentOpen, setIsEditCommentOpen] = useState(false);
  const [isDeleteCommentOpen, setIsDeleteCommentOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [commentForm, setCommentForm] = useState({ testOrderId: "", content: "" });

  // Flagging Rules State
  const [flaggingRules, setFlaggingRules] = useState<FlaggingRule[]>(mockFlaggingRules);

  // Form State
  const [formData, setFormData] = useState({
    patientName: "",
    dateOfBirth: "",
    age: "",
    gender: "Male" as "Male" | "Female" | "Other",
    address: "",
    phoneNumber: "",
    email: ""
  });

  const [errors, setErrors] = useState({
    patientName: "",
    dateOfBirth: "",
    age: "",
    phoneNumber: "",
    address: "",
    email: ""
  });

  // Filter Test Orders
  const filteredOrders = testOrders
    .filter(order => !order.isDeleted)
    .filter(order => {
      const matchesSearch = 
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || order.status === filterStatus;
      
      let matchesDateRange = true;
      if (filterDateFrom && filterDateTo) {
        const orderDate = new Date(order.createdDate);
        const fromDate = new Date(filterDateFrom);
        const toDate = new Date(filterDateTo);
        matchesDateRange = orderDate >= fromDate && orderDate <= toDate;
      }
      
      return matchesSearch && matchesStatus && matchesDateRange;
    });

  // Statistics
  const stats = {
    total: testOrders.filter(o => !o.isDeleted).length,
    pending: testOrders.filter(o => !o.isDeleted && o.status === "Pending").length,
    completed: testOrders.filter(o => !o.isDeleted && o.status === "Completed").length,
    cancelled: testOrders.filter(o => !o.isDeleted && o.status === "Cancelled").length
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors = {
      patientName: "",
      dateOfBirth: "",
      age: "",
      phoneNumber: "",
      address: "",
      email: ""
    };

    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required (MM/DD/YYYY)";
    } else {
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
      if (!dateRegex.test(formData.dateOfBirth)) {
        newErrors.dateOfBirth = "Date must be in MM/DD/YYYY format";
      }
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  // Test Order CRUD Operations
  const handleCreate = () => {
    if (!validateForm()) {
      toast.error("Validation failed", {
        description: "Please fix the errors in the form"
      });
      return;
    }

    const newOrder: TestOrder = {
      id: `TO-${String(testOrders.length + 1).padStart(4, "0")}`,
      orderId: `TO-${String(testOrders.length + 1).padStart(4, "0")}`,
      patientName: formData.patientName,
      age: parseInt(formData.age),
      gender: formData.gender,
      phoneNumber: formData.phoneNumber,
      dateOfBirth: formData.dateOfBirth,
      address: formData.address,
      email: formData.email,
      status: "Pending",
      createdDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      createdBy: currentUser?.email || "admin@lab.com"
    };

    setTestOrders([newOrder, ...testOrders]);
    setIsCreateDialogOpen(false);
    resetForm();

    toast.success("✅ Test order created successfully!", {
      description: `Order ${newOrder.orderId} for ${newOrder.patientName} has been created.`
    });

    console.log(`[ORDER_CREATED] ${newOrder.orderId}, Patient: ${newOrder.patientName}, By: ${newOrder.createdBy}`);
  };

  const handleView = (order: TestOrder) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (order: TestOrder) => {
    setSelectedOrder(order);
    setFormData({
      patientName: order.patientName,
      dateOfBirth: order.dateOfBirth,
      age: order.age.toString(),
      gender: order.gender,
      address: order.address,
      phoneNumber: order.phoneNumber,
      email: order.email
    });
    setErrors({ patientName: "", dateOfBirth: "", age: "", phoneNumber: "", address: "", email: "" });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!validateForm()) {
      toast.error("Validation failed", {
        description: "Please fix the errors in the form"
      });
      return;
    }

    if (selectedOrder) {
      const updatedOrder = {
        ...selectedOrder,
        patientName: formData.patientName,
        age: parseInt(formData.age),
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        email: formData.email
      };

      setTestOrders(testOrders.map(order => order.id === selectedOrder.id ? updatedOrder : order));
      setIsEditDialogOpen(false);
      setSelectedOrder(null);
      resetForm();

      toast.success("✅ Test order updated successfully!", {
        description: `Order ${updatedOrder.orderId} has been updated.`
      });

      console.log(`[ORDER_UPDATED] ${updatedOrder.orderId}, By: ${currentUser?.email}`);
    }
  };

  const handleDeleteClick = (order: TestOrder) => {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (orderToDelete) {
      setTestOrders(testOrders.map(order => 
        order.id === orderToDelete.id ? { ...order, isDeleted: true } : order
      ));

      toast.success("✅ Test order deleted successfully!", {
        description: `Order ${orderToDelete.orderId} has been removed.`
      });

      console.log(`[ORDER_DELETED] ${orderToDelete.orderId}, By: ${currentUser?.email}`);

      setIsDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      patientName: "",
      dateOfBirth: "",
      age: "",
      gender: "Male",
      address: "",
      phoneNumber: "",
      email: ""
    });
    setErrors({ patientName: "", dateOfBirth: "", age: "", phoneNumber: "", address: "", email: "" });
  };

  // Test Results Operations
  const handleMarkReviewed = (result: TestResult) => {
    setTestResults(testResults.map(r => 
      r.id === result.id 
        ? { ...r, reviewStatus: "Reviewed", reviewedBy: currentUser?.fullName || "Admin", reviewDate: new Date().toISOString() }
        : r
    ));
    toast.success("✅ Test result marked as Reviewed");
    console.log(`[RESULT_REVIEWED] ${result.id}, By: ${currentUser?.email}`);
  };

  const handleAIReview = () => {
    const pendingResults = testResults.filter(r => r.reviewStatus === "Pending");
    
    setTestResults(testResults.map(r => 
      r.reviewStatus === "Pending" 
        ? { ...r, reviewStatus: "AI Reviewed", reviewedBy: "AI System", reviewDate: new Date().toISOString() }
        : r
    ));
    
    toast.success(`✅ AI auto-review completed for ${pendingResults.length} results`);
    console.log(`[AI_REVIEW] Processed ${pendingResults.length} results`);
  };

  const handleSyncResults = () => {
    toast.success("🔄 Syncing test results...", {
      description: `Processing ${pendingSyncCount} pending results`
    });
    
    setTimeout(() => {
      setPendingSyncCount(0);
      setLastSyncTime(new Date().toISOString().replace('T', ' ').substring(0, 19));
      toast.success("✅ Sync completed successfully");
      console.log(`[SYNC_COMPLETED] Time: ${new Date().toISOString()}`);
    }, 2000);
  };

  const handleSyncFlagging = () => {
    toast.success("🔄 Syncing flagging configuration...");
    
    setTimeout(() => {
      toast.success("✅ Flagging rules updated successfully");
      console.log(`[FLAGGING_SYNC] Updated at: ${new Date().toISOString()}`);
    }, 1500);
  };

  // Comment Operations
  const handleAddComment = () => {
    if (!commentForm.testOrderId.trim() || !commentForm.content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const newComment: Comment = {
      id: `C-${String(comments.length + 1).padStart(3, "0")}`,
      testOrderId: commentForm.testOrderId,
      author: currentUser?.fullName || "Admin User",
      content: commentForm.content,
      dateAdded: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setComments([newComment, ...comments]);
    setCommentForm({ testOrderId: "", content: "" });
    setIsAddCommentOpen(false);

    toast.success("✅ Comment added successfully");
    console.log(`[COMMENT_ADDED] ${newComment.id}, Order: ${newComment.testOrderId}`);
  };

  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment);
    setCommentForm({ testOrderId: comment.testOrderId, content: comment.content });
    setIsEditCommentOpen(true);
  };

  const handleUpdateComment = () => {
    if (!commentForm.content.trim()) {
      toast.error("Comment content cannot be empty");
      return;
    }

    if (selectedComment) {
      setComments(comments.map(c => 
        c.id === selectedComment.id ? { ...c, content: commentForm.content } : c
      ));

      setIsEditCommentOpen(false);
      setSelectedComment(null);
      setCommentForm({ testOrderId: "", content: "" });

      toast.success("✅ Comment updated successfully");
      console.log(`[COMMENT_UPDATED] ${selectedComment.id}, By: ${currentUser?.email}`);
    }
  };

  const handleDeleteComment = (comment: Comment) => {
    setSelectedComment(comment);
    setIsDeleteCommentOpen(true);
  };

  const handleDeleteCommentConfirm = () => {
    if (selectedComment) {
      setComments(comments.filter(c => c.id !== selectedComment.id));

      toast.success("✅ Comment deleted successfully");
      console.log(`[COMMENT_DELETED] ${selectedComment.id}, By: ${currentUser?.email}`);

      setIsDeleteCommentOpen(false);
      setSelectedComment(null);
    }
  };

  // Export/Print Operations
  const handleExportExcel = () => {
    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const dataToExport = filteredOrders.length > 0 ? filteredOrders : testOrders.filter(o => !o.isDeleted);
    
    toast.success("📊 Exporting to Excel...", {
      description: `${dataToExport.length} orders from ${currentMonth} will be exported.`
    });

    setTimeout(() => {
      const fileName = `Test_Orders-${new Date().toISOString().split('T')[0]}.xlsx`;
      toast.success(`✅ Excel file ready: ${fileName}`);
      console.log(`[EXPORT_EXCEL] ${fileName}, Records: ${dataToExport.length}`);
    }, 1500);
  };

  const handlePrintPDF = (order: TestOrder) => {
    if (order.status !== "Completed") {
      toast.error("❌ Cannot print - Order not completed", {
        description: "Only completed orders can be printed as PDF."
      });
      return;
    }

    const fileName = `Detail-${order.patientName.replace(/\s+/g, '_')}-${new Date().toLocaleDateString()}.pdf`;
    
    toast.success("🖨️ Generating PDF...", {
      description: fileName
    });

    setTimeout(() => {
      toast.success("✅ PDF generated successfully");
      console.log(`[PRINT_PDF] ${fileName}, Order: ${order.orderId}`);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getReviewStatusColor = (status: string) => {
    switch (status) {
      case "Reviewed":
        return "bg-green-100 text-green-800 border-green-200";
      case "AI Reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "text-green-700";
      case "Abnormal":
        return "text-orange-700";
      case "Critical":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  // Render Content based on SubTab
  const renderContent = () => {
    switch (currentSubTab) {
      case "manage":
        return renderManageOrders();
      case "results":
        return renderTestResults();
      case "comments":
        return renderComments();
      case "reports":
        return renderReports();
      default:
        return renderManageOrders();
    }
  };

  // Render Manage Orders Tab
  const renderManageOrders = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md border-[#B3D9FF] bg-gradient-to-br from-[#E3F2FD] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Total Orders</p>
                <p className="text-3xl font-semibold text-[#1976D2]">{stats.total}</p>
              </div>
              <ClipboardList className="h-10 w-10 text-[#1976D2] opacity-70" />
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
              <Clock className="h-10 w-10 text-[#F57C00] opacity-70" />
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
              <CheckCircle2 className="h-10 w-10 text-[#388E3C] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#EF9A9A] bg-gradient-to-br from-[#FFEBEE] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Cancelled</p>
                <p className="text-3xl font-semibold text-[#D32F2F]">{stats.cancelled}</p>
              </div>
              <AlertCircle className="h-10 w-10 text-[#D32F2F] opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1976D2]">Patient Test Orders</CardTitle>
              <CardDescription className="text-[#555555]">
                View, search, and manage all patient test orders
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
              <Input
                type="text"
                placeholder="Search by Patient Name or Order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-[#BBDEFB] rounded-xl focus:border-[#1976D2]"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="bg-white rounded-xl border-[#BBDEFB]">
                <Filter className="h-4 w-4 mr-2 text-[#1976D2]" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="bg-white border-[#BBDEFB] rounded-xl"
              placeholder="Date From"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-6">
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              setIsCreateDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-xl shadow-md">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Test Order
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-[#1976D2]">Create New Test Order</DialogTitle>
                  <DialogDescription>Enter patient test order information</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="patientName">Patient Name *</Label>
                      <Input
                        id="patientName"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        className={errors.patientName ? "border-red-500" : ""}
                      />
                      {errors.patientName && <p className="text-xs text-red-600">{errors.patientName}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="dateOfBirth">Date of Birth (MM/DD/YYYY) *</Label>
                      <Input
                        id="dateOfBirth"
                        placeholder="MM/DD/YYYY"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className={errors.dateOfBirth ? "border-red-500" : ""}
                      />
                      {errors.dateOfBirth && <p className="text-xs text-red-600">{errors.dateOfBirth}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className={errors.age ? "border-red-500" : ""}
                      />
                      {errors.age && <p className="text-xs text-red-600">{errors.age}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value: "Male" | "Female" | "Other") => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className={errors.phoneNumber ? "border-red-500" : ""}
                      />
                      {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#1976D2] hover:bg-[#1565C0]" onClick={handleCreate}>
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" className="rounded-xl border-[#1976D2] text-[#1976D2]" onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>

            <Button variant="outline" className="rounded-xl" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Data Table */}
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
                <p className="text-[#666666]">No Data</p>
                <p className="text-sm text-[#999999] mt-2">No test orders match your filters</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#1976D2]">Patient Name</TableHead>
                    <TableHead className="text-[#1976D2]">Age</TableHead>
                    <TableHead className="text-[#1976D2]">Gender</TableHead>
                    <TableHead className="text-[#1976D2]">Phone Number</TableHead>
                    <TableHead className="text-[#1976D2]">Status</TableHead>
                    <TableHead className="text-[#1976D2]">Created Date</TableHead>
                    <TableHead className="text-[#1976D2]">Created By</TableHead>
                    <TableHead className="text-[#1976D2]">Run Date</TableHead>
                    <TableHead className="text-[#1976D2]">Run By</TableHead>
                    <TableHead className="text-[#1976D2] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-[#F5F5F5]">
                      <TableCell className="font-medium text-[#333333]">{order.patientName}</TableCell>
                      <TableCell className="text-[#666666]">{order.age}</TableCell>
                      <TableCell className="text-[#666666]">{order.gender}</TableCell>
                      <TableCell className="text-[#666666]">{order.phoneNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(order.status)} rounded-full`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#666666]">{order.createdDate}</TableCell>
                      <TableCell className="text-[#666666]">{order.createdBy}</TableCell>
                      <TableCell className="text-[#666666]">{order.runDate || "—"}</TableCell>
                      <TableCell className="text-[#666666]">{order.runBy || "—"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(order)}
                            className="text-[#1976D2] hover:text-[#1565C0] hover:bg-[#E3F2FD]"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(order)}
                            className="text-[#F57C00] hover:text-[#E65100] hover:bg-[#FFF8E1]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(order)}
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
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1976D2]">Test Order Details</DialogTitle>
            <DialogDescription>Complete information about this test order</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            {selectedOrder && (
              <div className="space-y-6 py-4">
                {/* Patient Info */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1976D2] mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Patient Name</Label>
                      <p className="text-[#333333] mt-1">{selectedOrder.patientName}</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Date of Birth</Label>
                      <p className="text-[#333333] mt-1">{selectedOrder.dateOfBirth}</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Age</Label>
                      <p className="text-[#333333] mt-1">{selectedOrder.age} years</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Gender</Label>
                      <p className="text-[#333333] mt-1">{selectedOrder.gender}</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg col-span-2">
                      <Label className="text-sm text-[#666666]">Address</Label>
                      <p className="text-[#333333] mt-1">{selectedOrder.address}</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Phone Number</Label>
                      <p className="text-[#333333] mt-1">{selectedOrder.phoneNumber}</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Email</Label>
                      <p className="text-[#333333] mt-1">{selectedOrder.email || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Test Order Info */}
                <div>
                  <h3 className="text-lg font-semibold text-[#1976D2] mb-3 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    Test Order Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Order ID</Label>
                      <p className="text-[#333333] mt-1 font-semibold">{selectedOrder.orderId}</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Status</Label>
                      <Badge variant="outline" className={`${getStatusColor(selectedOrder.status)} mt-1`}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Created Date</Label>
                      <p className="text-[#333333] mt-1">{selectedOrder.createdDate}</p>
                    </div>
                    <div className="p-3 bg-[#F5F5F5] rounded-lg">
                      <Label className="text-sm text-[#666666]">Created By</Label>
                      <p className="text-[#333333] mt-1">{selectedOrder.createdBy}</p>
                    </div>
                    {selectedOrder.runDate && (
                      <>
                        <div className="p-3 bg-[#F5F5F5] rounded-lg">
                          <Label className="text-sm text-[#666666]">Run Date</Label>
                          <p className="text-[#333333] mt-1">{selectedOrder.runDate}</p>
                        </div>
                        <div className="p-3 bg-[#F5F5F5] rounded-lg">
                          <Label className="text-sm text-[#666666]">Run By</Label>
                          <p className="text-[#333333] mt-1">{selectedOrder.runBy}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {selectedOrder.status === "Completed" && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold text-[#1976D2] mb-3 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Test Results
                      </h3>
                      <p className="text-sm text-[#666666]">Test results are available in the "Test Results" tab</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </ScrollArea>
          <DialogFooter className="flex gap-2">
            {selectedOrder?.status === "Completed" && (
              <Button
                variant="outline"
                className="border-[#1976D2] text-[#1976D2]"
                onClick={() => selectedOrder && handlePrintPDF(selectedOrder)}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print PDF
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-[#1976D2] hover:bg-[#1565C0]"
              onClick={() => {
                setIsViewDialogOpen(false);
                selectedOrder && handleEdit(selectedOrder);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1976D2]">Modify Test Order</DialogTitle>
            <DialogDescription>Update patient test order information</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-patientName">Patient Name *</Label>
                <Input
                  id="edit-patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className={errors.patientName ? "border-red-500" : ""}
                />
                {errors.patientName && <p className="text-xs text-red-600">{errors.patientName}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-dateOfBirth">Date of Birth (MM/DD/YYYY) *</Label>
                <Input
                  id="edit-dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {errors.dateOfBirth && <p className="text-xs text-red-600">{errors.dateOfBirth}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-age">Age *</Label>
                <Input
                  id="edit-age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className={errors.age ? "border-red-500" : ""}
                />
                {errors.age && <p className="text-xs text-red-600">{errors.age}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value: "Male" | "Female" | "Other") => setFormData({ ...formData, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address *</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={errors.address ? "border-red-500" : ""}
                />
                {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-phoneNumber">Phone Number *</Label>
                <Input
                  id="edit-phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && <p className="text-xs text-red-600">{errors.phoneNumber}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#1976D2] hover:bg-[#1565C0]" onClick={handleUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#D32F2F]">Delete Test Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this test order for <strong>{orderToDelete?.patientName}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-[#D32F2F] hover:bg-[#B71C1C]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  // Render Test Results Tab
  const renderTestResults = () => (
    <div className="space-y-6">
      {/* Process Monitor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-md border-[#B3D9FF] bg-gradient-to-br from-[#E3F2FD] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-[#1976D2]" />
                <p className="text-sm text-[#555555]">HL7 Messages Processed</p>
              </div>
            </div>
            <p className="text-3xl font-semibold text-[#1976D2] mb-1">{hl7ProcessedCount}</p>
            <p className="text-xs text-[#666666]">Successfully processed</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#EF9A9A] bg-gradient-to-br from-[#FFEBEE] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-[#D32F2F]" />
                <p className="text-sm text-[#555555]">Error Count</p>
              </div>
            </div>
            <p className="text-3xl font-semibold text-[#D32F2F] mb-1">{hl7ErrorCount}</p>
            <p className="text-xs text-[#666666]">In retry queue</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#FFE082] bg-gradient-to-br from-[#FFF8E1] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#F57C00]" />
                <p className="text-sm text-[#555555]">Pending Sync</p>
              </div>
            </div>
            <p className="text-3xl font-semibold text-[#F57C00] mb-1">{pendingSyncCount}</p>
            <p className="text-xs text-[#666666]">Results to sync</p>
          </CardContent>
        </Card>
      </div>

      {/* Sync & AI Review Controls */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1976D2]">Test Results Management</CardTitle>
          <CardDescription className="text-[#555555]">
            Review, sync, and manage automated test results
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-[#E3F2FD] rounded-xl border border-[#BBDEFB]">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-[#1976D2]" />
                <div>
                  <p className="font-medium text-[#1976D2]">AI Auto Review Mode</p>
                  <p className="text-sm text-[#666666]">Automatically review completed test results using AI</p>
                </div>
              </div>
              <Switch
                checked={aiReviewEnabled}
                onCheckedChange={(checked) => {
                  setAiReviewEnabled(checked);
                  if (checked) {
                    toast.success("✅ AI Auto Review enabled");
                  } else {
                    toast.info("AI Auto Review disabled");
                  }
                }}
              />
            </div>

            <div className="flex gap-3">
              <Button
                className="bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-xl flex-1"
                onClick={handleSyncResults}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
              <Button
                variant="outline"
                className="border-[#1976D2] text-[#1976D2] rounded-xl flex-1"
                onClick={handleAIReview}
                disabled={!aiReviewEnabled}
              >
                <Brain className="h-4 w-4 mr-2" />
                Run AI Review
              </Button>
              <Button
                variant="outline"
                className="border-[#666666] text-[#666666] rounded-xl"
                onClick={handleSyncFlagging}
              >
                <Settings className="h-4 w-4 mr-2" />
                Sync Flagging Config
              </Button>
            </div>

            <div className="p-3 bg-[#F5F5F5] rounded-lg border border-[#E0E0E0]">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-[#666666]">Last Sync:</span>
                <span className="text-[#333333] font-medium">{lastSyncTime}</span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Test Results Table */}
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1976D2]">Order ID</TableHead>
                  <TableHead className="text-[#1976D2]">Patient</TableHead>
                  <TableHead className="text-[#1976D2]">Test Name</TableHead>
                  <TableHead className="text-[#1976D2]">Result Value</TableHead>
                  <TableHead className="text-[#1976D2]">Unit</TableHead>
                  <TableHead className="text-[#1976D2]">Reference Range</TableHead>
                  <TableHead className="text-[#1976D2]">Status</TableHead>
                  <TableHead className="text-[#1976D2]">Review Status</TableHead>
                  <TableHead className="text-[#1976D2]">Reviewed By</TableHead>
                  <TableHead className="text-[#1976D2] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testResults.map((result) => (
                  <TableRow key={result.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">{result.orderId}</TableCell>
                    <TableCell className="text-[#666666]">{result.patientName}</TableCell>
                    <TableCell className="text-[#666666]">{result.testName}</TableCell>
                    <TableCell className={`font-semibold ${getResultStatusColor(result.status)}`}>
                      {result.resultValue}
                      {result.flagged && <AlertTriangle className="h-3 w-3 inline ml-1 text-red-600" />}
                    </TableCell>
                    <TableCell className="text-[#666666]">{result.unit}</TableCell>
                    <TableCell className="text-[#666666]">{result.referenceRange}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          result.status === "Normal"
                            ? "bg-green-100 text-green-800 border-green-200 rounded-full"
                            : result.status === "Critical"
                            ? "bg-red-100 text-red-800 border-red-200 rounded-full"
                            : "bg-orange-100 text-orange-800 border-orange-200 rounded-full"
                        }
                      >
                        {result.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getReviewStatusColor(result.reviewStatus)} rounded-full`}>
                        {result.reviewStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{result.reviewedBy || "—"}</TableCell>
                    <TableCell className="text-right">
                      {result.reviewStatus === "Pending" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkReviewed(result)}
                          className="text-[#1976D2] hover:text-[#1565C0] hover:bg-[#E3F2FD]"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Flagging Rules */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1976D2]">Flagging Rules Configuration</CardTitle>
          <CardDescription className="text-[#555555]">
            Threshold rules for abnormal/critical test results highlighting
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1976D2]">Parameter Name</TableHead>
                  <TableHead className="text-[#1976D2]">Threshold</TableHead>
                  <TableHead className="text-[#1976D2]">Rule Version</TableHead>
                  <TableHead className="text-[#1976D2]">Updated On</TableHead>
                  <TableHead className="text-[#1976D2]">Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flaggingRules.map((rule) => (
                  <TableRow key={rule.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">{rule.parameterName}</TableCell>
                    <TableCell className="text-[#666666]">{rule.threshold}</TableCell>
                    <TableCell className="text-[#666666]">{rule.ruleVersion}</TableCell>
                    <TableCell className="text-[#666666]">{rule.updatedOn}</TableCell>
                    <TableCell className="text-[#666666]">{rule.source}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Comments Tab
  const renderComments = () => (
    <div className="space-y-6">
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1976D2]">Comment Management</CardTitle>
              <CardDescription className="text-[#555555]">
                Add, modify, and delete comments for test orders
              </CardDescription>
            </div>
            <Dialog open={isAddCommentOpen} onOpenChange={setIsAddCommentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1976D2] hover:bg-[#1565C0] text-white rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Comment
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-[#1976D2]">Add New Comment</DialogTitle>
                  <DialogDescription>Add a comment to a test order</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="testOrderId">Test Order ID *</Label>
                    <Select
                      value={commentForm.testOrderId}
                      onValueChange={(value) => setCommentForm({ ...commentForm, testOrderId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select test order" />
                      </SelectTrigger>
                      <SelectContent>
                        {testOrders.filter(o => !o.isDeleted).map(order => (
                          <SelectItem key={order.id} value={order.orderId}>
                            {order.orderId} - {order.patientName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="content">Comment Content *</Label>
                    <Textarea
                      id="content"
                      value={commentForm.content}
                      onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                      placeholder="Enter your comment..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCommentOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#1976D2] hover:bg-[#1565C0]" onClick={handleAddComment}>
                    Add Comment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
                <p className="text-[#666666]">No comments yet</p>
                <p className="text-sm text-[#999999] mt-2">Add your first comment to a test order</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#1976D2]">Comment ID</TableHead>
                    <TableHead className="text-[#1976D2]">Test Order ID</TableHead>
                    <TableHead className="text-[#1976D2]">Author</TableHead>
                    <TableHead className="text-[#1976D2]">Comment Content</TableHead>
                    <TableHead className="text-[#1976D2]">Date Added</TableHead>
                    <TableHead className="text-[#1976D2] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow key={comment.id} className="hover:bg-[#F5F5F5]">
                      <TableCell className="font-medium text-[#333333]">{comment.id}</TableCell>
                      <TableCell className="text-[#666666]">{comment.testOrderId}</TableCell>
                      <TableCell className="text-[#666666]">{comment.author}</TableCell>
                      <TableCell className="text-[#666666] max-w-md truncate">{comment.content}</TableCell>
                      <TableCell className="text-[#666666]">{comment.dateAdded}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditComment(comment)}
                            className="text-[#F57C00] hover:text-[#E65100] hover:bg-[#FFF8E1]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment)}
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
        </CardContent>
      </Card>

      {/* Edit Comment Dialog */}
      <Dialog open={isEditCommentOpen} onOpenChange={setIsEditCommentOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1976D2]">Modify Comment</DialogTitle>
            <DialogDescription>Update the comment content</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Comment Content *</Label>
              <Textarea
                id="edit-content"
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCommentOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#1976D2] hover:bg-[#1565C0]" onClick={handleUpdateComment}>
              Update Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Comment Dialog */}
      <AlertDialog open={isDeleteCommentOpen} onOpenChange={setIsDeleteCommentOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#D32F2F]">Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCommentConfirm}
              className="bg-[#D32F2F] hover:bg-[#B71C1C]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  // Render Reports Tab
  const renderReports = () => (
    <div className="space-y-6">
      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-[#A5D6A7] bg-gradient-to-br from-[#E8F5E9] to-white rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileDown className="h-8 w-8 text-[#388E3C]" />
              <div>
                <CardTitle className="text-[#388E3C]">Export Excel</CardTitle>
                <CardDescription className="text-[#555555]">
                  Export patient test order data to Excel
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-[#A5D6A7]">
                <p className="text-sm font-medium text-[#333333] mb-2">Export Columns:</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#666666]">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#388E3C]" />
                    Test Order ID
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#388E3C]" />
                    Patient Name
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#388E3C]" />
                    Gender
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#388E3C]" />
                    Date of Birth
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#388E3C]" />
                    Phone Number
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#388E3C]" />
                    Status
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#388E3C]" />
                    Created By
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#388E3C]" />
                    Created On
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#388E3C]" />
                    Run By
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-[#388E3C]" />
                    Run On
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#FFF8E1] rounded-lg border border-[#FFE082]">
                <p className="text-xs text-[#F57C00]">
                  <strong>Note:</strong> If no data is filtered, all current month's data will be exported.
                </p>
              </div>

              <Button
                className="w-full bg-[#388E3C] hover:bg-[#2E7D32] text-white rounded-xl"
                onClick={handleExportExcel}
              >
                <FileDown className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-[#90CAF9] bg-gradient-to-br from-[#E3F2FD] to-white rounded-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Printer className="h-8 w-8 text-[#1976D2]" />
              <div>
                <CardTitle className="text-[#1976D2]">Print Test Results</CardTitle>
                <CardDescription className="text-[#555555]">
                  Print patient's test order results as PDF
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-[#90CAF9]">
                <p className="text-sm font-medium text-[#333333] mb-2">PDF Structure:</p>
                <div className="space-y-2 text-xs text-[#666666]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#1976D2] font-semibold">1.</span>
                    <span>Test Order Info (Order ID, Patient Name, Gender, DOB, Phone, Status, Created By, Created On, Run By, Run On)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#1976D2] font-semibold">2.</span>
                    <span>Test Results Table (Result Name, Value, Unit, Reference Range, Comments)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#FFEBEE] rounded-lg border border-[#EF9A9A]">
                <p className="text-xs text-[#D32F2F]">
                  <strong>Validation:</strong> Only completed test orders can be printed.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Select Completed Order to Print:</Label>
                <Select onValueChange={(orderId) => {
                  const order = testOrders.find(o => o.orderId === orderId);
                  if (order) handlePrintPDF(order);
                }}>
                  <SelectTrigger className="bg-white rounded-xl border-[#90CAF9]">
                    <SelectValue placeholder="Choose an order..." />
                  </SelectTrigger>
                  <SelectContent>
                    {testOrders.filter(o => !o.isDeleted && o.status === "Completed").map(order => (
                      <SelectItem key={order.id} value={order.orderId}>
                        {order.orderId} - {order.patientName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Statistics */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1976D2] flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Export & Print Activity
          </CardTitle>
          <CardDescription className="text-[#555555]">
            Recent export and print operations
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#E8F5E9] rounded-xl border border-[#A5D6A7]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-[#388E3C]" />
                <p className="text-sm text-[#555555]">Total Exports (This Month)</p>
              </div>
              <p className="text-2xl font-semibold text-[#388E3C]">24</p>
            </div>

            <div className="p-4 bg-[#E3F2FD] rounded-xl border border-[#90CAF9]">
              <div className="flex items-center gap-2 mb-2">
                <Printer className="h-5 w-5 text-[#1976D2]" />
                <p className="text-sm text-[#555555]">PDFs Generated (This Month)</p>
              </div>
              <p className="text-2xl font-semibold text-[#1976D2]">67</p>
            </div>

            <div className="p-4 bg-[#FFF8E1] rounded-xl border border-[#FFE082]">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-[#F57C00]" />
                <p className="text-sm text-[#555555]">Available for Export</p>
              </div>
              <p className="text-2xl font-semibold text-[#F57C00]">{stats.total}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#666666]">
        <span>Administration</span>
        <span>/</span>
        <span className="text-[#1976D2] font-medium">Test Order Service</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[#1976D2] mb-2">Test Order Service</h1>
        <p className="text-[#555555]">
          Complete test order management including patient orders, test results, comments, and reporting
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <Card className="shadow-md border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button
              variant={currentSubTab === "manage" ? "default" : "outline"}
              onClick={() => setCurrentSubTab("manage")}
              className={`rounded-xl whitespace-nowrap ${
                currentSubTab === "manage"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <ClipboardList className="h-4 w-4 mr-2" />
              1️⃣ Manage Orders
            </Button>

            <Button
              variant={currentSubTab === "results" ? "default" : "outline"}
              onClick={() => setCurrentSubTab("results")}
              className={`rounded-xl whitespace-nowrap ${
                currentSubTab === "results"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <Activity className="h-4 w-4 mr-2" />
              2️⃣ Test Results
            </Button>

            <Button
              variant={currentSubTab === "comments" ? "default" : "outline"}
              onClick={() => setCurrentSubTab("comments")}
              className={`rounded-xl whitespace-nowrap ${
                currentSubTab === "comments"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              3️⃣ Comments
            </Button>

            <Button
              variant={currentSubTab === "reports" ? "default" : "outline"}
              onClick={() => setCurrentSubTab("reports")}
              className={`rounded-xl whitespace-nowrap ${
                currentSubTab === "reports"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              4️⃣ Reports
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Content based on selected sub-tab */}
      {renderContent()}
    </div>
  );
}
