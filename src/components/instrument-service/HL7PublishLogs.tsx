import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface HL7Log {
  id: string;
  testOrderId: string;
  barcode: string;
  status: "Sent" | "Failed" | "Pending";
  destination: string;
  timestamp: string;
  retryCount: number;
  message: string;
}

const mockHL7Logs: HL7Log[] = [
  {
    id: "HL7-001",
    testOrderId: "TO-2024-001",
    barcode: "BC-12345",
    status: "Sent",
    destination: "Test Order Service, Monitoring Service",
    timestamp: "2024-10-15 14:30:25",
    retryCount: 0,
    message: "Successfully published to both services",
  },
  {
    id: "HL7-002",
    testOrderId: "TO-2024-002",
    barcode: "BC-12346",
    status: "Sent",
    destination: "Test Order Service, Monitoring Service",
    timestamp: "2024-10-15 14:28:15",
    retryCount: 0,
    message: "Successfully published to both services",
  },
  {
    id: "HL7-003",
    testOrderId: "TO-2024-003",
    barcode: "BC-12347",
    status: "Failed",
    destination: "Test Order Service, Monitoring Service",
    timestamp: "2024-10-15 14:25:40",
    retryCount: 2,
    message: "Connection timeout to Test Order Service",
  },
  {
    id: "HL7-004",
    testOrderId: "TO-AUTO-12348",
    barcode: "BC-12348",
    status: "Pending",
    destination: "Monitoring Service",
    timestamp: "2024-10-15 14:20:00",
    retryCount: 0,
    message: "Awaiting Test Order Service restoration",
  },
];

export function HL7PublishLogs() {
  const [logs, setLogs] = useState<HL7Log[]>(mockHL7Logs);

  const handleRetry = (logId: string) => {
    setLogs(
      logs.map((log) =>
        log.id === logId
          ? {
              ...log,
              status: "Sent" as const,
              retryCount: log.retryCount + 1,
              message: "Successfully published after retry",
              timestamp: new Date().toISOString(),
            }
          : log
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Sent":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-green-100 text-green-800 border-green-200";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const sentCount = logs.filter(l => l.status === "Sent").length;
  const failedCount = logs.filter(l => l.status === "Failed").length;
  const pendingCount = logs.filter(l => l.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Messages</p>
                <p className="text-2xl text-slate-800">{logs.length}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Sent</p>
                <p className="text-2xl text-green-600">{sentCount}</p>
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

      {/* HL7 Publish Logs */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
          <CardTitle className="text-slate-800">HL7 Publish Logs</CardTitle>
          <CardDescription className="text-slate-600">
            Read-only log view of HL7 message publishing status and history
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead>HL7 ID</TableHead>
                  <TableHead>Test Order ID</TableHead>
                  <TableHead>Barcode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Retry Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{log.id}</TableCell>
                    <TableCell>{log.testOrderId}</TableCell>
                    <TableCell className="text-slate-600">{log.barcode}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <Badge variant="outline" className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">{log.destination}</TableCell>
                    <TableCell className="text-slate-600">{log.timestamp}</TableCell>
                    <TableCell>
                      <span className={log.retryCount > 0 ? "text-yellow-600" : "text-slate-600"}>
                        {log.retryCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {log.status === "Failed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRetry(log.id)}
                          className="text-blue-600 border-blue-300"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Retry
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            {logs.map((log) => (
              <div key={log.id} className="mb-2 p-3 bg-slate-50 rounded border border-slate-200">
                <div className="flex items-start gap-2">
                  {log.status === "Failed" ? (
                    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm text-slate-700">
                      <strong>{log.id}:</strong> {log.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>HL7 Publishing Process:</strong> When blood testing completes, raw results are converted to HL7 messages and published to Test Order Service (for matching with test orders) and Monitoring Service (for backup storage). Results are marked as "Sent" or "Failed" accordingly.
        </p>
      </div>
    </div>
  );
}
