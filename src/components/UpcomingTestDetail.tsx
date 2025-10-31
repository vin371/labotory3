import { useState } from "react";
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  FlaskConical, 
  MapPin, 
  Phone, 
  Mail,
  AlertCircle,
  Download,
  Map,
  UserCircle,
  Stethoscope,
  Info
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { AddToCalendarModal } from "./AddToCalendarModal";

interface UpcomingTestDetailProps {
  open: boolean;
  onClose: () => void;
  testData: {
    testId: string;
    testName: string;
    department: string;
    labRoom: string;
    technician: string;
    date: string;
    time: string;
    duration: string;
    sampleType: string;
    status: "Scheduled" | "Confirmed" | "Pending";
  };
  patientData: {
    name: string;
    id: string;
    email: string;
    phone: string;
    age: string;
    gender: string;
  };
  labInfo: {
    address: string;
    hotline: string;
  };
}

export function UpcomingTestDetail({ 
  open, 
  onClose, 
  testData, 
  patientData, 
  labInfo 
}: UpcomingTestDetailProps) {
  const [showAddToCalendar, setShowAddToCalendar] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "bg-[#10B981] text-white";
      case "Scheduled": return "bg-[#2563EB] text-white";
      case "Pending": return "bg-[#F59E0B] text-white";
      default: return "bg-[#CBD5E1] text-[#0F172A]";
    }
  };

  const preparationInstructions = [
    "Do not eat or drink 8 hours before your test.",
    "Bring your ID card and previous test report.",
    "Arrive 15 minutes early for registration.",
    "Wear comfortable clothing with easy access to arms.",
  ];

  const handleAddToCalendar = () => {
    setShowAddToCalendar(true);
  };

  const handleCancelAppointment = () => {
    console.log("Cancelling appointment:", testData.testId);
    // In a real app, this would show a confirmation dialog and call an API
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl rounded-2xl max-h-[90vh] overflow-y-auto bg-white">
        {/* Header */}
        <DialogHeader className="relative pb-4 border-b border-[#CBD5E1]">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl text-[#0F172A] mb-2">
                Upcoming Test Appointment Details
              </DialogTitle>
              <p className="text-sm text-[#64748B]">
                Scheduled on {testData.date} at {testData.time}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(testData.status)}>
                {testData.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-xl hover:bg-[#E0F2FE]"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* Section 1: Patient Information */}
          <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#CBD5E1]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] flex items-center justify-center">
                <UserCircle className="h-5 w-5 text-[#2563EB]" />
              </div>
              <h3 className="text-lg text-[#0F172A]">Patient Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#64748B] mb-1">Patient Name</p>
                <p className="text-[#0F172A]">{patientData.name}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Patient ID</p>
                <p className="text-[#0F172A]">{patientData.id}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Email</p>
                <p className="text-[#0F172A]">{patientData.email}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Contact Number</p>
                <p className="text-[#0F172A]">{patientData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Age</p>
                <p className="text-[#0F172A]">{patientData.age} years old</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Gender</p>
                <p className="text-[#0F172A]">{patientData.gender}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Test Information */}
          <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#CBD5E1]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] flex items-center justify-center">
                <FlaskConical className="h-5 w-5 text-[#2563EB]" />
              </div>
              <h3 className="text-lg text-[#0F172A]">Test Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#64748B] mb-1">Test ID</p>
                <p className="text-[#0F172A]">{testData.testId}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Test Name</p>
                <p className="text-[#0F172A]">{testData.testName}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Department / Lab Room</p>
                <p className="text-[#0F172A]">{testData.department} – {testData.labRoom}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Assigned Technician</p>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-[#64748B]" />
                  <p className="text-[#0F172A]">{testData.technician}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#64748B]" />
                  <p className="text-[#0F172A]">{testData.date}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Time</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#64748B]" />
                  <p className="text-[#0F172A]">{testData.time}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Estimated Duration</p>
                <p className="text-[#0F172A]">{testData.duration}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Sample Type</p>
                <p className="text-[#0F172A]">{testData.sampleType}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Preparation Guidelines */}
          <div className="bg-[#E0F2FE] rounded-2xl p-6 border-l-4 border-[#2563EB]">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center flex-shrink-0">
                <Info className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg text-[#0F172A] mb-1">Preparation Instructions</h3>
                <p className="text-sm text-[#64748B]">Please follow these guidelines before your test</p>
              </div>
            </div>
            <ul className="space-y-3 ml-13">
              {preparationInstructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-[#0F172A] flex-1">{instruction}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Contact & Location Info */}
          <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#CBD5E1]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] flex items-center justify-center">
                <MapPin className="h-5 w-5 text-[#2563EB]" />
              </div>
              <h3 className="text-lg text-[#0F172A]">Contact & Location Info</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#64748B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#64748B] mb-1">Laboratory Address</p>
                  <p className="text-[#0F172A]">{labInfo.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#64748B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#64748B] mb-1">Hotline Number</p>
                  <p className="text-[#0F172A]">{labInfo.hotline}</p>
                </div>
              </div>

              <Separator className="bg-[#CBD5E1]" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-[#2563EB]" />
                  <p className="text-sm text-[#64748B]">View on Map</p>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[#CBD5E1] hover:bg-[#E0F2FE]"
                >
                  Open Map
                </Button>
              </div>

              <Alert className="bg-white border-[#CBD5E1]">
                <AlertCircle className="h-4 w-4 text-[#2563EB]" />
                <AlertDescription className="text-sm text-[#64748B]">
                  Need help? <a href="#" className="text-[#2563EB] hover:underline">Contact Support</a> for assistance.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#CBD5E1] mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-2xl border-[#CBD5E1] hover:bg-[#F8FAFC]"
          >
            Close
          </Button>
          <Button
            variant="outline"
            onClick={handleCancelAppointment}
            className="rounded-2xl border-[#EF4444] text-[#EF4444] hover:bg-red-50"
          >
            Cancel Appointment
          </Button>
          <Button
            onClick={handleAddToCalendar}
            className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white rounded-2xl"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add to Calendar
          </Button>
        </div>
      </DialogContent>

      {/* Add to Calendar Modal */}
      <AddToCalendarModal
        open={showAddToCalendar}
        onClose={() => setShowAddToCalendar(false)}
        appointmentData={{
          testName: testData.testName,
          date: testData.date,
          time: testData.time,
          location: testData.department,
          labRoom: testData.labRoom,
          technician: testData.technician,
          duration: testData.duration,
          status: testData.status
        }}
      />
    </Dialog>
  );
}
