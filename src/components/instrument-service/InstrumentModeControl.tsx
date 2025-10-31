import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Settings, CheckCircle, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner@2.0.3";

type InstrumentMode = "Ready" | "Maintenance" | "Inactive";

interface Instrument {
  id: string;
  name: string;
  mode: InstrumentMode;
  lastChanged: string;
  changedBy: string;
}

const mockInstruments: Instrument[] = [
  { id: "INS-001", name: "Spectrophotometer UV-2600", mode: "Ready", lastChanged: "2024-10-15 08:30:00", changedBy: "labuser@lab.com" },
  { id: "INS-002", name: "Centrifuge CR-22N", mode: "Maintenance", lastChanged: "2024-10-14 15:20:00", changedBy: "labuser@lab.com" },
  { id: "INS-003", name: "PCR Thermal Cycler", mode: "Ready", lastChanged: "2024-10-15 09:00:00", changedBy: "labuser@lab.com" },
];

export function InstrumentModeControl() {
  const { user } = useAuth();
  const [instruments, setInstruments] = useState<Instrument[]>(mockInstruments);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [newMode, setNewMode] = useState<InstrumentMode>("Ready");
  const [reason, setReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQCConfirmOpen, setIsQCConfirmOpen] = useState(false);

  const handleModeChange = (instrument: Instrument, mode: InstrumentMode) => {
    setSelectedInstrument(instrument);
    setNewMode(mode);

    if (mode === "Ready") {
      // Require QC confirmation
      setIsQCConfirmOpen(true);
    } else {
      // Require reason input
      setReason("");
      setIsDialogOpen(true);
    }
  };

  const handleConfirmChange = () => {
    if (!selectedInstrument) return;

    // Validate reason for Maintenance/Inactive
    if ((newMode === "Maintenance" || newMode === "Inactive") && !reason.trim()) {
      toast.error("Reason is required", {
        description: "Please provide a reason for changing instrument mode.",
      });
      return;
    }

    // Update instrument mode
    setInstruments(
      instruments.map((inst) =>
        inst.id === selectedInstrument.id
          ? {
              ...inst,
              mode: newMode,
              lastChanged: new Date().toISOString(),
              changedBy: user?.email || "unknown",
            }
          : inst
      )
    );

    // Log event
    console.log("INSTRUMENT MODE CHANGED:", {
      instrumentId: selectedInstrument.id,
      previousMode: selectedInstrument.mode,
      newMode: newMode,
      reason: newMode !== "Ready" ? reason : "QC Completed",
      userId: user?.id,
      userEmail: user?.email,
      timestamp: new Date().toISOString(),
    });

    toast.success(`Instrument mode changed to ${newMode}`, {
      description: `${selectedInstrument.name} is now ${newMode}`,
    });

    setIsDialogOpen(false);
    setIsQCConfirmOpen(false);
    setSelectedInstrument(null);
    setReason("");
  };

  const getModeColor = (mode: InstrumentMode) => {
    switch (mode) {
      case "Ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getModeIcon = (mode: InstrumentMode) => {
    switch (mode) {
      case "Ready":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Maintenance":
      case "Inactive":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-slate-800">Instrument Mode Control</CardTitle>
        </div>
        <CardDescription className="text-slate-600">
          Change instrument operating modes (Ready / Maintenance / Inactive)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {instruments.map((instrument) => (
            <Card key={instrument.id} className="border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getModeIcon(instrument.mode)}
                      <h3 className="text-slate-800">{instrument.name}</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <Label className="text-slate-500">Instrument ID</Label>
                        <p className="text-slate-700">{instrument.id}</p>
                      </div>
                      <div>
                        <Label className="text-slate-500">Last Changed</Label>
                        <p className="text-slate-700">{instrument.lastChanged}</p>
                      </div>
                      <div>
                        <Label className="text-slate-500">Changed By</Label>
                        <p className="text-slate-700">{instrument.changedBy}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <Badge variant="outline" className={`${getModeColor(instrument.mode)} text-lg px-4 py-1`}>
                      {instrument.mode}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={instrument.mode === "Ready" ? "secondary" : "outline"}
                        onClick={() => handleModeChange(instrument, "Ready")}
                        disabled={instrument.mode === "Ready"}
                        className="bg-green-600 hover:bg-green-700 text-white disabled:bg-slate-200"
                      >
                        Ready
                      </Button>
                      <Button
                        size="sm"
                        variant={instrument.mode === "Maintenance" ? "secondary" : "outline"}
                        onClick={() => handleModeChange(instrument, "Maintenance")}
                        disabled={instrument.mode === "Maintenance"}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white disabled:bg-slate-200"
                      >
                        Maintenance
                      </Button>
                      <Button
                        size="sm"
                        variant={instrument.mode === "Inactive" ? "secondary" : "outline"}
                        onClick={() => handleModeChange(instrument, "Inactive")}
                        disabled={instrument.mode === "Inactive"}
                        className="bg-red-600 hover:bg-red-700 text-white disabled:bg-slate-200"
                      >
                        Inactive
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reason Input Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Change Instrument Mode to {newMode}</DialogTitle>
              <DialogDescription>
                Please provide a reason for changing to {newMode} mode
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason <span className="text-red-500">*</span></Label>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for mode change..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirmChange}>
                Confirm Change
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* QC Confirmation Dialog */}
        <AlertDialog open={isQCConfirmOpen} onOpenChange={setIsQCConfirmOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <AlertDialogTitle className="text-slate-800">Quality Check Confirmation</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-slate-600">
                Before changing to <strong>Ready</strong> mode, please confirm that Quality Check (QC) has been completed for <strong>{selectedInstrument?.name}</strong>.
                <br /><br />
                Has QC been successfully completed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-slate-100">No, Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmChange}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Yes, QC Completed
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
