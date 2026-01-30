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
RUN docker-php-ext-install pdo pdo_mysql mbcstring zip exif pcntl gd

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
ENV PORT=8080

# Expose the port used by Cloud Run
EXPOSE 8080

# Clean up
RUN rm -rf /root/.composer

# Start FrankenPHP
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile", "--env", "PORT=8080"]
