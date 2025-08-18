#!/bin/bash

set -e

echo "Starting My Pocket deployment"
cd /opt/ensoo/my-pocket
echo "---Pulling repository"
git pull origin main
echo "---Optimizing autoloader"
composer install --optimize-autoloader --no-dev
echo "---Run npm install---"
npm install
echo "---Generating assets---"
npm run build
echo "---Shutting down containers"
docker compose -f docker-compose.prod.yaml down
echo "---Building images"
docker compose -f docker-compose.prod.yaml build --no-cache
echo "---Starting containers"
docker compose -f docker-compose.prod.yaml up --wait
docker exec -it my-pocket-php-1 php artisan storage:link
echo "---Running migrations"
docker exec -it my-pocket-php-1 php artisan migrate --force
echo "Deployment finished"
