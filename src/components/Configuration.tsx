import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  AlertTriangle, 
  RefreshCw,
  Download,
  FileJson,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Database,
  Zap,
  Activity
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";

type TabView = "config-list" | "create-edit" | "sync-status";
type ServiceScope = "Warehouse" | "TestOrder" | "Instrument" | "Monitoring" | "All Services";

interface Configuration {
  id: string;
  configKey: string;
  configValue: string;
  serviceScope: ServiceScope;
  description: string;
  lastUpdated: string;
  updatedBy: string;
  isDeleted?: boolean;
}

interface SyncTarget {
  id: string;
  serviceName: ServiceScope;
  status: "Synced" | "Pending" | "Failed";
  lastSync: string;
  errorLog?: string;
}

// Mock Data
const mockConfigurations: Configuration[] = [
  {
    id: "CFG-001",
    configKey: "AUTO_CALIBRATION_INTERVAL",
    configValue: "12",
    serviceScope: "Warehouse",
    description: "Automatic calibration interval in hours for instruments",
    lastUpdated: "2025-10-15 14:30:00",
    updatedBy: "admin@lab.com"
  },
  {
    id: "CFG-002",
    configKey: "QC_CHECK_FREQUENCY",
    configValue: "Twice Daily",
    serviceScope: "Warehouse",
    description: "Quality control check frequency for all instruments",
    lastUpdated: "2025-10-16 09:00:00",
    updatedBy: "admin@lab.com"
  },
  {
    id: "CFG-003",
    configKey: "TEST_RESULT_RETENTION_DAYS",
    configValue: "365",
    serviceScope: "TestOrder",
    description: "Number of days to retain test results in the system",
    lastUpdated: "2025-10-10 11:20:00",
    updatedBy: "service@lab.com"
  },
  {
    id: "CFG-004",
    configKey: "INSTRUMENT_MODE_TIMEOUT",
    configValue: "30",
    serviceScope: "Instrument",
    description: "Timeout in seconds for instrument mode change operations",
    lastUpdated: "2025-10-12 15:45:00",
    updatedBy: "labuser01@lab.com"
  },
  {
    id: "CFG-005",
    configKey: "HEALTH_CHECK_INTERVAL",
    configValue: "60",
    serviceScope: "Monitoring",
    description: "Health check interval in seconds for message brokers",
    lastUpdated: "2025-10-14 10:00:00",
    updatedBy: "admin@lab.com"
  },
  {
    id: "CFG-006",
    configKey: "MAX_CONCURRENT_TESTS",
    configValue: "10",
    serviceScope: "All Services",
    description: "Maximum number of concurrent test executions across all instruments",
    lastUpdated: "2025-10-17 08:30:00",
    updatedBy: "admin@lab.com"
  }
];

const mockSyncTargets: SyncTarget[] = [
  {
    id: "SYNC-001",
    serviceName: "Warehouse",
    status: "Synced",
    lastSync: "2025-10-17 14:30:00"
  },
  {
    id: "SYNC-002",
    serviceName: "TestOrder",
    status: "Synced",
    lastSync: "2025-10-17 14:30:00"
  },
  {
    id: "SYNC-003",
    serviceName: "Instrument",
    status: "Pending",
    lastSync: "2025-10-17 14:25:00"
  },
  {
    id: "SYNC-004",
    serviceName: "Monitoring",
    status: "Failed",
    lastSync: "2025-10-17 14:20:00",
    errorLog: "Connection timeout - retry scheduled"
  }
];

export function Configuration() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<TabView>("config-list");
  
  // Configuration State
  const [configurations, setConfigurations] = useState<Configuration[]>(mockConfigurations);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [selectedConfig, setSelectedConfig] = useState<Configuration | null>(null);
  
  // Sync State
  const [syncTargets, setSyncTargets] = useState<SyncTarget[]>(mockSyncTargets);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoRefreshSync, setAutoRefreshSync] = useState(true);
  
  // Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewJsonOpen, setIsViewJsonOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    configKey: "",
    configValue: "",
    serviceScope: "All Services" as ServiceScope,
    description: ""
  });

  const [formErrors, setFormErrors] = useState({
    configKey: "",
    configValue: ""
  });

  // Statistics
  const stats = {
    totalConfigs: configurations.filter(c => !c.isDeleted).length,
    lastUpdated: configurations.length > 0 ? configurations[0].lastUpdated : "N/A",
    syncStatus: syncTargets.every(s => s.status === "Synced") ? "OK" : "Pending",
    modifiedBy: configurations.length > 0 ? configurations[0].updatedBy : "N/A"
  };

  // Auto-refresh sync status every 60 seconds
  useEffect(() => {
    if (!autoRefreshSync) return;

    const interval = setInterval(() => {
      console.log("[AUTO_REFRESH_SYNC] Checking sync status...");
      
      // Simulate sync status updates
      setSyncTargets(prevTargets => 
        prevTargets.map(target => {
          if (target.status === "Pending") {
            return {
              ...target,
              status: Math.random() > 0.3 ? "Synced" : "Pending" as "Synced" | "Pending" | "Failed",
              lastSync: new Date().toISOString().replace('T', ' ').substring(0, 19)
            };
          }
          return target;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [autoRefreshSync]);

  // Filter Configurations
  const filteredConfigs = configurations.filter(config => {
    if (config.isDeleted) return false;
    
    const matchesSearch = 
      config.configKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      config.configValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      config.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesService = filterService === "all" || config.serviceScope === filterService;
    
    return matchesSearch && matchesService;
  });

  // Validate Form
  const validateForm = (): boolean => {
    const errors = {
      configKey: "",
      configValue: ""
    };

    if (!formData.configKey.trim()) {
      errors.configKey = "Config Key is required";
    } else {
      const duplicate = configurations.find(c => 
        c.configKey.toUpperCase() === formData.configKey.toUpperCase() && 
        !c.isDeleted &&
        (!selectedConfig || c.id !== selectedConfig.id)
      );
      if (duplicate) {
        errors.configKey = "Configuration key must be unique";
      }
    }

    if (!formData.configValue.trim()) {
      errors.configValue = "Config Value is required";
    }

    setFormErrors(errors);
    return !Object.values(errors).some(err => err !== "");
  };

  // Handle Create Configuration
  const handleCreateConfig = () => {
    if (!validateForm()) {
      toast.error("Validation failed", {
        description: "Please fix the errors in the form"
      });
      return;
    }

    const newConfig: Configuration = {
      id: `CFG-${String(configurations.length + 1).padStart(3, "0")}`,
      configKey: formData.configKey.toUpperCase().replace(/ /g, "_"),
      configValue: formData.configValue,
      serviceScope: formData.serviceScope,
      description: formData.description,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedBy: user?.email || "admin@lab.com"
    };

    setConfigurations([newConfig, ...configurations]);
    
    // Update sync status to Pending
    setSyncTargets(syncTargets.map(target => ({
      ...target,
      status: "Pending" as "Synced" | "Pending" | "Failed"
    })));

    setIsCreateOpen(false);
    resetForm();

    toast.success("✅ Configuration created successfully!", {
      description: "New configuration will be synchronized across all services."
    });

    console.log(`[CONFIG_CREATED] ${newConfig.id}, Key: ${newConfig.configKey}, Service: ${newConfig.serviceScope}, By: ${newConfig.updatedBy}`);
  };

  // Handle Edit Configuration
  const handleEditConfig = () => {
    if (!validateForm() || !selectedConfig) {
      toast.error("Validation failed");
      return;
    }

    const updatedConfig = {
      ...selectedConfig,
      configValue: formData.configValue,
      description: formData.description,
      lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updatedBy: user?.email || "admin@lab.com"
    };

    setConfigurations(configurations.map(c => c.id === selectedConfig.id ? updatedConfig : c));
    
    // Update sync status to Pending
    setSyncTargets(syncTargets.map(target => ({
      ...target,
      status: "Pending" as "Synced" | "Pending" | "Failed"
    })));

    setIsEditOpen(false);
    setSelectedConfig(null);
    resetForm();

    toast.success("✅ Configuration updated successfully!", {
      description: "Changes will be synchronized across all services."
    });

    console.log(`[CONFIG_UPDATED] ${updatedConfig.id}, By: ${updatedConfig.updatedBy}`);
  };

  // Handle Delete Configuration
  const handleDeleteConfig = () => {
    if (!selectedConfig) return;

    setConfigurations(configurations.map(c => 
      c.id === selectedConfig.id ? { ...c, isDeleted: true } : c
    ));

    // Update sync status to Pending
    setSyncTargets(syncTargets.map(target => ({
      ...target,
      status: "Pending" as "Synced" | "Pending" | "Failed"
    })));

    setIsDeleteOpen(false);

    toast.success("✅ Configuration deleted successfully!", {
      description: "Deletion has been synchronized across all services."
    });

    console.log(`[CONFIG_DELETED] ${selectedConfig.id}, By: ${user?.email}, Timestamp: ${new Date().toISOString()}`);

    setSelectedConfig(null);
  };

  // Handle Force Sync
  const handleForceSync = () => {
    setIsSyncing(true);
    
    toast.info("🔄 Force sync initiated...", {
      description: "Synchronizing configurations across all services"
    });

    setTimeout(() => {
      setSyncTargets(syncTargets.map(target => ({
        ...target,
        status: "Synced" as "Synced" | "Pending" | "Failed",
        lastSync: new Date().toISOString().replace('T', ' ').substring(0, 19),
        errorLog: undefined
      })));

      setIsSyncing(false);

      toast.success("✅ Sync completed successfully!", {
        description: "All services are now synchronized."
      });

      console.log(`[FORCE_SYNC] By: ${user?.email}`);
    }, 2000);
  };

  // Handle Export JSON
  const handleExportJson = () => {
    const exportData = configurations.filter(c => !c.isDeleted).map(config => ({
      configKey: config.configKey,
      configValue: config.configValue,
      serviceScope: config.serviceScope,
      description: config.description,
      lastUpdated: config.lastUpdated,
      updatedBy: config.updatedBy
    }));

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `configurations-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("✅ Export completed!", {
      description: `Exported ${exportData.length} configurations to JSON`
    });

    console.log(`[EXPORT_JSON] Configs: ${exportData.length}, By: ${user?.email}`);
  };

  // Handle View JSON
  const handleViewJson = (config: Configuration) => {
    setSelectedConfig(config);
    setIsViewJsonOpen(true);
  };

  const resetForm = () => {
    setFormData({
      configKey: "",
      configValue: "",
      serviceScope: "All Services",
      description: ""
    });
    setFormErrors({ configKey: "", configValue: "" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Synced":
      case "OK":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Synced":
      case "OK":
        return <CheckCircle2 className="h-4 w-4" />;
      case "Pending":
        return <Clock className="h-4 w-4" />;
      case "Failed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case "Warehouse":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "TestOrder":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Instrument":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Monitoring":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "All Services":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Render Configuration List Tab
  const renderConfigList = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-md border-[#B3D9FF] bg-gradient-to-br from-[#E3F2FD] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Total Configurations</p>
                <p className="text-3xl font-semibold text-[#1976D2]">{stats.totalConfigs}</p>
              </div>
              <Database className="h-8 w-8 text-[#1976D2] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#B3D9FF] bg-gradient-to-br from-[#E3F2FD] to-white rounded-xl">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-[#555555] mb-1">Last Updated</p>
              <p className="text-sm font-medium text-[#1976D2]">{stats.lastUpdated}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#A5D6A7] bg-gradient-to-br from-[#E8F5E9] to-white rounded-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#555555] mb-1">Sync Status</p>
                <Badge variant="outline" className={`${getStatusColor(stats.syncStatus)} rounded-full mt-1`}>
                  {getStatusIcon(stats.syncStatus)}
                  <span className="ml-1">{stats.syncStatus}</span>
                </Badge>
              </div>
              <Zap className="h-8 w-8 text-[#388E3C] opacity-70" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-[#B3D9FF] bg-gradient-to-br from-[#E3F2FD] to-white rounded-xl">
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-[#555555] mb-1">Modified By</p>
              <p className="text-sm font-medium text-[#1976D2]">{stats.modifiedBy}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#1976D2]">Configuration Management</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-[#1976D2] text-[#1976D2] rounded-xl"
                onClick={handleExportJson}
              >
                <FileJson className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => {
                  setCurrentTab("create-edit");
                  resetForm();
                }}
                className="bg-[#1976D2] hover:bg-[#1565C0] rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666666]" />
              <Input
                type="text"
                placeholder="Search by key or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-[#BBDEFB] rounded-xl"
              />
            </div>

            <Select value={filterService} onValueChange={setFilterService}>
              <SelectTrigger className="bg-white rounded-xl border-[#BBDEFB]">
                <SelectValue placeholder="Filter by service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="Warehouse">Warehouse</SelectItem>
                <SelectItem value="TestOrder">Test Order</SelectItem>
                <SelectItem value="Instrument">Instrument</SelectItem>
                <SelectItem value="Monitoring">Monitoring</SelectItem>
                <SelectItem value="All Services">All Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Configuration Table */}
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            {filteredConfigs.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="h-16 w-16 text-[#BBDEFB] mx-auto mb-4" />
                <p className="text-[#666666]">No Configurations Found</p>
                <p className="text-sm text-[#999999] mt-2">Try adjusting your filters or add a new configuration</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                    <TableHead className="text-[#1976D2]">Config Key</TableHead>
                    <TableHead className="text-[#1976D2]">Value</TableHead>
                    <TableHead className="text-[#1976D2]">Service</TableHead>
                    <TableHead className="text-[#1976D2]">Last Updated</TableHead>
                    <TableHead className="text-[#1976D2]">Updated By</TableHead>
                    <TableHead className="text-[#1976D2] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredConfigs.map((config) => (
                    <TableRow key={config.id} className="hover:bg-[#F5F5F5]">
                      <TableCell className="font-medium text-[#333333]">
                        <code className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-sm">
                          {config.configKey}
                        </code>
                      </TableCell>
                      <TableCell className="text-[#666666]">{config.configValue}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getServiceColor(config.serviceScope)} rounded-full`}>
                          {config.serviceScope}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#666666]">{config.lastUpdated}</TableCell>
                      <TableCell className="text-[#666666]">{config.updatedBy}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewJson(config)}
                            className="text-[#1976D2] hover:text-[#1565C0] hover:bg-[#E3F2FD]"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedConfig(config);
                              setFormData({
                                configKey: config.configKey,
                                configValue: config.configValue,
                                serviceScope: config.serviceScope,
                                description: config.description
                              });
                              setCurrentTab("create-edit");
                            }}
                            className="text-[#F57C00] hover:text-[#E65100] hover:bg-[#FFF8E1]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedConfig(config);
                              setIsDeleteOpen(true);
                            }}
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
    </div>
  );

  // Render Create/Edit Tab
  const renderCreateEdit = () => (
    <div className="space-y-6">
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1976D2]">
            {selectedConfig ? "Modify Configuration" : "Create New Configuration"}
          </CardTitle>
          <CardDescription className="text-[#555555]">
            {selectedConfig 
              ? "Update configuration value. Changes will sync to all services automatically."
              : "Add a new configuration to the system. It will sync to all services automatically."}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Auto-Sync Banner */}
            <div className="p-4 bg-[#E3F2FD] rounded-lg border border-[#90CAF9]">
              <p className="text-sm text-[#1976D2]">
                <strong>🔄 Auto-Sync:</strong> New configuration will be synchronized across all services automatically after creation.
              </p>
            </div>

            {/* Form */}
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="configKey">
                  Config Key <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="configKey"
                  value={formData.configKey}
                  onChange={(e) => setFormData({ ...formData, configKey: e.target.value })}
                  placeholder="e.g., AUTO_CALIBRATION_INTERVAL"
                  className={formErrors.configKey ? "border-red-500" : "bg-white border-[#BBDEFB] rounded-xl"}
                  disabled={!!selectedConfig}
                />
                {formErrors.configKey && (
                  <p className="text-xs text-red-600">{formErrors.configKey}</p>
                )}
                <p className="text-xs text-[#666666]">
                  Unique identifier for this configuration (uppercase with underscores)
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="configValue">
                  Config Value <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="configValue"
                  value={formData.configValue}
                  onChange={(e) => setFormData({ ...formData, configValue: e.target.value })}
                  placeholder="e.g., 12"
                  className={formErrors.configValue ? "border-red-500" : "bg-white border-[#BBDEFB] rounded-xl"}
                />
                {formErrors.configValue && (
                  <p className="text-xs text-red-600">{formErrors.configValue}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="serviceScope">Service Scope</Label>
                <Select
                  value={formData.serviceScope}
                  onValueChange={(value: ServiceScope) => setFormData({ ...formData, serviceScope: value })}
                  disabled={!!selectedConfig}
                >
                  <SelectTrigger className="bg-white rounded-xl border-[#BBDEFB]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Services">All Services</SelectItem>
                    <SelectItem value="Warehouse">Warehouse Service</SelectItem>
                    <SelectItem value="TestOrder">Test Order Service</SelectItem>
                    <SelectItem value="Instrument">Instrument Service</SelectItem>
                    <SelectItem value="Monitoring">Monitoring Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter a brief description of this configuration..."
                  rows={4}
                  className="bg-white border-[#BBDEFB] rounded-xl"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#BBDEFB]">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentTab("config-list");
                  setSelectedConfig(null);
                  resetForm();
                }}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={selectedConfig ? handleEditConfig : handleCreateConfig}
                className="bg-[#1976D2] hover:bg-[#1565C0] rounded-xl"
              >
                {selectedConfig ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Update & Sync
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Configuration
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render Sync Status Tab
  const renderSyncStatus = () => (
    <div className="space-y-6">
      {/* Sync Overview */}
      <Card className="shadow-md border-[#BBDEFB] bg-gradient-to-r from-[#E3F2FD] to-white rounded-xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-blue-800 mb-1">Synchronization Monitor</h3>
                <p className="text-sm text-blue-700">
                  Auto-refresh every 60 seconds. Last check: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Label className="text-sm text-blue-700">Auto Refresh</Label>
              <input
                type="checkbox"
                checked={autoRefreshSync}
                onChange={(e) => setAutoRefreshSync(e.target.checked)}
                className="w-4 h-4"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sync Status Table */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1976D2]">Sync Targets</CardTitle>
              <CardDescription className="text-[#555555]">
                Configuration synchronization status across all services
              </CardDescription>
            </div>
            <Button
              onClick={handleForceSync}
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
                  Force Sync
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1976D2]">Sync Target</TableHead>
                  <TableHead className="text-[#1976D2]">Status</TableHead>
                  <TableHead className="text-[#1976D2]">Last Sync</TableHead>
                  <TableHead className="text-[#1976D2]">Error Logs</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syncTargets.map((target) => (
                  <TableRow key={target.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-[#1976D2]" />
                        {target.serviceName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(target.status)} rounded-full flex items-center gap-1 w-fit`}>
                        {target.status === "Synced" && "🟢"}
                        {target.status === "Pending" && "🟡"}
                        {target.status === "Failed" && "🔴"}
                        <span className="ml-1">{target.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{target.lastSync}</TableCell>
                    <TableCell className="text-[#666666]">
                      {target.errorLog ? (
                        <span className="text-red-600">{target.errorLog}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Status Legend */}
          <div className="mt-6 p-4 bg-[#F5F5F5] rounded-lg">
            <p className="text-sm text-[#666666] mb-2 font-medium">Status Indicators:</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-green-600">🟢</span>
                <span className="text-sm text-[#666666]">Synced - All configurations up to date</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">🟡</span>
                <span className="text-sm text-[#666666]">Pending - Synchronization in progress</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-600">🔴</span>
                <span className="text-sm text-[#666666]">Failed - Sync error, retry scheduled</span>
              </div>
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
        <span className="text-[#1976D2] font-medium">System Configuration</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-[#1976D2] mb-2">System Configuration</h1>
        <p className="text-[#555555]">
          Manage global configurations that synchronize across all services
        </p>
      </div>

      {/* Tab Navigation */}
      <Card className="shadow-md border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Button
              variant={currentTab === "config-list" ? "default" : "outline"}
              onClick={() => setCurrentTab("config-list")}
              className={`rounded-xl ${
                currentTab === "config-list"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <Database className="h-4 w-4 mr-2" />
              Configuration List
            </Button>

            <Button
              variant={currentTab === "create-edit" ? "default" : "outline"}
              onClick={() => {
                setCurrentTab("create-edit");
                setSelectedConfig(null);
                resetForm();
              }}
              className={`rounded-xl ${
                currentTab === "create-edit"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              Create / Edit Configuration
            </Button>

            <Button
              variant={currentTab === "sync-status" ? "default" : "outline"}
              onClick={() => setCurrentTab("sync-status")}
              className={`rounded-xl ${
                currentTab === "sync-status"
                  ? "bg-[#1976D2] hover:bg-[#1565C0] text-white"
                  : "border-[#BBDEFB] text-[#1976D2] hover:bg-[#E3F2FD]"
              }`}
            >
              <Activity className="h-4 w-4 mr-2" />
              Sync Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Content */}
      {currentTab === "config-list" && renderConfigList()}
      {currentTab === "create-edit" && renderCreateEdit()}
      {currentTab === "sync-status" && renderSyncStatus()}

      {/* View JSON Dialog */}
      <Dialog open={isViewJsonOpen} onOpenChange={setIsViewJsonOpen}>
        <DialogContent className="bg-white max-w-2xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1976D2]">Configuration JSON</DialogTitle>
            <DialogDescription>
              Raw JSON representation of this configuration
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            {selectedConfig && (
              <pre className="text-xs text-[#333333] font-mono bg-[#F5F5F5] p-4 rounded border border-[#BBDEFB]">
                {JSON.stringify({
                  id: selectedConfig.id,
                  configKey: selectedConfig.configKey,
                  configValue: selectedConfig.configValue,
                  serviceScope: selectedConfig.serviceScope,
                  description: selectedConfig.description,
                  lastUpdated: selectedConfig.lastUpdated,
                  updatedBy: selectedConfig.updatedBy
                }, null, 2)}
              </pre>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewJsonOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-[#D32F2F]">Delete Configuration</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              Are you sure you want to delete the configuration <strong>{selectedConfig?.configKey}</strong>?
              <br />
              <br />
              This will sync the deletion to all services automatically. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfig}
              className="bg-[#D32F2F] hover:bg-[#B71C1C]"
            >
              Delete Configuration
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
