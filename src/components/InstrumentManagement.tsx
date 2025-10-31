import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Search, Plus, Power, PowerOff, AlertTriangle, CheckCircle, XCircle, Clock, Settings } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission } from "../types/auth";

type InstrumentStatus = "Ready" | "Processing" | "Maintenance" | "Error";

interface Instrument {
  id: string;
  name: string;
  serialNumber: string;
  type: string;
  status: InstrumentStatus;
  isActive: boolean;
  dateAdded: string;
  addedBy: string;
  deactivatedAt?: string;
  reagents?: string[];
  configurations?: string[];
}

const mockInstruments: Instrument[] = [
  {
    id: "INST-001",
    name: "Spectrophotometer UV-2600",
    serialNumber: "SP-2024-001",
    type: "Spectrophotometer",
    status: "Ready",
    isActive: true,
    dateAdded: "2024-10-01 08:30:00",
    addedBy: "manager@lab.com",
    reagents: ["Reagent A", "Reagent B"],
    configurations: ["General Config", "UV Config"],
  },
  {
    id: "INST-002",
    name: "Centrifuge CR-22N",
    serialNumber: "CF-2024-012",
    type: "Centrifuge",
    status: "Maintenance",
    isActive: true,
    dateAdded: "2024-09-15 14:20:00",
    addedBy: "service@lab.com",
    reagents: [],
    configurations: ["General Config"],
  },
  {
    id: "INST-003",
    name: "PCR Thermal Cycler",
    serialNumber: "PCR-2023-031",
    type: "PCR",
    status: "Ready",
    isActive: false,
    dateAdded: "2024-08-20 10:00:00",
    addedBy: "manager@lab.com",
    deactivatedAt: "2024-10-10 16:00:00",
  },
];

export function InstrumentManagement() {
  const { user } = useAuth();
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [cloneFromId, setCloneFromId] = useState("__none__");
  
  const [formData, setFormData] = useState({
    name: "",
    serialNumber: "",
    type: "",
    reagents: "",
    configurations: "",
  });

  const canAdd = user && hasPermission(user.role, "ADD_INSTRUMENT");
  const canActivateDeactivate = user && hasPermission(user.role, "ACTIVATE_DEACTIVATE_INSTRUMENT");
  const canCheckStatus = user && hasPermission(user.role, "CHECK_INSTRUMENT_STATUS");

  const filteredInstruments = instruments
    .filter(
      (inst) =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

  const handleAddInstrument = () => {
    // Validate required fields
    if (!formData.name || !formData.serialNumber || !formData.type) {
      toast.error("All required fields must be filled");
      return;
    }

    // Check for duplicate
    if (instruments.some(inst => inst.serialNumber === formData.serialNumber)) {
      toast.error("Instrument already exists", {
        description: `Serial number ${formData.serialNumber} is already in the system.`,
      });
      return;
    }

    const clonedInstrument = cloneFromId && cloneFromId !== "__none__"
      ? instruments.find(inst => inst.id === cloneFromId)
      : null;

    const newInstrument: Instrument = {
      id: `INST-${Date.now()}`,
      name: formData.name,
      serialNumber: formData.serialNumber,
      type: formData.type,
      status: "Ready",
      isActive: true,
      dateAdded: new Date().toISOString(),
      addedBy: user?.email || "unknown",
      reagents: formData.reagents
        ? formData.reagents.split(",").map(r => r.trim())
        : clonedInstrument?.reagents || [],
      configurations: formData.configurations
        ? formData.configurations.split(",").map(c => c.trim())
        : clonedInstrument?.configurations || [],
    };

    setInstruments([...instruments, newInstrument]);

    console.log("INSTRUMENT ADDED:", {
      instrumentId: newInstrument.id,
      name: newInstrument.name,
      serialNumber: newInstrument.serialNumber,
      reagents: newInstrument.reagents,
      configurations: newInstrument.configurations,
      userId: user?.id,
      userEmail: user?.email,
      timestamp: newInstrument.dateAdded,
    });

    toast.success("Instrument added successfully", {
      description: `${newInstrument.name} has been added to the system.`,
    });

    setIsAddDialogOpen(false);
    setFormData({ name: "", serialNumber: "", type: "", reagents: "", configurations: "" });
    setCloneFromId("__none__");
  };

  const handleCheckStatus = (instrument: Instrument) => {
    setSelectedInstrument(instrument);

    // Simulate status recheck for Error state
    if (instrument.status === "Error") {
      const canRecover = Math.random() > 0.5;
      
      setTimeout(() => {
        if (canRecover) {
          setInstruments(
            instruments.map(inst =>
              inst.id === instrument.id
                ? { ...inst, status: "Ready" as const }
                : inst
            )
          );
          toast.success("Instrument recovered", {
            description: `${instrument.name} is now Ready.`,
          });
          setSelectedInstrument({ ...instrument, status: "Ready" });
        } else {
          toast.error("Instrument still in Error state", {
            description: "Hardware diagnostics failed. Please contact technical support.",
          });
        }
      }, 1500);
    }

    setIsStatusDialogOpen(true);
  };

  const handleToggleActive = (instrument: Instrument) => {
    setSelectedInstrument(instrument);
    setIsActivateDialogOpen(true);
  };

  const handleConfirmToggleActive = () => {
    if (!selectedInstrument) return;

    const newActiveState = !selectedInstrument.isActive;
    const now = new Date().toISOString();

    setInstruments(
      instruments.map(inst =>
        inst.id === selectedInstrument.id
          ? {
              ...inst,
              isActive: newActiveState,
              deactivatedAt: newActiveState ? undefined : now,
            }
          : inst
      )
    );

    console.log(`INSTRUMENT ${newActiveState ? "ACTIVATED" : "DEACTIVATED"}:`, {
      instrumentId: selectedInstrument.id,
      instrumentName: selectedInstrument.name,
      previousState: selectedInstrument.isActive ? "Active" : "Inactive",
      newState: newActiveState ? "Active" : "Inactive",
      userId: user?.id,
      userEmail: user?.email,
      timestamp: now,
    });

    if (!newActiveState) {
      // Schedule auto-delete after 3 months
      console.log("AUTO-DELETE SCHEDULED:", {
        instrumentId: selectedInstrument.id,
        deleteAfter: "3 months",
        scheduledTime: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    toast.success(
      newActiveState ? "Instrument activated" : "Instrument deactivated",
      {
        description: newActiveState
          ? `${selectedInstrument.name} is now available for test orders.`
          : `${selectedInstrument.name} is marked inactive. Auto-delete scheduled in 3 months.`,
      }
    );

    setIsActivateDialogOpen(false);
    setSelectedInstrument(null);
  };

  const getStatusIcon = (status: InstrumentStatus) => {
    switch (status) {
      case "Ready":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Processing":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "Maintenance":
        return <Settings className="h-4 w-4 text-yellow-600" />;
      case "Error":
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: InstrumentStatus) => {
    switch (status) {
      case "Ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Error":
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-slate-800">Instrument Management</CardTitle>
            <CardDescription className="text-slate-600">
              Add, view, and manage laboratory instruments (Manager & Service User)
            </CardDescription>
          </div>
          {canAdd && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Instrument
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Instrument</DialogTitle>
                  <DialogDescription>
                    Create a new instrument with reagents and configurations
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">
                      Instrument Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Spectrophotometer UV-2600"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="serial">
                      Serial Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="serial"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      placeholder="e.g., SP-2024-001"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">
                      Instrument Type <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      placeholder="e.g., Spectrophotometer"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clone">Clone Settings From (Optional)</Label>
                    <Select value={cloneFromId} onValueChange={setCloneFromId}>
                      <SelectTrigger>
                        <SelectValue placeholder="None - Enter manually" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">None - Enter manually</SelectItem>
                        {instruments.filter(inst => inst.isActive).map((inst) => (
                          <SelectItem key={inst.id} value={inst.id}>
                            {inst.name} ({inst.serialNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reagents">Reagents (comma-separated, optional)</Label>
                    <Textarea
                      id="reagents"
                      value={formData.reagents}
                      onChange={(e) => setFormData({ ...formData, reagents: e.target.value })}
                      placeholder="e.g., Reagent A, Reagent B"
                      rows={2}
                      disabled={cloneFromId !== "__none__"}
                    />
                    {cloneFromId !== "__none__" && (
                      <p className="text-sm text-slate-500">
                        Will be cloned from selected instrument
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="configurations">Configurations (comma-separated, optional)</Label>
                    <Textarea
                      id="configurations"
                      value={formData.configurations}
                      onChange={(e) => setFormData({ ...formData, configurations: e.target.value })}
                      placeholder="e.g., General Config, Specific Config"
                      rows={2}
                      disabled={cloneFromId !== "__none__"}
                    />
                    {cloneFromId !== "__none__" && (
                      <p className="text-sm text-slate-500">
                        Will be cloned from selected instrument
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddInstrument}>
                    Add Instrument
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search instruments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Instruments Table */}
        {filteredInstruments.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-lg">
            <p>No Data</p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead>Instrument Name</TableHead>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInstruments.map((instrument) => (
                  <TableRow key={instrument.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{instrument.name}</TableCell>
                    <TableCell className="text-slate-600">{instrument.serialNumber}</TableCell>
                    <TableCell className="text-slate-600">{instrument.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(instrument.status)}
                        <Badge variant="outline" className={getStatusColor(instrument.status)}>
                          {instrument.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          instrument.isActive
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }
                      >
                        {instrument.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{instrument.dateAdded}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canCheckStatus && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => handleCheckStatus(instrument)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                        {canActivateDeactivate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={
                              instrument.isActive
                                ? "text-red-600 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50"
                            }
                            onClick={() => handleToggleActive(instrument)}
                          >
                            {instrument.isActive ? (
                              <PowerOff className="h-4 w-4" />
                            ) : (
                              <Power className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Status Check Dialog */}
        <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Instrument Status Check</DialogTitle>
              <DialogDescription>{selectedInstrument?.name}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <Label>Current Status</Label>
                  <div className="flex items-center gap-2">
                    {selectedInstrument && getStatusIcon(selectedInstrument.status)}
                    <Badge
                      variant="outline"
                      className={selectedInstrument ? getStatusColor(selectedInstrument.status) : ""}
                    >
                      {selectedInstrument?.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <Label>Serial Number</Label>
                  <span className="text-slate-700">{selectedInstrument?.serialNumber}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <Label>Type</Label>
                  <span className="text-slate-700">{selectedInstrument?.type}</span>
                </div>
              </div>
              {selectedInstrument?.status === "Error" && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Error Details:</strong> Hardware diagnostics failed. System will attempt auto-recovery.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsStatusDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Activate/Deactivate Confirmation Dialog */}
        <AlertDialog open={isActivateDialogOpen} onOpenChange={setIsActivateDialogOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedInstrument?.isActive ? "bg-red-100" : "bg-green-100"
                  }`}
                >
                  <AlertTriangle
                    className={`h-6 w-6 ${
                      selectedInstrument?.isActive ? "text-red-600" : "text-green-600"
                    }`}
                  />
                </div>
                <AlertDialogTitle>
                  {selectedInstrument?.isActive ? "Deactivate" : "Activate"} Instrument
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                {selectedInstrument?.isActive ? (
                  <>
                    Are you sure you want to deactivate <strong>{selectedInstrument?.name}</strong>?
                    <br />
                    <br />
                    • Instrument will be marked as unavailable
                    <br />
                    • No test orders can be assigned to this instrument
                    <br />
                    • <strong className="text-red-600">
                      Auto-delete will be scheduled in 3 months
                    </strong>
                    <br />
                    <br />
                    You can reactivate anytime to cancel auto-deletion.
                  </>
                ) : (
                  <>
                    Reactivate <strong>{selectedInstrument?.name}</strong>?
                    <br />
                    <br />
                    • Instrument will be available for test orders
                    <br />• Auto-delete schedule will be cancelled
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmToggleActive}
                className={
                  selectedInstrument?.isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }
              >
                {selectedInstrument?.isActive ? "Deactivate" : "Activate"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
