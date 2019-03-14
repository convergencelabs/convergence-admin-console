#!/bin/sh

require_env_var() {
  if [ "$1" == "" ]; then
    echo "Error: '$2' was not set."
    echo "Aborting."
    exit 1
  else
    echo "   $2: $1"
  fi
}

echo "Convergence Admin Console"
echo "Checking required environment variables..."

require_env_var $CONVERGENCE_CONSOLE_BASE_URL "CONVERGENCE_CONSOLE_BASE_URL"
require_env_var $CONVERGENCE_SERVER_REST_API "CONVERGENCE_SERVER_REST_API"
require_env_var $CONVERGENCE_SERVER_REALTIME_API "CONVERGENCE_SERVER_REALTIME_API"

echo "All required environment variables are set.  Booting."
echo ""

exec supervisord --configuration /etc/supervisord.conf