#!/bin/bash
cd /app

docker-compose -f .aws/docker-compose.yml pull
docker-compose -f .aws/docker-compose.yml up -d
