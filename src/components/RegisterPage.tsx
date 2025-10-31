import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { FlaskConical, User, Mail, Phone, CreditCard, Calendar, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  identifyNumber: string;
  gender: string;
  dateOfBirth: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  identifyNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterPage({ onRegisterSuccess, onNavigateToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    identifyNumber: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const validatePassword = (password: string) => {
    // 8-12 characters, contains uppercase, lowercase, and numbers
    const isValidLength = password.length >= 8 && password.length <= 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    return isValidLength && hasUppercase && hasLowercase && hasNumber;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Invalid phone format. Please enter at least 10 digits.";
    }

    // Identify Number validation
    if (!formData.identifyNumber.trim()) {
      newErrors.identifyNumber = "ID number is required.";
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Please select your gender.";
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password too weak. Must be 8-12 characters with uppercase, lowercase, and numbers.";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Registration successful!", {
        description: "Please log in with your credentials.",
        icon: <CheckCircle2 className="h-4 w-4" />,
      });

      // Redirect to login page after 1.5 seconds
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    }, 1500);
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.email.trim() &&
      formData.phone.trim() &&
      formData.identifyNumber.trim() &&
      formData.gender &&
      formData.dateOfBirth &&
      formData.password &&
      formData.confirmPassword
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-[640px]">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <FlaskConical className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-slate-800 mb-2">Laboratory Management System</h1>
          <p className="text-slate-600">Create Your Account</p>
        </div>

        {/* Registration Card */}
        <Card className="shadow-2xl border-slate-200 bg-white min-h-[520px]">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
            <CardTitle className="text-slate-800 text-center">Create an Account</CardTitle>
            <CardDescription className="text-slate-600 text-center">
              Please fill in the details to register
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-slate-700">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData({ ...formData, fullName: e.target.value });
                      setErrors({ ...errors, fullName: undefined });
                    }}
                    className={`pl-10 bg-white border-slate-300 ${errors.fullName ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.fullName && <p className="text-red-600">{errors.fullName}</p>}
              </div>

              {/* Email and Phone - Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setErrors({ ...errors, email: undefined });
                      }}
                      className={`pl-10 bg-white border-slate-300 ${errors.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-red-600">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        setErrors({ ...errors, phone: undefined });
                      }}
                      className={`pl-10 bg-white border-slate-300 ${errors.phone ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-600">{errors.phone}</p>}
                </div>
              </div>

              {/* ID Number and Gender - Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Identify Number */}
                <div className="space-y-2">
                  <Label htmlFor="identifyNumber" className="text-slate-700">
                    Identify Number (ID) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="identifyNumber"
                      type="text"
                      placeholder="Enter your ID number"
                      value={formData.identifyNumber}
                      onChange={(e) => {
                        setFormData({ ...formData, identifyNumber: e.target.value });
                        setErrors({ ...errors, identifyNumber: undefined });
                      }}
                      className={`pl-10 bg-white border-slate-300 ${errors.identifyNumber ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.identifyNumber && <p className="text-red-600">{errors.identifyNumber}</p>}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-slate-700">
                    Gender <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => {
                      setFormData({ ...formData, gender: value });
                      setErrors({ ...errors, gender: undefined });
                    }}
                  >
                    <SelectTrigger id="gender" className={`bg-white border-slate-300 ${errors.gender ? "border-red-500" : ""}`}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-red-600">{errors.gender}</p>}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-slate-700">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => {
                      setFormData({ ...formData, dateOfBirth: e.target.value });
                      setErrors({ ...errors, dateOfBirth: undefined });
                    }}
                    className={`pl-10 bg-white border-slate-300 ${errors.dateOfBirth ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.dateOfBirth && <p className="text-red-600">{errors.dateOfBirth}</p>}
              </div>

              {/* Password and Confirm Password - Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="8-12 characters"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setErrors({ ...errors, password: undefined });
                      }}
                      className={`pl-10 bg-white border-slate-300 ${errors.password ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.password && <p className="text-red-600">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => {
                        setFormData({ ...formData, confirmPassword: e.target.value });
                        setErrors({ ...errors, confirmPassword: undefined });
                      }}
                      className={`pl-10 bg-white border-slate-300 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating Account..." : "Register"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-slate-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Login
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-slate-500 mt-6">
          © 2025 Laboratory Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}
