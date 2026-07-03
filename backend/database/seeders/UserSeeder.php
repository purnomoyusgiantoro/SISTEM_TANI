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
            ['nama' => 'Budi Santoso', 'email' => 'budi@ruangtani.id', 'role' => 'petani', 'status' => 'aktif'],
            ['nama' => 'Siti Rahayu', 'email' => 'siti@ruangtani.id', 'role' => 'petani', 'status' => 'aktif'],
            ['nama' => 'Ahmad Hidayat', 'email' => 'ahmad@ruangtani.id', 'role' => 'pengurus', 'status' => 'aktif'],
            ['nama' => 'Dewi Lestari', 'email' => 'dewi@ruangtani.id', 'role' => 'pengurus', 'status' => 'aktif'],
            ['nama' => 'Ir. Hendra Wijaya', 'email' => 'hendra@ruangtani.id', 'role' => 'bpp', 'status' => 'aktif'],
            ['nama' => 'Dr. Ratna Sari', 'email' => 'ratna@ruangtani.id', 'role' => 'bpp', 'status' => 'aktif'],
            ['nama' => 'Superadmin', 'email' => 'admin@ruangtani.id', 'role' => 'admin', 'status' => 'aktif'],
            ['nama' => 'Joko Widodo', 'email' => 'joko@ruangtani.id', 'role' => 'petani', 'status' => 'aktif'],
            ['nama' => 'Mega Purnama', 'email' => 'mega@ruangtani.id', 'role' => 'petani', 'status' => 'nonaktif'],
            ['nama' => 'Rina Marlina', 'email' => 'rina@ruangtani.id', 'role' => 'pengurus', 'status' => 'aktif'],
        ];

        foreach ($users as $userData) {
            User::create([
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
