#!/bin/bash

# Script pour obtenir un certificat Let's Encrypt
# À exécuter AVANT de lancer docker-compose.letsencrypt.yml

echo "🔐 Configuration Let's Encrypt"
echo ""

# Vérifier que les variables sont définies
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "❌ Erreur : Variables d'environnement manquantes"
    echo ""
    echo "Usage:"
    echo "  DOMAIN=votre-domaine.com EMAIL=votre@email.com ./setup-letsencrypt.sh"
    echo ""
    echo "Exemple:"
    echo "  DOMAIN=example.com EMAIL=admin@example.com ./setup-letsencrypt.sh"
    exit 1
fi

echo "📋 Configuration:"
echo "   Domaine: $DOMAIN"
echo "   Email: $EMAIL"
echo ""

# Créer les volumes nécessaires
docker volume create certbot-certs
docker volume create certbot-www

echo "🚀 Obtention du certificat Let's Encrypt..."
echo ""

# Obtenir le certificat avec Certbot
docker run --rm \
    -v certbot-certs:/etc/letsencrypt \
    -v certbot-www:/var/www/certbot \
    certbot/certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN" \
    -d "www.$DOMAIN"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Certificat Let's Encrypt obtenu avec succès !"
    echo ""
    echo "📝 Prochaines étapes:"
    echo "   1. Éditer nginx-letsencrypt.conf et remplacer 'votre-domaine.com' par '$DOMAIN'"
    echo "   2. Lancer l'application: docker-compose -f docker-compose.letsencrypt.yml up -d"
    echo ""
    echo "🔄 Le certificat sera renouvelé automatiquement tous les 12h"
else
    echo ""
    echo "❌ Échec de l'obtention du certificat"
    echo "   Vérifie que ton domaine pointe vers ce serveur"
    exit 1
fi
