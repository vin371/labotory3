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
import { 
  Search, 
  Eye, 
  ChevronRight,
  Calendar,
  RotateCcw,
  Copy,
  Check,
  Activity,
  AlertCircle,
  Filter,
  SortAsc,
  SortDesc,
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

interface EventLog {
  id: string;
  eventId: string;
  action: string;
  eventMessage: string;
  operator: string;
  timestamp: string;
  actionType: "Created" | "Updated" | "Deleted" | "Status Changed" | "Synced";
  details?: string;
  isAvailable: boolean;
}

// Mock event logs data
const mockEventLogs: EventLog[] = [
  {
    id: "1",
    eventId: "EVT-10234",
    action: "Updated",
    eventMessage: "Test Order #A310 marked as \"Completed\"",
    operator: "John Nguyen",
    timestamp: "2025-10-16 09:45",
    actionType: "Updated",
    details: "Test Order #A310 was successfully marked as completed. All results have been validated and approved by the reviewing physician. The patient has been notified via email.",
    isAvailable: true,
  },
  {
    id: "2",
    eventId: "EVT-10229",
    action: "Created",
    eventMessage: "Reagent \"Plasma Control Lot #22\" installed successfully",
    operator: "John Nguyen",
    timestamp: "2025-10-15 14:30",
    actionType: "Created",
    details: "New reagent Plasma Control Lot #22 has been installed in the system. Expiration date: 2026-04-15. Storage location: Refrigerator A3. Initial quantity: 500mL.",
    isAvailable: true,
  },
  {
    id: "3",
    eventId: "EVT-10218",
    action: "Status Changed",
    eventMessage: "Instrument #03 switched to \"Maintenance\" mode",
    operator: "John Nguyen",
    timestamp: "2025-10-15 10:12",
    actionType: "Status Changed",
    details: "Hematology Analyzer XN-1000 (Instrument #03) was switched to maintenance mode for scheduled calibration. Estimated downtime: 2 hours. Backup instrument activated.",
    isAvailable: true,
  },
  {
    id: "4",
    eventId: "EVT-10210",
    action: "Deleted",
    eventMessage: "Reagent \"Old Control Batch #18\" removed from inventory",
    operator: "Sarah Chen",
    timestamp: "2025-10-14 16:20",
    actionType: "Deleted",
    details: "Expired reagent removed from inventory. Lot number: CTR-2024-018. Expiration date: 2025-10-01. Disposal method: Hazardous waste protocol followed.",
    isAvailable: true,
  },
  {
    id: "5",
    eventId: "EVT-10205",
    action: "Synced",
    eventMessage: "Configuration synchronized with Warehouse Service",
    operator: "System Auto",
    timestamp: "2025-10-14 12:00",
    actionType: "Synced",
    details: "All system configurations have been synchronized with the central Warehouse Service. Total configs synced: 45. No conflicts detected. Last sync: 2025-10-14 12:00:00.",
    isAvailable: true,
  },
  {
    id: "6",
    eventId: "EVT-10198",
    action: "Created",
    eventMessage: "New test order created for patient #PT-5678",
    operator: "Emily Rodriguez",
    timestamp: "2025-10-13 11:15",
    actionType: "Created",
    details: "Test order TO-2025-156 created. Patient: PT-5678. Tests requested: CBC, Metabolic Panel. Priority: Normal. Expected completion: 2025-10-14.",
    isAvailable: true,
  },
  {
    id: "7",
    eventId: "EVT-10192",
    action: "Updated",
    eventMessage: "QC results updated for Chemistry Analyzer",
    operator: "Michael Lee",
    timestamp: "2025-10-13 08:30",
    actionType: "Updated",
    details: "Quality control results updated for Chemistry Analyzer AU-680. All parameters within acceptable range. QC level: Level 2. Next QC scheduled: 2025-10-14 08:00.",
    isAvailable: true,
  },
  {
    id: "8",
    eventId: "EVT-10185",
    action: "Status Changed",
    eventMessage: "Instrument #07 activated and set to Ready",
    operator: "David Kim",
    timestamp: "2025-10-12 15:45",
    actionType: "Status Changed",
    details: "Immunology Analyzer i2000 (Instrument #07) maintenance completed and status changed to Ready. All calibration checks passed. Available for testing.",
    isAvailable: true,
  },
  {
    id: "9",
    eventId: "EVT-10180",
    action: "Synced",
    eventMessage: "Test results synchronized with HL7 server",
    operator: "System Auto",
    timestamp: "2025-10-12 13:00",
    actionType: "Synced",
    details: "Batch synchronization of test results to HL7 integration server completed successfully. Total results synced: 127. Failed: 0. Duration: 45 seconds.",
    isAvailable: true,
  },
  {
    id: "10",
    eventId: "EVT-10175",
    action: "Created",
    eventMessage: "Reagent \"Hemoglobin Test Kit Lot #45\" added to inventory",
    operator: "Anna Martinez",
    timestamp: "2025-10-11 10:00",
    actionType: "Created",
    details: "New reagent kit received and added to inventory. Vendor: Sysmex Corporation. Purchase Order: PO-2025-0234. Quantity: 1000 tests. Storage: Room temperature.",
    isAvailable: true,
  },
  {
    id: "11",
    eventId: "EVT-10165",
    action: "Deleted",
    eventMessage: "Inactive user account removed from system",
    operator: "Admin User",
    timestamp: "2025-10-10 09:00",
    actionType: "Deleted",
    details: "User account deactivated after 90 days of inactivity. User ID: USR-2024-089. Last login: 2025-07-10. All associated data archived.",
    isAvailable: true,
  },
  {
    id: "12",
    eventId: "EVT-10158",
    action: "Updated",
    eventMessage: "Patient information updated for PT-4521",
    operator: "Jessica Wong",
    timestamp: "2025-10-09 14:20",
    actionType: "Updated",
    details: "Patient contact information updated. Patient ID: PT-4521. Changes: Phone number, email address. Updated by: Reception Staff. Verification status: Confirmed.",
    isAvailable: true,
  },
  {
    id: "13",
    eventId: "EVT-10150",
    action: "Status Changed",
    eventMessage: "Test Order #B205 status changed to Reviewed",
    operator: "Dr. Robert Chen",
    timestamp: "2025-10-09 11:30",
    actionType: "Status Changed",
    details: "Test Order B205 results reviewed and approved by attending physician. All values within normal range. Report generated and sent to requesting physician.",
    isAvailable: true,
  },
  {
    id: "14",
    eventId: "EVT-10142",
    action: "Synced",
    eventMessage: "Instrument calibration data synchronized",
    operator: "System Auto",
    timestamp: "2025-10-08 06:00",
    actionType: "Synced",
    details: "Daily calibration data synchronized across all active instruments. Total instruments: 18. Successful: 18. Failed: 0. Next sync: 2025-10-09 06:00.",
    isAvailable: true,
  },
  {
    id: "15",
    eventId: "EVT-10135",
    action: "Created",
    eventMessage: "Monthly quality control report generated",
    operator: "System Auto",
    timestamp: "2025-10-01 00:05",
    actionType: "Created",
    details: "Automated monthly QC report generated for September 2025. Total tests: 4,528. QC pass rate: 99.8%. Report saved to: /reports/qc/2025-09.pdf",
    isAvailable: true,
  },
  {
    id: "16",
    eventId: "EVT-10001",
    action: "Deleted",
    eventMessage: "Log entry unavailable - deleted by system administrator",
    operator: "System Admin",
    timestamp: "2025-09-15 10:00",
    actionType: "Deleted",
    details: "",
    isAvailable: false,
  },
];

interface EventLogsManagementProps {
  onNavigateToDashboard?: () => void;
}

export function EventLogsManagement({ onNavigateToDashboard }: EventLogsManagementProps = {}) {
  const [eventLogs] = useState<EventLog[]>(mockEventLogs);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actionTypeFilter, setActionTypeFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState<"Newest First" | "Oldest First">("Newest First");
  
  // Modal states
  const [selectedLog, setSelectedLog] = useState<EventLog | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Filter logs
  const filteredLogs = eventLogs
    .filter(log => {
      const matchesSearch = 
        log.eventMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.eventId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesActionType = actionTypeFilter === "All" || log.actionType === actionTypeFilter;
      
      const matchesDateRange = (() => {
        if (!startDate && !endDate) return true;
        const logDate = new Date(log.timestamp);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        if (start && end) return logDate >= start && logDate <= end;
        if (start) return logDate >= start;
        if (end) return logDate <= end;
        return true;
      })();
      
      return matchesSearch && matchesActionType && matchesDateRange;
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === "Newest First" ? dateB - dateA : dateA - dateB;
    });

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setActionTypeFilter("All");
    setSortOrder("Newest First");
    toast.success("Filters reset", {
      description: "All filters have been cleared"
    });
  };

  // View detail
  const handleViewDetail = (log: EventLog) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
    setIsCopied(false);
  };

  // Copy event ID
  const handleCopyEventId = () => {
    if (selectedLog) {
      navigator.clipboard.writeText(selectedLog.eventId);
      setIsCopied(true);
      toast.success("Event ID copied", {
        description: `${selectedLog.eventId} copied to clipboard`
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get action badge color
  const getActionBadgeColor = (actionType: string) => {
    const colors = {
      "Created": "bg-green-100 text-green-800 border-green-200",
      "Updated": "bg-blue-100 text-blue-800 border-blue-200",
      "Deleted": "bg-red-100 text-red-800 border-red-200",
      "Status Changed": "bg-purple-100 text-purple-800 border-purple-200",
      "Synced": "bg-cyan-100 text-cyan-800 border-cyan-200",
    };
    return colors[actionType as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
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
              <BreadcrumbLink href="#" className="text-[#6B7280]">
                Monitoring
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-[#333333]">Event Logs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-[#333333]">Event Logs</h1>
          <p className="text-[#6B7280]">View and track all system and laboratory activity logs.</p>
        </div>
      </div>

      {/* Event Logs Table */}
      <Card className="rounded-2xl border-[#E5E7EB] shadow-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Event Logs</CardTitle>
              <CardDescription>
                Showing {filteredLogs.length} events
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-white rounded-lg px-3 py-1">
              <Activity className="h-3 w-3 mr-1" />
              {filteredLogs.length} Total
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filter Row - All in one line */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Search by event message or operator name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-[#E5E7EB]"
              />
            </div>

            {/* Start Date */}
            <div className="relative w-[180px]">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280] pointer-events-none" />
              <Input
                type="date"
                placeholder="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10 rounded-xl border-[#E5E7EB]"
              />
            </div>

            {/* End Date */}
            <div className="relative w-[180px]">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280] pointer-events-none" />
              <Input
                type="date"
                placeholder="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10 rounded-xl border-[#E5E7EB]"
              />
            </div>

            {/* Action Type Filter */}
            <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Actions</SelectItem>
                <SelectItem value="Created">Created</SelectItem>
                <SelectItem value="Updated">Updated</SelectItem>
                <SelectItem value="Deleted">Deleted</SelectItem>
                <SelectItem value="Status Changed">Status Changed</SelectItem>
                <SelectItem value="Synced">Synced</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Order */}
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "Newest First" | "Oldest First")}>
              <SelectTrigger className="w-[180px] rounded-xl">
                {sortOrder === "Newest First" ? (
                  <SortDesc className="h-4 w-4 mr-2" />
                ) : (
                  <SortAsc className="h-4 w-4 mr-2" />
                )}
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Newest First">Newest First</SelectItem>
                <SelectItem value="Oldest First">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Button */}
            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="rounded-xl border-[#E5E7EB] hover:bg-[#F8F9FA]"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Table with Scroll */}
          {filteredLogs.length === 0 ? (
            <div className="text-center py-16">
              <Activity className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
              <p className="text-[#6B7280] mb-2">No event logs available.</p>
              <p className="text-sm text-[#9CA3AF]">Try adjusting filters or date range.</p>
            </div>
          ) : (
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-[#F8F9FA] z-10">
                    <TableRow>
                      <TableHead className="w-[120px]">Event ID</TableHead>
                      <TableHead className="w-[140px]">Action</TableHead>
                      <TableHead>Event Message</TableHead>
                      <TableHead className="w-[160px]">Operator</TableHead>
                      <TableHead className="w-[160px]">Timestamp</TableHead>
                      <TableHead className="w-[120px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log, index) => (
                      <TableRow 
                        key={log.id}
                        className={`hover:bg-[#F8F9FA] transition-colors ${index % 2 === 1 ? 'bg-[#FAFBFC]' : ''}`}
                      >
                        <TableCell className="font-mono text-sm font-medium">{log.eventId}</TableCell>
                        <TableCell>
                          <Badge className={`${getActionBadgeColor(log.actionType)} rounded-lg px-2 py-1 border`}>
                            {log.actionType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="group relative">
                            <span className="text-[#333333]">{truncateText(log.eventMessage)}</span>
                            {log.eventMessage.length > 80 && (
                              <div className="absolute hidden group-hover:block z-50 p-2 bg-[#333333] text-white text-sm rounded-lg shadow-lg max-w-md -top-2 left-0 transform -translate-y-full">
                                {log.eventMessage}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-[#6B7280]">{log.operator}</TableCell>
                        <TableCell className="text-[#6B7280] font-mono text-sm">{log.timestamp}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetail(log)}
                            className="h-8 px-3 hover:bg-blue-50 text-[#007BFF] transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-1" />
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

      {/* Event Log Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle>Event Log Details</DialogTitle>
            <DialogDescription>Complete information about this event</DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4 py-4">
              {!selectedLog.isAvailable ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-red-800">
                      ⚠ This log entry is unavailable or has been deleted.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#6B7280]">Event ID</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="font-mono text-[#333333]">{selectedLog.eventId}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyEventId}
                          className="h-6 w-6 p-0"
                        >
                          {isCopied ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-[#6B7280]">Action Type</Label>
                      <div className="mt-1">
                        <Badge className={`${getActionBadgeColor(selectedLog.actionType)} rounded-lg px-2 py-1 border`}>
                          {selectedLog.actionType}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#6B7280]">Full Event Message</Label>
                    <div className="mt-1 p-3 bg-[#F8F9FA] border border-[#E5E7EB] rounded-lg">
                      <p className="text-[#333333] whitespace-pre-wrap">{selectedLog.eventMessage}</p>
                    </div>
                  </div>

                  {selectedLog.details && (
                    <div>
                      <Label className="text-[#6B7280]">Additional Details</Label>
                      <div className="mt-1 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-[#333333] whitespace-pre-wrap">{selectedLog.details}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#6B7280]">Operator Name</Label>
                      <p className="text-[#333333] mt-1">{selectedLog.operator}</p>
                    </div>
                    
                    <div>
                      <Label className="text-[#6B7280]">Timestamp</Label>
                      <p className="font-mono text-sm text-[#333333] mt-1">{selectedLog.timestamp}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setIsDetailModalOpen(false)}
              className="bg-[#007BFF] hover:bg-[#0056D2] text-white rounded-lg"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
