<?php
namespace Database\Seeders;
use App\Models\Tagihan;
use Illuminate\Database\Seeder;

class TagihanSeeder extends Seeder
{
    public function run(): void
    {
        // Tagihan hanya dibuat untuk sewa yang sudah disetujui (sewa_id 1, 2, 4)
        // sewa_id 3 & 5 masih pending, sehingga belum ada tagihan
        $data = [
            ['kode_tagihan'=>'TG-2026-001','sewa_id'=>1,'petani_id'=>1,'jumlah'=>1050000,'tanggal_tagihan'=>'2026-06-15','jatuh_tempo'=>'2026-06-25','status'=>'lunas','tanggal_bayar'=>'2026-06-17','bukti_pembayaran'=>'bukti_001.jpg','jumlah_dibayar'=>1050000],
            ['kode_tagihan'=>'TG-2026-002','sewa_id'=>2,'petani_id'=>2,'jumlah'=>100000,'tanggal_tagihan'=>'2026-06-10','jatuh_tempo'=>'2026-06-20','status'=>'menunggu_verifikasi','tanggal_bayar'=>'2026-06-14','bukti_pembayaran'=>'bukti_002.jpg','jumlah_dibayar'=>100000],
            ['kode_tagihan'=>'TG-2026-003','sewa_id'=>4,'petani_id'=>1,'jumlah'=>700000,'tanggal_tagihan'=>'2026-06-18','jatuh_tempo'=>'2026-06-28','status'=>'belum_bayar','tanggal_bayar'=>null,'bukti_pembayaran'=>null,'jumlah_dibayar'=>null],
        ];
        foreach ($data as $d) { Tagihan::create($d); }
    }
}
