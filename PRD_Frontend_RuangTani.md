# 📋 PRD — Frontend RuangTani
## Sistem Manajemen Kelompok Tani — Antarmuka Pengguna
### React + Vite Single Page Application

---

| Informasi | Detail |
|---|---|
| **Nama Proyek** | RuangTani (Sistem Manajemen Tani) |
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 3 Juli 2026 |
| **Teknologi Frontend** | React 19 + Vite 8 |
| **Styling** | Vanilla CSS (Custom Design System) |
| **Routing** | React Router DOM v7 |
| **Icons** | Lucide React |
| **Backend API** | Laravel 11 REST API (`http://localhost:8000/api/v1`) |
| **Autentikasi** | Bearer Token (Laravel Sanctum) |

---

## 1. Ringkasan Proyek

Frontend RuangTani adalah aplikasi **Single Page Application (SPA)** yang menjadi antarmuka utama bagi pengguna sistem. Aplikasi ini telah terintegrasi sepenuhnya dengan Backend API (Laravel) untuk seluruh operasi data, menggantikan penggunaan mock data statis.

### 1.1. Tujuan Frontend
- Menyediakan antarmuka yang responsif dan modern untuk semua peran pengguna
- Terhubung secara penuh dengan Backend API untuk manajemen state dan data persisten
- Implementasi autentikasi token-based (Sanctum) untuk login/logout
- Mendukung multi-role dashboard dengan tampilan yang sesuai untuk setiap peran
- Menangani file upload (bukti pembayaran, foto kegiatan, gambar peralatan)
- Notifikasi real-time dan state management global

### 1.2. Pengguna Sistem (Roles)

| Role | Deskripsi | Halaman yang Dapat Diakses |
|---|---|---|
| **Petani** | Anggota kelompok tani | Dashboard, Data Lahan, Sewa Peralatan, Pembayaran, Kegiatan, Struktur Organisasi, Berita |
| **Pengurus** | Pengurus kelompok tani | Dashboard, Data Lahan, Sewa Peralatan, Pembayaran, Kegiatan, Struktur Organisasi, Berita |
| **BPP** | Balai Penyuluhan Pertanian | Dashboard, Data Lahan, Verifikasi Lahan, Kelola Berita, Analisis Data, Struktur Organisasi |
| **Admin** | Superadmin sistem | Dashboard, Kelola Pengguna, Log Aktivitas, Backup Data |

---

## 2. Arsitektur Frontend

### 2.1. Struktur Folder

```
src/
├── api/                          # [NEW] API client & endpoint modules
│   ├── client.js                 # Axios/fetch instance + interceptors
│   ├── auth.js                   # Auth API (login, logout, me)
│   ├── lahan.js                  # Lahan API
│   ├── peralatan.js              # Peralatan API
│   ├── sewa.js                   # Sewa API
│   ├── tagihan.js                # Tagihan API
│   ├── kegiatan.js               # Kegiatan API
│   ├── berita.js                 # Berita API
│   ├── organisasi.js             # Organisasi API
│   ├── users.js                  # Users API (admin)
│   ├── notifikasi.js             # Notifikasi API
│   ├── log.js                    # Log Aktivitas API
│   ├── backup.js                 # Backup API
│   ├── dashboard.js              # Dashboard stats API
│   └── master.js                 # Master data API
│
├── components/                   # Komponen UI Reusable
│   ├── layout/
│   │   ├── Layout.jsx            # Main layout (Sidebar + Navbar + Content)
│   │   ├── Sidebar.jsx           # Menu navigasi samping
│   │   └── Navbar.jsx            # Header bar (nama user, notifikasi)
│   ├── shared/
│   │   ├── Modal.jsx             # Reusable modal dialog
│   │   ├── Table.jsx             # Reusable data table
│   │   ├── Pagination.jsx        # Komponen paginasi
│   │   ├── SearchBar.jsx         # Input pencarian
│   │   ├── FilterDropdown.jsx    # Dropdown filter
│   │   ├── StatusBadge.jsx       # Badge status (pending, aktif, etc.)
│   │   ├── LoadingSpinner.jsx    # Loading indicator
│   │   ├── EmptyState.jsx        # Tampilan data kosong
│   │   └── Toast.jsx             # [NEW] Notifikasi toast
│   ├── dashboard/                # Widget dashboard per role
│   ├── lahan/                    # Komponen terkait lahan
│   ├── sewa/                     # Komponen terkait sewa
│   ├── pembayaran/               # Komponen terkait pembayaran
│   ├── kegiatan/                 # Komponen terkait kegiatan
│   ├── berita/                   # Komponen terkait berita
│   ├── organisasi/               # Komponen tree organisasi
│   └── admin/                    # Komponen admin (users, logs)
│
├── context/
│   ├── AuthContext.jsx           # [MODIFY] Auth state + token management
│   └── NotificationContext.jsx   # [NEW] Global notification state
│
├── hooks/                        # [NEW] Custom React hooks
│   ├── useApi.js                 # Generic API hook (loading, error, data)
│   ├── useAuth.js                # Auth hook wrapper
│   └── usePagination.js          # Paginasi hook
│
├── pages/                        # Halaman utama
│   ├── LandingPage.jsx           # Halaman landing publik
│   ├── Login.jsx                 # Halaman Autentikasi
│   ├── Dashboard.jsx             # Beranda & Statistik
│   ├── DataLahan.jsx             # Manajemen Data Lahan
│   ├── SewaPeralatan.jsx         # Manajemen Sewa
│   ├── Pembayaran.jsx            # Tagihan & Verifikasi Pembayaran
│   ├── Kegiatan.jsx              # Catatan Kegiatan
│   ├── StrukturOrganisasi.jsx    # Chart Organisasi
│   ├── Berita.jsx                # Feed Berita Publik
│   ├── VerifikasiLahan.jsx       # BPP Verifikasi Lahan
│   ├── KelolaBerita.jsx          # CRUD Berita
│   ├── AnalisisData.jsx          # Report & Analitik
│   ├── KelolaPengguna.jsx        # Admin User Management
│   ├── LogAktivitas.jsx          # Admin Logs
│   └── BackupData.jsx            # Admin Backup System
│
├── utils/                        # [NEW] Utility functions
│   ├── formatters.js             # Format tanggal, rupiah, dll.
│   ├── validators.js             # Validasi input client-side
│   └── constants.js              # Konstanta (roles, status, etc.)
│
├── App.jsx                       # Router utama
├── App.css                       # Styles aplikasi
├── index.css                     # Global styles & design system
└── main.jsx                      # Entry point React
```

### 2.2. Tech Stack Detail

| Teknologi | Versi | Fungsi |
|---|---|---|
| React | 19.x | UI Library |
| Vite | 8.x | Build tool & dev server |
| React Router DOM | 7.x | Client-side routing |
| Lucide React | 1.x | Icon library |
| Vanilla CSS | - | Styling (design system custom) |

> [!NOTE]
> Proyek ini **tidak menggunakan Tailwind CSS** meskipun disebutkan di README lama. Styling menggunakan **Vanilla CSS** dengan design system custom di `index.css`.

---

## 3. Integrasi API Backend

### 3.1. API Client (`src/api/client.js`)

Buat API client sebagai wrapper `fetch()` dengan konfigurasi:

```javascript
// Base URL
const API_BASE = 'http://localhost:8000/api/v1';

// Headers
{
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Authorization': `Bearer ${token}`  // Dari localStorage
}
```

**Fitur yang harus diimplementasi:**
- Auto-inject Authorization header dari token tersimpan
- Global error handler (401 → auto logout, 422 → tampilkan validasi error)
- Response interceptor (extract `data` dari envelope `{ status, data, meta }`)
- Request/response logging di development mode
- File upload support (multipart/form-data)

### 3.2. Mapping Halaman ↔ API Endpoint

| Halaman | Method | API Endpoint | Keterangan |
|---|---|---|---|
| **Login** | POST | `/auth/login` | Email + password → token |
| **Login** | POST | `/auth/logout` | Hapus token |
| **Dashboard** | GET | `/dashboard/stats` | Stats per role |
| **Data Lahan** | GET | `/lahan` | List + filter + paginasi |
| **Data Lahan** | POST | `/lahan` | Tambah lahan baru |
| **Data Lahan** | PUT | `/lahan/{id}` | Edit lahan |
| **Data Lahan** | DELETE | `/lahan/{id}` | Hapus lahan (pengurus) |
| **Verifikasi Lahan** | GET | `/verifikasi-lahan` | List pending (BPP) |
| **Verifikasi Lahan** | PUT | `/verifikasi-lahan/{id}/terima` | Verifikasi terima |
| **Verifikasi Lahan** | PUT | `/verifikasi-lahan/{id}/tolak` | Verifikasi tolak |
| **Sewa Peralatan** | GET | `/peralatan` | Katalog peralatan |
| **Sewa Peralatan** | GET | `/sewa` | List sewa |
| **Sewa Peralatan** | POST | `/sewa` | Ajukan sewa baru |
| **Sewa Peralatan** | PUT | `/sewa/{id}/setujui` | Setujui sewa (pengurus) |
| **Sewa Peralatan** | PUT | `/sewa/{id}/tolak` | Tolak sewa (pengurus) |
| **Pembayaran** | GET | `/tagihan` | List tagihan |
| **Pembayaran** | POST | `/tagihan/{id}/upload-bukti` | Upload bukti bayar |
| **Pembayaran** | PUT | `/tagihan/{id}/verifikasi` | Verifikasi pembayaran |
| **Kegiatan** | GET | `/kegiatan` | List kegiatan |
| **Kegiatan** | POST | `/kegiatan` | Tambah kegiatan |
| **Kegiatan** | PUT | `/kegiatan/{id}` | Edit kegiatan |
| **Kegiatan** | DELETE | `/kegiatan/{id}` | Hapus kegiatan |
| **Berita** | GET | `/berita` | List berita |
| **Kelola Berita** | POST | `/berita` | Buat berita (BPP) |
| **Kelola Berita** | PUT | `/berita/{id}` | Edit berita |
| **Kelola Berita** | DELETE | `/berita/{id}` | Hapus berita |
| **Kelola Berita** | PUT | `/berita/{id}/publish` | Toggle publish |
| **Struktur Organisasi** | GET | `/organisasi` | Tree data |
| **Kelola Pengguna** | GET | `/users` | List users (admin) |
| **Kelola Pengguna** | POST | `/users` | Tambah user |
| **Kelola Pengguna** | PUT | `/users/{id}` | Edit user |
| **Kelola Pengguna** | PUT | `/users/{id}/toggle-status` | Toggle aktif/nonaktif |
| **Log Aktivitas** | GET | `/log-aktivitas` | List log (admin) |
| **Log Aktivitas** | GET | `/log-aktivitas/export` | Ekspor CSV |
| **Backup Data** | GET | `/backups` | List backup (admin) |
| **Backup Data** | POST | `/backups` | Buat backup |
| **Backup Data** | POST | `/backups/{id}/restore` | Restore |
| **Backup Data** | DELETE | `/backups/{id}` | Hapus backup |
| **Notifikasi** | GET | `/notifikasi` | List notifikasi |
| **Notifikasi** | GET | `/notifikasi/unread-count` | Count belum baca |
| **Notifikasi** | PUT | `/notifikasi/{id}/read` | Tandai dibaca |
| **Master Data** | GET | `/master/wilayah` | Daftar kecamatan |
| **Master Data** | GET | `/master/jenis-lahan` | Enum jenis lahan |
| **Master Data** | GET | `/master/kategori-peralatan` | Enum kategori alat |
| **Master Data** | GET | `/master/jenis-kegiatan` | Enum jenis kegiatan |

---

## 4. Spesifikasi Halaman

### 4.1. Landing Page (`/`)

**Tujuan**: Halaman publik pertama yang dilihat pengunjung.

**Komponen UI:**
- Hero section dengan tagline RuangTani
- Fitur highlights (4 card: Kelola Lahan, Sewa Peralatan, Pembayaran, Berita)
- Statistik umum (opsional, dari API publik)
- CTA (Call to Action) button → `/login`
- Footer dengan info kontak

**Data**: Statis (tidak perlu API)

---

### 4.2. Login (`/login`)

**Tujuan**: Autentikasi pengguna.

**Komponen UI:**
- Form login: Email + Password
- Error message display
- Quick-login buttons per role (untuk demo/development)
- Link ke landing page

**Integrasi API:**
```
POST /api/v1/auth/login
Body: { email, password }
Response: { user, token, token_type }
```

**Flow:**
1. User submit email & password
2. Call API login
3. Simpan `token` di `localStorage`
4. Simpan `user` di AuthContext state
5. Redirect ke `/dashboard`

**Error Handling:**
- 422: "Email atau password salah"
- 403: "Akun Anda dinonaktifkan"
- Network error: "Tidak dapat terhubung ke server"

---

### 4.3. Dashboard (`/dashboard`)

**Tujuan**: Tampilkan ringkasan data sesuai role.

**Integrasi API:**
```
GET /api/v1/dashboard/stats
Response: { ...stats sesuai role }
```

**UI per Role:**

#### Dashboard Petani
| Widget | Data |
|---|---|
| Stat Card: Total Lahan | `total_lahan` |
| Stat Card: Luas Total | `luas_total` |
| Stat Card: Sewa Aktif | `sewa_aktif` |
| Stat Card: Tagihan Belum Bayar | `tagihan_belum_bayar` |
| Tabel: Lahan Terbaru | `lahan_terbaru` |
| Tabel: Sewa Terbaru | `sewa_terbaru` |

#### Dashboard Pengurus
| Widget | Data |
|---|---|
| Stat Card: Total Lahan | `total_lahan` |
| Stat Card: Total Petani | `total_petani` |
| Stat Card: Peralatan Tersedia | `peralatan_tersedia` |
| Stat Card: Sewa Menunggu | `sewa_menunggu` |
| Stat Card: Total Pendapatan | `total_pendapatan` (format Rupiah) |
| Tabel: Pending Sewa | `pending_sewa` + action buttons |

#### Dashboard BPP
| Widget | Data |
|---|---|
| Stat Card: Lahan Terverifikasi | `lahan_terverifikasi` |
| Stat Card: Pending Verifikasi | `pending_verifikasi` |
| Stat Card: Ditolak | `ditolak` |
| Stat Card: Total Berita | `total_berita` |
| Tabel: Antrean Verifikasi | `antrean_verifikasi` + action buttons |

#### Dashboard Admin
| Widget | Data |
|---|---|
| Stat Card: Total Pengguna | `total_pengguna` |
| Stat Card: Pengguna Aktif | `pengguna_aktif` |
| Stat Card: Backup Terakhir | `backup_terakhir` |
| Stat Card: Uptime | `uptime` |
| Tabel: Log Terbaru | `log_terbaru` |

---

### 4.4. Data Lahan (`/data-lahan`)

**Roles**: Petani, Pengurus, BPP

**Fitur:**
- Tabel data lahan dengan paginasi
- Filter: wilayah, jenis lahan, status verifikasi
- Search by keyword
- Modal tambah lahan baru (Petani/Pengurus)
- Modal edit lahan (Petani: miliknya, Pengurus: semua)
- Hapus lahan (Pengurus only)
- Badge status verifikasi (pending/terverifikasi/ditolak)

**API Calls:**
- `GET /lahan` — dengan query params filter
- `POST /lahan` — tambah baru
- `PUT /lahan/{id}` — edit
- `DELETE /lahan/{id}` — hapus

**Form Fields (Tambah/Edit):**
| Field | Type | Required | Sumber Enum |
|---|---|---|---|
| Lokasi | Text input | ✅ | - |
| Luas (Ha) | Number input | ✅ | - |
| Jenis Lahan | Select | ✅ | `GET /master/jenis-lahan` |
| Koordinat | Text input | ❌ | - |
| Catatan | Textarea | ❌ | - |

---

### 4.5. Verifikasi Lahan (`/verifikasi-lahan`)

**Roles**: BPP only

**Fitur:**
- Tabel lahan pending verifikasi
- Detail card per lahan (lokasi, luas, jenis, pemilik, tanggal daftar)
- Tombol "Verifikasi (Terima)" → hijau
- Tombol "Tolak" → merah, muncul modal input alasan
- Riwayat verifikasi yang sudah dilakukan

**API Calls:**
- `GET /verifikasi-lahan` — list pending
- `PUT /verifikasi-lahan/{id}/terima` — terima
- `PUT /verifikasi-lahan/{id}/tolak` — tolak (body: `{ alasan }`)

---

### 4.6. Sewa Peralatan (`/sewa-peralatan`)

**Roles**: Petani, Pengurus

**Fitur:**
- **Tab 1: Katalog Peralatan** — grid/card peralatan tersedia
  - Filter kategori
  - Search nama peralatan
  - Card: nama, gambar, harga/hari, stok tersedia, kondisi
  - Button "Ajukan Sewa" (Petani only, jika tersedia > 0)
- **Tab 2: Riwayat Sewa** — tabel sewa
  - Petani: hanya miliknya
  - Pengurus: semua sewa
  - Badge status (menunggu/aktif/selesai/dibatalkan)
  - Badge validasi (pending/disetujui/ditolak)
  - Pengurus: tombol Setujui/Tolak untuk sewa pending

**API Calls:**
- `GET /peralatan` — katalog + filter
- `GET /sewa` — list sewa
- `POST /sewa` — ajukan sewa baru
- `PUT /sewa/{id}/setujui` — setujui (pengurus)
- `PUT /sewa/{id}/tolak` — tolak (pengurus)

**Modal Ajukan Sewa:**
| Field | Type | Required |
|---|---|---|
| Peralatan | Pre-selected dari katalog | ✅ |
| Tanggal Mulai | Date picker | ✅ |
| Tanggal Selesai | Date picker | ✅ |
| Catatan | Textarea | ❌ |
| Preview: Durasi | Computed | Auto |
| Preview: Total Biaya | Computed | Auto |

---

### 4.7. Pembayaran (`/pembayaran`)

**Roles**: Petani, Pengurus

**Fitur:**
- Tabel tagihan dengan filter status
- Petani: hanya miliknya
- Pengurus: semua tagihan
- Badge status (belum_bayar/menunggu_verifikasi/lunas)
- **Petani**: tombol "Upload Bukti" (hanya untuk status `belum_bayar`)
- **Pengurus**: tombol "Verifikasi" (hanya untuk status `menunggu_verifikasi`)
- Detail tagihan: kode tagihan, nama peralatan, jumlah, jatuh tempo

**API Calls:**
- `GET /tagihan` — list + filter
- `POST /tagihan/{id}/upload-bukti` — upload bukti (multipart/form-data)
- `PUT /tagihan/{id}/verifikasi` — verifikasi (body: `{ aksi: 'setujui'|'tolak' }`)

**Modal Upload Bukti:**
| Field | Type | Required |
|---|---|---|
| File Bukti | File upload (jpg/png/pdf, max 5MB) | ✅ |
| Jumlah Dibayar | Number input | ✅ |
| Tanggal Bayar | Date picker | ✅ |
| Catatan | Textarea | ❌ |

---

### 4.8. Kegiatan Pertanian (`/kegiatan`)

**Roles**: Petani, Pengurus

**Fitur:**
- Tabel kegiatan + filter (jenis, lahan, range tanggal)
- Petani: hanya miliknya, bisa CRUD
- Pengurus: lihat semua, read-only
- Modal tambah kegiatan baru (Petani)
- Edit/hapus kegiatan (Petani, miliknya saja)

**API Calls:**
- `GET /kegiatan` — list + filter
- `POST /kegiatan` — tambah (multipart/form-data untuk foto)
- `PUT /kegiatan/{id}` — edit
- `DELETE /kegiatan/{id}` — hapus

**Form Fields:**
| Field | Type | Required | Sumber |
|---|---|---|---|
| Lahan | Select | ✅ | Lahan milik petani (`GET /lahan`) |
| Jenis Kegiatan | Select | ✅ | `GET /master/jenis-kegiatan` |
| Tanggal | Date picker | ✅ | - |
| Deskripsi | Textarea | ✅ | - |
| Foto | File upload | ❌ | jpg/png, max 5MB |

---

### 4.9. Berita & Penyuluhan (`/berita`)

**Roles**: Petani, Pengurus (read-only)

**Fitur:**
- Grid card berita (hanya yang `published`)
- Filter kategori
- Detail berita (judul, isi, penulis, tanggal, gambar)

**API Calls:**
- `GET /berita` — list published
- `GET /berita/{id}` — detail

---

### 4.10. Kelola Berita (`/kelola-berita`)

**Roles**: BPP only

**Fitur:**
- Tabel semua berita (draft + published)
- Badge status (draft/published)
- Tambah berita baru (form: judul, kategori, isi, gambar, status)
- Edit berita
- Hapus berita
- Toggle publish/draft

**API Calls:**
- `GET /berita` — list semua (BPP sees all)
- `POST /berita` — buat baru
- `PUT /berita/{id}` — edit
- `DELETE /berita/{id}` — hapus
- `PUT /berita/{id}/publish` — toggle publish

---

### 4.11. Analisis Data (`/analisis-data`)

**Roles**: BPP only

**Fitur:**
- Chart: distribusi jenis lahan (pie/donut)
- Chart: status verifikasi lahan (bar)
- Chart: tren kegiatan pertanian per bulan (line)
- Summary cards (total lahan, luas total, petani aktif)
- Export data ke CSV

**Data Source:** Agregasi dari beberapa endpoint:
- `GET /lahan` — agregasi jenis & status
- `GET /kegiatan` — agregasi per bulan
- `GET /dashboard/stats` — summary

---

### 4.12. Struktur Organisasi (`/struktur-organisasi`)

**Roles**: Petani, Pengurus, BPP

**Fitur:**
- Tree view hierarki organisasi
- Card per anggota (nama, jabatan)
- Pengurus: CRUD anggota organisasi

**API Calls:**
- `GET /organisasi` — tree data
- `POST /organisasi` — tambah (pengurus)
- `PUT /organisasi/{id}` — edit (pengurus)
- `DELETE /organisasi/{id}` — hapus (pengurus)

---

### 4.13. Kelola Pengguna (`/kelola-pengguna`)

**Roles**: Admin only

**Fitur:**
- Tabel pengguna dengan filter role & search
- Tambah pengguna baru
- Edit data pengguna
- Toggle status aktif/nonaktif
- Hapus pengguna

**API Calls:**
- `GET /users` — list + filter
- `POST /users` — tambah
- `PUT /users/{id}` — edit
- `PUT /users/{id}/toggle-status` — toggle
- `DELETE /users/{id}` — hapus

---

### 4.14. Log Aktivitas (`/log-aktivitas`)

**Roles**: Admin only

**Fitur:**
- Tabel log dengan paginasi
- Filter: level (info/success/warning/error)
- Search keyword (user, aksi, detail)
- Filter range tanggal
- Badge level dengan warna berbeda
- Ekspor ke CSV

**API Calls:**
- `GET /log-aktivitas` — list + filter
- `GET /log-aktivitas/export` — data untuk CSV

---

### 4.15. Backup Data (`/backup-data`)

**Roles**: Admin only

**Fitur:**
- Tabel riwayat backup
- Tombol "Backup Sekarang"
- Restore dari backup tertentu
- Hapus file backup lama
- Konfigurasi jadwal backup otomatis

**API Calls:**
- `GET /backups` — list riwayat
- `POST /backups` — jalankan backup manual
- `POST /backups/{id}/restore` — restore
- `DELETE /backups/{id}` — hapus
- `GET /backups/schedule` — lihat jadwal
- `PUT /backups/schedule` — update jadwal

---

## 5. State Management

### 5.1. AuthContext (Global)

State yang disimpan:
```javascript
{
  currentUser: {
    id: number,
    nama: string,
    email: string,
    role: 'petani' | 'pengurus' | 'bpp' | 'admin',
    avatar: string | null,
    status: 'aktif' | 'nonaktif'
  },
  token: string | null,      // Bearer token dari Sanctum
  isAuthenticated: boolean,
  isLoading: boolean          // Untuk cek token saat app load
}
```

**Fungsi yang disediakan:**
- `login(email, password)` → API call + simpan token
- `logout()` → API call + hapus token + redirect
- `refreshUser()` → `GET /auth/me` → update state
- `hasPermission(permission)` → cek role-based permission

**Persistensi:**
- Token disimpan di `localStorage` key `ruangtani_token`
- User data disimpan di `localStorage` key `ruangtani_user`
- Saat app load, cek token → validasi via `GET /auth/me`
- Jika token invalid (401) → auto logout

### 5.2. NotificationContext (Global)

State yang disimpan:
```javascript
{
  notifications: Array,
  unreadCount: number
}
```

**Polling**: Setiap 60 detik, call `GET /notifikasi/unread-count`

---

## 6. Komponen Shared (Reusable)

### 6.1. Layout Components

| Komponen | Props | Deskripsi |
|---|---|---|
| `Layout` | `children` | Wrapper: Sidebar + Navbar + Content area |
| `Sidebar` | - | Menu navigasi berdasarkan role user |
| `Navbar` | - | Header: nama user, avatar, notifikasi bell, logout |

### 6.2. Data Display

| Komponen | Props | Deskripsi |
|---|---|---|
| `DataTable` | `columns, data, loading, onSort` | Tabel data dengan sorting |
| `Pagination` | `currentPage, totalPages, onPageChange` | Navigasi halaman |
| `StatusBadge` | `status, type` | Badge warna sesuai status |
| `StatCard` | `title, value, icon, color, trend` | Card statistik dashboard |
| `EmptyState` | `title, description, icon` | Tampilan saat data kosong |

### 6.3. Form Components

| Komponen | Props | Deskripsi |
|---|---|---|
| `Modal` | `isOpen, onClose, title, children` | Dialog modal |
| `SearchBar` | `placeholder, value, onChange` | Input pencarian dengan debounce |
| `FilterDropdown` | `options, value, onChange, label` | Dropdown filter |
| `FileUpload` | `accept, maxSize, onChange` | Upload file dengan preview |
| `DatePicker` | `value, onChange, min, max` | Input tanggal |

### 6.4. Feedback Components

| Komponen | Props | Deskripsi |
|---|---|---|
| `LoadingSpinner` | `size, message` | Spinner saat loading |
| `Toast` | `type, message, duration` | Toast notification |
| `ConfirmDialog` | `title, message, onConfirm, onCancel` | Konfirmasi sebelum aksi destructive |

---

## 7. Design System

### 7.1. Color Palette

| Nama | Hex | Penggunaan |
|---|---|---|
| Primary | `#16a34a` | Brand color (hijau pertanian) |
| Primary Dark | `#15803d` | Hover states |
| Primary Light | `#dcfce7` | Background highlights |
| Secondary | `#0ea5e9` | Info, links |
| Success | `#10b981` | Status sukses, terverifikasi, lunas |
| Warning | `#f59e0b` | Pending, menunggu |
| Danger | `#ef4444` | Error, ditolak, hapus |
| Neutral 50 | `#fafafa` | Background halaman |
| Neutral 100 | `#f5f5f5` | Card background |
| Neutral 200 | `#e5e5e5` | Border |
| Neutral 700 | `#404040` | Body text |
| Neutral 900 | `#171717` | Heading text |

### 7.2. Typography

| Elemen | Font | Size | Weight |
|---|---|---|---|
| Heading 1 | Inter / system-ui | 28px | 700 (Bold) |
| Heading 2 | Inter / system-ui | 22px | 600 (Semibold) |
| Heading 3 | Inter / system-ui | 18px | 600 |
| Body | Inter / system-ui | 14px | 400 |
| Small / Caption | Inter / system-ui | 12px | 400 |
| Badge | Inter / system-ui | 11px | 600 |

### 7.3. Spacing System

Base unit: `4px`

| Token | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |

### 7.4. Border Radius

| Token | Value | Penggunaan |
|---|---|---|
| `--radius-sm` | 4px | Badges, small buttons |
| `--radius-md` | 8px | Cards, inputs |
| `--radius-lg` | 12px | Modals, large cards |
| `--radius-full` | 9999px | Avatar, pills |

### 7.5. Shadows

| Token | Value | Penggunaan |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle cards |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` | Cards, dropdowns |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals |

---

## 8. Responsive Design

### 8.1. Breakpoints

| Breakpoint | Min Width | Deskripsi |
|---|---|---|
| Mobile | 0px | Sidebar hidden, single column |
| Tablet | 768px | Sidebar collapsible, 2 columns |
| Desktop | 1024px | Sidebar visible, full layout |
| Wide | 1280px | Max content width |

### 8.2. Layout Behavior

- **Mobile** (< 768px):
  - Sidebar: overlay/drawer (toggle via hamburger menu)
  - Dashboard stats: 2 cards per row
  - Tables: horizontal scroll
  - Modals: full-width

- **Tablet** (768px - 1023px):
  - Sidebar: collapsible (icon-only mode)
  - Dashboard stats: 2-3 cards per row
  - Tables: responsive columns

- **Desktop** (≥ 1024px):
  - Sidebar: always visible (240px width)
  - Dashboard stats: 4 cards per row
  - Full table columns

---

## 9. Error Handling & UX

### 9.1. API Error States

| HTTP Status | Aksi Frontend |
|---|---|
| 200-201 | Sukses → tampilkan toast success |
| 401 | Unauthorized → auto logout + redirect `/login` |
| 403 | Forbidden → tampilkan toast error "Akses ditolak" |
| 404 | Not Found → tampilkan empty state |
| 422 | Validation → tampilkan per-field error messages |
| 500 | Server Error → tampilkan toast "Terjadi kesalahan server" |
| Network Error | Tampilkan toast "Tidak dapat terhubung ke server" |

### 9.2. Loading States

Setiap halaman memiliki 3 state:
1. **Loading**: Tampilkan skeleton/spinner
2. **Success**: Tampilkan data
3. **Empty**: Tampilkan empty state dengan ilustrasi

### 9.3. Optimistic Updates

Untuk aksi yang sering (mark notification as read, toggle status):
- Update UI langsung tanpa menunggu API response
- Rollback jika API error

---

## 10. Security

### 10.1. Token Management
- Token disimpan di `localStorage` (bukan cookie untuk SPA)
- Token dikirim via `Authorization: Bearer {token}` header
- Token dihapus saat logout
- Auto-logout jika token expired (401)

### 10.2. Route Protection
- Semua route kecuali `/` dan `/login` dilindungi `ProtectedRoute`
- `ProtectedRoute` mengecek `isAuthenticated` dan `allowedRoles`
- Redirect ke `/login` jika belum login
- Redirect ke `/dashboard` jika role tidak sesuai

### 10.3. Input Sanitization
- Sanitize semua user input sebelum render (prevent XSS)
- File upload: validasi tipe dan ukuran di client-side sebelum kirim

---

## 11. Performa

### 11.1. Lazy Loading
- Gunakan `React.lazy()` + `Suspense` untuk code splitting per halaman
- Gambar: gunakan lazy loading (`loading="lazy"`)

### 11.2. Data Caching
- Cache master data (wilayah, jenis lahan, kategori peralatan) di memory
- Stale-while-revalidate pattern untuk data yang jarang berubah

### 11.3. Debounce
- Search input: debounce 300ms sebelum API call
- Resize events: debounce 150ms

---

## 12. Deployment

### 12.1. Build Command
```bash
npm run build
```
Output di folder `dist/`.

### 12.2. Environment Variables
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=RuangTani
```

### 12.3. CORS Configuration
Backend harus mengizinkan origin frontend:
```php
// config/cors.php
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

---

> [!IMPORTANT]
> Dokumen ini adalah PRD untuk perencanaan frontend. Implementasi harus:
> 1. Menggantikan **semua mock data** (`mockData.js`) dengan API calls real
> 2. Mengimplementasikan **token-based auth** (bukan mock login)
> 3. Menambahkan **error handling** dan **loading states** di setiap halaman
> 4. Memastikan **responsive design** di semua breakpoint
