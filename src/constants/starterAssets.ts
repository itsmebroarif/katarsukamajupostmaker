import { Asset } from '../types';

export const DEFAULT_LOGOS = [
  {
    id: 'logo-kt-red',
    name: 'Logo Karang Taruna (Warna Standar)',
    type: 'logo' as const,
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Logo_Karang_Taruna.png',
  },
];

export const DEFAULT_ASSETS: Asset[] = [
  {
    id: 'asset-logo-standard',
    name: 'Logo Karang Taruna Indonesia',
    type: 'logo',
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Logo_Karang_Taruna.png',
    createdAt: new Date().toISOString(),
  },
];

export const ICON_PACK = [
  { id: 'calendar', name: 'Kalender & Waktu', label: '📅 Kalender' },
  { id: 'location', name: 'Peta & Lokasi', label: '📍 Lokasi' },
  { id: 'people', name: 'Pemuda & Warga', label: '👥 Warga' },
  { id: 'phone', name: 'Telepon & WA', label: '📞 Kontak' },
  { id: 'trophy', name: 'Hadiah & Lomba', label: '🏆 Hadiah' },
  { id: 'megaphone', name: 'Pengumuman', label: '📢 Edaran' },
  { id: 'leaf', name: 'Lingkungan & Hijau', label: '🌱 Kerja Bakti' },
  { id: 'shopping', name: 'UMKM & Bazaar', label: '🛍️ UMKM' },
  { id: 'heart', name: 'Donasi & Social', label: '❤️ Donasi' },
];

export const DAILY_TIPS = [
  "Gunakan maksimal 3–4 slide agar carousel lebih mudah dipahami dan diposting ke Instagram!",
  "Pastikan kontras warna antara teks dan background tinggi agar mudah dibaca di HP.",
  "Sertakan nomor WhatsApp & akun Instagram pada slide CTA untuk mempermudah partisipasi warga.",
  "Upload logo Karang Taruna unit atau RT/RW Anda di menu Asset untuk identitas lokal yang konsisten.",
  "Format Carousel Portrait (4:5) memberikan tampilan penuh layar terbanyak di aplikasi Instagram HP!",
];
