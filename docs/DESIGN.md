# Kebun Raya Bogor — Design Brief (Technoscape UNIKU)

> Konsep: **"Arsip Hidup"** — website sebagai buku herbarium digital yang hidup: elegan seperti katalog botani klasik, namun interaktif dan modern. Editorial (serif, ruang lega, foto besar) bertemu utilitas (peta, status mekar, tiket).

---

## 1. Design System

### 1.1 Palet Warna

| Peran | Token | Hex | Pemakaian |
|---|---|---|---|
| Deep Forest (primer) | `forest-900` | `#16301F` | Heading, surface gelap, footer, navbar solid |
| Forest gelap | `forest-950` | `#0F2419` | Overlay foto hero, section imersif |
| Forest medium | `forest-700` | `#2C5A3F` | Hover, link, ikon aktif |
| Sage | `sage-600` | `#5E7257` | Teks sekunder di atas cream (4.9:1) |
| Sage muda | `sage-100` | `#E3E9DA` | Surface kartu alternatif, chip filter |
| Warm Cream (latar) | `cream-50` | `#FBF8F1` | Background halaman |
| Cream | `cream-100` | `#F4EDDF` | Section selang-seling, kartu |
| Emas (aksen premium) | `gold-400` | `#D4AF62` | Highlight di atas forest, garis ornamen, badge "Sedang Mekar" |
| Emas teks | `gold-700` | `#7A5A1C` | Teks emas di atas latar terang |
| Terakota (CTA) | `terra-600` | `#A14E2C` | Tombol "Pesan Tiket" (teks putih 5.8:1) |
| Ink | `ink` | `#1C2620` | Body text |

**Aturan 60-30-10:** 60% cream, 30% forest/sage, 10% emas + terakota. Terakota **hanya** untuk aksi utama (tiket), emas untuk sorotan/ornamen, supaya mata juri langsung tahu "di mana harus klik".

Kontras sudah dicek (WCAG AA): `terra-500` + teks putih **gagal** (4.05:1) → gunakan `terra-600` untuk tombol.

### 1.2 Tipografi

| Peran | Font | Alasan |
|---|---|---|
| Display / Heading | **Fraunces** (variable, optical size, italic) | Serif "soft" dengan karakter organik, terasa seperti katalog botani abad 19, mewakili sejarah 1817 tanpa terlihat kuno. Italic-nya cantik untuk nama ilmiah. |
| Body / UI | **Plus Jakarta Sans** | Sans modern yang **didesain oleh studio Indonesia (Tokotype)** untuk identitas kota Jakarta, jadi bisa dijadikan poin cerita lokal saat presentasi ke juri. |

Skala (desktop → mobile):
- Display hero: `text-7xl/8xl` (72–96px) → `text-5xl`, weight 400, `tracking-tight`, `leading-[0.95]`
- H2 section: `text-5xl` → `text-4xl`, weight 400
- H3 kartu: `text-2xl`, weight 500
- Eyebrow/label: Plus Jakarta 12–13px, `uppercase tracking-[0.2em]`, weight 600
- Body: 16–18px, `leading-relaxed`, maks ~65 karakter per baris
- Nama ilmiah: Fraunces *italic* (konvensi botani: genus & spesies selalu miring)

### 1.3 Gaya Komponen

| Elemen | Spesifikasi |
|---|---|
| Radius | `rounded-chip` 8px (input, chip) · `rounded-card` 16px (kartu) · `rounded-panel` 28px (panel fitur, media hero) · `rounded-full` (tombol pill) |
| Shadow | Selalu ber-tint hijau, tidak pernah hitam murni: `shadow-soft` (kartu), `shadow-lift` (hover/modal), `shadow-glow` (elemen emas aktif) |
| Glassmorphism | `glass` (di atas foto/surface gelap): cream 10% + blur 18px + border 16%. `glass-light` untuk navbar saat scroll. **Hanya di atas imagery**; fallback solid otomatis bila browser tidak mendukung blur. |
| Tombol primer | Pill terakota `terra-600`, teks putih, ikon panah, hover → `terra-700` + panah bergeser 4px |
| Tombol sekunder | Pill outline cream/forest, atau glass di atas foto |
| Ikon | Lucide (garis 1.5px), tidak ada emoji |
| Ornamen | Ilustrasi garis daun / herbarium (SVG tipis emas), tekstur grain halus 3–4% di section gelap |
| Motion | Easing `ease-organic` (cubic-bezier .22,1,.36,1). UI 150–250ms, reveal 600–800ms, stagger 60ms. Semua dimatikan saat `prefers-reduced-motion`. |

Token lengkap ada di `src/index.css`.

---

## 2. Sitemap & Section Breakdown

```
Beranda (/)
├── Jelajah Flora (/flora) ── Katalog + Konservasi
│     └── Detail Flora (/flora/:slug) — drawer/modal
├── Peta & Tiket (/kunjungi) ── Peta Interaktif + Reservasi
│     └── E-Tiket (/kunjungi/tiket/:id)
└── Footer links: Agenda · Tentang · Riset (BRIN) · FAQ · Kontak
```

> Struktur Landing Page di bawah adalah **draf**. Urutan dan gaya tiap section akan disesuaikan dengan referensi yang diberikan, satu per satu.

### 2.1 Landing Page

1. **Navbar**: logo, menu (Jelajah Flora · Peta · Agenda · Tentang), toggle ID/EN, CTA pill "Pesan Tiket". Transparan di atas hero, berubah `glass-light` saat scroll.
2. **Hero (imersif)**: foto/video full-bleed, headline serif besar, sub-headline, 2 CTA. Di bawahnya ada **strip info glass**: jam buka hari ini · cuaca Bogor · tingkat keramaian.
3. **Angka Kunci**: sejak 1817 · 87 ha · 12.000+ koleksi · jumlah spesies terancam yang dilindungi (count-up saat terlihat).
4. **Kisah Dua Abad**: narasi singkat + timeline horizontal (1817 pendirian → herbarium → era riset → kini di bawah BRIN).
5. **Spot Ikonik**: kartu geser horizontal: Jembatan Gantung Merah, Taman Meksiko, Danau Gunting, Taman Teijsmann, Monumen Lady Raffles.
6. **Bloom Watch** *(Fitur 2)*: status "sedang/akan mekar" Bunga Bangkai & Rafflesia dengan hitung mundur.
7. **Preview Peta Interaktif** *(Fitur 1)*: potongan peta yang bisa di-hover, CTA "Buka Peta Lengkap".
8. **Konservasi & Edukasi**: flora pilihan bulan ini, status IUCN, program edukasi sekolah, "Adopsi Pohon".
9. **Pengalaman & Agenda**: tur berpemandu, wisata malam, sepeda, workshop. Kartu dengan tanggal.
10. **Tiket & Paket**: 3 kartu harga (Reguler · Keluarga · Tur Edukasi), terakota pada paket utama.
11. **Testimoni / UGC**: kutipan pengunjung + galeri foto.
12. **Info Kunjungan**: lokasi (embed peta), transport, aksesibilitas, FAQ accordion.
13. **CTA Penutup**: "Rencanakan kunjunganmu", lalu Footer.

### 2.2 Jelajah Flora (Katalog & Konservasi)

1. Hero ringkas + **search besar** (cari nama lokal / ilmiah / famili, toleran salah ketik)
2. Chip filter: Sedang Mekar · Terancam Punah (IUCN) · Endemik Indonesia · Zona Kebun · Famili
3. Grid kartu flora (foto, nama lokal, nama ilmiah italic, badge IUCN, lokasi zona)
4. Drawer detail: galeri, deskripsi, asal, status konservasi, fakta unik, tombol **"Lihat di Peta"** (deep link ke `/kunjungi?spot=...`)
5. Section Konservasi: program bank biji, pembibitan, riset, dengan angka dampak
6. CTA "Adopsi Pohon" / donasi konservasi

### 2.3 Peta & Tiket

1. **Peta interaktif full-width** + sidebar layer (Spot · Fasilitas: toilet, musala, kafe, parkir, gerbang · Aksesibilitas)
2. **Rute Pintar**: pilih durasi (1/2/3 jam) + minat, lalu rute tergambar di peta
3. **Reservasi (stepper 4 langkah)**, ringkasan harga sticky di samping:
   1. Tanggal & sesi (kalender dengan indikator kapasitas: hijau/kuning/merah)
   2. Jenis tiket & jumlah (dewasa, anak, WNA, kendaraan)
   3. Add-on (tur pemandu, sewa sepeda, mobil wisata)
   4. Data & pembayaran, lalu **E-tiket QR** (mock) + tombol tambah ke kalender
4. Info penting: jam buka, aturan kunjungan, pembatalan

---

## 3. Fitur Unggulan (Wow Factor)

### 3.1 Peta Kebun Interaktif + Rute Pintar
Peta ilustrasi SVG (gaya peta botani vintage) dengan zona yang bisa diklik → kartu glass berisi foto, deskripsi, flora unggulan. Pengguna memilih **durasi + minat** ("Sejarah", "Tanaman Langka", "Foto Spot", "Ramah Anak") dan rute tergambar dengan animasi garis (`stroke-dashoffset`).
- **Teknis:** SVG + React state, data JSON, tanpa library peta. Animasi rute murni CSS.
- **Kenapa memukau:** menyatukan 3 tujuan sekaligus (edukasi, wisata, tiket), karena tombol "Pesan tiket untuk rute ini" ada di ujung rute.

### 3.2 Bloom Watch: Status Mekar Real-time
Kebun Raya Bogor terkenal dengan momen mekarnya **Bunga Bangkai (*Amorphophallus titanum*)** yang selalu viral. Widget ini menampilkan fase tumbuh (kuncup, siap mekar, mekar, layu), **hitung mundur perkiraan mekar**, dan tombol "Ingatkan saya". Ada juga kalender mekar musiman flora lain.
- **Teknis:** data JSON + komponen countdown + progress fase berbentuk ilustrasi; notifikasi via Notification API browser (opsional).
- **Kenapa memukau:** sangat spesifik untuk Kebun Raya Bogor (bukan template generik), menciptakan alasan untuk datang **sekarang**, dan langsung terhubung ke tiket.

### 3.3 Pencari Flora Visual ("Kenali Tanaman")
Identifikasi terpandu ala **kunci determinasi botani**: pengguna menjawab 3–4 pertanyaan visual (bentuk daun, warna bunga, habitus: pohon/palem/anggrek/air), hasilnya menyempit secara live dengan animasi. Ditambah fuzzy search (toleran salah ketik).
- **Teknis:** filter client-side + Fuse.js, kartu dengan transisi layout (Motion). Opsi lanjutan: upload foto → API identifikasi tanaman.
- **Kenapa memukau:** mengubah katalog pasif menjadi permainan edukatif. Ini cocok dengan misi edukasi konservasi dan mudah didemokan ke juri dalam 30 detik.

*Cadangan:* **Virtual Tour 360°** dengan Pannellum, jika tersedia foto panorama equirectangular.

---

## 4. Copywriting Hero

**Opsi A (direkomendasikan)**
- Eyebrow: `KEBUN RAYA BOGOR · SEJAK 1817`
- Headline: **Di Sini, Waktu Tumbuh Perlahan.**
- Sub-headline: Lebih dari dua abad, 87 hektare hutan tropis di jantung Kota Hujan menjaga ribuan kehidupan yang tak tergantikan. Datang untuk menjelajah, pulang membawa cerita.
- CTA primer: **Pesan Tiket** · CTA sekunder: **Jelajahi Peta Kebun**

**Opsi B (edukatif)**
- Headline: **Setiap Daun Menyimpan Sejarah.**
- Sub-headline: Taman botani tertua di Asia Tenggara, tempat ilmu, konservasi, dan keindahan alam tumbuh bersama sejak 1817.
- CTA: **Rencanakan Kunjungan** · **Kenali Koleksi Flora**

**Opsi C (imersif / emosional)**
- Headline: **Tarik Napas Panjang. Kamu Sudah Sampai.**
- Sub-headline: Rindang pohon berusia ratusan tahun, kolam teratai, dan sunyi yang menenangkan, hanya satu jam dari Jakarta.
- CTA: **Pesan Tiket Sekarang** · **Lihat Apa yang Sedang Mekar**

> ⚠️ Verifikasi angka (luas, jumlah koleksi, klaim "tertua di Asia Tenggara", jam buka, harga) dengan sumber resmi kebunraya.id / BRIN sebelum final.
