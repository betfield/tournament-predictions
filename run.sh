#!/bin/bash
echo "Starting tournament-predictions application"
export ROOT_URL=https://nr8.ee/
exec meteor --port 3033 --production --settings settings.prod.json >> /home/betfield/logs/wc2026.log 2>&1 
