import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { AlertCircle, Save, RotateCcw, Bell, Package, Clock, Database } from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ManagerConfiguration() {
  const [config, setConfig] = useState({
    // Alert Settings
    lowStockAlert: true,
    lowStockThreshold: 100,
    criticalStockThreshold: 50,
    deviceErrorAlert: true,
    testDelayAlert: true,
    testDelayThreshold: 60,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    
    // Threshold Configuration
    reagentExpiryWarning: 30,
    instrumentMaintenanceReminder: 7,
    qualityControlFrequency: 24,
    
    // Daily Backup
    autoBackup: true,
    backupTime: "02:00",
  });

  const handleSave = () => {
    toast.success("Configuration saved successfully");
  };

  const handleReset = () => {
    setConfig({
      lowStockAlert: true,
      lowStockThreshold: 100,
      criticalStockThreshold: 50,
      deviceErrorAlert: true,
      testDelayAlert: true,
      testDelayThreshold: 60,
      emailNotifications: true,
      smsNotifications: false,
      inAppNotifications: true,
      reagentExpiryWarning: 30,
      instrumentMaintenanceReminder: 7,
      qualityControlFrequency: 24,
      autoBackup: true,
      backupTime: "02:00",
    });
    toast.info("Configuration reset to defaults");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#007BFF] mb-2">Configuration (Local Settings)</h1>
        <p className="text-[#6B7280]">Configure settings for your laboratory</p>
      </div>

      {/* Info Banner */}
      <Card className="shadow-lg border-[#90CAF9] rounded-xl bg-[#E3F2FD]">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#007BFF] mt-0.5" />
            <div>
              <p className="text-sm text-[#333333]">
                <span className="font-medium">Local Configuration:</span> These settings apply only to
                your laboratory. Global system policies are managed by administrators.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Settings */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-[#007BFF]">Alert Settings</CardTitle>
              <CardDescription>Configure alert thresholds and notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Low Stock Alert */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
                <p className="text-sm text-[#6B7280]">
                  Receive notifications when reagent stock is low
                </p>
              </div>
              <Switch
                id="lowStockAlert"
                checked={config.lowStockAlert}
                onCheckedChange={(checked) => setConfig({ ...config, lowStockAlert: checked })}
              />
            </div>

            {config.lowStockAlert && (
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={config.lowStockThreshold}
                    onChange={(e) =>
                      setConfig({ ...config, lowStockThreshold: parseInt(e.target.value) || 0 })
                    }
                    className="rounded-xl"
                  />
                  <p className="text-xs text-[#999999]">Units remaining</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="criticalStockThreshold">Critical Stock Threshold</Label>
                  <Input
                    id="criticalStockThreshold"
                    type="number"
                    value={config.criticalStockThreshold}
                    onChange={(e) =>
                      setConfig({ ...config, criticalStockThreshold: parseInt(e.target.value) || 0 })
                    }
                    className="rounded-xl"
                  />
                  <p className="text-xs text-[#999999]">Units remaining</p>
                </div>
              </div>
            )}

            <Separator />

            {/* Device Error Alert */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="deviceErrorAlert">Device Error Alert</Label>
                <p className="text-sm text-[#6B7280]">
                  Immediate notification for instrument errors
                </p>
              </div>
              <Switch
                id="deviceErrorAlert"
                checked={config.deviceErrorAlert}
                onCheckedChange={(checked) => setConfig({ ...config, deviceErrorAlert: checked })}
              />
            </div>

            <Separator />

            {/* Test Delay Alert */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="testDelayAlert">Test Delay Alert</Label>
                <p className="text-sm text-[#6B7280]">
                  Alert when tests exceed expected completion time
                </p>
              </div>
              <Switch
                id="testDelayAlert"
                checked={config.testDelayAlert}
                onCheckedChange={(checked) => setConfig({ ...config, testDelayAlert: checked })}
              />
            </div>

            {config.testDelayAlert && (
              <div className="pl-6">
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="testDelayThreshold">Delay Threshold (minutes)</Label>
                  <Input
                    id="testDelayThreshold"
                    type="number"
                    value={config.testDelayThreshold}
                    onChange={(e) =>
                      setConfig({ ...config, testDelayThreshold: parseInt(e.target.value) || 0 })
                    }
                    className="rounded-xl"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Threshold Configuration */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-[#007BFF]">Threshold Configuration</CardTitle>
              <CardDescription>Set operational thresholds for your lab</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reagentExpiryWarning">Reagent Expiry Warning (days)</Label>
              <Input
                id="reagentExpiryWarning"
                type="number"
                value={config.reagentExpiryWarning}
                onChange={(e) =>
                  setConfig({ ...config, reagentExpiryWarning: parseInt(e.target.value) || 0 })
                }
                className="rounded-xl"
              />
              <p className="text-xs text-[#999999]">Days before expiry</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instrumentMaintenanceReminder">Maintenance Reminder (days)</Label>
              <Input
                id="instrumentMaintenanceReminder"
                type="number"
                value={config.instrumentMaintenanceReminder}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    instrumentMaintenanceReminder: parseInt(e.target.value) || 0,
                  })
                }
                className="rounded-xl"
              />
              <p className="text-xs text-[#999999]">Days before maintenance</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualityControlFrequency">QC Frequency (hours)</Label>
              <Input
                id="qualityControlFrequency"
                type="number"
                value={config.qualityControlFrequency}
                onChange={(e) =>
                  setConfig({ ...config, qualityControlFrequency: parseInt(e.target.value) || 0 })
                }
                className="rounded-xl"
              />
              <p className="text-xs text-[#999999]">Hours between QC checks</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Bell className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-[#007BFF]">Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-[#6B7280]">Receive alerts via email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={config.emailNotifications}
                onCheckedChange={(checked) => setConfig({ ...config, emailNotifications: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <p className="text-sm text-[#6B7280]">Receive critical alerts via SMS</p>
              </div>
              <Switch
                id="smsNotifications"
                checked={config.smsNotifications}
                onCheckedChange={(checked) => setConfig({ ...config, smsNotifications: checked })}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="inAppNotifications">In-App Notifications</Label>
                <p className="text-sm text-[#6B7280]">Show notifications in the portal</p>
              </div>
              <Switch
                id="inAppNotifications"
                checked={config.inAppNotifications}
                onCheckedChange={(checked) => setConfig({ ...config, inAppNotifications: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Backup */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Database className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-[#007BFF]">Daily Backup (Lab Only)</CardTitle>
              <CardDescription>Automatic backup for laboratory data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="autoBackup">Enable Automatic Backup</Label>
                <p className="text-sm text-[#6B7280]">Daily backup of lab data</p>
              </div>
              <Switch
                id="autoBackup"
                checked={config.autoBackup}
                onCheckedChange={(checked) => setConfig({ ...config, autoBackup: checked })}
              />
            </div>

            {config.autoBackup && (
              <>
                <Separator />
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="backupTime">Backup Time</Label>
                  <Input
                    id="backupTime"
                    type="time"
                    value={config.backupTime}
                    onChange={(e) => setConfig({ ...config, backupTime: e.target.value })}
                    className="rounded-xl"
                  />
                  <p className="text-xs text-[#999999]">Scheduled backup time (24-hour format)</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} className="bg-[#007BFF] hover:bg-[#0056D2] rounded-xl">
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="rounded-xl border-[#E0E6ED]"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
