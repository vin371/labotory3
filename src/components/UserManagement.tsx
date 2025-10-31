import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, Plus, Edit, Trash2, Eye, User as UserIcon, AlertTriangle, EyeOff, Key } from "lucide-react";
import { Badge } from "./ui/badge";
import { User, UserRole, ROLE_LABELS } from "../types/auth";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission } from "../types/auth";
import { toast } from "sonner@2.0.3";
import { Checkbox } from "./ui/checkbox";

interface ExtendedUser extends User {
  identifier?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  age?: number;
  address?: string;
  password?: string;
}

const mockUsers: ExtendedUser[] = [
  { 
    id: "1", 
    fullName: "Admin User", 
    email: "admin@lab.com", 
    role: "admin", 
    phone: "+1-555-0001", 
    status: "active", 
    createdAt: "2024-01-15",
    identifier: "ID-2024-001",
    gender: "male",
    dateOfBirth: "1985-05-15",
    age: 39,
    address: "123 Admin St, San Francisco, CA 94102",
    password: "Admin123"
  },
  { 
    id: "2", 
    fullName: "Manager User", 
    email: "manager@lab.com", 
    role: "manager", 
    phone: "+1-555-0002", 
    status: "active", 
    createdAt: "2024-02-20",
    identifier: "ID-2024-002",
    gender: "female",
    dateOfBirth: "1990-08-22",
    age: 34,
    address: "456 Manager Ave, San Francisco, CA 94103",
    password: "Manager123"
  },
  { 
    id: "3", 
    fullName: "Lab User", 
    email: "labuser@lab.com", 
    role: "lab_user", 
    phone: "+1-555-0003", 
    status: "active", 
    createdAt: "2024-03-10",
    identifier: "ID-2024-003",
    gender: "male",
    dateOfBirth: "1992-03-10",
    age: 32,
    address: "789 Lab Blvd, San Francisco, CA 94104",
    password: "LabUser123"
  },
  { 
    id: "4", 
    fullName: "Service User", 
    email: "service@lab.com", 
    role: "service_user", 
    phone: "+1-555-0004", 
    status: "active", 
    createdAt: "2024-03-25",
    identifier: "ID-2024-004",
    gender: "other",
    dateOfBirth: "1988-11-30",
    age: 35,
    address: "321 Service Dr, San Francisco, CA 94105",
    password: "Service123"
  },
  { 
    id: "5", 
    fullName: "John Doe", 
    email: "john.doe@lab.com", 
    role: "lab_user", 
    phone: "+1-555-0005", 
    status: "inactive", 
    createdAt: "2024-04-01",
    identifier: "ID-2024-005",
    gender: "male",
    dateOfBirth: "1995-07-18",
    age: 29,
    address: "654 Test Ln, San Francisco, CA 94106",
    password: "JohnDoe123"
  },
];

export function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<ExtendedUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<ExtendedUser | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "lab_user" as UserRole,
    phone: "",
    status: "active" as "active" | "inactive",
    identifier: "",
    gender: "male" as "male" | "female" | "other",
    dateOfBirth: "",
    age: 0,
    address: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordInView, setShowPasswordInView] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const canCreate = currentUser && hasPermission(currentUser.role, "CREATE_USER");
  const canUpdate = currentUser && hasPermission(currentUser.role, "UPDATE_USER");
  const canDelete = currentUser && hasPermission(currentUser.role, "DELETE_USER");
  const canViewDetail = currentUser && hasPermission(currentUser.role, "VIEW_USER_DETAIL");

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const newUser: ExtendedUser = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("User created successfully!");
  };

  const handleEdit = (user: ExtendedUser) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      status: user.status,
      identifier: user.identifier || "",
      gender: user.gender || "male",
      dateOfBirth: user.dateOfBirth || "",
      age: user.age || 0,
      address: user.address || "",
      password: user.password || "",
    });
    setChangePassword(false);
    setShowPassword(false);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedUser) {
      const updateData = changePassword 
        ? { ...formData } 
        : { ...formData, password: selectedUser.password };
      
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...u, ...updateData } : u
        )
      );
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      setChangePassword(false);
      resetForm();
      toast.success("User updated successfully!");
    }
  };

  const handleDeleteClick = (user: ExtendedUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      setUsers(users.filter((u) => u.id !== userToDelete.id));
      toast.success("User deleted successfully!");
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleView = (user: ExtendedUser) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      role: "lab_user",
      phone: "",
      status: "active",
      identifier: "",
      gender: "male",
      dateOfBirth: "",
      age: 0,
      address: "",
      password: "",
    });
    setShowPassword(false);
    setShowPasswordInView(false);
    setChangePassword(false);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "manager":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "lab_user":
        return "bg-green-100 text-green-800 border-green-200";
      case "service_user":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
        <CardTitle className="text-slate-800">User Management</CardTitle>
        <CardDescription className="text-slate-600">
          Manage system users and their roles
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-slate-300"
            />
          </div>
          {canCreate && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="identifier">Identifier / ID</Label>
                      <Input
                        id="identifier"
                        placeholder="e.g., ID-2024-001"
                        value={formData.identifier}
                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@lab.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        placeholder="+1-555-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value as "male" | "female" | "other" })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => {
                          const dob = e.target.value;
                          const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : 0;
                          setFormData({ ...formData, dateOfBirth: dob, age });
                        }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Auto-calculated"
                        value={formData.age || ""}
                        readOnly
                        className="bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street, City, State, ZIP"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password (min. 8 characters)"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-500" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">Password must be at least 8 characters long</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role *</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="lab_user">Lab User</SelectItem>
                          <SelectItem value="service_user">Service User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Identifier</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50">
                  <TableCell className="text-slate-800">{user.identifier}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell className="text-slate-600">{user.email}</TableCell>
                  <TableCell className="text-slate-600">{user.phone}</TableCell>
                  <TableCell className="capitalize text-slate-600">{user.gender}</TableCell>
                  <TableCell className="text-slate-600">{user.age} yrs</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {canViewDetail && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-600 hover:text-slate-700 hover:bg-slate-100"
                          onClick={() => handleView(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {canUpdate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteClick(user)}
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
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-identifier">Identifier / ID</Label>
                  <Input
                    id="edit-identifier"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-fullName">Full Name *</Label>
                  <Input
                    id="edit-fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value as "male" | "female" | "other" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-dateOfBirth">Date of Birth</Label>
                  <Input
                    id="edit-dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => {
                      const dob = e.target.value;
                      const age = dob ? new Date().getFullYear() - new Date(dob).getFullYear() : 0;
                      setFormData({ ...formData, dateOfBirth: dob, age });
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-age">Age</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={formData.age || ""}
                    readOnly
                    className="bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-center gap-2 mb-3">
                  <Checkbox 
                    id="change-password" 
                    checked={changePassword}
                    onCheckedChange={(checked) => {
                      setChangePassword(checked as boolean);
                      if (!checked) {
                        setFormData({ ...formData, password: selectedUser?.password || "" });
                        setShowPassword(false);
                      }
                    }}
                  />
                  <Label htmlFor="change-password" className="text-sm cursor-pointer">
                    Change Password
                  </Label>
                </div>
                
                {changePassword && (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="edit-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pr-10 bg-white"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-500" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500">Password must be at least 8 characters long</p>
                  </div>
                )}
                
                {!changePassword && (
                  <p className="text-xs text-slate-500">Current password will be retained</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="lab_user">Lab User</SelectItem>
                      <SelectItem value="service_user">Service User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdate}>Update User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-slate-800">{selectedUser.fullName}</h3>
                    <p className="text-slate-600 text-sm">{selectedUser.email}</p>
                    <p className="text-slate-500 text-xs mt-1">ID: {selectedUser.identifier || "N/A"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-500 text-xs">Phone Number</Label>
                    <p className="text-slate-800">{selectedUser.phone || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Gender</Label>
                    <p className="text-slate-800 capitalize">{selectedUser.gender || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Date of Birth</Label>
                    <p className="text-slate-800">{selectedUser.dateOfBirth || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Age</Label>
                    <p className="text-slate-800">{selectedUser.age ? `${selectedUser.age} years` : "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-slate-500 text-xs">Address</Label>
                    <p className="text-slate-800">{selectedUser.address || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Role</Label>
                    <p className="text-slate-800">{ROLE_LABELS[selectedUser.role]}</p>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Status</Label>
                    <Badge variant="outline" className={selectedUser.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-xs">Created At</Label>
                    <p className="text-slate-800">{selectedUser.createdAt}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-slate-500 text-xs">Password</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                        <code className="text-sm text-slate-800">
                          {showPasswordInView ? selectedUser.password : "••••••••••"}
                        </code>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPasswordInView(!showPasswordInView)}
                        className="border-slate-300"
                      >
                        {showPasswordInView ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Show
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <AlertDialogTitle className="text-slate-800">Delete User</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-slate-600">
                Are you sure you want to delete <span className="font-semibold text-slate-800">{userToDelete?.fullName}</span>? This action cannot be undone and will permanently remove the user from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:bg-slate-100">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
