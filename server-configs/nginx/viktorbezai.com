# All plain HTTP, every hostname we answer for, straight to the canonical origin.
server {
    listen 80;
    server_name viktorbezai.com www.viktorbezai.com
                viktorbezai.online www.viktorbezai.online;
    return 301 https://viktorbezai.com$request_uri;
}

# Legacy domain: apex and www ONLY. Never widen this to *.viktorbezai.online.
# prepenglish. and prepcelpip. are served by the EnvolPrep vhost, and a
# duplicate server_name is only an nginx *warning*, so `nginx -t` would pass
# while one of the two vhosts silently stopped answering.
server {
    listen 443 ssl;
    http2 on;
    server_name viktorbezai.online www.viktorbezai.online;

    ssl_certificate /etc/letsencrypt/live/viktorbezai.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/viktorbezai.online/privkey.pem;

    return 301 https://viktorbezai.com$request_uri;
}

# www -> apex, so only one hostname is ever canonical.
server {
    listen 443 ssl;
    http2 on;
    server_name www.viktorbezai.com;

    ssl_certificate /etc/letsencrypt/live/viktorbezai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/viktorbezai.com/privkey.pem;

    return 301 https://viktorbezai.com$request_uri;
}

# Primary domain
server {
    listen 443 ssl;
    http2 on;
    server_name viktorbezai.com;

    ssl_certificate /etc/letsencrypt/live/viktorbezai.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/viktorbezai.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    client_max_body_size 25M;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Maintenance mode check
    set $maintenance 0;
    if (-f /var/www/maintenance-vib.flag) {
        set $maintenance 1;
    }

    # Show the branded maintenance page both when the flag is set (explicit
    # deploy) and when an upstream is unreachable/timing out (502/504) - the
    # latter is the safety net so a startup window never leaks a raw gateway
    # error. All three are normalized to 503 (temporary) for clients/Cloudflare.
    proxy_intercept_errors on;
    error_page 502 503 504 =503 @maintenance;

    # Maintenance page location
    location @maintenance {
        root /var/www;
        rewrite ^(.*)$ /maintenance-vib.html break;
    }

    # Static files
    location /static/ {
        alias /home/deploy/vib/backend/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias /home/deploy/vib/backend/media/;
        expires 1d;
    }

    # API & Admin -> Backend (port 8002)
    location /api/ {
        if ($maintenance) {
            return 503;
        }
        proxy_pass http://127.0.0.1:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;
    }

    location /admin/ {
        if ($maintenance) {
            return 503;
        }
        proxy_pass http://127.0.0.1:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 180s;
    }

    # Next.js static assets
    location /_next/ {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Frontend (everything else)
    location / {
        if ($maintenance) {
            return 503;
        }
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
