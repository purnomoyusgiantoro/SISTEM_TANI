<?php
namespace Database\Seeders;
use App\Models\Notifikasi;
use Illuminate\Database\Seeder;

class NotifikasiSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['user_id'=>1,'judul'=>'Sewa Disetujui','pesan'=>'Pengajuan sewa Traktor Roda Empat telah disetujui','tipe'=>'success','dibaca'=>false],
            ['user_id'=>1,'judul'=>'Tagihan Baru','pesan'=>'Tagihan sewa Pompa Air Diesel sebesar Rp 700.000 telah dibuat','tipe'=>'warning','dibaca'=>false],
            ['user_id'=>1,'judul'=>'Berita Baru','pesan'=>'Harga Gabah Naik 15% di Musim Panen Raya','tipe'=>'info','dibaca'=>true,'dibaca_pada'=>now()],
            ['user_id'=>2,'judul'=>'Verifikasi Ditolak','pesan'=>'Verifikasi lahan di Desa Pasirjambu ditolak: Dokumen tidak lengkap','tipe'=>'error','dibaca'=>true,'dibaca_pada'=>now()],
            ['user_id'=>3,'judul'=>'Pengajuan Sewa Baru','pesan'=>'Joko Widodo mengajukan sewa Hand Tractor','tipe'=>'info','dibaca'=>false],
        ];
        foreach ($data as $d) { Notifikasi::create($d); }
    }
}
