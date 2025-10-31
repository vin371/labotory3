import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Settings, FlaskConical, TestTube, Database, Activity, ShieldAlert, RefreshCw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission } from "../types/auth";
import { AccessDenied } from "./AccessDenied";
import { InstrumentModeControl } from "./instrument-service/InstrumentModeControl";
import { BloodTestingExecution } from "./instrument-service/BloodTestingExecution";
import { HL7PublishLogs } from "./instrument-service/HL7PublishLogs";
import { RawResultsManagement } from "./instrument-service/RawResultsManagement";
import { ReagentInstallation } from "./instrument-service/ReagentInstallation";
import { ConfigurationSync } from "./instrument-service/ConfigurationSync";

export function InstrumentService() {
  const { user } = useAuth();

  // Check access permission - ONLY Lab User
  const canAccess = user && hasPermission(user.role, "VIEW_INSTRUMENT_SERVICE");

  if (!canAccess) {
    return <AccessDenied />;
  }

  return (
    <div className="space-y-6">
      {/* Access Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Lab User Only:</strong> This Instrument Service is exclusively available to Lab User role for instrument operations and management.
            </p>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="mode" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm">
          <TabsTrigger value="mode" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Mode
          </TabsTrigger>
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Testing
          </TabsTrigger>
          <TabsTrigger value="reagents" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            Reagents
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="hl7" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            HL7
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Config
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mode">
          <InstrumentModeControl />
        </TabsContent>

        <TabsContent value="testing">
          <BloodTestingExecution />
        </TabsContent>

        <TabsContent value="reagents">
          <ReagentInstallation />
        </TabsContent>

        <TabsContent value="results">
          <RawResultsManagement />
        </TabsContent>

        <TabsContent value="hl7">
          <HL7PublishLogs />
        </TabsContent>

        <TabsContent value="config">
          <ConfigurationSync />
        </TabsContent>
      </Tabs>
    </div>
  );
}
