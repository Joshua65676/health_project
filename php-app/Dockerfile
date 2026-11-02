FROM php:8.2-apache

# Install PHP extensions and system dependencies used by the API and Aiven TLS.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    git \
    unzip \
    curl \
    libzip-dev \
    libcurl4-openssl-dev \
    && docker-php-ext-install pdo pdo_mysql curl zip \
    && rm -rf /var/lib/apt/lists/* \
    && curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

ENV PORT=80
EXPOSE 80

WORKDIR /var/www/html

COPY . /var/www/html
COPY render-start.sh /usr/local/bin/render-start
RUN chmod +x /usr/local/bin/render-start

CMD ["render-start"]
