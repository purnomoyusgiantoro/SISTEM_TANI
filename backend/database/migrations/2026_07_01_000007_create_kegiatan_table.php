<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kegiatan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('petani_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('lahan_id')->constrained('lahan')->cascadeOnDelete();
            $table->enum('jenis', ['tanam', 'pemupukan', 'penyemprotan', 'panen', 'pengolahan', 'irigasi', 'perawatan']);
            $table->text('deskripsi');
            $table->date('tanggal');
            $table->string('foto', 255)->nullable();
            $table->timestamps();

            $table->index('petani_id');
            $table->index('lahan_id');
            $table->index('jenis');
            $table->index('tanggal');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kegiatan');
    }
};
