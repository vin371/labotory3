import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Database, Trash2, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../../contexts/AuthContext";

interface RawResult {
  id: string;
  testOrderId: string;
  barcode: string;
  timestamp: string;
  size: string;
  backedUp: boolean;
  syncedToMonitoring: boolean;
}

interface AutoDeleteJob {
  jobId: string;
  startTime: string;
  deletedCount: number;
  completedTime: string;
  status: "Completed" | "Running" | "Failed";
}

const mockRawResults: RawResult[] = [
  { id: "RAW-001", testOrderId: "TO-2024-001", barcode: "BC-12345", timestamp: "2024-10-10 14:30:00", size: "2.4 MB", backedUp: true, syncedToMonitoring: true },
  { id: "RAW-002", testOrderId: "TO-2024-002", barcode: "BC-12346", timestamp: "2024-10-11 10:20:00", size: "2.1 MB", backedUp: true, syncedToMonitoring: true },
  { id: "RAW-003", testOrderId: "TO-2024-003", barcode: "BC-12347", timestamp: "2024-10-14 15:45:00", size: "2.8 MB", backedUp: false, syncedToMonitoring: false },
  { id: "RAW-004", testOrderId: "TO-2024-004", barcode: "BC-12348", timestamp: "2024-10-15 09:15:00", size: "2.3 MB", backedUp: true, syncedToMonitoring: true },
];

const mockAutoDeleteJobs: AutoDeleteJob[] = [
  { jobId: "JOB-001", startTime: "2024-10-10 02:00:00", deletedCount: 15, completedTime: "2024-10-10 02:05:30", status: "Completed" },
  { jobId: "JOB-002", startTime: "2024-10-13 02:00:00", deletedCount: 12, completedTime: "2024-10-13 02:04:15", status: "Completed" },
  { jobId: "JOB-003", startTime: "2024-10-16 02:00:00", deletedCount: 0, completedTime: "2024-10-16 02:00:45", status: "Completed" },
];

export function RawResultsManagement() {
  const { user } = useAuth();
  const [rawResults, setRawResults] = useState<RawResult[]>(mockRawResults);
  const [autoDeleteJobs] = useState<AutoDeleteJob[]>(mockAutoDeleteJobs);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<RawResult | null>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success">("idle");

  const handleDeleteClick = (result: RawResult) => {
    if (!result.backedUp || !result.syncedToMonitoring) {
      toast.error("Cannot delete raw results", {
        description: "Results must be successfully backed up in Monitoring Service before deletion.",
      });
      return;
    }

    setSelectedResult(result);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedResult) return;

    setRawResults(rawResults.filter((r) => r.id !== selectedResult.id));

    // Log deletion event
    console.log("RAW RESULT DELETED:", {
      resultId: selectedResult.id,
      testOrderId: selectedResult.testOrderId,
      barcode: selectedResult.barcode,
      userId: user?.id,
      userEmail: user?.email,
      timestamp: new Date().toISOString(),
      backupConfirmed: true,
    });

    toast.success("Raw results deleted successfully", {
      description: `Test Order: ${selectedResult.testOrderId}`,
    });

    setIsDeleteDialogOpen(false);
    setSelectedResult(null);
  };

  const handleSyncUp = () => {
    setSyncStatus("syncing");

    setTimeout(() => {
      // Update sync status for non-synced results
      setRawResults(
        rawResults.map((result) =>
          !result.syncedToMonitoring
            ? { ...result, syncedToMonitoring: true, backedUp: true }
            : result
        )
      );

      setSyncStatus("success");
      toast.success("Sync-up completed successfully", {
        description: `${rawResults.filter(r => !r.syncedToMonitoring).length} results synced to Monitoring Service`,
      });

      setTimeout(() => setSyncStatus("idle"), 2000);
    }, 2000);
  };

  const backedUpCount = rawResults.filter(r => r.backedUp).length;
  const notBackedUpCount = rawResults.filter(r => !r.backedUp).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Raw Results</p>
                <p className="text-2xl text-slate-800">{rawResults.length}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Backed Up</p>
                <p className="text-2xl text-green-600">{backedUpCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Not Backed Up</p>
                <p className="text-2xl text-red-600">{notBackedUpCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Delete Raw Results */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-800">Raw Test Results</CardTitle>
              <CardDescription className="text-slate-600">
                Manage raw test results stored on instrument memory
              </CardDescription>
            </div>
            <Button
              onClick={handleSyncUp}
              disabled={syncStatus === "syncing"}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {syncStatus === "syncing" ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync to Monitoring
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead>Result ID</TableHead>
                  <TableHead>Test Order ID</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Backup Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rawResults.map((result) => (
                  <TableRow key={result.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{result.id}</TableCell>
                    <TableCell>{result.testOrderId}</TableCell>
                    <TableCell className="text-slate-600">{result.barcode}</TableCell>
                    <TableCell className="text-slate-600">{result.timestamp}</TableCell>
                    <TableCell className="text-slate-600">{result.size}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          result.backedUp
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {result.backedUp ? "Backed Up" : "Not Backed Up"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClick(result)}
                        disabled={!result.backedUp}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> Raw results can only be deleted after successful backup to Monitoring Service. This prevents irreversible data loss.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto Delete Maintenance Logs */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
          <CardTitle className="text-slate-800">Auto Maintenance Logs</CardTitle>
          <CardDescription className="text-slate-600">
            Background cleanup process for automatic deletion of old raw results
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead>Job ID</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Deleted Count</TableHead>
                  <TableHead>Completed Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {autoDeleteJobs.map((job) => (
                  <TableRow key={job.jobId} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{job.jobId}</TableCell>
                    <TableCell className="text-slate-600">{job.startTime}</TableCell>
                    <TableCell className="text-slate-800">{job.deletedCount}</TableCell>
                    <TableCell className="text-slate-600">{job.completedTime}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        {job.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-slate-800">Delete Raw Test Results</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to permanently delete these raw test results?
              <br /><br />
              <strong>Details:</strong>
              <ul className="mt-2 space-y-1">
                <li>• Test Order ID: {selectedResult?.testOrderId}</li>
                <li>• Barcode: {selectedResult?.barcode}</li>
                <li>• Timestamp: {selectedResult?.timestamp}</li>
                <li>• Backup Confirmed: ✅ Yes</li>
              </ul>
              <br />
              <strong className="text-red-600">This action cannot be undone.</strong> The deletion will be logged for audit purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-slate-100">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Results
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
