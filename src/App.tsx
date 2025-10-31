import { useState } from "react";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { RegisterPage } from "./components/RegisterPage";
import { AppLayout } from "./components/AppLayout";
import { PatientDashboard } from "./components/PatientDashboard";
import { AdminDashboardComplete } from "./components/AdminDashboardComplete";
import { LabUserDashboard } from "./components/LabUserDashboard";
import { ManagerDashboardComplete } from "./components/ManagerDashboardComplete";
import { ServiceDashboard } from "./components/ServiceDashboard";
import { ChangePasswordPage } from "./components/ChangePasswordPage";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthUser } from "./types/auth";
import { hasPermission } from "./types/auth";

type PageView = "home" | "login" | "forgot-password" | "register" | "app" | "change-password";

function AppContent() {
  const { user, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageView>("home");

  const handleLogin = (userData: AuthUser) => {
    login(userData);
    setCurrentPage("app");
  };

  const handleLogout = () => {
    logout();
    setCurrentPage("home");
  };

  const handleChangePassword = () => {
    setCurrentPage("change-password");
  };

  const handleChangePasswordSuccess = () => {
    setCurrentPage("app");
  };

  const handleNavigateToLogin = () => {
    setCurrentPage("login");
  };

  const handleNavigateToForgotPassword = () => {
    // Check if user has permission to use forgot password
    if (user && !hasPermission(user.role, "FORGOT_PASSWORD")) {
      return;
    }
    setCurrentPage("forgot-password");
  };

  const handleNavigateToRegister = () => {
    setCurrentPage("register");
  };

  const handleBackToLogin = () => {
    setCurrentPage("login");
  };

  const handleRegisterSuccess = () => {
    setCurrentPage("login");
  };

  if (currentPage === "home") {
    return (
      <>
        <HomePage onNavigateToLogin={handleNavigateToLogin} />
        <Toaster />
      </>
    );
  }

  if (currentPage === "login" && !user) {
    return (
      <>
        <LoginPage
          onLogin={handleLogin}
          onNavigateToForgotPassword={handleNavigateToForgotPassword}
          onNavigateToRegister={handleNavigateToRegister}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "forgot-password") {
    return (
      <>
        <ForgotPasswordPage onBackToLogin={handleBackToLogin} />
        <Toaster />
      </>
    );
  }

  if (currentPage === "register") {
    return (
      <>
        <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={handleBackToLogin}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "change-password") {
    return (
      <>
        <ChangePasswordPage
          onSuccess={handleChangePasswordSuccess}
          onCancel={() => setCurrentPage("app")}
        />
        <Toaster />
      </>
    );
  }

  if (user) {
    // Check if user is a patient
    if (user.role === "patient") {
      return (
        <>
          <PatientDashboard 
            onLogout={handleLogout}
            patientName={user.fullName}
          />
          <Toaster />
        </>
      );
    }
    
    // Check if user is an admin - show new AdminDashboard
    if (user.role === "admin") {
      return (
        <>
          <AdminDashboardComplete 
            onLogout={handleLogout}
            adminName={user.fullName}
          />
          <Toaster />
        </>
      );
    }
    
    // Check if user is a manager - show Manager Dashboard
    if (user.role === "manager") {
      return (
        <>
          <ManagerDashboardComplete 
            onLogout={handleLogout}
            managerName={user.fullName}
          />
          <Toaster />
        </>
      );
    }
    
    // Check if user is a lab user - show Lab User Dashboard
    if (user.role === "lab_user") {
      return (
        <>
          <LabUserDashboard 
            onLogout={handleLogout}
            labUserName={user.fullName}
          />
          <Toaster />
        </>
      );
    }
    
    // Check if user is a service user - show Service Dashboard
    if (user.role === "service_user") {
      return (
        <>
          <ServiceDashboard 
            onLogout={handleLogout}
            serviceTechName={user.fullName}
          />
          <Toaster />
        </>
      );
    }
    
    // Otherwise show the regular app layout for other roles
    return (
      <>
        <AppLayout 
          onLogout={handleLogout}
          onChangePassword={handleChangePassword}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <HomePage onNavigateToLogin={handleNavigateToLogin} />
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
