#!/bin/bash

# Script pour générer des certificats SSL auto-signés pour le développement
# NE PAS utiliser en production - utiliser Let's Encrypt ou des certificats valides

echo "🔐 Génération de certificats SSL auto-signés..."

# Créer les répertoires si nécessaire
mkdir -p ssl/certs ssl/private

# Générer une clé privée et un certificat auto-signé valide 365 jours
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/private/key.pem \
    -out ssl/certs/cert.pem \
    -subj "/C=FR/ST=France/L=Paris/O=Development/OU=IT/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,DNS:*.localhost,IP:127.0.0.1"

# Définir les bonnes permissions
chmod 600 ssl/private/key.pem
chmod 644 ssl/certs/cert.pem

echo "✅ Certificats SSL générés avec succès !"
echo "📁 Clé privée : ssl/private/key.pem"
echo "📁 Certificat : ssl/certs/cert.pem"
echo ""
echo "⚠️  ATTENTION : Ce sont des certificats auto-signés."
echo "   Ton navigateur affichera un avertissement de sécurité."
echo "   Pour la production, utilise Let's Encrypt ou des certificats valides."
