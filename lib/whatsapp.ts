import prisma from "@/lib/prisma";

// ============================================
// FONNTE WHATSAPP API INTEGRATION
// Rate-limited queue: max 1 message per 2 seconds globally
// Typing indicator for natural feel
// ============================================

interface FonnteResponse {
  status: boolean;
  detail?: string;
  reason?: string;
  id?: string;
}

interface SendWhatsAppParams {
  target: string;
  message: string;
  url?: string;
  filename?: string;
  countryCode?: string;
}

// ============================================
// GLOBAL RATE-LIMITED QUEUE
// Ensures only 1 message is sent every 2 seconds
// across all tenants to avoid Fonnte rate limits
// ============================================

interface QueueItem {
  params: SendWhatsAppParams;
  token: string;
  withTyping: boolean;
  resolve: (result: { success: boolean; detail?: string; error?: string }) => void;
}

let messageQueue: QueueItem[] = [];
let isProcessing = false;

function enqueue(item: QueueItem) {
  messageQueue.push(item);
  processQueue();
}

async function processQueue() {
  if (isProcessing || messageQueue.length === 0) return;
  isProcessing = true;

  while (messageQueue.length > 0) {
    const item = messageQueue.shift()!;
    try {
      let result: { success: boolean; detail?: string; error?: string };
      if (item.withTyping) {
        result = await sendWithTypingInternal(item.params, item.token);
      } else {
        result = await sendDirectInternal(item.params, item.token);
      }
      item.resolve(result);
    } catch (e) {
      item.resolve({ success: false, error: String(e) });
    }
    // Wait 2 seconds before processing next message
    await new Promise((r) => setTimeout(r, 2000));
  }

  isProcessing = false;
}

// ============================================
// CONFIG
// ============================================

export async function getWhatsAppConfig(): Promise<{
  provider: string;
  token: string;
  sender: string;
} | null> {
  const settings = await prisma.globalSetting.findMany({
    where: { category: "whatsapp" },
  });

  const provider = settings.find((s) => s.key === "wa_provider")?.value || "fonnte";
  const token = settings.find((s) => s.key === "wa_token")?.value;
  const sender = settings.find((s) => s.key === "wa_sender")?.value || "";

  if (!token) return null;
  return { provider, token, sender };
}

export async function getWhatsAppTemplate(templateKey: string): Promise<string | null> {
  const setting = await prisma.globalSetting.findUnique({
    where: { key: templateKey },
  });
  return setting?.value || null;
}

// ============================================
// DEFAULT TEMPLATES (fallback if not in DB)
// ============================================

const DEFAULT_TEMPLATES: Record<string, string> = {
  wa_tpl_hadir: "Assalamualaikum, {nama_ortu}. {nama_siswa} telah hadir di sekolah pada {waktu}.",
  wa_tpl_terlambat: "Assalamualaikum, {nama_ortu}. {nama_siswa} terlambat hadir di sekolah pada {waktu}.",
  wa_tpl_alpha: "Assalamualaikum, {nama_ortu}. {nama_siswa} tidak hadir di sekolah hari ini tanpa keterangan.",
  wa_tpl_pulang: "Assalamualaikum, {nama_ortu}. {nama_siswa} telah pulang dari sekolah pada {waktu}. Terima kasih.",
};

// ============================================
// TYPING INDICATOR
// ============================================

async function sendTypingIndicator(
  target: string,
  duration: number,
  token: string,
  countryCode: string = "62"
): Promise<void> {
  try {
    const formData = new URLSearchParams();
    formData.append("target", target);
    formData.append("countryCode", countryCode);
    formData.append("duration", String(duration));
    formData.append("stop", "false");

    await fetch("https://api.fonnte.com/typing", {
      method: "POST",
      headers: { Authorization: token },
      body: formData,
    });
  } catch {
    // Typing indicator is best-effort, don't fail the message
  }
}

// ============================================
// INTERNAL SEND FUNCTIONS
// ============================================

async function sendDirectInternal(
  params: SendWhatsAppParams,
  token: string
): Promise<{ success: boolean; detail?: string; error?: string }> {
  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        target: params.target,
        message: params.message,
        countryCode: params.countryCode || "62",
        ...(params.url ? { url: params.url } : {}),
        ...(params.filename ? { filename: params.filename } : {}),
      }),
    });

    const data: FonnteResponse = await response.json();

    if (data.status) {
      return { success: true, detail: data.detail || "Pesan terkirim" };
    } else {
      return { success: false, error: data.reason || data.detail || "Gagal mengirim pesan WhatsApp" };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Fonnte API error:", message);
    return { success: false, error: `Fonnte API error: ${message}` };
  }
}

async function sendWithTypingInternal(
  params: SendWhatsAppParams,
  token: string
): Promise<{ success: boolean; detail?: string; error?: string }> {
  // Calculate typing duration: 1s per 20 chars, min 2s, max 8s
  const typingDuration = Math.min(Math.max(Math.ceil(params.message.length / 20), 2), 8);

  // Start typing indicator
  await sendTypingIndicator(params.target, typingDuration, token, params.countryCode || "62");

  // Wait for typing duration
  await new Promise((r) => setTimeout(r, typingDuration * 1000));

  // Send the actual message
  return sendDirectInternal(params, token);
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Send WhatsApp message (queued, rate-limited, 1 msg per 2s)
 * Use token param for direct calls (e.g. test), otherwise reads from DB config
 */
export async function sendWhatsApp(
  params: SendWhatsAppParams,
  token?: string
): Promise<{ success: boolean; detail?: string; error?: string }> {
  let apiToken = token;
  if (!apiToken) {
    const config = await getWhatsAppConfig();
    if (!config) {
      return { success: false, error: "WhatsApp API belum dikonfigurasi. Hubungi administrator." };
    }
    apiToken = config.token;
  }

  return new Promise((resolve) => {
    enqueue({ params, token: apiToken!, withTyping: false, resolve });
  });
}

/**
 * Send WhatsApp message with typing indicator (queued, rate-limited)
 * Shows typing for a natural duration before sending
 */
export async function sendWhatsAppWithTyping(
  params: SendWhatsAppParams,
  token?: string
): Promise<{ success: boolean; detail?: string; error?: string }> {
  let apiToken = token;
  if (!apiToken) {
    const config = await getWhatsAppConfig();
    if (!config) {
      return { success: false, error: "WhatsApp API belum dikonfigurasi. Hubungi administrator." };
    }
    apiToken = config.token;
  }

  return new Promise((resolve) => {
    enqueue({ params, token: apiToken!, withTyping: true, resolve });
  });
}

/**
 * Send a templated WhatsApp notification to a parent with typing indicator
 * Replaces: {nama_ortu}, {nama_siswa}, {waktu}, {tanggal}, {kelas}, {sekolah}
 */
export async function sendWhatsAppNotification(
  templateKey: string,
  target: string,
  variables: {
    nama_ortu?: string;
    nama_siswa?: string;
    waktu?: string;
    tanggal?: string;
    kelas?: string;
    sekolah?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  // Get template from DB, fallback to default
  let template = await getWhatsAppTemplate(templateKey);
  if (!template) {
    template = DEFAULT_TEMPLATES[templateKey] || null;
  }
  if (!template) {
    return { success: false, error: `Template "${templateKey}" tidak ditemukan` };
  }

  let message = template;
  message = message.replace(/{nama_ortu}/g, variables.nama_ortu || "-");
  message = message.replace(/{nama_siswa}/g, variables.nama_siswa || "-");
  message = message.replace(/{waktu}/g, variables.waktu || "-");
  message = message.replace(/{tanggal}/g, variables.tanggal || "-");
  message = message.replace(/{kelas}/g, variables.kelas || "-");
  message = message.replace(/{sekolah}/g, variables.sekolah || "-");

  return sendWhatsAppWithTyping({ target, message });
}

// ============================================
// PRESENSI NOTIFICATION HELPER
// Determines which template to send based on status
// Skips sakit & izin (no WA needed)
// Sends to parent based on preferensi_notifikasi
// ============================================

interface PresensiNotifData {
  siswaId: string;
  tenantId: string;
  status: "hadir" | "terlambat" | "alpha" | "pulang";
  waktu: string;
}

/**
 * Send attendance WA notification to parent(s)
 * - hadir → wa_tpl_hadir
 * - terlambat → wa_tpl_terlambat
 * - alpha → wa_tpl_alpha
 * - pulang → wa_tpl_pulang
 * - sakit/izin → SKIP (no notification)
 *
 * Fire-and-forget: errors are logged but don't block the caller
 */
export async function sendPresensiNotification(data: PresensiNotifData): Promise<void> {
  try {
    const config = await getWhatsAppConfig();
    if (!config) return; // WA not configured, skip silently

    const templateMap: Record<string, string> = {
      hadir: "wa_tpl_hadir",
      terlambat: "wa_tpl_terlambat",
      alpha: "wa_tpl_alpha",
      pulang: "wa_tpl_pulang",
    };

    const templateKey = templateMap[data.status];
    if (!templateKey) return; // Unknown status, skip

    // Fetch siswa with parent data and tenant info
    const siswa = await prisma.siswa.findFirst({
      where: { id: data.siswaId, tenant_id: data.tenantId },
      include: {
        kelas: { select: { nama_kelas: true } },
        tenant: { select: { nama_sekolah: true } },
      },
    });

    if (!siswa) return;

    // Determine target numbers based on preferensi_notifikasi
    const targets: { number: string; name: string }[] = [];
    const pref = siswa.preferensi_notifikasi || "ayah";

    if ((pref === "ayah" || pref === "keduanya") && siswa.nomor_wa_ayah) {
      targets.push({ number: siswa.nomor_wa_ayah, name: siswa.nama_ayah || "Bapak/Ibu" });
    }
    if ((pref === "ibu" || pref === "keduanya") && siswa.nomor_wa_ibu) {
      targets.push({ number: siswa.nomor_wa_ibu, name: siswa.nama_ibu || "Bapak/Ibu" });
    }

    // Fallback: if preferred parent has no number, try the other
    if (targets.length === 0) {
      if (siswa.nomor_wa_ayah) {
        targets.push({ number: siswa.nomor_wa_ayah, name: siswa.nama_ayah || "Bapak/Ibu" });
      } else if (siswa.nomor_wa_ibu) {
        targets.push({ number: siswa.nomor_wa_ibu, name: siswa.nama_ibu || "Bapak/Ibu" });
      }
    }

    if (targets.length === 0) return; // No parent WA number, skip

    const tanggalStr = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // Queue notifications for each target parent
    for (const t of targets) {
      sendWhatsAppNotification(templateKey, t.number, {
        nama_ortu: t.name,
        nama_siswa: siswa.nama_lengkap,
        waktu: data.waktu,
        tanggal: tanggalStr,
        kelas: siswa.kelas.nama_kelas,
        sekolah: siswa.tenant.nama_sekolah,
      }).catch((e) => console.error("WA notification error:", e));
    }
  } catch (e) {
    console.error("sendPresensiNotification error:", e);
  }
}
