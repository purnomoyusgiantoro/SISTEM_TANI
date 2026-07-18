---
name: auto-fix
description: Mode otonom visual-first — melihat setiap halaman, mendeteksi anomali tampilan & fungsional, lalu memperbaiki langsung sebelum lanjut.
---

# 🔍 Instruksi Skill: Auto-Fix (Visual Anomaly Detection & Repair)

Saat skill ini dipanggil, kamu (AI) bertindak sebagai **inspektur visual otonom**. Kamu membuka setiap halaman, **melihat tampilannya** (screenshot), mendeteksi **anomali** (visual maupun fungsional), lalu **langsung memperbaiki** sebelum berpindah ke halaman berikutnya.

> **Prinsip utama:** Lihat → Deteksi Anomali → Perbaiki → Lihat Lagi → Lanjut.

---

## 1. 🏗️ Persiapan

1. Baca `PRD_Backend_RuangTani.md` dan `PRD_Frontend_RuangTani.md` untuk memahami spesifikasi.
2. Pastikan backend (`php artisan serve`) dan frontend (`npm run dev`) berjalan.
3. Baca file `database/seeders/UserSeeder.php` untuk mendapatkan akun login tiap role.

---

## 2. 👁️ Siklus Inspeksi Visual (Visual Patrol)

Gunakan `browser_subagent` untuk **membuka setiap halaman satu per satu** dan ambil **screenshot**. Untuk setiap screenshot, analisis dengan checklist anomali berikut:

### Checklist Anomali Visual (apa yang kamu CARI di setiap screenshot)

| Kategori | Anomali yang Dicari |
|---|---|
| **Layout Rusak** | Elemen bertumpuk (*overlap*), melebihi layar (*overflow*), kolom tidak sejajar, spacing tidak konsisten |
| **Elemen Hilang** | Tombol, ikon, tabel, card, atau teks yang seharusnya ada tapi tidak muncul |
| **Teks Aneh** | Placeholder mentah (lorem ipsum, `undefined`, `null`, `NaN`, `[object Object]`), teks terpotong, bahasa campur tanpa alasan |
| **Warna Salah** | Badge/status warna tidak sesuai konteks (misal status "Ditolak" berwarna hijau), kontras terlalu rendah |
| **Ukuran Salah** | Font terlalu kecil/besar, tombol terlalu kecil untuk diklik, gambar terdistorsi |
| **Halaman Blank/Crash** | Halaman kosong putih, error boundary React, pesan error merah di layar |
| **Loading Tanpa Akhir** | Spinner berputar terus tanpa data muncul |
| **Tabel Kosong Tanpa Feedback** | Tabel tanpa data tapi tidak ada pesan *empty state* |
| **Modal/Dialog Rusak** | Modal tidak bisa ditutup, posisi di luar layar, background overlay tidak muncul |
| **Responsif** | Di layar kecil: sidebar menutupi konten, tombol keluar viewport, tabel tidak bisa di-scroll |

### Halaman yang WAJIB Diinspeksi

Untuk **setiap role** (Petani, Pengurus, BPP, Admin), login dan kunjungi **semua halaman** yang bisa diakses role tersebut:

**Akun Login:**
- Petani: `budi@ruangtani.id` / `password`
- Pengurus: `ahmad@ruangtani.id` / `password`
- BPP: `hendra@ruangtani.id` / `password`
- Admin: `admin@ruangtani.id` / `password`

**Daftar Halaman per Role:**

| Halaman | Petani | Pengurus | BPP | Admin |
|---|:---:|:---:|:---:|:---:|
| Landing Page (`/`) | ✅ | ✅ | ✅ | ✅ |
| Login (`/login`) | ✅ | ✅ | ✅ | ✅ |
| Dashboard (`/dashboard`) | ✅ | ✅ | ✅ | ✅ |
| Data Lahan (`/data-lahan`) | ✅ | ✅ | ✅ | — |
| Sewa Peralatan (`/sewa-peralatan`) | ✅ | ✅ | — | — |
| Pembayaran (`/pembayaran`) | ✅ | ✅ | — | — |
| Kegiatan (`/kegiatan`) | ✅ | ✅ | — | — |
| Struktur Organisasi (`/struktur-organisasi`) | ✅ | ✅ | ✅ | — |
| Berita (`/berita`) | ✅ | ✅ | — | — |
| Verifikasi Lahan (`/verifikasi-lahan`) | — | — | ✅ | — |
| Kelola Berita (`/kelola-berita`) | — | — | ✅ | — |
| Analisis Data (`/analisis-data`) | — | — | ✅ | — |
| Kelola Pengguna (`/kelola-pengguna`) | — | — | — | ✅ |
| Log Aktivitas (`/log-aktivitas`) | — | — | — | ✅ |
| Backup Data (`/backup-data`) | — | — | — | ✅ |

---

## 3. 🔨 Alur per Halaman (Wajib Diikuti)

Untuk **setiap halaman** di daftar di atas, lakukan langkah ini **secara berurutan**:

### 3.1. Lihat & Screenshot
- Buka halaman menggunakan `browser_subagent`.
- **Screenshot** halaman.
- Analisis screenshot: apakah ada anomali dari checklist di atas?

### 3.2. Deteksi Anomali
- Jika **ada anomali visual** (layout rusak, teks aneh, elemen hilang, warna salah, dll):
  - Catat anomalinya.
  - **HENTIKAN inspeksi sementara.**
  - Cari penyebab di source code (gunakan `grep_search`, `view_file`).
  - **Perbaiki langsung** menggunakan `replace_file_content` atau `multi_replace_file_content`.
  - Kembali ke browser → **reload halaman** → **screenshot ulang** → pastikan anomali sudah hilang.
  - Jika masih ada anomali lain, ulangi.

### 3.3. Test Interaksi
Setelah tampilan bersih, **klik semua elemen interaktif** di halaman tersebut:
- Tombol (Tambah, Edit, Hapus, Filter, Export, dll)
- Modal/dialog — pastikan bisa dibuka DAN ditutup
- Form — isi dan submit, pastikan toast sukses/error muncul
- Dropdown/select — pastikan opsi termuat
- Pagination — klik next/prev
- Search — ketik query, pastikan filter bekerja

Jika ada tombol yang **tidak merespon** (tombol mati/placeholder), kamu **WAJIB** mengimplementasikan handler-nya atau menyambungkan ke API yang benar.

### 3.4. Verifikasi Backend
Setelah submit form atau aksi CRUD:
- Jalankan `php artisan tinker` atau script PHP untuk **cek database** — pastikan data benar-benar tersimpan/terupdate/terhapus.
- Jika data tidak sinkron, perbaiki backend (Controller/Model) lalu test ulang.

### 3.5. Tandai Selesai, Lanjut
Jika halaman sudah bersih (tidak ada anomali visual, semua tombol berfungsi, data sinkron), lanjut ke halaman berikutnya.

---

## 4. 🔄 Aturan Inti: Fix-On-Sight

> **Kamu TIDAK BOLEH melewati anomali.** Jika kamu melihat sesuatu yang aneh — perbaiki SEKARANG.

- ❌ Jangan buat daftar bug untuk nanti.
- ❌ Jangan skip halaman yang bermasalah.
- ❌ Jangan abaikan masalah "kecil" (misal spacing 2px yang tidak konsisten).
- ✅ Lihat → Perbaiki → Lihat lagi → Baru lanjut.

**Contoh anomali yang harus langsung diperbaiki:**
- Card dashboard memiliki tinggi yang tidak seragam → perbaiki CSS.
- Tombol "Unduh PDF" tidak merespon klik → implementasikan onClick handler.
- Tabel menampilkan `undefined` di kolom nama → perbaiki data mapping di komponen.
- Modal edit muncul tapi field kosong (data tidak ter-populate) → perbaiki state/prop passing.
- Halaman `/pembayaran` blank setelah upload bukti → perbaiki error handling di API call.
- Sidebar di mobile menutupi konten → perbaiki z-index dan overlay.
- Status badge "Ditolak" berwarna hijau → perbaiki logic warna di StatusBadge component.

---

## 5. 📱 Inspeksi Responsif (Wajib)

Setelah semua halaman diinspeksi di ukuran desktop, **ulangi untuk ukuran mobile** (360x640):
- Resize browser ke 360x640.
- Kunjungi **minimal 5 halaman utama** (Landing, Login, Dashboard, Data Lahan, Sewa).
- Cek anomali: elemen tumpang tindih, teks terpotong, tombol keluar viewport.
- Pastikan hamburger menu / sidebar toggle berfungsi.

---

## 6. 🧪 Test API Backend (Terminal)

Setelah inspeksi visual selesai, lakukan test API langsung dari terminal:
- Gunakan `curl` atau script PHP untuk test **setiap endpoint** di `routes/api.php`.
- Pastikan semua endpoint merespon dengan status code yang benar (200, 201, 401, 403, 422).
- Khususnya test:
  - Login (`POST /api/v1/auth/login`) → pastikan dapat token.
  - Endpoint tanpa token → pastikan `401 Unauthorized`.
  - CRUD endpoint → pastikan data tersimpan/terupdate/terhapus di database.

---

## 7. 🔁 Loop Ulang (Jika Masih Ada Masalah)

Setelah semua halaman diinspeksi:
1. **Evaluasi:** Apakah ada halaman yang kamu perbaiki?
2. Jika **YA** → Kembali ke halaman-halaman yang diperbaiki, **inspeksi ulang** untuk memastikan perbaikan tidak merusak hal lain.
3. Ulangi sampai **satu putaran penuh tanpa menemukan anomali baru**.

---

## 8. 📋 Laporan Akhir

Setelah sistem dinyatakan bersih, buat artifact `walkthrough.md` berisi:
- Daftar semua anomali yang ditemukan dan diperbaiki (dengan file & baris yang diubah).
- Screenshot sebelum/sesudah perbaikan (jika tersedia dari rekaman browser).
- Konfirmasi bahwa sistem siap digunakan.
