import { useState } from "react";
import { Button } from "./ui/button";
import { Package, FlaskConical, Settings, Users, Shield, LogOut, FlaskConicalIcon, KeyRound, FileText, Activity, Database, UserCircle, ClipboardList, Wrench } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission, ROLE_LABELS } from "../types/auth";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { InstrumentManagement } from "./InstrumentManagement";
import { ReagentHistory } from "./ReagentHistory";
import { Configuration } from "./Configuration";
import { UserManagement } from "./UserManagement";
import { RoleManagement } from "./RoleManagement";
import { EventLogsManagement } from "./EventLogsManagement";
import { EventLogDetail } from "./EventLogDetail";
import { HealthCheckDashboard } from "./HealthCheckDashboard";
import { TestResultsSync } from "./TestResultsSync";
import { PatientManagement } from "./PatientManagement";
import { PatientDetail } from "./PatientDetail";
import { TestOrderManagement } from "./TestOrderManagement";
import { TestOrderDetail } from "./TestOrderDetail";
import { InstrumentService } from "./InstrumentService";
import { WarehousePage } from "./WarehousePage";
import { AccessDenied } from "./AccessDenied";

type PageView = "warehouse" | "users" | "roles" | "event-logs" | "event-log-detail" | "health-check" | "test-sync" | "patients" | "patient-detail" | "test-orders" | "test-order-detail" | "instrument-service" | "access-denied";

interface AppLayoutProps {
  onLogout: () => void;
  onChangePassword: () => void;
}

export function AppLayout({ onLogout, onChangePassword }: AppLayoutProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageView>("warehouse");
  const [selectedEventLog, setSelectedEventLog] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedTestOrder, setSelectedTestOrder] = useState<any>(null);

  const canListUsers = user && hasPermission(user.role, "LIST_USERS");
  const canListRoles = user && hasPermission(user.role, "LIST_ROLES");
  const canChangePassword = user && hasPermission(user.role, "CHANGE_PASSWORD");
  const canViewEventLogs = user && hasPermission(user.role, "VIEW_EVENT_LOGS");
  const canViewHealthCheck = user && hasPermission(user.role, "VIEW_HEALTH_CHECK");
  const canViewTestSync = user && hasPermission(user.role, "VIEW_TEST_RESULTS_SYNC");
  const canViewPatients = user && hasPermission(user.role, "VIEW_PATIENT_RECORDS");
  const canViewTestOrders = user && hasPermission(user.role, "VIEW_TEST_ORDERS");
  const canViewInstrumentService = user && hasPermission(user.role, "VIEW_INSTRUMENT_SERVICE");
  const canViewWarehouse = user && hasPermission(user.role, "VIEW_WAREHOUSE");

  const menuItems = [
    {
      title: "Warehouse",
      items: [
        { 
          title: "Warehouse Service", 
          icon: Package, 
          page: "warehouse" as PageView,
          visible: canViewWarehouse 
        },
      ]
    },
    {
      title: "Patient Service",
      items: [
        { 
          title: "Patient Medical Records", 
          icon: UserCircle, 
          page: "patients" as PageView,
          visible: canViewPatients 
        },
        { 
          title: "Test Order Service", 
          icon: ClipboardList, 
          page: "test-orders" as PageView,
          visible: canViewTestOrders 
        },
        { 
          title: "Instrument Service", 
          icon: Wrench, 
          page: "instrument-service" as PageView,
          visible: canViewInstrumentService 
        },
      ]
    },
    {
      title: "Monitoring",
      items: [
        { 
          title: "Event Logs", 
          icon: FileText, 
          page: "event-logs" as PageView,
          visible: canViewEventLogs 
        },
        { 
          title: "Health Check", 
          icon: Activity, 
          page: "health-check" as PageView,
          visible: canViewHealthCheck 
        },
        { 
          title: "Test Results Sync", 
          icon: Database, 
          page: "test-sync" as PageView,
          visible: canViewTestSync 
        },
      ]
    },
    {
      title: "Administration",
      items: [
        { 
          title: "User Management", 
          icon: Users, 
          page: "users" as PageView,
          visible: canListUsers 
        },
        { 
          title: "Role Management", 
          icon: Shield, 
          page: "roles" as PageView,
          visible: canListRoles 
        },
      ]
    }
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
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

  const handleViewEventLogDetail = (eventLog: any) => {
    setSelectedEventLog(eventLog);
    setCurrentPage("event-log-detail");
  };

  const handleBackToEventLogs = () => {
    setSelectedEventLog(null);
    setCurrentPage("event-logs");
  };

  const handleViewPatientDetail = (patient: any) => {
    setSelectedPatient(patient);
    setCurrentPage("patient-detail");
  };

  const handleBackToPatients = () => {
    setSelectedPatient(null);
    setCurrentPage("patients");
  };

  const handleViewTestOrderDetail = (testOrder: any) => {
    setSelectedTestOrder(testOrder);
    setCurrentPage("test-order-detail");
  };

  const handleBackToTestOrders = () => {
    setSelectedTestOrder(null);
    setCurrentPage("test-orders");
  };

  const handleAccessDeniedBack = () => {
    setCurrentPage("warehouse");
  };

  const renderContent = () => {
    switch (currentPage) {
      case "warehouse":
        // Check permission - Lab User, Manager, Service User
        if (!canViewWarehouse) {
          return <AccessDenied onBack={handleAccessDeniedBack} />;
        }
        return <WarehousePage />;
      case "users":
        return <UserManagement />;
      case "roles":
        return <RoleManagement />;
      case "patients":
        // Check permission - ONLY Lab User
        if (!canViewPatients) {
          return <AccessDenied onBack={handleAccessDeniedBack} />;
        }
        return <PatientManagement onViewDetail={handleViewPatientDetail} />;
      case "patient-detail":
        // Check permission - ONLY Lab User
        if (!canViewPatients) {
          return <AccessDenied onBack={handleAccessDeniedBack} />;
        }
        return <PatientDetail patient={selectedPatient} onBack={handleBackToPatients} />;
      case "test-orders":
        // Check permission - ONLY Lab User
        if (!canViewTestOrders) {
          return <AccessDenied onBack={handleAccessDeniedBack} />;
        }
        return <TestOrderManagement onViewDetail={handleViewTestOrderDetail} />;
      case "test-order-detail":
        // Check permission - ONLY Lab User
        if (!canViewTestOrders) {
          return <AccessDenied onBack={handleAccessDeniedBack} />;
        }
        return <TestOrderDetail testOrder={selectedTestOrder} onBack={handleBackToTestOrders} />;
      case "instrument-service":
        // Check permission - ONLY Lab User
        if (!canViewInstrumentService) {
          return <AccessDenied onBack={handleAccessDeniedBack} />;
        }
        return <InstrumentService />;
      case "event-logs":
        // Check permission
        if (!canViewEventLogs) {
          return <AccessDenied onBack={handleAccessDeniedBack} />;
        }
        return <EventLogsManagement onViewDetail={handleViewEventLogDetail} />;
      case "event-log-detail":
        // Check permission
        if (!canViewEventLogs) {
          return <AccessDenied onBack={handleAccessDeniedBack} />;
        }
        return <EventLogDetail eventLog={selectedEventLog} onBack={handleBackToEventLogs} />;
      case "health-check":
        // Check permission
        if (!canViewHealthCheck) {
          return <AccessDenied onBack={handleAccessDeniedBack} />;
        }
        return <HealthCheckDashboard />;
      case "test-sync":
        // Check permission
        if (!canViewTestSync) {
          return <AccessDenied onBack={handleAccessDeniedBack} />;
        }
        return <TestResultsSync />;
      case "access-denied":
        return <AccessDenied onBack={handleAccessDeniedBack} />;
      default:
        return <InstrumentManagement />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-200 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="border-b border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-md">
              <FlaskConicalIcon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-slate-800">Lab System</h2>
              <p className="text-slate-500 text-xs">Management Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          {menuItems.map((group) => {
            const visibleItems = group.items.filter(item => item.visible);
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.title} className="mb-6">
                <h3 className="text-slate-500 px-3 mb-2 text-xs uppercase tracking-wider">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {visibleItems.map((item) => (
                    <button
                      key={item.page}
                      onClick={() => setCurrentPage(item.page)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                        ${currentPage === item.page 
                          ? "bg-blue-600 text-white shadow-md" 
                          : "text-slate-700 hover:bg-slate-100"
                        }
                      `}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-3 space-y-3">
          {/* User Profile */}
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {user ? getInitials(user.fullName) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 text-sm truncate">{user?.fullName}</p>
                <p className="text-slate-500 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="outline" className={`w-full justify-center text-xs ${user ? getRoleBadgeColor(user.role) : ''}`}>
                {user ? ROLE_LABELS[user.role] : "User"}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-1.5">
            {canChangePassword && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-slate-700 hover:bg-slate-100 text-sm"
                onClick={onChangePassword}
              >
                <KeyRound className="h-3.5 w-3.5" />
                Change Password
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 text-sm"
              onClick={onLogout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 max-w-7xl">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-slate-800 mb-2">
              {currentPage === "event-log-detail" 
                ? "Event Log Detail" 
                : menuItems
                    .flatMap(g => g.items)
                    .find(i => i.page === currentPage)?.title || "Dashboard"}
            </h1>
            <p className="text-slate-600">
              {currentPage === "warehouse" && "Manage instruments, reagent history, and configurations"}
              {currentPage === "users" && "Manage system users and permissions"}
              {currentPage === "roles" && "Configure roles and access control"}
              {currentPage === "patients" && "Manage patient medical records and test results"}
              {currentPage === "patient-detail" && "Complete patient information and medical test history"}
              {currentPage === "test-orders" && "Manage patient test orders and track test results"}
              {currentPage === "test-order-detail" && "Complete test order information and results"}
              {currentPage === "instrument-service" && "Instrument operations, blood testing, and reagent management"}
              {currentPage === "event-logs" && "Monitor and track all system events and activities"}
              {currentPage === "event-log-detail" && "Detailed information about the event log"}
              {currentPage === "health-check" && "Real-time monitoring of message broker health"}
              {currentPage === "test-sync" && "Monitor backup synchronization of raw test results"}
              {currentPage === "access-denied" && "Access to this feature is restricted"}
            </p>
          </div>

          {/* Page Content */}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
