# Server Setup Guide

Complete guide to deploy VIB and EnglishPreparation on a fresh Ubuntu server.

## Architecture

```
Server (Ubuntu)
├── nginx (host) - ports 80/443
│   ├── viktorbezai.online      → localhost:8002/3002
│   └── prepenglish.viktorbezai.online → localhost:8001/3001
│
├── VIB (/home/deploy/vib)
│   ├── vib-backend     → 127.0.0.1:8002
│   └── vib-frontend    → 127.0.0.1:3002
│
└── EnglishPreparation (/home/deploy/prepenglish)
    ├── ep-backend      → 127.0.0.1:8001
    ├── ep-frontend     → 127.0.0.1:3001
    ├── ep-celery
    ├── ep-celery-beat
    └── ep-redis
```

## Port Mapping

| App              | Backend | Frontend |
|------------------|---------|----------|
| VIB              | 8002    | 3002     |
| EnglishPreparation | 8001  | 3001     |

---

## Step 1: Initial Server Setup

```bash
# SSH into server
ssh root@YOUR_SERVER_IP

# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx git curl

# Start and enable services
systemctl start docker
systemctl enable docker
systemctl start nginx
systemctl enable nginx
```

## Step 2: Configure DNS (Cloudflare or your DNS provider)

Add A records pointing to your server IP:
- `viktorbezai.online` → YOUR_SERVER_IP
- `www.viktorbezai.online` → YOUR_SERVER_IP
- `prepenglish.viktorbezai.online` → YOUR_SERVER_IP

**Important:** If using Cloudflare, temporarily set proxy to "DNS only" (grey cloud) for SSL setup.

## Step 3: Get SSL Certificates

```bash
# Stop nginx temporarily
systemctl stop nginx

# Get cert for viktorbezai.online
certbot certonly --standalone -d viktorbezai.online -d www.viktorbezai.online

# Get cert for prepenglish (if needed)
certbot certonly --standalone -d prepenglish.viktorbezai.online -d prepcelpip.viktorbezai.online

# Verify certs
ls /etc/letsencrypt/live/
```

## Step 4: Configure nginx

```bash
# Remove default site
rm /etc/nginx/sites-enabled/default

# Copy nginx configs (from your local machine)
scp server-configs/nginx/viktorbezai.online root@YOUR_SERVER_IP:/etc/nginx/sites-available/
scp server-configs/nginx/prepenglish.viktorbezai.online root@YOUR_SERVER_IP:/etc/nginx/sites-available/

# Or create manually on server
nano /etc/nginx/sites-available/viktorbezai.online
# (paste content from server-configs/nginx/viktorbezai.online)

nano /etc/nginx/sites-available/prepenglish.viktorbezai.online
# (paste content from server-configs/nginx/prepenglish.viktorbezai.online)

# Enable sites
ln -s /etc/nginx/sites-available/viktorbezai.online /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/prepenglish.viktorbezai.online /etc/nginx/sites-enabled/

# Test and start nginx
nginx -t
systemctl start nginx
```

## Step 5: Clone Repositories

```bash
# VIB
mkdir -p /var/www
cd /var/www
git clone https://github.com/YOUR_USERNAME/vib.git
git config --global --add safe.directory /home/deploy/vib

# EnglishPreparation
mkdir -p /home/deploy
cd /home/deploy
git clone https://github.com/YOUR_USERNAME/EnglishPreparation.git prepenglish
git config --global --add safe.directory /home/deploy/prepenglish
```

## Step 6: Configure GitHub Secrets

### VIB Repository (Settings → Secrets → Actions)

| Secret | Value |
|--------|-------|
| `VPS_HOST` | YOUR_SERVER_IP |
| `VPS_USER` | root |
| `VPS_SSH_KEY` | Your SSH private key |
| `VPS_PORT` | 22 |
| `SECRET_KEY` | Django secret key |
| `POSTGRES_NAME` | vib-database |
| `POSTGRES_HOST` | Your DB host |
| `POSTGRES_USER` | vibuser |
| `POSTGRES_PASSWORD` | Your DB password |
| `POSTGRES_PORT` | 25060 |
| `NEXT_PUBLIC_API_BASE_URL` | https://viktorbezai.online |

### EnglishPreparation Repository

| Secret | Value |
|--------|-------|
| `DROPLET_HOST` | YOUR_SERVER_IP |
| `DROPLET_USER` | root |
| `DROPLET_SSH_KEY` | Your SSH private key |
| `DROPLET_PORT` | 22 |
| ... | (other secrets as needed) |

## Step 7: First Deployment

Push to main/master branch, or trigger manually:

```bash
# On server, for initial setup:

# VIB
cd /home/deploy/vib
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# EnglishPreparation
cd /home/deploy/prepenglish/docker
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## Step 8: Enable Cloudflare Proxy (Optional)

After everything works, you can switch back to orange cloud (Proxied) in Cloudflare.
Set SSL mode to "Full (strict)" in Cloudflare SSL/TLS settings.

---

## Maintenance Commands

### View logs
```bash
# VIB
docker logs vib-backend
docker logs vib-frontend

# EnglishPreparation
docker logs ep-backend
docker logs ep-frontend

# nginx
tail -f /var/log/nginx/error.log
```

### Restart services
```bash
# VIB only
cd /home/deploy/vib
docker-compose -f docker-compose.prod.yml restart

# EnglishPreparation only
cd /home/deploy/prepenglish/docker
docker-compose -f docker-compose.prod.yml restart

# nginx
systemctl reload nginx
```

### SSL renewal (automatic, but manual if needed)
```bash
certbot renew
systemctl reload nginx
```

### Check what's running
```bash
docker ps
systemctl status nginx
```

---

## Troubleshooting

### Port already in use
```bash
lsof -i :80
lsof -i :443
# Stop the process using the port
```

### nginx won't start
```bash
nginx -t  # Check config syntax
journalctl -u nginx  # View logs
```

### Container won't start
```bash
docker-compose -f docker-compose.prod.yml logs
```

### SSL certificate issues
```bash
certbot certificates  # List certs
certbot renew --dry-run  # Test renewal
```
