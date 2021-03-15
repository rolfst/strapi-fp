#!/bin/sh
set -ea

_stopStrapi()
{
  echo "Stopping strapi"
  kill -SIGINT "$strapiPID"
  wait "$strapiPID"
}

trap _stopStrapi SIGTERM SIGINT

strapi start &

strapiPID=$!
wait "$strapiPID"
