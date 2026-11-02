# ASSETS INBOX — Panduan Pengisian Aset Portofolio

Folder ini disediakan sebagai tempat penitipan (inbox) aset pribadi untuk mempersonalisasi website portofolio sinematik Anda kapan pun siap.

---

## 1. Foto Profil (Hero Portrait)
- **Nama file tujuan:** `Asset/img/portrait-cinematic.png` (atau ganti nama di `src/data/profile.js`)
- **Format:** PNG dengan background transparan (cut-out)
- **Ukuran ideal:** `1024 × 1536 px` (rasio 2:3)
- **Gaya visual yang disarankan:** Studio lighting dengan rim-light merah / warm di bahu atau rambut agar menyatu harmonis dengan tipografi raksasa merah di belakangnya.

---

## 2. Curriculum Vitae (PDF)
- **Nama file tujuan:** `Asset/cv/curriculum-vitae-sample.pdf`
- **Format:** File PDF asli
- **Tombol terkait:** Tombol "RESUME" di header, "DOWNLOAD CV" di hero stat, dan "RESUME" di bagian perjalanan (journey).

---

## 3. Logo Brand / Klien / Kolaborator
- **Nama file tujuan:** `Asset/svg/brand/<NamaBrand>.svg` atau `.png`
- **Pembaruan data:** Daftarkan file dan nama brand di `src/data/brands.json`.
- **Format:** Diutamakan SVG monokrom / putih agar kontras rapi di atas running brand strip gelap.

---

## 4. Sertifikat & Penghargaan
- **Nama file tujuan:** `Asset/img/<NamaSertifikat>.svg` / `.jpg` / `.png`
- **Pembaruan data:** Daftarkan di array `certificates` dan `awards` pada file `src/data/profile.js`.
- **Fitur interaktif:** Klik "LIHAT SERTIFIKAT" atau milestone penghargaan untuk membuka modal preview resolusi tinggi.

---

## 5. Arsip Proyek (Video, Still, 3D Render)
- **File data:** `src/data/projects.json`
- **Format entri:**
  - `youtube`: masukkan ID video YouTube (contoh: `wgGEoeSLR3g`)
  - `drive`: masukkan ID Google Drive preview
  - `render`: sertakan tautan tahap `solid`, `material`, `final` untuk fitur breakdown 3D interaktif
  - `image`: URL gambar still / fotografi / manipulasi digital
  - `website`: tautan URL proyek interaktif

---

## 6. Pengaturan Profil Lengkap
Buka file `src/data/profile.js` untuk mengganti:
- Nama & Wordmark
- Headline & Subheadline
- Biodata & Quote Filosofis
- Riwayat Pekerjaan (Accordion Experience)
- Kontak (WhatsApp, Email, Instagram, YouTube)
