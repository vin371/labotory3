import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {
  Search,
  Calendar,
  FileText,
  Activity,
  Download,
  X,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Beaker,
  FileDown,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Types
interface ReportData {
  id: string;
  reportId: string;
  patientId?: string;
  testOrderId?: string;
  testType: string;
  resultStatus: "Normal" | "Abnormal" | "Pending";
  instrumentName: string;
  operator: string;
  date: string;
  details?: string;
}

// Mock data for different report types
const mockTestOrdersData: ReportData[] = [
  {
    id: "1",
    reportId: "RPT-TO-001",
    patientId: "PT-1234",
    testOrderId: "TO-2025-156",
    testType: "Complete Blood Count (CBC)",
    resultStatus: "Normal",
    instrumentName: "Hematology Analyzer XN-1000",
    operator: "John Nguyen",
    date: "2025-10-18 09:15",
    details: "All parameters within normal range. WBC: 7.2, RBC: 4.8, Hemoglobin: 14.5 g/dL"
  },
  {
    id: "2",
    reportId: "RPT-TO-002",
    patientId: "PT-1235",
    testOrderId: "TO-2025-157",
    testType: "Metabolic Panel",
    resultStatus: "Abnormal",
    instrumentName: "Chemistry Analyzer AU-680",
    operator: "Sarah Chen",
    date: "2025-10-18 10:30",
    details: "Elevated glucose levels detected. Glucose: 145 mg/dL (normal: 70-100). Recommend follow-up."
  },
  {
    id: "3",
    reportId: "RPT-TO-003",
    patientId: "PT-1236",
    testOrderId: "TO-2025-158",
    testType: "Lipid Panel",
    resultStatus: "Normal",
    instrumentName: "Chemistry Analyzer AU-680",
    operator: "Emily Rodriguez",
    date: "2025-10-18 11:45",
    details: "Cholesterol levels within acceptable range. Total: 185 mg/dL, LDL: 110, HDL: 55"
  },
  {
    id: "4",
    reportId: "RPT-TO-004",
    patientId: "PT-1237",
    testOrderId: "TO-2025-159",
    testType: "Thyroid Function Test",
    resultStatus: "Pending",
    instrumentName: "Immunology Analyzer i2000",
    operator: "Michael Lee",
    date: "2025-10-18 13:00",
    details: "Sample currently being processed. Results expected within 2 hours."
  },
  {
    id: "5",
    reportId: "RPT-TO-005",
    patientId: "PT-1238",
    testOrderId: "TO-2025-160",
    testType: "Liver Function Test",
    resultStatus: "Abnormal",
    instrumentName: "Chemistry Analyzer AU-680",
    operator: "John Nguyen",
    date: "2025-10-18 14:15",
    details: "Elevated ALT and AST levels. ALT: 65 U/L, AST: 58 U/L. Recommend hepatology consultation."
  },
  {
    id: "6",
    reportId: "RPT-TO-006",
    patientId: "PT-1239",
    testOrderId: "TO-2025-161",
    testType: "Complete Blood Count (CBC)",
    resultStatus: "Normal",
    instrumentName: "Hematology Analyzer XN-1000",
    operator: "David Kim",
    date: "2025-10-17 15:30",
    details: "All blood cell counts within normal limits. No abnormalities detected."
  },
  {
    id: "7",
    reportId: "RPT-TO-007",
    patientId: "PT-1240",
    testOrderId: "TO-2025-162",
    testType: "Urinalysis",
    resultStatus: "Abnormal",
    instrumentName: "Urine Analyzer UX-2000",
    operator: "Anna Martinez",
    date: "2025-10-17 16:45",
    details: "Protein detected in urine. Recommend nephrology evaluation."
  },
  {
    id: "8",
    reportId: "RPT-TO-008",
    patientId: "PT-1241",
    testOrderId: "TO-2025-163",
    testType: "Coagulation Panel",
    resultStatus: "Normal",
    instrumentName: "Coagulation Analyzer CA-500",
    operator: "Sarah Chen",
    date: "2025-10-16 09:00",
    details: "PT, aPTT, and INR values all within therapeutic range."
  },
  {
    id: "9",
    reportId: "RPT-TO-009",
    patientId: "PT-1242",
    testOrderId: "TO-2025-164",
    testType: "HbA1c (Diabetes Screening)",
    resultStatus: "Abnormal",
    instrumentName: "Chemistry Analyzer AU-680",
    operator: "Emily Rodriguez",
    date: "2025-10-16 11:20",
    details: "HbA1c: 7.2% indicates poor glycemic control. Recommend diabetes management review."
  },
  {
    id: "10",
    reportId: "RPT-TO-010",
    patientId: "PT-1243",
    testOrderId: "TO-2025-165",
    testType: "Electrolyte Panel",
    resultStatus: "Normal",
    instrumentName: "Chemistry Analyzer AU-680",
    operator: "Michael Lee",
    date: "2025-10-15 14:30",
    details: "Sodium, potassium, chloride, and bicarbonate all within normal range."
  },
];

const mockInstrumentActivityData: ReportData[] = [
  {
    id: "11",
    reportId: "RPT-INS-001",
    testType: "Hematology Analysis - 45 tests",
    resultStatus: "Normal",
    instrumentName: "Hematology Analyzer XN-1000",
    operator: "System Auto",
    date: "2025-10-18 08:00",
    details: "Instrument operated for 6.5 hours. Total tests: 45. Success rate: 100%. No errors."
  },
  {
    id: "12",
    reportId: "RPT-INS-002",
    testType: "Chemistry Analysis - 78 tests",
    resultStatus: "Normal",
    instrumentName: "Chemistry Analyzer AU-680",
    operator: "System Auto",
    date: "2025-10-18 08:00",
    details: "Instrument operated for 8.2 hours. Total tests: 78. Success rate: 98.7%. 1 rerun required."
  },
  {
    id: "13",
    reportId: "RPT-INS-003",
    testType: "Immunology Analysis - 23 tests",
    resultStatus: "Abnormal",
    instrumentName: "Immunology Analyzer i2000",
    operator: "System Auto",
    date: "2025-10-18 08:00",
    details: "Instrument operated for 4.5 hours. Total tests: 23. 2 calibration warnings detected."
  },
];

const mockReagentUsageData: ReportData[] = [
  {
    id: "14",
    reportId: "RPT-REA-001",
    testType: "Hemoglobin Reagent Kit",
    resultStatus: "Normal",
    instrumentName: "Hematology Analyzer XN-1000",
    operator: "John Nguyen",
    date: "2025-10-18",
    details: "Usage: 150 tests. Remaining: 850 tests. Expiration: 2026-03-15. Status: Sufficient stock."
  },
  {
    id: "15",
    reportId: "RPT-REA-002",
    testType: "Glucose Test Reagent",
    resultStatus: "Abnormal",
    instrumentName: "Chemistry Analyzer AU-680",
    operator: "Sarah Chen",
    date: "2025-10-18",
    details: "Usage: 95 tests. Remaining: 105 tests. Expiration: 2025-11-20. WARNING: Low stock level."
  },
];

// Chart data
const dailyTestOrdersData = [
  { date: "Mon", orders: 45 },
  { date: "Tue", orders: 52 },
  { date: "Wed", orders: 38 },
  { date: "Thu", orders: 61 },
  { date: "Fri", orders: 48 },
  { date: "Sat", orders: 29 },
  { date: "Sun", orders: 15 },
];

const resultStatusPieData = [
  { name: "Normal", value: 65, color: "#28A745" },
  { name: "Abnormal", value: 28, color: "#FFC107" },
  { name: "Pending", value: 7, color: "#6B7280" },
];

interface ReportsPageProps {
  onNavigateToDashboard?: () => void;
}

export function ReportsPage({ onNavigateToDashboard }: ReportsPageProps = {}) {
  // Filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("Test Orders Summary");
  const [selectedInstrument, setSelectedInstrument] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Data state
  const [reportData, setReportData] = useState<ReportData[]>(mockTestOrdersData);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Get data based on report type
  const getReportData = (type: string): ReportData[] => {
    switch (type) {
      case "Test Orders Summary":
        return mockTestOrdersData;
      case "Patient Test Results Summary":
        return mockTestOrdersData.filter(r => r.patientId);
      case "Instrument Activity Report":
        return mockInstrumentActivityData;
      case "Reagent Usage Report":
        return mockReagentUsageData;
      default:
        return mockTestOrdersData;
    }
  };

  // Handle Generate Report
  const handleGenerateReport = () => {
    const newData = getReportData(reportType);
    setReportData(newData);
    toast.success("Report generated successfully", {
      description: `${newData.length} records found for ${reportType}`
    });
  };

  // Handle Export CSV
  const handleExportCSV = () => {
    toast.success("Report exported", {
      description: `${filteredData.length} records exported to CSV file`
    });
  };

  // Filter data
  const filteredData = reportData.filter(item => {
    const matchesSearch = 
      item.reportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.patientId && item.patientId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.testOrderId && item.testOrderId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesInstrument = selectedInstrument === "All" || item.instrumentName === selectedInstrument;

    const matchesDateRange = (() => {
      if (!startDate && !endDate) return true;
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) return itemDate >= start && itemDate <= end;
      if (start) return itemDate >= start;
      if (end) return itemDate <= end;
      return true;
    })();

    return matchesSearch && matchesInstrument && matchesDateRange;
  });

  // Calculate statistics
  const stats = {
    totalProcessed: filteredData.length,
    completed: filteredData.filter(r => r.resultStatus === "Normal").length,
    abnormal: filteredData.filter(r => r.resultStatus === "Abnormal").length,
    activeInstruments: new Set(filteredData.map(r => r.instrumentName)).size,
  };

  // Handle view detail
  const handleViewDetail = (report: ReportData) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  // Handle download PDF
  const handleDownloadPDF = () => {
    if (selectedReport) {
      toast.success("PDF downloaded", {
        description: `Report ${selectedReport.reportId} downloaded successfully`
      });
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const styles = {
      "Normal": "bg-green-100 text-green-800 border-green-200",
      "Abnormal": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Pending": "bg-gray-100 text-gray-800 border-gray-200",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Normal":
        return <CheckCircle className="h-4 w-4" />;
      case "Abnormal":
        return <AlertTriangle className="h-4 w-4" />;
      case "Pending":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
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
              <BreadcrumbPage className="text-[#333333]">Reports</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-[#333333]">Reports</h1>
          <p className="text-[#6B7280]">Generate and review laboratory test and instrument reports.</p>
        </div>
      </div>

      {/* Filter & Report Generation Card */}
      <Card className="rounded-2xl border-[#E5E7EB] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-[#E5E7EB]">
          <CardTitle className="text-[#333333]">Filter & Report Generation</CardTitle>
          <CardDescription>Configure report parameters and generate custom reports</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters in one row */}
          <div className="flex flex-wrap items-end gap-4 mb-4">
            {/* Date Range */}
            <div className="flex items-end gap-2">
              <div className="w-[160px]">
                <label className="text-sm text-[#6B7280] mb-1 block">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280] pointer-events-none" />
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 rounded-xl border-[#E5E7EB]"
                  />
                </div>
              </div>
              <div className="w-[160px]">
                <label className="text-sm text-[#6B7280] mb-1 block">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280] pointer-events-none" />
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 rounded-xl border-[#E5E7EB]"
                  />
                </div>
              </div>
            </div>

            {/* Report Type */}
            <div className="w-[220px]">
              <label className="text-sm text-[#6B7280] mb-1 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Test Orders Summary">Test Orders Summary</SelectItem>
                  <SelectItem value="Patient Test Results Summary">Patient Test Results Summary</SelectItem>
                  <SelectItem value="Instrument Activity Report">Instrument Activity Report</SelectItem>
                  <SelectItem value="Reagent Usage Report">Reagent Usage Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Instrument Filter */}
            <div className="w-[200px]">
              <label className="text-sm text-[#6B7280] mb-1 block">Instrument</label>
              <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                <SelectTrigger className="rounded-xl border-[#E5E7EB]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Instruments</SelectItem>
                  <SelectItem value="Hematology Analyzer XN-1000">Hematology Analyzer XN-1000</SelectItem>
                  <SelectItem value="Chemistry Analyzer AU-680">Chemistry Analyzer AU-680</SelectItem>
                  <SelectItem value="Immunology Analyzer i2000">Immunology Analyzer i2000</SelectItem>
                  <SelectItem value="Urine Analyzer UX-2000">Urine Analyzer UX-2000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm text-[#6B7280] mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                <Input
                  placeholder="Search by Patient ID or Test Order..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-[#E5E7EB]"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerateReport}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-xl"
            >
              <Activity className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="rounded-xl border-[#E5E7EB]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-xl border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Total Test Orders Processed</p>
                <p className="text-[#333333]">{stats.totalProcessed}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#007BFF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Completed Tests</p>
                <p className="text-[#333333]">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-[#28A745]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Abnormal Results Detected</p>
                <p className="text-[#333333]">{stats.abnormal}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-[#FFC107]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Active Instruments Used</p>
                <p className="text-[#333333]">{stats.activeInstruments}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <Beaker className="h-6 w-6 text-[#7C3AED]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card className="rounded-2xl border-[#E5E7EB] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333]">Daily Test Orders</CardTitle>
            <CardDescription>Test orders processed per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyTestOrdersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Bar dataKey="orders" fill="#007BFF" name="Test Orders" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="rounded-2xl border-[#E5E7EB] shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#333333]">Results by Status</CardTitle>
            <CardDescription>Distribution of test results</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resultStatusPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resultStatusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Report Table */}
      <Card className="rounded-2xl border-[#E5E7EB] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#333333]">Detailed Report Data</CardTitle>
              <CardDescription>
                {filteredData.length} records found • {reportType}
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-white rounded-lg px-3 py-1">
              <Activity className="h-3 w-3 mr-1" />
              {filteredData.length} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {filteredData.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
              <p className="text-[#6B7280] mb-2">No report data available for this range.</p>
              <p className="text-sm text-[#9CA3AF]">Try adjusting your filters or click Generate Report.</p>
            </div>
          ) : (
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-[#F8F9FA] z-10">
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      {reportType !== "Instrument Activity Report" && reportType !== "Reagent Usage Report" && (
                        <>
                          <TableHead>Patient/Order ID</TableHead>
                        </>
                      )}
                      <TableHead>Test Type</TableHead>
                      <TableHead>Result Status</TableHead>
                      <TableHead>Instrument Name</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, index) => (
                      <TableRow 
                        key={item.id}
                        className={`hover:bg-[#F8F9FA] transition-colors ${index % 2 === 1 ? 'bg-[#FAFBFC]' : ''}`}
                      >
                        <TableCell className="font-mono text-sm font-medium">{item.reportId}</TableCell>
                        {reportType !== "Instrument Activity Report" && reportType !== "Reagent Usage Report" && (
                          <TableCell className="text-[#6B7280]">{item.patientId || item.testOrderId || "-"}</TableCell>
                        )}
                        <TableCell className="text-[#333333]">{item.testType}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusBadge(item.resultStatus)} rounded-lg px-2 py-1 border flex items-center gap-1 w-fit`}>
                            {getStatusIcon(item.resultStatus)}
                            {item.resultStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#6B7280]">{item.instrumentName}</TableCell>
                        <TableCell className="text-[#6B7280]">{item.operator}</TableCell>
                        <TableCell className="font-mono text-sm text-[#6B7280]">{item.date}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(item)}
                            className="h-8 px-3 hover:bg-blue-50 text-[#007BFF]"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
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

      {/* Report Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl rounded-xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>Complete information about this report</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#6B7280]">Report ID</label>
                  <p className="font-mono text-[#333333] mt-1">{selectedReport.reportId}</p>
                </div>
                <div>
                  <label className="text-sm text-[#6B7280]">Generated Date</label>
                  <p className="text-[#333333] mt-1">{selectedReport.date}</p>
                </div>
              </div>

              {selectedReport.patientId && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-[#6B7280]">Patient ID</label>
                    <p className="text-[#333333] mt-1">{selectedReport.patientId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[#6B7280]">Test Order ID</label>
                    <p className="text-[#333333] mt-1">{selectedReport.testOrderId}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm text-[#6B7280]">Test Type</label>
                <p className="text-[#333333] mt-1">{selectedReport.testType}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#6B7280]">Result Status</label>
                  <div className="mt-1">
                    <Badge className={`${getStatusBadge(selectedReport.resultStatus)} rounded-lg px-2 py-1 border flex items-center gap-1 w-fit`}>
                      {getStatusIcon(selectedReport.resultStatus)}
                      {selectedReport.resultStatus}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-[#6B7280]">Operator Name</label>
                  <p className="text-[#333333] mt-1">{selectedReport.operator}</p>
                </div>
              </div>

              <div>
                <label className="text-sm text-[#6B7280]">Instrument Used</label>
                <p className="text-[#333333] mt-1">{selectedReport.instrumentName}</p>
              </div>

              {selectedReport.details && (
                <div>
                  <label className="text-sm text-[#6B7280]">Detailed Results</label>
                  <div className="mt-1 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-[#333333] whitespace-pre-wrap">{selectedReport.details}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm text-[#6B7280]">Comments or Notes</label>
                <div className="mt-1 p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg">
                  <p className="text-sm text-[#6B7280]">
                    {selectedReport.resultStatus === "Abnormal" 
                      ? "Follow-up consultation recommended based on abnormal findings."
                      : selectedReport.resultStatus === "Pending"
                      ? "Results are being processed. Please check back later."
                      : "All parameters within normal range. No action required."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
              className="rounded-lg"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-lg"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
