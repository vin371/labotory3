import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FlaskConical, Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { TEST_ACCOUNTS } from "../types/auth";
import { AuthUser } from "../types/auth";

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
  onNavigateToForgotPassword: () => void;
  onNavigateToRegister: () => void;
}

export function LoginPage({ onLogin, onNavigateToForgotPassword, onNavigateToRegister }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      return; // Button should be disabled anyway
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check against test accounts
      const account = TEST_ACCOUNTS.find(
        acc => acc.email === email && acc.password === password
      );

      if (account) {
        const user: AuthUser = {
          id: Date.now().toString(),
          fullName: account.name,
          email: account.email,
          role: account.role,
          status: "active",
          createdAt: new Date().toISOString(),
        };
        setIsLoading(false);
        onLogin(user);
      } else {
        setIsLoading(false);
        setError("Invalid username or password");
      }
    }, 1000);
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <FlaskConical className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-slate-800 mb-2">Laboratory Management System</h1>
          <p className="text-slate-600">Secure Access Portal</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-slate-200 bg-white min-h-[520px]">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
            <CardTitle className="text-slate-800 text-center">Login to your account</CardTitle>
            <CardDescription className="text-slate-600 text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Username / Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={`pl-10 bg-white border-slate-300 ${error ? "border-red-500" : ""}`}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className={`pl-10 pr-10 bg-white border-slate-300 ${error ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </form>

            {/* Register Link */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-slate-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  Register here
                </button>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-slate-700 mb-3">Test Accounts:</p>
                {TEST_ACCOUNTS.map((account, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-slate-600">
                      <strong>{account.name}:</strong> <code className="bg-white px-2 py-1 rounded text-blue-700 text-sm">{account.email} / {account.password}</code>
                    </p>
                    <p className="text-xs text-slate-500 ml-1">{account.description}</p>
                  </div>
                ))}
              </div>
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
