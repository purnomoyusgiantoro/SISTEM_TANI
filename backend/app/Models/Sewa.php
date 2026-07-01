<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Sewa extends Model
{
    protected $table = 'sewa';

    protected $fillable = [
        'kode_sewa',
        'petani_id',
        'peralatan_id',
        'tanggal_mulai',
        'tanggal_selesai',
        'durasi',
        'total_biaya',
        'status',
        'validasi',
        'validasi_oleh',
        'tanggal_validasi',
        'catatan',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
            'durasi' => 'integer',
            'total_biaya' => 'integer',
            'tanggal_validasi' => 'datetime',
        ];
    }

    public function petani(): BelongsTo
    {
        return $this->belongsTo(User::class, 'petani_id');
    }

    public function peralatan(): BelongsTo
    {
        return $this->belongsTo(Peralatan::class);
    }

    public function validator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'validasi_oleh');
    }

    public function tagihan(): HasOne
    {
        return $this->hasOne(Tagihan::class);
    }
}
