<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, SoftDeletes;

    protected $fillable = [
        'nama',
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'status',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- Relationships ---

    public function lahan(): HasMany
    {
        return $this->hasMany(Lahan::class, 'pemilik_id');
    }

    public function sewa(): HasMany
    {
        return $this->hasMany(Sewa::class, 'petani_id');
    }

    public function kegiatan(): HasMany
    {
        return $this->hasMany(Kegiatan::class, 'petani_id');
    }

    public function tagihan(): HasMany
    {
        return $this->hasMany(Tagihan::class, 'petani_id');
    }

    public function notifikasi(): HasMany
    {
        return $this->hasMany(Notifikasi::class);
    }

    public function berita(): HasMany
    {
        return $this->hasMany(Berita::class, 'penulis_id');
    }

    public function logAktivitas(): HasMany
    {
        return $this->hasMany(LogAktivitas::class);
    }

    // --- Helpers ---

    public function isRole(string $role): bool
    {
        return $this->role === $role;
    }

    public function isAktif(): bool
    {
        return $this->status === 'aktif';
    }
}
