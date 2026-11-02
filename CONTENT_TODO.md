# CONTENT_TODO — Checklist Personalisasi Portofolio Sinematik

Dokumen ini melacak daftar item yang dapat dipersonalisasi saat pemilik portofolio ingin mengganti data sampel dengan identitas dan karya pribadinya.

---

### [ ] 1. Identitas & Branding Utama (`src/data/profile.js`)
- [ ] Ganti nama lengkap (`name`) dan nama panggung/wordmark (`wordmark`)
- [ ] Sesuaikan headline peran (`roleLines` dan `topline`), contoh: `["DIRECTOR &", "VFX ARTIST"]`
- [ ] Tulis tagline sinematik dan kalimat pengantar hero (`intro`)
- [ ] Tentukan manifesto visual singkat (`manifesto`)
- [ ] Perbarui kota/negara domisili (`location`)

### [ ] 2. Foto Profil Sinematik (`Asset/img/`)
- [ ] Masukkan cut-out foto portrait transparan (`1024 × 1536 px`) ke folder `Asset/img/`
- [ ] Perbarui tautan dan alt text di `src/data/profile.js` (`portrait`, `portraitAlt`)
- [ ] Perbarui tag preload gambar di `index.html` jika nama file diubah

### [ ] 3. Kontak & Media Sosial (`src/data/profile.js`)
- [ ] Masukkan email resmi (`email`)
- [ ] Masukkan nomor WhatsApp aktif (`whatsapp` dan `phoneDisplay`) dengan format internasional (contoh: `6281234567890`)
- [ ] Tautkan akun Instagram (`instagram.handle` dan `instagram.url`)
- [ ] Tautkan channel YouTube portofolio (`youtube`)

### [ ] 4. Resume / CV (`Asset/cv/`)
- [ ] Letakkan file CV PDF terbaru ke dalam folder `Asset/cv/`
- [ ] Perbarui nama file pada `profile.cv` di `src/data/profile.js`

### [ ] 5. Logo Kolaborator & Studio (`src/data/brands.json`)
- [ ] Masukkan file logo studio / brand rekanan (format SVG atau PNG putih transparan) ke `Asset/svg/brand/`
- [ ] Daftarkan nama brand dan nama filenya di `src/data/brands.json`

### [ ] 6. Riwayat Karir & Pendidikan (`src/data/profile.js`)
- [ ] Perbarui pengalaman kerja pada array `experiences` (accordion interaktif)
- [ ] Perbarui riwayat pendidikan dan kursus pada array `education`
- [ ] Sesuaikan daftar keahlian utama (`skills`) dan software (`software`)
- [ ] Sesuaikan 5 tahapan alur kerja kreatif (`process`)

### [ ] 7. Sertifikat & Penghargaan Asli (`src/data/profile.js`)
- [ ] Masukkan bukti sertifikat atau foto piala ke `Asset/img/`
- [ ] Daftarkan di array `certificates` dan `awards`
- [ ] *Catatan:* Jika belum memiliki penghargaan formal, Anda dapat mengatur `showAwards: false` pada `src/data/profile.js` untuk menyembunyikan section tanpa merusak layout.

### [ ] 8. Kurasi Proyek Unggulan (`src/data/projects.json`)
- [ ] Ganti atau tambahkan entri karya Anda ke `src/data/projects.json`
- [ ] Tentukan 3 proyek unggulan utama di `featuredKeys` pada `src/data/profile.js` (akan ditampilkan di grid hero dan breakdown slider 3D)
