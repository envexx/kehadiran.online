"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";
import { 
  House, 
  ClipboardText, 
  Users, 
  Calendar, 
  ChartLine,
  Gear,
  SignOut,
  X,
  IdentificationCard,
  ChalkboardTeacher,
  Student,
  CreditCard,
  Bell
} from "phosphor-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();

  const mainMenuItems = [
    { key: "dashboard", label: "Dashboard", icon: House, href: "/dashboard" },
    { key: "presensi", label: "Presensi", icon: ClipboardText, href: "/presensi" },
    { key: "siswa", label: "Data Siswa", icon: Student, href: "/siswa" },
    { key: "guru", label: "Data Guru", icon: ChalkboardTeacher, href: "/guru" },
    { key: "kelas", label: "Kelas", icon: Users, href: "/kelas" },
    { key: "jadwal", label: "Jadwal", icon: Calendar, href: "/jadwal" },
  ];

  const toolsMenuItems = [
    { key: "kartu-presensi", label: "Kartu QR", icon: IdentificationCard, href: "/kartu-presensi" },
    { key: "laporan", label: "Laporan", icon: ChartLine, href: "/laporan" },
    { key: "notifikasi", label: "Notifikasi WA", icon: Bell, href: "/notifikasi" },
    { key: "billing", label: "Billing", icon: CreditCard, href: "/billing" },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const MenuItem = ({ item }: { item: typeof mainMenuItems[0] }) => {
    const Icon = item.icon;
    const active = isActive(item.href);

    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline
          ${active 
            ? "bg-blue-600 text-white shadow-md shadow-blue-600/25" 
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
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
          fixed lg:sticky top-0 left-0 h-screen w-[240px] min-w-[240px] bg-white border-r border-gray-100 z-50
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="px-4 h-16 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 relative flex-shrink-0">
              <Image src="/kehadiran.png" alt="Kehadiran" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <h1 className="text-[15px] font-bold text-gray-900 leading-tight">Kehadiran</h1>
              <p className="text-[10px] text-gray-400 leading-tight">Presensi Digital</p>
            </div>
          </div>
          
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="lg:hidden text-gray-400"
            onPress={onClose}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 pt-4 overflow-y-auto">
          {/* Main Menu */}
          <div className="mb-5">
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider mb-2 px-3">Menu Utama</p>
            <div className="space-y-0.5">
              {mainMenuItems.map((item) => (
                <MenuItem key={item.key} item={item} />
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="mb-5">
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider mb-2 px-3">Tools</p>
            <div className="space-y-0.5">
              {toolsMenuItems.map((item) => (
                <MenuItem key={item.key} item={item} />
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="px-3 pb-4 pt-2 border-t border-gray-50 space-y-0.5">
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline
              ${isActive("/settings") 
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/25" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
          >
            <Gear size={20} weight={isActive("/settings") ? "fill" : "regular"} className="flex-shrink-0" />
            <span className="font-medium text-[13px] leading-none">Pengaturan</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 no-underline text-red-400 hover:bg-red-50 hover:text-red-600"
          >
            <SignOut size={20} className="flex-shrink-0" />
            <span className="font-medium text-[13px] leading-none">Keluar</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

