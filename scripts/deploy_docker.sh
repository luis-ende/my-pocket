#!/bin/bash

set -e

echo "Starting My Pocket deployment"
cd /opt/ensoo/my-pocket
echo "---Pulling repository"
git pull
echo "---Backing up media files"
CONTAINER="my-pocket-php-1"
if docker ps --filter "name=^/${CONTAINER}$" --filter "status=running" --format '{{.Names}}' | grep -wq "$CONTAINER"; then
    docker cp my-pocket-php-1:/app/storage/app/public/. storage/app/public/
fi
echo "---Optimizing autoloader"
composer install --optimize-autoloader --no-dev
echo "---Generating assets---"
npm run build
echo "---Shutting down containers"
docker compose -f docker-compose.prod.yaml down
echo "---Building images"
docker compose -f docker-compose.prod.yaml build --no-cache
echo "---Starting containers"
docker compose -f docker-compose.prod.yaml up --wait
docker exec -it my-pocket-php-1 php artisan storage:link
echo "Deployment finished"
