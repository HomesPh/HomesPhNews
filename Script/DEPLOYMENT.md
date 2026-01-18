# 🚀 HomesPh Deployment & Infrastructure Guide

> **Version:** 1.0.0  
> **Last Updated:** January 2026  
> **Purpose:** Deployment options, use case comparisons, and GitHub Actions CI/CD

---

## 📊 Deployment Options Comparison

### Use Case Decision Tree

```
                    ┌─────────────────────────────────┐
                    │  Do you have an existing EC2?   │
                    └─────────────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                              ▼
                  [YES]                          [NO]
                    │                              │
                    ▼                              ▼
    ┌───────────────────────────┐    ┌───────────────────────────┐
    │  USE EXISTING EC2         │    │  How often do you scrape? │
    │  (Recommended)            │    └───────────────────────────┘
    │  Cost: $0 extra           │                 │
    └───────────────────────────┘    ┌────────────┴────────────┐
                                     ▼                          ▼
                              [< 10x/day]               [24/7 or API needed]
                                     │                          │
                                     ▼                          ▼
                    ┌─────────────────────────┐    ┌─────────────────────────┐
                    │  USE AWS LAMBDA         │    │  NEW EC2 INSTANCE       │
                    │  + EventBridge          │    │  (Only if Laravel API)  │
                    │  Cost: $1-5/month       │    │  Cost: $15-50/month     │
                    └─────────────────────────┘    └─────────────────────────┘
```

---

## 🏗️ Architecture Diagrams

### Option A: Existing EC2 (RECOMMENDED ✅)

**Best for:** Already have Laravel/Node running on EC2

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         EXISTING EC2 INSTANCE                            │
│                         (t3.medium or similar)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌────────────────────────┐       ┌────────────────────────────────┐   │
│   │                        │       │                                │   │
│   │    Laravel 12 API      │       │    Python News Scraper         │   │
│   │    (Port 80/443)       │       │    /var/www/Script/            │   │
│   │                        │       │                                │   │
│   │  • REST API            │       │  • pipeline.py (cron)          │   │
│   │  • Web Dashboard       │       │  • scraper.py                  │   │
│   │  • Auth & Users        │       │  • ai_service.py               │   │
│   │                        │       │  • storage.py                  │   │
│   └───────────┬────────────┘       └───────────────┬────────────────┘   │
│               │                                     │                    │
│               │         ┌───────────────┐          │                    │
│               └────────►│    REDIS      │◄─────────┘                    │
│                         │  (localhost)  │                                │
│                         └───────────────┘                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │    GCP Cloud Storage          │
                    │    (AI-generated images)      │
                    └───────────────────────────────┘

💰 Additional Cost: $0 (using existing resources)
```

---

### Option B: AWS Lambda (CHEAPEST 💰)

**Best for:** No existing infrastructure, periodic scraping only

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              AWS CLOUD                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌────────────────────────┐                                            │
│   │   EventBridge (Cron)   │  ◄── Trigger every 6 hours                 │
│   │   0 */6 * * *          │                                            │
│   └───────────┬────────────┘                                            │
│               │                                                          │
│               ▼                                                          │
│   ┌────────────────────────┐       ┌────────────────────────────────┐   │
│   │                        │       │                                │   │
│   │    Lambda Function     │──────►│    Redis (Upstash)             │   │
│   │    (Python 3.11)       │       │    (Serverless Redis)          │   │
│   │                        │       │                                │   │
│   │  • pipeline.py         │       └────────────────────────────────┘   │
│   │  • Max 15 min runtime  │                                            │
│   │  • 1GB memory          │                                            │
│   │                        │                                            │
│   └───────────┬────────────┘                                            │
│               │                                                          │
│               ▼                                                          │
│   ┌────────────────────────┐                                            │
│   │    S3 / GCP Storage    │                                            │
│   │    (Generated images)  │                                            │
│   └────────────────────────┘                                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

💰 Estimated Cost: $1-5/month
   • Lambda: $0.20 per 1M requests
   • Upstash Redis: Free tier (10K commands/day)
```

---

### Option C: New EC2 Instance (OVERKILL ⚠️)

**Best for:** Need full Laravel API + Python + Database on dedicated server

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          NEW EC2 INSTANCE                                │
│                          (t3.medium - $30/month)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐ │
│   │   Nginx         │  │   PHP-FPM       │  │   Python 3.11           │ │
│   │   (Reverse      │  │   Laravel 12    │  │   News Scraper          │ │
│   │   Proxy)        │  │   API           │  │   Cron Job              │ │
│   └─────────────────┘  └─────────────────┘  └─────────────────────────┘ │
│                                                                          │
│   ┌─────────────────┐  ┌─────────────────┐                              │
│   │   Redis         │  │   PostgreSQL    │                              │
│   │   (Cache)       │  │   (Database)    │                              │
│   └─────────────────┘  └─────────────────┘                              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

💰 Estimated Cost: $30-50/month
   ⚠️ Only choose if you NEED a dedicated server
```

---

## 📋 Use Case Summary Table

| Scenario | Recommended | Cost | Complexity |
|----------|-------------|------|------------|
| Already have EC2 with Laravel | **Option A: Existing EC2** ✅ | $0 extra | ⭐ Easy |
| Fresh start, scraping only | **Option B: Lambda** | $1-5/mo | ⭐⭐ Medium |
| Fresh start, need full API | Option C: New EC2 | $30-50/mo | ⭐⭐⭐ Complex |

> 💡 **TL;DR:** If you have an existing EC2, just add the Python script there. Done. No need for fancy stuff!


---

## 🔧 GitHub Actions CI/CD Setup

### Repository Structure

```
HomesPhNews/
├── .github/
│   └── workflows/
│       ├── deploy-script.yml    ← Deploy Python to EC2
│       └── deploy-server.yml    ← Deploy Laravel to EC2
├── Script/                       ← Python News Scraper
├── server/                       ← Laravel API
└── client/                       ← Next.js Frontend (optional)
```

---

### Workflow 1: Deploy Python Script to EC2

**File:** `.github/workflows/deploy-script.yml`

```yaml
name: Deploy News Scraper to EC2

on:
  push:
    branches: [main]
    paths:
      - 'Script/**'
  workflow_dispatch:  # Manual trigger

env:
  EC2_HOST: ${{ secrets.EC2_HOST }}
  EC2_USER: ${{ secrets.EC2_USER }}
  DEPLOY_PATH: /var/www/HomesPhNews/Script

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH Key
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.EC2_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy to EC2
        run: |
          # Sync Script folder to EC2
          rsync -avz --delete \
            --exclude '.env' \
            --exclude 'venv/' \
            --exclude '__pycache__/' \
            --exclude '*.pyc' \
            --exclude 'temp_*.png' \
            ./Script/ ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }}:${{ env.DEPLOY_PATH }}/

      - name: Install dependencies on EC2
        run: |
          ssh ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} << 'EOF'
            cd /var/www/HomesPhNews/Script
            pip3 install -r requirements.txt --quiet
            echo "✅ Dependencies installed"
          EOF

      - name: Verify deployment
        run: |
          ssh ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} << 'EOF'
            cd /var/www/HomesPhNews/Script
            python3 -c "from scraper import NewsScraper; print('✅ Script deployment verified')"
          EOF
```

---

### Workflow 2: Deploy Laravel to EC2

**File:** `.github/workflows/deploy-server.yml`

```yaml
name: Deploy Laravel to EC2

on:
  push:
    branches: [main]
    paths:
      - 'server/**'
  workflow_dispatch:

env:
  EC2_HOST: ${{ secrets.EC2_HOST }}
  EC2_USER: ${{ secrets.EC2_USER }}
  DEPLOY_PATH: /var/www/HomesPhNews/server

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH Key
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.EC2_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy to EC2
        run: |
          rsync -avz --delete \
            --exclude '.env' \
            --exclude 'vendor/' \
            --exclude 'node_modules/' \
            --exclude 'storage/logs/*' \
            ./server/ ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }}:${{ env.DEPLOY_PATH }}/

      - name: Run post-deploy commands
        run: |
          ssh ${{ secrets.EC2_USER }}@${{ secrets.EC2_HOST }} << 'EOF'
            cd /var/www/HomesPhNews/server
            composer install --no-dev --optimize-autoloader
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            sudo systemctl reload php-fpm
            echo "✅ Laravel deployed successfully"
          EOF
```

---

## 🔑 GitHub Secrets Required

Add these in **GitHub → Repository → Settings → Secrets → Actions**:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `EC2_HOST` | EC2 public IP or domain | `54.123.45.67` or `api.homesph.com` |
| `EC2_USER` | SSH username | `ubuntu` or `ec2-user` |
| `EC2_SSH_KEY` | Private SSH key (entire content) | `-----BEGIN RSA PRIVATE KEY-----...` |

---

## 🕐 Setting Up Cron on EC2

After deployment, set up the cron job:

```bash
# SSH into EC2
ssh ubuntu@your-ec2-ip

# Edit crontab
crontab -e

# Add these lines:
# ┌───────────── minute (0-59)
# │ ┌───────────── hour (0-23)
# │ │ ┌───────────── day of month (1-31)
# │ │ │ ┌───────────── month (1-12)
# │ │ │ │ ┌───────────── day of week (0-6)
# │ │ │ │ │

# Run every 6 hours
0 */6 * * * cd /var/www/HomesPhNews/Script && python3 pipeline.py --full --limit 20 >> /var/log/homesph-scraper.log 2>&1

# Run daily at 6 AM for Real Estate only
0 6 * * * cd /var/www/HomesPhNews/Script && python3 pipeline.py --category "Real Estate" --limit 50 >> /var/log/homesph-realestate.log 2>&1
```

---

## ✅ Deployment Checklist

### Before First Deploy:

- [ ] Create `.env` file on EC2 (copy from `env.example`)
- [ ] Set up Redis on EC2 (`sudo apt install redis-server`)
- [ ] Configure GCP service account on EC2
- [ ] Add GitHub Secrets (EC2_HOST, EC2_USER, EC2_SSH_KEY)
- [ ] Test SSH connection manually first

### After Deploy:

- [ ] Verify Python dependencies installed
- [ ] Run test scrape: `python3 pipeline.py --country "Philippines" --limit 2`
- [ ] Check Redis for stored articles
- [ ] Set up cron job
- [ ] Monitor logs: `tail -f /var/log/homesph-scraper.log`

---

## 🔍 Troubleshooting

### SSH Connection Failed
```
Permission denied (publickey)
```
**Solution:** Ensure `EC2_SSH_KEY` secret contains the PRIVATE key (not public)

### Python Module Not Found
```
ModuleNotFoundError: No module named 'google'
```
**Solution:** Run `pip3 install -r requirements.txt` on EC2

### Cron Not Running
```bash
# Check if cron service is running
sudo systemctl status cron

# Check cron logs
grep CRON /var/log/syslog
```

---

## 📞 Support

For issues, check:
1. GitHub Actions logs
2. EC2 logs: `/var/log/homesph-scraper.log`
3. Redis: `redis-cli KEYS "homesph:*"`

---

**Built with ❤️ for HomesPh Global News Engine**
