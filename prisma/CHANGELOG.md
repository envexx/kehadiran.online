# Changelog - Prisma Schema Updates

## ✅ Perubahan Terbaru

### 1. **Role Superadmin Ditambahkan**
- **User model**: `tenant_id` sekarang **nullable** (`String?`)
- **Superadmin**: `tenant_id = null`, bisa akses semua tenant
- **Admin/Guru**: `tenant_id` wajib, hanya akses tenant sendiri
- **Default role**: `"admin"` (bukan `"guru"`)

### 2. **Model Baru yang Ditambahkan**

#### **Billing & Subscription**
- ✅ `Subscription` - Data subscription per tenant
- ✅ `Invoice` - Invoice pembayaran

#### **Audit & Activity Log**
- ✅ `AuditLog` - Log semua aktivitas user (create, update, delete, login, dll)
- ✅ Support IP address & user agent tracking

#### **API Keys & Integration**
- ✅ `ApiKey` - API keys untuk integrasi eksternal
- ✅ Support permissions & expiration

#### **Feature Flags & Quotas**
- ✅ `FeatureQuota` - Limit/quota per tenant:
  - Max siswa, guru, kelas
  - SMS/WhatsApp quota
  - API calls quota
  - Storage quota
  - Feature flags (JSON)

#### **Invite & Permission**
- ✅ `Invite` - Invite user baru ke tenant
- ✅ `Permission` - Permission system untuk RBAC

### 3. **Struktur Role**

```
superadmin
  ├── tenant_id: null
  ├── Akses: Semua tenant
  └── Permission: Full access

admin
  ├── tenant_id: required
  ├── Akses: Tenant sendiri
  └── Permission: Manage tenant

guru
  ├── tenant_id: required
  ├── Akses: Tenant sendiri
  └── Permission: Limited access
```

## 🔐 Superadmin Usage

### Query Semua Tenant
```typescript
// Superadmin bisa query semua tenant
const tenants = await prisma.tenant.findMany({
  where: { is_active: true }
});
```

### Query dengan Filter Tenant
```typescript
// Admin/Guru harus filter by tenant_id
const siswa = await prisma.siswa.findMany({
  where: { 
    tenant_id: currentUser.tenant_id // Required untuk non-superadmin
  }
});
```

### Check Role
```typescript
if (user.role === 'superadmin') {
  // Bisa akses semua tenant
} else {
  // Harus filter by tenant_id
}
```

## 📊 Model Summary

### Total Models: **16**

1. Tenant
2. User (dengan superadmin support)
3. Guru
4. Kelas
5. Siswa (dengan data orang tua)
6. Jadwal (7 hari)
7. Presensi
8. Notifikasi
9. Setting
10. **Subscription** (NEW)
11. **Invoice** (NEW)
12. **AuditLog** (NEW)
13. **ApiKey** (NEW)
14. **FeatureQuota** (NEW)
15. **Invite** (NEW)
16. **Permission** (NEW)

## 🎯 Next Steps

1. ✅ Run `npx prisma generate`
2. ✅ Run `npx prisma migrate dev --name add_superadmin_and_billing`
3. ✅ Update seed data untuk include superadmin user
4. ✅ Implement role-based access control (RBAC)
5. ✅ Setup billing & subscription logic
6. ✅ Implement audit logging
7. ✅ Setup API key management



