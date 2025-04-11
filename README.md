## NEXT.JS Business Activity Tracker

#### Prerequisites

```
1. Needs a VPS for self-host coolify
2. Download coolify and install to your VPS
3. Need Cloudflare R2 for image feature!
4. Need turso.io for free 8GB RAM
5. Need Resend.io for email verification
```

#### How to Install

1. Go to your Coolify dashboard
2. Select project
3. Click new
4. Choose public/private
5. if public paste the repo link
6. let the tool do its job.
7. create an account to have access_tokens to the services like turso,cloudflare, and resend
8. go to environment variables and configure the env
9. click Developer View
10. use this env as example

```AUTH_GITHUB_ID=XXXX
AUTH_GITHUB_SECRET=xxx
AUTH_GOOGLE_ID=ZXCZCZXCZXC
AUTH_GOOGLE_SECRET=XXZCZC
AUTH_SECRET="lVyezEtRZIyOigd0OE8CKcOiWt+Uv9D3ePQMYtaKRQs=" # Added by `npx auth`. Read more: https://cli.authjs.dev
AUTH_TRUST_HOST=http://localhost:3000
CLOUDFLARE_ACCESS_KEY_ID=ZXCZXCZXC
CLOUDFLARE_ACCOUNT_ID=ZXCZCZXC
CLOUDFLARE_BUCKET_NAME=ZXCZCZXCZXC
CLOUDFLARE_SECRET_ACCESS_KEY=ZXCZXCZXC
GEMINI_KEY=ZXCZCZXCZXC
JWT_SECRET_KEY=ZXCZCZXCZXCZC
NEXT_PUBLIC_PUBLISHABLE_KEY=1
RESEND_API_KEY=re_JLZJfAtw_ZCXZXCZXCZCX
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCIZXCXZCXZC6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3MzgxNjA0NzYsImlkIjoiYWRmMGM4NDMtMjZhNC00YTUxLThjZWEtODQxYTFhN2JmYTljIn0.3bzRnKasW6tXF9uWA2MX19CLt09TK5rzpLYQZF2wjpYAuFE3ZwcvEqByFQrV12ipXOTzdfDIndhNocC77dtYDQ
TURSO_CONNECTION_URL=libsql://production-ZCXZXCZXC.turso.io
```

10. configure the domain to your likings
11. and click deploy
12. Done.
