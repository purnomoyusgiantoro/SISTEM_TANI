<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Backup extends Model
{
    protected $table = 'backups';

    protected $fillable = [
        'nama_file',
        'ukuran',
        'tipe',
        'status',
        'path',
        'catatan',
    ];
}
