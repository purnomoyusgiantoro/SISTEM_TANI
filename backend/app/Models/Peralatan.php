<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Peralatan extends Model
{
    use SoftDeletes;

    protected $table = 'peralatan';

    protected $fillable = [
        'nama',
        'kategori',
        'deskripsi',
        'harga_per_hari',
        'stok',
        'tersedia',
        'gambar',
        'kondisi',
    ];

    protected function casts(): array
    {
        return [
            'harga_per_hari' => 'integer',
            'stok' => 'integer',
            'tersedia' => 'integer',
        ];
    }

    public function sewa(): HasMany
    {
        return $this->hasMany(Sewa::class);
    }
}
