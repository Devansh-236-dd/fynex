import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import type { User } from "../App";

interface Props {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("admin@fynex.ai");
  const [password, setPassword] = useState("demo1234");
  const [role, setRole] = useState("Admin");
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"credentials" | "2fa">("credentials");
  const [loading, setLoading] = useState(false);

  const nameMap: Record<string, string> = {
    Admin: "Ankit Verma",
    Investigator: "Deepa Nair",
    Auditor: "Rohan Shah",
  };

  const handleCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("2fa");
    }, 800);
  };

  const handleOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email, role, name: nameMap[role] || "User" });
    }, 600);
  };

  return (
    <div className="min-h-screen pastel-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 animate-fade-in-up">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl mb-3 animate-float">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Fynex
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bank-Grade Fraud Intelligence Platform
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white p-8 animate-fade-in-up">
          {step === "credentials" ? (
            <form onSubmit={handleCredentials} className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Welcome back
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your credentials to access the platform
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 rounded-xl border-gray-200"
                  required
                  data-ocid="login.input"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 rounded-xl border-gray-200 pr-10"
                    required
                    data-ocid="login.password.input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">Access Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger
                    className="h-10 rounded-xl border-gray-200"
                    data-ocid="login.role.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Investigator">Investigator</SelectItem>
                    <SelectItem value="Auditor">Auditor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
                disabled={loading}
                data-ocid="login.submit_button"
              >
                {loading ? "Verifying..." : "Continue to 2FA"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtp} className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Two-Factor Auth
                </h2>
                <p className="text-xs text-slate-500">
                  Enter the 6-digit code sent to your device (use any code for
                  demo)
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="otp" className="text-sm text-gray-700">
                  OTP Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="h-10 rounded-xl border-gray-200 text-center text-xl tracking-widest"
                  data-ocid="login.otp.input"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={loading}
                data-ocid="login.otp.submit_button"
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
              <button
                type="button"
                onClick={() => setStep("credentials")}
                className="w-full text-xs text-slate-500 hover:text-blue-600 transition-colors"
              >
                ← Back to credentials
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Protected by 256-bit AES encryption · ISO 27001 certified
        </p>
        <p className="text-center text-xs text-slate-400 mt-2">
          © {new Date().getFullYear()} Fynex. All rights reserved.
        </p>
      </div>
    </div>
  );
}
