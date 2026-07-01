<?php
namespace Database\Seeders;
use App\Models\Berita;
use Illuminate\Database\Seeder;

class BeritaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['judul'=>'Harga Gabah Naik 15% di Musim Panen Raya','kategori'=>'Harga Komoditas','isi'=>'Harga gabah kering panen (GKP) mengalami kenaikan signifikan sebesar 15% dibandingkan periode yang sama tahun lalu.','penulis_id'=>5,'tanggal'=>'2026-06-18','status'=>'published'],
            ['judul'=>'Tips Budidaya Padi Organik untuk Pemula','kategori'=>'Tips Budidaya','isi'=>'Budidaya padi organik semakin diminati karena harga jual yang lebih tinggi.','penulis_id'=>6,'tanggal'=>'2026-06-15','status'=>'published'],
            ['judul'=>'Subsidi Pupuk 2026: Panduan Pendaftaran','kategori'=>'Kebijakan','isi'=>'Pemerintah mengumumkan program subsidi pupuk untuk tahun 2026.','penulis_id'=>5,'tanggal'=>'2026-06-12','status'=>'published'],
            ['judul'=>'Musim Tanam Kedua: Rekomendasi Varietas Unggul','kategori'=>'Tips Budidaya','isi'=>'Memasuki musim tanam kedua, BPP merekomendasikan beberapa varietas unggul.','penulis_id'=>6,'tanggal'=>'2026-06-10','status'=>'draft'],
        ];
        foreach ($data as $d) { Berita::create($d); }
    }
}
