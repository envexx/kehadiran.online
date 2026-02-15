"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { 
  Eye, 
  EyeSlash, 
  EnvelopeSimple,
  Lock,
  ArrowRight,
  Play
} from "phosphor-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Email dan password wajib diisi"); return; }
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login gagal"); setIsLoading(false); return; }
      window.location.href = "/dashboard";
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    setError("");
    setEmail("demo@kehadiran.online");
    setPassword("demokehadiran");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "demo@kehadiran.online", password: "demokehadiran" }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Demo login gagal"); setIsDemoLoading(false); return; }
      window.location.href = "/dashboard";
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image src="/kehadiran_no_bg.png" alt="Kehadiran" width={40} height={40} className="object-contain brightness-0 invert" />
            </div>
            <span className="text-xl font-bold text-white">Kehadiran</span>
          </div>

          {/* Center Content */}
          <div className="space-y-6">
            <div>
              <Chip size="sm" className="bg-white/15 text-white border-0 mb-4">
                Platform Presensi #1 di Batam
              </Chip>
              <h1 className="text-4xl font-bold text-white leading-tight">
                Sistem Presensi Digital
                <br />
                <span className="text-blue-200">untuk Sekolah Modern</span>
              </h1>
              <p className="text-blue-100/80 mt-4 text-lg leading-relaxed max-w-md">
                Kelola kehadiran siswa dengan QR Code dan notifikasi WhatsApp real-time ke orang tua.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              {["QR Code Scan", "WhatsApp Notif", "Laporan Otomatis", "Multi Sekolah"].map((f) => (
                <div key={f} className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/90">
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-blue-200/60 text-sm">
            &copy; {new Date().getFullYear()} Kehadiran by PT Core Solution Digital
          </p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/50 dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 relative">
              <Image src="/kehadiran_no_bg.png" alt="Kehadiran" width={40} height={40} className="object-contain dark:brightness-0 dark:invert" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Kehadiran</span>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Selamat Datang</h2>
            <p className="text-gray-500">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email"
              placeholder="nama@sekolah.sch.id"
              type="email"
              size="lg"
              value={email}
              onValueChange={setEmail}
              startContent={<EnvelopeSimple size={20} className="text-gray-400" />}
              classNames={{
                inputWrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-gray-700 shadow-sm dark:shadow-none",
                input: "text-gray-900 dark:text-gray-200",
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
              startContent={<Lock size={20} className="text-gray-400" />}
              endContent={
                <button type="button" onClick={() => setIsVisible(!isVisible)}>
                  {isVisible ? (
                    <EyeSlash size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              classNames={{
                inputWrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-gray-700 shadow-sm dark:shadow-none",
                input: "text-gray-900 dark:text-gray-200",
                label: "text-gray-600 dark:text-gray-400",
              }}
              isRequired
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Ingat saya</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Lupa password?
              </Link>
            </div>

            <Button
              type="submit"
              color="primary"
              size="lg"
              className="w-full font-semibold bg-blue-600 hover:bg-blue-700"
              isLoading={isLoading}
              endContent={!isLoading && <ArrowRight size={20} weight="bold" />}
            >
              Masuk
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Daftar Sekolah
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50/50 dark:bg-gray-950 text-gray-400">atau</span>
            </div>
          </div>

          {/* Live Demo */}
          <Button
            variant="bordered"
            size="lg"
            className="w-full border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
            isLoading={isDemoLoading}
            startContent={!isDemoLoading && <Play size={18} weight="fill" className="text-emerald-500" />}
            onPress={handleDemoLogin}
          >
            Live Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
