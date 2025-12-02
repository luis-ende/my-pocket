#!/bin/sh

supervisord -c /etc/supervisor/supervisord.conf
exec frankenphp run --config /etc/caddy/Caddyfile
