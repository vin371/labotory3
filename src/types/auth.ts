export type UserRole = "admin" | "manager" | "lab_user" | "service_user" | "patient";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface AuthUser extends User {
  token?: string;
}

export const PERMISSIONS = {
  // Auth permissions
  LOGIN: ["admin", "manager", "lab_user", "service_user", "patient"],
  LOGOUT: ["admin", "manager", "lab_user", "service_user", "patient"],
  FORGOT_PASSWORD: ["admin", "manager", "lab_user", "patient"],
  CHANGE_PASSWORD: ["admin", "manager", "lab_user", "patient"],
  
  // User permissions
  LIST_USERS: ["admin", "manager"],
  CREATE_USER: ["admin", "manager"],
  UPDATE_USER: ["admin", "manager"],
  VIEW_USER_DETAIL: ["admin", "manager"],
  DELETE_USER: ["admin", "manager"],
  
  // Role permissions
  LIST_ROLES: ["admin", "manager"],
  CREATE_ROLE: ["admin"],
  UPDATE_ROLE: ["admin"],
  DELETE_ROLE: ["admin"],
  VIEW_ROLE_DETAIL: ["admin", "manager"],
  
  // Monitoring permissions - ONLY Lab User, Manager, Service User
  VIEW_EVENT_LOGS: ["manager", "lab_user", "service_user"],
  VIEW_EVENT_LOG_DETAIL: ["manager", "lab_user", "service_user"],
  VIEW_CONFIG: ["admin", "manager", "service_user"],
  VIEW_HEALTH_CHECK: ["manager", "service_user"], // NOT Lab User
  VIEW_TEST_RESULTS_SYNC: ["service_user"], // Service User only
  
  // Patient Service permissions - ONLY Lab User
  VIEW_PATIENT_RECORDS: ["lab_user"],
  VIEW_PATIENT_DETAIL: ["lab_user"],
  ADD_PATIENT_RECORD: ["lab_user"],
  UPDATE_PATIENT_RECORD: ["lab_user"],
  DELETE_PATIENT_RECORD: ["lab_user"],
  
  // Test Order Service permissions - ONLY Lab User
  VIEW_TEST_ORDERS: ["lab_user"],
  VIEW_TEST_ORDER_DETAIL: ["lab_user"],
  CREATE_TEST_ORDER: ["lab_user"],
  UPDATE_TEST_ORDER: ["lab_user"],
  DELETE_TEST_ORDER: ["lab_user"],
  REVIEW_TEST_RESULTS: ["lab_user"],
  AI_REVIEW_TEST_RESULTS: ["lab_user"],
  MANAGE_COMMENTS: ["lab_user"],
  EXPORT_TEST_ORDERS: ["lab_user"],
  PRINT_TEST_RESULTS: ["lab_user"],
  
  // Instrument Service permissions - ONLY Lab User
  CHANGE_INSTRUMENT_MODE: ["lab_user"],
  EXECUTE_BLOOD_TESTING: ["lab_user"],
  PUBLISH_HL7_RESULTS: ["lab_user"],
  SYNC_TEST_RESULTS: ["lab_user"],
  DELETE_RAW_RESULTS: ["lab_user"],
  VIEW_AUTO_DELETE_LOGS: ["lab_user"],
  INSTALL_REAGENTS: ["lab_user"],
  MODIFY_REAGENTS: ["lab_user"],
  DELETE_REAGENTS: ["lab_user"],
  SYNC_CONFIGURATION: ["lab_user"],
  VIEW_INSTRUMENT_SERVICE: ["lab_user"],
  
  // Warehouse Service - Instrument Management permissions
  VIEW_ALL_INSTRUMENTS: ["manager", "service_user"],
  ADD_INSTRUMENT: ["manager", "service_user"],
  CHECK_INSTRUMENT_STATUS: ["service_user"],
  ACTIVATE_DEACTIVATE_INSTRUMENT: ["service_user"],
  AUTO_DELETE_INSTRUMENT: ["service_user"],
  
  // Warehouse Service - Reagent History permissions (ONLY Lab User)
  VIEW_REAGENT_VENDOR_SUPPLY: ["lab_user"],
  VIEW_REAGENT_USAGE_HISTORY: ["lab_user"],
  
  // Warehouse Service - Configuration Management permissions
  VIEW_CONFIGURATIONS: ["lab_user", "manager", "service_user"],
  CREATE_CONFIGURATION: ["lab_user", "manager", "service_user"],
  MODIFY_CONFIGURATION: ["lab_user", "manager", "service_user"],
  DELETE_CONFIGURATION: ["lab_user", "manager", "service_user"],
  
  // Warehouse Service Access
  VIEW_WAREHOUSE: ["lab_user", "manager", "service_user"],
  
  // Patient Dashboard permissions
  VIEW_PATIENT_DASHBOARD: ["patient"],
  VIEW_OWN_TEST_RESULTS: ["patient"],
  VIEW_OWN_MEDICAL_RECORDS: ["patient"],
  VIEW_OWN_TEST_HISTORY: ["patient"],
  VIEW_OWN_PROFILE: ["patient"],
} as const;

export const hasPermission = (userRole: UserRole, permission: keyof typeof PERMISSIONS): boolean => {
  const permissionRoles = PERMISSIONS[permission];
  if (!permissionRoles) return false;
  return permissionRoles.includes(userRole);
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  lab_user: "Lab User",
  service_user: "Service User",
  patient: "Patient",
};

// Test accounts for each role
export const TEST_ACCOUNTS = [
  { email: "admin@lab.com", password: "Admin123", role: "admin" as UserRole, name: "Admin User", description: "Admin + User/Role mgmt (NO Lab Services)" },
  { email: "manager@lab.com", password: "Manager123", role: "manager" as UserRole, name: "Manager User", description: "User mgmt + Event Logs + Health Check (NO Lab Services)" },
  { email: "labuser@lab.com", password: "LabUser123", role: "lab_user" as UserRole, name: "Lab User", description: "FULL LAB ACCESS: Patient + Test Orders + Instrument Service" },
  { email: "service@lab.com", password: "Service123", role: "service_user" as UserRole, name: "Service User", description: "Monitoring only (NO Lab Services)" },
  { email: "patient@lab.com", password: "Patient123", role: "patient" as UserRole, name: "John Doe", description: "Patient Dashboard: View own test results and medical records" },
];
