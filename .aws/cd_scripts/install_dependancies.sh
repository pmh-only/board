#!/bin/bash
yum install -y docker || exit 0

version="2.3.3"

if ! docker-compose -v | grep $version;
then
  rm /usr/local/bin/docker-compose

  curl -L "https://github.com/docker/compose/releases/download/v$version/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
fi

systemctl enable --now docker
