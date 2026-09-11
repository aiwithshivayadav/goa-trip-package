#!/usr/bin/env bash
# Deploy Goa Trip Package to VPS (srv1807055.hstgr.cloud).
# Run from the project root on your local machine:
#   bash deploy/deploy.sh
#
# Prerequisites:
#   1. SSH access to root@srv1807055.hstgr.cloud
#   2. .env.production exists in project root (with real secrets)
#   3. Docker + shared Caddy already running on VPS

set -euo pipefail

VPS="root@srv1807055.hstgr.cloud"
REMOTE_DIR="/opt/gtp"
TARBALL="gtp-deploy.tar.gz"

echo "==> Packing project..."
tar czf "$TARBALL" \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=.claude \
  --exclude=.env.local \
  .

echo "==> Uploading to VPS..."
ssh "$VPS" "mkdir -p $REMOTE_DIR"
scp "$TARBALL" "$VPS:$REMOTE_DIR/"
scp .env.production "$VPS:$REMOTE_DIR/.env.production"

echo "==> Building & starting on VPS..."
ssh "$VPS" "cd $REMOTE_DIR && tar xzf $TARBALL && rm $TARBALL && docker compose up -d --build"

rm -f "$TARBALL"
echo "==> Done! App running at gtp-app:5176 on VPS."
echo "    Don't forget to add the Caddy config (deploy/gtp.Caddyfile) if first deploy."
