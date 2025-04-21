FROM serversideup/php:8.3-fpm AS base

# Switch to root so we can do root things
USER root

# Update package lists and install GD dependencies (might be redundant)
RUN apt-get update && apt-get install -y \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*
# Install the exif extension with root permissions
RUN install-php-extensions exif

# Install the gd extension
RUN install-php-extensions gd

# Install JavaScript dependencies
ARG NODE_VERSION=20.18.0
ENV PATH=/usr/local/node/bin:$PATH
RUN curl -sLS https://github.com/nodenv/node-build/archive/master.tar.gz | tar xz -C /tmp/ && \
    /tmp/node-build-master/bin/node-build "${NODE_VERSION}" /usr/local/node && \
    corepack enable && \
    rm -rf /tmp/node-build-master

# Drop back to our unprivileged user
USER www-data

FROM base

ENV SSL_MODE="off"
# ENV AUTORUN_ENABLED="true"
ENV PHP_OPCACHE_ENABLE="1"
ENV HEALTHCHECK_PATH="/up"
ENV APP_BASE_DIR="/var/www/html/imagexbasic"

# Create and set proper working directory with correct permissions
USER root
RUN mkdir -p /var/www/html/imagexbasic && chown www-data:www-data /var/www/html/imagexbasic
WORKDIR /var/www/html/imagexbasic

# Copy the app files with the correct command
# COPY --chown=www-data:www-data . .

USER www-data
