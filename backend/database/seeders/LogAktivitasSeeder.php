<?php
namespace Database\Seeders;
use App\Models\LogAktivitas;
use Illuminate\Database\Seeder;

class LogAktivitasSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['user_id'=>1,'user_name'=>'Budi Santoso','aksi'=>'Login','detail'=>'Login berhasil dari IP 192.168.1.45','level'=>'info','created_at'=>'2026-06-20 08:30:00'],
            ['user_id'=>3,'user_name'=>'Ahmad Hidayat','aksi'=>'Validasi Sewa','detail'=>'Menyetujui pengajuan sewa SW-2026-001','level'=>'info','created_at'=>'2026-06-20 09:15:00'],
            ['user_id'=>5,'user_name'=>'Ir. Hendra Wijaya','aksi'=>'Verifikasi Lahan','detail'=>'Memverifikasi lahan ID #1 milik Budi Santoso','level'=>'info','created_at'=>'2026-06-20 10:20:00'],
            ['user_id'=>7,'user_name'=>'Superadmin','aksi'=>'Backup Data','detail'=>'Backup otomatis database berhasil (245 MB)','level'=>'success','created_at'=>'2026-06-20 06:00:00'],
            ['user_id'=>null,'user_name'=>'Sistem','aksi'=>'Error','detail'=>'Gagal mengirim notifikasi email ke mega@simantan.id','level'=>'error','created_at'=>'2026-06-19 23:45:00'],
            ['user_id'=>4,'user_name'=>'Dewi Lestari','aksi'=>'Tambah Barang','detail'=>'Menambahkan peralatan baru: Drone Pertanian','level'=>'info','created_at'=>'2026-06-19 14:30:00'],
            ['user_id'=>6,'user_name'=>'Dr. Ratna Sari','aksi'=>'Publish Berita','detail'=>'Mempublikasikan berita: Tips Budidaya Padi Organik','level'=>'info','created_at'=>'2026-06-15 16:00:00'],
            ['user_id'=>2,'user_name'=>'Siti Rahayu','aksi'=>'Upload Bukti Bayar','detail'=>'Mengupload bukti pembayaran tagihan TG-2026-002','level'=>'info','created_at'=>'2026-06-14 11:20:00'],
        ];
        foreach ($data as $d) { LogAktivitas::create($d); }
    }
}
