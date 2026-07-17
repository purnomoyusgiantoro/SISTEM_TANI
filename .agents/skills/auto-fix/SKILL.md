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
**Test Interaksi UNDUHAN :** bnayak tombol tapi tidak bisa di gunakan karena hanay tampilan doang belum berfungsi seprti tanggal dan lainaya lakukan screenshot dan cek apakah itu bisa di klik

## 4. 🔄 Evaluasi & Ulangi (Loop)
- **Validasi:** Apakah masih ada error? Apakah ada fitur yang tidak bisa ditekan? Apakah alur kerja melanggar aturan di PRD?
- **Repeat:** Jika *IYA* (masih ada error/ketidaksesuaian), **KEMBALI KE LANGKAH 1**. Perbaiki masalah yang baru ditemukan dan lakukan *testing* lagi.
- Jangan berhenti mencoba sampai seluruh skenario pengujian di atas berjalan 100% mulus.

## 5. 📋 Laporan Akhir (Walkthrough)
Jika sistem sudah terverifikasi bersih dari *error*, buatkan sebuah *artifact* `walkthrough.md`.
Laporan ini harus memuat rangkuman perbaikan yang dilakukan dan hasil rekaman tes dari sub-agen browser, lalu beri tahu pengguna bahwa sistem siap digunakan.
