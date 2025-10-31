#!/bin/bash

# Generate self-signed SSL certificate for development
# DO NOT use in production!

echo "🔐 Generating self-signed SSL certificate for development..."

# Output files
CERT_DIR="/opt/3daixs.com/ssl"
CERT_FILE="$CERT_DIR/fullchain.pem"
KEY_FILE="$CERT_DIR/privkey.pem"

# Certificate details
DOMAIN="3daixs.com"
COUNTRY="VN"
STATE="Hanoi"
CITY="Hanoi"
ORG="3DAIXS"
UNIT="IT"
EMAIL="admin@3daixs.com"

# Generate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$KEY_FILE" \
  -out "$CERT_FILE" \
  -subj "/C=$COUNTRY/ST=$STATE/L=$CITY/O=$ORG/OU=$UNIT/CN=$DOMAIN/emailAddress=$EMAIL"

if [ $? -eq 0 ]; then
    echo "✅ Certificate generated successfully!"
    echo ""
    echo "Files created:"
    echo "  Certificate: $CERT_FILE"
    echo "  Private Key: $KEY_FILE"
    echo ""
    echo "⚠️  WARNING: This is a SELF-SIGNED certificate."
    echo "    Only use for development/testing."
    echo "    Browsers will show security warning."
    echo ""
    echo "For production, use Let's Encrypt:"
    echo "  sudo certbot certonly --standalone -d 3daixs.com"
else
    echo "❌ Failed to generate certificate"
fi
