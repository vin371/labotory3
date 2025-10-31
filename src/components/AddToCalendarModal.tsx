import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2,
  X,
  Check
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface AddToCalendarModalProps {
  open: boolean;
  onClose: () => void;
  appointmentData: {
    testName: string;
    date: string;
    time: string;
    location: string;
    labRoom: string;
    technician: string;
    duration: string;
    status: string;
  };
}

type CalendarPlatform = "google" | "outlook" | "apple" | null;
type ReminderTime = "30min" | "1hour" | "1day";

export function AddToCalendarModal({ 
  open, 
  onClose, 
  appointmentData 
}: AddToCalendarModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<CalendarPlatform>(null);
  const [reminderTime, setReminderTime] = useState<ReminderTime>("1hour");

  const calendarOptions = [
    {
      id: "google" as CalendarPlatform,
      name: "Google Calendar",
      icon: "🗓️",
      description: "Add to Google Calendar"
    },
    {
      id: "outlook" as CalendarPlatform,
      name: "Outlook Calendar",
      icon: "💻",
      description: "Add to Outlook Calendar"
    },
    {
      id: "apple" as CalendarPlatform,
      name: "Apple Calendar",
      icon: "🍎",
      description: "Add to Apple Calendar (iCal)"
    }
  ];

  const reminderOptions = [
    { id: "30min" as ReminderTime, label: "30 minutes before", value: "30" },
    { id: "1hour" as ReminderTime, label: "1 hour before", value: "60" },
    { id: "1day" as ReminderTime, label: "1 day before", value: "1440" }
  ];

  const handleAddToCalendar = () => {
    if (!selectedPlatform) {
      toast.error("Please select a calendar platform", {
        description: "Choose Google Calendar, Outlook, or Apple Calendar",
        duration: 3000,
      });
      return;
    }

    // Create calendar event data
    const eventData = {
      title: `Lab Test: ${appointmentData.testName}`,
      description: `Laboratory test appointment at ${appointmentData.location}. Assigned to ${appointmentData.technician}. Duration: ${appointmentData.duration}`,
      location: `${appointmentData.location} - ${appointmentData.labRoom}`,
      startDateTime: new Date(`${appointmentData.date} ${appointmentData.time}`),
      reminder: reminderOptions.find(r => r.id === reminderTime)?.label
    };

    // In a real app, this would generate platform-specific calendar links
    console.log("Adding to calendar:", selectedPlatform, eventData);

    // Show success message
    toast.success("✅ Appointment successfully added to your calendar!", {
      description: `Added to ${calendarOptions.find(c => c.id === selectedPlatform)?.name}`,
      duration: 4000,
    });

    // Close modal after brief delay
    setTimeout(() => {
      onClose();
      // Reset state
      setSelectedPlatform(null);
      setReminderTime("1hour");
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] rounded-2xl bg-white">
        {/* Header */}
        <DialogHeader className="relative pb-4 border-b border-[#CBD5E1]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-2xl bg-[#E0F2FE] flex items-center justify-center">
                <Calendar className="h-5 w-5 text-[#2563EB]" />
              </div>
              <div>
                <DialogTitle className="text-xl text-[#0F172A]">
                  Add Test Appointment to Calendar
                </DialogTitle>
                <p className="text-sm text-[#64748B] mt-1">
                  Save your upcoming test schedule to your calendar.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-xl hover:bg-[#E0F2FE]"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* Appointment Details Card */}
          <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-[#CBD5E1]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#0F172A]">Appointment Details</h3>
              <Badge className="bg-[#10B981] text-white">
                {appointmentData.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#64748B] mb-1">Test Name</p>
                <p className="text-[#0F172A]">{appointmentData.testName}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#64748B]" />
                  <p className="text-[#0F172A]">{appointmentData.date}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Time</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#64748B]" />
                  <p className="text-[#0F172A]">{appointmentData.time}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Duration</p>
                <p className="text-[#0F172A]">{appointmentData.duration}</p>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Location</p>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#64748B]" />
                  <p className="text-[#0F172A]">{appointmentData.labRoom}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#64748B] mb-1">Technician</p>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#64748B]" />
                  <p className="text-[#0F172A]">{appointmentData.technician}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Options Section */}
          <div>
            <h3 className="text-[#0F172A] mb-3">Choose calendar platform</h3>
            <div className="grid grid-cols-1 gap-3">
              {calendarOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedPlatform(option.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                    selectedPlatform === option.id
                      ? "border-[#2563EB] bg-[#E0F2FE]"
                      : "border-[#CBD5E1] bg-white hover:bg-[#F8FAFC]"
                  }`}
                >
                  <div className="text-2xl">{option.icon}</div>
                  <div className="flex-1 text-left">
                    <p className="text-[#0F172A]">{option.name}</p>
                    <p className="text-sm text-[#64748B]">{option.description}</p>
                  </div>
                  {selectedPlatform === option.id && (
                    <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Settings Section */}
          <div>
            <h3 className="text-[#0F172A] mb-3">Set reminder</h3>
            <RadioGroup value={reminderTime} onValueChange={(value) => setReminderTime(value as ReminderTime)}>
              <div className="space-y-3">
                {reminderOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`flex items-center space-x-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      reminderTime === option.id
                        ? "border-[#2563EB] bg-[#E0F2FE]"
                        : "border-[#CBD5E1] bg-white hover:bg-[#F8FAFC]"
                    }`}
                    onClick={() => setReminderTime(option.id)}
                  >
                    <RadioGroupItem value={option.id} id={option.id} className="border-[#2563EB]" />
                    <Label 
                      htmlFor={option.id} 
                      className="text-[#0F172A] cursor-pointer flex-1"
                    >
                      {option.label}
                    </Label>
                    {reminderTime === option.id && (
                      <CheckCircle2 className="h-5 w-5 text-[#2563EB]" />
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#CBD5E1] mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-2xl border-[#CBD5E1] hover:bg-[#F8FAFC]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddToCalendar}
            disabled={!selectedPlatform}
            className="bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add to Calendar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
