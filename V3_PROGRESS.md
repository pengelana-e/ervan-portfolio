# ERVAN PORTFOLIO V3 — PROGRESS LOG

## PHASE 1: CONTENT & IDENTITY (COMPLETED & VERIFIED)

> **Checkpoint Git Baseline:** `checkpoint-v3-phase1-baseline` (`b1f3be8`)  
> **Phase 1 Commit:** `feat(v3): complete Phase 1 content and identity update for Ervan Erianto portfolio` (`3200ac1`)  
> **Tanggal Selesai:** 3 November 2026  
> **Status:** Lulus Verifikasi QA Otomatis (100% Pass)  
> **Local Server URL:** `http://localhost:4173`

---

### 1. Perubahan Identitas yang Telah Dikunci (Locked Identity)

| Parameter | Nilai Baru (V3) | Status |
| :--- | :--- | :---: |
| **Nama Lengkap** | Ervan Erianto | Terpasang |
| **Hero Background Headline** | `BUILDER.` (Anton Display Font) | Terpasang |
| **Profesi Utama** | Real Estate Developer since 2016 | Terpasang |
| **Identitas Pendukung** | Founder · Author · Applied AI | Terpasang |
| **Hero Role Pill** | `REAL ESTATE DEVELOPER SINCE 2016 · FOUNDER · AUTHOR · APPLIED AI` | Terpasang |
| **Manifesto** | *"Building properties, businesses, knowledge, and intelligent systems."* | Terpasang |
| **Lokasi** | Surabaya, Indonesia | Terpasang |
| **Pengalaman Timeline** | `2016 → NOW · 10+ TAHUN PRAKTIK` | Terpasang |

---

### 2. Struktur 6 Kartu Utama (Selected Work & Ventures)

Tepat 6 kartu primer disusun sesuai urutan mutlak berikut:

1. **`01. REAL ESTATE DEVELOPMENT`**
   - **Kategori:** The Practice (Active Practice · 2016 → Present)
   - **Fokus:** Praktik pengembangan properti profesional sejak 2016, mencakup kemitraan lahan, kelayakan finansial, perumahan tapak (Dirham Land & Dirham Residence), dan eksekusi proyek lapangan.
   - **Visual Artwork:** [dirham-land.svg](file:///d:/New%20folder/Asset/img/initiatives/dirham-land.svg)

2. **`02. ARKAVENA`**
   - **Kategori:** The Practice (Active Practice · 2021 → Present)
   - **Fokus:** Bisnis konstruksi dan project control yang berfokus pada manajemen biaya (cost management), pengawasan deviasi progres (schedule control), ruang lingkup (scope governance), dan standar mutu.
   - **Visual Artwork:** [arkavena.svg](file:///d:/New%20folder/Asset/img/initiatives/arkavena.svg)

3. **`03. ASSET STRATEGY`**
   - **Kategori:** The Practice (Strategic Initiative · Commercial Planning)
   - **Fokus:** Strategi pengembangan properti komersial, utilisasi aset, perancangan model pendapatan (revenue models), dan perencanaan operasional kawasan. Menyertakan PT Patra Sarana Indonesia sebagai inisiatif studi kelayakan koridor strategis (tanpa klaim operasional Rest Area KM 626).
   - **Visual Artwork:** [asset-strategy.svg](file:///d:/New%20folder/Asset/img/initiatives/asset-strategy.svg)

4. **`04. REAL ESTATE REWIRED`**
   - **Kategori:** The Knowledge (Published Book · Official Release)
   - **Fokus:** Buku panduan resmi karya Ervan Erianto yang membedah logika keputusan developer properti dari sudut pandang pengalaman praktik nyata sejak 2016. Tidak dilabeli sebagai buku mendatang atau belum terbit, dan label self-published tidak dijadikan highlight utama.
   - **Visual Artwork:** [real-estate-rewired-book.svg](file:///d:/New%20folder/Asset/img/initiatives/real-estate-rewired-book.svg)

5. **`05. REWIRED`**
   - **Kategori:** The Knowledge (Active Ecosystem · Founder & Educator)
   - **Fokus:** Inisiatif ekosistem dan komunitas yang menghubungkan pengetahuan praktis properti, edukasi, developer frameworks, komunitas pengembang, dan kolaborasi proyek.
   - **Visual Artwork:** [rewired.svg](file:///d:/New%20folder/Asset/img/initiatives/rewired.svg)

6. **`06. APPLIED AI & BUSINESS SYSTEMS`**
   - **Kategori:** The Technology (Active Systems & Products · Applied AI)
   - **Fokus:** Perancangan dan pembangunan produk bertenaga AI, intelligent workflows, dan otomatisasi sistem bisnis terapan.
   - **Tiga Bukti Nyata (Featured Proofs):**
     - **PRAKARA OS:** Sistem intelijen hukum privat untuk due diligence regulasi pertanahan kompleks.
     - **E.C.H.O:** Personal AI assistant dan eksplorasi alur kerja strategis personal.
     - **REWIRED Intelligence:** Sistem pembelajaran dan kurasi pengetahuan properti berbasis AI.
   - **Visual Artwork Baru:** [applied-ai-systems.svg](file:///d:/New%20folder/Asset/img/initiatives/applied-ai-systems.svg)

---

## PHASE 2: SKY BLUE REBRANDING (COMPLETED & VERIFIED)

> **Checkpoint Git Tag:** `checkpoint-v3-phase2-complete`  
> **Tanggal Selesai:** 3 November 2026  
> **Status:** Lulus Verifikasi QA Otomatis (100% Pass)  
> **Local Server URL:** `http://localhost:4173`

---

### 1. Sistem Warna Midnight & Bright Sky Blue (Strict Palette)

| Token CSS | Nilai Hex | Fungsi Desain |
| :--- | :--- | :--- |
| `--primary` | `#38BDF8` | Bright Sky Blue untuk aksen interaktif, tombol primer, garis timeline aktif, dot status |
| `--highlight` | `#7DD3FC` | Soft Light Sky untuk highlight teks, glow border, badge aktif, dan hover states |
| `--bg` | `#07111D` | Deep Midnight Navy untuk latar belakang utama website |
| `--surface` | `#14283C` | Midnight Slate untuk surface cards, modal dialog, dropdown panels, navigasi |
| `--surface-card` | `#0c1a29` | Midnight Card Surface gelap dengan kontras halus terhadap `#07111D` |
| `--surface-hover` | `#19334d` | Hover surface pada card inisiatif |
| `--panel` | `#0d1e30` | Latar belakang modal drawer dan quick stats bar |
| `--ink` | `#F0F8FF` | Alice Blue / crisp warm white untuk teks heading dan body yang tajam |
| `--muted` | `#8da2ba` | Slate muted blue untuk teks deskripsi sekunder, metadata, dan tanggal |
| `--line` | `#1e354d` | Garis batas struktural (thin divider rules), border cards, dan timeline rail |

---

### 2. Implementasi Visual & Aksen

- **Pembersihan Residual Merah (Zero Crimson):** Seluruh variabel, styling, dan 35+ file vektor SVG (`Asset/img/initiatives/` dan `Asset/svg/brand/`) telah dimigrasikan dari crimson/merah ke palet Sky Blue & Midnight. Verifikasi DOM otomatis menghasilkan **0 elemen merah**.
- **Hero Display Headline:** Teks raksasa `BUILDER.` direkolorasi menjadi `#0284c7` dengan gradien pudar halus ke `#07111D`.
- **Aksesibilitas Kontras Tinggi (WCAG AAA):** Tombol CTA primer (`.primary-link` & `.contact-primary-btn`) menggunakan background `#38BDF8` dengan teks dark midnight `#07111D` (`font-weight: 700`), menghasilkan rasio kontras 8.4:1.
- **Favicon & Meta Theme:** `Asset/img/favicon.svg` diperbarui dengan monogram Sky Blue di atas Midnight Circle, dan `<meta name="theme-color">` diatur ke `#07111D`.

---

### 3. Hero Portrait Preservasi Otentik

- **Subjek & Fitur Wajah:** Foto studio personal Ervan Erianto dipertahankan 100% autentik tanpa modifikasi fitur wajah dan tanpa regenerasi AI.
- **Latar Belakang Transparan:** Alpha cutout bersih tanpa tepi kasar, membaur ke latar belakang gelap dengan gradien halus pada bagian bawah.
- **Ambient Lighting:** Glow radial di belakang foto dikonfigurasi ke warna Sky Blue halus (`rgba(56, 189, 248, 0.18)`), memberikan kedalaman sinematik yang menyatu dengan tema Midnight tanpa mendistorsi skin tone subjek.

---

### 4. Hasil Verifikasi Playwright QA

| Layar / Viewport | Dimensi | Overflow Horisontal | Status Visual |
| :--- | :--- | :---: | :---: |
| **Desktop Ultra-wide** | 1920 × 1080 | 0 px | Lulus |
| **Desktop Standard** | 1440 × 900 | 0 px | Lulus |
| **Tablet Portrait** | 768 × 1024 | 0 px | Lulus |
| **Mobile Standard** | 390 × 844 | 0 px | Lulus |
| **Mobile Narrow** | 320 × 568 | 0 px | Lulus |

---

### 5. Komitmen Batasan (Constraints)

- **Tidak Mengimplementasikan Phase 3:** Phase 3 tidak dieksekusi sesuai arahan direktif.
- **Tidak Ada Deployment Publik:** Seluruh pengujian dan staging berjalan lokal di `http://localhost:4173`.
- **Integritas Konten:** Seluruh struktur 6 kartu, urutan hierarki, dan copywriting V3 dipertahankan tanpa perubahan.
