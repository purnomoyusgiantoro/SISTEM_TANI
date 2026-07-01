<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Tagihan extends Model
{
    protected $table = 'tagihan';

    protected $fillable = [
        'kode_tagihan',
        'sewa_id',
        'petani_id',
        'jumlah',
        'tanggal_tagihan',
        'jatuh_tempo',
        'status',
        'tanggal_bayar',
        'bukti_pembayaran',
        'jumlah_dibayar',
        'catatan_pembayaran',
        'verifikasi_oleh',
        'tanggal_verifikasi',
    ];

    protected function casts(): array
    {
        return [
            'jumlah' => 'integer',
            'jumlah_dibayar' => 'integer',
            'tanggal_tagihan' => 'date',
            'jatuh_tempo' => 'date',
            'tanggal_bayar' => 'date',
            'tanggal_verifikasi' => 'datetime',
        ];
    }

    public function sewa(): BelongsTo
    {
        return $this->belongsTo(Sewa::class);
    }

    public function petani(): BelongsTo
    {
        return $this->belongsTo(User::class, 'petani_id');
    }

    public function verifikator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verifikasi_oleh');
    }
}
