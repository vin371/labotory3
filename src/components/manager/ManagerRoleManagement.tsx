import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Search, Edit, Trash2, Shield, AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Checkbox } from "../ui/checkbox";

interface Role {
  id: string;
  roleName: string;
  description: string;
  permissions: string[];
  userCount: number;
  createdDate: string;
}

const mockRoles: Role[] = [
  {
    id: "ROLE-001",
    roleName: "Lab Technician",
    description: "Perform routine laboratory tests and maintenance",
    permissions: ["Execute Tests", "View Results", "Basic Equipment Access"],
    userCount: 12,
    createdDate: "2024-01-15",
  },
  {
    id: "ROLE-002",
    roleName: "Senior Lab User",
    description: "Advanced testing and result validation",
    permissions: ["Execute Tests", "Validate Results", "Equipment Calibration", "View Reports"],
    userCount: 5,
    createdDate: "2024-02-20",
  },
  {
    id: "ROLE-003",
    roleName: "Lab Supervisor",
    description: "Supervise daily operations and staff",
    permissions: [
      "All Lab User Permissions",
      "Approve Results",
      "Staff Oversight",
      "Quality Control",
    ],
    userCount: 1,
    createdDate: "2024-03-10",
  },
];

const availablePermissions = [
  { id: "execute_tests", label: "Execute Tests", category: "Testing" },
  { id: "view_results", label: "View Results", category: "Testing" },
  { id: "validate_results", label: "Validate Results", category: "Testing" },
  { id: "equipment_access", label: "Basic Equipment Access", category: "Equipment" },
  { id: "equipment_calibration", label: "Equipment Calibration", category: "Equipment" },
  { id: "view_reports", label: "View Reports", category: "Reports" },
  { id: "approve_results", label: "Approve Results", category: "Approval" },
  { id: "staff_oversight", label: "Staff Oversight", category: "Management" },
  { id: "quality_control", label: "Quality Control", category: "Quality" },
];

export function ManagerRoleManagement() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [roleForm, setRoleForm] = useState({
    roleName: "",
    description: "",
    permissions: [] as string[],
  });

  const filteredRoles = roles.filter(
    (role) =>
      role.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRole = () => {
    if (!roleForm.roleName || !roleForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newRole: Role = {
      id: `ROLE-${String(roles.length + 1).padStart(3, "0")}`,
      roleName: roleForm.roleName,
      description: roleForm.description,
      permissions: roleForm.permissions,
      userCount: 0,
      createdDate: new Date().toISOString().split("T")[0],
    };

    setRoles([...roles, newRole]);
    toast.success(`Role "${roleForm.roleName}" created successfully`);
    setIsCreateOpen(false);
    setRoleForm({ roleName: "", description: "", permissions: [] });
  };

  const handleEditRole = () => {
    if (!selectedRole) return;

    setRoles(
      roles.map((role) =>
        role.id === selectedRole.id
          ? {
              ...role,
              roleName: roleForm.roleName,
              description: roleForm.description,
              permissions: roleForm.permissions,
            }
          : role
      )
    );

    toast.success("Role updated successfully");
    setIsEditOpen(false);
    setSelectedRole(null);
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;

    setRoles(roles.filter((role) => role.id !== selectedRole.id));
    toast.success("Role deleted successfully");
    setIsDeleteOpen(false);
    setSelectedRole(null);
  };

  const togglePermission = (permissionId: string) => {
    const currentPermissions = roleForm.permissions;
    const permission = availablePermissions.find((p) => p.id === permissionId);
    if (!permission) return;

    if (currentPermissions.includes(permission.label)) {
      setRoleForm({
        ...roleForm,
        permissions: currentPermissions.filter((p) => p !== permission.label),
      });
    } else {
      setRoleForm({
        ...roleForm,
        permissions: [...currentPermissions, permission.label],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#007BFF] mb-2">Role Management (Local)</h1>
          <p className="text-[#6B7280]">Manage roles within your laboratory</p>
        </div>
        <Button
          onClick={() => {
            setRoleForm({ roleName: "", description: "", permissions: [] });
            setIsCreateOpen(true);
          }}
          className="bg-[#007BFF] hover:bg-[#0056D2] rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="shadow-lg border-[#90CAF9] rounded-xl bg-[#E3F2FD]">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[#007BFF] mt-0.5" />
            <div>
              <p className="text-sm text-[#333333]">
                <span className="font-medium">Lab Scope Only:</span> You are managing roles for your
                laboratory only. Global roles (Admin, Manager) cannot be created or modified.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-gradient-to-br from-[#E3F2FD] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">Total Roles</CardDescription>
            <CardTitle className="text-[#007BFF]">{roles.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#A5D6A7] rounded-xl bg-gradient-to-br from-[#E8F5E9] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">Active Users</CardDescription>
            <CardTitle className="text-[#28A745]">
              {roles.reduce((sum, role) => sum + role.userCount, 0)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#FFE082] rounded-xl bg-gradient-to-br from-[#FFF8E1] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">Custom Roles</CardDescription>
            <CardTitle className="text-[#FFC107]">{roles.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-[#E0E6ED]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#007BFF]">Laboratory Roles</CardTitle>
          <CardDescription>Showing {filteredRoles.length} roles</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#007BFF]">Role ID</TableHead>
                  <TableHead className="text-[#007BFF]">Role Name</TableHead>
                  <TableHead className="text-[#007BFF]">Description</TableHead>
                  <TableHead className="text-[#007BFF]">Permissions</TableHead>
                  <TableHead className="text-[#007BFF]">Users</TableHead>
                  <TableHead className="text-[#007BFF]">Created</TableHead>
                  <TableHead className="text-[#007BFF] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id} className="hover:bg-[#F9FBFF]">
                    <TableCell className="font-medium text-[#333333]">{role.id}</TableCell>
                    <TableCell className="text-[#666666]">{role.roleName}</TableCell>
                    <TableCell className="text-[#666666] max-w-xs">{role.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 2).map((perm, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-100 text-blue-800">
                            {perm}
                          </Badge>
                        ))}
                        {role.permissions.length > 2 && (
                          <Badge variant="outline" className="bg-gray-100 text-gray-800">
                            +{role.permissions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-[#666666]">{role.userCount}</TableCell>
                    <TableCell className="text-[#666666]">{role.createdDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRole(role);
                            setRoleForm({
                              roleName: role.roleName,
                              description: role.description,
                              permissions: role.permissions,
                            });
                            setIsEditOpen(true);
                          }}
                          className="rounded-xl text-[#007BFF] hover:bg-[#E3F2FD]"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRole(role);
                            setIsDeleteOpen(true);
                          }}
                          className="rounded-xl text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Role Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-white rounded-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#007BFF]">Create New Role</DialogTitle>
            <DialogDescription>Define a new role for your laboratory</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="roleName">Role Name *</Label>
              <Input
                id="roleName"
                value={roleForm.roleName}
                onChange={(e) => setRoleForm({ ...roleForm, roleName: e.target.value })}
                placeholder="e.g., Lab Technician"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                placeholder="Describe the role's responsibilities"
                rows={3}
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label>Permissions</Label>
              <Card className="bg-[#F9FBFF] border-[#BBDEFB]">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {Object.entries(
                      availablePermissions.reduce((acc, perm) => {
                        if (!acc[perm.category]) acc[perm.category] = [];
                        acc[perm.category].push(perm);
                        return acc;
                      }, {} as Record<string, typeof availablePermissions>)
                    ).map(([category, perms]) => (
                      <div key={category}>
                        <p className="text-sm font-medium text-[#333333] mb-2">{category}</p>
                        <div className="space-y-2">
                          {perms.map((perm) => (
                            <div key={perm.id} className="flex items-center gap-2">
                              <Checkbox
                                id={perm.id}
                                checked={roleForm.permissions.includes(perm.label)}
                                onCheckedChange={() => togglePermission(perm.id)}
                              />
                              <Label htmlFor={perm.id} className="text-sm text-[#666666]">
                                {perm.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole} className="bg-[#007BFF] hover:bg-[#0056D2]">
              Create Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-white rounded-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#007BFF]">Edit Role</DialogTitle>
            <DialogDescription>Update role information and permissions</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editRoleName">Role Name</Label>
              <Input
                id="editRoleName"
                value={roleForm.roleName}
                onChange={(e) => setRoleForm({ ...roleForm, roleName: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={roleForm.description}
                onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                rows={3}
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label>Permissions</Label>
              <Card className="bg-[#F9FBFF] border-[#BBDEFB]">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {Object.entries(
                      availablePermissions.reduce((acc, perm) => {
                        if (!acc[perm.category]) acc[perm.category] = [];
                        acc[perm.category].push(perm);
                        return acc;
                      }, {} as Record<string, typeof availablePermissions>)
                    ).map(([category, perms]) => (
                      <div key={category}>
                        <p className="text-sm font-medium text-[#333333] mb-2">{category}</p>
                        <div className="space-y-2">
                          {perms.map((perm) => (
                            <div key={perm.id} className="flex items-center gap-2">
                              <Checkbox
                                id={`edit-${perm.id}`}
                                checked={roleForm.permissions.includes(perm.label)}
                                onCheckedChange={() => togglePermission(perm.id)}
                              />
                              <Label htmlFor={`edit-${perm.id}`} className="text-sm text-[#666666]">
                                {perm.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole} className="bg-[#007BFF] hover:bg-[#0056D2]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#007BFF]">Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role "{selectedRole?.roleName}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRole}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
