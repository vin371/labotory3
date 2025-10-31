import { useState, ReactNode } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar, AdminTabView } from "./AdminSidebar";
import { cn } from "./ui/utils";

interface AdminLayoutProps {
  children: ReactNode;
  adminName?: string;
  adminEmail?: string;
  onLogout: () => void;
  currentTab: AdminTabView;
  onTabChange: (tab: AdminTabView) => void;
}

export function AdminLayout({
  children,
  adminName,
  adminEmail,
  onLogout,
  currentTab,
  onTabChange,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <AdminHeader
        adminName={adminName}
        adminEmail={adminEmail}
        onLogout={onLogout}
        onToggleSidebar={toggleSidebar}
        sidebarOpen={sidebarOpen}
      />

      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onTabChange={onTabChange}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-16",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
