import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Shield,
  UserCircle,
  FlaskConical,
  Package,
  Activity,
  FileText,
  Settings,
  Database,
  Bell,
  BarChart3,
  Wrench,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

export type AdminTabView =
  | "dashboard"
  | "users"
  | "roles"
  | "patients"
  | "testOrders"
  | "instruments"
  | "warehouse"
  | "logs"
  | "reports"
  | "config"
  | "notifications"
  | "backup"
  | "settings";

interface AdminSidebarProps {
  currentTab: AdminTabView;
  onTabChange: (tab: AdminTabView) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

interface MenuItem {
  id: AdminTabView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "destructive" | "warning" | "success";
  description?: string;
}

export function AdminSidebar({
  currentTab,
  onTabChange,
  sidebarOpen,
  onToggleSidebar,
}: AdminSidebarProps) {
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview & Analytics",
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      description: "Manage system users",
    },
    {
      id: "roles",
      label: "Role Management",
      icon: Shield,
      description: "Configure user roles",
    },
    {
      id: "patients",
      label: "Patient Management",
      icon: UserCircle,
      badge: "2.4K",
      description: "Patient records",
    },
    {
      id: "testOrders",
      label: "Test Orders",
      icon: FlaskConical,
      badge: "342",
      badgeVariant: "success",
      description: "Lab test orders",
    },
    {
      id: "instruments",
      label: "Instruments",
      icon: Wrench,
      badge: "24/28",
      description: "Equipment management",
    },
    {
      id: "warehouse",
      label: "Warehouse",
      icon: Package,
      badge: "8",
      badgeVariant: "warning",
      description: "Inventory & reagents",
    },
    {
      id: "logs",
      label: "Event Logs",
      icon: Activity,
      description: "System activity logs",
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      description: "Analytics & reports",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: "12",
      badgeVariant: "destructive",
      description: "System notifications",
    },
    {
      id: "backup",
      label: "Backup & Restore",
      icon: Database,
      description: "Data management",
    },
    {
      id: "config",
      label: "Configuration",
      icon: Settings,
      description: "System settings",
    },
  ];

  const getBadgeStyles = (variant?: string) => {
    switch (variant) {
      case "destructive":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "warning":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "success":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      default:
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 bottom-0 z-40 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <ScrollArea className="h-full">
          <div className="flex flex-col py-4">
            {/* Menu Items */}
            <nav className="flex flex-col gap-1 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      "justify-start gap-3 h-auto py-3 transition-all",
                      isActive
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        : "text-slate-700 hover:text-blue-600 hover:bg-blue-50",
                      !sidebarOpen && "justify-center px-2"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 shrink-0", sidebarOpen ? "" : "h-6 w-6")} />
                    
                    {sidebarOpen && (
                      <>
                        <div className="flex flex-1 flex-col items-start gap-0.5">
                          <span className="text-sm">{item.label}</span>
                          {item.description && (
                            <span
                              className={cn(
                                "text-xs",
                                isActive
                                  ? "text-blue-100"
                                  : "text-slate-500 group-hover:text-blue-500"
                              )}
                            >
                              {item.description}
                            </span>
                          )}
                        </div>
                        
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "ml-auto text-xs px-2 py-0.5",
                              isActive
                                ? "bg-white/20 text-white hover:bg-white/30"
                                : getBadgeStyles(item.badgeVariant)
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                );
              })}
            </nav>

            {/* Separator */}
            {sidebarOpen && <Separator className="my-4" />}

            {/* System Status */}
            {sidebarOpen && (
              <div className="px-6 py-3">
                <h4 className="text-xs text-slate-500 mb-3">System Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Server</span>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Database</span>
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-green-600">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">Backup</span>
                    <span className="text-xs text-slate-500">2h ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Toggle Button */}
        <div
          className={cn(
            "absolute bottom-4 border-t border-slate-200 pt-4 bg-white",
            sidebarOpen ? "left-0 right-0 px-3" : "left-0 right-0 flex justify-center"
          )}
        >
          <Button
            variant="outline"
            size={sidebarOpen ? "default" : "icon"}
            onClick={onToggleSidebar}
            className={cn(
              "border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300",
              sidebarOpen ? "w-full" : ""
            )}
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Collapse
              </>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}
    </>
  );
}
