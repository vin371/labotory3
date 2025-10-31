import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  UserCircle, 
  Users, 
  Download, 
  Filter, 
  ArrowUpDown, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";

interface Patient {
  id: string;
  patientId: string;
  fullName: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  age: number;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  lastTestDate?: string;
  totalTests: number;
  status: "Active" | "Inactive";
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
}

const mockPatients: Patient[] = [
  {
    id: "1",
    patientId: "P-001",
    fullName: "John Smith",
    gender: "Male",
    dateOfBirth: "1985-01-12",
    age: 39,
    phone: "+84 912345678",
    email: "john.smith@email.com",
    address: "123 Main Street, District 1, Ho Chi Minh City",
    notes: "Regular checkup patient, no allergies",
    lastTestDate: "2025-10-14",
    totalTests: 12,
    status: "Active",
    createdAt: "2024-01-15",
    createdBy: "admin"
  },
  {
    id: "2",
    patientId: "P-002",
    fullName: "Emily Johnson",
    gender: "Female",
    dateOfBirth: "1992-05-20",
    age: 32,
    phone: "+84 923456789",
    email: "emily.j@email.com",
    address: "456 Oak Avenue, District 3, Ho Chi Minh City",
    notes: "Allergic to penicillin",
    lastTestDate: "2025-10-10",
    totalTests: 8,
    status: "Active",
    createdAt: "2024-02-20",
    createdBy: "manager"
  },
  {
    id: "3",
    patientId: "P-003",
    fullName: "Michael Brown",
    gender: "Male",
    dateOfBirth: "1978-11-08",
    age: 46,
    phone: "+84 934567890",
    email: "m.brown@email.com",
    address: "789 Pine Road, District 7, Ho Chi Minh City",
    lastTestDate: "2025-09-28",
    totalTests: 25,
    status: "Active",
    createdAt: "2023-11-10",
    createdBy: "admin"
  },
  {
    id: "4",
    patientId: "P-004",
    fullName: "Sarah Davis",
    gender: "Female",
    dateOfBirth: "1995-03-15",
    age: 29,
    phone: "+84 945678901",
    email: "sarah.d@email.com",
    address: "321 Elm Street, District 2, Ho Chi Minh City",
    notes: "Pregnant - 2nd trimester",
    lastTestDate: "2025-10-16",
    totalTests: 6,
    status: "Active",
    createdAt: "2024-06-05",
    createdBy: "admin"
  },
  {
    id: "5",
    patientId: "P-005",
    fullName: "Robert Wilson",
    gender: "Male",
    dateOfBirth: "1960-07-22",
    age: 64,
    phone: "+84 956789012",
    totalTests: 45,
    status: "Inactive",
    createdAt: "2022-03-12",
    createdBy: "manager"
  },
];

type SortField = "patientId" | "fullName" | "age" | "lastTestDate" | "totalTests";
type SortOrder = "asc" | "desc";

export function PatientManagement() {
  const { user: currentUser } = useAuth();
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterAgeRange, setFilterAgeRange] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("fullName");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "Male" as "Male" | "Female" | "Other",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    phone: "",
    dateOfBirth: "",
  });

  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Filter patients
  const filteredPatients = patients
    .filter((p) => !p.isDeleted)
    .filter((p) => {
      const matchesSearch =
        p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm);

      const matchesGender = filterGender === "all" || p.gender === filterGender;

      let matchesAge = true;
      if (filterAgeRange !== "all") {
        const age = p.age;
        switch (filterAgeRange) {
          case "0-18":
            matchesAge = age >= 0 && age <= 18;
            break;
          case "19-35":
            matchesAge = age >= 19 && age <= 35;
            break;
          case "36-50":
            matchesAge = age >= 36 && age <= 50;
            break;
          case "51+":
            matchesAge = age >= 51;
            break;
        }
      }

      return matchesSearch && matchesGender && matchesAge;
    });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let compareValue = 0;

    switch (sortField) {
      case "patientId":
        compareValue = a.patientId.localeCompare(b.patientId);
        break;
      case "fullName":
        compareValue = a.fullName.localeCompare(b.fullName);
        break;
      case "age":
        compareValue = a.age - b.age;
        break;
      case "lastTestDate":
        const dateA = a.lastTestDate ? new Date(a.lastTestDate).getTime() : 0;
        const dateB = b.lastTestDate ? new Date(b.lastTestDate).getTime() : 0;
        compareValue = dateA - dateB;
        break;
      case "totalTests":
        compareValue = a.totalTests - b.totalTests;
        break;
    }

    return sortOrder === "asc" ? compareValue : -compareValue;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPatients = sortedPatients.slice(startIndex, startIndex + itemsPerPage);

  // Statistics
  const stats = {
    total: patients.filter(p => !p.isDeleted).length,
    active: patients.filter(p => !p.isDeleted && p.status === "Active").length,
    male: patients.filter(p => !p.isDeleted && p.gender === "Male").length,
    female: patients.filter(p => !p.isDeleted && p.gender === "Female").length,
    other: patients.filter(p => !p.isDeleted && p.gender === "Other").length,
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      fullName: "",
      phone: "",
      dateOfBirth: "",
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    } else {
      // Check for duplicate phone (only on create)
      if (!selectedPatient) {
        const existingPatient = patients.find(
          p => p.phone === formData.phone && !p.isDeleted
        );
        if (existingPatient) {
          newErrors.phone = "Patient with this phone number already exists";
        }
      }
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleAdd = () => {
    if (!validateForm()) {
      toast.error("Validation failed", {
        description: "Please fix the errors in the form",
      });
      return;
    }

    const newPatient: Patient = {
      id: Date.now().toString(),
      patientId: `P-${String(patients.length + 1).padStart(3, "0")}`,
      ...formData,
      age: calculateAge(formData.dateOfBirth),
      totalTests: 0,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: currentUser?.fullName || "Unknown",
    };

    setPatients([...patients, newPatient]);
    setIsAddDialogOpen(false);
    resetForm();

    toast.success("✅ Patient record created successfully!", {
      description: `Patient ${newPatient.patientId} - ${newPatient.fullName} has been added.`,
    });

    console.log(`[PATIENT_CREATED] ID: ${newPatient.patientId}, Name: ${newPatient.fullName}, By: ${newPatient.createdBy}, At: ${newPatient.createdAt}`);
  };

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormData({
      fullName: patient.fullName,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth,
      phone: patient.phone,
      email: patient.email || "",
      address: patient.address || "",
      notes: patient.notes || "",
    });
    setErrors({ fullName: "", phone: "", dateOfBirth: "" });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!validateForm()) {
      toast.error("Validation failed", {
        description: "Please fix the errors in the form",
      });
      return;
    }

    if (selectedPatient) {
      const updatedPatient = {
        ...selectedPatient,
        ...formData,
        age: calculateAge(formData.dateOfBirth),
        updatedAt: new Date().toISOString().split("T")[0],
        updatedBy: currentUser?.fullName || "Unknown",
      };

      setPatients(
        patients.map((p) => (p.id === selectedPatient.id ? updatedPatient : p))
      );

      setIsEditDialogOpen(false);
      setSelectedPatient(null);
      resetForm();

      toast.success("✅ Patient information updated successfully!", {
        description: `${updatedPatient.fullName}'s information has been updated.`,
      });

      console.log(`[PATIENT_UPDATED] ID: ${updatedPatient.patientId}, By: ${updatedPatient.updatedBy}, At: ${updatedPatient.updatedAt}`);
    }
  };

  const handleDeleteClick = (patient: Patient) => {
    if (patient.isDeleted) {
      toast.error("Patient not found", {
        description: "This patient has already been deleted.",
      });
      return;
    }

    setPatientToDelete(patient);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (patientToDelete) {
      const deletedPatient = {
        ...patientToDelete,
        isDeleted: true,
        deletedAt: new Date().toISOString().split("T")[0],
        deletedBy: currentUser?.fullName || "Unknown",
      };

      setPatients(
        patients.map((p) => (p.id === patientToDelete.id ? deletedPatient : p))
      );

      toast.success("✅ Patient record deleted successfully!", {
        description: `Patient ${patientToDelete.patientId} - ${patientToDelete.fullName} has been removed.`,
      });

      console.log(`[PATIENT_DELETED] ID: ${patientToDelete.patientId}, Name: ${patientToDelete.fullName}, By: ${deletedPatient.deletedBy}, At: ${deletedPatient.deletedAt}`);

      setIsDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      gender: "Male",
      dateOfBirth: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    });
    setErrors({ fullName: "", phone: "", dateOfBirth: "" });
  };

  const handleExport = (format: "excel" | "pdf") => {
    toast.success(`Exporting to ${format.toUpperCase()}...`, {
      description: `${sortedPatients.length} patient records will be exported.`,
    });
  };

  // Recently added patients (last 5)
  const recentPatients = [...patients]
    .filter(p => !p.isDeleted)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span>Administration</span>
        <span>/</span>
        <span className="text-slate-800 font-medium">Patients</span>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-slate-800 mb-2">Patient Management</h1>
        <p className="text-slate-600">Manage patient information, medical history, and contact details.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-sm border-slate-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Patients</p>
                <p className="text-slate-800">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Active Patients</p>
                <p className="text-slate-800">{stats.active}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Male</p>
                <p className="text-slate-800">{stats.male}</p>
              </div>
              <UserCircle className="h-8 w-8 text-purple-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-gradient-to-br from-pink-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Female</p>
                <p className="text-slate-800">{stats.female}</p>
              </div>
              <UserCircle className="h-8 w-8 text-pink-600 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Others</p>
                <p className="text-slate-800">{stats.other}</p>
              </div>
              <UserCircle className="h-8 w-8 text-amber-600 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-800">Patients List</CardTitle>
                  <CardDescription className="text-slate-600">
                    Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedPatients.length)} of {sortedPatients.length} patients
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Top Action Bar */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Search */}
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search by name, ID, or phone number..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white border-slate-300"
                    />
                  </div>

                  {/* Gender Filter */}
                  <Select value={filterGender} onValueChange={setFilterGender}>
                    <SelectTrigger className="bg-white">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Age Range Filter */}
                  <Select value={filterAgeRange} onValueChange={setFilterAgeRange}>
                    <SelectTrigger className="bg-white">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Age Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      <SelectItem value="0-18">0-18 years</SelectItem>
                      <SelectItem value="19-35">19-35 years</SelectItem>
                      <SelectItem value="36-50">36-50 years</SelectItem>
                      <SelectItem value="51+">51+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
                    setIsAddDialogOpen(open);
                    if (!open) resetForm();
                  }}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Patient
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                      <DialogHeader>
                        <DialogTitle>Add New Patient</DialogTitle>
                        <DialogDescription>Enter patient information to create a new record</DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="flex-1 pr-4">
                        <div className="grid gap-4 py-4">
                          {/* Patient ID - Auto-generated */}
                          <div className="grid gap-2">
                            <Label>Patient ID</Label>
                            <Input
                              value={`P-${String(patients.length + 1).padStart(3, "0")}`}
                              readOnly
                              className="bg-slate-100 cursor-not-allowed"
                            />
                            <p className="text-xs text-slate-500">Auto-generated upon creation</p>
                          </div>

                          {/* Full Name */}
                          <div className="grid gap-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                              id="fullName"
                              value={formData.fullName}
                              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                              placeholder="Enter patient's full name"
                              className={errors.fullName ? "border-red-500" : ""}
                            />
                            {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
                          </div>

                          {/* Gender & Date of Birth */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                              <Label htmlFor="gender">Gender *</Label>
                              <Select
                                value={formData.gender}
                                onValueChange={(value) => setFormData({ ...formData, gender: value as any })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                              <Input
                                id="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                className={errors.dateOfBirth ? "border-red-500" : ""}
                              />
                              {errors.dateOfBirth && <p className="text-xs text-red-600">{errors.dateOfBirth}</p>}
                            </div>
                          </div>

                          {/* Phone Number */}
                          <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+84 912345678"
                              className={errors.phone ? "border-red-500" : ""}
                            />
                            {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
                          </div>

                          {/* Email */}
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email (Optional)</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="patient@email.com"
                            />
                          </div>

                          {/* Address */}
                          <div className="grid gap-2">
                            <Label htmlFor="address">Address (Optional)</Label>
                            <Textarea
                              id="address"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              placeholder="Enter full address"
                              rows={3}
                            />
                          </div>

                          {/* Notes */}
                          <div className="grid gap-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                              id="notes"
                              value={formData.notes}
                              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                              placeholder="Medical history, allergies, or other notes"
                              rows={3}
                            />
                          </div>
                        </div>
                      </ScrollArea>
                      <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleAdd}>
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Export Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport("excel")}
                      className="border-slate-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport("pdf")}
                      className="border-slate-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                {sortedPatients.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No patients found in the system.</p>
                    <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filters</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("patientId")}
                            className="hover:bg-slate-100 -ml-3"
                          >
                            Patient ID
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("fullName")}
                            className="hover:bg-slate-100 -ml-3"
                          >
                            Name
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("lastTestDate")}
                            className="hover:bg-slate-100 -ml-3"
                          >
                            Last Test
                            <ArrowUpDown className="ml-2 h-3 w-3" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPatients.map((patient) => (
                        <TableRow key={patient.id} className="hover:bg-slate-50">
                          <TableCell>
                            <code className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700">
                              {patient.patientId}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-slate-800">{patient.fullName}</p>
                              <p className="text-xs text-slate-500">{patient.age} years old</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                patient.gender === "Male"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : patient.gender === "Female"
                                  ? "bg-pink-50 text-pink-700 border-pink-200"
                                  : "bg-purple-50 text-purple-700 border-purple-200"
                              }
                            >
                              {patient.gender}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">{patient.dateOfBirth}</TableCell>
                          <TableCell className="text-slate-600">{patient.phone}</TableCell>
                          <TableCell className="text-slate-600">
                            {patient.lastTestDate || (
                              <span className="text-slate-400 italic">No tests</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 h-8 w-8 p-0"
                                onClick={() => handleView(patient)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 w-8 p-0"
                                onClick={() => handleEdit(patient)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                                onClick={() => handleDeleteClick(patient)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-slate-600">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="border-slate-300"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="border-slate-300"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Recently Added Patients */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
              <CardTitle className="text-slate-800">Recently Added</CardTitle>
              <CardDescription className="text-slate-600">Last 5 patients</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {recentPatients.map((patient) => (
                    <Card
                      key={patient.id}
                      className="shadow-sm border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleView(patient)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <UserCircle className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 truncate">{patient.fullName}</p>
                            <p className="text-xs text-slate-500 truncate">{patient.patientId}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              <p className="text-xs text-slate-500">{patient.createdAt}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Patient Details Modal */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>Complete patient information</DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 py-4">
                {/* Personal Info Section */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
                    <div>
                      <Label className="text-slate-500 text-xs">Patient ID</Label>
                      <code className="text-sm bg-white px-2 py-1 rounded text-blue-700 inline-block mt-1">
                        {selectedPatient.patientId}
                      </code>
                    </div>
                    <div>
                      <Label className="text-slate-500 text-xs">Status</Label>
                      <div className="mt-1">
                        <Badge
                          variant="outline"
                          className={
                            selectedPatient.status === "Active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                          }
                        >
                          {selectedPatient.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-slate-500 text-xs">Full Name</Label>
                      <p className="text-slate-800 font-medium mt-1">{selectedPatient.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500 text-xs">Gender</Label>
                      <p className="text-slate-800 mt-1">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500 text-xs">Age</Label>
                      <p className="text-slate-800 mt-1">{selectedPatient.age} years</p>
                    </div>
                    <div>
                      <Label className="text-slate-500 text-xs">Date of Birth</Label>
                      <p className="text-slate-800 mt-1">{selectedPatient.dateOfBirth}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500 text-xs">Phone</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <p className="text-slate-800">{selectedPatient.phone}</p>
                      </div>
                    </div>
                    {selectedPatient.email && (
                      <div className="col-span-2">
                        <Label className="text-slate-500 text-xs">Email</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <p className="text-slate-800">{selectedPatient.email}</p>
                        </div>
                      </div>
                    )}
                    {selectedPatient.address && (
                      <div className="col-span-2">
                        <Label className="text-slate-500 text-xs">Address</Label>
                        <div className="flex items-start gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-slate-400 mt-1 flex-shrink-0" />
                          <p className="text-slate-800">{selectedPatient.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Medical Info Section */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Medical Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
                    <div>
                      <Label className="text-slate-500 text-xs">Last Test Date</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <p className="text-slate-800">
                          {selectedPatient.lastTestDate || (
                            <span className="text-slate-400 italic">No tests yet</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-slate-500 text-xs">Total Tests Done</Label>
                      <p className="text-slate-800 mt-1">{selectedPatient.totalTests} tests</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Notes Section */}
                {selectedPatient.notes && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Notes
                      </h3>
                      <div className="bg-slate-50 rounded-lg p-4">
                        <p className="text-slate-800 text-sm">{selectedPatient.notes}</p>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Metadata */}
                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Record Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 rounded-lg p-4">
                    <div>
                      <Label className="text-slate-500 text-xs">Created At</Label>
                      <p className="text-slate-800 mt-1">{selectedPatient.createdAt}</p>
                    </div>
                    {selectedPatient.createdBy && (
                      <div>
                        <Label className="text-slate-500 text-xs">Created By</Label>
                        <p className="text-slate-800 mt-1">{selectedPatient.createdBy}</p>
                      </div>
                    )}
                    {selectedPatient.updatedAt && (
                      <>
                        <div>
                          <Label className="text-slate-500 text-xs">Last Updated</Label>
                          <p className="text-slate-800 mt-1">{selectedPatient.updatedAt}</p>
                        </div>
                        {selectedPatient.updatedBy && (
                          <div>
                            <Label className="text-slate-500 text-xs">Updated By</Label>
                            <p className="text-slate-800 mt-1">{selectedPatient.updatedBy}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          <DialogFooter className="mt-4">
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Patient Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open);
        if (!open) {
          resetForm();
          setSelectedPatient(null);
        }
      }}>
        <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Update Patient Information</DialogTitle>
            <DialogDescription>Edit patient details and medical information</DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-4">
            <div className="grid gap-4 py-4">
              {/* Full Name */}
              <div className="grid gap-2">
                <Label htmlFor="edit-fullName">Full Name *</Label>
                <Input
                  id="edit-fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
              </div>

              {/* Gender & Date of Birth */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="edit-dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className={errors.dateOfBirth ? "border-red-500" : ""}
                  />
                  {errors.dateOfBirth && <p className="text-xs text-red-600">{errors.dateOfBirth}</p>}
                </div>
              </div>

              {/* Phone Number */}
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number *</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email (Optional)</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Address */}
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address (Optional)</Label>
                <Textarea
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Notes */}
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Last Modified By */}
              {selectedPatient?.updatedBy && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">
                    Last modified by <span className="font-medium text-slate-700">{selectedPatient.updatedBy}</span> on{" "}
                    {selectedPatient.updatedAt}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleUpdate}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-slate-800">Delete Patient Record</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to delete this patient's record?{" "}
              <span className="font-semibold text-red-600">This action cannot be undone.</span>
            </AlertDialogDescription>
            {patientToDelete && (
              <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Name:</span>
                    <span className="font-medium text-slate-800">{patientToDelete.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">ID:</span>
                    <code className="text-xs bg-white px-2 py-1 rounded text-blue-700">
                      {patientToDelete.patientId}
                    </code>
                  </div>
                  {patientToDelete.lastTestDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Last Test Date:</span>
                      <span className="text-slate-800">{patientToDelete.lastTestDate}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-slate-100">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
