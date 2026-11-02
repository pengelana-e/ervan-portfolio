# ASSETS INBOX — Foto Pribadi Ervan Erianto

Folder ini adalah wadah *drop-in* otomatis untuk foto-foto pribadi Ervan Erianto.

## Cara Mengganti Foto (Kapan Saja):
1. Cukup letakkan file foto potret Anda (format `.jpg`, `.jpeg`, atau `.png`) ke dalam folder ini:
   ```
   d:\New folder\assets-inbox\ervan-photos\
   ```
2. Jalankan skrip pemrosesan otomatis:
   ```bash
   node scripts/process_incoming_photos.mjs
   ```
3. Skrip akan secara otomatis:
   - Memilih foto resolusi tertinggi dengan komposisi potret optimal.
   - Melakukan komposit studio cut-out 1024×1536 px dengan *rim-light* merah dan *feathering* bawah.
   - Memperbarui `Asset/img/ervan-portrait.png` tanpa merusak kode.
   - Menjalankan `npm run build` otomatis.
   - Mempertahankan file asli Anda di folder ini tanpa menghapusnya.

## Foto yang Sedang Digunakan Saat Ini:
- Foto potret Ervan Erianto saat ini telah terpasang di:
  `Asset/img/ervan-portrait.png` (Cut-out transparan resolusi tinggi 1024×1536 px).
