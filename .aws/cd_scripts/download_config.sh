#!/bin/bash
aws s3 cp s3://pmh-dev-board/uploads/settings.env /opt/codedeploy-agent/deployment-root/$DEPLOYMENT_GROUP_ID/$DEPLOYMENT_ID/deployment-archive/.env

