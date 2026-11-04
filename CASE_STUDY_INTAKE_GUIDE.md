# PANDUAN INTAKE KONTEN CASE STUDY (SELECTED WORK)
## Ervan Erianto Portfolio — Case Study Integration Guide

Dokumen ini adalah panduan praktis bagi owner untuk memasukkan data studi kasus proyek nyata ke dalam sistem Selected Work tanpa perlu merombak kode atau desain UI website.

---

### 1. Filosofi & Kontrol Publikasi (*Zero Fake Data*)

Sistem Selected Work dirancang dengan prinsip **kredibilitas empiris**:
- **Hanya proyek terverifikasi yang dipublikasikan:** Data yang belum lengkap atau masih dalam peninjauan akan berstatus `draft` / `awaiting_evidence` dan **tidak akan muncul ke publik**.
- **Desain adaptif:** Jika suatu bidang (misal: tantangan atau tautan publik) belum memiliki data, tampilan detail akan menyembunyikan blok tersebut secara anggun (*graceful hiding*) tanpa meninggalkan kotak kosong atau teks pengisi semu.
- **Dukungan multi-bidang:** Mendukung proyek di ranah *Real Estate Development*, *Construction & Project Management*, serta *AI & Software Development*.

---

### 2. Format Data & Lokasi Berkas

Data studi kasus dikelola secara terstruktur pada berkas:
📁 `src/data/caseStudies.js`

Setiap entri studi kasus memiliki struktur bidang (*schema*) berikut:

```javascript
{
  // --- IDENTITAS PROYEK ---
  id: "slug-unik-proyek", // contoh: "klaster-residensial-jatim"
  title: "Nama Resmi Proyek", // contoh: "Pengembangan Kawasan Residensial Tapak"
  category: "Real Estate Development", // atau "Construction & Project Management" / "AI & Software Development"
  ventureId: "real-estate-development", // ID venture terkait (01 s.d. 06)
  location: "Surabaya / Jawa Timur, Indonesia", // opsional
  period: "2021 — 2023", // rentang tahun pelaksanaan
  status: "Selesai / Beroperasi", // status proyek saat ini
  summary: "Ringkasan editorial 1-2 kalimat mengenai esensi proyek.",

  // --- KETERLIBATAN PROFESIONAL OWNER ---
  role: "Peran spesifik owner", // contoh: "Property Developer & Execution Partner"
  scope: "Cakupan tanggung jawab teknis & strategis owner.",
  context: "Latar belakang masalah atau konteks lapangan nyata.", // opsional
  challenges: "Kendala atau risiko utama yang dihadapi di lapangan.", // opsional
  approach: "Keputusan strategis, solusi, atau metode kerja yang diambil.", // opsional
  process: "Tahapan eksekusi: Langkah 1 → Langkah 2 → Langkah 3", // opsional

  // --- HASIL & DELIVERABLE TERVERIFIKASI ---
  outcomes: [
    "Hasil konkret 1 (misal: penyelesaian tepat mutu/biaya)",
    "Hasil konkret 2 (misal: kepatuhan legalitas tanah 100%)"
  ],
  deliverables: "Deliverable fisik/digital yang diserahterimakan.", // opsional
  supportingEvidence: "Catatan bukti dokumentasi atau berita acara serah terima.", // opsional

  // --- ASSET MEDIA & FOTO ---
  coverImage: "./Asset/img/projects/nama-file-foto.jpg", // Foto utama rasio 16:9 / 16:10
  gallery: [
    "./Asset/img/projects/foto-detail-1.jpg"
  ],
  imageAttribution: "Dokumentasi Lapangan / Ervan Erianto", // atribusi foto
  mediaPermission: "Owner-authorized for public display",

  // --- REFERENSI PUBLIK ---
  link: "https://nama-situs-proyek.com", // opsional: tautan eksternal jika ada
  company: "Nama entitas atau inisiatif terkait",

  // --- KONTROL PUBLIKASI (SANGAT PENTING) ---
  publicationStatus: "draft", // Ubah ke "approved" hanya setelah diverifikasi owner!
  isPlaceholder: false        // Set false jika data nyata milik owner
}
```

---

### 3. Tahapan Mempublikasikan Studi Kasus Baru

1. **Siapkan Foto Proyek:**
   - Format: JPG / PNG beresolusi tajam (disarankan minimal `1920×1080` atau rasio 16:9).
   - Simpan foto di dalam folder: `Asset/img/projects/` (atau `Asset/img/ventures/`).
2. **Isi Data pada `src/data/caseStudies.js`:**
   - Salin salah satu blok studi kasus yang ada.
   - Masukkan informasi faktual sesuai template di atas.
3. **Ubah Status Publikasi ke `approved`:**
   ```javascript
   publicationStatus: "approved",
   isPlaceholder: false
   ```
4. **Jalankan Build Produksi:**
   ```bash
   npm run build
   ```
5. **Verifikasi Tampilan Lokal:**
   - Buka browser pada `http://localhost:4173`.
   - Section **SELECTED WORK** akan otomatis aktif di halaman publik dan tautan navigasi `CASE STUDIES` akan otomatis muncul pada bilah navigasi.

---

### 4. Checklist Kesiapan Sebelum Rilis Publik (*Quality Gate*)

- [ ] Judul dan lokasi proyek akurat secara faktual.
- [ ] Peran owner mencerminkan keterlibatan sesungguhnya (tidak dibesar-besarkan).
- [ ] Deliverable dan hasil dapat dipertanggungjawabkan secara profesional.
- [ ] Foto memiliki izin penggunaan dan hak cipta dokumentasi.
- [ ] Status publikasi diatur ke `"approved"` dan `isPlaceholder: false`.
