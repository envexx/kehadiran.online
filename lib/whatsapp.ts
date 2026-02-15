import prisma from "@/lib/prisma";

// ============================================
// FONNTE WHATSAPP API INTEGRATION
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
  url?: string;        // optional media URL
  filename?: string;   // optional filename for media
  countryCode?: string; // default "62" (Indonesia)
}

/**
 * Get WhatsApp config from GlobalSetting
 */
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

/**
 * Get a WA message template from GlobalSetting
 */
export async function getWhatsAppTemplate(templateKey: string): Promise<string | null> {
  const setting = await prisma.globalSetting.findUnique({
    where: { key: templateKey },
  });
  return setting?.value || null;
}

/**
 * Send WhatsApp message via Fonnte API
 * Docs: https://docs.fonnte.com
 */
export async function sendWhatsApp(
  params: SendWhatsAppParams,
  token?: string
): Promise<{ success: boolean; detail?: string; error?: string }> {
  // Get token from config if not provided
  let apiToken = token;
  if (!apiToken) {
    const config = await getWhatsAppConfig();
    if (!config) {
      return { success: false, error: "WhatsApp API belum dikonfigurasi. Hubungi administrator." };
    }
    apiToken = config.token;
  }

  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiToken,
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
      return {
        success: false,
        error: data.reason || data.detail || "Gagal mengirim pesan WhatsApp",
      };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Fonnte API error:", message);
    return { success: false, error: `Fonnte API error: ${message}` };
  }
}

/**
 * Send a templated WhatsApp notification to a parent
 * Replaces template variables: {nama_ortu}, {nama_siswa}, {waktu}, {tanggal}, {kelas}, {sekolah}
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
  const template = await getWhatsAppTemplate(templateKey);
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

  return sendWhatsApp({ target, message });
}
