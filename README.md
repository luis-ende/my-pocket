# My Pocket

A self-made app for saving and organizing web bookmarks. 

## Stack

- Laravel 12
- Inertia.js
- React
- PostgreSQL
- Redis

## Features
 
- Save, tag and manage bookmarks
- Mark bookmarks as read, favorite, broken, archived
- Group bookmarks in collections
- Manage bookmarks with broken links
- Dashboard with bookmarks stats and recommendations
- Search bookmarks by specific tags
- Global bookmark search by keyword
- Import bookmarks from CSV source files

## Development

Use Sail as dev environment:
`./vendor/bin/sail up -d`
`npm run dev`

## Deployment

See deployment script: `scripts/deploy_docker.sh` 
