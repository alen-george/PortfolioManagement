# ───────────────────────────
#  Backend - Node / Express
# ───────────────────────────
FROM node:20-alpine

WORKDIR /app

# Needed by Prisma query-engine binaries
RUN apk add --no-cache openssl

# ── install deps ─────────────────────
COPY package*.json ./
RUN npm ci

# ── Prisma client build ──────────────
COPY prisma ./prisma
RUN npx prisma generate

# ── copy source ──────────────────────
COPY . .

ENV PORT=5000
EXPOSE 5000

# Runs migrations (prisma migrate deploy) then starts API
CMD ["npm", "run", "start:prod"]
