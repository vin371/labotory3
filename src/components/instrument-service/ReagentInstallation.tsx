import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FlaskConical, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Badge } from "../ui/badge";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../../contexts/AuthContext";

interface Reagent {
  id: string;
  name: string;
  lotNumber: string;
  quantity: number;
  expirationDate: string;
  vendorName: string;
  vendorId: string;
  contactInfo: string;
  status: "In Use" | "Not In Use";
  installedDate: string;
  installedBy: string;
}

const mockReagents: Reagent[] = [
  {
    id: "RG-001",
    name: "Hemoglobin Reagent Kit",
    lotNumber: "LOT-2024-1001",
    quantity: 500,
    expirationDate: "2025-12-31",
    vendorName: "BioTech Supplies",
    vendorId: "V-001",
    contactInfo: "+84-28-1234-5678",
    status: "In Use",
    installedDate: "2024-10-01 09:00:00",
    installedBy: "labuser@lab.com",
  },
  {
    id: "RG-002",
    name: "Glucose Test Reagent",
    lotNumber: "LOT-2024-1002",
    quantity: 300,
    expirationDate: "2025-06-30",
    vendorName: "MedLab International",
    vendorId: "V-002",
    contactInfo: "+84-28-8765-4321",
    status: "Not In Use",
    installedDate: "2024-09-15 14:30:00",
    installedBy: "labuser@lab.com",
  },
];

export function ReagentInstallation() {
  const { user } = useAuth();
  const [reagents, setReagents] = useState<Reagent[]>(mockReagents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReagent, setSelectedReagent] = useState<Reagent | null>(null);
  const [reagentToDelete, setReagentToDelete] = useState<Reagent | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    lotNumber: "",
    quantity: "",
    expirationDate: "",
    vendorName: "",
    vendorId: "",
    contactInfo: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Reagent name is required";
    if (!formData.lotNumber.trim()) errors.lotNumber = "Lot number is required";
    if (!formData.quantity.trim() || parseInt(formData.quantity) <= 0) {
      errors.quantity = "Quantity must be greater than 0";
    }
    if (!formData.expirationDate.trim()) {
      errors.expirationDate = "Expiration date is required";
    } else {
      const expDate = new Date(formData.expirationDate);
      const today = new Date();
      if (expDate <= today) {
        errors.expirationDate = "Expiration date must be in the future";
      }
    }
    if (!formData.vendorName.trim()) errors.vendorName = "Vendor name is required";
    if (!formData.vendorId.trim()) errors.vendorId = "Vendor ID is required";
    if (!formData.contactInfo.trim()) errors.contactInfo = "Contact info is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInstall = () => {
    if (!validateForm()) return;

    const newReagent: Reagent = {
      id: `RG-${String(reagents.length + 1).padStart(3, '0')}`,
      name: formData.name,
      lotNumber: formData.lotNumber,
      quantity: parseInt(formData.quantity),
      expirationDate: formData.expirationDate,
      vendorName: formData.vendorName,
      vendorId: formData.vendorId,
      contactInfo: formData.contactInfo,
      status: "Not In Use",
      installedDate: new Date().toISOString(),
      installedBy: user?.email || "unknown",
    };

    setReagents([...reagents, newReagent]);
    
    console.log("REAGENT INSTALLED:", {
      reagentId: newReagent.id,
      lotNumber: newReagent.lotNumber,
      vendorId: newReagent.vendorId,
      userId: user?.id,
      timestamp: newReagent.installedDate,
    });

    toast.success("Reagent successfully installed", {
      description: `${newReagent.name} - Lot: ${newReagent.lotNumber}`,
    });

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleModify = (reagent: Reagent, newStatus: "In Use" | "Not In Use") => {
    if (reagent.status === newStatus) {
      toast.error("Reagent already in selected state", {
        description: `Current status is already ${newStatus}`,
      });
      return;
    }

    setReagents(
      reagents.map((r) =>
        r.id === reagent.id ? { ...r, status: newStatus } : r
      )
    );

    console.log("REAGENT STATUS MODIFIED:", {
      reagentId: reagent.id,
      reagentName: reagent.name,
      previousStatus: reagent.status,
      newStatus,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });

    toast.success(`Reagent status changed to ${newStatus}`, {
      description: reagent.name,
    });
  };

  const handleDeleteClick = (reagent: Reagent) => {
    setReagentToDelete(reagent);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (reagentToDelete) {
      setReagents(reagents.filter((r) => r.id !== reagentToDelete.id));

      console.log("REAGENT DELETED:", {
        reagentId: reagentToDelete.id,
        reagentName: reagentToDelete.name,
        lotNumber: reagentToDelete.lotNumber,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });

      toast.success("Reagent deleted successfully", {
        description: `${reagentToDelete.name} removed from system`,
      });

      setIsDeleteDialogOpen(false);
      setReagentToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      lotNumber: "",
      quantity: "",
      expirationDate: "",
      vendorName: "",
      vendorId: "",
      contactInfo: "",
    });
    setFormErrors({});
  };

  const isExpiringSoon = (expDate: string) => {
    const exp = new Date(expDate);
    const today = new Date();
    const daysUntilExpiry = Math.floor((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  return (
    <div className="space-y-6">
      {/* Install Reagent Section */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-800">Reagent Installation</CardTitle>
              <CardDescription className="text-slate-600">
                Install new reagents and manage reagent inventory
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Install Reagent
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Install New Reagent</DialogTitle>
                  <DialogDescription>Enter reagent and vendor information</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Reagent Name <span className="text-red-500">*</span></Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          setFormErrors({ ...formErrors, name: "" });
                        }}
                        className={formErrors.name ? "border-red-500" : ""}
                      />
                      {formErrors.name && <p className="text-red-600 text-sm">{formErrors.name}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label>Lot Number <span className="text-red-500">*</span></Label>
                      <Input
                        value={formData.lotNumber}
                        onChange={(e) => {
                          setFormData({ ...formData, lotNumber: e.target.value });
                          setFormErrors({ ...formErrors, lotNumber: "" });
                        }}
                        className={formErrors.lotNumber ? "border-red-500" : ""}
                      />
                      {formErrors.lotNumber && <p className="text-red-600 text-sm">{formErrors.lotNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Quantity <span className="text-red-500">*</span></Label>
                      <Input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => {
                          setFormData({ ...formData, quantity: e.target.value });
                          setFormErrors({ ...formErrors, quantity: "" });
                        }}
                        className={formErrors.quantity ? "border-red-500" : ""}
                      />
                      {formErrors.quantity && <p className="text-red-600 text-sm">{formErrors.quantity}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label>Expiration Date <span className="text-red-500">*</span></Label>
                      <Input
                        type="date"
                        value={formData.expirationDate}
                        onChange={(e) => {
                          setFormData({ ...formData, expirationDate: e.target.value });
                          setFormErrors({ ...formErrors, expirationDate: "" });
                        }}
                        className={formErrors.expirationDate ? "border-red-500" : ""}
                      />
                      {formErrors.expirationDate && <p className="text-red-600 text-sm">{formErrors.expirationDate}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Vendor Name <span className="text-red-500">*</span></Label>
                      <Input
                        value={formData.vendorName}
                        onChange={(e) => {
                          setFormData({ ...formData, vendorName: e.target.value });
                          setFormErrors({ ...formErrors, vendorName: "" });
                        }}
                        className={formErrors.vendorName ? "border-red-500" : ""}
                      />
                      {formErrors.vendorName && <p className="text-red-600 text-sm">{formErrors.vendorName}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label>Vendor ID <span className="text-red-500">*</span></Label>
                      <Input
                        value={formData.vendorId}
                        onChange={(e) => {
                          setFormData({ ...formData, vendorId: e.target.value });
                          setFormErrors({ ...formErrors, vendorId: "" });
                        }}
                        className={formErrors.vendorId ? "border-red-500" : ""}
                      />
                      {formErrors.vendorId && <p className="text-red-600 text-sm">{formErrors.vendorId}</p>}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Contact Info <span className="text-red-500">*</span></Label>
                    <Input
                      value={formData.contactInfo}
                      onChange={(e) => {
                        setFormData({ ...formData, contactInfo: e.target.value });
                        setFormErrors({ ...formErrors, contactInfo: "" });
                      }}
                      placeholder="Phone or email"
                      className={formErrors.contactInfo ? "border-red-500" : ""}
                    />
                    {formErrors.contactInfo && <p className="text-red-600 text-sm">{formErrors.contactInfo}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleInstall}>
                    Install Reagent
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead>Reagent Name</TableHead>
                  <TableHead>Lot Number</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reagents.map((reagent) => (
                  <TableRow key={reagent.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FlaskConical className="h-4 w-4 text-blue-600" />
                        {reagent.name}
                      </div>
                    </TableCell>
                    <TableCell>{reagent.lotNumber}</TableCell>
                    <TableCell>{reagent.quantity}</TableCell>
                    <TableCell>
                      <div className={isExpiringSoon(reagent.expirationDate) ? "text-yellow-600" : "text-slate-600"}>
                        {reagent.expirationDate}
                        {isExpiringSoon(reagent.expirationDate) && (
                          <p className="text-xs text-yellow-600 mt-1">Expiring soon</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">{reagent.vendorName}</TableCell>
                    <TableCell>
                      <Select
                        value={reagent.status}
                        onValueChange={(value) => handleModify(reagent, value as "In Use" | "Not In Use")}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="In Use">In Use</SelectItem>
                          <SelectItem value="Not In Use">Not In Use</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClick(reagent)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-slate-800">Delete Reagent</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-600">
              Deleting this reagent cannot be undone. Are you sure you want to delete{" "}
              <strong className="text-slate-800">{reagentToDelete?.name}</strong> (Lot: {reagentToDelete?.lotNumber})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-slate-100">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Reagent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
