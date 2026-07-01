<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organisasi extends Model
{
    protected $table = 'organisasi';

    protected $fillable = [
        'nama',
        'jabatan',
        'parent_id',
        'urutan',
        'user_id',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Organisasi::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Organisasi::class, 'parent_id')->orderBy('urutan')->with('children');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
