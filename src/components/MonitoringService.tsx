import { useState, useEffect } from "react";
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
import { 
  Search, 
  Filter,
  Download,
  RefreshCw,
  FileText,
  Database,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  PlayCircle,
  Server,
  HardDrive,
  Zap,
  Shield,
  Eye,
  Copy,
  ArrowUpDown,
  TrendingUp,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";

type SubTab = "event-logs" | "backup-sync" | "health-check";

interface EventLog {
  id: string;
  action: string;
  eventMessage: string;
  operator: string;
  timestamp: string;
  sourceService: "TestOrder" | "Instrument" | "Warehouse" | "Monitoring" | "System";
  eventId: string;
  jsonPayload?: Record<string, unknown>;
}

interface BackupRecord {
  id: string;
  testOrderId: string;
  resultId: string;
  backupTimestamp: string;
  status: "Backed Up" | "Pending Sync" | "Error";
  dataSize: string;
  sourceService: string;
}

interface SyncRecord {
  id: string;
  testOrderId: string;
  syncStatus: "In Progress" | "Success" | "Failed";
  timestamp: string;
  notes: string;
}

interface BrokerHealth {
  id: string;
  brokerName: string;
  status: "Active" | "Down" | "Retrying";
  lastChecked: string;
  retryAttempts: number;
  errorCode?: string;
  errorMessage?: string;
}

interface HealthCheckLog {
  id: string;
  checkId: string;
  brokerName: string;
  status: "Active" | "Down" | "Retrying";
  timestamp: string;
  duration: string;
  errorMessage?: string;
}

// Mock Data
const mockEventLogs: EventLog[] = [
  {
    id: "EVT-001",
    action: "USER_LOGIN",
    eventMessage: "User admin@lab.com successfully logged into the system",
    operator: "admin@lab.com",
    timestamp: "2025-10-17 09:15:23",
    sourceService: "System",
    eventId: "SYS-20251017-001",
    jsonPayload: { userId: "USR-001", ipAddress: "192.168.1.100", userAgent: "Chrome/118.0" }
  },
  {
    id: "EVT-002",
    action: "TEST_ORDER_CREATED",
    eventMessage: "New test order TO-2025-1234 created for patient PAT-001",
    operator: "labuser01@lab.com",
    timestamp: "2025-10-17 10:30:45",
    sourceService: "TestOrder",
    eventId: "TO-20251017-002",
    jsonPayload: { orderId: "TO-2025-1234", patientId: "PAT-001", tests: ["CBC", "Glucose"] }
  },
  {
    id: "EVT-003",
    action: "INSTRUMENT_STATUS_CHANGED",
    eventMessage: "Instrument HA-2500 status changed from Ready to Processing",
    operator: "system",
    timestamp: "2025-10-17 11:00:12",
    sourceService: "Instrument",
    eventId: "INST-20251017-003",
    jsonPayload: { instrumentId: "INST-001", oldStatus: "Ready", newStatus: "Processing" }
  },
  {
    id: "EVT-004",
    action: "REAGENT_INSTALLED",
    eventMessage: "CBC Reagent Kit installed on instrument HA-2500",
    operator: "labuser02@lab.com",
    timestamp: "2025-10-17 11:45:30",
    sourceService: "Warehouse",
    eventId: "WH-20251017-004",
    jsonPayload: { reagentName: "CBC Reagent Kit", instrumentId: "INST-001", lotNumber: "LOT-2024-Q3-001" }
  },
  {
    id: "EVT-005",
    action: "HEALTH_CHECK_FAILED",
    eventMessage: "Message broker RabbitMQ-Main health check failed - connection timeout",
    operator: "system",
    timestamp: "2025-10-17 12:30:00",
    sourceService: "Monitoring",
    eventId: "MON-20251017-005",
    jsonPayload: { brokerName: "RabbitMQ-Main", errorCode: "CONN_TIMEOUT", retryAttempt: 3 }
  }
];

const mockBackupRecords: BackupRecord[] = [
  {
    id: "BKP-001",
    testOrderId: "TO-2025-1234",
    resultId: "RES-2025-0567",
    backupTimestamp: "2025-10-17 10:45:00",
    status: "Backed Up",
    dataSize: "2.3 MB",
    sourceService: "Instrument Service"
  },
  {
    id: "BKP-002",
    testOrderId: "TO-2025-1235",
    resultId: "RES-2025-0568",
    backupTimestamp: "2025-10-17 11:15:00",
    status: "Pending Sync",
    dataSize: "1.8 MB",
    sourceService: "Instrument Service"
  },
  {
    id: "BKP-003",
    testOrderId: "TO-2025-1236",
    resultId: "RES-2025-0569",
    backupTimestamp: "2025-10-17 12:00:00",
    status: "Error",
    dataSize: "3.1 MB",
    sourceService: "Instrument Service"
  }
];

const mockSyncRecords: SyncRecord[] = [
  {
    id: "SYNC-001",
    testOrderId: "TO-2025-1234",
    syncStatus: "Success",
    timestamp: "2025-10-17 10:50:00",
    notes: "Successfully synchronized test results to Test Order Service"
  },
  {
    id: "SYNC-002",
    testOrderId: "TO-2025-1235",
    syncStatus: "In Progress",
    timestamp: "2025-10-17 11:20:00",
    notes: "Syncing data from Instrument Service..."
  },
  {
    id: "SYNC-003",
    testOrderId: "TO-2025-1236",
    syncStatus: "Failed",
    timestamp: "2025-10-17 12:05:00",
    notes: "Connection timeout - retry scheduled"
  }
];

const mockBrokerHealth: BrokerHealth[] = [
  {
    id: "BRK-001",
    brokerName: "RabbitMQ-Main",
    status: "Active",
    lastChecked: "2025-10-17 14:30:00",
    retryAttempts: 0
  },
  {
    id: "BRK-002",
    brokerName: "RabbitMQ-Backup",
    status: "Active",
    lastChecked: "2025-10-17 14:30:00",
    retryAttempts: 0
  },
  {
    id: "BRK-003",
    brokerName: "Kafka-Stream",
    status: "Retrying",
    lastChecked: "2025-10-17 14:29:45",
    retryAttempts: 2,
    errorCode: "CONN_RETRY",
    errorMessage: "Intermittent connection issue"
  }
];

const mockHealthLogs: HealthCheckLog[] = [
  {
    id: "HC-001",
    checkId: "CHK-20251017-001",
    brokerName: "RabbitMQ-Main",
    status: "Active",
    timestamp: "2025-10-17 14:30:00",
    duration: "125ms"
  },
  {
    id: "HC-002",
    checkId: "CHK-20251017-002",
    brokerName: "RabbitMQ-Backup",
    status: "Active",
    timestamp: "2025-10-17 14:30:00",
    duration: "98ms"
  },
  {
    id: "HC-003",
    checkId: "CHK-20251017-003",
    brokerName: "Kafka-Stream",
    status: "Retrying",
    timestamp: "2025-10-17 14:29:45",
    duration: "5000ms",
    errorMessage: "Connection timeout - retrying..."
  }
];

export function MonitoringService() {
  const { user: currentUser } = useAuth();
  const [currentSubTab, setCurrentSubTab] = useState<SubTab>("event-logs");
  
  // Event Logs State
  const [eventLogs, setEventLogs] = useState<EventLog[]>(mockEventLogs);
  const [searchEventLog, setSearchEventLog] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [selectedEventLog, setSelectedEventLog] = useState<EventLog | null>(null);
  const [isEventLogDetailOpen, setIsEventLogDetailOpen] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  
  // Backup & Sync State
  const [backupRecords, setBackupRecords] = useState<BackupRecord[]>(mockBackupRecords);
  const [syncRecords, setSyncRecords] = useState<SyncRecord[]>(mockSyncRecords);
  const [searchBackup, setSearchBackup] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  
  // Health Check State
  const [brokerHealth, setBrokerHealth] = useState<BrokerHealth[]>(mockBrokerHealth);
  const [healthLogs, setHealthLogs] = useState<HealthCheckLog[]>(mockHealthLogs);
  const [isHealthCheckRunning, setIsHealthCheckRunning] = useState(false);
  const [searchHealth, setSearchHealth] = useState("");

  // Statistics
  const eventLogStats = {
    totalToday: eventLogs.filter(log => log.timestamp.startsWith("2025-10-17")).length,
    lastEventTime: eventLogs.length > 0 ? eventLogs[0].timestamp : "N/A",
    loggingStatus: "Active"
  };

  const backupStats = {
    totalToday: backupRecords.filter(b => b.backupTimestamp.startsWith("2025-10-17")).length,
    lastBackupTime: backupRecords.length > 0 ? backupRecords[0].backupTimestamp : "N/A",
    backupStatus: "Active",
    autoSyncEnabled: true
  };

  const syncStats = {
    pendingSync: syncRecords.filter(s => s.syncStatus === "In Progress").length,
    completedSync: syncRecords.filter(s => s.syncStatus === "Success").length,
    failedSync: syncRecords.filter(s => s.syncStatus === "Failed").length
  };

  // Auto Refresh Event Logs every 30 seconds
  useEffect(() => {
    if (!autoRefreshEnabled) return;

    const interval = setInterval(() => {
      console.log("[AUTO_REFRESH] Refreshing event logs...");
      // In production, this would fetch new logs from API
      toast.info("Event logs refreshed", { duration: 2000 });
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled]);

  // Auto Health Check every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("[AUTO_HEALTH_CHECK] Running automatic health check...");
      handleAutoHealthCheck();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleAutoHealthCheck = () => {
    // Simulate random status changes
    setBrokerHealth(prevHealth => 
      prevHealth.map(broker => {
        const random = Math.random();
        if (random < 0.1 && broker.status === "Active") {
          // 10% chance to go to Retrying
          return {
            ...broker,
            status: "Retrying" as "Active" | "Down" | "Retrying",
            retryAttempts: 1,
            lastChecked: new Date().toISOString().replace('T', ' ').substring(0, 19),
            errorMessage: "Intermittent connection issue"
          };
        } else if (broker.status === "Retrying" && random > 0.5) {
          // 50% chance to recover
          return {
            ...broker,
            status: "Active" as "Active" | "Down" | "Retrying",
            retryAttempts: 0,
            lastChecked: new Date().toISOString().replace('T', ' ').substring(0, 19),
            errorMessage: undefined
          };
        }
        return {
          ...broker,
          lastChecked: new Date().toISOString().replace('T', ' ').substring(0, 19)
        };
      })
    );
  };

  const handleViewEventLogDetail = (log: EventLog) => {
    setSelectedEventLog(log);
    setIsEventLogDetailOpen(true);
  };

  const handleCopyEventData = () => {
    if (selectedEventLog) {
      const data = JSON.stringify(selectedEventLog, null, 2);
      navigator.clipboard.writeText(data);
      toast.success("Event data copied to clipboard!");
    }
  };

  const handleExportEventLogs = () => {
    toast.success("📊 Exporting event logs...", {
      description: `${filteredEventLogs.length} logs will be exported to CSV.`
    });

    setTimeout(() => {
      toast.success("✅ CSV file ready: Event_Logs_Export.csv");
      console.log(`[EXPORT_EVENT_LOGS] Records: ${filteredEventLogs.length}`);
    }, 1500);
  };

  const handleExportBackupRecords = () => {
    toast.success("📊 Exporting backup records...");
    setTimeout(() => {
      toast.success("✅ Export complete: Backup_Records.csv");
    }, 1000);
  };

  const handleForceSyncNow = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    toast.info("🔄 Starting force sync...", {
      description: "Synchronizing test results across services"
    });

    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          
          // Update sync records
          setSyncRecords(prev => 
            prev.map(rec => 
              rec.syncStatus === "In Progress" || rec.syncStatus === "Failed" 
                ? { ...rec, syncStatus: "Success" as "In Progress" | "Success" | "Failed", notes: "Force sync completed successfully" }
                : rec
            )
          );

          // Update backup records
          setBackupRecords(prev =>
            prev.map(rec =>
              rec.status === "Pending Sync" || rec.status === "Error"
                ? { ...rec, status: "Backed Up" as "Backed Up" | "Pending Sync" | "Error" }
                : rec
            )
          );

          toast.success("✅ Sync completed successfully!", {
            description: "All pending records have been synchronized."
          });

          console.log(`[FORCE_SYNC] Completed, By: ${currentUser?.email}`);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleManualHealthCheck = () => {
    setIsHealthCheckRunning(true);
    
    toast.info("🔍 Running manual health check...", {
      description: "Checking all message brokers..."
    });

    setTimeout(() => {
      handleAutoHealthCheck();
      
      const newLog: HealthCheckLog = {
        id: `HC-${String(healthLogs.length + 1).padStart(3, "0")}`,
        checkId: `CHK-${new Date().toISOString().split('T')[0].replace(/-/g, '')}-${String(healthLogs.length + 1).padStart(3, "0")}`,
        brokerName: "All Brokers",
        status: "Active",
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        duration: "342ms"
      };

      setHealthLogs([newLog, ...healthLogs]);
      setIsHealthCheckRunning(false);

      toast.success("✅ Health check completed", {
        description: "All brokers have been checked."
      });

      console.log(`[MANUAL_HEALTH_CHECK] By: ${currentUser?.email}`);
    }, 2000);
  };

  // Filter Event Logs
  const filteredEventLogs = eventLogs.filter(log => {
    const matchesSearch = 
      log.eventMessage.toLowerCase().includes(searchEventLog.toLowerCase()) ||
      log.operator.toLowerCase().includes(searchEventLog.toLowerCase()) ||
      log.action.toLowerCase().includes(searchEventLog.toLowerCase());
    
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesService = filterService === "all" || log.sourceService === filterService;
    
    return matchesSearch && matchesAction && matchesService;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Backed Up":
      case "Success":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending Sync":
      case "In Progress":
      case "Retrying":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Error":
      case "Failed":
      case "Down":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
      case "Backed Up":
      case "Success":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Pending Sync":
      case "In Progress":
      case "Retrying":
        return <Clock className="h-4 w-4" />;
      case "Error":
      case "Failed":
      case "Down":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Render Event Logs Tab
  const renderEventLogs = () => (
    <div className="space-y-6">
      {/* Auto Logging Status Banner */}
      <Card className="shadow-md border-[#A5D6A7] bg-gradient-to-r from-[#E8F5E9] to-white rounded-xl">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-green-800 mb-1 flex items-center gap-2">
                  Auto Logging Active ✅
                </h3>
                <p className="text-sm text-green-700 mb-3">
                  All new event messages are automatically logged for traceability.
                </p>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-green-600">Total Events Today</p>
                    <p className="text-xl font-semibold text-green-800">{eventLogStats.totalToday}</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-600">Last Event Captured</p>
                    <p className="text-sm font-medium text-green-800">{eventLogStats.lastEventTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-green-600">Logging Status</p>
                    <Badge className="bg-green-600 text-white mt-1">{eventLogStats.loggingStatus}</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-green-700">Auto Refresh (30s)</Label>
              <input
                type="checkbox"
                checked={autoRefreshEnabled}
                onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                className="w-4 h-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Event Logs Table */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1976D2] flex items-center gap-2">
                <FileText className="h-5 w-5" />
                System Event Logs
              </CardTitle>
              <CardDescription className="text-[#555555]">
                View all events captured across the system
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-[#1976D2] text-[#1976D2] rounded-xl"
                onClick={handleExportEventLogs}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
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
                placeholder="Search by message, operator, or action..."
                value={searchEventLog}
                onChange={(e) => setSearchEventLog(e.target.value)}
                className="pl-10 bg-white border-[#BBDEFB] rounded-xl"
              />
            </div>

            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="bg-white rounded-xl border-[#BBDEFB]">
                <Filter className="h-4 w-4 mr-2 text-[#1976D2]" />
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="USER_LOGIN">User Login</SelectItem>
                <SelectItem value="TEST_ORDER_CREATED">Test Order Created</SelectItem>
                <SelectItem value="INSTRUMENT_STATUS_CHANGED">Instrument Status Changed</SelectItem>
                <SelectItem value="REAGENT_INSTALLED">Reagent Installed</SelectItem>
                <SelectItem value="HEALTH_CHECK_FAILED">Health Check Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger className="bg-white rounded-xl border-[#BBDEFB]">
                <Server className="h-4 w-4 mr-2 text-[#1976D2]" />
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="System">System</SelectItem>
                <SelectItem value="TestOrder">Test Order</SelectItem>
                <SelectItem value="Instrument">Instrument</SelectItem>
                <SelectItem value="Warehouse">Warehouse</SelectItem>
                <SelectItem value="Monitoring">Monitoring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Event Logs Table */}
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            {filteredEventLogs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
                <p className="text-[#666666]">No Data</p>
                <p className="text-sm text-[#999999] mt-2">No event logs match your filters</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#1976D2]">Action</TableHead>
                    <TableHead className="text-[#1976D2]">Event Log Message</TableHead>
                    <TableHead className="text-[#1976D2]">Operator</TableHead>
                    <TableHead className="text-[#1976D2]">Timestamp</TableHead>
                    <TableHead className="text-[#1976D2]">Source Service</TableHead>
                    <TableHead className="text-[#1976D2] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEventLogs.map((log) => (
                    <TableRow 
                      key={log.id} 
                      className="hover:bg-[#F5F5F5] cursor-pointer"
                      onClick={() => handleViewEventLogDetail(log)}
                    >
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 rounded-full">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#333333] max-w-md truncate">{log.eventMessage}</TableCell>
                      <TableCell className="text-[#666666]">{log.operator}</TableCell>
                      <TableCell className="text-[#666666]">{log.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 rounded-full">
                          {log.sourceService}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewEventLogDetail(log);
                          }}
                          className="text-[#1976D2] hover:text-[#1565C0] hover:bg-[#E3F2FD]"
                        >
                          <Eye className="h-4 w-4" />
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

      {/* Event Log Detail Dialog */}
      <Dialog open={isEventLogDetailOpen} onOpenChange={setIsEventLogDetailOpen}>
        <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1976D2]">Event Log Detail</DialogTitle>
            <DialogDescription>Complete information about this event</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            {selectedEventLog && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666]">Event ID</Label>
                    <p className="text-[#333333] mt-1 font-semibold">{selectedEventLog.eventId}</p>
                  </div>
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666]">Action</Label>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 mt-1">
                      {selectedEventLog.action}
                    </Badge>
                  </div>
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666]">Operator</Label>
                    <p className="text-[#333333] mt-1">{selectedEventLog.operator}</p>
                  </div>
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666]">Timestamp</Label>
                    <p className="text-[#333333] mt-1">{selectedEventLog.timestamp}</p>
                  </div>
                  <div className="p-3 bg-[#F5F5F5] rounded-lg col-span-2">
                    <Label className="text-sm text-[#666666]">Source Service / Module</Label>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 mt-1">
                      {selectedEventLog.sourceService}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="p-3 bg-[#F5F5F5] rounded-lg">
                  <Label className="text-sm text-[#666666] mb-2 block">Event Message Content</Label>
                  <p className="text-[#333333]">{selectedEventLog.eventMessage}</p>
                </div>

                {selectedEventLog.jsonPayload && (
                  <div className="p-3 bg-[#F5F5F5] rounded-lg">
                    <Label className="text-sm text-[#666666] mb-2 block">JSON Payload</Label>
                    <ScrollArea className="h-48">
                      <pre className="text-xs text-[#333333] font-mono bg-white p-3 rounded border border-[#BBDEFB]">
                        {JSON.stringify(selectedEventLog.jsonPayload, null, 2)}
                      </pre>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventLogDetailOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-[#1976D2] hover:bg-[#1565C0]"
              onClick={handleCopyEventData}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  // Render Backup & Sync Tab
  const renderBackupSync = () => (
    <div className="space-y-6">
      {/* Backup Status Info Card */}
      <Card className="shadow-md border-[#90CAF9] bg-gradient-to-r from-[#E3F2FD] to-white rounded-xl">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Database className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-blue-800 mb-1 flex items-center gap-2">
                Backup Status: Active ✅
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Automatic system backup when new test result messages are published.
              </p>
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-blue-600">Total Backups Today</p>
                  <p className="text-xl font-semibold text-blue-800">{backupStats.totalToday}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Last Backup Timestamp</p>
                  <p className="text-sm font-medium text-blue-800">{backupStats.lastBackupTime}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Backup Status</p>
                  <Badge className="bg-blue-600 text-white mt-1">{backupStats.backupStatus}</Badge>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Auto Sync</p>
                  <Badge className="bg-green-600 text-white mt-1">
                    {backupStats.autoSyncEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Records Table */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1976D2] flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Backup Records
              </CardTitle>
              <CardDescription className="text-[#555555]">
                All raw test results backup records
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-[#1976D2] text-[#1976D2] rounded-xl"
                onClick={handleExportBackupRecords}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
            <Input
              type="text"
              placeholder="Search by Test Order ID or Result ID..."
              value={searchBackup}
              onChange={(e) => setSearchBackup(e.target.value)}
              className="pl-10 bg-white border-[#BBDEFB] rounded-xl"
            />
          </div>

          {/* Backup Records Table */}
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            {backupRecords.length === 0 ? (
              <div className="text-center py-12">
                <Database className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
                <p className="text-[#666666]">No Backup Data Available</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#1976D2]">Test Order ID</TableHead>
                    <TableHead className="text-[#1976D2]">Result ID</TableHead>
                    <TableHead className="text-[#1976D2]">Backup Timestamp</TableHead>
                    <TableHead className="text-[#1976D2]">Status</TableHead>
                    <TableHead className="text-[#1976D2]">Data Size</TableHead>
                    <TableHead className="text-[#1976D2]">Source Service</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupRecords
                    .filter(rec => 
                      searchBackup === "" ||
                      rec.testOrderId.toLowerCase().includes(searchBackup.toLowerCase()) ||
                      rec.resultId.toLowerCase().includes(searchBackup.toLowerCase())
                    )
                    .map((record) => (
                      <TableRow key={record.id} className="hover:bg-[#F5F5F5]">
                        <TableCell className="font-medium text-[#333333]">{record.testOrderId}</TableCell>
                        <TableCell className="text-[#666666]">{record.resultId}</TableCell>
                        <TableCell className="text-[#666666]">{record.backupTimestamp}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getStatusColor(record.status)} rounded-full flex items-center gap-1 w-fit`}>
                            {getStatusIcon(record.status)}
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#666666]">{record.dataSize}</TableCell>
                        <TableCell className="text-[#666666]">{record.sourceService}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sync-up Management */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1976D2] flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Sync-up Management
          </CardTitle>
          <CardDescription className="text-[#555555]">
            Synchronize test result data across services
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Sync Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="shadow-md border-[#FFE082] bg-gradient-to-br from-[#FFF8E1] to-white rounded-xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#555555] mb-1">Pending Sync Orders</p>
                    <p className="text-3xl font-semibold text-[#F57C00]">{syncStats.pendingSync}</p>
                  </div>
                  <Clock className="h-8 w-8 text-[#F57C00] opacity-70" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-[#A5D6A7] bg-gradient-to-br from-[#E8F5E9] to-white rounded-xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#555555] mb-1">Completed Syncs</p>
                    <p className="text-3xl font-semibold text-[#388E3C]">{syncStats.completedSync}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-[#388E3C] opacity-70" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-[#EF9A9A] bg-gradient-to-br from-[#FFEBEE] to-white rounded-xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#555555] mb-1">Failed Sync Attempts</p>
                    <p className="text-3xl font-semibold text-[#D32F2F]">{syncStats.failedSync}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-[#D32F2F] opacity-70" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Force Sync Button */}
          <div className="flex items-center justify-between mb-6 p-4 bg-[#E3F2FD] rounded-lg border border-[#90CAF9]">
            <div>
              <p className="font-medium text-[#1976D2]">Force Synchronization</p>
              <p className="text-sm text-[#555555]">Manually trigger sync for all pending test results</p>
            </div>
            <Button
              onClick={handleForceSyncNow}
              disabled={isSyncing}
              className="bg-[#1976D2] hover:bg-[#1565C0] rounded-xl"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Force Sync Now
                </>
              )}
            </Button>
          </div>

          {/* Sync Progress */}
          {isSyncing && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-blue-800 font-medium">Synchronization in progress...</p>
                <p className="text-sm text-blue-600">{syncProgress}%</p>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}

          {/* Sync Log Table */}
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1976D2]">Sync ID</TableHead>
                  <TableHead className="text-[#1976D2]">Test Order ID</TableHead>
                  <TableHead className="text-[#1976D2]">Sync Status</TableHead>
                  <TableHead className="text-[#1976D2]">Timestamp</TableHead>
                  <TableHead className="text-[#1976D2]">Notes / Error Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syncRecords.map((sync) => (
                  <TableRow key={sync.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">{sync.id}</TableCell>
                    <TableCell className="text-[#666666]">{sync.testOrderId}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(sync.syncStatus)} rounded-full flex items-center gap-1 w-fit`}>
                        {getStatusIcon(sync.syncStatus)}
                        {sync.syncStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{sync.timestamp}</TableCell>
                    <TableCell className="text-[#666666]">{sync.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Health Check Tab
  const renderHealthCheck = () => (
    <div className="space-y-6">
      {/* Health Check Dashboard */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1976D2] flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Health Monitoring
              </CardTitle>
              <CardDescription className="text-[#555555]">
                Real-time message broker health status (Auto-check every 60s)
              </CardDescription>
            </div>
            <Button
              onClick={handleManualHealthCheck}
              disabled={isHealthCheckRunning}
              className="bg-[#1976D2] hover:bg-[#1565C0] rounded-xl"
            >
              {isHealthCheckRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Run Manual Health Check
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Broker Health Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {brokerHealth.map((broker) => (
              <Card
                key={broker.id}
                className={`border-2 shadow-md rounded-xl ${
                  broker.status === "Active"
                    ? "border-green-300 bg-gradient-to-br from-[#E8F5E9] to-white"
                    : broker.status === "Retrying"
                    ? "border-yellow-300 bg-gradient-to-br from-[#FFF8E1] to-white"
                    : "border-red-300 bg-gradient-to-br from-[#FFEBEE] to-white"
                }`}
              >
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-[#333333]">{broker.brokerName}</p>
                        <p className="text-xs text-[#666666] mt-1">Message Broker</p>
                      </div>
                      <div className={`p-2 rounded-full ${
                        broker.status === "Active" ? "bg-green-100" :
                        broker.status === "Retrying" ? "bg-yellow-100" :
                        "bg-red-100"
                      }`}>
                        {broker.status === "Active" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : broker.status === "Retrying" ? (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#666666]">Status:</span>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(broker.status)} rounded-full`}
                        >
                          {broker.status === "Active" && "🟢"}
                          {broker.status === "Retrying" && "🟡"}
                          {broker.status === "Down" && "🔴"}
                          {" "}{broker.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#666666]">Last Checked:</span>
                        <span className="text-[#333333] text-xs">{broker.lastChecked}</span>
                      </div>
                      {broker.retryAttempts > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#666666]">Retry Attempts:</span>
                          <Badge className="bg-yellow-600 text-white">{broker.retryAttempts}</Badge>
                        </div>
                      )}
                      {broker.errorCode && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#666666]">Error Code:</span>
                          <Badge className="bg-red-600 text-white">{broker.errorCode}</Badge>
                        </div>
                      )}
                    </div>

                    {broker.errorMessage && (
                      <div className="p-2 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-xs text-red-800">{broker.errorMessage}</p>
                      </div>
                    )}

                    {broker.status === "Down" && (
                      <div className="p-2 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-xs text-red-800 font-medium">
                          ⚠️ Broker Down: Publishing Paused
                        </p>
                        <p className="text-xs text-red-700 mt-1">
                          Dependent services paused automatically
                        </p>
                      </div>
                    )}

                    {broker.status === "Active" && broker.retryAttempts === 0 && (
                      <div className="p-2 bg-green-100 border border-green-300 rounded-lg">
                        <p className="text-xs text-green-800">
                          ✅ Broker Restored: Operations Resumed
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Alert Notifications */}
          {brokerHealth.some(b => b.status === "Down" || b.status === "Retrying") && (
            <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">System Alert</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {brokerHealth.filter(b => b.status === "Down").length > 0
                      ? `${brokerHealth.filter(b => b.status === "Down").length} broker(s) down. Publishing paused for affected services.`
                      : `${brokerHealth.filter(b => b.status === "Retrying").length} broker(s) experiencing connection issues. Retrying...`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health History Table */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1976D2] flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Health Check History
              </CardTitle>
              <CardDescription className="text-[#555555]">
                Logs retained for ≥30 days
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-[#1976D2] text-[#1976D2] rounded-xl">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="rounded-xl" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
            <Input
              type="text"
              placeholder="Search by broker name or check ID..."
              value={searchHealth}
              onChange={(e) => setSearchHealth(e.target.value)}
              className="pl-10 bg-white border-[#BBDEFB] rounded-xl"
            />
          </div>

          {/* Health History Table */}
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1976D2]">Check ID</TableHead>
                  <TableHead className="text-[#1976D2]">Broker Name</TableHead>
                  <TableHead className="text-[#1976D2]">Status</TableHead>
                  <TableHead className="text-[#1976D2]">Timestamp</TableHead>
                  <TableHead className="text-[#1976D2]">Duration</TableHead>
                  <TableHead className="text-[#1976D2]">Error Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {healthLogs
                  .filter(log =>
                    searchHealth === "" ||
                    log.brokerName.toLowerCase().includes(searchHealth.toLowerCase()) ||
                    log.checkId.toLowerCase().includes(searchHealth.toLowerCase())
                  )
                  .map((log) => (
                    <TableRow key={log.id} className="hover:bg-[#F5F5F5]">
                      <TableCell className="font-medium text-[#333333]">{log.checkId}</TableCell>
                      <TableCell className="text-[#666666]">{log.brokerName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(log.status)} rounded-full flex items-center gap-1 w-fit`}>
                          {getStatusIcon(log.status)}
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#666666]">{log.timestamp}</TableCell>
                      <TableCell className="text-[#666666]">{log.duration}</TableCell>
                      <TableCell className="text-[#666666]">{log.errorMessage || "-"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Footer Note */}
      <div className="p-4 bg-[#E3F2FD] rounded-lg border border-[#90CAF9]">
        <p className="text-sm text-[#1976D2]">
          <strong>📝 Note:</strong> Dependent services pause automatically when broker is down. Non-dependent services continue normal operations. All health check events are logged in the Event Logs for audit purposes.
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#666666]">
        <span>Administration</span>
        <span>/</span>
        <span className="text-[#1976D2] font-medium">Event Logs (Monitoring Service)</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[#1976D2] mb-2">Event Logs (Monitoring Service)</h1>
        <p className="text-[#555555]">
          Monitor system events, manage backups, and check service health
        </p>
      </div>

      {/* Sub-Navigation Tabs */}
      <Card className="shadow-md border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button
              variant={currentSubTab === "event-logs" ? "default" : "outline"}
              onClick={() => setCurrentSubTab("event-logs")}
              className={`rounded-xl whitespace-nowrap ${
                currentSubTab === "event-logs"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              1️⃣ Event Logs
            </Button>

            <Button
              variant={currentSubTab === "backup-sync" ? "default" : "outline"}
              onClick={() => setCurrentSubTab("backup-sync")}
              className={`rounded-xl whitespace-nowrap ${
                currentSubTab === "backup-sync"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <Database className="h-4 w-4 mr-2" />
              2️⃣ Backup & Sync
            </Button>

            <Button
              variant={currentSubTab === "health-check" ? "default" : "outline"}
              onClick={() => setCurrentSubTab("health-check")}
              className={`rounded-xl whitespace-nowrap ${
                currentSubTab === "health-check"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <Activity className="h-4 w-4 mr-2" />
              3️⃣ Health Check
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Content */}
      {currentSubTab === "event-logs" && renderEventLogs()}
      {currentSubTab === "backup-sync" && renderBackupSync()}
      {currentSubTab === "health-check" && renderHealthCheck()}
    </div>
  );
}
