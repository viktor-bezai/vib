# Server Setup Guide

Complete guide to deploy VIB and EnvolPrep on a fresh Ubuntu server.

> **Want to add another app?** See [ADD_NEW_APP.md](./ADD_NEW_APP.md) for a quick guide.

## Quick Reference

| | |
|---|---|
| **Server IP** | 174.138.113.224 |
| **SSH** | `ssh root@174.138.113.224` |
| **VIB URL** | https://viktorbezai.com |
| **EnvolPrep URL** | https://envolprep.com |
| **VIB path** | /home/deploy/vib |
| **EnvolPrep path** | /home/deploy/prepenglish |

## Architecture

```
Server: 174.138.113.224 (Ubuntu)
├── nginx (host) - ports 80/443
│   ├── viktorbezai.com  → localhost:8002/3002  (this repo)
│   └── envolprep.com     → localhost:8001/3001  (EnvolPrep repo)
│
├── VIB (/home/deploy/vib)
│   ├── vib-backend     → 127.0.0.1:8002
│   └── vib-frontend    → 127.0.0.1:3002
│
└── EnvolPrep (/home/deploy/prepenglish)
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
- `viktorbezai.com` → YOUR_SERVER_IP
- `www.viktorbezai.com` → YOUR_SERVER_IP

Keep the `viktorbezai.online` zone too. Its apex and www 301 to `viktorbezai.com`, and
`prepenglish` / `prepcelpip` are EnvolPrep's legacy hosts. Do not retire it.

**Important:** If using Cloudflare, temporarily set proxy to "DNS only" (grey cloud) for SSL setup.

## Step 3: Get SSL Certificates

```bash
# Stop nginx temporarily (certbot needs port 80)
systemctl stop nginx

# Get cert for the current domain
certbot certonly --standalone -d viktorbezai.com -d www.viktorbezai.com

# Legacy domain: still needed, the 301 block terminates TLS for it
certbot certonly --standalone -d viktorbezai.online -d www.viktorbezai.online

# Verify certs were created
ls /etc/letsencrypt/live/

# Don't start nginx yet - configure it first in Step 4
```

## Step 4: Configure nginx

```bash
# Remove default site
rm /etc/nginx/sites-enabled/default

# Copy nginx configs (from your local machine)
scp server-configs/nginx/viktorbezai.com root@YOUR_SERVER_IP:/etc/nginx/sites-available/
# EnvolPrep ships its own vhost from its own repo; do not copy one from here.

# Or create manually on server
nano /etc/nginx/sites-available/viktorbezai.com
# (paste content from server-configs/nginx/viktorbezai.com)

# Enable sites
ln -s /etc/nginx/sites-available/viktorbezai.com /etc/nginx/sites-enabled/

# Test and start nginx
nginx -t
systemctl start nginx
```

## Step 5: Clone Repositories

```bash
# Create deploy directory
mkdir -p /home/deploy
cd /home/deploy

# Clone VIB
git clone https://github.com/YOUR_USERNAME/vib.git
git config --global --add safe.directory /home/deploy/vib

# Clone EnglishPreparation
git clone https://github.com/YOUR_USERNAME/EnvolPrep.git prepenglish
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
| `NEXT_PUBLIC_API_BASE_URL` | https://viktorbezai.com |

### EnglishPreparation Repository

| Secret | Value |
|--------|-------|
| `DROPLET_HOST` | YOUR_SERVER_IP |
| `DROPLET_USER` | root |
| `DROPLET_SSH_KEY` | Your SSH private key |
| `DROPLET_PORT` | 22 |
| ... | (other secrets as needed) |

## Step 7: First Deployment

**Option A: Via GitHub Actions (recommended)**

Just push to main/master branch. GitHub Actions will:
1. SSH to server
2. Pull latest code
3. Create .env from secrets
4. Build and start containers

**Option B: Manual deployment**

```bash
# On server:

# VIB - create .env first
cd /home/deploy/vib
cp .env.example .env
nano .env  # Fill in production values

# Build and start
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# EnglishPreparation - create .env first
cd /home/deploy/prepenglish
cp env.example .env
nano .env  # Fill in production values

# Build and start
cd docker
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## Step 8: Verify Everything Works

```bash
# Check containers are running
docker ps

# Check nginx is running
systemctl status nginx

# Test the sites
curl -I https://viktorbezai.com
curl -I https://viktorbezai.online   # expect 301 to viktorbezai.com
curl -I https://envolprep.com
```

## Step 9: Enable Cloudflare Proxy (Optional)

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

### Low disk space
```bash
# Check disk usage
df -h

# Clean up Docker (removes unused images, containers, volumes)
docker system prune -a -f

# Check what's using space
du -sh /var/lib/docker/*
```
