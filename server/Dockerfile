# Stage 1: Build dependencies
FROM composer:latest AS builder
WORKDIR /app

# Copy only the composer files first to leverage Docker cache
COPY composer.json composer.lock ./

# Install dependencies without scripts and dev-packages
# Added --ignore-platform-reqs as we previously identified environment mismatches
RUN composer install --no-interaction --optimize-autoloader --no-dev --ignore-platform-reqs --no-scripts

# Stage 2: Production Runtime
FROM dunglas/frankenphp:1.1-php8.4-alpine

# Set working directory
WORKDIR /app

# Install runtime system dependencies (libraries needed to run PHP extensions)
RUN apk add --no-cache \
    libpng \
    libjpeg-turbo \
    freetype \
    libzip \
    oniguruma \
    postgresql-libs \
    icu-libs

# Install Build dependencies, compile PHP extensions, and cleanup in ONE layer to keep image small
RUN apk add --no-cache --virtual .build-deps \
    $PHPIZE_DEPS \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    oniguruma-dev \
    postgresql-dev \
    icu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) pdo pdo_mysql pdo_pgsql mbstring zip exif pcntl gd bcmath intl opcache \
    && apk del .build-deps

# Copy application source code
COPY . /app

# Copy vendor directory from the builder stage
COPY --from=builder /app/vendor /app/vendor

# Set standard Laravel permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Production PHP settings
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Configure FrankenPHP
ENV FRANKENPHP_CONFIG="worker ./public/index.php"

# Start FrankenPHP using the PORT environment variable provided by Cloud Run
# Note: Migrations on startup is common for small Cloud Run apps, but ensure DB connection is ready
CMD ["sh", "-c", "php artisan migrate --force ; frankenphp php-server --listen :${PORT:-8080} --root ./public"]
