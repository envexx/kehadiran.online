"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";
import { useTheme } from "next-themes";
import { 
  House, 
  Buildings, 
  Users, 
  Envelope,
  CreditCard,
  ChartLine,
  Gear,
  SignOut,
  X,
  Shield,
  ListChecks,
  Bell,
  Sun,
  Moon,
  Tag,
  WhatsappLogo
} from "phosphor-react";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const mainMenuItems = [
    { key: "overview", label: "Overview", icon: House, href: "/admin" },
    { key: "tenants", label: "Kelola Sekolah", icon: Buildings, href: "/admin/tenants" },
    { key: "users", label: "Semua Users", icon: Users, href: "/admin/users" },
    { key: "subscriptions", label: "Subscriptions", icon: CreditCard, href: "/admin/subscriptions" },
    { key: "invoices", label: "Invoices", icon: ListChecks, href: "/admin/invoices" },
    { key: "pricing", label: "Daftar Harga", icon: Tag, href: "/admin/pricing" },
  ];

  const systemMenuItems = [
    { key: "smtp", label: "SMTP & Email", icon: Envelope, href: "/admin/smtp" },
    { key: "email-logs", label: "Email Logs", icon: Bell, href: "/admin/email-logs" },
    { key: "audit", label: "Audit Log", icon: ChartLine, href: "/admin/audit" },
    { key: "whatsapp", label: "WhatsApp", icon: WhatsappLogo, href: "/admin/whatsapp" },
    { key: "security", label: "Keamanan", icon: Shield, href: "/admin/security" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const MenuItem = ({ item }: { item: typeof mainMenuItems[0] }) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline
          ${active 
            ? "bg-blue-600 text-white shadow-md shadow-blue-600/25" 
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
          }
        `}
      >
        <Icon size={20} weight={active ? "fill" : "regular"} className="flex-shrink-0" />
        <span className="font-medium text-[13px] leading-none">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          role="button"
          tabIndex={0}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClose?.();
            }
          }}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-[240px] min-w-[240px] bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="px-4 h-16 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 relative flex-shrink-0">
              <Image src="/kehadiran.png" alt="Kehadiran" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">Super Admin</h1>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">Kehadiran Platform</p>
            </div>
          </div>
          
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="lg:hidden text-gray-400 dark:text-gray-500"
            onPress={onClose}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 pt-4 overflow-y-auto">
          {/* Main Menu */}
          <div className="mb-5">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 px-3">Management</p>
            <div className="space-y-0.5">
              {mainMenuItems.map((item) => (
                <MenuItem key={item.key} item={item} />
              ))}
            </div>
          </div>

          {/* System */}
          <div className="mb-5">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2 px-3">System</p>
            <div className="space-y-0.5">
              {systemMenuItems.map((item) => (
                <MenuItem key={item.key} item={item} />
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="px-3 pb-4 pt-2 border-t border-gray-200 dark:border-gray-800 space-y-1">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
          >
            {mounted && theme === "dark" ? <Sun size={20} className="flex-shrink-0" /> : <Moon size={20} className="flex-shrink-0" />}
            <span className="font-medium text-[13px] leading-none">{mounted ? (theme === "dark" ? "Light Mode" : "Dark Mode") : "Theme"}</span>
          </button>
          <Link
            href="/admin/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline
              ${isActive("/admin/settings") 
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/25" 
                : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
              }
            `}
          >
            <Gear size={20} weight={isActive("/admin/settings") ? "fill" : "regular"} className="flex-shrink-0" />
            <span className="font-medium text-[13px] leading-none">Pengaturan</span>
          </Link>
          <button
            onClick={async () => {
              await fetch("/api/auth/admin-logout", { method: "POST" });
              window.location.href = "/login/admin";
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
          >
            <SignOut size={20} className="flex-shrink-0" />
            <span className="font-medium text-[13px] leading-none">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
