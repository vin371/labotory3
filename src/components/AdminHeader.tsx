import { useState } from "react";
import {
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  Settings,
  HelpCircle,
  FlaskConical,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

interface AdminHeaderProps {
  adminName?: string;
  adminEmail?: string;
  onLogout: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

interface Notification {
  id: number;
  type: "info" | "warning" | "success" | "error";
  message: string;
  time: string;
  read: boolean;
}

export function AdminHeader({
  adminName = "Admin User",
  adminEmail = "admin@labware.com",
  onLogout,
  onToggleSidebar,
  sidebarOpen,
}: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "warning",
      message: "Low stock alert: Reagent ABC-123 below threshold",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      type: "info",
      message: "Instrument maintenance scheduled for tomorrow",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      type: "success",
      message: "New test order created successfully",
      time: "2 hours ago",
      read: true,
    },
    {
      id: 4,
      type: "warning",
      message: "System backup completed with warnings",
      time: "3 hours ago",
      read: true,
    },
    {
      id: 5,
      type: "error",
      message: "Failed login attempt detected from unknown location",
      time: "5 hours ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "error":
        return "text-red-600 bg-red-50";
      case "warning":
        return "text-amber-600 bg-amber-50";
      case "success":
        return "text-green-600 bg-green-50";
      case "info":
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section - Logo & Toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-slate-700 hover:text-blue-600 hover:bg-blue-50"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <FlaskConical className="h-6 w-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h2 className="text-slate-800">LabWare</h2>
              <p className="text-xs text-slate-600">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden flex-1 max-w-xl mx-6 lg:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search users, patients, orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-700 hover:text-blue-600 hover:bg-blue-50"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Help */}
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-700 hover:text-blue-600 hover:bg-blue-50"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-700 hover:text-blue-600 hover:bg-blue-50"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[400px]">
                <div className="divide-y divide-slate-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                        !notification.read ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getNotificationColor(
                            notification.type
                          )}`}
                        >
                          <Bell className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm text-slate-800">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-2 border-t border-slate-200">
                <Button
                  variant="ghost"
                  className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getInitials(adminName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm text-slate-800">{adminName}</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm text-slate-800">{adminName}</p>
                  <p className="text-xs text-slate-500">{adminEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onLogout}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
