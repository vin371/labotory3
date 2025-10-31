import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { TrendingUp, TrendingDown, Search, Package } from "lucide-react";

interface VendorSupply {
  id: string;
  reagentName: string;
  catalogNumber: string;
  manufacturer: string;
  casNumber: string;
  vendorName: string;
  vendorId: string;
  poNumber: string;
  orderDate: string;
  receiptDate: string;
  quantityReceived: number;
  unit: string;
  lotNumber: string;
  expirationDate: string;
  receivedBy: string;
  storageLocation: string;
  status: "Received" | "Partial Shipment" | "Returned";
}

interface ReagentUsage {
  id: string;
  reagentName: string;
  lotNumber: string;
  action: string;
  quantityUsed: number;
  unit: string;
  date: string;
  time: string;
  performedBy: string;
  purpose: string;
  remainingStock: number;
}

const mockVendorSupplies: VendorSupply[] = [
  {
    id: "VS-001",
    reagentName: "Ethanol 99.9%",
    catalogNumber: "CAT-ETH-001",
    manufacturer: "Sigma-Aldrich",
    casNumber: "64-17-5",
    vendorName: "Sigma-Aldrich Corp",
    vendorId: "VEN-SA-001",
    poNumber: "PO-2024-156",
    orderDate: "2024-10-01",
    receiptDate: "2024-10-08",
    quantityReceived: 5000,
    unit: "mL",
    lotNumber: "LOT-ETH-24Q3-001",
    expirationDate: "2026-10-08",
    receivedBy: "labuser@lab.com",
    storageLocation: "Cabinet A-3",
    status: "Received",
  },
  {
    id: "VS-002",
    reagentName: "Sodium Chloride",
    catalogNumber: "CAT-NAC-002",
    manufacturer: "Fisher Scientific",
    casNumber: "7647-14-5",
    vendorName: "Fisher Scientific Inc",
    vendorId: "VEN-FS-002",
    poNumber: "PO-2024-157",
    orderDate: "2024-10-03",
    receiptDate: "2024-10-10",
    quantityReceived: 2000,
    unit: "g",
    lotNumber: "LOT-NAC-24Q4-002",
    expirationDate: "2027-01-15",
    receivedBy: "labuser@lab.com",
    storageLocation: "Shelf B-1",
    status: "Received",
  },
  {
    id: "VS-003",
    reagentName: "Hydrochloric Acid 37%",
    catalogNumber: "CAT-HCL-003",
    manufacturer: "Merck",
    casNumber: "7647-01-0",
    vendorName: "Merck KGaA",
    vendorId: "VEN-MK-003",
    poNumber: "PO-2024-158",
    orderDate: "2024-09-25",
    receiptDate: "2024-10-05",
    quantityReceived: 2500,
    unit: "mL",
    lotNumber: "LOT-HCL-24Q3-003",
    expirationDate: "2026-06-30",
    receivedBy: "labuser@lab.com",
    storageLocation: "Acid Cabinet",
    status: "Received",
  },
];

const mockReagentUsage: ReagentUsage[] = [
  {
    id: "RU-001",
    reagentName: "Ethanol 99.9%",
    lotNumber: "LOT-ETH-24Q3-001",
    action: "Dispensed for Testing",
    quantityUsed: 250,
    unit: "mL",
    date: "2024-10-14",
    time: "09:30:00",
    performedBy: "labuser@lab.com",
    purpose: "Blood Sample Preparation - TO-2024-045",
    remainingStock: 4750,
  },
  {
    id: "RU-002",
    reagentName: "Sodium Chloride",
    lotNumber: "LOT-NAC-24Q4-002",
    action: "Used in Buffer Preparation",
    quantityUsed: 100,
    unit: "g",
    date: "2024-10-13",
    time: "14:15:00",
    performedBy: "labuser@lab.com",
    purpose: "PBS Buffer Solution Preparation",
    remainingStock: 1900,
  },
  {
    id: "RU-003",
    reagentName: "Hydrochloric Acid 37%",
    lotNumber: "LOT-HCL-24Q3-003",
    action: "Dispensed for Titration",
    quantityUsed: 150,
    unit: "mL",
    date: "2024-10-12",
    time: "10:45:00",
    performedBy: "labuser@lab.com",
    purpose: "pH Adjustment - Experiment EXP-2024-042",
    remainingStock: 2350,
  },
];

export function ReagentHistory() {
  const [searchSupply, setSearchSupply] = useState("");
  const [searchUsage, setSearchUsage] = useState("");
  const [filterReagent, setFilterReagent] = useState("__all__");

  const filteredSupplies = mockVendorSupplies.filter(
    (supply) =>
      (!searchSupply ||
        supply.reagentName.toLowerCase().includes(searchSupply.toLowerCase()) ||
        supply.vendorName.toLowerCase().includes(searchSupply.toLowerCase()) ||
        supply.lotNumber.toLowerCase().includes(searchSupply.toLowerCase())) &&
      (filterReagent === "__all__" || supply.reagentName === filterReagent)
  );

  const filteredUsage = mockReagentUsage.filter(
    (usage) =>
      (!searchUsage ||
        usage.reagentName.toLowerCase().includes(searchUsage.toLowerCase()) ||
        usage.purpose.toLowerCase().includes(searchUsage.toLowerCase())) &&
      (filterReagent === "__all__" || usage.reagentName === filterReagent)
  );

  const allReagents = Array.from(
    new Set([...mockVendorSupplies.map((s) => s.reagentName)])
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-green-100 text-green-800 border-green-200";
      case "Partial Shipment":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Returned":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStockColor = (remaining: number, unit: string) => {
    const threshold = unit === "mL" ? 1000 : 500;
    if (remaining < threshold) return "bg-red-100 text-red-800 border-red-200";
    if (remaining < threshold * 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  return (
    <Card className="shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
        <CardTitle className="text-slate-800">Reagent History Tracing</CardTitle>
        <CardDescription className="text-slate-600">
          Complete audit trail of reagent vendor supply and usage (Lab User Only)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="supply" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="supply" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Vendor Supply
            </TabsTrigger>
            <TabsTrigger value="usage" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Usage History
            </TabsTrigger>
          </TabsList>

          {/* Vendor Supply Tab */}
          <TabsContent value="supply" className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by reagent, vendor, or lot number..."
                  value={searchSupply}
                  onChange={(e) => setSearchSupply(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterReagent} onValueChange={setFilterReagent}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by reagent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Reagents</SelectItem>
                  {allReagents.map((reagent) => (
                    <SelectItem key={reagent} value={reagent}>
                      {reagent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vendor Supply Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead>Reagent Information</TableHead>
                    <TableHead>Vendor Details</TableHead>
                    <TableHead>Supply/Order Details</TableHead>
                    <TableHead>Batch Information</TableHead>
                    <TableHead>Receiving Info</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSupplies.map((supply) => (
                    <TableRow key={supply.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-slate-800">{supply.reagentName}</p>
                          <p className="text-xs text-slate-500">Cat: {supply.catalogNumber}</p>
                          <p className="text-xs text-slate-500">CAS: {supply.casNumber}</p>
                          <p className="text-xs text-slate-500">{supply.manufacturer}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-slate-700">{supply.vendorName}</p>
                          <p className="text-xs text-slate-500">{supply.vendorId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-600">PO: {supply.poNumber}</p>
                          <p className="text-xs text-slate-500">Ordered: {supply.orderDate}</p>
                          <p className="text-xs text-slate-500">Received: {supply.receiptDate}</p>
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 mt-1">
                            {supply.quantityReceived} {supply.unit}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-600">Lot: {supply.lotNumber}</p>
                          <p className="text-xs text-slate-500">Exp: {supply.expirationDate}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-600">{supply.receivedBy}</p>
                          <p className="text-xs text-slate-500">{supply.receiptDate}</p>
                          <p className="text-xs text-slate-500">📦 {supply.storageLocation}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(supply.status)}>
                          {supply.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Package className="h-4 w-4 text-slate-500" />
              <p className="text-sm text-slate-600">
                Total Records: <strong>{filteredSupplies.length}</strong> | Full traceability maintained for compliance
              </p>
            </div>
          </TabsContent>

          {/* Usage History Tab */}
          <TabsContent value="usage" className="space-y-4">
            {/* Filters */}
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by reagent or purpose..."
                  value={searchUsage}
                  onChange={(e) => setSearchUsage(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterReagent} onValueChange={setFilterReagent}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by reagent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Reagents</SelectItem>
                  {allReagents.map((reagent) => (
                    <SelectItem key={reagent} value={reagent}>
                      {reagent}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Usage History Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead>Reagent & Lot</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Quantity Used</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Remaining Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsage.map((usage) => (
                    <TableRow key={usage.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-slate-800">{usage.reagentName}</p>
                          <p className="text-xs text-slate-500">Lot: {usage.lotNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{usage.action}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                          {usage.quantityUsed} {usage.unit}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs text-slate-600">{usage.date}</p>
                          <p className="text-xs text-slate-500">{usage.time}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{usage.performedBy}</TableCell>
                      <TableCell className="text-sm text-slate-600 max-w-xs">{usage.purpose}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStockColor(usage.remainingStock, usage.unit)}>
                          {usage.remainingStock} {usage.unit}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-slate-500" />
                <p className="text-sm text-slate-600">
                  Total Records: <strong>{filteredUsage.length}</strong>
                </p>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-600">Sufficient</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-slate-600">Low Stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-slate-600">Critical</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Audit Trail:</strong> All reagent supply and usage records are immutable (append-only) for compliance. Access restricted to authorized Lab Users only. Data automatically logged when reagents are installed in Instrument Service.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
