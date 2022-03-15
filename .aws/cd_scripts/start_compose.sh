#!/bin/bash
cd /app/board

docker-compose -f .aws/docker-compose.yml pull
docker-compose -f .aws/docker-compose.yml up -d
