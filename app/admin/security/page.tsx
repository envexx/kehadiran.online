"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { 
  Shield,
  Lock,
  Key,
  Globe,
  Warning,
  CheckCircle
} from "phosphor-react";

export default function AdminSecurityPage() {
  const securitySettings = [
    { key: "2fa", label: "Two-Factor Authentication", desc: "Wajibkan 2FA untuk semua admin tenant", active: true, icon: Lock },
    { key: "session", label: "Session Timeout", desc: "Auto logout setelah 30 menit tidak aktif", active: true, icon: Key },
    { key: "ip_whitelist", label: "IP Whitelist", desc: "Batasi akses super admin hanya dari IP tertentu", active: false, icon: Globe },
    { key: "brute_force", label: "Brute Force Protection", desc: "Blokir IP setelah 5 kali gagal login", active: true, icon: Shield },
    { key: "password_policy", label: "Password Policy", desc: "Minimal 8 karakter, huruf besar, angka, dan simbol", active: true, icon: Lock },
    { key: "audit_log", label: "Audit Logging", desc: "Catat semua aktivitas user di platform", active: true, icon: CheckCircle },
  ];

  const recentAlerts = [
    { type: "warning", message: "5 failed login attempts from IP 45.67.89.12", time: "2 jam lalu" },
    { type: "info", message: "SSL certificate renewed successfully", time: "1 hari lalu" },
    { type: "warning", message: "Unusual login pattern detected for admin@smpn5smg.sch.id", time: "2 hari lalu" },
    { type: "success", message: "Security scan completed — no vulnerabilities found", time: "3 hari lalu" },
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white">Keamanan</h1>
          <p className="text-xs text-gray-500">Konfigurasi keamanan platform</p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* Security Settings */}
        <div>
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Pengaturan Keamanan</h2>
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden divide-y divide-gray-800/50">
            {securitySettings.map((setting) => {
              const Icon = setting.icon;
              return (
                <div key={setting.key} className="px-5 py-4 flex items-center justify-between hover:bg-gray-800/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} weight="fill" className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{setting.label}</p>
                      <p className="text-[10px] text-gray-500">{setting.desc}</p>
                    </div>
                  </div>
                  <Switch size="sm" defaultSelected={setting.active} classNames={{ wrapper: "group-data-[selected=true]:bg-blue-600" }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Security Alerts */}
        <div>
          <h2 className="text-sm font-semibold text-gray-300 mb-3">Security Alerts</h2>
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden divide-y divide-gray-800/50">
            {recentAlerts.map((alert, i) => (
              <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-800/20 transition-colors">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  alert.type === "warning" ? "bg-amber-500/10" : alert.type === "success" ? "bg-emerald-500/10" : "bg-blue-500/10"
                }`}>
                  {alert.type === "warning" ? (
                    <Warning size={14} weight="fill" className="text-amber-400" />
                  ) : (
                    <CheckCircle size={14} weight="fill" className={alert.type === "success" ? "text-emerald-400" : "text-blue-400"} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{alert.message}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
