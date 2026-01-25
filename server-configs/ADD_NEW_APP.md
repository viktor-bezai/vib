# Adding a New App to the Droplet

Quick guide to deploy another app alongside VIB and EnglishPreparation.

## Port Allocation

| App                | Backend | Frontend |
|--------------------|---------|----------|
| EnglishPreparation | 8001    | 3001     |
| VIB                | 8002    | 3002     |
| **Your New App**   | 8003    | 3003     |

## Steps

### 1. Create docker-compose.prod.yml

```yaml
version: '3.8'

services:
  newapp-backend:
    build:
      context: ./backend
    container_name: newapp-backend
    restart: unless-stopped
    ports:
      - "127.0.0.1:8003:8000"  # Change port!
    env_file:
      - .env
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2

  newapp-frontend:
    build:
      context: ./frontend
    container_name: newapp-frontend
    restart: unless-stopped
    ports:
      - "127.0.0.1:3003:3000"  # Change port!
    depends_on:
      - newapp-backend
```

### 2. Create nginx config

Create `/etc/nginx/sites-available/newapp.viktorbezai.online`:

```nginx
server {
    listen 80;
    server_name newapp.viktorbezai.online;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name newapp.viktorbezai.online;

    ssl_certificate /etc/letsencrypt/live/newapp.viktorbezai.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/newapp.viktorbezai.online/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;

    # API -> Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin -> Backend
    location /admin/ {
        proxy_pass http://127.0.0.1:8003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Frontend (everything else)
    location / {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 3. On Cloudflare

Add DNS A record:
- Name: `newapp` (or your subdomain)
- Content: `174.138.113.224`
- Proxy: **OFF (grey cloud)** - temporarily for SSL setup

### 4. On the Server

```bash
# SSH to server
ssh root@174.138.113.224

# Clone your repo
cd /home/deploy
git clone https://github.com/YOUR_USERNAME/newapp.git
git config --global --add safe.directory /home/deploy/newapp

# Get SSL certificate (nginx must be stopped)
systemctl stop nginx
certbot certonly --standalone -d newapp.viktorbezai.online
systemctl start nginx

# Enable nginx site
ln -s /etc/nginx/sites-available/newapp.viktorbezai.online /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Start containers
cd /home/deploy/newapp
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### 5. On Cloudflare

Turn proxy back **ON (orange cloud)** after SSL is working.

### 6. GitHub Actions (Optional)

Add secrets to your new repo:
- `VPS_HOST`: 174.138.113.224
- `VPS_USER`: root
- `VPS_SSH_KEY`: Your SSH private key
- `VPS_PORT`: 22

Create `.github/workflows/deploy.yml` similar to VIB's workflow.

## Checklist

- [ ] Unique container names (newapp-backend, newapp-frontend)
- [ ] Unique ports (8003/3003)
- [ ] DNS record in Cloudflare
- [ ] SSL certificate via certbot
- [ ] Nginx config created and enabled
- [ ] GitHub secrets configured
