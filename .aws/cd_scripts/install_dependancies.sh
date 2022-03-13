#!/bin/bash
yum install -y docker || exit 0
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose || exit 0
chmod +x /usr/local/bin/docker-compose || exit 0
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose || exit 0

systemctl enable --now docker
