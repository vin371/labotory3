import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ArrowLeft, UserCircle, AlertCircle, Calendar, Phone, Mail, MapPin, TestTube, Activity, FileText, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission } from "../types/auth";
import { AccessDenied } from "./AccessDenied";

interface PatientRecord {
  id: string;
  patientId: string;
  fullName: string;
  dateOfBirth: string;
  lastTestDate: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  testType: string;
  instrumentUsed: string;
  status: "Complete" | "Incomplete" | "Flagged";
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface PatientDetailProps {
  patient: PatientRecord | null;
  onBack: () => void;
}

export function PatientDetail({ patient, onBack }: PatientDetailProps) {
  const { user } = useAuth();
  
  // Check access permission - ONLY Lab User
  const canAccess = user && hasPermission(user.role, "VIEW_PATIENT_DETAIL");

  if (!canAccess) {
    return <AccessDenied onBack={onBack} />;
  }

  if (!patient) {
    return (
      <Card className="shadow-lg border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-slate-800 mb-2">Patient Record Not Found</h3>
            <p className="text-slate-600 mb-6">The requested patient medical record could not be found.</p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patient Records
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-100 text-green-800 border-green-200";
      case "Incomplete":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Flagged":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-slate-800">Patient Medical Record Detail</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        <CardDescription className="text-slate-600">
          Complete patient information and medical test history (Read-only for audit tracking)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Patient ID and Status */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <Label className="text-slate-500 text-sm">Patient ID</Label>
              <p className="text-slate-800 text-xl">{patient.patientId}</p>
            </div>
            <div className="flex items-center gap-3">
              {patient.status === "Flagged" && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">Requires Attention</span>
                </div>
              )}
              <Badge variant="outline" className={`${getStatusColor(patient.status)} text-lg px-4 py-1`}>
                {patient.status}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Patient Demographics */}
          <div>
            <h3 className="text-slate-800 mb-4 flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-blue-600" />
              Patient Demographics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Label className="text-slate-500 text-sm">Full Name</Label>
                <p className="text-slate-800 mt-1">{patient.fullName}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Label className="text-slate-500 text-sm">Gender</Label>
                <p className="text-slate-800 mt-1">{patient.gender}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <Label className="text-slate-500 text-sm">Date of Birth</Label>
                </div>
                <p className="text-slate-800">{patient.dateOfBirth}</p>
                <p className="text-slate-500 text-sm mt-1">Age: {calculateAge(patient.dateOfBirth)} years</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-slate-500" />
                  <Label className="text-slate-500 text-sm">Phone</Label>
                </div>
                <p className="text-slate-800">{patient.phone || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="text-slate-800 mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <Label className="text-slate-500 text-sm">Email Address</Label>
                </div>
                <p className="text-slate-800">{patient.email || "N/A"}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  <Label className="text-slate-500 text-sm">Address</Label>
                </div>
                <p className="text-slate-800">{patient.address || "N/A"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Test Information */}
          <div>
            <h3 className="text-slate-800 mb-4 flex items-center gap-2">
              <TestTube className="h-5 w-5 text-blue-600" />
              Test Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Label className="text-slate-500 text-sm">Test Type</Label>
                <p className="text-slate-800 mt-1">{patient.testType}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="h-4 w-4 text-slate-500" />
                  <Label className="text-slate-500 text-sm">Instrument Used</Label>
                </div>
                <p className="text-slate-800">{patient.instrumentUsed || "N/A"}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <Label className="text-slate-500 text-sm">Last Test Date</Label>
                </div>
                <p className="text-slate-800">{patient.lastTestDate}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Label className="text-slate-500 text-sm">Test Status</Label>
                <Badge variant="outline" className={`${getStatusColor(patient.status)} mt-2`}>
                  {patient.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Clinical Notes */}
          <div>
            <h3 className="text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Clinical Notes
            </h3>
            <div className={`p-4 rounded-lg border ${
              patient.status === "Flagged" 
                ? "bg-red-50 border-red-200" 
                : "bg-slate-50 border-slate-200"
            }`}>
              <p className={`${patient.status === "Flagged" ? "text-red-800" : "text-slate-800"}`}>
                {patient.notes || "No notes available"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Audit Information */}
          <div>
            <h3 className="text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Audit Trail
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Label className="text-slate-500 text-sm">Created At</Label>
                <p className="text-slate-800 mt-1 text-sm">{patient.createdAt}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Label className="text-slate-500 text-sm">Last Updated</Label>
                <p className="text-slate-800 mt-1 text-sm">{patient.updatedAt}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <Label className="text-slate-500 text-sm">Created By</Label>
                <p className="text-slate-800 mt-1 text-sm">{patient.createdBy}</p>
              </div>
            </div>
          </div>

          {/* Warning for Flagged Status */}
          {patient.status === "Flagged" && (
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800">
                    <strong>⚠️ Flagged Record:</strong> This patient record has been flagged and requires immediate attention from a medical professional. Please review the clinical notes and test results carefully.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Incomplete Status Notice */}
          {patient.status === "Incomplete" && (
            <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> This record is marked as incomplete. Additional samples or test results may be pending.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
