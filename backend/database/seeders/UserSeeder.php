<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['nama' => 'Budi Santoso', 'email' => 'budi@simantan.id', 'role' => 'petani', 'status' => 'aktif'],
            ['nama' => 'Siti Rahayu', 'email' => 'siti@simantan.id', 'role' => 'petani', 'status' => 'aktif'],
            ['nama' => 'Ahmad Hidayat', 'email' => 'ahmad@simantan.id', 'role' => 'pengurus', 'status' => 'aktif'],
            ['nama' => 'Dewi Lestari', 'email' => 'dewi@simantan.id', 'role' => 'pengurus', 'status' => 'aktif'],
            ['nama' => 'Ir. Hendra Wijaya', 'email' => 'hendra@simantan.id', 'role' => 'bpp', 'status' => 'aktif'],
            ['nama' => 'Dr. Ratna Sari', 'email' => 'ratna@simantan.id', 'role' => 'bpp', 'status' => 'aktif'],
            ['nama' => 'Superadmin', 'email' => 'admin@simantan.id', 'role' => 'admin', 'status' => 'aktif'],
            ['nama' => 'Joko Widodo', 'email' => 'joko@simantan.id', 'role' => 'petani', 'status' => 'aktif'],
            ['nama' => 'Mega Purnama', 'email' => 'mega@simantan.id', 'role' => 'petani', 'status' => 'nonaktif'],
            ['nama' => 'Rina Marlina', 'email' => 'rina@simantan.id', 'role' => 'pengurus', 'status' => 'aktif'],
        ];

        foreach ($users as $userData) {
            User::create([
                'name' => $userData['nama'],
                'nama' => $userData['nama'],
                'email' => $userData['email'],
                'password' => Hash::make('password'),
                'role' => $userData['role'],
                'status' => $userData['status'],
                'email_verified_at' => now(),
            ]);
        }
    }
}
