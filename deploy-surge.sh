#!/bin/bash
# Deploy veil-static to a surge.sh domain.
# Usage: ./deploy-surge.sh your-domain.surge.sh
#
# Only needed on first deploy (or when adding new games / updating scramjet).
# After that, pushing to GitHub auto-updates all surge sites via jsDelivr CDN.

set -e

DOMAIN=${1:?"Usage: $0 <domain.surge.sh>"}

echo "Deploying to $DOMAIN ..."
surge . "$DOMAIN"
echo "Done! $DOMAIN is live."
echo ""
echo "Future code updates (app.js, style.css, proxy.js, etc.) are automatic."
echo "Just push to GitHub — jsDelivr CDN picks up changes within ~10 minutes."
echo "To force an immediate CDN refresh:"
echo "  curl https://purge.jsdelivr.net/gh/Novaro1/veil-static@main/app.js"
echo "  curl https://purge.jsdelivr.net/gh/Novaro1/veil-static@main/style.css"
echo "  curl https://purge.jsdelivr.net/gh/Novaro1/veil-static@main/proxy.js"
echo "  curl https://purge.jsdelivr.net/gh/Novaro1/veil-static@main/stars.js"
echo "  curl https://purge.jsdelivr.net/gh/Novaro1/veil-static@main/ai.js"
echo "  curl https://purge.jsdelivr.net/gh/Novaro1/veil-static@main/music.js"
