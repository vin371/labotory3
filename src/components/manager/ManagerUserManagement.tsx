import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Users,
  UserPlus,
  Search,
  Edit,
  Trash2,
  Lock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Filter,
  Download,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

type UserStatus = "Active" | "Inactive" | "Suspended";
type LabUserRole = "lab_user" | "service_user";

interface LabStaffUser {
  id: string;
  fullName: string;
  email: string;
  role: LabUserRole;
  status: UserStatus;
  department: string;
  joinDate: string;
  lastLogin: string;
}

const mockLabStaff: LabStaffUser[] = [
  {
    id: "USR-001",
    fullName: "Dr. Sarah Chen",
    email: "sarah.chen@lab.com",
    role: "lab_user",
    status: "Active",
    department: "Hematology",
    joinDate: "2024-01-15",
    lastLogin: "2025-10-21 09:30:00",
  },
  {
    id: "USR-002",
    fullName: "John Miller",
    email: "john.miller@lab.com",
    role: "lab_user",
    status: "Active",
    department: "Chemistry",
    joinDate: "2024-03-20",
    lastLogin: "2025-10-21 08:15:00",
  },
  {
    id: "USR-003",
    fullName: "Lisa Wong",
    email: "lisa.wong@lab.com",
    role: "lab_user",
    status: "Active",
    department: "Immunology",
    joinDate: "2024-02-10",
    lastLogin: "2025-10-20 16:45:00",
  },
  {
    id: "USR-004",
    fullName: "Mike Davis",
    email: "mike.davis@lab.com",
    role: "service_user",
    status: "Active",
    department: "Maintenance",
    joinDate: "2024-04-05",
    lastLogin: "2025-10-21 07:20:00",
  },
  {
    id: "USR-005",
    fullName: "Emma Johnson",
    email: "emma.johnson@lab.com",
    role: "lab_user",
    status: "Inactive",
    department: "Microbiology",
    joinDate: "2023-11-12",
    lastLogin: "2025-10-15 14:30:00",
  },
];

export function ManagerUserManagement() {
  const [users, setUsers] = useState<LabStaffUser[]>(mockLabStaff);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string>("all");
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LabStaffUser | null>(null);

  const [userForm, setUserForm] = useState({
    fullName: "",
    email: "",
    role: "lab_user" as LabUserRole,
    department: "",
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleAddUser = () => {
    if (!userForm.fullName || !userForm.email || !userForm.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newUser: LabStaffUser = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      fullName: userForm.fullName,
      email: userForm.email,
      role: userForm.role,
      status: "Active",
      department: userForm.department,
      joinDate: new Date().toISOString().split("T")[0],
      lastLogin: "Never",
    };

    setUsers([newUser, ...users]);
    toast.success(`User ${userForm.fullName} added successfully`);
    setIsAddUserOpen(false);
    setUserForm({ fullName: "", email: "", role: "lab_user", department: "" });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    setUsers(
      users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, fullName: userForm.fullName, email: userForm.email, department: userForm.department }
          : user
      )
    );

    toast.success("User updated successfully");
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;

    toast.success(`Password reset email sent to ${selectedUser.email}`);
    setIsResetPasswordOpen(false);
    setSelectedUser(null);
  };

  const handleDeactivateUser = () => {
    if (!selectedUser) return;

    setUsers(
      users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
          : user
      )
    );

    toast.success(`User ${selectedUser.status === "Active" ? "deactivated" : "activated"} successfully`);
    setIsDeactivateOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1E88E5] mb-2">Lab Staff Management</h1>
          <p className="text-[#555555]">Manage users within your laboratory</p>
        </div>
        <Button
          onClick={() => setIsAddUserOpen(true)}
          className="bg-[#1E88E5] hover:bg-[#1976D2] rounded-xl"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Lab Staff
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-gradient-to-br from-[#E3F2FD] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Total Staff</CardDescription>
            <CardTitle className="text-[#1E88E5]">{users.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#A5D6A7] rounded-xl bg-gradient-to-br from-[#E8F5E9] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Active Users</CardDescription>
            <CardTitle className="text-[#4CAF50]">
              {users.filter((u) => u.status === "Active").length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-gradient-to-br from-[#E3F2FD] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Lab Users</CardDescription>
            <CardTitle className="text-[#1E88E5]">
              {users.filter((u) => u.role === "lab_user").length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#CE93D8] rounded-xl bg-gradient-to-br from-[#F3E5F5] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Service Users</CardDescription>
            <CardTitle className="text-[#9C27B0]">
              {users.filter((u) => u.role === "service_user").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-[#E0E6ED]"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="lab_user">Lab User</SelectItem>
                <SelectItem value="service_user">Service User</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1E88E5]">Lab Staff Directory</CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {users.length} staff members
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1E88E5]">User ID</TableHead>
                  <TableHead className="text-[#1E88E5]">Full Name</TableHead>
                  <TableHead className="text-[#1E88E5]">Email</TableHead>
                  <TableHead className="text-[#1E88E5]">Role</TableHead>
                  <TableHead className="text-[#1E88E5]">Department</TableHead>
                  <TableHead className="text-[#1E88E5]">Status</TableHead>
                  <TableHead className="text-[#1E88E5]">Last Login</TableHead>
                  <TableHead className="text-[#1E88E5] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">{user.id}</TableCell>
                    <TableCell className="text-[#666666]">{user.fullName}</TableCell>
                    <TableCell className="text-[#666666]">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "lab_user"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }
                      >
                        {user.role === "lab_user" ? "Lab User" : "Service User"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{user.department}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : user.status === "Inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setUserForm({
                              fullName: user.fullName,
                              email: user.email,
                              role: user.role,
                              department: user.department,
                            });
                            setIsEditUserOpen(true);
                          }}
                          className="rounded-xl text-[#1E88E5] hover:bg-[#E3F2FD]"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsResetPasswordOpen(true);
                          }}
                          className="rounded-xl text-[#FF9800] hover:bg-[#FFF8E1]"
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeactivateOpen(true);
                          }}
                          className={`rounded-xl ${
                            user.status === "Active"
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                        >
                          {user.status === "Active" ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
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

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1E88E5]">Add Lab Staff</DialogTitle>
            <DialogDescription>Add a new staff member to your laboratory</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={userForm.fullName}
                onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                placeholder="Enter full name"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                placeholder="email@lab.com"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={userForm.role}
                onValueChange={(value: LabUserRole) => setUserForm({ ...userForm, role: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lab_user">Lab User</SelectItem>
                  <SelectItem value="service_user">Service User</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-[#999999]">
                Note: Cannot create Admin or Manager roles
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={userForm.department}
                onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                placeholder="e.g., Hematology, Chemistry"
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} className="bg-[#1E88E5] hover:bg-[#1976D2]">
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1E88E5]">Edit User</DialogTitle>
            <DialogDescription>Update staff member information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editFullName">Full Name</Label>
              <Input
                id="editFullName"
                value={userForm.fullName}
                onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editEmail">Email</Label>
              <Input
                id="editEmail"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="editDepartment">Department</Label>
              <Input
                id="editDepartment"
                value={userForm.department}
                onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} className="bg-[#1E88E5] hover:bg-[#1976D2]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Confirmation */}
      <AlertDialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#FF9800]">Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              Send a password reset link to {selectedUser?.email}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetPassword}
              className="bg-[#FF9800] hover:bg-[#F57C00]"
            >
              Send Reset Link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deactivate/Activate User Confirmation */}
      <AlertDialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <AlertDialogContent className="bg-white rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1E88E5]">
              {selectedUser?.status === "Active" ? "Deactivate" : "Activate"} User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {selectedUser?.status === "Active" ? "deactivate" : "activate"}{" "}
              {selectedUser?.fullName}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivateUser}
              className={
                selectedUser?.status === "Active"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {selectedUser?.status === "Active" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
