# Urbanly — Proje ve Yapay Zekâ Çalışma Dokümanı

> Bu doküman, **Urbanly** mobil uygulamasının teknik çerçevesini, mimari kararlarını ve
> yapay zekâ (AI) asistanlarının (Codex, Copilot vb.) kod üretirken uyması gereken
> **kısıtları ve önerileri** tanımlar. Kod yazmadan önce herkes (insan + AI) bu dokümanı okumalıdır.
>
> **Durum:** Taslak / Başlangıç · **Sürüm:** 0.1 · **Son güncelleme:** 2026-07-21

---

## 1. Proje Özeti

**Urbanly**, **şehir keşfi ve öneri sistemi** odaklı, **sosyal topluluk** boyutu olan mobil
öncelikli (mobile-first) bir uygulamadır. Kullanıcılar şehirdeki mekân/aktiviteleri keşfeder,
kişiselleştirilmiş öneriler alır ve topluluk içinde içerik (yorum, değerlendirme, liste,
paylaşım) üretir.

- **Frontend:** React Native (Expo — bkz. §3)
- **Backend:** Node.js + Express (REST API)
- **Hedef platformlar:** iOS ve Android
- **Dil:** TypeScript (hem frontend hem backend)

### 1.1 Temel Kavramlar (Domain)

| Kavram | Açıklama |
|--------|----------|
| **Place / Spot** | Keşfedilebilir mekân/aktivite (mekân, etkinlik, semt vb.) |
| **Recommendation** | Kullanıcıya kişiselleştirilmiş öneri (ilgi, konum, davranış tabanlı) |
| **User** | Profil, ilgi alanları, takip ilişkileri |
| **Post / Review** | Kullanıcı içeriği: değerlendirme, yorum, fotoğraf, liste |
| **Social graph** | Takip et / beğen / kaydet / yorum yap |

### 1.2 MVP Kapsamı

| Öncelik | Özellik | Not |
|---------|---------|-----|
| P0 | Kullanıcı kaydı & girişi | Kendi JWT (access + refresh) |
| P0 | Mekân/spot listeleme + detay ekranı | Konum & kategori filtreli |
| P0 | Keşif / feed ekranı | Öneri akışı |
| P1 | Profil + ilgi alanları | Öneri kişiselleştirmesini besler |
| P1 | Sosyal aksiyonlar (beğen, kaydet, takip) | Social graph temeli |
| P1 | Değerlendirme / yorum oluşturma | İçerik üretimi |
| P1 | Görsel yükleme (Cloudinary) | Kullanıcı fotoğrafları |
| P2 | Push bildirim (Expo Notifications) | Sonraki faz |
| — | ~~Öneri motoru~~ | **Ertelendi** — sonraki fazda |

> ℹ️ **Öneri motoru:** MVP kapsamına **dahil değil**. Keşif/feed ekranı şimdilik basit sıralama
> ile çalışır (ör. yeni eklenen / popülerlik / konum yakınlığı). Kişiselleştirme ve ML/embedding
> tabanlı öneri ayrı bir faza bırakılmıştır — AI kendiliğinden öneri veya ML altyapısı **kurmaz**
> (bkz. §5.1).

---

## 2. Mimari Genel Bakış

```
┌─────────────────────┐        HTTPS / REST        ┌──────────────────────┐
│   React Native App   │  ───────────────────────►  │   Express API (Node) │
│  (iOS / Android)     │  ◄───────────────────────  │                      │
│                      │        JSON + JWT          │  ┌────────────────┐  │
│  - UI / Navigation   │                            │  │ Controllers    │  │
│  - State (Query)     │                            │  │ Services       │  │
│  - API Client        │                            │  │ Repositories   │  │
└─────────────────────┘                            │  └────────┬───────┘  │
                                                    └───────────┼──────────┘
                                                                │
                                                        ┌───────▼────────┐
                                                        │   Database      │
                                                        │  (PostgreSQL)   │
                                                        └────────────────┘
```

### 2.1 Katmanlı Backend (zorunlu)

Backend **katmanlı mimari** ile yazılır. İş mantığı controller'a **yazılmaz**:

```
route  →  controller  →  service  →  repository  →  db
         (HTTP I/O)     (iş kuralı)   (veri erişimi)
```

- **Route:** Sadece endpoint tanımı + middleware bağlama.
- **Controller:** `req`/`res` işler, validasyon sonucunu okur, service çağırır, HTTP döner.
- **Service:** Tüm iş mantığı burada. HTTP'den ve DB'den bağımsız, test edilebilir.
- **Repository:** DB sorguları. ORM/Query builder burada izole edilir.

---

## 3. Teknoloji Kararları

Aşağıdaki seçimler **varsayılan** olup, ekip onayıyla değiştirilebilir. AI, onaylı yığının
dışına **kendi başına çıkmamalıdır** (bkz. §5).

### 3.1 Frontend (React Native)

| Konu | Karar | Neden |
|------|-------|-------|
| Framework | **Expo (managed)** | Hızlı başlangıç, OTA update, kolay build |
| Dil | **TypeScript** (strict) | Tip güvenliği |
| Navigation | **React Navigation** | Standart, olgun |
| Sunucu durumu | **TanStack Query (React Query)** | Cache, retry, senkron veri |
| İstemci durumu | **Zustand** (gerekirse) | Basit, boilerplate az |
| Form | **React Hook Form + Zod** | Performanslı + tip güvenli validasyon |
| HTTP | **Axios** (tek instance, interceptor) | Token yenileme kolaylığı |
| Stil | **StyleSheet** / (tercihen) NativeWind | Tutarlı |
| Harita | **react-native-maps** (Google provider) | Konum tabanlı keşif |
| Bildirim | **Expo Notifications** | Push bildirim |
| Test | **Jest + React Native Testing Library** | — |

### 3.2 Backend (Express)

| Konu | Karar | Neden |
|------|-------|-------|
| Dil | **TypeScript** (strict) | — |
| Framework | **Express 4/5** | Basit, esnek |
| Validasyon | **Zod** | Frontend ile paylaşılabilir şema |
| ORM | **Prisma** | Tip güvenli, migration yönetimi |
| DB | **PostgreSQL + PostGIS** | İlişkisel + coğrafi sorgular (yakındaki mekânlar) |
| Auth | **Kendi JWT (access + refresh)** | Stateless, tam kontrol, dış bağımlılık yok |
| Loglama | **Pino** | Yapısal, hızlı |
| Görsel yükleme | **Cloudinary** | Ücretsiz katman, CDN + dönüşüm |
| Test | **Vitest / Jest + Supertest** | — |
| Env yönetimi | **dotenv + Zod ile doğrulama** | Eksik env erken yakalanır |

### 3.3 Ortak

- **Paket yöneticisi:** `npm` workspaces (kilit dosyası commit edilir)
- **Node sürümü:** LTS (`.nvmrc` ile sabitlenir)
- **Yapı:** **Monorepo** — `apps/mobile`, `apps/api`, `packages/shared` (paylaşılan tipler/Zod
  şemaları frontend & backend arasında tek kaynaktan gelir)

---

## 4. Klasör Yapısı (öneri)

```
urbanly/
├── apps/
│   ├── api/                    # Express backend
│   │   ├── src/
│   │   │   ├── config/         # env, db, logger
│   │   │   ├── modules/        # özellik bazlı: auth/, users/, ...
│   │   │   │   └── users/
│   │   │   │       ├── users.route.ts
│   │   │   │       ├── users.controller.ts
│   │   │   │       ├── users.service.ts
│   │   │   │       ├── users.repository.ts
│   │   │   │       └── users.schema.ts
│   │   │   ├── middlewares/    # auth, error, validate
│   │   │   ├── utils/
│   │   │   └── app.ts
│   │   └── tests/
│   └── mobile/                 # React Native (Expo)
│       ├── src/
│       │   ├── api/            # axios client + endpoint fonksiyonları
│       │   ├── components/     # yeniden kullanılabilir UI
│       │   ├── features/       # ekran + iş mantığı (özellik bazlı)
│       │   ├── hooks/
│       │   ├── navigation/
│       │   ├── store/
│       │   └── theme/
│       └── app.json
└── packages/
    └── shared/                 # ortak tipler + Zod şemaları
```

---

## 5. Yapay Zekâ (AI) Kısıtları — ZORUNLU

> Bu bölüm AI asistanları için **bağlayıcı kurallardır**. İnsan geliştiriciler için de en iyi
> uygulama önerileridir.

### 5.1 Yapılmayacaklar (Hard Constraints — asla)

1. **Onaylı yığının dışına çıkma.** §3'teki listede olmayan bir kütüphane/paket eklemeden önce
   **sor**. "Daha popüler" olması gerekçe değildir.
2. **Sır (secret) sızdırma.** API key, token, şifre, `.env` içeriği koda **gömülmez**. Örneklerde
   bile gerçek değer kullanılmaz; `process.env.X` üzerinden okunur.
3. **`any` tipi kullanma** (TypeScript strict). Zorunlu ise `unknown` + tip daraltma kullan ve neden
   olduğunu yorumla.
4. **Doğrulanmamış girdiye güvenme.** Her `req.body`, `req.query`, `req.params` **Zod ile
   doğrulanmadan** service'e geçirilmez.
5. **İş mantığını controller'a yazma.** (bkz. §2.1)
6. **Ham SQL string birleştirme yapma** (SQL injection). Prisma/parametreli sorgu kullan.
7. **Migration'ı elle DB üzerinde uygulama.** Şema değişikliği yalnızca Prisma migration ile.
8. **Sessizce hata yutma yok.** `catch {}` boş bırakılmaz; hata loglanır veya yeniden fırlatılır.
9. **Var olan dosyayı okumadan büyük değişiklik yapma.** Önce mevcut kod/kalıp incelenir.
10. **Onaysız yıkıcı işlem yok.** Dosya/branch silme, DB drop, `git push --force` gibi işlemler
    **kullanıcı onayı olmadan** yapılmaz.

### 5.2 Yapılacaklar (önerilenler)

1. **Küçük, odaklı değişiklik.** Bir PR/görev tek bir işi yapar. İstenmeyen refactor'a girme.
2. **Mevcut kalıba uy.** Çevredeki kodun isimlendirme, klasör ve stil düzenine benze.
3. **Tip güvenliği önce.** Ortak tipler `packages/shared`'de tutulur; frontend & backend paylaşır.
4. **Hata yönetimi merkezi.** Backend'de tek bir `errorHandler` middleware; tutarlı hata gövdesi:
   ```json
   { "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] } }
   ```
5. **Async/await + try-catch** veya merkezi async wrapper kullan. Callback zinciri kurma.
6. **Anlamlı isim.** Kısaltma yerine açık isim (`getUserById`, `isLoading`).
7. **Yorumu "neden" için yaz**, "ne" için değil. Kodun kendisi "ne"yi anlatmalı.
8. **Test yaz.** En azından service katmanı ve kritik akışlar için birim testi.
9. **Belirsizlikte dur ve sor.** Ürün kararı veya kapsam belirsizse tahmin etmek yerine soru sor.
10. **Erişilebilirlik & UX.** RN tarafında dokunma hedefleri ≥44px, `accessibilityLabel`, yükleme/
    hata/boş durumları her ekranda ele alınır.

### 5.3 Güvenlik Kuralları (özet)

- Şifreler **bcrypt/argon2** ile hash'lenir; asla düz metin saklanmaz.
- JWT: kısa ömürlü **access token** + **refresh token** rotasyonu.
- Tüm trafik **HTTPS**. CORS beyaz liste ile sınırlandırılır.
- Rate limiting (örn. `express-rate-limit`) auth uçlarında zorunlu.
- Güvenlik başlıkları için **helmet**.
- Hassas veri **loglanmaz** (şifre, token, PII maskeli).
- Bağımlılıklar düzenli `npm audit` ile taranır.

### 5.4 AI İletişim Verimliliği (token tasarrufu)

> Amaç: AI asistanının yanıtlarında **dolgu/gereksiz kelimeyi kesip** token (ve maliyet) tasarrufu
> sağlamak — [caveman](https://github.com/JuliusBrussee/caveman) felsefesinin bu projeye uyarlanmış
> hâli. Kısaltılan şey **asistanın söylediği**, bildiği veya ürettiği kod **değil**.

**Kurallar:**

1. **Kısa ve öz konuş.** Nezaket dolgusu ("Tabii ki, memnuniyetle...", "Umarım yardımcı olur")
   ve gereksiz tekrar yok. Doğrudan cevaba geç.
2. **Kod, komut, hata mesajı, dosya yolu, API şeması BİREBİR korunur.** Bunlar asla kısaltılmaz,
   özetlenmez, "..." ile geçilmez. Verimlilik yalnızca **düzyazı** açıklamada uygulanır.
3. **Dil Türkçe kalır.** Caveman'in İngilizce telgraf üslubu **taklit edilmez**; sadece
   "az kelimeyle net anlat" ilkesi alınır. Anlaşılırlık > kısalık.
4. **Açıklama gerektiğinde kısılmaz.** Yeni/karmaşık bir mimari karar, güvenlik konusu veya
   öğretici bir nokta anlatılırken gereken netlik sağlanır — verimlilik uğruna eksik bırakılmaz.
5. **Madde işareti > paragraf.** Uygun olduğunda liste/tablo ile anlat, uzun düzyazı yerine.

> ℹ️ Bu bir üslup kuralıdır; harici bir plugin **kurulumu zorunlu değildir**. İstenirse caveman
> plugin'i ayrıca kurulabilir, ama bu dosyadaki kural tek başına yeterlidir.

---

## 6. API Sözleşmesi (Convention)

- **Base path:** `/api/v1`
- **Kaynak isimleri çoğul:** `/api/v1/users`, `/api/v1/users/:id`
- **HTTP durum kodları doğru kullanılır:** 200/201/204, 400, 401, 403, 404, 409, 422, 500.
- **Sayfalama:** `?page=1&limit=20` → yanıt `{ data: [], meta: { total, page, limit } }`
- **Tutarlı hata gövdesi:** §5.2/4'teki format.
- **Zaman:** ISO 8601 (UTC).

---

## 7. Geliştirme İş Akışı

- **Branch:** `main` (korumalı) · `feat/*`, `fix/*`, `chore/*`
- **Commit:** Conventional Commits — `feat: ...`, `fix: ...`, `refactor: ...`
- **Her PR öncesi:** `lint` + `type-check` + `test` yeşil olmalı.
- **Kod kalitesi:** ESLint + Prettier (commit'te otomatik — husky + lint-staged).

### 7.1 Komutlar (kurulum sonrası doldurulacak)

```bash
# API
npm run dev --workspace=api          # geliştirme
npm run test --workspace=api
npm run db:migrate --workspace=api

# Mobile
npm run start --workspace=mobile     # Expo
npm run test --workspace=mobile
```

---

## 8. Açık Kararlar (netleştirilecek)

Aşağıdaki maddeler AI'ın **varsayım yapmadan sorması gereken** konulardır:

**Karara bağlandı:**
- [x] Ürün: şehir keşfi + öneri sistemi + sosyal topluluk (§1)
- [x] Kimlik doğrulama: **kendi JWT** (access + refresh)
- [x] Yapı: **Monorepo** (npm workspaces)

**Karara bağlandı (2. tur):**
- [x] Frontend: **Expo (managed)**
- [x] Harita/konum sağlayıcı: **Google Maps** (`react-native-maps` + Google provider)
- [x] Görsel yükleme: **Cloudinary** (kalıcı ücretsiz katman; CDN + dönüşüm dahil, S3'ün aksine 12 ay sınırı yok)
- [x] Push bildirim: **Expo Notifications** (yeterli görüldü)
- [x] Öneri motoru: **MVP'ye dahil değil** — sonraki faza ertelendi. Şimdilik listeleme
      basit sıralama ile (ör. yeni eklenen / popülerlik). AI öneri/ML altyapısı kurmaz.

**Hâlâ açık (henüz karar verilmedi):**
- [ ] Mekân verisi kaynağı: kendi editöryel veri mi, dış API mi (Google Places, Foursquare)?
- [ ] Hosting/deploy hedefi (Render, Railway, Fly.io, AWS) — daha sonra kararlaştırılacak.

> ⚠️ **Google Maps notu:** Google Maps Platform ücretsiz kullanım kredisi sunar ama
> **fatura hesabı (kredi kartı) ve API key gerektirir**. Key `.env`'de tutulur, koda gömülmez
> (bkz. §5.1). Kota/maliyet MVP ölçeğinde düşük kalır; yine de izlenmeli.

---

## 9. Bu Dokümanın Kullanımı

- Bu dosya (`AGENTS.md`) proje kökünde tutulur ve AI asistanları tarafından **otomatik okunur**.
- Karar değiştiğinde **önce bu doküman güncellenir**, sonra kod.
- "AI şunu yaptı ama istemedim" durumlarında ilgili kural buraya **eklenir/keskinleştirilir**.
```
