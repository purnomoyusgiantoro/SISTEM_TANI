// ============================================
// MOCK DATA - SIMANTAN
// Sistem Manajemen Lahan & Sewa Peralatan Pertanian
// ============================================

// --- Users ---
export const users = [
  { id: 1, nama: 'Budi Santoso', email: 'budi@simantan.id', role: 'petani', avatar: null, status: 'aktif', lastLogin: '2026-06-20 08:30' },
  { id: 2, nama: 'Siti Rahayu', email: 'siti@simantan.id', role: 'petani', avatar: null, status: 'aktif', lastLogin: '2026-06-19 14:20' },
  { id: 3, nama: 'Ahmad Hidayat', email: 'ahmad@simantan.id', role: 'pengurus', avatar: null, status: 'aktif', lastLogin: '2026-06-20 09:00' },
  { id: 4, nama: 'Dewi Lestari', email: 'dewi@simantan.id', role: 'pengurus', avatar: null, status: 'aktif', lastLogin: '2026-06-20 07:45' },
  { id: 5, nama: 'Ir. Hendra Wijaya', email: 'hendra@simantan.id', role: 'bpp', avatar: null, status: 'aktif', lastLogin: '2026-06-20 10:15' },
  { id: 6, nama: 'Dr. Ratna Sari', email: 'ratna@simantan.id', role: 'bpp', avatar: null, status: 'aktif', lastLogin: '2026-06-18 16:30' },
  { id: 7, nama: 'Superadmin', email: 'admin@simantan.id', role: 'admin', avatar: null, status: 'aktif', lastLogin: '2026-06-20 06:00' },
  { id: 8, nama: 'Joko Widodo', email: 'joko@simantan.id', role: 'petani', avatar: null, status: 'aktif', lastLogin: '2026-06-17 11:00' },
  { id: 9, nama: 'Mega Purnama', email: 'mega@simantan.id', role: 'petani', avatar: null, status: 'nonaktif', lastLogin: '2026-05-20 09:00' },
  { id: 10, nama: 'Rina Marlina', email: 'rina@simantan.id', role: 'pengurus', avatar: null, status: 'aktif', lastLogin: '2026-06-20 08:00' },
];

// --- Lahan (Land Data) ---
export const dataLahan = [
  { id: 1, pemilikId: 1, pemilik: 'Budi Santoso', lokasi: 'Desa Sukamaju, Kec. Cianjur', luas: 2.5, jenisLahan: 'Sawah', statusVerifikasi: 'terverifikasi', koordinat: '-6.7320, 107.1429', tanggalDaftar: '2026-01-15', verifikator: 'Ir. Hendra Wijaya', catatan: 'Lahan produktif padi' },
  { id: 2, pemilikId: 1, pemilik: 'Budi Santoso', lokasi: 'Desa Sukaresmi, Kec. Cianjur', luas: 1.8, jenisLahan: 'Tegalan', statusVerifikasi: 'terverifikasi', koordinat: '-6.7421, 107.1530', tanggalDaftar: '2026-01-20', verifikator: 'Dr. Ratna Sari', catatan: 'Lahan kering untuk palawija' },
  { id: 3, pemilikId: 2, pemilik: 'Siti Rahayu', lokasi: 'Desa Cibodas, Kec. Lembang', luas: 3.2, jenisLahan: 'Sawah', statusVerifikasi: 'pending', koordinat: '-6.8120, 107.6230', tanggalDaftar: '2026-02-10', verifikator: null, catatan: 'Menunggu verifikasi lapangan' },
  { id: 4, pemilikId: 8, pemilik: 'Joko Widodo', lokasi: 'Desa Margahayu, Kec. Bandung', luas: 4.0, jenisLahan: 'Perkebunan', statusVerifikasi: 'terverifikasi', koordinat: '-6.9520, 107.5930', tanggalDaftar: '2026-02-15', verifikator: 'Ir. Hendra Wijaya', catatan: 'Perkebunan teh dan kopi' },
  { id: 5, pemilikId: 2, pemilik: 'Siti Rahayu', lokasi: 'Desa Pasirjambu, Kec. Pasirjambu', luas: 1.5, jenisLahan: 'Sawah', statusVerifikasi: 'ditolak', koordinat: '-7.1520, 107.5230', tanggalDaftar: '2026-03-01', verifikator: 'Dr. Ratna Sari', catatan: 'Dokumen kepemilikan tidak lengkap' },
  { id: 6, pemilikId: 8, pemilik: 'Joko Widodo', lokasi: 'Desa Rancaekek, Kec. Rancaekek', luas: 2.0, jenisLahan: 'Tegalan', statusVerifikasi: 'pending', koordinat: '-6.9720, 107.7630', tanggalDaftar: '2026-03-10', verifikator: null, catatan: 'Pengajuan baru' },
  { id: 7, pemilikId: 9, pemilik: 'Mega Purnama', lokasi: 'Desa Ciwidey, Kec. Ciwidey', luas: 5.0, jenisLahan: 'Perkebunan', statusVerifikasi: 'terverifikasi', koordinat: '-7.1020, 107.4930', tanggalDaftar: '2026-01-05', verifikator: 'Ir. Hendra Wijaya', catatan: 'Perkebunan strawberry' },
  { id: 8, pemilikId: 1, pemilik: 'Budi Santoso', lokasi: 'Desa Cileunyi, Kec. Cileunyi', luas: 0.8, jenisLahan: 'Kolam', statusVerifikasi: 'pending', koordinat: '-6.9320, 107.7529', tanggalDaftar: '2026-04-15', verifikator: null, catatan: 'Kolam ikan nila dan lele' },
];

// --- Peralatan (Equipment) ---
export const peralatan = [
  { id: 1, nama: 'Traktor Roda Empat', kategori: 'Pengolah Tanah', deskripsi: 'Traktor Kubota M7040 untuk pengolahan lahan besar', hargaPerHari: 350000, stok: 3, tersedia: 2, gambar: 'tractor', kondisi: 'Baik' },
  { id: 2, nama: 'Hand Tractor', kategori: 'Pengolah Tanah', deskripsi: 'Traktor tangan untuk pengolahan lahan kecil-menengah', hargaPerHari: 150000, stok: 8, tersedia: 5, gambar: 'hand-tractor', kondisi: 'Baik' },
  { id: 3, nama: 'Sprayer Elektrik', kategori: 'Penyemprotan', deskripsi: 'Alat semprot elektrik 16L untuk pestisida dan pupuk cair', hargaPerHari: 50000, stok: 15, tersedia: 12, gambar: 'sprayer', kondisi: 'Baik' },
  { id: 4, nama: 'Mesin Perontok Padi', kategori: 'Panen', deskripsi: 'Power thresher untuk perontokan padi kapasitas besar', hargaPerHari: 250000, stok: 4, tersedia: 1, gambar: 'thresher', kondisi: 'Baik' },
  { id: 5, nama: 'Pompa Air Diesel', kategori: 'Irigasi', deskripsi: 'Pompa air diesel 3 inch untuk irigasi sawah', hargaPerHari: 100000, stok: 6, tersedia: 4, gambar: 'pump', kondisi: 'Baik' },
  { id: 6, nama: 'Cultivator', kategori: 'Pengolah Tanah', deskripsi: 'Mesin kultivator untuk menggemburkan tanah', hargaPerHari: 200000, stok: 5, tersedia: 3, gambar: 'cultivator', kondisi: 'Baik' },
  { id: 7, nama: 'Mesin Pemotong Rumput', kategori: 'Perawatan', deskripsi: 'Brush cutter untuk pembersihan lahan', hargaPerHari: 75000, stok: 10, tersedia: 8, gambar: 'cutter', kondisi: 'Baik' },
  { id: 8, nama: 'Drone Pertanian', kategori: 'Teknologi', deskripsi: 'Drone DJI Agras T40 untuk penyemprotan presisi', hargaPerHari: 500000, stok: 2, tersedia: 0, gambar: 'drone', kondisi: 'Baik' },
];

// --- Sewa (Rentals) ---
export const dataSewa = [
  { id: 'SW-2026-001', petaniId: 1, petani: 'Budi Santoso', peralatanId: 1, peralatan: 'Traktor Roda Empat', tanggalMulai: '2026-06-15', tanggalSelesai: '2026-06-18', durasi: 3, totalBiaya: 1050000, status: 'aktif', validasi: 'disetujui', validasiOleh: 'Ahmad Hidayat' },
  { id: 'SW-2026-002', petaniId: 2, petani: 'Siti Rahayu', peralatanId: 3, peralatan: 'Sprayer Elektrik', tanggalMulai: '2026-06-10', tanggalSelesai: '2026-06-12', durasi: 2, totalBiaya: 100000, status: 'selesai', validasi: 'disetujui', validasiOleh: 'Dewi Lestari' },
  { id: 'SW-2026-003', petaniId: 8, petani: 'Joko Widodo', peralatanId: 2, peralatan: 'Hand Tractor', tanggalMulai: '2026-06-20', tanggalSelesai: '2026-06-23', durasi: 3, totalBiaya: 450000, status: 'menunggu', validasi: 'pending', validasiOleh: null },
  { id: 'SW-2026-004', petaniId: 1, petani: 'Budi Santoso', peralatanId: 5, peralatan: 'Pompa Air Diesel', tanggalMulai: '2026-06-18', tanggalSelesai: '2026-06-25', durasi: 7, totalBiaya: 700000, status: 'aktif', validasi: 'disetujui', validasiOleh: 'Ahmad Hidayat' },
  { id: 'SW-2026-005', petaniId: 2, petani: 'Siti Rahayu', peralatanId: 8, peralatan: 'Drone Pertanian', tanggalMulai: '2026-06-22', tanggalSelesai: '2026-06-24', durasi: 2, totalBiaya: 1000000, status: 'menunggu', validasi: 'pending', validasiOleh: null },
];

// --- Tagihan (Bills) ---
export const dataTagihan = [
  { id: 'TG-2026-001', sewaId: 'SW-2026-001', petaniId: 1, petani: 'Budi Santoso', peralatan: 'Traktor Roda Empat', jumlah: 1050000, tanggalTagihan: '2026-06-15', jatuhTempo: '2026-06-25', status: 'lunas', tanggalBayar: '2026-06-17', buktiPembayaran: 'bukti_001.jpg' },
  { id: 'TG-2026-002', sewaId: 'SW-2026-002', petaniId: 2, petani: 'Siti Rahayu', peralatan: 'Sprayer Elektrik', jumlah: 100000, tanggalTagihan: '2026-06-10', jatuhTempo: '2026-06-20', status: 'menunggu_verifikasi', tanggalBayar: '2026-06-14', buktiPembayaran: 'bukti_002.jpg' },
  { id: 'TG-2026-003', sewaId: 'SW-2026-004', petaniId: 1, petani: 'Budi Santoso', peralatan: 'Pompa Air Diesel', jumlah: 700000, tanggalTagihan: '2026-06-18', jatuhTempo: '2026-06-28', status: 'belum_bayar', tanggalBayar: null, buktiPembayaran: null },
  { id: 'TG-2026-004', sewaId: 'SW-2026-003', petaniId: 8, petani: 'Joko Widodo', peralatan: 'Hand Tractor', jumlah: 450000, tanggalTagihan: '2026-06-20', jatuhTempo: '2026-06-30', status: 'belum_bayar', tanggalBayar: null, buktiPembayaran: null },
];

// --- Kegiatan Petani (Farmer Activities) ---
export const dataKegiatan = [
  { id: 1, petaniId: 1, petani: 'Budi Santoso', lahanId: 1, lokasi: 'Desa Sukamaju', jenis: 'tanam', deskripsi: 'Penanaman bibit padi varietas IR64', tanggal: '2026-06-01', foto: null },
  { id: 2, petaniId: 1, petani: 'Budi Santoso', lahanId: 1, lokasi: 'Desa Sukamaju', jenis: 'pemupukan', deskripsi: 'Pemupukan NPK susulan ke-2', tanggal: '2026-06-10', foto: null },
  { id: 3, petaniId: 2, petani: 'Siti Rahayu', lahanId: 3, lokasi: 'Desa Cibodas', jenis: 'penyemprotan', deskripsi: 'Penyemprotan pestisida organik untuk hama wereng', tanggal: '2026-06-08', foto: null },
  { id: 4, petaniId: 8, petani: 'Joko Widodo', lahanId: 4, lokasi: 'Desa Margahayu', jenis: 'panen', deskripsi: 'Panen kopi Arabika gelombang pertama', tanggal: '2026-06-15', foto: null },
  { id: 5, petaniId: 1, petani: 'Budi Santoso', lahanId: 2, lokasi: 'Desa Sukaresmi', jenis: 'pengolahan', deskripsi: 'Pengolahan tanah dengan traktor untuk persiapan tanam jagung', tanggal: '2026-06-18', foto: null },
  { id: 6, petaniId: 2, petani: 'Siti Rahayu', lahanId: 3, lokasi: 'Desa Cibodas', jenis: 'irigasi', deskripsi: 'Pengairan sawah menggunakan pompa diesel', tanggal: '2026-06-12', foto: null },
  { id: 7, petaniId: 8, petani: 'Joko Widodo', lahanId: 4, lokasi: 'Desa Margahayu', jenis: 'pemupukan', deskripsi: 'Pemberian pupuk kompos pada tanaman teh', tanggal: '2026-06-20', foto: null },
];

// --- Berita (News) ---
export const dataBerita = [
  { id: 1, judul: 'Harga Gabah Naik 15% di Musim Panen Raya', kategori: 'Harga Komoditas', isi: 'Harga gabah kering panen (GKP) mengalami kenaikan signifikan sebesar 15% dibandingkan periode yang sama tahun lalu. Kenaikan ini dipicu oleh meningkatnya permintaan dari penggilingan besar dan kebijakan pemerintah untuk menyerap gabah petani.', penulis: 'Ir. Hendra Wijaya', tanggal: '2026-06-18', gambar: null, status: 'published' },
  { id: 2, judul: 'Tips Budidaya Padi Organik untuk Pemula', kategori: 'Tips Budidaya', isi: 'Budidaya padi organik semakin diminati karena harga jual yang lebih tinggi. Berikut adalah panduan lengkap untuk memulai budidaya padi organik, mulai dari persiapan lahan hingga panen.', penulis: 'Dr. Ratna Sari', tanggal: '2026-06-15', gambar: null, status: 'published' },
  { id: 3, judul: 'Subsidi Pupuk 2026: Panduan Pendaftaran', kategori: 'Kebijakan', isi: 'Pemerintah mengumumkan program subsidi pupuk untuk tahun 2026. Petani yang terdaftar dalam database SIMANTAN dapat mengajukan subsidi melalui platform ini. Berikut syarat dan ketentuan yang berlaku.', penulis: 'Ir. Hendra Wijaya', tanggal: '2026-06-12', gambar: null, status: 'published' },
  { id: 4, judul: 'Musim Tanam Kedua: Rekomendasi Varietas Unggul', kategori: 'Tips Budidaya', isi: 'Memasuki musim tanam kedua, BPP merekomendasikan beberapa varietas unggul yang cocok ditanam di wilayah ini berdasarkan analisis iklim dan curah hujan terkini.', penulis: 'Dr. Ratna Sari', tanggal: '2026-06-10', gambar: null, status: 'draft' },
];

// --- Struktur Organisasi ---
export const strukturOrganisasi = {
  id: 1,
  nama: 'H. Dedi Mulyadi',
  jabatan: 'Ketua Kelompok Tani',
  children: [
    {
      id: 2,
      nama: 'Ahmad Hidayat',
      jabatan: 'Sekretaris',
      children: [
        { id: 5, nama: 'Rina Marlina', jabatan: 'Bendahara', children: [] },
      ],
    },
    {
      id: 3,
      nama: 'Dewi Lestari',
      jabatan: 'Koordinator Wilayah Barat',
      children: [
        { id: 6, nama: 'Budi Santoso', jabatan: 'Ketua RT 01', children: [] },
        { id: 7, nama: 'Siti Rahayu', jabatan: 'Ketua RT 02', children: [] },
      ],
    },
    {
      id: 4,
      nama: 'Surya Pratama',
      jabatan: 'Koordinator Wilayah Timur',
      children: [
        { id: 8, nama: 'Joko Widodo', jabatan: 'Ketua RT 03', children: [] },
        { id: 9, nama: 'Mega Purnama', jabatan: 'Ketua RT 04', children: [] },
      ],
    },
  ],
};

// --- Log Aktivitas Sistem ---
export const logAktivitas = [
  { id: 1, user: 'Budi Santoso', aksi: 'Login', detail: 'Login berhasil dari IP 192.168.1.45', waktu: '2026-06-20 08:30:00', level: 'info' },
  { id: 2, user: 'Ahmad Hidayat', aksi: 'Validasi Sewa', detail: 'Menyetujui pengajuan sewa SW-2026-001', waktu: '2026-06-20 09:15:00', level: 'info' },
  { id: 3, user: 'Ir. Hendra Wijaya', aksi: 'Verifikasi Lahan', detail: 'Memverifikasi lahan ID #1 milik Budi Santoso', waktu: '2026-06-20 10:20:00', level: 'info' },
  { id: 4, user: 'Superadmin', aksi: 'Backup Data', detail: 'Backup otomatis database berhasil (245 MB)', waktu: '2026-06-20 06:00:00', level: 'success' },
  { id: 5, user: 'Sistem', aksi: 'Error', detail: 'Gagal mengirim notifikasi email ke mega@simantan.id', waktu: '2026-06-19 23:45:00', level: 'error' },
  { id: 6, user: 'Dewi Lestari', aksi: 'Tambah Barang', detail: 'Menambahkan peralatan baru: Drone Pertanian', waktu: '2026-06-19 14:30:00', level: 'info' },
  { id: 7, user: 'Dr. Ratna Sari', aksi: 'Publish Berita', detail: 'Mempublikasikan berita: Tips Budidaya Padi Organik', waktu: '2026-06-15 16:00:00', level: 'info' },
  { id: 8, user: 'Siti Rahayu', aksi: 'Upload Bukti Bayar', detail: 'Mengupload bukti pembayaran tagihan TG-2026-002', waktu: '2026-06-14 11:20:00', level: 'info' },
];

// --- Notifikasi ---
export const notifikasi = [
  { id: 1, userId: 1, judul: 'Sewa Disetujui', pesan: 'Pengajuan sewa Traktor Roda Empat telah disetujui', waktu: '2026-06-20 09:15', dibaca: false, tipe: 'success' },
  { id: 2, userId: 1, judul: 'Tagihan Baru', pesan: 'Tagihan sewa Pompa Air Diesel sebesar Rp 700.000 telah dibuat', waktu: '2026-06-18 10:00', dibaca: false, tipe: 'warning' },
  { id: 3, userId: 1, judul: 'Berita Baru', pesan: 'Harga Gabah Naik 15% di Musim Panen Raya', waktu: '2026-06-18 08:00', dibaca: true, tipe: 'info' },
  { id: 4, userId: 2, judul: 'Verifikasi Ditolak', pesan: 'Verifikasi lahan di Desa Pasirjambu ditolak: Dokumen tidak lengkap', waktu: '2026-06-15 14:30', dibaca: true, tipe: 'error' },
  { id: 5, userId: 3, judul: 'Pengajuan Sewa Baru', pesan: 'Joko Widodo mengajukan sewa Hand Tractor', waktu: '2026-06-20 07:00', dibaca: false, tipe: 'info' },
];

// --- Dashboard Stats ---
export const dashboardStats = {
  petani: {
    totalLahan: 3,
    luasTotal: '5.1 Ha',
    sewaAktif: 2,
    tagihanBelumBayar: 1,
  },
  pengurus: {
    totalLahan: 8,
    totalPetani: 5,
    peralatanTersedia: 35,
    sewaMenunggu: 2,
    totalPendapatan: 2300000,
  },
  bpp: {
    lahanTerverifikasi: 4,
    pendingVerifikasi: 3,
    ditolak: 1,
    totalBerita: 4,
  },
  admin: {
    totalPengguna: 10,
    penggunaAktif: 9,
    backupTerakhir: '2026-06-20 06:00',
    uptime: '99.9%',
  },
};

// --- Wilayah ---
export const daftarWilayah = [
  'Kec. Cianjur',
  'Kec. Lembang',
  'Kec. Bandung',
  'Kec. Pasirjambu',
  'Kec. Rancaekek',
  'Kec. Ciwidey',
  'Kec. Cileunyi',
];

// --- Jenis Lahan ---
export const jenisLahanOptions = ['Sawah', 'Tegalan', 'Perkebunan', 'Kolam', 'Ladang'];

// --- Kategori Peralatan ---
export const kategoriPeralatan = ['Pengolah Tanah', 'Penyemprotan', 'Panen', 'Irigasi', 'Perawatan', 'Teknologi'];

// --- Jenis Kegiatan ---
export const jenisKegiatan = [
  { value: 'tanam', label: 'Penanaman', icon: 'tanam', color: '#10b981' },
  { value: 'pemupukan', label: 'Pemupukan', icon: 'pupuk', color: '#8b5cf6' },
  { value: 'penyemprotan', label: 'Penyemprotan', icon: 'semprot', color: '#f59e0b' },
  { value: 'panen', label: 'Panen', icon: 'panen', color: '#ef4444' },
  { value: 'pengolahan', label: 'Pengolahan Tanah', icon: 'olah', color: '#6366f1' },
  { value: 'irigasi', label: 'Irigasi', icon: 'irigasi', color: '#0ea5e9' },
  { value: 'perawatan', label: 'Perawatan', icon: 'rawat', color: '#14b8a6' },
];

// Helper: format currency
export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper: format date
export const formatTanggal = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
