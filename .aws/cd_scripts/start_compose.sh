#!/bin/bash
cd /app/board
docker-compose -f .aws/docker-compose-codedeploy.yml up -d
