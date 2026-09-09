<div align="center">

# 🖥️ Device Registry API

**4TheWall profesyonel AV sistemleri için merkezi cihaz kayıt ve sorgulama servisi**

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.2-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.6-47A248?logo=mongodb&logoColor=white)
![Jest](https://img.shields.io/badge/Tests-10%20passing-C21325?logo=jest&logoColor=white)

</div>

## 📑 Proje Hakkında

Device Registry API, video wall controller, encoder, decoder, ekran, KVM ve ağ cihazlarının **merkezi olarak kaydedilip sorgulanabildiği** bir REST servisidir. Saha ekiplerinin farklı sitelerdeki cihaz envanterini tek bir yerden yönetmesini, filtrelemesini ve toplu olarak aktarmasını sağlar.

Proje, hazır bir backend framework şablonu kullanılmadan **sıfırdan katman katman** geliştirilmiştir: route → validation → controller → service → database zinciri elle kurulmuştur.

### 🏗️ Mimari

Uygulama **beş sorumluluk katmanına** ayrılmıştır:

1. **Route** (`src/routes/`) — Hangi HTTP metodu + yol hangi fonksiyona gidecek
2. **Validation** (`src/validation/` + `src/middleware/validate.ts`) — Gövde şemaya uyuyor mu
3. **Controller** (`src/controllers/`) — HTTP isteğini servise bağlar, cevabı biçimlendirir
4. **Service** (`src/services/`) — İş mantığı ve veritabanı erişimi
5. **Database** (`src/config/database.ts`) — MongoDB bağlantısı, connection pool, indeksler

Hata hangi katmanda oluşursa oluşsun tek bir merkezi `errorHandler`'a düşer ve oradan cevaba dönüşür.

### 🌟 Temel Özellikler

- 🔁 **Tam CRUD**: Oluşturma, listeleme, tekil getirme, tam güncelleme, kısmi güncelleme, silme
- 📦 **Toplu Aktarım**: `POST /devices/bulk` ile tek istekte çok cihaz
- 🔍 **Çoklu Filtreleme**: `type`, `online`, `enabled`, `firmwareVersion` — birlikte kullanılabilir
- 🛡️ **Şema Tabanlı Validation**: Zod ile runtime doğrulama, geçersiz veri DB'ye hiç ulaşmaz
- 🔐 **Veritabanı Seviyesinde Benzersizlik**: `deviceCode` ve `serialNumber` için unique index
- 🧩 **Akıllı PATCH**: İç içe alanlar düzleştirilir, gönderilmeyen kardeş alanlar korunur
- 📊 **Excel → CSV → JSON → API Zinciri**: Envanter tablosundan validation'lı toplu yükleme
- ⚡ **Fail Fast Açılış**: MongoDB'ye bağlanamazsa HTTP sunucusu hiç açılmaz
- 🌐 **Ortama Göre Bağlanma**: Development'ta tek adres, production'da açıkça iki adres
- 📐 **Tutarlı Response Zarfı**: Her cevap `{ data, meta? }` veya `{ error }` şeklinde
- ✅ **Otomatik Testler**: Jest + Supertest ile 10 test, ayrı test veritabanında
- 📮 **Hazır Postman Koleksiyonu**: 12 istek, zincirlenmiş environment değişkenleriyle

---

## 🛠️ Teknoloji Stack'i

| Katman | Seçim | Neden |
|---|---|---|
| **Dil** | TypeScript 5.9 | Derleme anında tip güvenliği |
| **Çalışma ortamı** | Node.js 20+ (ESM) | — |
| **HTTP sunucu** | Express 5.2 | Minimal, katmanları elle kurmaya uygun |
| **Veritabanı** | MongoDB 7.6 (resmi `mongodb` sürücüsü) | İç içe cihaz modeli için doküman yapısı uygun |
| **Validation** | Zod 4 | Tek şemadan hem runtime doğrulama hem statik tip |
| **Environment** | dotenv | Ortama göre `.env` dosyası yükleme |
| **Test** | Jest 30 + Supertest | Gerçek port açmadan endpoint testi |
| **CSV** | csv-parse | RFC 4180 uyumlu ayrıştırma |
| **Geliştirme** | tsx | Derlemeden TypeScript çalıştırma + watch |

---

## ⚙️ Kurulum ve Çalıştırma

### Ön Gereksinimler

- **Node.js** 20.0 veya üzeri
- **MongoDB** (yerel kurulum, varsayılan port `27017`)
- **npm**
- **Git**

MongoDB'nin ayakta olduğunu doğrulamak için:

```bash
brew services list          # macOS
```

### Hızlı Kurulum

1. **Depoyu klonlayın:**
   ```bash
   git clone https://github.com/egekutay0/device-registry-api.git
   cd device-registry-api
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Environment dosyalarını oluşturun:**
   ```bash
   cp .env.example .env.development
   cp .env.example .env.production
   ```

4. **Development sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

5. **Doğrulayın:**
   ```bash
   curl http://127.0.0.1:1882/api/v1/health
   ```

### 📋 npm Script'leri

| Komut | Ne yapar |
|---|---|
| `npm run dev` | Development sunucusu, dosya değişikliğinde otomatik yeniden başlar |
| `npm run build` | TypeScript'i derler, `dist/` üretir (tip kontrolü dahil) |
| `npm start` | Derlenmiş kodu production ortamında çalıştırır |
| `npm test` | Jest testlerini çalıştırır |
| `npm run csv:convert` | `data/devices.csv` → `data/devices.json` |

> ⚠️ `npm start` çalıştırmadan önce `npm run build` yapılmalıdır.

---

## 🔑 Environment Değişkenleri

Proje **üç ortam** kullanır. Hangi dosyanın okunacağını `APP_ENV` belirler; verilmezse `development` varsayılır.

| Dosya | Ne zaman kullanılır | Git'e gider mi |
|---|---|---|
| `.env.development` | `npm run dev` | ❌ |
| `.env.production` | `npm start` | ❌ |
| `.env.test` | `npm test` | ✅ |
| `.env.example` | Şablon | ✅ |

### Değişkenler

| Değişken | Açıklama | Örnek |
|---|---|---|
| `APP_ENV` | Çalışma ortamı | `development` |
| `PORT` | Dinlenecek port | `1882` |
| `BIND_HOST` | Development'ta bağlanılacak adres | `0.0.0.0` |
| `DEVICE_IP` | Production'da cihazın ağ adresi | `192.168.1.50` |
| `MONGODB_URI` | MongoDB bağlantı adresi | `mongodb://127.0.0.1:27017` |
| `MONGODB_DB_NAME` | Veritabanı adı | `device_registry` |

### 🌐 Development ve Production Bağlanma Farkı

- **Development:** `BIND_HOST` (`0.0.0.0`) üzerinde **tek adreste** dinler — makinedeki tüm ağ arayüzlerinden erişilebilir, geliştirme sırasında pratiktir.
- **Production:** `0.0.0.0` **kullanılmaz.** Uygulama **iki ayrı adreste** dinler: `127.0.0.1:1882` ve `DEVICE_IP:1882`. Böylece hangi arayüzlerin açık olduğu kodda açıkça görünür; makineye sonradan eklenen bir ağ arayüzü API'yi istemeden dışarı açmaz.

`DEVICE_IP` kod içinde sabit yazılmaz, environment'tan okunur.

---

## 🚀 API

**Taban adres:** `http://127.0.0.1:1882/api/v1`

### Endpoint'ler

| Metod | Yol | Açıklama | Başarı |
|---|---|---|---|
| `GET` | `/health` | Servis sağlık kontrolü | 200 |
| `POST` | `/devices` | Yeni cihaz oluşturur | 201 |
| `POST` | `/devices/bulk` | Birden fazla cihaz oluşturur | 201 |
| `GET` | `/devices` | Cihazları listeler, filtrelenebilir | 200 |
| `GET` | `/devices/:id` | Tek cihaz getirir | 200 |
| `PUT` | `/devices/:id` | Cihazı bütün olarak değiştirir | 200 |
| `PATCH` | `/devices/:id` | Yalnızca gönderilen alanları değiştirir | 200 |
| `DELETE` | `/devices/:id` | Cihazı siler | 204 |

### 🔍 Filtreler

`GET /devices` şu query parametrelerini destekler; birden fazlası birlikte kullanılabilir:

| Parametre | Örnek |
|---|---|
| `type` | `?type=encoder` |
| `online` | `?online=true` |
| `enabled` | `?enabled=true` |
| `firmwareVersion` | `?firmwareVersion=1.4.2` |

```http
GET /api/v1/devices?type=encoder&online=true
```

---

## 📐 Response Formatı

Her cevap gövdesi bir JSON nesnesidir ve **tam olarak bir üst seviye anahtar** taşır.

### ✅ Başarılı

```json
{
  "data": { "id": "550e8400-...", "deviceCode": "FTW-CTRL-001", "...": "..." }
}
```

Liste dönen endpoint'lerde ek bilgi `meta` altında verilir:

```json
{
  "data": [ { "...": "..." } ],
  "meta": { "count": 12 }
}
```

### ❌ Hatalı

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Geçersiz istek gövdesi — network.ipAddress: Geçerli bir IPv4 adresi olmalıdır"
  }
}
```

`code` sabittir ve **makine tarafından** okunmak içindir; `message` **insan** içindir ve değişebilir.

### ⚡ İstisnalar

- `DELETE` işlemi `204 No Content` döner, gövdesi yoktur.
- `GET /health` sarmalanmaz. Bu endpoint'i yük dengeleyiciler ve izleme sistemleri tüketir; sabit ve basit bir şekil beklerler.

### 📟 Durum Kodları

| Kod | Anlamı | Ne zaman |
|---|---|---|
| `200` | OK | Başarılı okuma/güncelleme |
| `201` | Created | Yeni kayıt oluşturuldu |
| `204` | No Content | Silme başarılı, dönecek veri yok |
| `400` | Bad Request | Validation hatası veya bozuk JSON |
| `404` | Not Found | Kayıt veya endpoint bulunamadı |
| `409` | Conflict | `deviceCode` / `serialNumber` çakışması |
| `500` | Internal Server Error | Öngörülmemiş sunucu hatası |

> 🔒 500 cevaplarında istemciye teknik detay gönderilmez; detay sunucu günlüğüne yazılır.

---

## 📊 Veri Modeli

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "deviceCode": "FTW-CTRL-001",
  "name": "Control Room Controller",
  "type": "controller",
  "manufacturer": "4TheWall",
  "model": "Wall Controller",
  "serialNumber": "SN-000001",
  "firmwareVersion": "1.4.2",
  "network": {
    "hostname": "wall-controller-01",
    "ipAddress": "192.168.1.50",
    "macAddress": "00:11:22:33:44:55",
    "managementPort": 8080,
    "dhcp": false
  },
  "location": { "site": "Ankara Office", "room": "Control Room", "rack": "R01", "rackUnit": 12 },
  "display": { "width": 3840, "height": 2160, "refreshRate": 60 },
  "capabilities": {
    "inputs": ["HDMI", "RTSP"],
    "outputs": ["HDMI", "DisplayPort"],
    "codecs": ["H264", "H265"],
    "maxResolution": "3840x2160"
  },
  "status": { "online": true, "lastSeenAt": "2026-08-26T12:00:00.000Z" },
  "tags": ["control-room", "primary"],
  "enabled": true,
  "notes": "Main controller",
  "createdAt": "2026-09-01T08:00:00.000Z",
  "updatedAt": "2026-09-01T08:00:00.000Z"
}
```

### Cihaz Tipleri

```typescript
type DeviceType =
  | "controller"   // Video wall controller
  | "encoder"      // Kaynak sinyalini ağa kodlar
  | "decoder"      // Ağdan gelen sinyali ekrana çözer
  | "display"      // Ekran / panel
  | "kvm"          // Klavye-video-mouse switch
  | "network"      // Switch, router
  | "other";       // Diğer (UPS vb.)
```

| Özellik | Alanlar |
|---|---|
| 🔑 **Benzersiz** | `deviceCode`, `serialNumber` — MongoDB unique index ile garanti |
| 🤖 **Sunucu üretir** | `id`, `createdAt`, `updatedAt` — istemciden gönderilseler bile dikkate alınmaz |
| ➖ **İsteğe bağlı** | `firmwareVersion`, `notes` |

### Validation Kuralları

| Alan | Kural |
|---|---|
| `deviceCode` | Boş olamaz |
| `name` | Boş olamaz |
| `type` | Geçerli tiplerden biri olmalı |
| `network.ipAddress` | Geçerli IPv4 formatında olmalı |
| `network.managementPort` | 1–65535 arası tam sayı |
| `display.width` / `height` / `refreshRate` | Pozitif tam sayı |
| `enabled` | Boolean |

---

## 📥 Excel → CSV → JSON → API Akışı

Toplu cihaz aktarımı şu zincirle yapılır:

```
data/devices.xlsx
  → (Excel'de CSV olarak kaydet) → data/devices.csv
  → (npm run csv:convert)        → data/devices.json
  → (POST /api/v1/devices/bulk)  → validation → MongoDB
```

> CSV **doğrudan MongoDB'ye import edilmez.** Veri, uygulamanın kendi validation ve iş mantığı katmanlarından geçer; ID üretimi ve zaman damgaları uygulama tarafında yapılır.

### Dönüşümde Yapılanlar

CSV düz bir tablodur; iç içe yapı ve tip bilgisi taşımaz. `src/scripts/csvToJson.ts` bu ikisini geri kurar:

| Sorun | Çözüm |
|---|---|
| İç içe yapı yok | **Nokta gösterimi çözülür:** `network.ipAddress` sütunu → `{ network: { ipAddress: ... } }` |
| Dizi yok | **Ayırıcıyla bölünür:** `"HDMI\|RTSP"` → `["HDMI", "RTSP"]` |
| Her şey metin | **Tipler dönüştürülür:** `"8080"` → `8080`, `"true"` → `true` |

Bulk isteğin gövde formatı:

```json
{ "devices": [ { }, { }, { } ] }
```

---

## 🧪 Testler

```bash
npm test
```

Testler `.env.test` dosyasını okur ve **ayrı bir veritabanında** (`device_registry_test`) çalışır; gerçek veriye dokunmaz.

`supertest` kullanıldığı için sunucunun ayrıca çalıştırılması gerekmez — Express `app` nesnesi doğrudan test edilir, uygulamanın gerçek portu açılmaz.

### Kapsam (10 test)

| # | Test | Doğruladığı |
|---|---|---|
| 1 | Health | `GET /health` → 200 |
| 2 | Create | Geçerli cihaz → 201 |
| 3 | Conflict | Duplicate `deviceCode` → 409 |
| 4 | Read | Var olan cihaz → 200 |
| 5 | Not found | Olmayan cihaz → 404 |
| 6 | Validation | Geçersiz payload → 400 |
| 7 | PATCH | Yalnızca gönderilen alan değişir, kardeş alanlar korunur |
| 8 | PUT | Eksik zorunlu alanlı istek reddedilir |
| 9 | DELETE | Silme sonrası aynı ID → 404 |
| 10 | Filter | `firmwareVersion` filtresi doğru sonucu döner |

---

## 📮 Postman

`postman/` klasöründe iki dosya bulunur:

- `Device-Registry-API.postman_collection.json` — **12 istek**
- `Device-Registry-API.postman_environment.json` — `BASE_URL`, `DEVICE_ID`, `TEST_RUN`

İkisini de Postman'e import edip environment'ı seçtikten sonra **Run collection** ile tamamı çalıştırılabilir.

İstek URL'lerinde adres sabit yazılmaz, `{{BASE_URL}}` kullanılır. `02 - Create Device` isteği cevaptan gelen `id` değerini `DEVICE_ID` environment değişkenine yazar; sonraki istekler bu değeri kullanır.

---

## 📁 Proje Yapısı

```
device-registry-api/
├── src/
│   ├── app.ts                      # Express uygulaması (middleware + route'lar)
│   ├── server.ts                   # Uygulamayı ağa açar (dinleme)
│   │
│   ├── config/
│   │   ├── env.ts                  # Environment okuma ve doğrulama
│   │   └── database.ts             # MongoDB bağlantısı ve indeksler
│   │
│   ├── routes/                     # Metod + yol → fonksiyon eşlemesi
│   │   ├── index.ts                # Route gruplarını /api/v1 altında toplar
│   │   ├── health.routes.ts
│   │   └── device.routes.ts
│   │
│   ├── controllers/                # HTTP isteğini servise bağlar
│   │   ├── health.controller.ts
│   │   └── device.controller.ts
│   │
│   ├── services/
│   │   └── device.service.ts       # İş mantığı ve veritabanı erişimi
│   │
│   ├── models/
│   │   └── device.ts               # Veri modeli ve tipler
│   │
│   ├── validation/
│   │   └── device.schema.ts        # Zod şemaları
│   │
│   ├── middleware/
│   │   ├── validate.ts             # Gövde doğrulama
│   │   ├── notFound.ts             # Eşleşmeyen endpoint → 404
│   │   └── errorHandler.ts         # Merkezi hata yönetimi
│   │
│   ├── utils/
│   │   ├── id.ts                   # UUID üretimi
│   │   ├── errors.ts               # Hata sınıfları
│   │   ├── response.ts             # Başarılı cevap formatı
│   │   └── flatten.ts              # İç içe nesne → nokta gösterimi
│   │
│   ├── scripts/
│   │   └── csvToJson.ts            # CSV → JSON dönüştürücü
│   │
│   └── tests/
│       └── api.test.ts             # Jest + Supertest testleri
│
├── data/
│   ├── devices.xlsx                # Kaynak envanter tablosu
│   ├── devices.csv                 # Excel'den dışa aktarım
│   └── devices.json                # Dönüştürülmüş, API'ye gönderilebilir hal
│
├── postman/
│   ├── Device-Registry-API.postman_collection.json
│   └── Device-Registry-API.postman_environment.json
│
├── .env.example                    # Environment şablonu
├── .env.test                       # Test ortamı ayarları
├── jest.config.js
├── tsconfig.json
├── package.json
└── README.md                       # Bu dosya
```

### 🔄 İstek Akışı

```
Client
  → HTTP Request
  → Route            (hangi fonksiyon?)
  → Validation       (gövde şemaya uyuyor mu?)
  → Controller       (isteği servise bağla)
  → Service          (iş mantığı)
  → MongoDB
  → Service
  → Controller       (cevabı biçimlendir)
  → HTTP Response
  → Client
```

Hata oluşursa akış her katmandan merkezi `errorHandler` üzerine düşer ve oradan cevaba dönüşür.

---

## 💡 Tasarım Kararları

### 🔑 ID stratejisi — uygulama tarafında UUID v4

`crypto.randomUUID()` ile üretilir (Node.js'in yerleşik fonksiyonu, ek paket yok) ve MongoDB'ye ayrı bir alan olarak değil doğrudan **`_id` olarak** yazılır. Böylece tek bir kimlik olur ve MongoDB'nin `_id` üzerindeki otomatik benzersizlik garantisi ile indeksi ücretsiz kullanılır. ID veritabanı yerine uygulama tarafından üretildiği için kayıt yazılmadan **önce** bilinir; bu, toplu aktarımda kolaylık sağlar.

### 🔐 Benzersizlik veritabanı seviyesinde

`deviceCode` ve `serialNumber` için unique index tanımlanır. Uygulama içinde "önce sorgula, sonra yaz" yöntemi kullanılsaydı, eşzamanlı iki istek arasında **yarış durumu (race condition)** oluşabilirdi.

### ⚡ MongoDB bağlantısı kurulamazsa uygulama başlamaz (fail fast)

Veritabanı bu API için zorunlu bir bağımlılıktır; onsuz hiçbir endpoint anlamlı çalışamaz. Ayakta ama işlevsiz bir servis, açıkça çökmüş bir servisten daha zor teşhis edilir. Bu karar **yalnızca açılış anını** kapsar — uygulama çalışırken bağlantı koparsa MongoDB sürücüsü kendiliğinden yeniden bağlanır.

### 🛡️ Validation ayrı bir katmanda, controller'dan önce

Geçersiz istekler veritabanına hiç ulaşmadan elenir. Aynı şema hem POST hem PUT için kullanılır. TypeScript tipleri derleme sonrası silindiği için dışarıdan gelen veri **çalışma anında ayrıca** doğrulanmak zorundadır.

### 🧩 PATCH'te iç içe alanlar düzleştirilir

`$set` ile bir iç içe nesne doğrudan yazılırsa o nesnenin tamamı değiştirilir ve gönderilmeyen kardeş alanlar silinir. Bunu önlemek için gövde nokta gösterimine çevrilip (`status.online`) öyle yazılır. Diziler ve tarih nesneleri **bilerek** düzleştirilmez; onlarda birleştirme değil komple değiştirme beklenir.

### 🧱 `app.ts` ve `server.ts` ayrıdır

`app` uygulamayı tanımlar, `server` onu ağa açar. Bu ayrım sayesinde testler `app`'i doğrudan kullanabilir ve uygulamanın gerçek portu açılmadan endpoint testi yapılabilir.

### ➕ `firmwareVersion` isteğe bağlı olarak eklendi

Zorunlu yapılsaydı mevcut istemciler, mevcut kayıtlar ve mevcut testler kırılırdı. Var olan bir API'ye alan eklerken alanın **isteğe bağlı olması**, geriye dönük uyumluluğun koşuludur.

---

## ⚠️ Bilinen Sınırlar

| Sınır | Detay |
|---|---|
| **Bulk transaction değil** | `POST /devices/bulk` hata durumunda o ana kadar yazılmış kayıtları geri almaz. Gerçek transaction MongoDB'de replica set gerektirir. En olası kısmi yazma sebebini önlemek için, gövde içindeki tekrarlar veritabanına gidilmeden önce kontrol edilir. |
| **CORS yok** | API'nin istemcileri Postman ve otomatik testlerdir. Tarayıcıdan çağıran bir web arayüzü eklenirse `cors` middleware'i gerekir. |
| **Authentication yok** | Servis kapalı ağ içinde çalışacak şekilde tasarlanmıştır. Dışa açılacaksa kimlik doğrulama katmanı eklenmelidir. |
| **Sayfalama yok** | `GET /devices` tüm eşleşen kayıtları döner. Kayıt sayısı büyürse `limit`/`skip` eklenmelidir. |

---

<div align="center">

**4TheWall — Device Registry API**

</div>
