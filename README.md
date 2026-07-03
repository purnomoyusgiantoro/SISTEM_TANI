# 🌱 RuangTani — Sistem Manajemen Kelompok Tani

RuangTani adalah sistem informasi kelompok tani berbasis web yang mengelola data lahan pertanian, sewa peralatan, tagihan pembayaran, kegiatan petani, dan berita penyuluhan.

Sistem ini terbagi menjadi dua bagian utama:
1. **Frontend**: Aplikasi Single Page (SPA) dibangun menggunakan React, Vite, dan Tailwind CSS.
2. **Backend**: RESTful API dibangun menggunakan Laravel 11.

---

## 🛠️ Tech Stack

### Frontend (User Interface)
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend (API & Database)
- **Framework**: Laravel 11
- **Language**: PHP 8.2+
- **Database**: SQLite (Default untuk Development) / MySQL (Bisa dikonfigurasi)
- **Authentication**: Laravel Sanctum (Token-Based)

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

Proyek ini menggunakan _monorepo_ sederhana yang rapi. Frontend berada di folder `frontend/`, sedangkan backend berada di folder `backend/`. Anda perlu menjalankan dua server terminal secara bersamaan.

### 1. Menjalankan Backend (Laravel API)

Buka terminal baru dan jalankan perintah berikut:

```bash
# Masuk ke folder backend
cd backend

# Install dependencies (jika belum)
composer install

# Copy file environment (jika belum ada)
cp .env.example .env

# Generate app key (jika belum)
php artisan key:generate

# Jalankan migrasi dan seed database (jika belum)
# Ini akan mengisi database dengan akun pengguna dan data awal
php artisan migrate:fresh --seed

# Buat symbolic link untuk folder storage (upload file)
php artisan storage:link

# Jalankan server API (akan berjalan di port 8000)
php artisan serve
```
Backend API akan dapat diakses di `http://localhost:8000`.

### 2. Menjalankan Frontend (React)

Buka terminal **baru** (biarkan server backend tetap berjalan), dan jalankan:

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies npm
npm install

# Jalankan development server
npm run dev
```
Aplikasi web akan terbuka otomatis di browser pada alamat `http://localhost:5173`.

---

## 🔑 Akun Login (Data Bawaan/Seeder)

Database backend telah diisi (*seeded*) dengan data awal, termasuk akun-akun untuk berbagai _Role_ (Peran). Anda dapat menggunakan akun berikut untuk login dan menguji sistem:

**Password untuk SEMUA akun di bawah ini adalah:** `password`

| Peran (Role) | Email | Nama Pengguna | Deskripsi Hak Akses |
|---|---|---|---|
| **Petani** | `budi@ruangtani.id` | Budi Santoso | Dapat mengelola lahannya sendiri, mengajukan sewa alat, mencatat kegiatan, dan melihat tagihan. |
| **Petani** | `joko@ruangtani.id` | Joko Widodo | Sama seperti di atas. |
| **Pengurus** | `ahmad@ruangtani.id` | Ahmad Hidayat | Dapat mengelola inventaris peralatan, memvalidasi permohonan sewa, dan memverifikasi bukti pembayaran. |
| **BPP** | `hendra@ruangtani.id` | Ir. Hendra Wijaya | (Balai Penyuluhan Pertanian) Memverifikasi pendaftaran lahan baru dan mempublikasikan berita/penyuluhan. |
| **Admin** | `admin@ruangtani.id` | Superadmin | Dapat menambah/menonaktifkan akun pengguna, melihat Log Sistem, dan mengelola backup database. |

---

## 📁 Struktur Direktori Utama

```
RuangTani/
├── backend/                   # 🚀 Backend Laravel API
│   ├── app/
│   │   ├── Http/Controllers/  # Logika bisnis API
│   │   ├── Models/            # Model Database Eloquent
│   ├── config/                # Konfigurasi sistem dan CORS
│   ├── database/
│   │   ├── migrations/        # Skema tabel database
│   │   └── seeders/           # Data dummy/awal
│   ├── routes/
│   │   └── api.php            # Definisi endpoint (v1)
│   └── storage/               # Tempat penyimpanan file/gambar
│
├── frontend/                  # 🎨 Frontend React SPA
│   ├── src/
│   │   ├── components/        # Komponen UI Reusable (Navbar, Sidebar)
│   │   ├── context/           # React Context (AuthContext)
│   │   ├── data/              # Data statis
│   │   ├── pages/             # Halaman utama aplikasi
│   │   ├── App.jsx            # Router frontend
│   │   └── main.jsx           # Entry point React
│   ├── package.json           # Dependensi NPM Frontend
│   └── vite.config.js         # Konfigurasi Vite
│
├── PRD_Backend_RuangTani.md   # Spesifikasi Backend
├── PRD_Frontend_RuangTani.md  # Spesifikasi Frontend
└── README.md                  # Dokumentasi proyek (File ini)
```

## 📝 Fitur Utama

1. **Dashboard Khusus Peran**: Tampilan dashboard yang berbeda (metrik, tabel) untuk Petani, Pengurus, BPP, dan Admin.
2. **Manajemen Lahan Berjenjang**: Petani mendaftarkan lahan, dan pihak BPP akan melakukan verifikasi agar lahan dianggap sah.
3. **Alur Sewa Peralatan**: 
   - Petani mengajukan sewa (cek stok).
   - Pengurus menyetujui -> sistem otomatis memotong ketersediaan stok & membuat Tagihan.
4. **Pembayaran & Verifikasi**: Petani mengunggah bukti transfer, kemudian divalidasi oleh pengurus.
5. **Jurnal Kegiatan Tani**: Pencatatan riwayat tanam, pupuk, panen, dll.
6. **Backup & Restore Database**: Admin dapat mengelola backup dan restore database.

---
_Dokumen PRD Backend terpisah disimpan di file `PRD_Backend_RuangTani.md`_
_Dokumen PRD Frontend terpisah disimpan di file `PRD_Frontend_RuangTani.md`_
