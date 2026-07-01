<?php
namespace Database\Seeders;
use App\Models\Tagihan;
use Illuminate\Database\Seeder;

class TagihanSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['kode_tagihan'=>'TG-2026-001','sewa_id'=>1,'petani_id'=>1,'jumlah'=>1050000,'tanggal_tagihan'=>'2026-06-15','jatuh_tempo'=>'2026-06-25','status'=>'lunas','tanggal_bayar'=>'2026-06-17','bukti_pembayaran'=>'bukti_001.jpg'],
            ['kode_tagihan'=>'TG-2026-002','sewa_id'=>2,'petani_id'=>2,'jumlah'=>100000,'tanggal_tagihan'=>'2026-06-10','jatuh_tempo'=>'2026-06-20','status'=>'menunggu_verifikasi','tanggal_bayar'=>'2026-06-14','bukti_pembayaran'=>'bukti_002.jpg'],
            ['kode_tagihan'=>'TG-2026-003','sewa_id'=>4,'petani_id'=>1,'jumlah'=>700000,'tanggal_tagihan'=>'2026-06-18','jatuh_tempo'=>'2026-06-28','status'=>'belum_bayar','tanggal_bayar'=>null,'bukti_pembayaran'=>null],
            ['kode_tagihan'=>'TG-2026-004','sewa_id'=>3,'petani_id'=>8,'jumlah'=>450000,'tanggal_tagihan'=>'2026-06-20','jatuh_tempo'=>'2026-06-30','status'=>'belum_bayar','tanggal_bayar'=>null,'bukti_pembayaran'=>null],
        ];
        foreach ($data as $d) { Tagihan::create($d); }
    }
}
