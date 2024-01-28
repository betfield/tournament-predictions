#!/bin/bash
echo "Starting wc2022 application"
export ROOT_URL=https://mm.fctwister.ee
meteor --port 3033 --production --settings settings.prod.json &>> /home/betfield/logs/wc2022.log 
