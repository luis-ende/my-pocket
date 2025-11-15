#!/bin/bash

set -e

echo "Starting My Pocket deployment"
cd /opt/ensoo/my-pocket
echo "---Pulling repository"
git pull origin main
echo "---Deleting unused not optimized image files"
find storage/app/public/media/ -mindepth 2 -maxdepth 2 -type f ! -path "*/conversions/*" -delete
echo "---Optimizing autoloader"
composer install --optimize-autoloader --no-dev
echo "---Run npm install---"
echo "------Export vars---"
export NVM_DIR="$HOME/.nvm"
echo "------Load nvm---"
# load nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# load node
echo "------Use node 20.19---"
nvm use 20.19 > /dev/null
echo "------Output node version---"
npm --version
npm install
echo "---Generating assets---"
npm run build
echo "---Shutting down containers"
docker compose -f docker-compose.prod.yaml down
echo "---Building images"
docker compose -f docker-compose.prod.yaml build --no-cache
echo "---Starting containers"
export UID=$(id -u)
export GID=$(id -g)
docker compose -f docker-compose.prod.yaml up --wait
docker exec my-pocket-php-1 php artisan storage:link
echo "---Running migrations"
docker exec my-pocket-php-1 php artisan migrate --force --no-interaction
echo "Deployment finished"
