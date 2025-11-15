FROM dunglas/frankenphp

ARG UID=1000
ARG GID=1000

RUN install-php-extensions \
	pdo_pgsql \
	gd \
	intl \
	zip \
	opcache

# Be sure to replace "your-domain-name.example.com" by your domain name
ENV SERVER_NAME=mypocket.ensoo.com.mx
# If you want to disable HTTPS, use this value instead:
ENV SERVER_NAME=:80

# Enable PHP production settings
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Copy the PHP files of your project in the public directory
COPY . /app

RUN groupadd -g $GID appgroup && \
    useradd -ms /bin/bash --no-user-group -g appgroup -u $UID appuser

USER appuser
