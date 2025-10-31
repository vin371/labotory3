import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  CheckCircle2,
  X,
  Settings,
  Package,
  TestTube,
  Eye,
  Clock,
  User,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ModeChangeRequest {
  id: string;
  requestedBy: string;
  instrument: string;
  fromMode: string;
  toMode: string;
  reason: string;
  timestamp: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface ReagentRequest {
  id: string;
  requestedBy: string;
  reagent: string;
  quantity: number;
  urgency: "High" | "Medium" | "Low";
  reason: string;
  timestamp: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface TestApprovalRequest {
  id: string;
  requestedBy: string;
  testOrder: string;
  patient: string;
  testType: string;
  priority: "Urgent" | "Routine";
  timestamp: string;
  status: "Pending" | "Approved" | "Rejected";
}

const mockModeChangeRequests: ModeChangeRequest[] = [
  {
    id: "MCR-001",
    requestedBy: "John Miller",
    instrument: "Hematology Analyzer XN-1000",
    fromMode: "Ready",
    toMode: "Maintenance",
    reason: "Scheduled calibration and routine maintenance required",
    timestamp: "2025-10-21 09:30:00",
    status: "Pending",
  },
  {
    id: "MCR-002",
    requestedBy: "Lisa Wong",
    instrument: "Chemistry Analyzer AU-5800",
    fromMode: "Maintenance",
    toMode: "Ready",
    reason: "Calibration completed, all QC tests passed successfully",
    timestamp: "2025-10-21 08:15:00",
    status: "Pending",
  },
];

const mockReagentRequests: ReagentRequest[] = [
  {
    id: "RR-001",
    requestedBy: "Emma Johnson",
    reagent: "CBC Reagent Kit",
    quantity: 500,
    urgency: "High",
    reason: "Current stock below minimum threshold, urgent restocking needed",
    timestamp: "2025-10-21 10:00:00",
    status: "Pending",
  },
  {
    id: "RR-002",
    requestedBy: "Mike Davis",
    reagent: "Immunoassay Reagent",
    quantity: 300,
    urgency: "Medium",
    reason: "Planned restocking for upcoming testing schedule",
    timestamp: "2025-10-20 16:45:00",
    status: "Pending",
  },
  {
    id: "RR-003",
    requestedBy: "Sarah Chen",
    reagent: "Quality Control Standard",
    quantity: 100,
    urgency: "High",
    reason: "QC stock critically low, immediate replacement required",
    timestamp: "2025-10-21 07:30:00",
    status: "Pending",
  },
];

const mockTestApprovals: TestApprovalRequest[] = [
  {
    id: "TA-001",
    requestedBy: "Dr. Sarah Chen",
    testOrder: "TO-2025-10-21-045",
    patient: "Patient #45892",
    testType: "Comprehensive Metabolic Panel",
    priority: "Urgent",
    timestamp: "2025-10-21 11:20:00",
    status: "Pending",
  },
  {
    id: "TA-002",
    requestedBy: "John Miller",
    testOrder: "TO-2025-10-21-046",
    patient: "Patient #45893",
    testType: "Complete Blood Count (CBC)",
    priority: "Routine",
    timestamp: "2025-10-21 10:45:00",
    status: "Pending",
  },
];

export function ManagerStaffApprovals() {
  const [modeChangeRequests, setModeChangeRequests] = useState<ModeChangeRequest[]>(mockModeChangeRequests);
  const [reagentRequests, setReagentRequests] = useState<ReagentRequest[]>(mockReagentRequests);
  const [testApprovals, setTestApprovals] = useState<TestApprovalRequest[]>(mockTestApprovals);

  const [activeTab, setActiveTab] = useState<"mode" | "reagent" | "test">("mode");
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState("");

  const pendingModeChanges = modeChangeRequests.filter((r) => r.status === "Pending").length;
  const pendingReagents = reagentRequests.filter((r) => r.status === "Pending").length;
  const pendingTests = testApprovals.filter((r) => r.status === "Pending").length;

  const handleApprove = () => {
    if (!selectedRequest) return;

    if (activeTab === "mode") {
      setModeChangeRequests(
        modeChangeRequests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "Approved" } : req
        )
      );
    } else if (activeTab === "reagent") {
      setReagentRequests(
        reagentRequests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "Approved" } : req
        )
      );
    } else if (activeTab === "test") {
      setTestApprovals(
        testApprovals.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "Approved" } : req
        )
      );
    }

    toast.success("Request approved successfully");
    setIsApproveOpen(false);
    setSelectedRequest(null);
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectReason) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    if (activeTab === "mode") {
      setModeChangeRequests(
        modeChangeRequests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "Rejected" } : req
        )
      );
    } else if (activeTab === "reagent") {
      setReagentRequests(
        reagentRequests.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "Rejected" } : req
        )
      );
    } else if (activeTab === "test") {
      setTestApprovals(
        testApprovals.map((req) =>
          req.id === selectedRequest.id ? { ...req, status: "Rejected" } : req
        )
      );
    }

    toast.success("Request rejected");
    setIsRejectOpen(false);
    setSelectedRequest(null);
    setRejectReason("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#007BFF] mb-2">Staff Approvals</h1>
        <p className="text-[#6B7280]">Review and approve staff requests for your laboratory</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-gradient-to-br from-[#E3F2FD] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">Total Pending</CardDescription>
            <CardTitle className="text-[#007BFF]">
              {pendingModeChanges + pendingReagents + pendingTests}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#90CAF9] rounded-xl bg-gradient-to-br from-[#E3F2FD] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">Mode Changes</CardDescription>
            <CardTitle className="text-[#007BFF]">{pendingModeChanges}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#A5D6A7] rounded-xl bg-gradient-to-br from-[#E8F5E9] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">Reagent Requests</CardDescription>
            <CardTitle className="text-[#28A745]">{pendingReagents}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#CE93D8] rounded-xl bg-gradient-to-br from-[#F3E5F5] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">Test Approvals</CardDescription>
            <CardTitle className="text-[#9C27B0]">{pendingTests}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Approvals Tabs */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#007BFF]">Approval Requests</CardTitle>
          <CardDescription>Review and process staff requests</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mode">
                <Settings className="h-4 w-4 mr-2" />
                Mode Change ({pendingModeChanges})
              </TabsTrigger>
              <TabsTrigger value="reagent">
                <Package className="h-4 w-4 mr-2" />
                Reagent Requests ({pendingReagents})
              </TabsTrigger>
              <TabsTrigger value="test">
                <TestTube className="h-4 w-4 mr-2" />
                Test Approvals ({pendingTests})
              </TabsTrigger>
            </TabsList>

            {/* Mode Change Requests */}
            <TabsContent value="mode" className="mt-6">
              <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                      <TableHead className="text-[#007BFF]">Request ID</TableHead>
                      <TableHead className="text-[#007BFF]">Requested By</TableHead>
                      <TableHead className="text-[#007BFF]">Instrument</TableHead>
                      <TableHead className="text-[#007BFF]">Change</TableHead>
                      <TableHead className="text-[#007BFF]">Timestamp</TableHead>
                      <TableHead className="text-[#007BFF]">Status</TableHead>
                      <TableHead className="text-[#007BFF] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modeChangeRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-[#F9FBFF]">
                        <TableCell className="font-medium text-[#333333]">{request.id}</TableCell>
                        <TableCell className="text-[#666666]">{request.requestedBy}</TableCell>
                        <TableCell className="text-[#666666]">{request.instrument}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              {request.fromMode}
                            </Badge>
                            <span>→</span>
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                              {request.toMode}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-[#666666]">{request.timestamp}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              request.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {request.status === "Pending" && (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsDetailOpen(true);
                                }}
                                className="rounded-xl text-[#007BFF] hover:bg-[#E3F2FD]"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsApproveOpen(true);
                                }}
                                className="rounded-xl text-green-600 hover:bg-green-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsRejectOpen(true);
                                }}
                                className="rounded-xl text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Reagent Requests */}
            <TabsContent value="reagent" className="mt-6">
              <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                      <TableHead className="text-[#007BFF]">Request ID</TableHead>
                      <TableHead className="text-[#007BFF]">Requested By</TableHead>
                      <TableHead className="text-[#007BFF]">Reagent</TableHead>
                      <TableHead className="text-[#007BFF]">Quantity</TableHead>
                      <TableHead className="text-[#007BFF]">Urgency</TableHead>
                      <TableHead className="text-[#007BFF]">Timestamp</TableHead>
                      <TableHead className="text-[#007BFF]">Status</TableHead>
                      <TableHead className="text-[#007BFF] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reagentRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-[#F9FBFF]">
                        <TableCell className="font-medium text-[#333333]">{request.id}</TableCell>
                        <TableCell className="text-[#666666]">{request.requestedBy}</TableCell>
                        <TableCell className="text-[#666666]">{request.reagent}</TableCell>
                        <TableCell className="text-[#666666]">{request.quantity} units</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              request.urgency === "High"
                                ? "bg-red-100 text-red-800"
                                : request.urgency === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {request.urgency}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#666666]">{request.timestamp}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              request.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {request.status === "Pending" && (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsDetailOpen(true);
                                }}
                                className="rounded-xl text-[#007BFF] hover:bg-[#E3F2FD]"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsApproveOpen(true);
                                }}
                                className="rounded-xl text-green-600 hover:bg-green-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsRejectOpen(true);
                                }}
                                className="rounded-xl text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Test Approvals */}
            <TabsContent value="test" className="mt-6">
              <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                      <TableHead className="text-[#007BFF]">Request ID</TableHead>
                      <TableHead className="text-[#007BFF]">Requested By</TableHead>
                      <TableHead className="text-[#007BFF]">Test Order</TableHead>
                      <TableHead className="text-[#007BFF]">Test Type</TableHead>
                      <TableHead className="text-[#007BFF]">Priority</TableHead>
                      <TableHead className="text-[#007BFF]">Timestamp</TableHead>
                      <TableHead className="text-[#007BFF]">Status</TableHead>
                      <TableHead className="text-[#007BFF] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {testApprovals.map((request) => (
                      <TableRow key={request.id} className="hover:bg-[#F9FBFF]">
                        <TableCell className="font-medium text-[#333333]">{request.id}</TableCell>
                        <TableCell className="text-[#666666]">{request.requestedBy}</TableCell>
                        <TableCell className="text-[#666666]">{request.testOrder}</TableCell>
                        <TableCell className="text-[#666666]">{request.testType}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              request.priority === "Urgent"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {request.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#666666]">{request.timestamp}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              request.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {request.status === "Pending" && (
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsDetailOpen(true);
                                }}
                                className="rounded-xl text-[#007BFF] hover:bg-[#E3F2FD]"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsApproveOpen(true);
                                }}
                                className="rounded-xl text-green-600 hover:bg-green-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsRejectOpen(true);
                                }}
                                className="rounded-xl text-red-600 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Approve Dialog */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#28A745]">Approve Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this request?
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="p-4 bg-[#F9FBFF] rounded-xl">
              <p className="text-sm text-[#333333]">
                <span className="font-medium">Request ID:</span> {selectedRequest.id}
              </p>
              <p className="text-sm text-[#333333]">
                <span className="font-medium">Requested By:</span> {selectedRequest.requestedBy}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} className="bg-[#28A745] hover:bg-[#218838]">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-red-600">Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="rejectReason">Rejection Reason *</Label>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this request is being rejected..."
                rows={4}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReject} className="bg-red-600 hover:bg-red-700">
              <X className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-white rounded-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#007BFF]">Request Details</DialogTitle>
            <DialogDescription>Complete request information</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#999999]">Request ID</p>
                  <p className="text-sm text-[#333333]">{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Requested By</p>
                  <p className="text-sm text-[#333333]">{selectedRequest.requestedBy}</p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Timestamp</p>
                  <p className="text-sm text-[#333333]">{selectedRequest.timestamp}</p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Status</p>
                  <Badge
                    variant="outline"
                    className={
                      selectedRequest.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedRequest.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>

              <div className="p-4 bg-[#F9FBFF] rounded-xl">
                <p className="text-xs text-[#999999] mb-2">Reason</p>
                <p className="text-sm text-[#333333]">{selectedRequest.reason}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
