import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Database, RefreshCw, CheckCircle, XCircle, Clock, ShieldAlert } from "lucide-react";
import { Progress } from "./ui/progress";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission } from "../types/auth";
import { AccessDenied } from "./AccessDenied";

interface TestResultSync {
  id: string;
  testOrderId: string;
  syncStatus: "Sync successful" | "Sync failed" | "Pending";
  lastSyncTimestamp: string;
  retryCount: number;
  dataSize: string;
}

const mockSyncData: TestResultSync[] = [
  { id: "sync-1", testOrderId: "TO-2024-001", syncStatus: "Sync successful", lastSyncTimestamp: "2024-10-15 14:30:45", retryCount: 0, dataSize: "2.4 MB" },
  { id: "sync-2", testOrderId: "TO-2024-002", syncStatus: "Sync successful", lastSyncTimestamp: "2024-10-15 14:28:12", retryCount: 0, dataSize: "1.8 MB" },
  { id: "sync-3", testOrderId: "TO-2024-003", syncStatus: "Pending", lastSyncTimestamp: "2024-10-15 14:25:30", retryCount: 1, dataSize: "3.2 MB" },
  { id: "sync-4", testOrderId: "TO-2024-004", syncStatus: "Sync failed", lastSyncTimestamp: "2024-10-15 14:20:18", retryCount: 3, dataSize: "1.5 MB" },
  { id: "sync-5", testOrderId: "TO-2024-005", syncStatus: "Sync successful", lastSyncTimestamp: "2024-10-15 14:15:55", retryCount: 0, dataSize: "2.1 MB" },
  { id: "sync-6", testOrderId: "TO-2024-006", syncStatus: "Pending", lastSyncTimestamp: "2024-10-15 14:10:22", retryCount: 0, dataSize: "2.8 MB" },
];

export function TestResultsSync() {
  const { user } = useAuth();
  const [syncData, setSyncData] = useState<TestResultSync[]>(mockSyncData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check access permission - ONLY Service User
  const canAccess = user && hasPermission(user.role, "VIEW_TEST_RESULTS_SYNC");

  if (!canAccess) {
    return <AccessDenied />;
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Sync successful":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Sync failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sync successful":
        return "bg-green-100 text-green-800 border-green-200";
      case "Sync failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const successCount = syncData.filter(s => s.syncStatus === "Sync successful").length;
  const failedCount = syncData.filter(s => s.syncStatus === "Sync failed").length;
  const pendingCount = syncData.filter(s => s.syncStatus === "Pending").length;
  const successRate = ((successCount / syncData.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Access Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Test Results Sync Access:</strong> This feature is only available to Service User role.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Syncs</p>
                <p className="text-2xl text-slate-800">{syncData.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Successful</p>
                <p className="text-2xl text-green-600">{successCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Failed</p>
                <p className="text-2xl text-red-600">{failedCount}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Pending</p>
                <p className="text-2xl text-yellow-600">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Rate */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Sync Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Overall Success Rate</span>
              <span className="text-green-600">{successRate}%</span>
            </div>
            <Progress value={parseFloat(successRate)} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Sync Data Table */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-800">Test Results Sync Status</CardTitle>
              <CardDescription className="text-slate-600">
                Monitor backup synchronization of raw test results
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead>Test Order ID</TableHead>
                  <TableHead>Sync Status</TableHead>
                  <TableHead>Last Sync Timestamp</TableHead>
                  <TableHead>Retry Count</TableHead>
                  <TableHead>Data Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syncData.map((sync) => (
                  <TableRow key={sync.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{sync.testOrderId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(sync.syncStatus)}
                        <Badge variant="outline" className={getStatusColor(sync.syncStatus)}>
                          {sync.syncStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{sync.lastSyncTimestamp}</TableCell>
                    <TableCell>
                      <span className={sync.retryCount > 0 ? "text-yellow-600" : "text-slate-600"}>
                        {sync.retryCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600">{sync.dataSize}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Note */}
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Raw test results are automatically backed up when event messages are published. 
              Sync status updates in real-time as the system processes the queue.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
