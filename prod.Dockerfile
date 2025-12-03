FROM dunglas/frankenphp

RUN install-php-extensions \
    pdo_pgsql \
    gd \
    intl \
    zip \
    opcache \
    pcntl \
    posix \
    redis

RUN apt-get update && apt-get install -y supervisor && \
    rm -rf /var/lib/apt/lists/*

ENV SERVER_NAME=:80

RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY . /app

RUN mkdir -p /var/log/supervisor /etc/supervisor/conf.d
COPY ./docker/prod/supervisor/supervisord.conf /etc/supervisor/supervisord.conf
COPY ./docker/prod/supervisor/queue-worker.conf /etc/supervisor/conf.d/queue-worker.conf

COPY ./docker/prod/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

CMD ["/usr/local/bin/start.sh"]
