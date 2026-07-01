<?php
namespace Database\Seeders;
use App\Models\Kegiatan;
use Illuminate\Database\Seeder;

class KegiatanSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['petani_id'=>1,'lahan_id'=>1,'jenis'=>'tanam','deskripsi'=>'Penanaman bibit padi varietas IR64','tanggal'=>'2026-06-01'],
            ['petani_id'=>1,'lahan_id'=>1,'jenis'=>'pemupukan','deskripsi'=>'Pemupukan NPK susulan ke-2','tanggal'=>'2026-06-10'],
            ['petani_id'=>2,'lahan_id'=>3,'jenis'=>'penyemprotan','deskripsi'=>'Penyemprotan pestisida organik untuk hama wereng','tanggal'=>'2026-06-08'],
            ['petani_id'=>8,'lahan_id'=>4,'jenis'=>'panen','deskripsi'=>'Panen kopi Arabika gelombang pertama','tanggal'=>'2026-06-15'],
            ['petani_id'=>1,'lahan_id'=>2,'jenis'=>'pengolahan','deskripsi'=>'Pengolahan tanah dengan traktor untuk persiapan tanam jagung','tanggal'=>'2026-06-18'],
            ['petani_id'=>2,'lahan_id'=>3,'jenis'=>'irigasi','deskripsi'=>'Pengairan sawah menggunakan pompa diesel','tanggal'=>'2026-06-12'],
            ['petani_id'=>8,'lahan_id'=>4,'jenis'=>'pemupukan','deskripsi'=>'Pemberian pupuk kompos pada tanaman teh','tanggal'=>'2026-06-20'],
        ];
        foreach ($data as $d) { Kegiatan::create($d); }
    }
}
