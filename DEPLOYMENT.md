# 🚀 ZAYA AI — Deployment Guide

## Системийн шаардлага

- Node.js 18+
- PostgreSQL 14+
- Redis 7+ (optional, rate limiting-д)
- QPay merchant account
- Anthropic API key
- Google OAuth credentials
- Facebook App credentials

---

## 1. Local Development Setup

```bash
# Repo clone хийх
git clone https://github.com/your-org/zaya-ai.git
cd zaya-ai

# Dependencies суулгах
npm install

# .env файл үүсгэх
cp .env.example .env.local
# .env.local файлыг edit хийж бүх утгуудыг оруулна

# Database setup
npx prisma generate
npx prisma db push
npm run db:seed

# Dev server эхлүүлэх
npm run dev
```

---

## 2. Environment Variables Тайлбар

### QPay тохируулга

1. [QPay merchant portal](https://merchant.qpay.mn) дээр бүртгүүл
2. **QPAY_USERNAME** ба **QPAY_PASSWORD** авна
3. **QPAY_INVOICE_CODE** — merchant portal-аас авна
4. Callback URL: `https://zaya.mn/api/payment/callback`

### Google OAuth

1. [console.cloud.google.com](https://console.cloud.google.com) дээр шинэ project үүсгэ
2. "OAuth 2.0 Client IDs" үүсгэ
3. Authorized redirect URIs: `https://zaya.mn/api/auth/callback/google`

### Facebook OAuth

1. [developers.facebook.com](https://developers.facebook.com) дээр app үүсгэ
2. Facebook Login product нэм
3. Valid OAuth Redirect URIs: `https://zaya.mn/api/auth/callback/facebook`

### Anthropic API

1. [console.anthropic.com](https://console.anthropic.com) дээр бүртгүүл
2. API key үүсгэ
3. **claude-opus-4-5** model ашиглана

---

## 3. Production Deployment (Vercel)

```bash
# Vercel CLI суулгах
npm i -g vercel

# Deploy хийх
vercel --prod

# Environment variables нэмэх
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... бусад variables
```

### Vercel тохируулга

`vercel.json`:
```json
{
  "functions": {
    "src/app/api/reports/generate/route.ts": {
      "maxDuration": 60
    },
    "src/app/api/compatibility/check/route.ts": {
      "maxDuration": 30
    }
  }
}
```

---

## 4. Database (Supabase)

```bash
# Supabase дээр бүртгүүл: supabase.com
# New project үүсгэ
# Connection string авч DATABASE_URL-д нэм

# Schema push хийх
npx prisma db push

# Seed хийх
npm run db:seed
```

---

## 5. Cron Jobs — Өдрийн контент автоматжуулах

```bash
# Vercel cron (vercel.json дотор):
{
  "crons": [
    {
      "path": "/api/admin/generate-content",
      "schedule": "0 6 * * *"
    }
  ]
}
```

Эсвэл GitHub Actions ашиглана:

```yaml
# .github/workflows/daily-content.yml
name: Daily Content Generation
on:
  schedule:
    - cron: '0 22 * * *'  # Монголын 6:00 UTC+8
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Generate daily content
        run: |
          curl -X POST https://zaya.mn/api/admin/generate-content \
            -H "x-admin-secret: ${{ secrets.ADMIN_SECRET }}"
```

---

## 6. Custom Domain (zaya.mn)

1. Vercel дашборд → Settings → Domains
2. `zaya.mn` нэмэх
3. DNS тохируулга:
   - `A` record: `76.76.21.21` (Vercel IP)
   - `CNAME` www: `cname.vercel-dns.com`

---

## 7. QPay Webhook тохируулга

QPay merchant portal дээр:
- Callback URL: `https://zaya.mn/api/payment/callback`
- Method: POST

---

## 8. Admin Panel нэвтрэх

```
URL: https://zaya.mn/admin
Cookie: admin_secret = [ADMIN_SECRET утга]
```

Эсвэл curl ашиглах:
```bash
curl https://zaya.mn/api/admin/stats \
  -H "x-admin-secret: your-admin-secret"
```

---

## 9. SEO Pages

Автоматаар үүсдэг zodiac SEO pages:
- `/zodiac/aries` — Хуц ордны тайлан
- `/zodiac/scorpio` — Хилэнц ордны тайлан
- ... 12 бүх орд

Google Search Console дээр sitemap нэмэх:
`https://zaya.mn/sitemap.xml`

---

## 10. Performance Monitoring

```bash
# Vercel analytics enable хийх
vercel analytics enable

# Database query monitoring
# Prisma Studio ашиглах:
npx prisma studio
```

---

## Monetization тойм

| Бүтээгдэхүүн | Үнэ | QPay key |
|---|---|---|
| 1 жилийн тайлан | 9,900₮ | YEARLY_REPORT |
| Compatibility | 4,900₮ | COMPATIBILITY |
| Soulmate | 14,900₮ | SOULMATE |
| Ирээдүйн хань | 7,900₮ | FUTURE_SPOUSE |
| Breakup recovery | 6,900₮ | BREAKUP_RECOVERY |
| 2026 тайлан | 8,900₮ | YEARLY_2026 |
| Нууц хувь заяа | 12,900₮ | HIDDEN_DESTINY |
| Сарын Premium | 19,900₮ | MONTHLY_PREMIUM |

---

## Coupon кодууд (Seed дотор)

- `ZAYA2026` — 20% хөнгөлөлт
- `LUNAR30` — 30% хөнгөлөлт  
- `LOVE50` — 50% хөнгөлөлт (Valentine's)

---

## Tech Stack Тойм

```
Frontend:  Next.js 14 + TypeScript + Tailwind + Framer Motion
Backend:   Next.js API Routes (Edge Runtime)
Database:  PostgreSQL (Supabase) + Prisma ORM
AI:        Claude Opus via Anthropic SDK
Payment:   QPay Mongolian payment system
Auth:      NextAuth.js (Google, Facebook, Guest)
Hosting:   Vercel
```

---

## Алдааг шийдвэрлэх

**QPay холболт алдаа:**
```bash
# Token шалгах
curl -X POST https://merchant.qpay.mn/v2/auth/token \
  -H "Authorization: Basic $(echo -n 'user:pass' | base64)"
```

**AI тайлан удааширвал:**
- Vercel function timeout 60s болгох
- Claude API rate limit шалгах

**Database connection алдаа:**
```bash
npx prisma db push  # Schema sync хийх
npx prisma generate # Client regenerate хийх
```
