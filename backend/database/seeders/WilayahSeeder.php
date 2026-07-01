<?php
namespace Database\Seeders;
use App\Models\Wilayah;
use Illuminate\Database\Seeder;

class WilayahSeeder extends Seeder
{
    public function run(): void
    {
        $wilayah = ['Kec. Cianjur','Kec. Lembang','Kec. Bandung','Kec. Pasirjambu','Kec. Rancaekek','Kec. Ciwidey','Kec. Cileunyi'];
        foreach ($wilayah as $w) { Wilayah::create(['nama' => $w]); }
    }
}
