/**
 * ============================================================================
 * DEMO ADMIN LAYOUT - QUICK TEST
 * ============================================================================
 * 
 * File này để test nhanh Admin Header & Sidebar
 * 
 * CÁCH SỬ DỤNG:
 * 1. Import vào App.tsx:
 *    import { DemoAdminLayout } from "./DEMO_ADMIN_LAYOUT";
 * 
 * 2. Render trong App:
 *    function App() {
 *      return <DemoAdminLayout />;
 *    }
 * 
 * 3. Xem kết quả trong browser
 * 
 * ============================================================================
 */

import { AdminDashboardWithLayout } from "./components/AdminDashboardWithLayout";

export function DemoAdminLayout() {
  const handleLogout = () => {
    console.log("Logout clicked!");
    alert("Logout successful!");
  };

  return (
    <AdminDashboardWithLayout
      adminName="Dr. John Smith"
      adminEmail="john.smith@labware.com"
      onLogout={handleLogout}
    />
  );
}

// ============================================================================
// ALTERNATIVE: Test riêng lẻ từng component
// ============================================================================

import { useState } from "react";
import { AdminLayout } from "./components/AdminLayout";
import { AdminTabView } from "./components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

export function DemoAdminLayoutSimple() {
  const [currentTab, setCurrentTab] = useState<AdminTabView>("dashboard");

  const renderContent = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-slate-800">Current Tab: {currentTab}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Card 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">This is a test card for {currentTab}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Card 2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Content for {currentTab} page</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Card 3</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">More content here...</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-slate-600">
              <p>✅ Click menu items in sidebar to navigate</p>
              <p>✅ Click toggle button to collapse/expand sidebar</p>
              <p>✅ Click bell icon to see notifications</p>
              <p>✅ Click user avatar to see user menu</p>
              <p>✅ Try resizing window to see responsive design</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <AdminLayout
      adminName="Test Admin"
      adminEmail="admin@test.com"
      onLogout={() => alert("Logged out!")}
      currentTab={currentTab}
      onTabChange={setCurrentTab}
    >
      {renderContent()}
    </AdminLayout>
  );
}

// ============================================================================
// TEST CÁC TAB KHÁC NHAU
// ============================================================================

import { UserManagement } from "./components/UserManagement";
import { RoleManagement } from "./components/RoleManagement";
import { PatientManagement } from "./components/PatientManagement";

export function DemoAdminLayoutWithPages() {
  const [currentTab, setCurrentTab] = useState<AdminTabView>("dashboard");

  const renderContent = () => {
    switch (currentTab) {
      case "users":
        return <UserManagement />;
      
      case "roles":
        return <RoleManagement />;
      
      case "patients":
        return <PatientManagement />;
      
      case "testOrders":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Test Orders Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Test Orders page content here...</p>
            </CardContent>
          </Card>
        );
      
      case "instruments":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Instruments Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Instruments page content here...</p>
            </CardContent>
          </Card>
        );
      
      case "warehouse":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Warehouse page content here...</p>
            </CardContent>
          </Card>
        );
      
      case "logs":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Event Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Event logs page content here...</p>
            </CardContent>
          </Card>
        );
      
      case "reports":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Reports page content here...</p>
            </CardContent>
          </Card>
        );
      
      case "notifications":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notifications Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Notifications settings page content here...</p>
            </CardContent>
          </Card>
        );
      
      case "backup":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Backup management page content here...</p>
            </CardContent>
          </Card>
        );
      
      case "config":
        return (
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">Configuration page content here...</p>
            </CardContent>
          </Card>
        );
      
      case "dashboard":
      default:
        return (
          <div className="space-y-6">
            <h1 className="text-slate-800">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-slate-800">1,234</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Active Patients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-slate-800">2,458</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Test Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-slate-800">342</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Instruments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl text-slate-800">24/28</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <AdminLayout
      adminName="Admin User"
      adminEmail="admin@labware.com"
      onLogout={() => console.log("Logout")}
      currentTab={currentTab}
      onTabChange={setCurrentTab}
    >
      {renderContent()}
    </AdminLayout>
  );
}

/**
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 * 
 * // Example 1: Basic demo
 * export default function App() {
 *   return <DemoAdminLayout />;
 * }
 * 
 * // Example 2: Simple demo with basic content
 * export default function App() {
 *   return <DemoAdminLayoutSimple />;
 * }
 * 
 * // Example 3: Demo with all pages
 * export default function App() {
 *   return <DemoAdminLayoutWithPages />;
 * }
 * 
 * ============================================================================
 */
