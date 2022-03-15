#!/bin/bash
cd /app/board || exit 0
docker-compose -f .aws/docker-compose.yml down || exit 0
