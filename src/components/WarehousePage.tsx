import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Package, FlaskConical, Settings } from "lucide-react";
import { InstrumentManagement } from "./InstrumentManagement";
import { ReagentHistory } from "./ReagentHistory";
import { Configuration } from "./Configuration";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission } from "../types/auth";
import { AccessDenied } from "./AccessDenied";

export function WarehousePage() {
  const { user } = useAuth();

  // Check permissions based on role
  const canViewInstruments = user && hasPermission(user.role, "VIEW_ALL_INSTRUMENTS");
  const canViewReagentHistory = user && hasPermission(user.role, "VIEW_REAGENT_VENDOR_SUPPLY");
  const canViewConfigurations = user && hasPermission(user.role, "VIEW_CONFIGURATIONS");
  const canViewWarehouse = user && hasPermission(user.role, "VIEW_WAREHOUSE");

  if (!canViewWarehouse) {
    return <AccessDenied />;
  }

  // Determine default tab based on role
  let defaultTab = "configuration"; // All 3 roles can view configuration
  if (canViewInstruments) defaultTab = "instruments";
  else if (canViewReagentHistory) defaultTab = "reagents";

  return (
    <div className="space-y-6">
      {/* Access Notice */}
      <Card className="shadow-lg border-slate-200 bg-gradient-to-r from-blue-50 to-slate-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-slate-800">
                <strong>Warehouse Service:</strong> Role-based access control active
              </p>
              <p className="text-sm text-slate-600 mt-1">
                {user?.role === "manager" && "Manager: Instrument Management + Configurations"}
                {user?.role === "service_user" && "Service User: Instrument Management + Configurations"}
                {user?.role === "lab_user" && "Lab User: Reagent History + Configurations"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm max-w-2xl">
          {canViewInstruments && (
            <TabsTrigger value="instruments" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Instruments
            </TabsTrigger>
          )}
          {canViewReagentHistory && (
            <TabsTrigger value="reagents" className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4" />
              Reagent History
            </TabsTrigger>
          )}
          {canViewConfigurations && (
            <TabsTrigger value="configuration" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
          )}
        </TabsList>

        {canViewInstruments && (
          <TabsContent value="instruments">
            <InstrumentManagement />
          </TabsContent>
        )}

        {canViewReagentHistory && (
          <TabsContent value="reagents">
            <ReagentHistory />
          </TabsContent>
        )}

        {canViewConfigurations && (
          <TabsContent value="configuration">
            <Configuration />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
