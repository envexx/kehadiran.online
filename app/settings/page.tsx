"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Avatar } from "@heroui/avatar";
import { Switch } from "@heroui/switch";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import { 
  Bell,
  User,
  Lock,
  Palette,
  BellRinging,
  Shield,
  Database
} from "phosphor-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Top Bar */}
      <div className="bg-white border-b border-divider/50 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pengaturan</h1>
          <p className="text-sm text-default-500">Kelola preferensi dan konfigurasi sistem</p>
        </div>
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="light" className="rounded-full relative">
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full"></span>
          </Button>
          <div className="flex items-center gap-3 pl-4 border-l">
            <Avatar
              src="https://i.pravatar.cc/150?u=admin"
              size="md"
            />
            <div>
              <p className="text-sm font-semibold">Admin Sekolah</p>
              <p className="text-xs text-default-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <Card className="border border-divider/50 shadow-sm">
          <CardBody>
            <Tabs aria-label="Settings" color="primary" size="lg">
              {/* Profile Tab */}
              <Tab 
                key="profile" 
                title={
                  <div className="flex items-center gap-2">
                    <User size={20} />
                    <span>Profil</span>
                  </div>
                }
              >
                <div className="py-6 space-y-6 max-w-3xl">
                  <div className="flex items-center gap-6">
                    <Avatar
                      src="https://i.pravatar.cc/150?u=admin"
                      className="w-24 h-24"
                    />
                    <div>
                      <Button size="sm" color="primary">
                        Ubah Foto
                      </Button>
                      <p className="text-xs text-default-400 mt-2">
                        JPG, PNG max 2MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Nama Lengkap"
                      placeholder="Masukkan nama lengkap"
                      defaultValue="Admin Sekolah"
                      size="lg"
                    />
                    <Input
                      label="Username"
                      placeholder="Masukkan username"
                      defaultValue="admin"
                      size="lg"
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="email@example.com"
                      defaultValue="admin@sekolah.com"
                      size="lg"
                    />
                    <Input
                      label="Nomor Telepon"
                      placeholder="08xxxxxxxxxx"
                      defaultValue="081234567890"
                      size="lg"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="bordered">
                      Batal
                    </Button>
                    <Button color="primary">
                      Simpan Perubahan
                    </Button>
                  </div>
                </div>
              </Tab>

              {/* Security Tab */}
              <Tab 
                key="security" 
                title={
                  <div className="flex items-center gap-2">
                    <Lock size={20} />
                    <span>Keamanan</span>
                  </div>
                }
              >
                <div className="py-6 space-y-6 max-w-3xl">
                  <Card className="border border-divider/50">
                    <CardHeader>
                      <h3 className="font-bold">Ubah Password</h3>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <Input
                        label="Password Lama"
                        type="password"
                        placeholder="Masukkan password lama"
                        size="lg"
                      />
                      <Input
                        label="Password Baru"
                        type="password"
                        placeholder="Masukkan password baru"
                        size="lg"
                      />
                      <Input
                        label="Konfirmasi Password Baru"
                        type="password"
                        placeholder="Konfirmasi password baru"
                        size="lg"
                      />
                      <Button color="primary" className="w-full">
                        Update Password
                      </Button>
                    </CardBody>
                  </Card>

                  <Card className="border border-divider/50">
                    <CardHeader>
                      <h3 className="font-bold">Two-Factor Authentication</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Aktifkan 2FA</p>
                          <p className="text-sm text-default-400">
                            Tambahkan lapisan keamanan ekstra ke akun Anda
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              {/* Appearance Tab */}
              <Tab 
                key="appearance" 
                title={
                  <div className="flex items-center gap-2">
                    <Palette size={20} />
                    <span>Tampilan</span>
                  </div>
                }
              >
                <div className="py-6 space-y-6 max-w-3xl">
                  <Card className="border border-divider/50">
                    <CardHeader>
                      <h3 className="font-bold">Tema</h3>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <Select 
                        label="Mode Tema"
                        placeholder="Pilih tema"
                        defaultSelectedKeys={["light"]}
                        size="lg"
                      >
                        <SelectItem key="light">Light Mode</SelectItem>
                        <SelectItem key="dark">Dark Mode</SelectItem>
                        <SelectItem key="auto">Otomatis (Sistem)</SelectItem>
                      </Select>

                      <Select 
                        label="Warna Aksen"
                        placeholder="Pilih warna"
                        defaultSelectedKeys={["blue"]}
                        size="lg"
                      >
                        <SelectItem key="blue">Biru</SelectItem>
                        <SelectItem key="purple">Ungu</SelectItem>
                        <SelectItem key="green">Hijau</SelectItem>
                        <SelectItem key="red">Merah</SelectItem>
                      </Select>
                    </CardBody>
                  </Card>

                  <Card className="border border-divider/50">
                    <CardHeader>
                      <h3 className="font-bold">Bahasa</h3>
                    </CardHeader>
                    <CardBody>
                      <Select 
                        label="Bahasa Interface"
                        placeholder="Pilih bahasa"
                        defaultSelectedKeys={["id"]}
                        size="lg"
                      >
                        <SelectItem key="id">Bahasa Indonesia</SelectItem>
                        <SelectItem key="en">English</SelectItem>
                      </Select>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              {/* Notifications Tab */}
              <Tab 
                key="notifications" 
                title={
                  <div className="flex items-center gap-2">
                    <BellRinging size={20} />
                    <span>Notifikasi</span>
                  </div>
                }
              >
                <div className="py-6 space-y-4 max-w-3xl">
                  <Card className="border border-divider/50">
                    <CardHeader>
                      <h3 className="font-bold">Preferensi Notifikasi</h3>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-divider">
                        <div>
                          <p className="font-medium">Notifikasi Presensi</p>
                          <p className="text-sm text-default-400">
                            Terima notifikasi saat ada presensi baru
                          </p>
                        </div>
                        <Switch defaultSelected />
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-divider">
                        <div>
                          <p className="font-medium">Email Harian</p>
                          <p className="text-sm text-default-400">
                            Terima laporan harian via email
                          </p>
                        </div>
                        <Switch defaultSelected />
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-divider">
                        <div>
                          <p className="font-medium">Notifikasi Siswa Alpha</p>
                          <p className="text-sm text-default-400">
                            Peringatan saat ada siswa yang alpha
                          </p>
                        </div>
                        <Switch defaultSelected />
                      </div>

                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium">Laporan Mingguan</p>
                          <p className="text-sm text-default-400">
                            Terima ringkasan mingguan
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </Tab>

              {/* System Tab */}
              <Tab 
                key="system" 
                title={
                  <div className="flex items-center gap-2">
                    <Database size={20} />
                    <span>Sistem</span>
                  </div>
                }
              >
                <div className="py-6 space-y-6 max-w-3xl">
                  <Card className="border border-divider/50">
                    <CardHeader>
                      <h3 className="font-bold">Informasi Sistem</h3>
                    </CardHeader>
                    <CardBody className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-divider">
                        <span className="text-default-500">Versi Aplikasi</span>
                        <span className="font-medium">v1.0.0</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-divider">
                        <span className="text-default-500">Database</span>
                        <span className="font-medium">PostgreSQL 15</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-divider">
                        <span className="text-default-500">Storage</span>
                        <span className="font-medium">2.5 GB / 10 GB</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-default-500">Last Backup</span>
                        <span className="font-medium">2 jam yang lalu</span>
                      </div>
                    </CardBody>
                  </Card>

                  <Card className="border border-divider/50">
                    <CardHeader>
                      <h3 className="font-bold">Maintenance</h3>
                    </CardHeader>
                    <CardBody className="space-y-3">
                      <Button variant="bordered" className="w-full">
                        <Database size={20} />
                        Backup Database
                      </Button>
                      <Button variant="bordered" className="w-full">
                        <Shield size={20} />
                        Export Data
                      </Button>
                      <Button color="danger" variant="bordered" className="w-full">
                        Clear Cache
                      </Button>
                    </CardBody>
                  </Card>
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}



