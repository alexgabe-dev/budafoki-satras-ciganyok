# VPS deploy guide (Nginx + PM2)

Ez az útmutató egy Linux VPS-en történő telepítéshez készült a projekthez. A szervert Nginx fordítja előre, a Node alkalmazást PM2 kezeli.

## 1. Előkészületek a VPS-en

SSH-bel csatlakozás után futtasd:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm nginx git curl ufw
sudo npm install -g pm2
```

Ha szükséges, állítsd be a tűzfalat:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 2. Projekt letöltése

```bash
cd /var/www
sudo git clone <YOUR_REPO_URL> budafoki-satras-ciganyok
cd budafoki-satras-ciganyok
sudo chown -R $USER:$USER /var/www/budafoki-satras-ciganyok
```

## 3. Futtatási környezet beállítása

Másold a példa környezeti változókat:

```bash
cp .env.example .env
```

A `.env` fájlban állítsd be a szükséges értékeket, például:

```env
NODE_ENV=production
PORT=3000
SQLITE_PATH=/var/www/budafoki-satras-ciganyok/data/tickets.sqlite
ADMIN_TOKEN=change-this-secret
```

## 4. Függőségek telepítése és build

```bash
npm install
npm run build
```

## 5. PM2 folyamat beállítása

A repository-ban található `ecosystem.config.cjs` használatával indítsd el a szolgáltatást:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

A PM2 állapot ellenőrzése:

```bash
pm2 status
pm2 logs budafoki-satras-ciganyok --lines 100
```

## 6. Nginx reverse proxy beállítása

Hozz létre egy új site-ot:

```bash
sudo tee /etc/nginx/sites-available/budafoki-satras-ciganyok <<'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 20m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF
```

Aktiváld a konfigurációt:

```bash
sudo ln -s /etc/nginx/sites-available/budafoki-satras-ciganyok /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7. SSL (opcionális, ajánlott)

Certbot segítségével engedélyezd a HTTPS-t:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 8. Gyakori parancsok

```bash
pm2 restart budafoki-satras-ciganyok
pm2 stop budafoki-satras-ciganyok
pm2 logs budafoki-satras-ciganyok
sudo systemctl status nginx
sudo nginx -t
```

## 9. Fontos megjegyzések

- A szerver a `PORT` környezeti változó szerint indul.
- Az adatbázis a `SQLITE_PATH` által megadott helyen marad fent.
- A `data/` könyvtárat ellenőrizd, hogy a PM2 felhasználó írni tudjon bele.
- Ha a build után a frontend nem jelenik meg, ellenőrizd, hogy a `dist/` mappa létezik, és a PM2 folyamat fut.
