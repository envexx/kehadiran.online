"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
import { 
  EnvelopeSimple,
  Lock,
  User,
  Phone,
  Buildings,
  ArrowRight,
  Eye,
  EyeSlash,
  CheckCircle
} from "phosphor-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Step 1 fields
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 fields
  const [namaSekolah, setNamaSekolah] = useState("");
  const [jenjang, setJenjang] = useState("");
  const [alamat, setAlamat] = useState("");
  const [teleponSekolah, setTeleponSekolah] = useState("");
  const [emailSekolah, setEmailSekolah] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (step === 1) {
      if (!namaLengkap || !email || !password) { setError("Nama, email, dan password wajib diisi"); return; }
      if (password.length < 8) { setError("Password minimal 8 karakter"); return; }
      setStep(2);
      return;
    }
    if (!namaSekolah) { setError("Nama sekolah wajib diisi"); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_lengkap: namaLengkap,
          email,
          nomor_telepon: nomorTelepon,
          password,
          nama_sekolah: namaSekolah,
          jenjang,
          alamat,
          telepon_sekolah: teleponSekolah,
          email_sekolah: emailSekolah,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Registrasi gagal");
        setIsLoading(false);
        return;
      }
      window.location.href = "/dashboard";
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative">
              <Image src="/kehadiran.png" alt="Kehadiran" width={40} height={40} className="object-contain brightness-0 invert" />
            </div>
            <span className="text-xl font-bold text-white">Kehadiran</span>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-white leading-tight">
                Daftarkan Sekolah Anda
                <br />
                <span className="text-blue-200">dalam 2 Menit</span>
              </h1>
              <p className="text-blue-100/80 mt-4 text-lg leading-relaxed max-w-md">
                Mulai kelola presensi siswa dengan teknologi modern. Gratis 30 hari untuk 30 siswa.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {[
                { num: 1, label: "Data Admin", desc: "Buat akun administrator" },
                { num: 2, label: "Data Sekolah", desc: "Informasi sekolah Anda" },
              ].map((s) => (
                <div key={s.num} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= s.num 
                      ? "bg-white text-blue-600" 
                      : "bg-white/20 text-white/60"
                  }`}>
                    {step > s.num ? <CheckCircle size={20} weight="fill" /> : s.num}
                  </div>
                  <div>
                    <p className={`font-semibold ${step >= s.num ? "text-white" : "text-white/60"}`}>
                      {s.label}
                    </p>
                    <p className={`text-sm ${step >= s.num ? "text-blue-200" : "text-white/40"}`}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-blue-200/60 text-sm">
            &copy; {new Date().getFullYear()} Kehadiran by PT Core Solution Digital
          </p>
        </div>
      </div>

      {/* Right - Register Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 relative">
              <Image src="/kehadiran.png" alt="Kehadiran" width={40} height={40} className="object-contain" />
            </div>
            <span className="text-xl font-bold">Kehadiran</span>
          </div>

          {/* Step Indicator (Mobile) */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <Chip size="sm" color={step >= 1 ? "primary" : "default"} variant="flat">Step 1</Chip>
            <div className="w-8 h-px bg-gray-300" />
            <Chip size="sm" color={step >= 2 ? "primary" : "default"} variant="flat">Step 2</Chip>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? "Buat Akun Admin" : "Data Sekolah"}
            </h2>
            <p className="text-gray-500">
              {step === 1 
                ? "Lengkapi data diri untuk akun administrator" 
                : "Masukkan informasi sekolah Anda"
              }
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {step === 1 ? (
              <>
                <Input
                  label="Nama Lengkap"
                  placeholder="Masukkan nama lengkap"
                  size="lg"
                  value={namaLengkap}
                  onValueChange={setNamaLengkap}
                  startContent={<User size={20} className="text-gray-400" />}
                  classNames={{
                    inputWrapper: "bg-white border border-gray-200 hover:border-blue-400 shadow-sm",
                    label: "text-gray-600",
                  }}
                  isRequired
                />

                <Input
                  label="Email"
                  placeholder="nama@sekolah.sch.id"
                  type="email"
                  size="lg"
                  value={email}
                  onValueChange={setEmail}
                  startContent={<EnvelopeSimple size={20} className="text-gray-400" />}
                  classNames={{
                    inputWrapper: "bg-white border border-gray-200 hover:border-blue-400 shadow-sm",
                    label: "text-gray-600",
                  }}
                  isRequired
                />

                <Input
                  label="Nomor WhatsApp"
                  placeholder="08xxxxxxxxxx"
                  type="tel"
                  size="lg"
                  value={nomorTelepon}
                  onValueChange={setNomorTelepon}
                  startContent={<Phone size={20} className="text-gray-400" />}
                  classNames={{
                    inputWrapper: "bg-white border border-gray-200 hover:border-blue-400 shadow-sm",
                    label: "text-gray-600",
                  }}
                  isRequired
                />

                <Input
                  label="Password"
                  placeholder="Minimal 8 karakter"
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
                    inputWrapper: "bg-white border border-gray-200 hover:border-blue-400 shadow-sm",
                    label: "text-gray-600",
                  }}
                  isRequired
                />
              </>
            ) : (
              <>
                <Input
                  label="Nama Sekolah"
                  placeholder="Contoh: SMK Negeri 1 Batam"
                  size="lg"
                  value={namaSekolah}
                  onValueChange={setNamaSekolah}
                  startContent={<Buildings size={20} className="text-gray-400" />}
                  classNames={{
                    inputWrapper: "bg-white border border-gray-200 hover:border-blue-400 shadow-sm",
                    label: "text-gray-600",
                  }}
                  isRequired
                />

                <Select
                  label="Jenjang Pendidikan"
                  placeholder="Pilih jenjang"
                  size="lg"
                  selectedKeys={jenjang ? [jenjang] : []}
                  onChange={(e) => setJenjang(e.target.value)}
                  classNames={{
                    trigger: "bg-white border border-gray-200 hover:border-blue-400 shadow-sm",
                    label: "text-gray-600",
                  }}
                  isRequired
                >
                  <SelectItem key="sd">SD / Sederajat</SelectItem>
                  <SelectItem key="smp">SMP / Sederajat</SelectItem>
                  <SelectItem key="sma">SMA / Sederajat</SelectItem>
                  <SelectItem key="smk">SMK / Sederajat</SelectItem>
                </Select>

                <Input
                  label="Alamat Sekolah"
                  placeholder="Alamat lengkap sekolah"
                  size="lg"
                  value={alamat}
                  onValueChange={setAlamat}
                  classNames={{
                    inputWrapper: "bg-white border border-gray-200 hover:border-blue-400 shadow-sm",
                    label: "text-gray-600",
                  }}
                  isRequired
                />

                <Input
                  label="Nomor Telepon Sekolah"
                  placeholder="0778-xxxxxxx"
                  type="tel"
                  size="lg"
                  value={teleponSekolah}
                  onValueChange={setTeleponSekolah}
                  startContent={<Phone size={20} className="text-gray-400" />}
                  classNames={{
                    inputWrapper: "bg-white border border-gray-200 hover:border-blue-400 shadow-sm",
                    label: "text-gray-600",
                  }}
                />

                <Input
                  label="Email Sekolah"
                  placeholder="info@sekolah.sch.id"
                  type="email"
                  size="lg"
                  value={emailSekolah}
                  onValueChange={setEmailSekolah}
                  startContent={<EnvelopeSimple size={20} className="text-gray-400" />}
                  classNames={{
                    inputWrapper: "bg-white border border-gray-200 hover:border-blue-400 shadow-sm",
                    label: "text-gray-600",
                  }}
                />
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <Button
                  type="button"
                  variant="bordered"
                  size="lg"
                  className="flex-1 border-gray-200"
                  onPress={() => setStep(1)}
                >
                  Kembali
                </Button>
              )}
              <Button
                type="submit"
                color="primary"
                size="lg"
                className={`font-semibold bg-blue-600 hover:bg-blue-700 ${step === 1 ? "w-full" : "flex-1"}`}
                isLoading={isLoading}
                endContent={!isLoading && <ArrowRight size={20} weight="bold" />}
              >
                {step === 1 ? "Lanjutkan" : "Daftar Sekarang"}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Masuk
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
