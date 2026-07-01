<?php
namespace Database\Seeders;
use App\Models\Peralatan;
use Illuminate\Database\Seeder;

class PeralatanSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['nama'=>'Traktor Roda Empat','kategori'=>'Pengolah Tanah','deskripsi'=>'Traktor Kubota M7040 untuk pengolahan lahan besar','harga_per_hari'=>350000,'stok'=>3,'tersedia'=>2,'gambar'=>'tractor','kondisi'=>'Baik'],
            ['nama'=>'Hand Tractor','kategori'=>'Pengolah Tanah','deskripsi'=>'Traktor tangan untuk pengolahan lahan kecil-menengah','harga_per_hari'=>150000,'stok'=>8,'tersedia'=>5,'gambar'=>'hand-tractor','kondisi'=>'Baik'],
            ['nama'=>'Sprayer Elektrik','kategori'=>'Penyemprotan','deskripsi'=>'Alat semprot elektrik 16L untuk pestisida dan pupuk cair','harga_per_hari'=>50000,'stok'=>15,'tersedia'=>12,'gambar'=>'sprayer','kondisi'=>'Baik'],
            ['nama'=>'Mesin Perontok Padi','kategori'=>'Panen','deskripsi'=>'Power thresher untuk perontokan padi kapasitas besar','harga_per_hari'=>250000,'stok'=>4,'tersedia'=>1,'gambar'=>'thresher','kondisi'=>'Baik'],
            ['nama'=>'Pompa Air Diesel','kategori'=>'Irigasi','deskripsi'=>'Pompa air diesel 3 inch untuk irigasi sawah','harga_per_hari'=>100000,'stok'=>6,'tersedia'=>4,'gambar'=>'pump','kondisi'=>'Baik'],
            ['nama'=>'Cultivator','kategori'=>'Pengolah Tanah','deskripsi'=>'Mesin kultivator untuk menggemburkan tanah','harga_per_hari'=>200000,'stok'=>5,'tersedia'=>3,'gambar'=>'cultivator','kondisi'=>'Baik'],
            ['nama'=>'Mesin Pemotong Rumput','kategori'=>'Perawatan','deskripsi'=>'Brush cutter untuk pembersihan lahan','harga_per_hari'=>75000,'stok'=>10,'tersedia'=>8,'gambar'=>'cutter','kondisi'=>'Baik'],
            ['nama'=>'Drone Pertanian','kategori'=>'Teknologi','deskripsi'=>'Drone DJI Agras T40 untuk penyemprotan presisi','harga_per_hari'=>500000,'stok'=>2,'tersedia'=>0,'gambar'=>'drone','kondisi'=>'Baik'],
        ];
        foreach ($data as $d) { Peralatan::create($d); }
    }
}
