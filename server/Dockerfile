# Use FrankenPHP for a high-performance, single-container setup
FROM dunglas/frankenphp:1.1-php8.3-alpine

# Install system dependencies
RUN apk add --no-cache \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    unzip \
    git \
    oniguruma-dev \
    postgresql-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl gd

# Set working directory
WORKDIR /app

# Copy the application code (respecting .dockerignore)
COPY . /app

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install application dependencies
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Set permissions for Laravel
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Configure FrankenPHP
ENV FRANKENPHP_CONFIG="worker ./public/index.php"

# Start FrankenPHP using the PORT environment variable provided by Cloud Run
CMD ["sh", "-c", "frankenphp run --config /etc/caddy/Caddyfile --env PORT=${PORT:-8080}"]
