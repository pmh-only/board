#!/bin/bash
aws ecr get-login-password --region ap-northeast-2 | docker login --username AWS --password-stdin 790946953677.dkr.ecr.ap-northeast-2.amazonaws.com
