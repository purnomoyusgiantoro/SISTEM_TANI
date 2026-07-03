# 🌱 RuangTani — Backend API

Backend RESTful API untuk sistem RuangTani, dibangun menggunakan **Laravel 11** dengan **PHP 8.2+**.

## Teknologi

- **Framework**: Laravel 11
- **Authentication**: Laravel Sanctum (Token-Based API)
- **Database**: SQLite (development) / MySQL (production)
- **File Storage**: Laravel Storage (public disk)

## Setup

```bash
# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations and seed
php artisan migrate:fresh --seed

# Create storage symlink
php artisan storage:link

# Start development server
php artisan serve
```

API berjalan di `http://localhost:8000`

## API Documentation

Lihat file `PRD_Backend_RuangTani.md` di root project untuk dokumentasi lengkap API endpoint.

## Akun Default

Password: `password`

| Role | Email |
|------|-------|
| Petani | budi@ruangtani.id |
| Pengurus | ahmad@ruangtani.id |
| BPP | hendra@ruangtani.id |
| Admin | admin@ruangtani.id |
