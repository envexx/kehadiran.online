"use client";

import React from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { 
  MagnifyingGlass, 
  Bell
} from "phosphor-react";

interface TopBarProps {
  title?: string;
  subtitle?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  children?: React.ReactNode;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  subtitle, 
  showSearch = false, 
  searchPlaceholder = "Cari...",
  children 
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
        {title && (
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 truncate">{subtitle}</p>}
          </div>
        )}
        {showSearch && (
          <div className="hidden sm:block flex-1 max-w-md">
            <Input
              classNames={{
                inputWrapper: "bg-gray-50 border-0 hover:bg-gray-100 shadow-none h-9 sm:h-10",
                input: "text-sm",
              }}
              placeholder={searchPlaceholder}
              size="sm"
              startContent={<MagnifyingGlass size={18} className="text-gray-400" />}
              type="search"
            />
          </div>
        )}
        {children}
      </div>
      <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4 flex-shrink-0">
        <Button isIconOnly variant="light" size="sm" className="rounded-full relative text-gray-500">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </Button>
        <div className="w-px h-8 bg-gray-200 mx-0.5 sm:mx-1 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
          <Avatar
            src="https://i.pravatar.cc/150?u=admin"
            size="sm"
            className="w-8 h-8"
          />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900 leading-tight">Admin Sekolah</p>
            <p className="text-xs text-gray-400 leading-tight">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};
