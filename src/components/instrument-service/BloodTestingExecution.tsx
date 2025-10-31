import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { TestTube, Play, AlertCircle, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../../contexts/AuthContext";

interface Sample {
  barcode: string;
  testOrderId: string;
  status: "Pending" | "Processing" | "Completed" | "Error" | "Skipped";
  progress: number;
}

export function BloodTestingExecution() {
  const { user } = useAuth();
  const [barcode, setBarcode] = useState("");
  const [samples, setSamples] = useState<Sample[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSample, setCurrentSample] = useState<Sample | null>(null);
  const [reagentLevel, setReagentLevel] = useState(85); // Mock reagent level

  const handleScanBarcode = () => {
    if (!barcode.trim()) {
      toast.error("Barcode is required");
      return;
    }

    // Check if barcode is valid
    if (barcode.length < 5) {
      toast.error("Invalid barcode", {
        description: "Sample skipped and logged.",
      });
      console.log("INVALID BARCODE SKIPPED:", {
        barcode,
        timestamp: new Date().toISOString(),
        userId: user?.id,
      });
      setBarcode("");
      return;
    }

    // Check if test order exists (mock logic)
    const hasTestOrder = Math.random() > 0.3;
    let testOrderId = "";

    if (!hasTestOrder) {
      // Auto-create test order
      testOrderId = `TO-AUTO-${Date.now()}`;
      toast.warning("Test Order Created Automatically", {
        description: `New Test Order: ${testOrderId}. Please update patient info later.`,
      });
      console.log("AUTO TEST ORDER CREATED:", {
        testOrderId,
        barcode,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });
    } else {
      testOrderId = `TO-${Math.floor(Math.random() * 1000)}`;
    }

    const newSample: Sample = {
      barcode,
      testOrderId,
      status: "Pending",
      progress: 0,
    };

    setSamples([...samples, newSample]);
    setBarcode("");
    toast.success(`Sample added: ${newSample.barcode}`);
  };

  const handleRunAnalysis = async () => {
    if (samples.length === 0) {
      toast.error("No samples to process");
      return;
    }

    // Check reagent level
    if (reagentLevel < 20) {
      toast.error("Insufficient Reagent", {
        description: `Reagent level: ${reagentLevel}%. Minimum 20% required.`,
      });
      console.log("INSUFFICIENT REAGENT:", {
        reagentLevel,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    setIsRunning(true);

    // Process samples sequentially
    for (let i = 0; i < samples.length; i++) {
      const sample = samples[i];
      if (sample.status === "Completed" || sample.status === "Error") continue;

      setCurrentSample(sample);

      // Update to Processing
      setSamples(prev =>
        prev.map((s, idx) =>
          idx === i ? { ...s, status: "Processing" as const } : s
        )
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setSamples(prev =>
          prev.map((s, idx) =>
            idx === i ? { ...s, progress } : s
          )
        );
      }

      // Complete or error (90% success rate)
      const success = Math.random() > 0.1;
      setSamples(prev =>
        prev.map((s, idx) =>
          idx === i
            ? {
                ...s,
                status: success ? ("Completed" as const) : ("Error" as const),
                progress: 100,
              }
            : s
        )
      );

      if (success) {
        toast.success(`Sample ${sample.barcode} completed`);
        // Publish HL7 message (mock)
        console.log("HL7 PUBLISHED:", {
          barcode: sample.barcode,
          testOrderId: sample.testOrderId,
          timestamp: new Date().toISOString(),
          userId: user?.id,
        });
      } else {
        toast.error(`Sample ${sample.barcode} failed`);
      }

      // Decrease reagent level
      setReagentLevel(prev => Math.max(0, prev - 5));
    }

    setIsRunning(false);
    setCurrentSample(null);
    toast.success("Blood testing completed", {
      description: "Instrument status: Available",
    });

    console.log("BLOOD TESTING COMPLETED:", {
      totalSamples: samples.length,
      successful: samples.filter(s => s.status === "Completed").length,
      failed: samples.filter(s => s.status === "Error").length,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
  };

  const handleClearCompleted = () => {
    setSamples(samples.filter(s => s.status !== "Completed"));
  };

  const getStatusIcon = (status: Sample["status"]) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Processing":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case "Error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "Skipped":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <TestTube className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: Sample["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Error":
        return "bg-red-100 text-red-800 border-red-200";
      case "Skipped":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Reagent Level Indicator */}
      <Card className="shadow-lg border-slate-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <Label>Reagent Level</Label>
            <span className={`${reagentLevel < 20 ? "text-red-600" : "text-green-600"}`}>
              {reagentLevel}%
            </span>
          </div>
          <Progress
            value={reagentLevel}
            className={`h-3 ${reagentLevel < 20 ? "bg-red-100" : ""}`}
          />
          {reagentLevel < 20 && (
            <p className="text-sm text-red-600 mt-2">
              ⚠️ Low reagent level. Refill required before running tests.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Sample Input */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
          <CardTitle className="text-slate-800">Blood Sample Analysis</CardTitle>
          <CardDescription className="text-slate-600">
            Scan barcode and execute blood testing workflow
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="barcode">Sample Barcode</Label>
              <Input
                id="barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleScanBarcode()}
                placeholder="Scan or enter barcode..."
                disabled={isRunning}
                className="mt-1"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                onClick={handleScanBarcode}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Add Sample
              </Button>
              <Button
                onClick={handleRunAnalysis}
                disabled={isRunning || samples.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Queue */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-800">Sample Queue ({samples.length})</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCompleted}
              disabled={!samples.some(s => s.status === "Completed")}
            >
              Clear Completed
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {samples.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <TestTube className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No samples in queue. Add samples to begin testing.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {samples.map((sample, idx) => (
                <Card key={idx} className="border-slate-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(sample.status)}
                        <div>
                          <p className="text-slate-800">Barcode: {sample.barcode}</p>
                          <p className="text-sm text-slate-600">Test Order: {sample.testOrderId}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={getStatusColor(sample.status)}>
                        {sample.status}
                      </Badge>
                    </div>
                    {sample.status === "Processing" && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-600">Progress</span>
                          <span className="text-sm text-blue-600">{sample.progress}%</span>
                        </div>
                        <Progress value={sample.progress} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> If Test Order Service is unavailable, the run will execute and sync results when service is restored. Results are automatically published to HL7 upon completion.
        </p>
      </div>
    </div>
  );
}
