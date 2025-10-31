import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Search, Plus, Edit, Trash2, Shield, AlertTriangle, Eye, CheckCircle2, XCircle, ArrowUpDown } from "lucide-react";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission } from "../types/auth";
import { toast } from "sonner@2.0.3";

// Định nghĩa các privileges có sẵn trong hệ thống
const SYSTEM_PRIVILEGES = [
  { id: "CREATE_USER", name: "Create User", category: "User Management" },
  { id: "UPDATE_USER", name: "Update User", category: "User Management" },
  { id: "DELETE_USER", name: "Delete User", category: "User Management" },
  { id: "VIEW_USER_DETAIL", name: "View User Detail", category: "User Management" },
  { id: "CREATE_ROLE", name: "Create Role", category: "Role Management" },
  { id: "UPDATE_ROLE", name: "Update Role", category: "Role Management" },
  { id: "DELETE_ROLE", name: "Delete Role", category: "Role Management" },
  { id: "VIEW_ROLE_DETAIL", name: "View Role Detail", category: "Role Management" },
  { id: "CREATE_PATIENT", name: "Create Patient", category: "Patient Management" },
  { id: "UPDATE_PATIENT", name: "Update Patient", category: "Patient Management" },
  { id: "DELETE_PATIENT", name: "Delete Patient", category: "Patient Management" },
  { id: "VIEW_PATIENT_DETAIL", name: "View Patient Detail", category: "Patient Management" },
  { id: "CREATE_TEST_ORDER", name: "Create Test Order", category: "Test Order" },
  { id: "UPDATE_TEST_ORDER", name: "Update Test Order", category: "Test Order" },
  { id: "DELETE_TEST_ORDER", name: "Delete Test Order", category: "Test Order" },
  { id: "VIEW_TEST_RESULTS", name: "View Test Results", category: "Test Order" },
  { id: "MANAGE_INSTRUMENTS", name: "Manage Instruments", category: "Instrument" },
  { id: "VIEW_INSTRUMENTS", name: "View Instruments", category: "Instrument" },
  { id: "MANAGE_WAREHOUSE", name: "Manage Warehouse", category: "Warehouse" },
  { id: "VIEW_WAREHOUSE", name: "View Warehouse", category: "Warehouse" },
  { id: "VIEW_LOGS", name: "View System Logs", category: "System" },
  { id: "MANAGE_CONFIG", name: "Manage Configuration", category: "System" },
  { id: "VIEW_REPORTS", name: "View Reports", category: "Reports" },
  { id: "GENERATE_REPORTS", name: "Generate Reports", category: "Reports" },
];

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  privileges: string[];
  userCount: number;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
}

const mockRoles: Role[] = [
  { 
    id: "1", 
    name: "Admin", 
    code: "ADMIN",
    description: "Full system access with all permissions", 
    privileges: SYSTEM_PRIVILEGES.map(p => p.id),
    userCount: 1,
    createdAt: "2024-01-15",
    createdBy: "system"
  },
  { 
    id: "2", 
    name: "Manager", 
    code: "MANAGER",
    description: "User management and view-only role access", 
    privileges: ["CREATE_USER", "UPDATE_USER", "VIEW_USER_DETAIL", "VIEW_ROLE_DETAIL", "CREATE_PATIENT", "UPDATE_PATIENT", "VIEW_PATIENT_DETAIL", "VIEW_TEST_RESULTS", "VIEW_INSTRUMENTS", "VIEW_WAREHOUSE", "VIEW_LOGS", "VIEW_REPORTS"],
    userCount: 1,
    createdAt: "2024-02-20",
    createdBy: "admin"
  },
  { 
    id: "3", 
    name: "Lab User", 
    code: "LAB_USER",
    description: "Basic laboratory operations access", 
    privileges: ["CREATE_TEST_ORDER", "UPDATE_TEST_ORDER", "VIEW_TEST_RESULTS", "VIEW_PATIENT_DETAIL", "MANAGE_INSTRUMENTS", "VIEW_INSTRUMENTS", "MANAGE_WAREHOUSE", "VIEW_WAREHOUSE"],
    userCount: 2,
    createdAt: "2024-03-10",
    createdBy: "admin"
  },
  { 
    id: "4", 
    name: "Service User", 
    code: "SERVICE_USER",
    description: "Limited access for service operations", 
    privileges: ["VIEW_INSTRUMENTS", "VIEW_WAREHOUSE", "VIEW_LOGS"],
    userCount: 1,
    createdAt: "2024-03-25",
    createdBy: "admin"
  },
];

type SortField = "name" | "code" | "privileges" | "users";
type SortOrder = "asc" | "desc";

export function RoleManagement() {
  const { user: currentUser } = useAuth();
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    privileges: [] as string[],
  });
  const [errors, setErrors] = useState({
    name: "",
    code: "",
    description: "",
    privileges: "",
  });

  const canCreate = currentUser && hasPermission(currentUser.role, "CREATE_ROLE");
  const canUpdate = currentUser && hasPermission(currentUser.role, "UPDATE_ROLE");
  const canDelete = currentUser && hasPermission(currentUser.role, "DELETE_ROLE");
  const canView = currentUser && hasPermission(currentUser.role, "VIEW_ROLE_DETAIL");
  const isViewOnly = currentUser?.role === "manager";

  // Filter roles
  const filteredRoles = roles
    .filter((role) => !role.isDeleted)
    .filter(
      (role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Sort roles
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortField) {
      case "name":
        compareValue = a.name.localeCompare(b.name);
        break;
      case "code":
        compareValue = a.code.localeCompare(b.code);
        break;
      case "privileges":
        compareValue = a.privileges.length - b.privileges.length;
        break;
      case "users":
        compareValue = a.userCount - b.userCount;
        break;
    }
    
    return sortOrder === "asc" ? compareValue : -compareValue;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const validateForm = (isEdit: boolean = false): boolean => {
    const newErrors = {
      name: "",
      code: "",
      description: "",
      privileges: "",
    };

    // Validate role name
    if (!formData.name.trim()) {
      newErrors.name = "Role name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Role name must be at least 3 characters";
    }

    // Validate role code
    if (!formData.code.trim()) {
      newErrors.code = "Role code is required";
    } else if (!/^[A-Z_]+$/.test(formData.code)) {
      newErrors.code = "Role code must contain only uppercase letters and underscores";
    } else if (!isEdit) {
      // Check for duplicate code only when creating new role
      const existingRole = roles.find(r => r.code === formData.code && !r.isDeleted);
      if (existingRole) {
        newErrors.code = "A role with this code already exists";
      }
    }

    // Validate description
    if (!formData.description.trim()) {
      newErrors.description = "Role description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Validate privileges
    if (formData.privileges.length === 0) {
      newErrors.privileges = "At least one privilege must be selected";
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

    const newRole: Role = {
      id: Date.now().toString(),
      ...formData,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: currentUser?.fullName || "Unknown",
    };
    
    setRoles([...roles, newRole]);
    setIsAddDialogOpen(false);
    resetForm();
    
    toast.success("Role created successfully!", {
      description: `Role "${newRole.name}" has been created with ${newRole.privileges.length} privileges.`,
    });

    // Log the creation
    console.log(`[ROLE_CREATED] Role: ${newRole.name} (${newRole.code}), By: ${newRole.createdBy}, At: ${newRole.createdAt}`);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      code: role.code,
      description: role.description,
      privileges: [...role.privileges],
    });
    setErrors({ name: "", code: "", description: "", privileges: "" });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!validateForm(true)) {
      toast.error("Validation failed", {
        description: "Please fix the errors in the form",
      });
      return;
    }

    if (selectedRole) {
      const updatedRole = {
        ...selectedRole,
        ...formData,
        updatedAt: new Date().toISOString().split('T')[0],
        updatedBy: currentUser?.fullName || "Unknown",
      };

      setRoles(
        roles.map((r) =>
          r.id === selectedRole.id ? updatedRole : r
        )
      );
      
      setIsEditDialogOpen(false);
      setSelectedRole(null);
      resetForm();
      
      toast.success("Role updated successfully!", {
        description: `Role "${updatedRole.name}" has been updated.`,
      });

      // Log the update
      console.log(`[ROLE_UPDATED] Role: ${updatedRole.name} (${updatedRole.code}), By: ${updatedRole.updatedBy}, At: ${updatedRole.updatedAt}`);
    }
  };

  const handleView = (role: Role) => {
    setSelectedRole(role);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    // Check if role has users
    if (role.userCount > 0) {
      toast.error("Cannot delete role with assigned users", {
        description: `This role has ${role.userCount} user${role.userCount > 1 ? 's' : ''} assigned. Please reassign users before deleting.`,
      });
      return;
    }

    // Check if role already deleted
    if (role.isDeleted) {
      toast.error("Role not found", {
        description: "This role has already been deleted.",
      });
      return;
    }

    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      // Soft delete: mark as deleted instead of removing
      const deletedRole = {
        ...roleToDelete,
        isDeleted: true,
        deletedAt: new Date().toISOString().split('T')[0],
        deletedBy: currentUser?.fullName || "Unknown",
      };

      setRoles(
        roles.map((r) =>
          r.id === roleToDelete.id ? deletedRole : r
        )
      );
      
      toast.success("Role deleted successfully!", {
        description: `Role "${roleToDelete.name}" has been permanently removed.`,
      });

      // Log the deletion
      console.log(`[ROLE_DELETED] Role: ${roleToDelete.name} (${roleToDelete.code}), By: ${deletedRole.deletedBy}, At: ${deletedRole.deletedAt}`);
      
      setIsDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      privileges: [],
    });
    setErrors({ name: "", code: "", description: "", privileges: "" });
  };

  const togglePrivilege = (privilegeId: string) => {
    setFormData(prev => ({
      ...prev,
      privileges: prev.privileges.includes(privilegeId)
        ? prev.privileges.filter(p => p !== privilegeId)
        : [...prev.privileges, privilegeId]
    }));
  };

  const toggleAllPrivileges = () => {
    if (formData.privileges.length === SYSTEM_PRIVILEGES.length) {
      setFormData(prev => ({ ...prev, privileges: [] }));
    } else {
      setFormData(prev => ({ ...prev, privileges: SYSTEM_PRIVILEGES.map(p => p.id) }));
    }
  };

  const setDefaultPrivileges = () => {
    // Set read-only privileges as default
    const readOnlyPrivileges = SYSTEM_PRIVILEGES
      .filter(p => p.id.startsWith("VIEW_"))
      .map(p => p.id);
    setFormData(prev => ({ ...prev, privileges: readOnlyPrivileges }));
  };

  // Group privileges by category
  const privilegesByCategory = SYSTEM_PRIVILEGES.reduce((acc, privilege) => {
    if (!acc[privilege.category]) {
      acc[privilege.category] = [];
    }
    acc[privilege.category].push(privilege);
    return acc;
  }, {} as Record<string, typeof SYSTEM_PRIVILEGES>);

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-slate-800">Role Management</CardTitle>
        </div>
        <CardDescription className="text-slate-600">
          {isViewOnly ? "View system roles and permissions (read-only)" : "Manage system roles and permissions"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search roles by name, code or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-slate-300"
            />
          </div>
          {canCreate && (
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>Add New Role</DialogTitle>
                  <DialogDescription>Create a new system role with privileges</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-4">
                  <div className="grid gap-4 py-4">
                    {/* Role Name */}
                    <div className="grid gap-2">
                      <Label htmlFor="name">Role Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Researcher"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                    </div>

                    {/* Role Code */}
                    <div className="grid gap-2">
                      <Label htmlFor="code">Role Code *</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="e.g., RESEARCHER"
                        className={errors.code ? "border-red-500" : ""}
                      />
                      <p className="text-xs text-slate-500">Use uppercase letters and underscores only (e.g., LAB_USER)</p>
                      {errors.code && <p className="text-xs text-red-600">{errors.code}</p>}
                    </div>

                    {/* Description */}
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the role and its purpose..."
                        rows={3}
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
                    </div>

                    {/* Privileges */}
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <Label>Privileges *</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={setDefaultPrivileges}
                            className="text-xs"
                          >
                            Set Read-Only
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={toggleAllPrivileges}
                            className="text-xs"
                          >
                            {formData.privileges.length === SYSTEM_PRIVILEGES.length ? "Deselect All" : "Select All"}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border border-slate-200 rounded-lg p-4 space-y-4 bg-slate-50">
                        {Object.entries(privilegesByCategory).map(([category, privileges]) => (
                          <div key={category}>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">{category}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {privileges.map((privilege) => (
                                <div key={privilege.id} className="flex items-center gap-2">
                                  <Checkbox
                                    id={`add-${privilege.id}`}
                                    checked={formData.privileges.includes(privilege.id)}
                                    onCheckedChange={() => togglePrivilege(privilege.id)}
                                  />
                                  <Label 
                                    htmlFor={`add-${privilege.id}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {privilege.name}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <Separator className="mt-3" />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500">
                        Selected: {formData.privileges.length} privileges
                        {formData.privileges.length === 0 && " (default Read-Only will be applied)"}
                      </p>
                      {errors.privileges && <p className="text-xs text-red-600">{errors.privileges}</p>}
                    </div>
                  </div>
                </ScrollArea>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>
                    Create Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isViewOnly && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-amber-800">You have view-only access to roles. Contact an administrator to make changes.</p>
          </div>
        )}

        {/* Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          {sortedRoles.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No Data</p>
              <p className="text-sm text-slate-400 mt-1">No roles found matching your search</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("name")}
                      className="hover:bg-slate-100"
                    >
                      Role Name
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("code")}
                      className="hover:bg-slate-100"
                    >
                      Role Code
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("privileges")}
                      className="hover:bg-slate-100"
                    >
                      Privileges
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("users")}
                      className="hover:bg-slate-100"
                    >
                      Users
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRoles.map((role) => (
                  <TableRow key={role.id} className="hover:bg-slate-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-slate-800">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700">
                        {role.code}
                      </code>
                    </TableCell>
                    <TableCell className="text-slate-600 max-w-md truncate">{role.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {role.privileges.length} permissions
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {role.userCount} users
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {canView && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                            onClick={() => handleView(role)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {canUpdate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleEdit(role)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(role)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Role Details</DialogTitle>
              <DialogDescription>View complete role information</DialogDescription>
            </DialogHeader>
            {selectedRole && (
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4 py-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-500 text-xs">Role Name</Label>
                      <p className="text-slate-800 font-medium">{selectedRole.name}</p>
                    </div>
                    <div>
                      <Label className="text-slate-500 text-xs">Role Code</Label>
                      <code className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-700">
                        {selectedRole.code}
                      </code>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-500 text-xs">Description</Label>
                    <p className="text-slate-800">{selectedRole.description}</p>
                  </div>

                  <Separator />

                  {/* Privileges */}
                  <div>
                    <Label className="text-slate-700 mb-3 block">
                      Privileges ({selectedRole.privileges.length})
                    </Label>
                    <div className="border border-slate-200 rounded-lg p-4 space-y-4 bg-slate-50">
                      {Object.entries(privilegesByCategory).map(([category, privileges]) => {
                        const categoryPrivileges = privileges.filter(p => 
                          selectedRole.privileges.includes(p.id)
                        );
                        
                        if (categoryPrivileges.length === 0) return null;
                        
                        return (
                          <div key={category}>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">{category}</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {categoryPrivileges.map((privilege) => (
                                <div key={privilege.id} className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-slate-700">{privilege.name}</span>
                                </div>
                              ))}
                            </div>
                            <Separator className="mt-3" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-slate-500 text-xs">Assigned Users</Label>
                      <p className="text-slate-800">{selectedRole.userCount} users</p>
                    </div>
                    <div>
                      <Label className="text-slate-500 text-xs">Created At</Label>
                      <p className="text-slate-800">{selectedRole.createdAt}</p>
                    </div>
                    {selectedRole.createdBy && (
                      <div>
                        <Label className="text-slate-500 text-xs">Created By</Label>
                        <p className="text-slate-800">{selectedRole.createdBy}</p>
                      </div>
                    )}
                    {selectedRole.updatedAt && (
                      <div>
                        <Label className="text-slate-500 text-xs">Last Updated</Label>
                        <p className="text-slate-800">{selectedRole.updatedAt}</p>
                      </div>
                    )}
                    {selectedRole.updatedBy && (
                      <div>
                        <Label className="text-slate-500 text-xs">Updated By</Label>
                        <p className="text-slate-800">{selectedRole.updatedBy}</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            )}
            <DialogFooter className="mt-4">
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        {canUpdate && (
          <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              resetForm();
              setSelectedRole(null);
            }
          }}>
            <DialogContent className="bg-white max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Edit Role</DialogTitle>
                <DialogDescription>Update role information and privileges</DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-1 pr-4">
                <div className="grid gap-4 py-4">
                  {/* Role Name */}
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">Role Name *</Label>
                    <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                  </div>

                  {/* Role Code - Read-only in edit mode */}
                  <div className="grid gap-2">
                    <Label htmlFor="edit-code">Role Code</Label>
                    <Input
                      id="edit-code"
                      value={formData.code}
                      readOnly
                      className="bg-slate-100 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-500">Role code cannot be changed after creation</p>
                  </div>

                  {/* Description */}
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description *</Label>
                    <Textarea
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-xs text-red-600">{errors.description}</p>}
                  </div>

                  {/* Privileges */}
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label>Privileges *</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={setDefaultPrivileges}
                          className="text-xs"
                        >
                          Set Read-Only
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={toggleAllPrivileges}
                          className="text-xs"
                        >
                          {formData.privileges.length === SYSTEM_PRIVILEGES.length ? "Deselect All" : "Select All"}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-slate-200 rounded-lg p-4 space-y-4 bg-slate-50">
                      {Object.entries(privilegesByCategory).map(([category, privileges]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-slate-700 mb-2">{category}</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {privileges.map((privilege) => (
                              <div key={privilege.id} className="flex items-center gap-2">
                                <Checkbox
                                  id={`edit-${privilege.id}`}
                                  checked={formData.privileges.includes(privilege.id)}
                                  onCheckedChange={() => togglePrivilege(privilege.id)}
                                />
                                <Label 
                                  htmlFor={`edit-${privilege.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {privilege.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <Separator className="mt-3" />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      Selected: {formData.privileges.length} privileges
                    </p>
                    {errors.privileges && <p className="text-xs text-red-600">{errors.privileges}</p>}
                  </div>
                </div>
              </ScrollArea>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdate}>
                  Update Role
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <AlertDialogTitle className="text-slate-800">Delete Role</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-slate-600">
                Are you sure you want to delete the <span className="font-semibold text-slate-800">"{roleToDelete?.name}"</span> role? This action cannot be undone and will permanently remove this role from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-slate-100">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Role
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
