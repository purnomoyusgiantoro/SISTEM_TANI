<?php
namespace Database\Seeders;
use App\Models\Lahan;
use Illuminate\Database\Seeder;

class LahanSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['pemilik_id'=>1,'lokasi'=>'Desa Sukamaju, Kec. Cianjur','luas'=>2.5,'jenis_lahan'=>'Sawah','status_verifikasi'=>'terverifikasi','koordinat'=>'-6.7320, 107.1429','tanggal_daftar'=>'2026-01-15','verifikator_id'=>5,'tanggal_verifikasi'=>'2026-01-20','catatan'=>'Lahan produktif padi'],
            ['pemilik_id'=>1,'lokasi'=>'Desa Sukaresmi, Kec. Cianjur','luas'=>1.8,'jenis_lahan'=>'Tegalan','status_verifikasi'=>'terverifikasi','koordinat'=>'-6.7421, 107.1530','tanggal_daftar'=>'2026-01-20','verifikator_id'=>6,'tanggal_verifikasi'=>'2026-01-25','catatan'=>'Lahan kering untuk palawija'],
            ['pemilik_id'=>2,'lokasi'=>'Desa Cibodas, Kec. Lembang','luas'=>3.2,'jenis_lahan'=>'Sawah','status_verifikasi'=>'pending','koordinat'=>'-6.8120, 107.6230','tanggal_daftar'=>'2026-02-10','verifikator_id'=>null,'catatan'=>'Menunggu verifikasi lapangan'],
            ['pemilik_id'=>8,'lokasi'=>'Desa Margahayu, Kec. Bandung','luas'=>4.0,'jenis_lahan'=>'Perkebunan','status_verifikasi'=>'terverifikasi','koordinat'=>'-6.9520, 107.5930','tanggal_daftar'=>'2026-02-15','verifikator_id'=>5,'tanggal_verifikasi'=>'2026-02-20','catatan'=>'Perkebunan teh dan kopi'],
            ['pemilik_id'=>2,'lokasi'=>'Desa Pasirjambu, Kec. Pasirjambu','luas'=>1.5,'jenis_lahan'=>'Sawah','status_verifikasi'=>'ditolak','koordinat'=>'-7.1520, 107.5230','tanggal_daftar'=>'2026-03-01','verifikator_id'=>6,'tanggal_verifikasi'=>'2026-03-05','catatan'=>'Dokumen kepemilikan tidak lengkap','alasan_ditolak'=>'Dokumen kepemilikan tidak lengkap'],
            ['pemilik_id'=>8,'lokasi'=>'Desa Rancaekek, Kec. Rancaekek','luas'=>2.0,'jenis_lahan'=>'Tegalan','status_verifikasi'=>'pending','koordinat'=>'-6.9720, 107.7630','tanggal_daftar'=>'2026-03-10','verifikator_id'=>null,'catatan'=>'Pengajuan baru'],
            ['pemilik_id'=>9,'lokasi'=>'Desa Ciwidey, Kec. Ciwidey','luas'=>5.0,'jenis_lahan'=>'Perkebunan','status_verifikasi'=>'terverifikasi','koordinat'=>'-7.1020, 107.4930','tanggal_daftar'=>'2026-01-05','verifikator_id'=>5,'tanggal_verifikasi'=>'2026-01-10','catatan'=>'Perkebunan strawberry'],
            ['pemilik_id'=>1,'lokasi'=>'Desa Cileunyi, Kec. Cileunyi','luas'=>0.8,'jenis_lahan'=>'Kolam','status_verifikasi'=>'pending','koordinat'=>'-6.9320, 107.7529','tanggal_daftar'=>'2026-04-15','verifikator_id'=>null,'catatan'=>'Kolam ikan nila dan lele'],
        ];
        foreach ($data as $d) { Lahan::create($d); }
    }
}
