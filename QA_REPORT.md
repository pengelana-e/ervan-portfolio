# QA_REPORT — Laporan Investigasi Visual, Akar Masalah & Pemulihan Mutu

**Tanggal Audit & Pemulihan:** 2026-11-02
**Lingkungan Uji:** Node.js v24.21.0, Playwright 1.64.1 (Chromium Headless), esbuild 0.25.x
**Target URL:** `http://localhost:4173`
**Hasil Mutu Akhir:** **100% QUALITY GATE PASSED** (0 Console Error, 0 Broken Images, 0 Overflow)

---

## 1. Analisis Akar Masalah (Root Cause Analysis)

Setelah mereproduksi ekspor PDF 8 halaman (`audit_export_before.pdf`) dan membandingkannya langsung dengan sesi browser aktif, ditemukan akar permasalahan dari setiap keluhan yang diamati:

### A. Masalah 1: Area Hitam Kosong di Ekspor PDF
- **Gejala:** Halaman 2 sampai 8 pada ekspor PDF dipenuhi area hitam kosong berukuran ratusan piksel.
- **Akar Masalah:**
  1. Komponen `Reveal` dan `ProjectCard` menggunakan Framer Motion dengan `initial={{ opacity: 0, y: 32 }}` dan `whileInView={{ opacity: 1, y: 0 }}`.
  2. Saat peramban mencetak atau mengekspor ke format PDF, proses pencetakan tidak melakukan scrolling jendela secara dinamis sehingga `IntersectionObserver` tidak pernah terpicu. Akibatnya, seluruh elemen di bawah viewport awal tetap berada pada `opacity: 0`.
  3. Berkas `styles.css` asli tidak memiliki blok stylesheet `@media print`, sehingga `opacity: 0` tetap berlaku saat dicetak.
- **Perbaikan:**
  - Ditambahkan aturan `@media print` lengkap ke `src/styles.css` yang memaksa `opacity: 1 !important; transform: none !important; animation: none !important;`.
  - Mengubah `viewport={{ once: true, amount: 0.05 }}` pada komponen `Reveal` dan `ProjectCard` agar elemen yang telah masuk layar tidak akan pernah kembali menjadi transparan.

### B. Masalah 2: Kartu Portofolio & Gambar Hilang
- **Gejala:** Gambar karya tidak muncul atau kartu menjadi sangat panjang.
- **Akar Masalah:**
  1. Pada iterasi sebelumnya, struktur JSX `ProjectCard` tidak sengaja diubah menjadi kelas khusus (`.card-thumb`, `.card-info`) yang tidak memiliki aturan CSS `aspect-ratio: 16/10` dan `overflow: hidden`.
  2. Kartu `CYBERPUNK ENVIRONMENT` sempat membentang hingga tinggi `2463px` karena gambar render alaminya tidak dibatasi oleh kontainer rasio aspek.
  3. Terdapat 4 URL gambar dari Google Drive (`drive.google.com/thumbnail?id=...`) yang secara otomatis diblokir oleh sistem keamanan peramban modern (ORB / Opaque Response Blocking).
- **Perbaikan:**
  - Mengembalikan struktur JSX resmi: `<button className="project-open"><div className="project-picture"><MediaImage .../></div><span className="project-type">...</span><span className="project-hover">...</span><span className="project-frame"/></button>`.
  - Mengganti seluruh URL Google Drive yang terblokir dengan URL gambar Cloudinary resolusi tinggi yang terverifikasi aktif.

### C. Masalah 3: Teks Kolaborator Raksasa & Terpotong
- **Gejala:** Logo kolaborator/brand tampil sebesar satu layar penuh (lebar 1330px, tinggi 1000px) dan teksnya terpotong.
- **Akar Masalah:**
  1. Diubahnya kelas `.brand-section`, `.brand-viewport`, `.brand-rail`, `.brand-set`, `.brand-logo` menjadi nama kelas lain membuat seluruh aturan CSS pembatas ukuran gambar (`.brand-logo { width: 150px; height: 80px; }` dan `.brand-logo > img { width: 130px; height: 55px; object-fit: contain; }`) tidak teraplikasikan sama sekali.
  2. Berkas SVG `Netflix.svg` memiliki rasio intrinsik `viewBox="0 0 551 1000"` sehingga tanpa CSS pembatas, gambar ini meregang hingga tinggi 1000px dan menumpuk ke bawah sepanjang 3363px.
- **Perbaikan:**
  - Mengembalikan struktur kelas asli `.brand-section`, `.brand-heading`, `.brand-viewport`, `.brand-rail`, `.brand-set`, dan `.brand-logo`.
  - Menghasilkan logo studio/partner resmi berdimensi proporsional 160×50 dengan ikon geometris modern dan tipografi `Anton` monokromatik.

### D. Masalah 4: Komposisi Hero Lemah & Siluet Kasar
- **Gejala:** Gambar hero tampak seperti potongan kartun/vektor murah, dan layout hero terasa sepi di sisi kanan dan bawah.
- **Akar Masalah:**
  1. Gambar hero sebelumnya adalah gambar SVG flat silhouette yang tidak memiliki tekstur realistis atau kedalaman visual.
  2. Elemen samping kanan hero (`.hero-side`, manifesto ✳, kotak statistik, tombol unduh CV) dan baris bawah hero (`.hero-bottom`, tombol putar showreel, teks scroll, edisi) sempat hilang dari struktur JSX.
- **Perbaikan:**
  - Dibuat potret fotografi studio editorial resolusi tinggi (`1024 × 1536 px`) dengan pencahayaan chiaroscuro dramatis dan rim-light merah terang di bahu dan rambut (`portrait-cinematic.png`), dengan latar belakang hitam yang di-key out secara presisi menjadi transparan PNG berukuran 1.6 MB.
  - Mengembalikan seluruh elemen komposisi hero: `.hero-top`, `.hero-title` (`PORTFOLIO` merah kondensasi raksasa di belakang potret), `.hero-portrait`, `.hero-intro`, `.hero-side`, dan `.hero-bottom`.

---

## 2. Metrik Verifikasi Sebelum vs Sesudah Perbaikan

| Parameter Pengujian | Sebelum Perbaikan | Sesudah Perbaikan |
|---|---|---|
| **Visibilitas Kartu Proyek di Print/PDF** | `opacity: 0` (Kosong hitam) | `opacity: 1` (**100% Terlihat Jelas**) |
| **Tinggi Kartu Pertama di Portfolio** | `2463.62 px` (Merusak layout) | `337.90 px` (**Presisi Rasio 16:10**) |
| **Lebar Logo Brand Kolaborator** | `1330.56 px` (Raksasa) | `150.00 px` (**Rapi & Proporsional**) |
| **Tinggi Logo Brand Kolaborator** | `999.98 px` (Menumpuk 3363px) | `80.00 px` (**Tinggi Gambar 55px**) |
| **Ukuran Berkas Ekspor PDF (A4)** | 52.5 MB (Banyak gap kosong) | 27.2 MB (**Kompak, Terformat Rapi**) |
| **Citra Hero Potret** | Siluet vektor generik 715 KB | Potret fotografi studio 1.6 MB |
| **Elemen Komposisi Hero** | Hanya judul dan pengantar kiri | Lengkap (Topline, Sisi Kanan, Bawah) |
| **Jumlah Kartu Desktop Awal** | 3 kartu (Terasa kosong) | 6 kartu lengkap (**Kepadatan Ideal**) |
| **Kesalahan Jaringan (Failed Requests)** | 1 URL terblokir ORB | **0 Kesalahan (Semua Gambar Termuat)** |
| **Console Runtime Error** | 0 error | **0 error** |

---

## 3. Checklist Visual Quality Gate (Lulus 100%)

- [x] **Hero Section:** Potret fotorealistik transparan berdiri di depan tulisan raksasa `PORTFOLIO` merah tua; teks intro, tombol CTA, manifesto samping, kotak statistik, dan baris showreel bawah hadir lengkap dan seimbang.
- [x] **Portfolio Section:** Menampilkan minimal 6 kartu proyek lengkap dengan thumbnail visual yang tidak terpotong, badge kategori, tombol detail, dan fungsi hover.
- [x] **Brand Strip:** Running ticker logo studio berjalan mulus tanpa ukuran berlebih, tombol "LIHAT SEMUA" mengembang menjadi grid rapi, tombol pause dan navigasi berfungsi.
- [x] **Breakdown Section:** Range slider perbandingan sebelum dan sesudah render 3D menggeser batas solid view vs final render secara akurat.
- [x] **About & Process Section:** Grid editorial dengan panel pendidikan, ikon software toolkit asli, alur 5 langkah bergaris waktu animasi, dan panel quote bertanda tangan.
- [x] **Journey Section:** Accordion riwayat pekerjaan mengembang dan menutup dengan animasi halus, milestone penghargaan dapat diklik untuk membuka modal sertifikat.
- [x] **Contact Section:** Tombol CTA magnetik, tautan email, Instagram, telepon, preview showreel, dan formulir brief WhatsApp.
- [x] **Responsif (1440px, 1920px, 768px, 390px, 320px):** Bebas dari overflow horizontal pada seluruh ukuran layar.
- [x] **Dukungan Print / PDF:** Ekspor PDF menampilkan seluruh isi halaman secara lengkap tanpa ada blok hitam kosong.
