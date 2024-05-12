#!/bin/bash
echo "Starting tournament-predictions application"
export ROOT_URL=https://em.fctwister.ee
meteor --port 3033 --production --settings settings.prod.json &>> /home/betfield/logs/euro2024.log 
