# finStock — Frontend ↔ Backend API Dokumani

> Bu dosya frontend'in backend'den tam olarak ne bekledigini belgelendirir.
> Backend gelistirirken bu dosyayi referans alin.
> Son guncelleme: 2026-02-17

---

## Genel Bilgi

| Ortam | Base URL |
|-------|----------|
| Mobile (dev, Android emu) | `http://10.0.2.2:8000` |
| Mobile (dev, iOS sim) | `http://localhost:8000` |
| Web (Next.js dev) | `/api/*` (Next.js API route, mock data) |
| Production | `https://api.finstock.app` |

**Web notu:** Web simdilik kendi `/api/*` route'larindan mock data donduruyor.
Backend hazir oldugunda bu route'lar backend'e proxy yapacak.

---

## 1. FONLAR

### `GET /api/funds` — Tum fonlari listele

**Kullanan:** Web `/fonlar`, Mobil `fonlar` tab

**Response:** `Fund[]`

```json
[
  {
    "id": "fund-001",
    "name": "Is Portfoy BIST 30 Hisse Senedi Fonu",
    "code": "TI4",
    "type": "Hisse Senedi",
    "riskLevel": 7,
    "managementFee": 2.15,
    "totalValue": 4850000000,
    "monthlyReturn": 4.32,
    "annualReturn": 52.18,
    "dailyReturn": 0.87,
    "fundSize": 4850000000,
    "investorCount": 184200,
    "launchDate": "2005-03-14"
  }
]
```

**Zorunlu alanlar (14 adet):**

| Alan | Tip | Aciklama |
|------|-----|----------|
| `id` | string | Benzersiz ID |
| `name` | string | Fon adi |
| `code` | string | Fon kodu (TI4, YAF, GAT...) |
| `type` | string | Fon tipi (enum asagida) |
| `riskLevel` | number | Risk seviyesi 1-7 |
| `managementFee` | number | Yonetim ucreti % |
| `totalValue` | number | Toplam deger TL |
| `monthlyReturn` | number | Aylik getiri % |
| `annualReturn` | number | Yillik getiri % |
| `dailyReturn` | number | Gunluk getiri % |
| `fundSize` | number | Fon buyuklugu TL |
| `investorCount` | number | Yatirimci sayisi |
| `launchDate` | string | Kurulus tarihi "YYYY-MM-DD" |

**`type` enum degerleri:**
`"Hisse Senedi"` | `"Tahvil/Bono"` | `"Karma"` | `"Para Piyasasi"` | `"Altin"` | `"Degisken"` | `"Katilim"`

**Frontend'te kullanilan kolonlar (web tablo):**
code, name, type, riskLevel, dailyReturn, monthlyReturn, annualReturn, managementFee, totalValue, investorCount

---

### `GET /api/funds/{code}` — Fon detay

**Kullanan:** Web `/fonlar/[code]`, Mobil `fund/[code]`

**Response:** `FundDetail` (Fund + opsiyonel alanlar)

Temel `Fund` alanlarina ek olarak:

```json
{
  "...tum Fund alanlari...",

  "weeklyReturn": 1.25,
  "threeMonthReturn": 8.50,
  "sixMonthReturn": 18.20,
  "ytdReturn": 22.40,
  "threeYearReturn": 145.0,
  "fiveYearReturn": 310.5,

  "sharpeRatio": 1.42,
  "standardDeviation": 15.30,
  "maxDrawdown": -12.50,
  "beta": 0.95,
  "alpha": 2.30,
  "trackingError": 3.10,

  "benchmark": "BIST 100",
  "manager": "Ahmet Yilmaz",
  "custodian": "Is Bankasi",
  "kap": "https://www.kap.org.tr/...",
  "minInvestment": 100,
  "entryFee": 0,
  "exitFee": 0.50,

  "totalBondWeight": 15.0,
  "totalStockWeight": 72.5,
  "totalCashWeight": 8.0,
  "totalOtherWeight": 4.5,

  "portfolio": [
    { "asset": "THYAO", "weight": 9.8 },
    { "asset": "GARAN", "weight": 8.2 },
    { "asset": "ASELS", "weight": 7.5 }
  ],

  "navHistory": [
    { "date": "2026-01-15", "nav": 12.450 },
    { "date": "2026-01-16", "nav": 12.520 }
  ],

  "syncedAt": "2026-02-17T12:00:00.000Z"
}
```

**Opsiyonel alanlar (hepsi `?` — bos olabilir):**

| Grup | Alanlar |
|------|---------|
| **Ek getiriler** | weeklyReturn, threeMonthReturn, sixMonthReturn, ytdReturn, threeYearReturn, fiveYearReturn |
| **Risk metrikleri** | sharpeRatio, standardDeviation, maxDrawdown, beta, alpha, trackingError |
| **Fon bilgileri** | benchmark, manager, custodian, kap, minInvestment, entryFee, exitFee |
| **Varlik dagilimi** | totalBondWeight, totalStockWeight, totalCashWeight, totalOtherWeight |
| **Portfoy** | portfolio (array: {asset, weight}) |
| **Tarihsel** | navHistory (array: {date, nav}) |
| **Meta** | syncedAt |

**Detay sayfasinda gosterilen bolumler (kosullu):**

| Bolum | Kosul |
|-------|-------|
| Getiri Performansi | her zaman (gunluk + aylik + yillik zorunlu, digerleri opsiyonel) |
| Fon Bilgileri | her zaman |
| Risk Metrikleri | sharpeRatio/standardDeviation/maxDrawdown varsa |
| Varlik Dagilimi | totalStockWeight/totalBondWeight varsa |
| Portfoy Detay | portfolio dizisi bos degilse |

---

### `POST /api/funds/{code}/sync` — Fon verilerini guncelle

**Kullanan:** Web + Mobil detay sayfasindaki "Verileri Guncelle" butonu

**Request:** Bos body (sadece POST)

**Beklenen davranis:**
1. Dis kaynaklardan (TEFAS, KAP, SPK) fon verisini cek
2. Tum opsiyonel alanlari doldur
3. `syncedAt` alanini set et
4. Guncellenmis `FundDetail` objesini dondur

**Response:** Guncellenmis `FundDetail`

**Backend durumu:** Endpoint var, sadece `syncedAt` ekliyor. TODO: Gercek veri cekme.

---

## 2. HISSELER

### `GET /api/stocks` — Tum hisseleri listele

**Kullanan:** Web `/hisseler`, Mobil `hisseler` tab

**Response:** `Stock[]`

```json
[
  {
    "id": "stock-001",
    "symbol": "THYAO",
    "name": "Turk Hava Yollari A.O.",
    "price": 312.40,
    "dailyChange": 2.35,
    "dailyChangeAmount": 7.18,
    "volume": 48520000,
    "marketCap": 431200000000,
    "peRatio": 5.8,
    "pbRatio": 2.1,
    "weeklyReturn": 4.12,
    "monthlyReturn": 7.85,
    "annualReturn": 58.30,
    "sector": "Ulastirma",
    "lastUpdate": "2026-02-17T15:30:00"
  }
]
```

**Zorunlu alanlar (15 adet):**

| Alan | Tip | Aciklama |
|------|-----|----------|
| `id` | string | Benzersiz ID |
| `symbol` | string | Hisse kodu (THYAO, GARAN...) |
| `name` | string | Sirket adi |
| `price` | number | Guncel fiyat TL |
| `dailyChange` | number | Gunluk degisim % |
| `dailyChangeAmount` | number | Gunluk degisim TL |
| `volume` | number | Islem hacmi |
| `marketCap` | number | Piyasa degeri TL |
| `peRatio` | number | F/K orani |
| `pbRatio` | number | PD/DD orani |
| `weeklyReturn` | number | Haftalik getiri % |
| `monthlyReturn` | number | Aylik getiri % |
| `annualReturn` | number | Yillik getiri % |
| `sector` | string | Sektor adi |
| `lastUpdate` | string | Son guncelleme ISO 8601 |

**Desteklenen sektor degerleri (web'de renk eslesmesi var):**
`Ulastirma`, `Savunma`, `Bankacilik`, `Demir Celik`, `Perakende`, `Cam`, `Enerji`, `Otomotiv`, `Teknoloji`, `Madencilik`, `Holding`, `Kimya`, `Insaat`, `Gida`, `Telekom`, `Beyaz_Esya`, `GYO`, `Gubre`

---

### `GET /api/stocks/{symbol}` — Hisse detay

**Kullanan:** Web `/hisseler/[symbol]`, Mobil `stock/[symbol]`

**Response:** `StockDetail` (Stock + opsiyonel alanlar)

```json
{
  "...tum Stock alanlari...",

  "openPrice": 305.20,
  "previousClose": 305.22,
  "dayHigh": 315.80,
  "dayLow": 303.50,
  "high52w": 340.00,
  "low52w": 180.25,
  "avgVolume": 42000000,

  "eps": 53.86,
  "dividendYield": 1.85,
  "roe": 42.30,
  "roa": 8.50,
  "netMargin": 15.20,
  "grossMargin": 28.40,
  "debtToEquity": 2.80,
  "currentRatio": 0.95,
  "beta": 1.25,

  "revenue": 380000000000,
  "netIncome": 57800000000,
  "ebitda": 92000000000,

  "description": "Turk Hava Yollari, Turkiye'nin bayrak tasiyici...",
  "ceo": "Ahmet Bolat",
  "headquarters": "Istanbul, Turkiye",
  "employees": 78000,
  "founded": "1933",
  "website": "www.turkishairlines.com",

  "priceHistory": [
    { "date": "2026-01-15", "close": 290.50, "volume": 38000000 }
  ],

  "syncedAt": "2026-02-17T12:00:00.000Z"
}
```

**Opsiyonel alanlar:**

| Grup | Alanlar |
|------|---------|
| **Fiyat seviyeleri** | openPrice, previousClose, dayHigh, dayLow, high52w, low52w, avgVolume |
| **Finansal oranlar** | eps, dividendYield, roe, roa, netMargin, grossMargin, debtToEquity, currentRatio, beta |
| **Gelir tablosu** | revenue, netIncome, ebitda |
| **Sirket bilgileri** | description, ceo, headquarters, employees, founded, website |
| **Tarihsel** | priceHistory (array: {date, close, volume}) |
| **Meta** | syncedAt |

**Detay sayfasinda gosterilen bolumler (kosullu):**

| Bolum | Kosul |
|-------|-------|
| Header + Getiri Grid | her zaman |
| Fiyat Bilgileri | herhangi bir fiyat alani != null |
| Piyasa Verileri | her zaman (temel) + beta/avgVolume opsiyonel |
| Finansal Oranlar | eps/roe/dividendYield varsa kart gosterilir |
| Gelir Tablosu | revenue/netIncome varsa kart gosterilir |
| Sirket Bilgileri | description/ceo varsa kart gosterilir |

---

### `POST /api/stocks/{symbol}/sync` — Hisse verilerini guncelle

**Kullanan:** Web + Mobil detay sayfasindaki "Verileri Guncelle" butonu

**Request:** Bos body

**Beklenen davranis:**
1. Dis kaynaklardan (Yahoo Finance, KAP, Finnet, TCMB) veri cek
2. Tum opsiyonel alanlari doldur
3. `syncedAt` set et
4. Guncellenmis `StockDetail` dondur

**Response:** Guncellenmis `StockDetail`

**Backend durumu:** Endpoint var, sadece `syncedAt` ekliyor. TODO: Gercek veri cekme.

---

## 3. ANALIZLER

### `GET /api/analyses` — Tum analizleri listele

**Kullanan:** Web `/analizler`, Mobil `analizler` tab

**Response:** `Analysis[]`

```json
[
  {
    "id": "uuid-string",
    "title": "BIST 30 Hisse Analizi",
    "createdAt": "2026-02-17T10:30:00.000Z",
    "type": "stock",
    "summary": "30 varlik analiz edildi.",
    "recommendations": [
      {
        "name": "THYAO",
        "action": "AL",
        "score": 82,
        "reasoning": "Guclu bilanco..."
      }
    ],
    "rawData": [{ "Isim": "THYAO", "Oneri": "AL", "Puan": 82 }],
    "fileName": "analiz_raporu.xlsx"
  }
]
```

**Zorunlu alanlar (8 adet):**

| Alan | Tip | Aciklama |
|------|-----|----------|
| `id` | string | Benzersiz ID |
| `title` | string | Analiz basligi |
| `createdAt` | string | Olusturma zamani ISO 8601 |
| `type` | string | `"fund"` veya `"stock"` |
| `summary` | string | Ozet metin |
| `recommendations` | array | Oneri listesi (asagida) |
| `rawData` | array | Ham veri satirlari |
| `fileName` | string | Yuklenen dosya adi |

**`recommendations` dizisi elemanlari:**

| Alan | Tip | Aciklama |
|------|-----|----------|
| `name` | string | Varlik adi/kodu |
| `action` | string | `"AL"`, `"TUT"`, `"SAT"`, `"IZLE"` |
| `score` | number | 1-100 arasi puan |
| `reasoning` | string | Gerekce metni |

**Frontend gosterimi:**
- Liste sayfasinda: baslik, tarih, tip badge, ozet, aksiyon sayilari (AL:X TUT:X SAT:X IZLE:X)
- Detay sayfasinda: tum alanlar + puan progress bar (70+ yesil, 40-69 sari, <40 kirmizi)

---

### `GET /api/analyses/{id}` — Analiz detay

**Kullanan:** Web `/analizler/[id]`, Mobil `analysis/[id]`

**Response:** Tek `Analysis` objesi (yukaridaki yapiyla ayni)

---

### `DELETE /api/analyses/{id}` — Analiz sil

**Kullanan:** Web + Mobil

**Request:** Bos body

**Response:**
```json
{ "success": true }
```

> **NOT:** Backend su an `{ "ok": true }` donduruyor. `"success"` olarak degistirilmeli.

---

### `POST /api/upload` — Dosya yukle → Analiz olustur

**Kullanan:** Web `/analizler` sayfasindaki yukle dialogu

**Request:** `multipart/form-data`

| Alan | Tip | Zorunlu | Aciklama |
|------|-----|---------|----------|
| `file` | File | evet | Excel (.xlsx) veya CSV dosyasi |
| `title` | string | hayir | Analiz basligi (bos ise dosya adi) |
| `type` | string | hayir | `"fund"` veya `"stock"` (varsayilan: `"fund"`) |

**Excel/CSV beklenen kolon adlari:**

| Kolon | Alternatifler | Eslestigi Alan |
|-------|---------------|----------------|
| `Isim` | `isim`, `Kod`, `kod`, `name` | recommendation.name |
| `Oneri` | `oneri`, `action` | recommendation.action |
| `Puan` | `puan`, `score` | recommendation.score |
| `Gerekce` | `gerekce`, `reasoning` | recommendation.reasoning |

**Beklenen davranis:**
1. Dosyayi oku ve parse et
2. Satirlari recommendations dizisine cevir
3. Analiz objesi olustur ve kaydet
4. Dondur

**Response:** Olusturulan `Analysis` objesi

> **NOT:** Web frontend kendi API route'unda `xlsx` kutuphanesiyle parse ediyor.
> Backend su an dosyayi parse etmiyor, bos recommendations donduruyor.

---

## 4. DIGER

### `GET /health` — Saglik kontrolu

**Response:**
```json
{ "status": "ok" }
```

---

## BILINEN UYUMSUZLUKLAR

| # | Sorun | Oncelik | Aciklama |
|---|-------|---------|----------|
| 1 | Web mock data kullanıyor | YUKSEK | `/api/stocks` ve `/api/funds` route'lari mock data donduruyor, backend'e baglanmıyor |
| 2 | Web Prisma, Mobil backend JSON | YUKSEK | Analizler icin iki farkli veri deposu var — tek kaynaga birlestirilmeli |
| 3 | Backend upload parse etmiyor | YUKSEK | `POST /api/upload` dosyayi okumuyor, bos recommendations donduruyor |
| 4 | Sync endpoint'leri stub | ORTA | Hem fon hem hisse sync sadece `syncedAt` ekliyor, gercek veri cekmiyor |
| 5 | `stocks.json` ve `funds.json` bos | ORTA | Backend basladiginda bos liste donuyor — seed data veya gercek veri cekme gerekli |
| 6 | DELETE response key | DUSUK | Backend `{"ok":true}`, frontend `{"success":true}` bekliyor |
| 7 | `POST /api/analyses` yok | DUSUK | Backend'de programatik analiz olusturma endpoint'i eksik |

---

## DOSYA YAPISI REFERANSI

```
backend/
  main.py                          # Tum API endpoint'leri
  data/
    funds.json                     # Fon verileri (bos)
    stocks.json                    # Hisse verileri (bos)
    analyses.json                  # Analiz verileri

front/
  lib/types.ts                     # Fund, FundDetail, Stock, StockDetail, Analysis
  app/api/
    funds/route.ts                 # GET /api/funds (mock)
    funds/[code]/route.ts          # GET /api/funds/{code} (mock)
    funds/[code]/sync/route.ts     # POST /api/funds/{code}/sync (mock)
    stocks/route.ts                # GET /api/stocks (mock)
    stocks/[symbol]/route.ts       # GET /api/stocks/{symbol} (mock)
    stocks/[symbol]/sync/route.ts  # POST /api/stocks/{symbol}/sync (mock)
    analyses/route.ts              # GET+POST /api/analyses (Prisma)
    analyses/[id]/route.ts         # GET+DELETE /api/analyses/{id} (Prisma)
    upload/route.ts                # POST /api/upload (Prisma + xlsx parse)

mobile/
  lib/types.ts                     # Fund, FundDetail, Stock, StockDetail, Analysis
  lib/api.ts                       # Tum API cagrilari (backend'e baglanir)
```

---

## ENDPOINT OZET TABLOSU

| Endpoint | Method | Backend | Web API | Mobil | Notlar |
|----------|--------|---------|---------|-------|--------|
| `/api/funds` | GET | ✅ | ✅ (mock) | ✅ | |
| `/api/funds/{code}` | GET | ✅ | ✅ (mock) | ✅ | |
| `/api/funds/{code}/sync` | POST | ✅ (stub) | ✅ (mock) | ✅ | TODO: gercek veri |
| `/api/funds` | POST | ✅ | ❌ | ❌ | |
| `/api/stocks` | GET | ✅ | ✅ (mock) | ✅ | |
| `/api/stocks/{symbol}` | GET | ✅ | ✅ (mock) | ✅ | |
| `/api/stocks/{symbol}/sync` | POST | ✅ (stub) | ✅ (mock) | ✅ | TODO: gercek veri |
| `/api/stocks` | POST | ✅ | ❌ | ❌ | |
| `/api/analyses` | GET | ✅ | ✅ (Prisma) | ✅ | |
| `/api/analyses` | POST | ❌ | ✅ (Prisma) | ❌ | Backend'e ekle |
| `/api/analyses/{id}` | GET | ✅ | ✅ (Prisma) | ✅ | |
| `/api/analyses/{id}` | DELETE | ✅ | ✅ (Prisma) | ✅ | Response key farki |
| `/api/upload` | POST | ✅ (stub) | ✅ (parse) | ❌ | Backend parse etmiyor |
| `/health` | GET | ✅ | ❌ | ❌ | |
