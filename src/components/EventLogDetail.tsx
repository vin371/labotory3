import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ArrowLeft, FileText, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

interface EventLog {
  id: string;
  action: string;
  eventLogMessage: string;
  operator: string;
  dateTime: string;
  severity: "info" | "warning" | "error" | "success";
}

interface EventLogDetailProps {
  eventLog: EventLog | null;
  onBack: () => void;
}

export function EventLogDetail({ eventLog, onBack }: EventLogDetailProps) {
  if (!eventLog) {
    return (
      <Card className="shadow-lg border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-slate-800 mb-2">Event Log Not Found</h3>
            <p className="text-slate-600 mb-6">The requested event log could not be found.</p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Event Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-slate-800">Event Log Detail</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <CardDescription className="text-slate-600">
          Detailed information about the event log
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Event ID and Severity */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-slate-500">Event ID</Label>
              <p className="text-slate-800 text-lg">{eventLog.id}</p>
            </div>
            <Badge variant="outline" className={`${getSeverityColor(eventLog.severity)} text-lg px-4 py-1`}>
              {eventLog.severity.toUpperCase()}
            </Badge>
          </div>

          <Separator />

          {/* Action */}
          <div>
            <Label className="text-slate-500">Action</Label>
            <p className="text-slate-800 mt-1">{eventLog.action}</p>
          </div>

          <Separator />

          {/* Operator */}
          <div>
            <Label className="text-slate-500">Operator</Label>
            <p className="text-slate-800 mt-1">{eventLog.operator}</p>
          </div>

          <Separator />

          {/* Message Content */}
          <div>
            <Label className="text-slate-500">Message Content</Label>
            <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-slate-800">{eventLog.eventLogMessage}</p>
            </div>
          </div>

          <Separator />

          {/* Timestamp */}
          <div>
            <Label className="text-slate-500">Timestamp</Label>
            <p className="text-slate-800 mt-1">{eventLog.dateTime}</p>
          </div>

          <Separator />

          {/* Additional Details */}
          <div>
            <Label className="text-slate-500">Additional Details</Label>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-500">Event Type</p>
                <p className="text-slate-800">System Event</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-500">Source</p>
                <p className="text-slate-800">Laboratory Management System</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-500">Module</p>
                <p className="text-slate-800">{eventLog.action.split(' ')[0]}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-500">Status</p>
                <p className="text-slate-800">Recorded</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
