"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Switch } from "@heroui/switch";
import { Skeleton } from "@heroui/skeleton";
import { Select, SelectItem } from "@heroui/select";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { 
  Envelope,
  Plus,
  PencilSimple,
  Trash,
  CheckCircle,
  XCircle,
  PaperPlaneTilt,
  ShieldCheck,
  Lightning,
  ArrowClockwise,
  Eye,
  EyeSlash
} from "phosphor-react";
import { Textarea } from "@heroui/input";
import { useAdminSmtpConfigs, useAdminEmailTemplates, mutateAPI } from "@/hooks/use-swr-hooks";

const inputCls = { inputWrapper: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700", input: "text-gray-900 dark:text-gray-200", label: "text-gray-500 dark:text-gray-400" };
const modalCls = { base: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800", header: "border-b border-gray-200 dark:border-gray-800", footer: "border-t border-gray-200 dark:border-gray-800" };
const emptySmtp = { name: "", host: "", port: "587", username: "", password: "", from_email: "", from_name: "", encryption: "tls", is_active: true, is_default: false };

export default function AdminSmtpPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isTestOpen, onOpen: onTestOpen, onOpenChange: onTestOpenChange } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onOpenChange: onDeleteOpenChange } = useDisclosure();
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testSmtpId, setTestSmtpId] = useState("");
  const [testTemplate, setTestTemplate] = useState("registration");
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [form, setForm] = useState<any>({ ...emptySmtp });
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [saving, setSaving] = useState(false);

  const { data, isLoading, mutate } = useAdminSmtpConfigs();
  const smtpConfigs = data?.data || [];

  // Email templates from DB
  const { isOpen: isTplOpen, onOpen: onTplOpen, onOpenChange: onTplOpenChange } = useDisclosure();
  const { data: tplData, isLoading: tplLoading, mutate: mutateTpl } = useAdminEmailTemplates();
  const emailTemplates = tplData?.data || [];
  const [tplForm, setTplForm] = useState<any>({ name: "", subject: "", body_html: "", description: "", is_active: true });
  const [tplEditId, setTplEditId] = useState<string | null>(null);

  const setField = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const openCreate = () => { setEditId(null); setForm({ ...emptySmtp }); setShowPassword(false); onOpen(); };
  const openEdit = (c: any) => { setEditId(c.id); setForm({ name: c.name, host: c.host, port: String(c.port), username: c.username, password: "", from_email: c.from_email, from_name: c.from_name || "", encryption: c.encryption, is_active: c.is_active, is_default: c.is_default }); setShowPassword(false); onOpen(); };
  const openDelete = (c: any) => { setDeleteId(c.id); setDeleteName(c.name); onDeleteOpen(); };
  const handleSave = async (onClose: () => void) => { setSaving(true); try { const p = { ...form, port: parseInt(form.port) || 587 }; if (!p.password) delete p.password; if (editId) await mutateAPI(`/api/admin/smtp/${editId}`, "PUT", p); else await mutateAPI("/api/admin/smtp", "POST", p); await mutate(); onClose(); } catch (e: any) { alert(e.message); } setSaving(false); };
  const handleDelete = async (onClose: () => void) => { setSaving(true); try { await mutateAPI(`/api/admin/smtp/${deleteId}`, "DELETE"); await mutate(); onClose(); } catch (e: any) { alert(e.message); } setSaving(false); };

  const handleTestEmail = async () => {
    if (!testEmail) { alert("Masukkan email tujuan"); return; }
    setTestSending(true); setTestResult(null);
    try {
      const payload: any = { to: testEmail, template: testTemplate };
      if (testSmtpId) payload.smtp_config_id = testSmtpId;
      const res = await fetch("/api/admin/send-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (json.success) { setTestResult({ success: true, message: json.message }); } else { setTestResult({ success: false, message: json.error || "Gagal mengirim email" }); }
    } catch (e: any) { setTestResult({ success: false, message: e.message }); }
    setTestSending(false);
  };

  const openTplEdit = (t: any) => { setTplEditId(t.id); setTplForm({ name: t.name, subject: t.subject, body_html: t.body_html, description: t.description || "", is_active: t.is_active }); onTplOpen(); };
  const handleTplSave = async (onClose: () => void) => { setSaving(true); try { await mutateAPI(`/api/admin/email-templates/${tplEditId}`, "PUT", tplForm); await mutateTpl(); onClose(); } catch (e: any) { alert(e.message); } setSaving(false); };
  const handleTplToggle = async (t: any, val: boolean) => { try { await mutateAPI(`/api/admin/email-templates/${t.id}`, "PUT", { is_active: val }); await mutateTpl(); } catch (e: any) { alert(e.message); } };

  return (
    <div className="min-h-screen">
      {/* Top Bar */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">SMTP & Email</h1>
            <p className="text-xs text-gray-500">Konfigurasi server email dan template notifikasi</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="bordered" className="border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium" startContent={<PaperPlaneTilt size={14} />} onPress={onTestOpen}>
              Test Email
            </Button>
            <Button size="sm" className="bg-blue-600 text-white font-medium" startContent={<Plus size={14} weight="bold" />} onPress={openCreate}>
              Tambah SMTP
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-[1400px] mx-auto">
        {/* SMTP Servers */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Server SMTP</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading ? Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <Skeleton className="h-10 w-40 rounded-lg bg-gray-200 dark:bg-gray-800 mb-4" />
                <Skeleton className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800 mb-2" />
                <Skeleton className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            )) : smtpConfigs.length > 0 ? smtpConfigs.map((config: any) => (
              <div key={config.id} className={`bg-white dark:bg-gray-900 rounded-xl border p-5 transition-colors ${config.is_default ? "border-blue-600/50" : "border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700"}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.is_active ? "bg-blue-500/10" : "bg-gray-100 dark:bg-gray-800"}`}>
                      <Envelope size={20} weight="fill" className={config.is_active ? "text-blue-400" : "text-gray-600"} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{config.name}</h3>
                        {config.is_default && <Chip size="sm" color="primary" variant="flat" className="text-[10px]">Default</Chip>}
                      </div>
                      <p className="text-[10px] text-gray-500">{config.host}:{config.port}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    <Button isIconOnly size="sm" variant="light" className="text-gray-500 hover:text-amber-400" onPress={() => openEdit(config)}><PencilSimple size={14} /></Button>
                    <Button isIconOnly size="sm" variant="light" className="text-gray-500 hover:text-red-400" onPress={() => openDelete(config)}><Trash size={14} /></Button>
                  </div>
                </div>
                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">From</span>
                    <span className="text-gray-700 dark:text-gray-300">{config.from_email}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Encryption</span>
                    <span className="text-gray-700 dark:text-gray-300 uppercase">{config.encryption}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Status</span>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${config.is_active ? "bg-emerald-500" : "bg-gray-600"}`} />
                      <span className={config.is_active ? "text-emerald-400" : "text-gray-500"}>{config.is_active ? "Aktif" : "Nonaktif"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center text-gray-400 dark:text-gray-600 text-sm">Belum ada konfigurasi SMTP</div>
            )}
          </div>
        </div>

        {/* Email Templates */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Template Email</h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800/50">
            {tplLoading ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="px-5 py-4 flex items-center gap-4">
                <Skeleton className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800" />
                <div className="flex-1 space-y-1.5"><Skeleton className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-800" /><Skeleton className="h-3 w-48 rounded bg-gray-200 dark:bg-gray-800" /></div>
              </div>
            )) : emailTemplates.length > 0 ? emailTemplates.map((tpl: any) => (
              <div key={tpl.id} className="px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tpl.is_active ? "bg-blue-500/10" : "bg-gray-100 dark:bg-gray-800"}`}>
                    <Envelope size={16} weight="fill" className={tpl.is_active ? "text-blue-400" : "text-gray-600"} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{tpl.name}</p>
                    <p className="text-[10px] text-gray-500">{tpl.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch size="sm" isSelected={tpl.is_active} onValueChange={(val) => handleTplToggle(tpl, val)} classNames={{ wrapper: "group-data-[selected=true]:bg-blue-600" }} />
                  <Button size="sm" variant="light" className="text-gray-500 hover:text-blue-400 text-xs" onPress={() => openTplEdit(tpl)}>
                    Edit Template
                  </Button>
                </div>
              </div>
            )) : (
              <div className="px-5 py-8 text-center text-gray-400 dark:text-gray-600 text-sm">Belum ada template email</div>
            )}
          </div>
        </div>

        {/* SMTP Settings Info */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck size={18} weight="fill" className="text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Keamanan SMTP</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Password SMTP disimpan terenkripsi menggunakan AES-256. Pastikan menggunakan App Password atau API Key, 
                bukan password akun utama. Untuk Gmail, aktifkan 2FA dan buat App Password di 
                <span className="text-blue-400"> myaccount.google.com/apppasswords</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit SMTP Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl" classNames={modalCls}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader><div><h3 className="text-lg font-bold text-gray-900 dark:text-white">{editId ? "Edit SMTP" : "Tambah Server SMTP"}</h3><p className="text-xs text-gray-500 font-normal">{editId ? "Perbarui konfigurasi" : "Konfigurasi server email baru"}</p></div></ModalHeader>
              <ModalBody className="gap-4">
                <Input label="Nama Konfigurasi" placeholder="e.g. Primary SMTP" size="sm" value={form.name} onValueChange={(v) => setField("name", v)} classNames={inputCls} />
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2"><Input label="SMTP Host" placeholder="smtp.gmail.com" size="sm" value={form.host} onValueChange={(v) => setField("host", v)} classNames={inputCls} /></div>
                  <Input label="Port" placeholder="587" size="sm" type="number" value={form.port} onValueChange={(v) => setField("port", v)} classNames={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Username" placeholder="user@..." size="sm" value={form.username} onValueChange={(v) => setField("username", v)} classNames={inputCls} />
                  <Input label={editId ? "Password (kosongkan jika tidak diubah)" : "Password"} placeholder="••••••••" size="sm" type={showPassword ? "text" : "password"} value={form.password} onValueChange={(v) => setField("password", v)} endContent={<button onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-gray-300">{showPassword ? <EyeSlash size={16} /> : <Eye size={16} />}</button>} classNames={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="From Email" placeholder="noreply@..." size="sm" value={form.from_email} onValueChange={(v) => setField("from_email", v)} classNames={inputCls} />
                  <Input label="From Name" placeholder="Kehadiran" size="sm" value={form.from_name} onValueChange={(v) => setField("from_name", v)} classNames={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Select label="Encryption" size="sm" selectedKeys={[form.encryption]} onChange={(e) => setField("encryption", e.target.value)} classNames={{ trigger: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700", value: "text-gray-900 dark:text-gray-200", label: "text-gray-500 dark:text-gray-400" }}>
                    <SelectItem key="tls">TLS</SelectItem>
                    <SelectItem key="ssl">SSL</SelectItem>
                    <SelectItem key="none">None</SelectItem>
                  </Select>
                  <div className="flex items-end pb-1 gap-4">
                    <Switch size="sm" isSelected={form.is_active} onValueChange={(v) => setField("is_active", v)} classNames={{ wrapper: "group-data-[selected=true]:bg-blue-600" }}><span className="text-xs text-gray-400">Aktif</span></Switch>
                    <Switch size="sm" isSelected={form.is_default} onValueChange={(v) => setField("is_default", v)} classNames={{ wrapper: "group-data-[selected=true]:bg-blue-600" }}><span className="text-xs text-gray-400">Default</span></Switch>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="text-gray-400">Batal</Button>
                <Button className="bg-blue-600 text-white font-medium" isLoading={saving} onPress={() => handleSave(onClose)}>{editId ? "Simpan" : "Tambah SMTP"}</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete SMTP Confirmation */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange} size="sm" classNames={modalCls}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader><h3 className="text-lg font-bold text-gray-900 dark:text-white">Hapus SMTP</h3></ModalHeader>
              <ModalBody><p className="text-sm text-gray-600 dark:text-gray-300">Yakin ingin menghapus <strong className="text-gray-900 dark:text-white">{deleteName}</strong>?</p></ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="text-gray-400">Batal</Button>
                <Button color="danger" isLoading={saving} onPress={() => handleDelete(onClose)}>Hapus</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Test Email Modal */}
      <Modal isOpen={isTestOpen} onOpenChange={(open) => { onTestOpenChange(); if (!open) setTestResult(null); }} size="md" classNames={modalCls}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader><div><h3 className="text-lg font-bold text-gray-900 dark:text-white">Kirim Test Email</h3><p className="text-xs text-gray-500 font-normal">Verifikasi konfigurasi SMTP berfungsi dengan benar</p></div></ModalHeader>
              <ModalBody className="gap-4">
                <Input label="Email Tujuan" placeholder="test@example.com" size="sm" value={testEmail} onValueChange={setTestEmail} classNames={inputCls} />
                <Select label="SMTP Server" size="sm" placeholder="Default (otomatis)" selectedKeys={testSmtpId ? [testSmtpId] : []} onChange={(e) => setTestSmtpId(e.target.value)} classNames={{ trigger: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700", value: "text-gray-900 dark:text-gray-200", label: "text-gray-500 dark:text-gray-400" }}>
                  {smtpConfigs.map((c: any) => (<SelectItem key={c.id}>{c.name}{c.is_default ? " (Default)" : ""}</SelectItem>))}
                </Select>
                <Select label="Template" size="sm" selectedKeys={[testTemplate]} onChange={(e) => setTestTemplate(e.target.value)} classNames={{ trigger: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700", value: "text-gray-900 dark:text-gray-200", label: "text-gray-500 dark:text-gray-400" }}>
                  {emailTemplates.length > 0 ? emailTemplates.map((t: any) => (
                    <SelectItem key={t.key}>{t.name}</SelectItem>
                  )) : [
                    <SelectItem key="registration">Registrasi Akun</SelectItem>,
                    <SelectItem key="reset_password">Reset Password</SelectItem>,
                    <SelectItem key="payment_success">Pembayaran Berhasil</SelectItem>,
                    <SelectItem key="invoice">Invoice</SelectItem>,
                  ]}
                </Select>
                {testResult && (
                  <div className={`rounded-lg p-3 text-xs ${testResult.success ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"}`}>
                    {testResult.success ? <CheckCircle size={14} weight="fill" className="inline mr-1.5" /> : <XCircle size={14} weight="fill" className="inline mr-1.5" />}
                    {testResult.message}
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="text-gray-400">Batal</Button>
                <Button className="bg-blue-600 text-white font-medium" startContent={<PaperPlaneTilt size={14} />} isLoading={testSending} onPress={handleTestEmail}>Kirim Test</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Email Template Modal */}
      <Modal isOpen={isTplOpen} onOpenChange={onTplOpenChange} size="2xl" classNames={modalCls} scrollBehavior="inside">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader><div><h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Template Email</h3><p className="text-xs text-gray-500 font-normal">Ubah subject, konten HTML, dan pengaturan template</p></div></ModalHeader>
              <ModalBody className="gap-4">
                <Input label="Nama Template" size="sm" value={tplForm.name} onValueChange={(v) => setTplForm((f: any) => ({ ...f, name: v }))} classNames={inputCls} />
                <Input label="Deskripsi" size="sm" value={tplForm.description} onValueChange={(v) => setTplForm((f: any) => ({ ...f, description: v }))} classNames={inputCls} />
                <Input label="Subject Email" size="sm" value={tplForm.subject} onValueChange={(v) => setTplForm((f: any) => ({ ...f, subject: v }))} classNames={inputCls} />
                <Textarea label="Body HTML" size="sm" minRows={10} maxRows={20} value={tplForm.body_html} onValueChange={(v) => setTplForm((f: any) => ({ ...f, body_html: v }))} classNames={{ inputWrapper: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700", input: "text-gray-900 dark:text-gray-200 font-mono text-xs", label: "text-gray-500 dark:text-gray-400" }} />
                <div className="flex items-center gap-3">
                  <Switch size="sm" isSelected={tplForm.is_active} onValueChange={(v) => setTplForm((f: any) => ({ ...f, is_active: v }))} classNames={{ wrapper: "group-data-[selected=true]:bg-blue-600" }}><span className="text-xs text-gray-500 dark:text-gray-400">Aktif</span></Switch>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} className="text-gray-400">Batal</Button>
                <Button className="bg-blue-600 text-white font-medium" isLoading={saving} onPress={() => handleTplSave(onClose)}>Simpan Template</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
