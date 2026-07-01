<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('berita', function (Blueprint $table) {
            $table->id();
            $table->string('judul', 255);
            $table->string('kategori', 100);
            $table->text('isi');
            $table->foreignId('penulis_id')->constrained('users')->cascadeOnDelete();
            $table->date('tanggal');
            $table->string('gambar', 255)->nullable();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->timestamps();
            $table->softDeletes();

            $table->index('penulis_id');
            $table->index('status');
            $table->index('kategori');
            $table->index('tanggal');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('berita');
    }
};
