import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import {
  Package,
  Search,
  AlertTriangle,
  TrendingDown,
  Download,
  Send,
  Eye,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  location: string;
  expiryDate: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const mockWarehouseItems: WarehouseItem[] = [
  {
    id: "WHI-001",
    name: "CBC Reagent Kit",
    category: "Reagents",
    quantity: 450,
    unit: "units",
    minThreshold: 200,
    location: "Shelf A-12",
    expiryDate: "2026-03-15",
    status: "In Stock",
  },
  {
    id: "WHI-002",
    name: "Chemistry Panel Solution",
    category: "Reagents",
    quantity: 180,
    unit: "units",
    minThreshold: 200,
    location: "Shelf B-05",
    expiryDate: "2026-04-20",
    status: "Low Stock",
  },
  {
    id: "WHI-003",
    name: "Blood Collection Tubes",
    category: "Consumables",
    quantity: 2500,
    unit: "pieces",
    minThreshold: 500,
    location: "Drawer C-03",
    expiryDate: "2027-01-10",
    status: "In Stock",
  },
  {
    id: "WHI-004",
    name: "Immunoassay Reagent",
    category: "Reagents",
    quantity: 50,
    unit: "units",
    minThreshold: 100,
    location: "Shelf A-18",
    expiryDate: "2026-02-10",
    status: "Low Stock",
  },
  {
    id: "WHI-005",
    name: "Calibration Standard",
    category: "Quality Control",
    quantity: 0,
    unit: "kits",
    minThreshold: 5,
    location: "Shelf D-01",
    expiryDate: "2025-12-31",
    status: "Out of Stock",
  },
];

export function ManagerWarehouse() {
  const [items] = useState<WarehouseItem[]>(mockWarehouseItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRefillRequestOpen, setIsRefillRequestOpen] = useState(false);

  const [refillForm, setRefillForm] = useState({
    quantity: 0,
    urgency: "Medium",
    reason: "",
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockItems = items.filter((item) => item.status === "Low Stock" || item.status === "Out of Stock");

  const handleRequestRefill = () => {
    if (!selectedItem || refillForm.quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    toast.success(`Refill request submitted for ${selectedItem.name}`);
    setIsRefillRequestOpen(false);
    setRefillForm({ quantity: 0, urgency: "Medium", reason: "" });
    setSelectedItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[#1E88E5] mb-2">Warehouse Management</h1>
        <p className="text-[#555555]">View inventory and request refills for your laboratory</p>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="shadow-lg border-[#FFE082] rounded-xl bg-[#FFF8E1]">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-[#FF9800] mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-[#333333]">
                  <span className="font-medium">Low Stock Alert:</span> {lowStockItems.length} items
                  require attention
                </p>
                <p className="text-xs text-[#666666] mt-1">
                  Consider requesting refills to maintain adequate stock levels
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterStatus("Low Stock")}
                className="rounded-xl border-[#FF9800] text-[#FF9800] hover:bg-[#FFF8E1]"
              >
                View Items
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-gradient-to-br from-[#E3F2FD] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Total Items</CardDescription>
            <CardTitle className="text-[#1E88E5]">{items.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#A5D6A7] rounded-xl bg-gradient-to-br from-[#E8F5E9] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">In Stock</CardDescription>
            <CardTitle className="text-[#4CAF50]">
              {items.filter((i) => i.status === "In Stock").length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#FFE082] rounded-xl bg-gradient-to-br from-[#FFF8E1] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Low Stock</CardDescription>
            <CardTitle className="text-[#FF9800]">
              {items.filter((i) => i.status === "Low Stock").length}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-red-200 rounded-xl bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#555555]">Out of Stock</CardDescription>
            <CardTitle className="text-red-600">
              {items.filter((i) => i.status === "Out of Stock").length}
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
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-[#E0E6ED]"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Reagents">Reagents</SelectItem>
                <SelectItem value="Consumables">Consumables</SelectItem>
                <SelectItem value="Quality Control">Quality Control</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="rounded-xl border-[#E0E6ED]">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#1E88E5]">Inventory (Read-Only)</CardTitle>
          <CardDescription>
            Showing {filteredItems.length} of {items.length} items
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="border border-[#BBDEFB] rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#E3F2FD] hover:bg-[#E3F2FD]">
                  <TableHead className="text-[#1E88E5]">Item ID</TableHead>
                  <TableHead className="text-[#1E88E5]">Name</TableHead>
                  <TableHead className="text-[#1E88E5]">Category</TableHead>
                  <TableHead className="text-[#1E88E5]">Quantity</TableHead>
                  <TableHead className="text-[#1E88E5]">Min Threshold</TableHead>
                  <TableHead className="text-[#1E88E5]">Location</TableHead>
                  <TableHead className="text-[#1E88E5]">Expiry Date</TableHead>
                  <TableHead className="text-[#1E88E5]">Status</TableHead>
                  <TableHead className="text-[#1E88E5] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id} className="hover:bg-[#F5F5F5]">
                    <TableCell className="font-medium text-[#333333]">{item.id}</TableCell>
                    <TableCell className="text-[#666666]">{item.name}</TableCell>
                    <TableCell className="text-[#666666]">{item.category}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.quantity >= item.minThreshold
                            ? "bg-green-100 text-green-800"
                            : item.quantity > 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {item.quantity} {item.unit}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[#666666]">
                      {item.minThreshold} {item.unit}
                    </TableCell>
                    <TableCell className="text-[#666666]">{item.location}</TableCell>
                    <TableCell className="text-[#666666]">{item.expiryDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "In Stock"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDetailOpen(true);
                          }}
                          className="rounded-xl text-[#1E88E5] hover:bg-[#E3F2FD]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(item.status === "Low Stock" || item.status === "Out of Stock") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setIsRefillRequestOpen(true);
                            }}
                            className="rounded-xl border-[#FF9800] text-[#FF9800] hover:bg-[#FFF8E1]"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Request Refill
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Item Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#1E88E5]">Item Details</DialogTitle>
            <DialogDescription>Comprehensive inventory information</DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#999999]">Item ID</Label>
                  <p className="text-[#333333]">{selectedItem.id}</p>
                </div>
                <div>
                  <Label className="text-[#999999]">Name</Label>
                  <p className="text-[#333333]">{selectedItem.name}</p>
                </div>
                <div>
                  <Label className="text-[#999999]">Category</Label>
                  <p className="text-[#333333]">{selectedItem.category}</p>
                </div>
                <div>
                  <Label className="text-[#999999]">Location</Label>
                  <p className="text-[#333333]">{selectedItem.location}</p>
                </div>
                <div>
                  <Label className="text-[#999999]">Current Quantity</Label>
                  <p className="text-[#333333]">
                    {selectedItem.quantity} {selectedItem.unit}
                  </p>
                </div>
                <div>
                  <Label className="text-[#999999]">Min Threshold</Label>
                  <p className="text-[#333333]">
                    {selectedItem.minThreshold} {selectedItem.unit}
                  </p>
                </div>
                <div>
                  <Label className="text-[#999999]">Expiry Date</Label>
                  <p className="text-[#333333]">{selectedItem.expiryDate}</p>
                </div>
                <div>
                  <Label className="text-[#999999]">Status</Label>
                  <Badge
                    variant="outline"
                    className={
                      selectedItem.status === "In Stock"
                        ? "bg-green-100 text-green-800"
                        : selectedItem.status === "Low Stock"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {selectedItem.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refill Request Dialog */}
      <Dialog open={isRefillRequestOpen} onOpenChange={setIsRefillRequestOpen}>
        <DialogContent className="bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-[#FF9800]">Request Refill</DialogTitle>
            <DialogDescription>
              Submit a refill request for {selectedItem?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity Needed *</Label>
              <Input
                id="quantity"
                type="number"
                value={refillForm.quantity || ""}
                onChange={(e) =>
                  setRefillForm({ ...refillForm, quantity: parseInt(e.target.value) || 0 })
                }
                placeholder="Enter quantity"
                className="rounded-xl"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select
                value={refillForm.urgency}
                onValueChange={(value) => setRefillForm({ ...refillForm, urgency: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={refillForm.reason}
                onChange={(e) => setRefillForm({ ...refillForm, reason: e.target.value })}
                placeholder="Provide reason for refill request..."
                rows={3}
                className="rounded-xl"
              />
            </div>

            <Card className="bg-[#E3F2FD] border-[#90CAF9]">
              <CardContent className="pt-4">
                <p className="text-sm text-[#333333]">
                  Current stock: <span className="font-medium">{selectedItem?.quantity}</span>{" "}
                  {selectedItem?.unit}
                </p>
                <p className="text-sm text-[#333333]">
                  Min threshold: <span className="font-medium">{selectedItem?.minThreshold}</span>{" "}
                  {selectedItem?.unit}
                </p>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefillRequestOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestRefill} className="bg-[#FF9800] hover:bg-[#F57C00]">
              <Send className="h-4 w-4 mr-2" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
