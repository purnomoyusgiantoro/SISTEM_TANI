<?php
namespace Database\Seeders;
use App\Models\Sewa;
use Illuminate\Database\Seeder;

class SewaSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['kode_sewa'=>'SW-2026-001','petani_id'=>1,'peralatan_id'=>1,'tanggal_mulai'=>'2026-06-15','tanggal_selesai'=>'2026-06-18','durasi'=>3,'total_biaya'=>1050000,'status'=>'aktif','validasi'=>'disetujui','validasi_oleh'=>3],
            ['kode_sewa'=>'SW-2026-002','petani_id'=>2,'peralatan_id'=>3,'tanggal_mulai'=>'2026-06-10','tanggal_selesai'=>'2026-06-12','durasi'=>2,'total_biaya'=>100000,'status'=>'selesai','validasi'=>'disetujui','validasi_oleh'=>4],
            ['kode_sewa'=>'SW-2026-003','petani_id'=>8,'peralatan_id'=>2,'tanggal_mulai'=>'2026-06-20','tanggal_selesai'=>'2026-06-23','durasi'=>3,'total_biaya'=>450000,'status'=>'menunggu','validasi'=>'pending','validasi_oleh'=>null],
            ['kode_sewa'=>'SW-2026-004','petani_id'=>1,'peralatan_id'=>5,'tanggal_mulai'=>'2026-06-18','tanggal_selesai'=>'2026-06-25','durasi'=>7,'total_biaya'=>700000,'status'=>'aktif','validasi'=>'disetujui','validasi_oleh'=>3],
            ['kode_sewa'=>'SW-2026-005','petani_id'=>2,'peralatan_id'=>8,'tanggal_mulai'=>'2026-06-22','tanggal_selesai'=>'2026-06-24','durasi'=>2,'total_biaya'=>1000000,'status'=>'menunggu','validasi'=>'pending','validasi_oleh'=>null],
        ];
        foreach ($data as $d) { Sewa::create($d); }
    }
}
