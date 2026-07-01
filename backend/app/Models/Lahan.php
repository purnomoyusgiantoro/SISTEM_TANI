<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lahan extends Model
{
    use SoftDeletes;

    protected $table = 'lahan';

    protected $fillable = [
        'pemilik_id',
        'lokasi',
        'luas',
        'jenis_lahan',
        'status_verifikasi',
        'koordinat',
        'tanggal_daftar',
        'verifikator_id',
        'tanggal_verifikasi',
        'catatan',
        'alasan_ditolak',
    ];

    protected function casts(): array
    {
        return [
            'luas' => 'decimal:2',
            'tanggal_daftar' => 'date',
            'tanggal_verifikasi' => 'datetime',
        ];
    }

    public function pemilik(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pemilik_id');
    }

    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verifikator_id');
    }

    public function kegiatan(): HasMany
    {
        return $this->hasMany(Kegiatan::class);
    }
}
