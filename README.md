# Urbanly

Şehir keşfi, öneri ve sosyal topluluk uygulaması. Monorepo — Express API + React Native (Expo).

> Mimari kararlar ve AI çalışma kuralları için [CLAUDE.md](./CLAUDE.md).

## Yapı

```
apps/
  api/       Express + TypeScript + Prisma (katmanlı)
  mobile/    React Native (Expo managed)
packages/
  shared/    Ortak Zod şemaları + tipler
```

## Gereksinimler

- Node ≥ 20 (`.nvmrc` → 22)
- PostgreSQL (PostGIS uzantılı)

## Kurulum

```bash
npm install                 # tüm workspace bağımlılıkları
npm run shared:build        # ortak paketi derle (api/mobile buna bağımlı)
```

### API

```bash
cd apps/api
cp .env.example .env         # değerleri doldur (JWT sırları, DATABASE_URL)
npm run db:generate          # Prisma client üret
npm run db:migrate           # ilk migration
npm run dev                  # http://localhost:4000/api/v1
```

### Mobile

```bash
cd apps/mobile
npx expo install             # native bağımlılıkları SDK ile hizala
npm run start                # Expo geliştirme sunucusu
```

> Not: Mobil bağımlılık sürümleri `npx expo install` ile SDK'ya göre otomatik hizalanır.

## Komutlar (kök)

| Komut | Açıklama |
|-------|----------|
| `npm run typecheck` | Tüm workspace'lerde tip kontrolü |
| `npm run api:dev` | API geliştirme sunucusu |
| `npm run mobile:start` | Expo başlat |
| `npm run format` | Prettier |
