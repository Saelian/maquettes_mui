# 🔐 Guide de déploiement Docker avec SSL/HTTPS

Ce guide explique comment héberger l'application avec HTTPS en utilisant Docker.

## 📋 Table des matières

1. [Option 1 : Certificats auto-signés (Développement)](#option-1--certificats-auto-signés-développement)
2. [Option 2 : Certificats personnalisés](#option-2--certificats-personnalisés)
3. [Option 3 : Let's Encrypt (Production)](#option-3--lets-encrypt-production)
4. [Ports et accès](#ports-et-accès)
5. [Dépannage](#dépannage)

---

## Option 1 : Certificats auto-signés (Développement)

**⚠️ À utiliser uniquement pour le développement/test local.**

### Étapes

1. **Générer les certificats auto-signés**
   ```bash
   ./generate-ssl-certs.sh
   ```

2. **Démarrer l'application**
   ```bash
   docker-compose up -d --build
   ```

3. **Accéder à l'application**
   - HTTP : http://localhost:3000 (redirige vers HTTPS)
   - HTTPS : https://localhost:3443

### Note importante
Ton navigateur affichera un avertissement de sécurité car le certificat est auto-signé. C'est normal pour le développement.

- **Chrome/Edge** : Clique sur "Avancé" → "Continuer vers localhost"
- **Firefox** : Clique sur "Avancé" → "Accepter le risque et continuer"

---

## Option 2 : Certificats personnalisés

Si tu as déjà des certificats SSL valides (fournis par ton hébergeur ou une autorité de certification).

### Étapes

1. **Créer les dossiers**
   ```bash
   mkdir -p ssl/certs ssl/private
   ```

2. **Copier tes certificats**
   ```bash
   # Copie ton certificat
   cp /chemin/vers/ton/certificat.pem ssl/certs/cert.pem

   # Copie ta clé privée
   cp /chemin/vers/ta/cle-privee.pem ssl/private/key.pem
   ```

3. **Définir les bonnes permissions**
   ```bash
   chmod 600 ssl/private/key.pem
   chmod 644 ssl/certs/cert.pem
   ```

4. **Démarrer l'application**
   ```bash
   docker-compose up -d --build
   ```

---

## Option 3 : Let's Encrypt (Production)

**✅ Recommandé pour la production** - Certificats SSL gratuits et automatiquement renouvelés.

### Prérequis

- Un nom de domaine pointant vers ton serveur
- Les ports 80 et 443 ouverts et accessibles depuis Internet
- Une adresse email valide

### Étapes

1. **Obtenir un certificat Let's Encrypt**
   ```bash
   DOMAIN=votre-domaine.com EMAIL=votre@email.com ./setup-letsencrypt.sh
   ```

2. **Éditer la configuration nginx**

   Ouvre `nginx-letsencrypt.conf` et remplace `votre-domaine.com` par ton domaine réel :
   ```nginx
   server_name ton-domaine.com www.ton-domaine.com;
   ```

   Et aussi dans la section des certificats :
   ```nginx
   ssl_certificate /etc/letsencrypt/live/ton-domaine.com/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/ton-domaine.com/privkey.pem;
   ```

3. **Démarrer l'application avec Let's Encrypt**
   ```bash
   docker-compose -f docker-compose.letsencrypt.yml up -d --build
   ```

4. **Vérifier le statut**
   ```bash
   docker-compose -f docker-compose.letsencrypt.yml logs -f
   ```

### Renouvellement automatique

Le certificat Let's Encrypt est valide 90 jours. Le container Certbot vérifie automatiquement et renouvelle le certificat tous les 12h si nécessaire.

Pour forcer un renouvellement manuel :
```bash
docker-compose -f docker-compose.letsencrypt.yml exec certbot certbot renew
```

---

## Ports et accès

### Configuration par défaut

| Service | Port hôte | Port container | URL d'accès |
|---------|-----------|----------------|-------------|
| HTTP | 3000 | 80 | http://localhost:3000 |
| HTTPS | 3443 | 443 | https://localhost:3443 |

### Modifier les ports

Édite `docker-compose.yml` :

```yaml
ports:
  - "80:80"    # HTTP standard
  - "443:443"  # HTTPS standard
```

---

## Commandes utiles

### Gestion de l'application

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Voir les logs
docker-compose logs -f

# Redémarrer
docker-compose restart

# Rebuild complet
docker-compose up -d --build --force-recreate
```

### Gestion des certificats

```bash
# Vérifier l'expiration du certificat
openssl x509 -in ssl/certs/cert.pem -noout -dates

# Voir les détails du certificat
openssl x509 -in ssl/certs/cert.pem -noout -text

# Tester la connexion SSL
openssl s_client -connect localhost:3443
```

---

## Dépannage

### Le navigateur affiche "Connexion non sécurisée"

**Cause** : Certificats auto-signés ou expirés

**Solution** :
- Pour le développement : accepte l'avertissement (c'est normal)
- Pour la production : utilise Let's Encrypt ou des certificats valides

### Erreur "Permission denied" sur les certificats

**Solution** :
```bash
chmod 600 ssl/private/key.pem
chmod 644 ssl/certs/cert.pem
```

### Let's Encrypt échoue

**Vérifications** :
1. Le domaine pointe-t-il vers ton serveur ?
   ```bash
   dig +short votre-domaine.com
   ```

2. Les ports 80 et 443 sont-ils ouverts ?
   ```bash
   sudo netstat -tlnp | grep -E ':80|:443'
   ```

3. Un autre service utilise-t-il déjà ces ports ?
   ```bash
   sudo lsof -i :80
   sudo lsof -i :443
   ```

### L'application ne démarre pas

**Solution** :
```bash
# Voir les logs détaillés
docker-compose logs -f

# Vérifier les certificats existent
ls -la ssl/certs/ ssl/private/

# Tester la configuration nginx
docker-compose exec app nginx -t
```

---

## Sécurité

### ✅ Bonnes pratiques

- **Jamais** commiter les certificats dans Git (déjà dans `.gitignore`)
- Utiliser des mots de passe forts pour les clés privées
- Renouveler régulièrement les certificats
- Activer HSTS (déjà configuré dans nginx)
- Garder nginx et les dépendances à jour

### 🔒 Headers de sécurité configurés

La configuration nginx inclut automatiquement :
- **HSTS** : Force HTTPS pendant 1 an
- **X-Frame-Options** : Protection contre clickjacking
- **X-Content-Type-Options** : Protection contre MIME sniffing
- **X-XSS-Protection** : Protection XSS basique

---

## Support

Pour plus d'informations :
- Documentation Let's Encrypt : https://letsencrypt.org/docs/
- Documentation nginx SSL : https://nginx.org/en/docs/http/configuring_https_servers.html
