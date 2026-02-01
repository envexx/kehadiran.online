# 🎨 SN Pro Font Guide

Font **SN Pro** dari Google Fonts telah diintegrasikan ke dalam aplikasi Kehadiran.

## 📦 Instalasi

Font SN Pro sudah terintegrasi melalui Google Fonts API di `styles/globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=SN+Pro:ital,wght@0,200..900;1,200..900&display=swap');
```

## 🎯 Penggunaan

### 1. Default (Otomatis)
Font SN Pro sudah diterapkan ke seluruh aplikasi secara default melalui `body` tag.

### 2. Tailwind CSS Classes
Gunakan utility classes Tailwind yang sudah disesuaikan dengan SN Pro:

```jsx
<h1 className="font-thin">Thin (200)</h1>
<h2 className="font-light">Light (300)</h2>
<p className="font-normal">Regular (400)</p>
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">Semibold (600)</p>
<h3 className="font-bold">Bold (700)</h3>
<h2 className="font-extrabold">Extrabold (800)</h2>
<h1 className="font-black">Black (900)</h1>
```

### 3. Custom CSS Classes
Gunakan class khusus untuk kontrol lebih detail:

```jsx
<div className="sn-pro-thin">Ultra Light Text (200)</div>
<div className="sn-pro-light">Light Text (300)</div>
<div className="sn-pro-regular">Regular Text (400)</div>
<div className="sn-pro-medium">Medium Text (500)</div>
<div className="sn-pro-semibold">Semibold Text (600)</div>
<div className="sn-pro-bold">Bold Text (700)</div>
<div className="sn-pro-extrabold">Extra Bold Text (800)</div>
<div className="sn-pro-black">Black Text (900)</div>
```

### 4. Inline Styles
```jsx
<p style={{ fontFamily: '"SN Pro", sans-serif', fontWeight: 600 }}>
  Custom Weight
</p>
```

## ✨ Fitur Font

- **Variable Font**: Mendukung weight dari 200 hingga 900
- **Optical Sizing**: Otomatis menyesuaikan dengan ukuran teks
- **Performance**: Menggunakan `display=swap` untuk loading optimal
- **Italic Support**: Mendukung style italic untuk semua weight

## 🎨 Rekomendasi Penggunaan

| Elemen | Weight | Class |
|--------|--------|-------|
| Heading 1 | 700-900 | `font-bold` / `font-black` |
| Heading 2-3 | 600-700 | `font-semibold` / `font-bold` |
| Subheading | 500-600 | `font-medium` / `font-semibold` |
| Body Text | 400 | `font-normal` (default) |
| Small Text | 300-400 | `font-light` / `font-normal` |
| Thin Display | 200 | `font-thin` |

## 📝 Contoh Implementasi

```jsx
export default function Example() {
  return (
    <div>
      <h1 className="text-4xl font-black">
        Welcome to Kehadiran
      </h1>
      
      <h2 className="text-2xl font-bold">
        Digital Presence System
      </h2>
      
      <p className="text-base font-normal">
        Modern attendance tracking system for schools.
      </p>
      
      <span className="text-sm font-light text-gray-500">
        © 2025 Kehadiran
      </span>
    </div>
  );
}
```

## 🔧 Troubleshooting

Jika font tidak muncul:
1. Clear browser cache
2. Pastikan koneksi internet stabil (Google Fonts CDN)
3. Restart development server: `npm run dev`
4. Check browser console untuk error loading font


