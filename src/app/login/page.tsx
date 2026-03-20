"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/api";

export default function LoginPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Backend expects mobile_number and password
      const response = await api.post("/auth/admin-login", { 
        mobile_number: mobileNumber, 
        password: password 
      });
      
      const { token } = response.data;

      // 1. Save in LocalStorage for Axios API Client
      localStorage.setItem("adminToken", token);

      // 2. Set Cookie for Next.js Middleware (Security)
      // Expires in 7 days
      document.cookie = `adminToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;

      // 3. Redirect to dashboard
      router.push("/dashboard");
      router.refresh(); // Middleware ko naya cookie detect karne ke liye
      
    } catch (error: any) {
      const msg = error.response?.data?.message || "Invalid Credentials or Server Error";
      console.error("Login Error:", error.response?.data);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            BATTLE BOOYAH
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Admin Control Panel
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Mobile Number
            </label>
            <input
              type="text"
              required
              className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter admin mobile number"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:bg-slate-400 transition-all shadow-md active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Authenticating...
              </span>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400 uppercase tracking-widest font-semibold">
          Secure Access Only
        </p>
      </div>
    </div>
  );
}