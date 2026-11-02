# QA_REPORT — Laporan Verifikasi Kualitas & Visual Sinematik

**Tanggal Pengujian:** 2026-11-02
**Lingkungan:** Node.js v24.21.0, Chromium Headless (Playwright 1.64.1), esbuild 0.25.x
**Target URL:** `http://localhost:4173`
**Hasil Akhir:** 100% LULUS (0 Kesalahan Runtime / 0 Console Error)

---

## 1. Verifikasi Responsif & Bebas Overflow Horizontal

Setiap viewport diuji untuk memastikan tidak ada konten yang memicu overflow horizontal (`document.documentElement.scrollWidth <= window.innerWidth`):

| Viewport | Resolusi Target | Status Overflow | Screenshot Hasil |
|---|---|---|---|
| **Desktop Ultra/Wide** | 1440 × 900 px | **LULUS (Tidak ada overflow)** | `qa_screenshots/hero-desktop-1440.png`<br>`qa_screenshots/fullpage-desktop-1440.png` |
| **Tablet Portrait** | 768 × 1024 px | **LULUS (Tidak ada overflow)** | `qa_screenshots/hero-tablet-768.png`<br>`qa_screenshots/fullpage-tablet-768.png` |
| **Mobile Standar** | 390 × 844 px | **LULUS (Tidak ada overflow)** | `qa_screenshots/hero-mobile-390.png`<br>`qa_screenshots/fullpage-mobile-390.png` |
| **Small Mobile** | 320 × 568 px | **LULUS (Tidak ada overflow)** | `qa_screenshots/hero-small-mobile-320.png`<br>`qa_screenshots/fullpage-small-mobile-320.png` |

---

## 2. Pengujian Fungsional & Interaksi (11 Fitur)

| No | Modul / Interaksi | Tindakan Pengujian | Hasil Pengujian | Catatan |
|---|---|---|---|---|
| 1 | **Motion Toggle** | Klik tombol `MOTION ON/OFF` di header | **LULUS** | Atribut `data-motion` berganti antara `"on"` dan `"off"`. Tersimpan di `localStorage` |
| 2 | **Reading Progress Bar** | Scroll halaman dari atas ke tengah | **LULUS** | Transform scaleX bar progres atas bergerak responsif sesuai kedalaman scroll |
| 3 | **Filter Kategori Portfolio** | Klik tab kategori `VFX`, `Film`, `Semua` | **LULUS** | Grid menyaring item secara dinamis; garis bawah animasi (`layoutId`) berpindah mulus |
| 4 | **Pencarian Karya (Search)** | Input teks query `"cyberpunk"` | **LULUS** | Hasil terfilter instan ke karya yang sesuai; reset search mengembalikan seluruh item |
| 5 | **Load More Proyek** | Klik tombol `MUAT LEBIH BANYAK` | **LULUS** | Jumlah kartu proyek bertambah dari 9 menjadi 18 kartu |
| 6 | **Dialog Modal Karya** | Klik kartu karya video / render | **LULUS** | Modal terbuka (`.dialog-window`), iframe embed termuat, tekan `Escape` menutup modal dan fokus kembali |
| 7 | **Breakdown Before/After Slider** | Geser range slider perbandingan | **LULUS** | Nilai `--cut` berubah presisi (contoh: `--cut: 30%`), membelah tampilan solid view vs final render |
| 8 | **Accordion Pengalaman Kerja** | Klik salah satu baris karir | **LULUS** | Item aktif mengembang secara animatif menampilkan deskripsi, ikon berubah dari `+` ke `-` |
| 9 | **Penghargaan Expand/Collapse** | Klik tombol `Lihat penghargaan lainnya` | **LULUS** | Daftar penghargaan mengembang penuh dan merapat kembali saat diklik |
| 10 | **Modal Sertifikat & Bukti** | Klik `LIHAT SERTIFIKAT` pada awards | **LULUS** | Dialog modal membuka preview sertifikat resolusi tinggi (`cert-demo-1.svg`) |
| 11 | **Navigasi Mobile (Drawer Menu)** | Buka di viewport 390px, klik hamburger menu | **LULUS** | Drawer navigasi mobile terbuka halus, link navigasi dan toggle motion mobile dapat diakses |

---

## 3. Audit Error Konsol Peramban

- **Total Console Error:** 0
- **Total Unhandled Promise Rejection:** 0
- **Total Broken Assets:** 0

---

## 4. Verifikasi Visual & Tipografi

1. **Tipografi Editorial Sinematik:**
   - Font Display: `Anton` (kondensasi tebal berkarakter poster bioskop)
   - Font Body: `Manrope` (legibility tinggi, ketebalan 400-800)
   - Font Accent: `Caveat` (aksen tulisan tangan elegan pada quote dan tagline)
2. **Layering Kedalaman Hero:**
   - Background `#090909` -> Teks raksasa `PORTFOLIO` merah (`#bd0c22`, z-index -1) -> Cut-out siluet portrait studio rim-light (`z-index: 1`) -> Teks pengantar dan tombol interaktif (`z-index: 3, 4`).
3. **Tekstur Film Grain:**
   - Overlay fractal noise inline SVG terpasang tanpa dependensi eksternal, memberikan rasa film analog halus.
4. **Brand Strip Loop Sinematik:**
   - Running logo rail bergerak halus menggunakan `useAnimationFrame`, menjeda saat hover / tombol jeda ditekan.
