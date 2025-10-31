import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Package, 
  FlaskConical,
  Settings, 
  RefreshCw, 
  Info,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// Type Definitions
interface Instrument {
  id: string;
  name: string;
  model: string;
  status: "Active" | "Maintenance" | "Offline";
  lastSync: string;
  assignedDate: string;
}

interface ReagentHistory {
  recordId: string;
  reagentName: string;
  batchNo: string;
  quantity: number;
  date: string;
  status: "Used" | "Added" | "Expired";
}

interface GeneralConfig {
  id: string;
  configName: string;
  parameterType: "Boolean" | "Numeric" | "Text";
  defaultValue: string;
  currentValue: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
  syncStatus: "Synced" | "Pending" | "Error";
}

interface SpecificConfig {
  configId: string;
  instrumentModel: string;
  parameterName: string;
  description: string;
  value: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
  syncStatus: "Synced" | "Pending" | "Error";
}

export default function ServiceWarehouseService() {
  // Main Tab State
  const [activeMainTab, setActiveMainTab] = useState("instruments");
  
  // Instruments Tab States
  const [instrumentSearch, setInstrumentSearch] = useState("");
  const [instrumentStatusFilter, setInstrumentStatusFilter] = useState("all");
  
  // Reagents Tab States
  const [reagentSearch, setReagentSearch] = useState("");
  const [reagentStatusFilter, setReagentStatusFilter] = useState("all");
  
  // Configurations Sub-tab State
  const [configSubTab, setConfigSubTab] = useState("general");
  const [generalConfigSearch, setGeneralConfigSearch] = useState("");
  const [generalConfigTypeFilter, setGeneralConfigTypeFilter] = useState("all");
  const [specificConfigSearch, setSpecificConfigSearch] = useState("");
  const [specificConfigInstrumentFilter, setSpecificConfigInstrumentFilter] = useState("all");

  // Mock Data - Instruments
  const instruments: Instrument[] = [
    {
      id: "INS001",
      name: "CentriMax 5000",
      model: "CMX-5000",
      status: "Active",
      lastSync: "2025-10-20 14:10",
      assignedDate: "2025-08-01"
    },
    {
      id: "INS002",
      name: "SpectroLite X",
      model: "SPX-100",
      status: "Maintenance",
      lastSync: "2025-10-19 09:00",
      assignedDate: "2025-06-10"
    },
    {
      id: "INS003",
      name: "Hemolyzer 7",
      model: "HML-7",
      status: "Active",
      lastSync: "2025-10-18 08:30",
      assignedDate: "2025-05-24"
    },
    {
      id: "INS004",
      name: "BioAnalyzer Pro",
      model: "BAP-200",
      status: "Offline",
      lastSync: "2025-10-15 16:45",
      assignedDate: "2025-07-12"
    },
    {
      id: "INS005",
      name: "MicroScope Elite",
      model: "MSE-500",
      status: "Active",
      lastSync: "2025-10-20 11:20",
      assignedDate: "2025-09-05"
    }
  ];

  // Mock Data - Reagents History
  const reagentsHistory: ReagentHistory[] = [
    {
      recordId: "RH001",
      reagentName: "Hematology Control",
      batchNo: "B-1452",
      quantity: 20,
      date: "2025-10-20",
      status: "Used"
    },
    {
      recordId: "RH002",
      reagentName: "Calibrator X",
      batchNo: "C-980",
      quantity: 50,
      date: "2025-10-19",
      status: "Added"
    },
    {
      recordId: "RH003",
      reagentName: "Diluent Buffer",
      batchNo: "D-223",
      quantity: 10,
      date: "2025-10-18",
      status: "Expired"
    },
    {
      recordId: "RH004",
      reagentName: "Standard Serum",
      batchNo: "S-778",
      quantity: 15,
      date: "2025-10-15",
      status: "Used"
    },
    {
      recordId: "RH005",
      reagentName: "QC Solution A",
      batchNo: "Q-456",
      quantity: 30,
      date: "2025-10-14",
      status: "Added"
    },
    {
      recordId: "RH006",
      reagentName: "Enzyme Substrate",
      batchNo: "E-789",
      quantity: 8,
      date: "2025-10-12",
      status: "Expired"
    }
  ];

  // Mock Data - General Configurations
  const generalConfigs: GeneralConfig[] = [
    {
      id: "GC001",
      configName: "Lockout Policy",
      parameterType: "Numeric",
      defaultValue: "5",
      currentValue: "3",
      lastModifiedBy: "admin@lab.com",
      lastModifiedOn: "2025-10-15 10:20",
      syncStatus: "Synced"
    },
    {
      id: "GC002",
      configName: "AI Auto Review",
      parameterType: "Boolean",
      defaultValue: "false",
      currentValue: "true",
      lastModifiedBy: "admin@lab.com",
      lastModifiedOn: "2025-10-16 09:10",
      syncStatus: "Synced"
    },
    {
      id: "GC003",
      configName: "Session Timeout",
      parameterType: "Numeric",
      defaultValue: "15",
      currentValue: "20",
      lastModifiedBy: "admin@lab.com",
      lastModifiedOn: "2025-10-10 08:00",
      syncStatus: "Synced"
    },
    {
      id: "GC004",
      configName: "Expired Password",
      parameterType: "Numeric",
      defaultValue: "90",
      currentValue: "60",
      lastModifiedBy: "admin@lab.com",
      lastModifiedOn: "2025-10-05 16:30",
      syncStatus: "Pending"
    },
    {
      id: "GC005",
      configName: "Enable Two-Factor Auth",
      parameterType: "Boolean",
      defaultValue: "false",
      currentValue: "true",
      lastModifiedBy: "admin@lab.com",
      lastModifiedOn: "2025-10-18 14:00",
      syncStatus: "Synced"
    }
  ];

  // Mock Data - Specific Configurations
  const specificConfigs: SpecificConfig[] = [
    {
      configId: "SC001",
      instrumentModel: "CentriMax 5000",
      parameterName: "Auto-calibration Interval",
      description: "Adjusts calibration cycle for centrifuge",
      value: "12 hours",
      lastModifiedBy: "admin@lab.com",
      lastModifiedOn: "2025-10-12 09:30",
      syncStatus: "Synced"
    },
    {
      configId: "SC002",
      instrumentModel: "SpectroLite X",
      parameterName: "QC Settings",
      description: "Quality control frequency per day",
      value: "Twice Daily",
      lastModifiedBy: "admin@lab.com",
      lastModifiedOn: "2025-10-14 10:00",
      syncStatus: "Synced"
    },
    {
      configId: "SC003",
      instrumentModel: "Hemolyzer 7",
      parameterName: "Enable Debug Mode",
      description: "Enables diagnostic logs for analyzer",
      value: "True",
      lastModifiedBy: "admin@lab.com",
      lastModifiedOn: "2025-10-15 15:45",
      syncStatus: "Pending"
    },
    {
      configId: "SC004",
      instrumentModel: "CentriMax 5000",
      parameterName: "Temperature Threshold",
      description: "Maximum operating temperature alert",
      value: "35°C",
      lastModifiedBy: "admin@lab.com",
      lastModifiedOn: "2025-10-11 08:15",
      syncStatus: "Synced"
    }
  ];

  // Filter Functions
  const filteredInstruments = instruments.filter(instrument => {
    const matchesSearch = 
      instrument.name.toLowerCase().includes(instrumentSearch.toLowerCase()) ||
      instrument.id.toLowerCase().includes(instrumentSearch.toLowerCase());
    const matchesStatus = 
      instrumentStatusFilter === "all" || 
      instrument.status.toLowerCase() === instrumentStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredReagents = reagentsHistory.filter(reagent => {
    const matchesSearch = 
      reagent.reagentName.toLowerCase().includes(reagentSearch.toLowerCase()) ||
      reagent.batchNo.toLowerCase().includes(reagentSearch.toLowerCase());
    const matchesStatus = 
      reagentStatusFilter === "all" || 
      reagent.status.toLowerCase() === reagentStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const filteredGeneralConfigs = generalConfigs.filter(config => {
    const matchesSearch = config.configName.toLowerCase().includes(generalConfigSearch.toLowerCase());
    const matchesType = generalConfigTypeFilter === "all" || config.parameterType === generalConfigTypeFilter;
    return matchesSearch && matchesType;
  });

  const filteredSpecificConfigs = specificConfigs.filter(config => {
    const matchesSearch = 
      config.parameterName.toLowerCase().includes(specificConfigSearch.toLowerCase()) ||
      config.instrumentModel.toLowerCase().includes(specificConfigSearch.toLowerCase());
    const matchesInstrument = 
      specificConfigInstrumentFilter === "all" || 
      config.instrumentModel === specificConfigInstrumentFilter;
    return matchesSearch && matchesInstrument;
  });

  // Status Badge Components
  const getInstrumentStatusBadge = (status: "Active" | "Maintenance" | "Offline") => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 rounded-2xl">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "Maintenance":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 rounded-2xl">
            <Clock className="h-3 w-3 mr-1" />
            Maintenance
          </Badge>
        );
      case "Offline":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 rounded-2xl">
            <AlertCircle className="h-3 w-3 mr-1" />
            Offline
          </Badge>
        );
    }
  };

  const getReagentStatusBadge = (status: "Used" | "Added" | "Expired") => {
    switch (status) {
      case "Used":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 rounded-2xl">
            Used
          </Badge>
        );
      case "Added":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 rounded-2xl">
            Added
          </Badge>
        );
      case "Expired":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 rounded-2xl">
            Expired
          </Badge>
        );
    }
  };

  const getSyncStatusBadge = (status: "Synced" | "Pending" | "Error") => {
    switch (status) {
      case "Synced":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 rounded-2xl">
            <CheckCircle className="h-3 w-3 mr-1" />
            Synced
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 rounded-2xl">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "Error":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 rounded-2xl">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        );
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full space-y-6 mt-6">
          {/* Main Tabs */}
          <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-3 rounded-2xl bg-white border border-[#CBD5E1] p-1">
              <TabsTrigger 
                value="instruments" 
                className="rounded-xl data-[state=active]:bg-[#1976D2] data-[state=active]:text-white"
              >
                <Package className="h-4 w-4 mr-2" />
                Instruments
              </TabsTrigger>
              <TabsTrigger 
                value="reagents"
                className="rounded-xl data-[state=active]:bg-[#1976D2] data-[state=active]:text-white"
              >
                <FlaskConical className="h-4 w-4 mr-2" />
                Reagents History
              </TabsTrigger>
              <TabsTrigger 
                value="configurations"
                className="rounded-xl data-[state=active]:bg-[#1976D2] data-[state=active]:text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurations
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Instruments */}
            <TabsContent value="instruments" className="space-y-6 mt-6">
              <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#0F172A] flex items-center gap-2">
                    Instruments Inventory
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-[#64748B]" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Managed by Warehouse Admin. This view is read-only.</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription className="text-[#64748B]">
                    View list of instruments connected to the Warehouse
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and Filter Controls */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                      <Input
                        placeholder="Search by instrument name or ID..."
                        value={instrumentSearch}
                        onChange={(e) => setInstrumentSearch(e.target.value)}
                        className="pl-10 rounded-2xl border-[#CBD5E1]"
                      />
                    </div>
                    <Select value={instrumentStatusFilter} onValueChange={setInstrumentStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[200px] rounded-2xl border-[#CBD5E1]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Instruments Table */}
                  <div className="border border-[#CBD5E1] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#E3F2FD] border-b border-[#CBD5E1]">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Instrument ID</th>
                            <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Name</th>
                            <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Model</th>
                            <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Status</th>
                            <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Last Sync</th>
                            <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Assigned Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#CBD5E1]">
                          {filteredInstruments.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-[#64748B]">
                                No instruments found
                              </td>
                            </tr>
                          ) : (
                            filteredInstruments.map((instrument) => (
                              <tr key={instrument.id} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="px-4 py-4 text-sm text-[#0F172A]">{instrument.id}</td>
                                <td className="px-4 py-4 text-sm text-[#0F172A]">{instrument.name}</td>
                                <td className="px-4 py-4 text-sm text-[#64748B]">{instrument.model}</td>
                                <td className="px-4 py-4 text-sm">
                                  {getInstrumentStatusBadge(instrument.status)}
                                </td>
                                <td className="px-4 py-4 text-sm text-[#64748B]">{instrument.lastSync}</td>
                                <td className="px-4 py-4 text-sm text-[#64748B]">{instrument.assignedDate}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className="flex items-center justify-between text-sm text-[#64748B]">
                    <p>Showing {filteredInstruments.length} of {instruments.length} instruments</p>
                    <Button 
                      variant="outline" 
                      className="rounded-2xl border-[#CBD5E1] text-[#1976D2] hover:bg-[#E3F2FD]"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Footer Notice */}
              <Card className="rounded-2xl border-[#CBD5E1] bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <RefreshCw className="h-5 w-5 text-[#1976D2] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#64748B]">
                      <strong className="text-[#0F172A]">Auto-Sync Enabled:</strong> Data synchronized automatically from Instrument Service.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Reagents History */}
            <TabsContent value="reagents" className="space-y-6 mt-6">
              <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#0F172A] flex items-center gap-2">
                    Reagents History
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-[#64748B]" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reagent data managed by Warehouse Admin.</p>
                      </TooltipContent>
                    </Tooltip>
                  </CardTitle>
                  <CardDescription className="text-[#64748B]">
                    View reagent usage and stock history for synchronization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Search and Filter Controls */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                      <Input
                        placeholder="Search by reagent name or batch number..."
                        value={reagentSearch}
                        onChange={(e) => setReagentSearch(e.target.value)}
                        className="pl-10 rounded-2xl border-[#CBD5E1]"
                      />
                    </div>
                    <Select value={reagentStatusFilter} onValueChange={setReagentStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[200px] rounded-2xl border-[#CBD5E1]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="added">Added</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reagents Table */}
                  <div className="border border-[#CBD5E1] rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#E3F2FD] border-b border-[#CBD5E1]">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Record ID</th>
                            <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Reagent Name</th>
                            <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Batch No.</th>
                            <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Quantity</th>
                            <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Date</th>
                            <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#CBD5E1]">
                          {filteredReagents.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center text-[#64748B]">
                                No reagent history found
                              </td>
                            </tr>
                          ) : (
                            filteredReagents.map((reagent) => (
                              <tr key={reagent.recordId} className="hover:bg-[#F8FAFC] transition-colors">
                                <td className="px-4 py-4 text-sm text-[#0F172A]">{reagent.recordId}</td>
                                <td className="px-4 py-4 text-sm text-[#0F172A]">{reagent.reagentName}</td>
                                <td className="px-4 py-4 text-sm text-[#64748B]">{reagent.batchNo}</td>
                                <td className="px-4 py-4 text-sm text-[#64748B]">{reagent.quantity}</td>
                                <td className="px-4 py-4 text-sm text-[#64748B]">{reagent.date}</td>
                                <td className="px-4 py-4 text-sm">
                                  {getReagentStatusBadge(reagent.status)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Results Count */}
                  <div className="flex items-center justify-between text-sm text-[#64748B]">
                    <p>Showing {filteredReagents.length} of {reagentsHistory.length} records</p>
                    <Button 
                      variant="outline" 
                      className="rounded-2xl border-[#CBD5E1] text-[#1976D2] hover:bg-[#E3F2FD]"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Footer Notice */}
              <Card className="rounded-2xl border-[#CBD5E1] bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <FlaskConical className="h-5 w-5 text-[#1976D2] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#64748B]">
                      <strong className="text-[#0F172A]">Reagent History:</strong> Viewing reagent history (read-only). Updates sync automatically from Warehouse Service.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: Configurations */}
            <TabsContent value="configurations" className="space-y-6 mt-6">
              <Tabs value={configSubTab} onValueChange={setConfigSubTab} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2 rounded-2xl bg-white border border-[#CBD5E1] p-1">
                  <TabsTrigger 
                    value="general" 
                    className="rounded-xl data-[state=active]:bg-[#1976D2] data-[state=active]:text-white"
                  >
                    General Configurations
                  </TabsTrigger>
                  <TabsTrigger 
                    value="specific"
                    className="rounded-xl data-[state=active]:bg-[#1976D2] data-[state=active]:text-white"
                  >
                    Specific Configurations
                  </TabsTrigger>
                </TabsList>

                {/* General Configurations Sub-tab */}
                <TabsContent value="general" className="space-y-6 mt-6">
                  <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-[#0F172A] flex items-center gap-2">
                        General Configurations
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-[#64748B]" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Configuration managed by Warehouse Admin.</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-[#64748B]">
                        System-wide configuration parameters
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Search and Filter Controls */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                          <Input
                            placeholder="Search by configuration name..."
                            value={generalConfigSearch}
                            onChange={(e) => setGeneralConfigSearch(e.target.value)}
                            className="pl-10 rounded-2xl border-[#CBD5E1]"
                          />
                        </div>
                        <Select value={generalConfigTypeFilter} onValueChange={setGeneralConfigTypeFilter}>
                          <SelectTrigger className="w-full sm:w-[200px] rounded-2xl border-[#CBD5E1]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="Boolean">Boolean</SelectItem>
                            <SelectItem value="Numeric">Numeric</SelectItem>
                            <SelectItem value="Text">Text</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* General Configurations Table */}
                      <div className="border border-[#CBD5E1] rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-[#E3F2FD] border-b border-[#CBD5E1]">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Config Name</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Parameter Type</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Default Value</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Current Value</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Last Modified By</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Last Modified On</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Sync Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#CBD5E1]">
                              {filteredGeneralConfigs.length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="px-4 py-8 text-center text-[#64748B]">
                                    No configurations found
                                  </td>
                                </tr>
                              ) : (
                                filteredGeneralConfigs.map((config) => (
                                  <tr key={config.id} className="hover:bg-[#F8FAFC] transition-colors">
                                    <td className="px-4 py-4 text-sm text-[#0F172A]">{config.configName}</td>
                                    <td className="px-4 py-4 text-sm">
                                      <Badge 
                                        variant="outline" 
                                        className="rounded-2xl border-[#CBD5E1] text-[#64748B]"
                                      >
                                        {config.parameterType}
                                      </Badge>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-[#64748B]">{config.defaultValue}</td>
                                    <td className="px-4 py-4 text-sm text-[#0F172A]">{config.currentValue}</td>
                                    <td className="px-4 py-4 text-sm text-[#64748B]">{config.lastModifiedBy}</td>
                                    <td className="px-4 py-4 text-sm text-[#64748B]">{config.lastModifiedOn}</td>
                                    <td className="px-4 py-4 text-sm">
                                      {getSyncStatusBadge(config.syncStatus)}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Results Count */}
                      <div className="flex items-center justify-between text-sm text-[#64748B]">
                        <p>Showing {filteredGeneralConfigs.length} of {generalConfigs.length} configurations</p>
                        <Button 
                          variant="outline" 
                          className="rounded-2xl border-[#CBD5E1] text-[#1976D2] hover:bg-[#E3F2FD]"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Specific Configurations Sub-tab */}
                <TabsContent value="specific" className="space-y-6 mt-6">
                  <Card className="rounded-2xl border-[#CBD5E1] shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-[#0F172A] flex items-center gap-2">
                        Specific Configurations
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-[#64748B]" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Instrument-specific configurations. Read-only for Service role.</p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                      <CardDescription className="text-[#64748B]">
                        Instrument-specific configuration parameters
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Search and Filter Controls */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                          <Input
                            placeholder="Search by instrument or parameter..."
                            value={specificConfigSearch}
                            onChange={(e) => setSpecificConfigSearch(e.target.value)}
                            className="pl-10 rounded-2xl border-[#CBD5E1]"
                          />
                        </div>
                        <Select value={specificConfigInstrumentFilter} onValueChange={setSpecificConfigInstrumentFilter}>
                          <SelectTrigger className="w-full sm:w-[200px] rounded-2xl border-[#CBD5E1]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="All Instruments" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Instruments</SelectItem>
                            <SelectItem value="CentriMax 5000">CentriMax 5000</SelectItem>
                            <SelectItem value="SpectroLite X">SpectroLite X</SelectItem>
                            <SelectItem value="Hemolyzer 7">Hemolyzer 7</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Specific Configurations Table */}
                      <div className="border border-[#CBD5E1] rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-[#E3F2FD] border-b border-[#CBD5E1]">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Config ID</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Instrument Model</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Parameter Name</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Description</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Value</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Last Modified By</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Last Modified On</th>
                                <th className="px-4 py-3 text-left text-sm text-[#0F172A]">Sync Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#CBD5E1]">
                              {filteredSpecificConfigs.length === 0 ? (
                                <tr>
                                  <td colSpan={8} className="px-4 py-8 text-center text-[#64748B]">
                                    No configurations found
                                  </td>
                                </tr>
                              ) : (
                                filteredSpecificConfigs.map((config) => (
                                  <tr key={config.configId} className="hover:bg-[#F8FAFC] transition-colors">
                                    <td className="px-4 py-4 text-sm text-[#0F172A]">{config.configId}</td>
                                    <td className="px-4 py-4 text-sm text-[#0F172A]">{config.instrumentModel}</td>
                                    <td className="px-4 py-4 text-sm text-[#0F172A]">{config.parameterName}</td>
                                    <td className="px-4 py-4 text-sm text-[#64748B] max-w-xs">
                                      <Tooltip>
                                        <TooltipTrigger className="text-left">
                                          <p className="truncate">{config.description}</p>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p className="max-w-xs">{config.description}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-[#0F172A]">{config.value}</td>
                                    <td className="px-4 py-4 text-sm text-[#64748B]">{config.lastModifiedBy}</td>
                                    <td className="px-4 py-4 text-sm text-[#64748B]">{config.lastModifiedOn}</td>
                                    <td className="px-4 py-4 text-sm">
                                      {getSyncStatusBadge(config.syncStatus)}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Results Count */}
                      <div className="flex items-center justify-between text-sm text-[#64748B]">
                        <p>Showing {filteredSpecificConfigs.length} of {specificConfigs.length} configurations</p>
                        <Button 
                          variant="outline" 
                          className="rounded-2xl border-[#CBD5E1] text-[#1976D2] hover:bg-[#E3F2FD]"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Sync Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Footer Notice for Configurations */}
              <Card className="rounded-2xl border-[#CBD5E1] bg-white">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Settings className="h-5 w-5 text-[#1976D2] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#64748B]">
                      <strong className="text-[#0F172A]">Configuration Sync:</strong> All configuration changes are automatically synchronized from Warehouse Service.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
      </div>
    </TooltipProvider>
  );
}
