<?php
namespace Database\Seeders;
use App\Models\Organisasi;
use Illuminate\Database\Seeder;

class OrganisasiSeeder extends Seeder
{
    public function run(): void
    {
        $ketua = Organisasi::create(['nama'=>'H. Dedi Mulyadi','jabatan'=>'Ketua Kelompok Tani','parent_id'=>null,'urutan'=>1]);
        $sekretaris = Organisasi::create(['nama'=>'Ahmad Hidayat','jabatan'=>'Sekretaris','parent_id'=>$ketua->id,'urutan'=>1,'user_id'=>3]);
        Organisasi::create(['nama'=>'Rina Marlina','jabatan'=>'Bendahara','parent_id'=>$sekretaris->id,'urutan'=>1,'user_id'=>10]);
        $korBarat = Organisasi::create(['nama'=>'Dewi Lestari','jabatan'=>'Koordinator Wilayah Barat','parent_id'=>$ketua->id,'urutan'=>2,'user_id'=>4]);
        Organisasi::create(['nama'=>'Budi Santoso','jabatan'=>'Ketua RT 01','parent_id'=>$korBarat->id,'urutan'=>1,'user_id'=>1]);
        Organisasi::create(['nama'=>'Siti Rahayu','jabatan'=>'Ketua RT 02','parent_id'=>$korBarat->id,'urutan'=>2,'user_id'=>2]);
        $korTimur = Organisasi::create(['nama'=>'Surya Pratama','jabatan'=>'Koordinator Wilayah Timur','parent_id'=>$ketua->id,'urutan'=>3]);
        Organisasi::create(['nama'=>'Joko Widodo','jabatan'=>'Ketua RT 03','parent_id'=>$korTimur->id,'urutan'=>1,'user_id'=>8]);
        Organisasi::create(['nama'=>'Mega Purnama','jabatan'=>'Ketua RT 04','parent_id'=>$korTimur->id,'urutan'=>2,'user_id'=>9]);
    }
}
