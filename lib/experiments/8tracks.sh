#!/bin/sh

# expects your 8tracks key as parm 1

curl "http://8tracks.com/mix_sets/all.json?api_key=$1&include=mixes" | json

# black_metal

# curl "http://8tracks.com/mix_sets/tags:anger:safe.json?api_key=$1&include=mixes" | json

# MIX_ID=5093714

# curl -H "Accept: application/json" "http://8tracks.com/mixes/$MIX_ID?api_key=$1" | json

# curl -H "Accept: application/json" "http://8tracks.com/sets/new.json?api_key=$1" | json

# PLAY_TOKEN=726744433

# curl -H "Accept: application/json" "http://8tracks.com/sets/$PLAY_TOKEN/play.json?api_key=$1&mix_id=$MIX_ID" | json

# result: set.track.url =
#    https://api.soundcloud.com/tracks/45734051/stream?client_id=3904229f42df3999df223f6ebf39a8fe
