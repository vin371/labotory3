import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Activity, RefreshCw, CheckCircle, AlertTriangle, XCircle, Clock, ShieldAlert } from "lucide-react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission } from "../types/auth";
import { AccessDenied } from "./AccessDenied";

interface BrokerHealth {
  id: string;
  name: string;
  status: "Active" | "Unresponsive" | "Recovering";
  retryAttempts: number;
  lastChecked: string;
  errorCode?: string;
  uptimePercentage: number;
  responseTime: number;
}

const mockBrokers: BrokerHealth[] = [
  {
    id: "broker-1",
    name: "Primary Message Broker",
    status: "Active",
    retryAttempts: 0,
    lastChecked: "2024-10-15 14:35:20",
    uptimePercentage: 99.8,
    responseTime: 45,
  },
  {
    id: "broker-2",
    name: "Secondary Message Broker",
    status: "Active",
    retryAttempts: 0,
    lastChecked: "2024-10-15 14:35:18",
    uptimePercentage: 99.5,
    responseTime: 52,
  },
  {
    id: "broker-3",
    name: "Backup Message Broker",
    status: "Recovering",
    retryAttempts: 2,
    lastChecked: "2024-10-15 14:34:55",
    errorCode: "ERR_CONNECTION_TIMEOUT",
    uptimePercentage: 95.2,
    responseTime: 0,
  },
];

interface HealthCheckLog {
  id: string;
  brokerId: string;
  timestamp: string;
  status: "Success" | "Failed";
  message: string;
}

const mockLogs: HealthCheckLog[] = [
  { id: "log-1", brokerId: "broker-3", timestamp: "2024-10-15 14:34:55", status: "Failed", message: "Connection timeout after 3 attempts" },
  { id: "log-2", brokerId: "broker-1", timestamp: "2024-10-15 14:30:20", status: "Success", message: "Health check passed" },
  { id: "log-3", brokerId: "broker-2", timestamp: "2024-10-15 14:30:18", status: "Success", message: "Health check passed" },
  { id: "log-4", brokerId: "broker-3", timestamp: "2024-10-15 14:29:30", status: "Failed", message: "Service unreachable" },
];

export function HealthCheckDashboard() {
  const { user } = useAuth();
  const [brokers, setBrokers] = useState<BrokerHealth[]>(mockBrokers);
  const [logs, setLogs] = useState<HealthCheckLog[]>(mockLogs);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Check access permission - ONLY Manager and Service User (NOT Lab User)
  const canAccess = user && hasPermission(user.role, "VIEW_HEALTH_CHECK");

  if (!canAccess) {
    return <AccessDenied />;
  }

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simulate auto-refresh
      setLastRefresh(new Date());
      console.log("Auto-refreshing health check data...");
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleManualRefresh = () => {
    setLastRefresh(new Date());
    // Simulate refresh logic
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Recovering":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "Unresponsive":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Activity className="h-5 w-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Recovering":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Unresponsive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUptimeColor = (percentage: number) => {
    if (percentage >= 99) return "text-green-600";
    if (percentage >= 95) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Access Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Health Check Access:</strong> This feature is only available to Manager and Service User roles.
            </p>
          </div>
        </div>
      </div>

      {/* Header Card */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-slate-800">Health Check Dashboard</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <Label htmlFor="auto-refresh" className="text-sm text-slate-600">
                  Auto-refresh (60s)
                </Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
          <CardDescription className="text-slate-600">
            Real-time monitoring of message broker health • Last updated: {lastRefresh.toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Broker Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {brokers.map((broker) => (
          <Card key={broker.id} className="shadow-lg border-slate-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(broker.status)}
                  <CardTitle className="text-slate-800 text-base">{broker.name}</CardTitle>
                </div>
                <Badge variant="outline" className={getStatusColor(broker.status)}>
                  {broker.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Uptime */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-slate-500 text-sm">Uptime (30 days)</Label>
                  <span className={`${getUptimeColor(broker.uptimePercentage)}`}>
                    {broker.uptimePercentage}%
                  </span>
                </div>
                <Progress value={broker.uptimePercentage} className="h-2" />
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <p className="text-xs text-slate-500">Retry Attempts</p>
                  <p className="text-slate-800">{broker.retryAttempts}</p>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <p className="text-xs text-slate-500">Response Time</p>
                  <p className="text-slate-800">{broker.responseTime > 0 ? `${broker.responseTime}ms` : "N/A"}</p>
                </div>
              </div>

              {/* Last Checked */}
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>Last checked: {broker.lastChecked}</span>
              </div>

              {/* Error Code */}
              {broker.errorCode && (
                <div className="p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-xs text-red-600">Error: {broker.errorCode}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health Check Event Logs */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
          <CardTitle className="text-slate-800">Recent Health Check Events</CardTitle>
          <CardDescription className="text-slate-600">
            Failed and recent health check attempts
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-lg border ${
                  log.status === "Failed"
                    ? "bg-red-50 border-red-200"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {log.status === "Failed" ? (
                        <XCircle className="h-4 w-4 text-red-600" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      <span className={`${log.status === "Failed" ? "text-red-800" : "text-green-800"}`}>
                        {brokers.find(b => b.id === log.brokerId)?.name}
                      </span>
                    </div>
                    <p className={`text-sm ${log.status === "Failed" ? "text-red-700" : "text-green-700"}`}>
                      {log.message}
                    </p>
                  </div>
                  <span className="text-xs text-slate-500">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
