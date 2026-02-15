"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { 
  Eye, 
  EyeSlash, 
  EnvelopeSimple,
  Lock,
  ArrowRight,
  Shield,
  Warning
} from "phosphor-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        setIsLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push("/admin");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 dark:from-gray-900 dark:via-gray-950 dark:to-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image src="/kehadiran_no_bg.png" alt="Kehadiran" width={40} height={40} className="object-contain brightness-0 invert" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Kehadiran</span>
              <span className="text-xs text-gray-500 ml-2">Super Admin</span>
            </div>
          </div>

          {/* Center Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full">
              <Shield size={14} weight="fill" className="text-red-400" />
              <span className="text-xs font-semibold text-red-400">Akses Terbatas</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Super Admin
              <br />
              <span className="text-gray-400">Control Panel</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              Kelola seluruh platform Kehadiran. Akses ini hanya untuk administrator sistem yang berwenang.
            </p>

            {/* Capabilities */}
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {["Kelola Tenant", "SMTP Config", "Billing & Invoice", "Audit Log"].map((cap) => (
                <div key={cap} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-xs text-gray-300">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Kehadiran by PT Core Solution Digital
          </p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 relative">
              <Image src="/kehadiran_no_bg.png" alt="Kehadiran" width={40} height={40} className="object-contain dark:brightness-0 dark:invert" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Kehadiran</span>
              <span className="text-xs text-gray-500 ml-2">Admin</span>
            </div>
          </div>

          <div className="space-y-2 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full mb-3 lg:hidden">
              <Shield size={14} weight="fill" className="text-red-400" />
              <span className="text-xs font-semibold text-red-400">Akses Terbatas</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Super Admin Login</h2>
            <p className="text-gray-500 text-sm">Masukkan kredensial super admin Anda</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl mb-5">
              <Warning size={16} weight="fill" className="text-red-500 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              placeholder="super@kehadiran.online"
              type="email"
              size="lg"
              value={email}
              onValueChange={setEmail}
              startContent={<EnvelopeSimple size={20} className="text-gray-400 dark:text-gray-500" />}
              classNames={{
                inputWrapper: "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-gray-700 shadow-none",
                input: "text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600",
                label: "text-gray-600 dark:text-gray-400",
              }}
              isRequired
            />

            <Input
              label="Password"
              placeholder="Masukkan password"
              size="lg"
              value={password}
              onValueChange={setPassword}
              startContent={<Lock size={20} className="text-gray-400 dark:text-gray-500" />}
              endContent={
                <button type="button" onClick={() => setIsVisible(!isVisible)}>
                  {isVisible ? (
                    <EyeSlash size={20} className="text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Eye size={20} className="text-gray-400 dark:text-gray-500" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              classNames={{
                inputWrapper: "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-gray-700 shadow-none",
                input: "text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600",
                label: "text-gray-600 dark:text-gray-400",
              }}
              isRequired
            />

            <Button
              type="submit"
              size="lg"
              className="w-full font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              isLoading={isLoading}
              endContent={!isLoading && <ArrowRight size={20} weight="bold" />}
            >
              Masuk sebagai Super Admin
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/login" className="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-gray-400 transition-colors">
              ← Kembali ke login sekolah
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center leading-relaxed">
              Halaman ini hanya untuk administrator sistem Kehadiran. 
              Percobaan akses tidak sah akan dicatat dan dilaporkan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
