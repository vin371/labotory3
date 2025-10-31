import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Package,
  Wrench,
  TestTube,
  X,
  Eye,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";

interface Notification {
  id: string;
  type: "device_error" | "low_stock" | "test_order" | "maintenance" | "approval_required";
  title: string;
  message: string;
  timestamp: string;
  priority: "high" | "medium" | "low";
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "NOT-001",
    type: "device_error",
    title: "Instrument Error Detected",
    message: "Hematology Analyzer XN-1000 reported calibration error. Requires immediate attention.",
    timestamp: "2025-10-21 14:30:00",
    priority: "high",
    read: false,
  },
  {
    id: "NOT-002",
    type: "low_stock",
    title: "Low Stock Alert",
    message: "CBC Reagent Kit stock level below minimum threshold (85 units remaining).",
    timestamp: "2025-10-21 13:45:00",
    priority: "medium",
    read: false,
  },
  {
    id: "NOT-003",
    type: "test_order",
    title: "New Test Order",
    message: "Urgent test order TO-2025-10-21-089 assigned to your lab. Priority: High.",
    timestamp: "2025-10-21 13:20:00",
    priority: "high",
    read: false,
  },
  {
    id: "NOT-004",
    type: "approval_required",
    title: "Approval Required",
    message: "Mode change request for Chemistry Analyzer AU-5800 awaiting your approval.",
    timestamp: "2025-10-21 12:55:00",
    priority: "medium",
    read: false,
  },
  {
    id: "NOT-005",
    type: "maintenance",
    title: "Scheduled Maintenance Due",
    message: "Immunology Analyzer maintenance scheduled for tomorrow at 09:00 AM.",
    timestamp: "2025-10-21 12:00:00",
    priority: "low",
    read: true,
  },
  {
    id: "NOT-006",
    type: "test_order",
    title: "Test Completed",
    message: "Test order TO-2025-10-21-078 has been completed. Results ready for review.",
    timestamp: "2025-10-21 11:30:00",
    priority: "low",
    read: true,
  },
  {
    id: "NOT-007",
    type: "low_stock",
    title: "Critical Stock Alert",
    message: "Calibration Standard stock critically low (12 units). Immediate refill required.",
    timestamp: "2025-10-21 10:15:00",
    priority: "high",
    read: true,
  },
];

export function ManagerNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "unread") return !notif.read;
    if (activeTab === "read") return notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsDetailOpen(true);
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case "device_error":
        return <Wrench className="h-5 w-5 text-red-600" />;
      case "low_stock":
        return <Package className="h-5 w-5 text-yellow-600" />;
      case "test_order":
        return <TestTube className="h-5 w-5 text-blue-600" />;
      case "maintenance":
        return <Wrench className="h-5 w-5 text-purple-600" />;
      case "approval_required":
        return <CheckCircle2 className="h-5 w-5 text-orange-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBackgroundByType = (type: string) => {
    switch (type) {
      case "device_error":
        return "bg-red-100";
      case "low_stock":
        return "bg-yellow-100";
      case "test_order":
        return "bg-blue-100";
      case "maintenance":
        return "bg-purple-100";
      case "approval_required":
        return "bg-orange-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#007BFF] mb-2">Notifications</h1>
          <p className="text-[#6B7280]">Laboratory alerts and updates</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" className="rounded-xl">
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-gradient-to-br from-[#E3F2FD] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">Total Notifications</CardDescription>
            <CardTitle className="text-[#007BFF]">{notifications.length}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-red-200 rounded-xl bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">Unread</CardDescription>
            <CardTitle className="text-red-600">{unreadCount}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="shadow-lg border-[#FFE082] rounded-xl bg-gradient-to-br from-[#FFF8E1] to-white">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#6B7280]">High Priority</CardDescription>
            <CardTitle className="text-[#FFC107]">
              {notifications.filter((n) => n.priority === "high").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Notifications Tabs */}
      <Card className="shadow-lg border-[#BBDEFB] rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-[#E3F2FD] to-white border-b border-[#BBDEFB]">
          <CardTitle className="text-[#007BFF]">Notification Center</CardTitle>
          <CardDescription>View and manage your laboratory notifications</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="read">
                Read ({notifications.length - unreadCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`shadow-lg rounded-xl border transition-all hover:shadow-xl ${
                        notification.read
                          ? "bg-white border-[#E0E6ED]"
                          : "bg-[#E3F2FD] border-[#90CAF9]"
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className={`p-3 rounded-lg ${getBackgroundByType(notification.type)}`}>
                            {getIconByType(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-[#333333]">{notification.title}</h3>
                              <Badge
                                variant="outline"
                                className={
                                  notification.priority === "high"
                                    ? "bg-red-100 text-red-800"
                                    : notification.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {notification.priority}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                              )}
                            </div>
                            <p className="text-sm text-[#666666] mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4">
                              <p className="text-xs text-[#999999]">{notification.timestamp}</p>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {notification.type.replace("_", " ")}
                              </Badge>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(notification)}
                              className="rounded-xl text-[#007BFF] hover:bg-[#E3F2FD]"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="rounded-xl text-green-600 hover:bg-green-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredNotifications.length === 0 && (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-[#E0E6ED] mx-auto mb-4" />
                      <p className="text-[#6B7280]">No notifications found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Notification Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-white rounded-xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#007BFF]">Notification Details</DialogTitle>
            <DialogDescription>Complete notification information</DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${getBackgroundByType(selectedNotification.type)}`}>
                  {getIconByType(selectedNotification.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-[#333333]">{selectedNotification.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={
                        selectedNotification.priority === "high"
                          ? "bg-red-100 text-red-800"
                          : selectedNotification.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {selectedNotification.priority} Priority
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {selectedNotification.type.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F9FBFF] rounded-xl">
                <p className="text-sm text-[#333333]">{selectedNotification.message}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#999999]">Notification ID</p>
                  <p className="text-sm text-[#333333]">{selectedNotification.id}</p>
                </div>
                <div>
                  <p className="text-xs text-[#999999]">Timestamp</p>
                  <p className="text-sm text-[#333333]">{selectedNotification.timestamp}</p>
                </div>
              </div>

              {selectedNotification.type === "approval_required" && (
                <div className="flex gap-2">
                  <Button className="flex-1 bg-[#28A745] hover:bg-[#218838] rounded-xl">
                    Approve Request
                  </Button>
                  <Button className="flex-1" variant="outline">
                    View Details
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
