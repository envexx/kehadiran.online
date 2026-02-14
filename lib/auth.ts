import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "kehadiran-super-secret-key-change-in-production";

export interface AuthPayload {
  sub: string;
  email: string;
  role: string;
  tenantId?: string;
}

export async function getAuthPayload(): Promise<AuthPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    if (!token) return null;

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
      tenantId: payload.tenantId as string | undefined,
    };
  } catch {
    return null;
  }
}

export async function requireTenantAuth(): Promise<{ userId: string; tenantId: string }> {
  const auth = await getAuthPayload();

  if (!auth || !auth.tenantId) {
    throw new Error("UNAUTHORIZED");
  }

  return { userId: auth.sub, tenantId: auth.tenantId };
}

export async function requireSuperAdminAuth(): Promise<{ userId: string }> {
  const auth = await getAuthPayload();

  if (!auth || !auth.sub) {
    throw new Error("UNAUTHORIZED");
  }

  return { userId: auth.sub };
}
