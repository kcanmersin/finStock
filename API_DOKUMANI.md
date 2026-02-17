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

---
---

# FRONTEND DOKUMANTASYONU

> Asagida web (Next.js) ve mobil (Expo) uygulamalardaki tum ekranlar,
> kullanici etkilesimleri, bilesenler ve navigasyon akislari belgelenmistir.

---

## WEB UYGULAMASI (Next.js)

### Sayfa: Ana Sayfa `/`

Otomatik olarak `/fonlar` sayfasina yonlendirir. Baska icerik yok.

---

### Sayfa: Fonlar Listesi `/fonlar`

**Veri kaynagi:** `GET /api/funds` → `Fund[]`

**Gorunum:**
- Desktop: Gelismis tablo (tanstack/react-table)
- Mobil: Kart gorunumu (otomatik gecis)

**Tablo kolonlari (11 adet):**

| Kolon | Alan | Format | Siralama | Filtre |
|-------|------|--------|----------|--------|
| ☐ | (secim) | checkbox | - | - |
| Kod | `code` | mono font, **tiklanabilir link** → `/fonlar/{code}` | ✅ | - |
| Fon Adi | `name` | max 250px, truncated | ✅ | string (contains) |
| Tip | `type` | renk kodlu badge | - | string |
| Risk | `riskLevel` | renk kodlu badge "X/7" | ✅ | number |
| Gunluk | `dailyReturn` | yesil/kirmizi % | ✅ | number |
| Aylik | `monthlyReturn` | yesil/kirmizi % | ✅ | number |
| Yillik | `annualReturn` | yesil/kirmizi % | ✅ | number |
| Yonetim Ucreti | `managementFee` | X.XX% | ✅ | number |
| Toplam Deger | `totalValue` | formatLargeNumber | ✅ | number |
| Yatirimci | `investorCount` | formatNumber | ✅ | - |

**Kullanici etkilesimleri:**
1. **Arama:** Fon adina gore anlik filtreleme (text input)
2. **Siralama:** Kolon basligina tiklayarak asc/desc
3. **Filtreleme:** Her kolon icin popover filtre (operatorler: contains, equals, gt, gte, lt, lte)
4. **Coklu secim:** Checkbox ile satirlari sec, toplu sec
5. **Disa aktarma:** Secili satirlari Excel (.xlsx) veya CSV olarak indir
6. **Sayfalama:** Sayfa boyutu (10/20/50/100), ileri/geri, sayfa atlama
7. **Navigasyon:** Fon koduna tikla → `/fonlar/{code}` detay sayfasi

**Tip renk eslesmesi:**

| Tip | Renk |
|-----|------|
| Hisse Senedi | mavi |
| Tahvil/Bono | mor |
| Karma | teal |
| Para Piyasasi | gri |
| Altin | amber |
| Degisken | indigo |
| Katilim | yesil |

**Risk renk eslesmesi:**

| Seviye | Renk |
|--------|------|
| 1-2 | yesil |
| 3-4 | sari |
| 5 | turuncu |
| 6-7 | kirmizi |

**Export kolonlari:** Kod, Adi, Tip, Risk, Gunluk%, Aylik%, Yillik%, Ucret%, Deger, Yatirimci

---

### Sayfa: Fon Detay `/fonlar/[code]`

**Veri kaynagi:** `GET /api/funds/{code}` → `FundDetail`

**Kullanici etkilesimleri:**
1. **Geri butonu** → `/fonlar` listesine don
2. **Verileri Guncelle butonu** → `POST /api/funds/{code}/sync` cagirir, spin animasyonu
3. **Scroll** → Bolumler arasinda gezin

**Gosterilen bolumler:**

| Bolum | Icerik | Kosul |
|-------|--------|-------|
| Header | code (mono, buyuk), name, tip badge, risk badge | her zaman |
| Sync | "Verileri Guncelle" butonu, son sync zamani | her zaman |
| Getiri Grid | Gunluk, Haftalik, Aylik, 3A, 6A, YBB, Yillik, 3Y, 5Y | value != null olan gorunur |
| Fon Bilgileri | Buyukluk, Deger, Yatirimci, Ucret, Giris/Cikis komisyonu, Min yatirim, Kurulus, Benchmark, Yonetici, Saklayici | her zaman |
| Risk Metrikleri | Sharpe, StdSapma, MaxDusus, Beta, Alpha, TrackingError | sharpeRatio/stdDev/maxDrawdown varsa |
| Varlik Dagilimi | Hisse%, Tahvil%, Nakit%, Diger% | totalStockWeight/totalBondWeight varsa |
| Portfoy Detay | Her varligin agirligi | portfolio dizisi bos degilse |

**Layout:** Desktop 2 kolon grid, mobil tek kolon

---

### Sayfa: Hisseler Listesi `/hisseler`

**Veri kaynagi:** `GET /api/stocks` → `Stock[]`

**Tablo kolonlari (13 adet):**

| Kolon | Alan | Format | Siralama | Filtre |
|-------|------|--------|----------|--------|
| ☐ | (secim) | checkbox | - | - |
| Kod | `symbol` | mono font, **tiklanabilir link** → `/hisseler/{symbol}` | ✅ | - |
| Sirket | `name` | max 200px, truncated | ✅ | string |
| Fiyat | `price` | formatCurrency ₺ | ✅ | number |
| Gunluk % | `dailyChange` | yesil/kirmizi | ✅ | number |
| Hacim | `volume` | formatLargeNumber | ✅ | number |
| Piyasa Deg. | `marketCap` | formatLargeNumber | ✅ | number |
| F/K | `peRatio` | .toFixed(1) | ✅ | number |
| PD/DD | `pbRatio` | .toFixed(2) | ✅ | number |
| Haftalik | `weeklyReturn` | yesil/kirmizi % | - | - |
| Aylik | `monthlyReturn` | yesil/kirmizi % | - | number |
| Yillik | `annualReturn` | yesil/kirmizi % | - | number |
| Sektor | `sector` | renk kodlu badge | - | string |

**Sektor renk eslesmesi (18 sektor):**
Ulastirma (sky), Savunma (slate), Bankacilik (emerald), Demir Celik (zinc), Perakende (pink), Cam (cyan), Enerji (amber), Otomotiv (blue), Teknoloji (violet), Madencilik (orange), Holding (indigo), Kimya (teal), Insaat (stone), Gida (lime), Telekom (purple), Beyaz_Esya (gray), GYO (rose), Gubre (green)

**Kullanici etkilesimleri:** Arama, siralama, filtreleme, coklu secim, export, sayfalama — fonlarla ayni pattern

---

### Sayfa: Hisse Detay `/hisseler/[symbol]`

**Veri kaynagi:** `GET /api/stocks/{symbol}` → `StockDetail`

**Kullanici etkilesimleri:**
1. **Geri butonu** → `/hisseler`
2. **Verileri Guncelle butonu** → `POST /api/stocks/{symbol}/sync`
3. **Scroll**

**Gosterilen bolumler:**

| Bolum | Icerik | Kosul |
|-------|--------|-------|
| Header | symbol (mono), name, sektor badge, fiyat, gunluk%, degisim TL | her zaman |
| Getiri Grid | Gunluk, Haftalik, Aylik, Yillik (4 kart) | her zaman |
| Fiyat Bilgileri | Acilis, Onceki Kapanis, Gun Yuksek/Dusuk, 52H Yuksek/Dusuk | alan != null |
| Piyasa Verileri | Piyasa Degeri, Hacim, Ort Hacim, F/K, PD/DD, Beta | her zaman (temel) |
| Finansal Oranlar | EPS, Temettu, ROE, ROA, Net Marj, Brut Marj, Borc/Ozkaynak, Cari Oran | eps/roe/dividendYield varsa |
| Gelir Tablosu | Gelir, Net Kar, FAVOK | revenue/netIncome varsa |
| Sirket Bilgileri | Aciklama, CEO, Merkez, Calisan, Kurulus, Website | description/ceo varsa |

---

### Sayfa: Analizler Listesi `/analizler`

**Veri kaynagi:** `GET /api/analyses` → `Analysis[]`

**Gorunum:** Grid layout (1 kolon mobil, 2 tablet, 3 desktop)

**Her kart gosterir:**
- Ikon (PieChart fon icin, TrendingUp hisse icin)
- Baslik, tarih, tip badge (Fon/Hisse)
- Ozet metin
- Aksiyon sayilari: AL:X TUT:X SAT:X IZLE:X (renk kodlu)
- Detay butonu → `/analizler/{id}`
- Silme butonu (onay sonrasi `DELETE /api/analyses/{id}`)

**Kullanici etkilesimleri:**
1. **Analiz Yukle butonu** → UploadDialog acar
2. **Detay tikla** → `/analizler/{id}`
3. **Sil tikla** → onay → sil
4. **Upload dialog:** drag-drop veya tik ile dosya sec (.xlsx/.csv), baslik gir, tip sec (Fon/Hisse), yukle

**Upload akisi:**
1. Dosya secilir (.xlsx veya .csv)
2. Baslik girilir (opsiyonel — bos ise dosya adi)
3. Tip secilir (Fon/Hisse)
4. `POST /api/upload` ile FormData gonderilir
5. Basarili → toast bildirimi → `/analizler` sayfasina don

---

### Sayfa: Analiz Detay `/analizler/[id]`

**Veri kaynagi:** `GET /api/analyses/{id}` → `Analysis`

**Gosterilen:**
- Header: baslik, tip badge, tarih, dosya adi
- Istatistik kutulari: AL sayisi (yesil), TUT sayisi (sari), SAT sayisi (kirmizi), IZLE sayisi (gri)
- Ozet metin
- Oneriler:
  - **Desktop:** Tablo (sira, isim, oneri badge, puan bar, gerekce)
  - **Mobil:** Kart listesi

**Puan gorseli:**
- 70+ yesil progress bar
- 40-69 sari progress bar
- <40 kirmizi progress bar

**Kullanici etkilesimleri:**
1. **Geri butonu** → `/analizler`
2. **Excel'e aktar** → dropdown (Excel/CSV), onerileri indir
3. **Sil butonu** → `DELETE /api/analyses/{id}`

---

### Sayfa: AI Prompt `/ai-prompt`

**Kullanici etkilesimleri:**
1. **Sekme degistir:** Fon Analizi / Hisse Analizi prompt'lari
2. **Kopyala butonu** → prompt'u panoya kopyalar, 2sn "Kopyalandi" gosterir
3. **Scroll:** 5 adimli rehber kartlarini goruntule

**5 adimli is akisi:**
1. Fonlar/Hisseler sayfasindan veri export et (Excel)
2. Prompt'u kopyala
3. ChatGPT/Claude'a gonderin (veri + prompt)
4. AI ciktisini Excel olarak kaydedin
5. Sisteme yukleyin (`POST /api/upload`)

---

### Web Layout Bilesenleri

**Sidebar (desktop, lg: ve ustu):**
- Logo + uygulama adi
- Navigasyon: Fonlar, Hisseler, Analizler, AI Analiz
- Aktif sayfa vurgusu
- Tema degistirici (light/dark)

**Mobile Header (mobil, lg: alti):**
- Logo + uygulama adi (sol)
- Tema degistirici (sag)
- Backdrop blur efekti

**Bottom Nav (mobil, lg: alti):**
- 4 navigasyon ogesi: Fonlar, Hisseler, Analizler, AI Analiz
- Aktif durum: mavi renk + ust cizgi + ikon buyutme

**Tema:**
- Light / Dark mod destegi
- Tailwind CSS + shadcn/ui bilesen kutuphanesi

---

## MOBIL UYGULAMA (Expo / React Native)

### Tab: Fonlar `(tabs)/fonlar`

**Veri kaynagi:** `api.getFunds()` → `GET /api/funds`

**Kullanici etkilesimleri:**
1. **Arama:** Fon adi veya koduna gore anlik filtreleme
2. **Asagi cekme:** Pull-to-refresh ile yenileme
3. **Karta tikla:** → `/fund/{code}` detay ekranina git
4. **Bos durum:** Veri yoksa ozel mesaj gosterir

**FundCard bileseni gosterir:**
- Fon kodu (mono), fon adi (1 satir)
- Tip badge (renk kodlu), risk badge (X/7 renk kodlu)
- Metrikler satiri: Gunluk%, Aylik%, Yillik%, Ucret%, Buyukluk
- Tiklandiginda spring animasyonu (0.97 olcek) + haptic feedback

---

### Tab: Hisseler `(tabs)/hisseler`

**Veri kaynagi:** `api.getStocks()` → `GET /api/stocks`

**Kullanici etkilesimleri:**
1. **Arama:** Hisse adi veya sembol ile filtreleme
2. **Asagi cekme:** Pull-to-refresh
3. **Karta tikla:** → `/stock/{symbol}` detay ekranina git

**StockCard bileseni gosterir:**
- Sembol (mono) + sektor badge, sirket adi, fiyat + gunluk% (renk kodlu)
- Metrikler: Haftalik%, Aylik%, Yillik%, Hacim, F/K
- Spring animasyonu + haptic feedback

---

### Tab: Analizler `(tabs)/analizler`

**Veri kaynagi:** `api.getAnalyses()` → `GET /api/analyses`

**Kullanici etkilesimleri:**
1. **Asagi cekme:** Pull-to-refresh
2. **Karta tikla:** → `/analysis/{id}` detay ekranina git
3. **Sil ikonu tikla:** Onay dialogu → `api.deleteAnalysis(id)` → haptic warning feedback

**AnalysisCard bileseni gosterir:**
- Baslik (2 satir max), tip badge (Fon/Hisse), tarih
- Ozet metin (2 satir truncated)
- Aksiyon sayilari: AL (yesil), TUT (sari), SAT (kirmizi), IZLE (gri)
- Silme butonu (cop kutusu ikonu)

---

### Tab: AI Prompt `(tabs)/ai-prompt`

**Kullanici etkilesimleri:**
1. **Yatay kaydirma:** 5 adimli rehber kartlari
2. **Sekme degistir:** Fon / Hisse prompt'lari (haptic feedback)
3. **Kopyala butonu:** Prompt'u panoya kopyalar → onay (checkmark, 2sn)

---

### Ekran: Fon Detay `/fund/[code]`

**Veri kaynagi:** `api.getFund(code)` → `GET /api/funds/{code}`

**Kullanici etkilesimleri:**
1. **Verileri Guncelle:** `api.syncFund(code)` → donen ikon animasyonu (Reanimated) + haptic
2. **Basari/hata:** Haptic notification (success/error) + Alert
3. **Geri:** Header back butonu

**Gosterilen bolumler:** (web versiyonuyla ayni — kosullu kart gosterimi)

---

### Ekran: Hisse Detay `/stock/[symbol]`

**Veri kaynagi:** `api.getStock(symbol)` → `GET /api/stocks/{symbol}`

**Kullanici etkilesimleri:**
1. **Verileri Guncelle:** `api.syncStock(symbol)` → animasyon + haptic
2. **Geri:** Header back butonu

**Gosterilen bolumler:** (web versiyonuyla ayni — kosullu kart gosterimi)

---

### Ekran: Analiz Detay `/analysis/[id]`

**Veri kaynagi:** `api.getAnalysis(id)` → `GET /api/analyses/{id}`

**Gosterilen:**
- Baslik, tip badge, tarih
- Ozet kutusu
- Istatistik satiri: AL/TUT/SAT/IZLE sayilari (renk kodlu kutular)
- Oneri kartlari: isim, aksiyon badge, puan bar (renk kodlu), puan/100, gerekce

---

### Mobil Navigasyon Yapisi

```
(tabs)/
  ├── fonlar        → liste
  ├── hisseler      → liste
  ├── analizler     → liste
  └── ai-prompt     → rehber

fund/[code]         → fon detay (stack push)
stock/[symbol]      → hisse detay (stack push)
analysis/[id]       → analiz detay (stack push)
```

**Tab bar:** 4 sekme — Fonlar (pie-chart), Hisseler (trending-up), Analizler (document-text), AI Prompt (sparkles)

**Stack animasyonu:** `slide_from_right`

---

### Mobil Ortak Bilesenler

| Bilesen | Dosya | Kullanim |
|---------|-------|----------|
| `FundCard` | components/FundCard.tsx | Fon listesinde her kart |
| `StockCard` | components/StockCard.tsx | Hisse listesinde her kart |
| `AnalysisCard` | components/AnalysisCard.tsx | Analiz listesinde her kart |
| `Badge` | components/Badge.tsx | Tip, risk, sektor etiketleri |
| `ReturnText` | components/ReturnText.tsx | Getiri % degerleri (yesil/kirmizi/gri, sm/md/lg) |
| `SearchBar` | components/SearchBar.tsx | Arama cubugu (ikon + input + temizle) |
| `EmptyState` | components/EmptyState.tsx | Bos liste durumu (ikon + baslik + mesaj) |

---

## FORMAT FONKSIYONLARI

### Web (`front/lib/utils.ts`)

| Fonksiyon | Ornek Cikti |
|-----------|-------------|
| `formatCurrency(312.4)` | `₺312,40` |
| `formatNumber(184200)` | `184.200` |
| `formatLargeNumber(431200000000)` | `431,2 Milyar` |
| `formatLargeNumber(48520000)` | `48,5 Milyon` |
| `formatPercentage(2.35)` | `+2.35%` |
| `formatPercentage(-1.20)` | `-1.20%` |

### Mobil (`mobile/lib/format.ts`)

| Fonksiyon | Ornek Cikti |
|-----------|-------------|
| `formatCurrency(312.4)` | `₺312,40` |
| `formatNumber(184200)` | `184.200` |
| `formatLargeNumber(431200000000)` | `431.2B` |
| `formatLargeNumber(48520000)` | `48.5M` |
| `formatPercentage(2.35)` | `+2.35%` |

> **NOT:** Web ve mobil format fonksiyonlari farkli cikti uretir:
> Web `Milyar/Milyon`, mobil `B/M/K` kullanir.
