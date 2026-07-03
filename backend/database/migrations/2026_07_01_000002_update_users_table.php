<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['petani', 'pengurus', 'bpp', 'admin'])->default('petani')->after('password');
            $table->string('avatar', 255)->nullable()->after('role');
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif')->after('avatar');
            $table->timestamp('last_login_at')->nullable()->after('status');
            $table->softDeletes();

            $table->index('role');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'avatar', 'status', 'last_login_at']);
            $table->dropSoftDeletes();
        });
    }
};
