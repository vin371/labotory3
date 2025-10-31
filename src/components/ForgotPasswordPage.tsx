import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FlaskConical, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

interface ForgotPasswordPageProps {
  onBackToLogin: () => void;
}

export function ForgotPasswordPage({ onBackToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Simulate sending email
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-[480px]">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
              <FlaskConical className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-slate-800 mb-2">Laboratory Management System</h1>
            <p className="text-slate-600">Password Reset</p>
          </div>

          {/* Success Card */}
          <Card className="shadow-2xl border-slate-200 bg-white animate-in fade-in slide-in-from-bottom-4 min-h-[520px]">
            <CardHeader className="space-y-1 bg-gradient-to-r from-green-50 to-blue-50 border-b border-slate-200">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-slate-800 text-center">Email Sent!</CardTitle>
              <CardDescription className="text-slate-600 text-center">
                Reset link sent to your email
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-slate-700">
                  We've sent password reset instructions to:
                </p>
                <p className="text-blue-600">{email}</p>
                <p className="text-slate-600">
                  Please check your inbox and follow the instructions to reset your password.
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <p className="text-slate-700 mb-2">Didn't receive the email?</p>
                  <ul className="text-slate-600 space-y-1">
                    <li>• Check your spam or junk folder</li>
                    <li>• Make sure you entered the correct email</li>
                    <li>• Wait a few minutes for the email to arrive</li>
                  </ul>
                </div>

                <Button
                  onClick={onBackToLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[480px]">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <FlaskConical className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-slate-800 mb-2">Laboratory Management System</h1>
          <p className="text-slate-600">Password Recovery</p>
        </div>

        {/* Forgot Password Card */}
        <Card className="shadow-2xl border-slate-200 bg-white min-h-[520px]">
          <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
            <CardTitle className="text-slate-800 text-center">Forgot your password?</CardTitle>
            <CardDescription className="text-slate-600 text-center">
              Enter your registered email to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={`pl-10 bg-white border-slate-300 ${error ? "border-red-500" : ""}`}
                  />
                </div>
                {error && (
                  <p className="text-red-600 animate-in fade-in slide-in-from-top-1">{error}</p>
                )}
              </div>

              {/* Send Reset Link Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send Reset Link
              </Button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <Button
                variant="ghost"
                onClick={onBackToLogin}
                className="w-full text-slate-700 hover:bg-slate-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
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
