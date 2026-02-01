"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { 
  House, 
  ClipboardText, 
  Users, 
  Calendar, 
  ChartLine,
  Gear,
  SignOut,
  Fingerprint,
  List,
  X,
  IdentificationCard
} from "phosphor-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: House,
      href: "/dashboard",
      section: "OVERVIEW"
    },
    {
      key: "presensi",
      label: "Presensi",
      icon: ClipboardText,
      href: "/presensi",
      section: "OVERVIEW"
    },
    {
      key: "siswa",
      label: "Data Siswa",
      icon: Users,
      href: "/siswa",
      section: "OVERVIEW"
    },
    {
      key: "jadwal",
      label: "Jadwal",
      icon: Calendar,
      href: "/jadwal",
      section: "OVERVIEW"
    },
    {
      key: "kartu-presensi",
      label: "Kartu Presensi",
      icon: IdentificationCard,
      href: "/kartu-presensi",
      section: "OVERVIEW"
    },
    {
      key: "laporan",
      label: "Laporan",
      icon: ChartLine,
      href: "/laporan",
      section: "OVERVIEW"
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          role="button"
          tabIndex={0}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
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
          fixed lg:sticky top-0 left-0 h-screen bg-background border-r border-divider/50 z-50
          flex flex-col transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'lg:justify-center lg:w-full' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
              <Fingerprint size={24} weight="fill" className="text-white" />
            </div>
            {!isCollapsed && (
              <h1 className="text-xl font-bold">Kehadiran</h1>
            )}
          </div>
          
          {/* Mobile Close Button */}
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="lg:hidden"
            onPress={onClose}
          >
            <X size={24} />
          </Button>

          {/* Desktop Collapse Button */}
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className="hidden lg:flex"
            onPress={() => setIsCollapsed(!isCollapsed)}
          >
            <List size={20} />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 overflow-y-auto">
          <div className="mb-6">
            {!isCollapsed && (
              <p className="text-xs font-semibold text-default-400 mb-3 px-3">MENU UTAMA</p>
            )}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full group
                      ${active 
                        ? "bg-primary text-white" 
                        : "text-default-600 hover:bg-default-100 hover:text-default-900"
                      }
                      ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}
                    `}
                  >
                    <Icon size={20} weight={active ? "fill" : "regular"} />
                    {!isCollapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                    {isCollapsed && (
                      <span className="absolute left-full ml-2 px-2 py-1 bg-default-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden lg:block">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Settings Section */}
          <div>
            {!isCollapsed && (
              <p className="text-xs font-semibold text-default-400 mb-3 px-3">SETTINGS</p>
            )}
            <div className="space-y-1">
              <Link
                href="/settings"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full group
                  text-default-600 hover:bg-default-100 hover:text-default-900
                  ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}
                `}
              >
                <Gear size={20} />
                {!isCollapsed && (
                  <span className="font-medium text-sm">Setting</span>
                )}
                {isCollapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-default-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden lg:block">
                    Setting
                  </span>
                )}
              </Link>
              <Button
                variant="light"
                className={`w-full justify-start text-danger-500 hover:bg-danger-50 px-3 py-2.5 h-auto group
                  ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}
                `}
              >
                <SignOut size={20} />
                {!isCollapsed && (
                  <span className="font-medium text-sm">Logout</span>
                )}
                {isCollapsed && (
                  <span className="absolute left-full ml-2 px-2 py-1 bg-default-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden lg:block">
                    Logout
                  </span>
                )}
              </Button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
};

