# CONTENT STATUS & PANDUAN PEMELIHARAAN — Ervan Erianto Portfolio

Semua konfigurasi identitas, inisiatif, bidang praktik, prinsip kerja, dan aset personal Ervan Erianto telah dipasang dan diverifikasi 100%.

---

## Panduan Penggantian Foto Profil Mandiri (Kapan Saja)

Sistem telah dirancang modular sehingga Anda dapat mengganti foto profil utama di bagian Hero kapan saja dengan sangat mudah:

### Opsi A (Paling Mudah — Tanpa Mengubah Kode):
1. Siapkan foto potret baru (idealnya pose duduk/berdiri dengan pencahayaan gelap/rim-light).
2. Simpan gambar tersebut sebagai PNG transparan berukuran proporsional **1024 × 1536 px** (atau rasio 2:3).
3. Ganti file langsung di:
   ```
   d:\New folder\Asset\img\ervan-portrait.png
   ```
4. Jalankan perintah build:
   ```bash
   npm run build
   ```
5. Refresh browser (`http://localhost:4173`). Foto baru langsung terpasang otomatis dengan efek kedalaman parallax yang sama.

### Opsi B (Menggunakan Nama File Berbeda):
1. Letakkan file foto baru Anda di folder `d:\New folder\Asset\img\nama-foto-baru.png`.
2. Buka `src/data/profile.js`.
3. Ubah baris `portrait`:
   ```javascript
   portrait: "./Asset/img/nama-foto-baru.png",
   ```
4. Di file `index.html`, perbarui tag preload (baris 12):
   ```html
   <link rel="preload" href="./Asset/img/nama-foto-baru.png" as="image" fetchpriority="high" />
   ```
5. Jalankan `npm run build`.

---

## Status Komponen Identitas

- [x] **Identitas & Wordmark**: `ERVAN`, `BUILDER`, *Property Developer · Business Builder · Systems Thinker* (`src/data/profile.js`)
- [x] **Foto Potret Sinematik**: Terpasang dari foto pribadi Ervan dengan masking studio (`Asset/img/ervan-portrait.png`)
- [x] **Resume Eksekutif**: Dokumen PDF Curriculum Vitae resmi (`Asset/cv/curriculum-vitae-ervan-erianto.pdf`)
- [x] **Inisiatif Unggulan**: Arkavena & REWIRED dengan artwork SVG resolusi tinggi (`Asset/img/initiatives/`)
- [x] **Bidang Praktik**: Property Development, Construction & Project Control, Business Architecture, Digital Systems
- [x] **Prinsip Panduan**: 4 Prinsip Dasar menggantikan piala penghargaan
- [x] **Kontak & Privasi**: Tautan LinkedIn resmi; semua entitas rahasia (*Patra Sarana, Rest Area KM 626, PRAKARA OS, ECHO*) tidak pernah dipublikasikan.
