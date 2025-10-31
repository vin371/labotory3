import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { RefreshCw, CheckCircle, Settings, AlertTriangle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../../contexts/AuthContext";

interface SyncHistory {
  id: string;
  instrumentId: string;
  instrumentType: string;
  syncedAt: string;
  syncedBy: string;
  configType: string;
  status: "Success" | "Failed";
}

const mockInstruments = [
  { id: "INST-001", name: "Spectrophotometer UV-2600", type: "Spectrophotometer" },
  { id: "INST-002", name: "Centrifuge CR-22N", type: "Centrifuge" },
  { id: "INST-003", name: "PCR Thermal Cycler", type: "PCR" },
];

const mockSyncHistory: SyncHistory[] = [
  {
    id: "SYNC-001",
    instrumentId: "INST-001",
    instrumentType: "Spectrophotometer",
    syncedAt: "2024-10-15 14:30:00",
    syncedBy: "labuser@lab.com",
    configType: "General + Specific",
    status: "Success",
  },
  {
    id: "SYNC-002",
    instrumentId: "INST-002",
    instrumentType: "Centrifuge",
    syncedAt: "2024-10-14 10:20:00",
    syncedBy: "labuser@lab.com",
    configType: "General + Specific",
    status: "Success",
  },
];

export function ConfigurationSync() {
  const { user } = useAuth();
  const [selectedInstrumentId, setSelectedInstrumentId] = useState("");
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>(mockSyncHistory);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncConfiguration = () => {
    if (!selectedInstrumentId) {
      toast.error("Please select an instrument");
      return;
    }

    const instrument = mockInstruments.find((inst) => inst.id === selectedInstrumentId);
    if (!instrument) {
      toast.error("Instrument not found", {
        description: "The specified instrument ID is not found.",
      });
      return;
    }

    setIsSyncing(true);

    // Simulate sync process
    setTimeout(() => {
      // Check if configurations exist (mock logic)
      const hasGeneralConfig = true;
      const hasSpecificConfig = Math.random() > 0.1; // 90% success rate

      if (!hasGeneralConfig || !hasSpecificConfig) {
        toast.error("Configuration set not found", {
          description: `Missing ${!hasGeneralConfig ? "General" : "Specific"} Configuration for ${instrument.type}`,
        });
        setIsSyncing(false);
        return;
      }

      // Create sync history entry
      const newSyncEntry: SyncHistory = {
        id: `SYNC-${Date.now()}`,
        instrumentId: instrument.id,
        instrumentType: instrument.type,
        syncedAt: new Date().toISOString(),
        syncedBy: user?.email || "unknown",
        configType: "General + Specific",
        status: "Success",
      };

      setSyncHistory([newSyncEntry, ...syncHistory]);

      // Log event
      console.log("CONFIGURATION SYNCED:", {
        instrumentId: instrument.id,
        instrumentType: instrument.type,
        configurationType: "General + Specific",
        userId: user?.id,
        userEmail: user?.email,
        timestamp: newSyncEntry.syncedAt,
      });

      toast.success("Sync completed successfully", {
        description: `Configurations synced for ${instrument.name}`,
      });

      setIsSyncing(false);
      setSelectedInstrumentId("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Sync Configuration Card */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-slate-800">Sync-Up Configuration</CardTitle>
          </div>
          <CardDescription className="text-slate-600">
            Synchronize General and Specific configurations to instruments
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="instrument">Select Instrument</Label>
              <Select value={selectedInstrumentId} onValueChange={setSelectedInstrumentId} disabled={isSyncing}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an instrument..." />
                </SelectTrigger>
                <SelectContent>
                  {mockInstruments.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>
                      {inst.name} ({inst.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-blue-800">
                    <strong>Configuration Types:</strong>
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>
                      <strong>General Configurations:</strong> Apply universally to all instruments (e.g., default
                      temperature, calibration interval)
                    </li>
                    <li>
                      <strong>Specific Configurations:</strong> Tailored to instrument type (e.g., UV wavelength
                      range for Spectrophotometer, Max RPM for Centrifuge)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSyncConfiguration}
              disabled={!selectedInstrumentId || isSyncing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing Configurations...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Configurations Now
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration History */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
          <CardTitle className="text-slate-800">Configuration History</CardTitle>
          <CardDescription className="text-slate-600">
            Past configuration synchronization records
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead>Instrument ID</TableHead>
                  <TableHead>Instrument Type</TableHead>
                  <TableHead>Configuration Type</TableHead>
                  <TableHead>Synced At</TableHead>
                  <TableHead>Synced By</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syncHistory.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{entry.instrumentId}</TableCell>
                    <TableCell className="text-slate-600">{entry.instrumentType}</TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-sm">
                        {entry.configType}
                      </code>
                    </TableCell>
                    <TableCell className="text-slate-600">{entry.syncedAt}</TableCell>
                    <TableCell className="text-slate-600">{entry.syncedBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {entry.status === "Success" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={
                            entry.status === "Success" ? "text-green-600" : "text-red-600"
                          }
                        >
                          {entry.status}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Info Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800">
              <strong>Important:</strong> System validates instrument type and fetches both General and Specific
              configurations. If any configuration set is missing, sync will fail and display an error.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
