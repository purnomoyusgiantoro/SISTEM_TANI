# 🌱 RuangTani — Sistem Manajemen Kelompok Tani

RuangTani adalah sistem informasi kelompok tani berbasis web yang mengelola data lahan pertanian, sewa peralatan, tagihan pembayaran, kegiatan petani, dan berita penyuluhan.

Sistem ini terbagi menjadi dua bagian utama:
1. **Frontend**: Aplikasi Single Page (SPA) dibangun menggunakan React 19 dan Vite 8.
2. **Backend**: RESTful API dibangun menggunakan Laravel 11.

---

## 🛠️ Tech Stack

### Frontend (User Interface)
- **Framework**: React 19
- **Build Tool**: Vite 8
- **Styling**: Vanilla CSS (Custom Design System)
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **HTTP Client**: Fetch API (via custom API client)

### Backend (API & Database)
- **Framework**: Laravel 11
- **Language**: PHP 8.2+
- **Database**: SQLite (Default untuk Development) / MySQL 8.0+ (Production)
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
├── backend/                        # 🚀 Backend Laravel API
│   ├── app/
│   │   ├── Http/Controllers/       # Logika bisnis API
│   │   └── Models/                 # Model Database Eloquent
│   ├── config/                     # Konfigurasi sistem dan CORS
│   ├── database/
│   │   ├── migrations/             # Skema tabel database
│   │   └── seeders/                # Data dummy/awal
│   ├── routes/
│   │   └── api.php                 # Definisi endpoint (v1)
│   └── storage/                    # Tempat penyimpanan file/gambar
│
├── frontend/                       # 🎨 Frontend React SPA
│   ├── src/
│   │   ├── api/                    # API client & endpoint modules
│   │   │   ├── client.js           # Fetch instance + interceptors
│   │   │   ├── auth.js             # Auth API (login, logout, me)
│   │   │   ├── lahan.js            # Lahan API
│   │   │   ├── peralatan.js        # Peralatan API
│   │   │   ├── sewa.js             # Sewa API
│   │   │   ├── tagihan.js          # Tagihan API
│   │   │   ├── kegiatan.js         # Kegiatan API
│   │   │   ├── berita.js           # Berita API
│   │   │   ├── organisasi.js       # Organisasi API
│   │   │   ├── users.js            # Users API (admin)
│   │   │   ├── notifikasi.js       # Notifikasi API
│   │   │   ├── log.js              # Log Aktivitas API
│   │   │   ├── backup.js           # Backup API
│   │   │   ├── dashboard.js        # Dashboard stats API
│   │   │   └── master.js           # Master data API
│   │   │
│   │   ├── components/             # Komponen UI Reusable
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx      # Main layout (Sidebar + Header + Content)
│   │   │   │   ├── Sidebar.jsx     # Menu navigasi samping
│   │   │   │   └── Header.jsx      # Header bar (judul, notifikasi, profil)
│   │   │   └── shared/
│   │   │       ├── Modal.jsx       # Reusable modal dialog
│   │   │       ├── DataTable.jsx   # Reusable data table
│   │   │       ├── Pagination.jsx  # Komponen paginasi
│   │   │       ├── SearchBar.jsx   # Input pencarian
│   │   │       ├── FilterDropdown.jsx # Dropdown filter
│   │   │       ├── StatusBadge.jsx # Badge status (pending, aktif, dll.)
│   │   │       ├── LoadingSpinner.jsx # Loading indicator
│   │   │       ├── EmptyState.jsx  # Tampilan data kosong
│   │   │       ├── StatCard.jsx    # Kartu statistik dashboard
│   │   │       ├── FileUpload.jsx  # Komponen upload file
│   │   │       └── ConfirmDialog.jsx # Dialog konfirmasi
│   │   │
│   │   ├── context/                # React Context (State Global)
│   │   │   ├── AuthContext.jsx     # Auth state + token management
│   │   │   ├── ToastContext.jsx    # Toast notification state
│   │   │   └── NotificationContext.jsx # Notifikasi state
│   │   │
│   │   ├── hooks/                  # Custom React Hooks
│   │   │   ├── useApi.js           # Generic API hook (loading, error, data)
│   │   │   ├── useAuth.js          # Auth hook wrapper
│   │   │   └── usePagination.js    # Paginasi hook
│   │   │
│   │   ├── data/                   # Data statis
│   │   │   └── mockData.js         # Mock data untuk development
│   │   │
│   │   ├── utils/                  # Utility functions
│   │   │   ├── constants.js        # Konstanta aplikasi
│   │   │   ├── formatters.js       # Format tanggal, mata uang, dll.
│   │   │   └── validators.js       # Validasi form
│   │   │
│   │   ├── pages/                  # Halaman utama aplikasi
│   │   │   ├── LandingPage.jsx     # Halaman landing publik
│   │   │   ├── Login.jsx           # Halaman login
│   │   │   ├── Dashboard.jsx       # Dashboard (multi-role)
│   │   │   ├── DataLahan.jsx       # Manajemen data lahan
│   │   │   ├── SewaPeralatan.jsx   # Sewa peralatan pertanian
│   │   │   ├── Pembayaran.jsx      # Pembayaran & tagihan
│   │   │   ├── Kegiatan.jsx        # Catatan kegiatan lapangan
│   │   │   ├── StrukturOrganisasi.jsx # Struktur organisasi
│   │   │   ├── Berita.jsx          # Berita pertanian
│   │   │   ├── VerifikasiLahan.jsx # Verifikasi lahan (BPP)
│   │   │   ├── KelolaBerita.jsx    # Kelola berita (BPP)
│   │   │   ├── AnalisisData.jsx    # Analisis data (BPP)
│   │   │   ├── KelolaPengguna.jsx  # Kelola pengguna (Admin)
│   │   │   ├── LogAktivitas.jsx    # Log aktivitas (Admin)
│   │   │   └── BackupData.jsx      # Backup data (Admin)
│   │   │
│   │   ├── App.jsx                 # Router & layout utama
│   │   ├── App.css                 # Vite default styles
│   │   ├── index.css               # Design system & global CSS
│   │   └── main.jsx                # Entry point React
│   │
│   ├── package.json                # Dependensi NPM Frontend
│   └── vite.config.js              # Konfigurasi Vite
│
├── PRD_Backend_RuangTani.md        # Spesifikasi Backend & Database
├── PRD_Frontend_RuangTani.md       # Spesifikasi Frontend & UI
└── README.md                       # Dokumentasi proyek (File ini)
```

---

## 📝 Fitur Utama

1. **Dashboard Khusus Peran**: Tampilan dashboard yang berbeda (metrik, tabel) untuk Petani, Pengurus, BPP, dan Admin.
2. **Manajemen Lahan Berjenjang**: Petani mendaftarkan lahan, dan pihak BPP akan melakukan verifikasi agar lahan dianggap sah.
3. **Alur Sewa Peralatan**: 
   - Petani mengajukan sewa (cek stok).
   - Pengurus menyetujui → sistem otomatis memotong ketersediaan stok & membuat Tagihan.
4. **Pembayaran & Verifikasi**: Petani mengunggah bukti transfer, kemudian divalidasi oleh pengurus.
5. **Jurnal Kegiatan Tani**: Pencatatan riwayat tanam, pupuk, panen, dll.
6. **Berita & Penyuluhan**: BPP mempublikasikan berita dan informasi pertanian.
7. **Backup & Restore Database**: Admin dapat mengelola backup dan restore database.

---

## 🔗 Link Dokumen Terkait

- Spesifikasi Backend & Database → [`PRD_Backend_RuangTani.md`](./PRD_Backend_RuangTani.md)
- Spesifikasi Frontend & UI → [`PRD_Frontend_RuangTani.md`](./PRD_Frontend_RuangTani.md)
