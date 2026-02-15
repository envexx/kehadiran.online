"use client";

import { useState, useEffect, useRef } from "react";
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
  CheckCircle,
  ShieldCheck,
  Tag,
  Check,
  Star,
  ArrowLeft
} from "phosphor-react";
import Link from "next/link";
import Image from "next/image";

interface PlanData {
  id: string;
  key: string;
  name: string;
  description: string | null;
  price_per_siswa: number;
  original_price: number | null;
  min_siswa: number;
  max_siswa: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}

const STEPS = [
  { num: 1, label: "Data Admin", desc: "Buat akun administrator" },
  { num: 2, label: "Data Sekolah", desc: "Informasi sekolah Anda" },
  { num: 3, label: "Verifikasi", desc: "Konfirmasi email Anda" },
  { num: 4, label: "Pilih Paket", desc: "Pilih paket yang sesuai" },
];

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

  // Step 3 OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Step 4 plans
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // Fetch plans when reaching step 4
  useEffect(() => {
    if (step === 4 && plans.length === 0) {
      setPlansLoading(true);
      fetch("/api/pricing-plans")
        .then(r => r.json())
        .then(d => { if (d.data) setPlans(d.data); })
        .catch(() => {})
        .finally(() => setPlansLoading(false));
    }
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < text.length; i++) newOtp[i] = text[i];
    setOtp(newOtp);
    if (text.length > 0) otpRefs.current[Math.min(text.length, 5)]?.focus();
  };

  // Step 1 → 2
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!namaLengkap || !email || !password) { setError("Nama, email, dan password wajib diisi"); return; }
    if (password.length < 8) { setError("Password minimal 8 karakter"); return; }
    setStep(2);
  };

  // Step 2 → register + send OTP → step 3
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!namaSekolah) { setError("Nama sekolah wajib diisi"); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_lengkap: namaLengkap, email, nomor_telepon: nomorTelepon, password,
          nama_sekolah: namaSekolah, jenjang, alamat,
          telepon_sekolah: teleponSekolah, email_sekolah: emailSekolah,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) { setError(json.error || "Registrasi gagal"); setIsLoading(false); return; }
      setResendCooldown(60);
      setStep(3);
    } catch { setError("Terjadi kesalahan. Silakan coba lagi."); }
    setIsLoading(false);
  };

  // Step 3 → verify OTP → step 4
  const handleVerifyOtp = async () => {
    setError("");
    const code = otp.join("");
    if (code.length !== 6) { setError("Masukkan 6 digit kode verifikasi"); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) { setError(json.error || "Verifikasi gagal"); setIsLoading(false); return; }
      setStep(4);
    } catch { setError("Terjadi kesalahan"); }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError("");
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setResendCooldown(60);
        setOtp(["", "", "", "", "", ""]);
      } else {
        setError(json.error || "Gagal mengirim ulang");
      }
    } catch { setError("Gagal mengirim ulang"); }
  };

  // Step 4 → choose plan → auto-login → dashboard
  const handleChoosePlan = async (planKey: string) => {
    setError("");
    setSelectedPlan(planKey);
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/choose-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, planKey }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) { setError(json.error || "Gagal memilih paket"); setIsLoading(false); setSelectedPlan(null); return; }
      window.location.href = "/dashboard";
    } catch { setError("Terjadi kesalahan"); setIsLoading(false); setSelectedPlan(null); }
  };

  const fmtCurrency = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  const inputCls = {
    inputWrapper: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-gray-700 shadow-sm dark:shadow-none",
    input: "text-gray-900 dark:text-gray-200",
    label: "text-gray-600 dark:text-gray-400",
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding Panel */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
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
                <span className="text-blue-200">Mudah & Cepat</span>
              </h1>
              <p className="text-blue-100/80 mt-4 text-lg leading-relaxed max-w-md">
                Mulai kelola presensi siswa dengan teknologi modern. Gratis 30 hari untuk 30 siswa.
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {STEPS.map((s) => (
                <div key={s.num} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > s.num
                      ? "bg-emerald-400 text-white"
                      : step === s.num
                      ? "bg-white text-blue-600"
                      : "bg-white/20 text-white/60"
                  }`}>
                    {step > s.num ? <CheckCircle size={20} weight="fill" /> : s.num}
                  </div>
                  <div>
                    <p className={`font-semibold ${step >= s.num ? "text-white" : "text-white/60"}`}>{s.label}</p>
                    <p className={`text-sm ${step >= s.num ? "text-blue-200" : "text-white/40"}`}>{s.desc}</p>
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

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50/50 dark:bg-gray-950 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div className="w-10 h-10 relative">
              <Image src="/kehadiran.png" alt="Kehadiran" width={40} height={40} className="object-contain dark:brightness-0 dark:invert" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Kehadiran</span>
          </div>

          {/* Step Indicator (Mobile) */}
          <div className="flex items-center gap-1.5 mb-6 lg:hidden">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center gap-1.5">
                <Chip size="sm" color={step >= s.num ? "primary" : "default"} variant="flat" className="text-[10px]">{s.num}</Chip>
                {i < STEPS.length - 1 && <div className="w-4 h-px bg-gray-300 dark:bg-gray-700" />}
              </div>
            ))}
          </div>

          {/* ============ STEP 1: Admin Data ============ */}
          {step === 1 && (
            <>
              <div className="space-y-2 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Buat Akun Admin</h2>
                <p className="text-gray-500">Lengkapi data diri untuk akun administrator</p>
              </div>
              <form onSubmit={handleStep1} className="space-y-4">
                <Input label="Nama Lengkap" placeholder="Masukkan nama lengkap" size="lg" value={namaLengkap} onValueChange={setNamaLengkap} startContent={<User size={20} className="text-gray-400" />} classNames={inputCls} isRequired />
                <Input label="Email" placeholder="nama@sekolah.sch.id" type="email" size="lg" value={email} onValueChange={setEmail} startContent={<EnvelopeSimple size={20} className="text-gray-400" />} classNames={inputCls} isRequired />
                <Input label="Nomor WhatsApp" placeholder="08xxxxxxxxxx" type="tel" size="lg" value={nomorTelepon} onValueChange={setNomorTelepon} startContent={<Phone size={20} className="text-gray-400" />} classNames={inputCls} isRequired />
                <Input label="Password" placeholder="Minimal 8 karakter" size="lg" value={password} onValueChange={setPassword} startContent={<Lock size={20} className="text-gray-400" />} endContent={<button type="button" onClick={() => setIsVisible(!isVisible)}>{isVisible ? <EyeSlash size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}</button>} type={isVisible ? "text" : "password"} classNames={inputCls} isRequired />
                {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}
                <Button type="submit" color="primary" size="lg" className="w-full font-semibold bg-blue-600 hover:bg-blue-700" endContent={<ArrowRight size={20} weight="bold" />}>Lanjutkan</Button>
              </form>
            </>
          )}

          {/* ============ STEP 2: School Data ============ */}
          {step === 2 && (
            <>
              <div className="space-y-2 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Sekolah</h2>
                <p className="text-gray-500">Masukkan informasi sekolah Anda</p>
              </div>
              <form onSubmit={handleStep2} className="space-y-4">
                <Input label="Nama Sekolah" placeholder="Contoh: SMK Negeri 1 Batam" size="lg" value={namaSekolah} onValueChange={setNamaSekolah} startContent={<Buildings size={20} className="text-gray-400" />} classNames={inputCls} isRequired />
                <Select label="Jenjang Pendidikan" placeholder="Pilih jenjang" size="lg" selectedKeys={jenjang ? [jenjang] : []} onChange={(e) => setJenjang(e.target.value)} classNames={{ trigger: inputCls.inputWrapper, label: inputCls.label }} isRequired>
                  <SelectItem key="sd">SD / Sederajat</SelectItem>
                  <SelectItem key="smp">SMP / Sederajat</SelectItem>
                  <SelectItem key="sma">SMA / Sederajat</SelectItem>
                  <SelectItem key="smk">SMK / Sederajat</SelectItem>
                </Select>
                <Input label="Alamat Sekolah" placeholder="Alamat lengkap sekolah" size="lg" value={alamat} onValueChange={setAlamat} classNames={inputCls} isRequired />
                <Input label="Nomor Telepon Sekolah" placeholder="0778-xxxxxxx" type="tel" size="lg" value={teleponSekolah} onValueChange={setTeleponSekolah} startContent={<Phone size={20} className="text-gray-400" />} classNames={inputCls} />
                <Input label="Email Sekolah" placeholder="info@sekolah.sch.id" type="email" size="lg" value={emailSekolah} onValueChange={setEmailSekolah} startContent={<EnvelopeSimple size={20} className="text-gray-400" />} classNames={inputCls} />
                {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="bordered" size="lg" className="flex-1 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300" onPress={() => { setError(""); setStep(1); }} startContent={<ArrowLeft size={16} />}>Kembali</Button>
                  <Button type="submit" color="primary" size="lg" className="flex-1 font-semibold bg-blue-600 hover:bg-blue-700" isLoading={isLoading} endContent={!isLoading && <ArrowRight size={20} weight="bold" />}>Daftar</Button>
                </div>
              </form>
            </>
          )}

          {/* ============ STEP 3: OTP Verification ============ */}
          {step === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} className="text-blue-600" weight="fill" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verifikasi Email</h2>
              <p className="text-gray-500 text-sm mb-1">Kami telah mengirim kode 6 digit ke</p>
              <p className="text-blue-600 font-semibold text-sm mb-8">{email}</p>

              <div className="flex justify-center gap-2 mb-6" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                ))}
              </div>

              {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

              <Button color="primary" size="lg" className="w-full font-semibold bg-blue-600 hover:bg-blue-700 mb-4" isLoading={isLoading} onPress={handleVerifyOtp}>Verifikasi</Button>

              <p className="text-sm text-gray-500">
                Tidak menerima kode?{" "}
                {resendCooldown > 0 ? (
                  <span className="text-gray-400">Kirim ulang dalam {resendCooldown}s</span>
                ) : (
                  <button onClick={handleResendOtp} className="text-blue-600 hover:text-blue-700 font-semibold">Kirim Ulang</button>
                )}
              </p>
            </div>
          )}

          {/* ============ STEP 4: Choose Plan ============ */}
          {step === 4 && (
            <>
              <div className="space-y-2 mb-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-600" weight="fill" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Terverifikasi!</h2>
                <p className="text-gray-500 text-sm">Pilih paket untuk memulai. Anda bisa upgrade kapan saja.</p>
              </div>

              {plansLoading ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Free trial card */}
                  <button
                    onClick={() => handleChoosePlan("free")}
                    disabled={isLoading}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      selectedPlan === "free" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-300"
                    } ${isLoading && selectedPlan === "free" ? "opacity-70" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <Tag size={18} className="text-gray-500" weight="fill" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Free Trial</h3>
                          </div>
                          <p className="text-[11px] text-gray-500">30 siswa • 30 hari gratis</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">Gratis</p>
                      </div>
                    </div>
                  </button>

                  {plans.filter(p => p.is_active).map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handleChoosePlan(plan.key)}
                      disabled={isLoading}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                        selectedPlan === plan.key ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : plan.is_popular ? "border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 hover:border-blue-400" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-300"
                      } ${isLoading && selectedPlan === plan.key ? "opacity-70" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${plan.is_popular ? "bg-blue-500/10" : "bg-gray-100 dark:bg-gray-800"}`}>
                            {plan.is_popular ? <Star size={18} className="text-blue-500" weight="fill" /> : <Tag size={18} className="text-gray-500" weight="fill" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900 dark:text-white text-sm">{plan.name}</h3>
                              {plan.is_popular && <Chip size="sm" color="primary" variant="flat" className="text-[9px] h-4">Populer</Chip>}
                            </div>
                            <p className="text-[11px] text-gray-500">{plan.min_siswa}–{plan.max_siswa} siswa</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {plan.original_price && plan.original_price > plan.price_per_siswa && (
                            <p className="text-[11px] text-gray-400 line-through">{fmtCurrency(plan.original_price)}</p>
                          )}
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{fmtCurrency(plan.price_per_siswa)}</p>
                          <p className="text-[10px] text-gray-500">/siswa/bulan</p>
                        </div>
                      </div>
                      {plan.features && plan.features.length > 0 && (
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pl-[52px]">
                          {plan.features.slice(0, 4).map((f, i) => (
                            <span key={i} className="flex items-center gap-1 text-[10px] text-gray-500">
                              <Check size={8} weight="bold" className="text-emerald-500" />{f}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {error && <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3 mt-4">{error}</div>}

              {isLoading && selectedPlan && (
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Menyiapkan akun Anda...
                </div>
              )}
            </>
          )}

          {/* Login link (steps 1-2 only) */}
          {step <= 2 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Sudah punya akun?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Masuk</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
