---
name: auto-fix
description: Mode otonom tingkat lanjut untuk membaca sistem, mencocokkan dengan PRD, menemukan error, memperbaiki, dan melakukan E2E testing secara berulang (QA Automation).
---

# 🚀 Instruksi Skill: Auto-Fix (Advanced QA & Repair Mode)

Saat skill ini dipanggil, kamu (AI) diinstruksikan untuk menjalankan **siklus pengujian dan perbaikan otonom** (End-to-End QA) tanpa henti sampai sistem dinyatakan 100% bebas dari *error* dan sesuai dengan spesifikasi PRD. 

Jalankan langkah-langkah berikut secara berurutan:

## 1. 📖 Analisis Sistem & Sinkronisasi PRD
- **Baca Spesifikasi Dasar:** Buka dan pahami spesifikasi dari file `PRD_Backend_RuangTani.md` dan `PRD_Frontend_RuangTani.md`.
- **Cek Status Sistem:** Periksa *terminal logs* (contoh: log Laravel, Vite console) untuk mendeteksi error yang sedang berjalan (seperti *500 Internal Server Error* atau *React Error Boundary*).
- **Analisis Kesenjangan (Gap Analysis):** Analisis *stack trace* atau struktur UI saat ini, lalu cocokkan dengan *requirement* di PRD. Identifikasi fitur yang belum berfungsi atau tidak sesuai.

## 2. 🛠️ Perbaikan Sistem (Frontend & Backend)
- **Cari Akar Masalah:** Gunakan *grep_search* atau pencarian file untuk menemukan letak *bug*.
- **Modifikasi Kode:** Buat perbaikan di backend (Controller, Model, Database) maupun frontend (React Component, Context, API client) menggunakan alat modifikasi file (`replace_file_content` atau `multi_replace_file_content`).
- Pastikan kode yang ditulis menerapkan standar keamanan (menghindari dereferensi null, optional chaining, *exception handling*).

## 3. 🧪 Pengujian End-to-End (E2E Testing Otomatis)
Gunakan `browser_subagent` untuk mensimulasikan pengujian langsung seperti seorang *Quality Assurance (QA)*. Kamu wajib melakukan pengujian komprehensif berikut:
- **Test Semua Role:** Login secara bergiliran menggunakan akun dari semua *role* (Petani, Pengurus, BPP, Admin).
- **Test Navigasi:** Kunjungi setiap menu dan submenu di Sidebar. Pastikan setiap halaman termuat sempurna tanpa *crash*.
- **Test CRUD (Create, Read, Update, Delete):**
  - **Input Data:** Isi formulir, tes upload file (jika ada), dan kirim data.
  - **Update Data:** Klik tombol edit, ubah data, lalu simpan.
  - **Hapus Data:** Tes tombol hapus dan konfirmasi dialog.
- **Test Interaksi UI:** Klik tombol filter, ganti input tanggal, coba fitur pencarian (*search*), dan buka *modal/dialog* yang ada.
**Test Interaksi AI:** test juga semua apinya dengan benar dan pastikan tidak ada error
- **Test Elemen Interaktif & Placeholder:** Secara khusus, periksa setiap elemen UI seperti tombol "Unduh PDF", pemilih tanggal (Date Picker), tombol aksi tabel, dan tombol *export/import*. Banyak elemen mungkin hanya tampilan (template) dan belum berfungsi. Jika ditemukan elemen yang tidak merespon saat di-klik atau *error* fungsi di belakangnya, kamu WAJIB menganalisis, memperbaiki *handler* (seperti `onClick`), menyambungkan ke API, atau mengimplementasikan logika fungsionalnya hingga benar-benar dapat beroperasi. Jangan abaikan elemen yang tampak mati.
- **Test Skenario Spesifik & Fungsionalitas Lengkap (Sangat Rinci):**
  - **Kelola Berita/Artikel:** Test fitur menambahkan artikel berita, edit, dan hapus. Pastikan artikel baru muncul di halaman publik/dashboard.
  - **Kelola Pengguna (Akun):** Test fitur penambahan akun baru (Petani/BPP/Pengurus). 
  - **Uji Login Akun Baru:** *Wajib* mencoba logout, kemudian login kembali menggunakan akun baru yang baru saja ditambahkan di langkah sebelumnya.
  - **Verifikasi Lahan:** Test siklus pengajuan lahan oleh Petani, lalu ubah dan lakukan proses verifikasi (Terima/Tolak) oleh BPP/Pengurus. Pastikan statusnya berubah dan datanya sinkron.
  - **Pembayaran (Test Bayar):** Test siklus penyewaan atau pembayaran dari awal hingga akhir. Cek simulasi unggah bukti bayar dan verifikasi status pembayarannya.
  - **Profil dan Pengaturan:** Test pengubahan data profil (nama, password, dll) dan pastikan perubahannya tersimpan permanen.
- **Test Database & API (Backend Validation):**
  - Lakukan *test API* secara langsung menggunakan perintah terminal (`curl` atau *script node/php*) untuk memastikan semua endpoint merespon dengan benar tanpa error 500.
  - Validasi *database*: Pastikan data yang diinput melalui UI benar-benar tersimpan di tabel *database* yang sesuai dengan relasi yang benar (tidak ada data *orphan* atau *foreign key error*). Uji semua fungsionalitas ini secara rinci sampai ke akar-akarnya.
- **Test Kegiatan Pertanian (CRUD Lengkap):**
  - Tambah kegiatan baru (isi semua field: nama, tanggal mulai/selesai, deskripsi, jenis kegiatan). Pastikan data tersimpan.
  - Edit kegiatan yang sudah ada, ubah tanggal dan deskripsinya, lalu simpan. Pastikan perubahan tersimpan.
  - Hapus kegiatan dan pastikan data terhapus dari tabel (tidak muncul lagi di list).
  - Test filter kegiatan berdasarkan tanggal dan jenis. Pastikan hasilnya sesuai.
- **Test Sewa Peralatan (Alur Lengkap End-to-End):**
  - Login sebagai **Petani** → buka Katalog Alat → pilih alat → klik "Ajukan Sewa" → isi tanggal mulai & selesai → pastikan kalkulasi biaya otomatis benar → kirim pengajuan.
  - Login sebagai **Pengurus** → buka tab "Validasi & Riwayat Sewa" → temukan pengajuan tadi → klik "Setujui" → pastikan status berubah ke "Disetujui".
  - Uji juga skenario **penolakan**: Ajukan sewa lain, lalu tolak sebagai Pengurus. Pastikan status berubah ke "Ditolak".
  - Pastikan stok peralatan berkurang setelah disetujui dan kembali jika ditolak.
- **Test Notifikasi:**
  - Pastikan setiap aksi penting (sewa disetujui, lahan diverifikasi, pembayaran dikonfirmasi) menghasilkan notifikasi.
  - Buka panel notifikasi dan pastikan daftar notifikasi termuat tanpa error.
  - Test tandai notifikasi sebagai sudah dibaca.
- **Test Backup Data:**
  - Buka halaman Backup Data (hanya Admin). Pastikan halaman termuat tanpa crash.
  - Test tombol buat backup baru. Pastikan proses berjalan dan file backup tercatat di daftar.
  - Test tombol download/restore backup jika tersedia.
- **Test Struktur Organisasi:**
  - Buka halaman Struktur Organisasi. Pastikan data organisasi tampil dengan benar.
  - Test fitur tambah/edit anggota organisasi (jika tersedia). Pastikan perubahan tersimpan.
- **Test Landing Page (Halaman Publik):**
  - Akses halaman utama tanpa login (`/`). Pastikan halaman termuat sempurna.
  - Pastikan tombol "Login" dan navigasi ke halaman login berfungsi.
  - Pastikan informasi berita/artikel publik tampil dengan benar di landing page.
- **Test Otorisasi & Akses Role (Role-Based Access Control):**
  - Login sebagai **Petani** → pastikan menu yang muncul di sidebar hanya menu yang relevan (Dashboard, Data Lahan, Sewa Peralatan, Kegiatan, Berita).
  - Login sebagai **Pengurus** → pastikan ada menu tambahan (Verifikasi Lahan, Validasi Sewa).
  - Login sebagai **BPP** → pastikan menu verifikasi dan monitoring tersedia.
  - Login sebagai **Admin** → pastikan semua menu tersedia termasuk Kelola Pengguna, Backup Data, Log Aktivitas.
  - **Test akses ilegal:** Coba akses URL halaman admin (`/kelola-pengguna`, `/backup-data`, `/log-aktivitas`) saat login sebagai Petani. Pastikan ditolak/redirect.
- **Test Validasi Form (Input Validation):**
  - Kirim formulir tanpa mengisi field wajib → pastikan muncul pesan error/validasi.
  - Isi field angka (luas lahan, harga) dengan huruf → pastikan validasi menolak.
  - Isi email dengan format salah pada form pengguna → pastikan validasi bekerja.
  - Test batas karakter (input sangat panjang) → pastikan tidak crash.
  - Test input tanggal selesai lebih awal dari tanggal mulai → pastikan ditolak.
- **Test Responsive UI & Tampilan Mobile:**
  - Resize browser ke ukuran kecil (360x640 mobile). Navigasi semua halaman dan pastikan tidak ada elemen yang tumpang tindih (*overflow*) atau hilang.
  - Pastikan sidebar collapse/hamburger menu berfungsi di tampilan mobile.
  - Pastikan tabel-tabel bisa di-scroll horizontal tanpa merusak layout.
- **Test Error Handling & Edge Cases:**
  - Matikan/blokir koneksi API (mock error) → pastikan muncul pesan error yang ramah pengguna, bukan layar putih/*crash*.
  - Akses halaman yang tidak ada (`/halaman-tidak-ada`) → pastikan ada halaman 404 atau redirect yang benar.
  - Double-click tombol submit → pastikan data tidak terkirim dua kali (*prevent double submission*).
  - Test halaman dengan data kosong (belum ada data) → pastikan muncul tampilan *empty state* yang informatif, bukan error.
- **Test Pagination & Pencarian Data Besar:**
  - Jika ada pagination di tabel (Data Lahan, Riwayat Sewa, Log Aktivitas), test navigasi antar halaman (next/prev/nomor halaman).
  - Test pencarian → ketik query → pastikan hasil terfilter real-time dan pagination ter-reset ke halaman 1.
  - Test reset filter → pastikan data kembali ke tampilan awal.
- **Test Keamanan (Security Testing):**
  - Pastikan token autentikasi (Bearer Token) tersimpan aman di *localStorage/cookie* dan dikirim di setiap request API.
  - Test akses API tanpa token → pastikan respons `401 Unauthorized`.
  - Test logout → pastikan token dihapus dan redirect ke halaman login.
  - Pastikan password tidak pernah ditampilkan di UI atau dikirim kembali dalam response API.

## 4. 🔄 Evaluasi & Ulangi (Loop)
- **Validasi:** Apakah masih ada error? Apakah ada fitur yang tidak bisa ditekan? Apakah alur kerja melanggar aturan di PRD?
- **Repeat:** Jika *IYA* (masih ada error/ketidaksesuaian), **KEMBALI KE LANGKAH 1**. Perbaiki masalah yang baru ditemukan dan lakukan *testing* lagi.
- Jangan berhenti mencoba sampai seluruh skenario pengujian di atas berjalan 100% mulus.

## 5. 📋 Laporan Akhir (Walkthrough)
Jika sistem sudah terverifikasi bersih dari *error*, buatkan sebuah *artifact* `walkthrough.md`.
Laporan ini harus memuat rangkuman perbaikan yang dilakukan dan hasil rekaman tes dari sub-agen browser, lalu beri tahu pengguna bahwa sistem siap digunakan.
