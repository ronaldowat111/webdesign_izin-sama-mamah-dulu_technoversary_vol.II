import { Camera, Flower2, Landmark, type LucideIcon, ShoppingBag, Sprout, UtensilsCrossed } from 'lucide-react'

/*
 * Kebun Raya Bogor — interactive map data.
 * Sources (scraped Nov 2026): official "Giant Map KR Bogor" PDF (base illustration, pin positions, legend),
 * kebunraya.id/r/bogor pages (spot descriptions, Tour de Kebun Raya routes, Visitor Center FAQ).
 * Pin x/y are % of the map image, taken from the PDF's own pin labels.
 */

export const MAP_ASPECT = 1.7092
export const MAP_SRC = { lg: '/images/peta-kebun-3200.webp', sm: '/images/peta-kebun-1600.webp' }

export type CategoryId = 'koleksi' | 'taman' | 'sejarah' | 'menarik' | 'kuliner' | 'belanja'

export const CATEGORIES: Record<CategoryId, { label: string; short: string; color: string; icon: LucideIcon }> = {
  koleksi: { label: 'Koleksi Tumbuhan', short: 'Koleksi', color: '#2f7a4f', icon: Sprout },
  taman: { label: 'Taman Tematik', short: 'Taman', color: '#1f6f74', icon: Flower2 },
  sejarah: { label: 'Lokasi Bersejarah', short: 'Sejarah', color: '#a14e2c', icon: Landmark },
  menarik: { label: 'Lokasi Menarik', short: 'Spot Menarik', color: '#9a6d14', icon: Camera },
  kuliner: { label: 'Kafe & Restoran', short: 'Kuliner', color: '#8a3a5c', icon: UtensilsCrossed },
  belanja: { label: 'Merchandise', short: 'Belanja', color: '#45599e', icon: ShoppingBag },
}
export const CATEGORY_ORDER: CategoryId[] = ['koleksi', 'taman', 'sejarah', 'menarik', 'kuliner', 'belanja']

export interface Place {
  id: string
  no: number
  name: string
  cat: CategoryId
  x: number
  y: number
  desc: string
  latin?: string
  facts?: { label: string; value: string }[]
  photo?: string
}

// The PDF labels sit on the pin heads; our pins anchor at the tip, a little lower.
const TIP = 1.6
const p = (no: number, name: string, cat: CategoryId, x: number, y: number, desc: string, extra: Partial<Place> = {}): Place => ({
  id: extra.id ?? String(no),
  no,
  name,
  cat,
  x,
  y: y + TIP,
  desc,
  ...extra,
})

export const PLACES: Place[] = [
  p(1, 'Palem Raja', 'koleksi', 17.22, 21.0, 'Deretan palem raja yang menjulang di sisi barat laut kebun, salah satu barisan palem paling ikonik di Kebun Raya Bogor.', { latin: 'Roystonea regia' }),
  p(2, 'Taman Bambu', 'koleksi', 26.78, 24.06, 'Area koleksi aneka jenis bambu yang rimbun dan teduh. Termasuk dalam rute tur Historical Site.'),
  p(3, 'Taman Teijsmann', 'taman', 15.63, 32.78, 'Taman bergaya formal yang dinamai dari Johannes Elias Teijsmann, kurator yang menata Kebun Raya Bogor pada abad ke-19.'),
  p(4, 'Makam Belanda', 'sejarah', 28.04, 28.1, 'Kompleks makam bersejarah dari era kolonial Belanda di dalam kawasan kebun, saksi perjalanan panjang Kebun Raya Bogor.'),
  p(5, 'Alsomitra', 'koleksi', 21.55, 31.32, 'Tumbuhan merambat dengan biji bersayap tipis yang mampu melayang jauh seperti pesawat layang.', { latin: 'Alsomitra macrocarpa' }),
  p(6, 'Taman Nepenthes', 'taman', 26.78, 36.91, 'Rumah bagi berbagai spesies kantong semar, tumbuhan karnivora yang memerangkap serangga untuk mendapat nutrisi di tanah miskin hara. Habitat aslinya dari Kalimantan hingga Papua kian terancam alih fungsi lahan.', {
    facts: [{ label: 'Spesies', value: 'N. mirabilis, N. ampullaria, N. rafflesiana, dan lainnya' }],
  }),
  p(7, 'Tugu Reinwardt', 'sejarah', 29.47, 32.4, 'Mengenang Prof. Caspar Georg Karl Reinwardt, ilmuwan botani yang merintis Kebun Raya Bogor. Tugu berdiri di area Kolam Gunting, di belakang pelataran Istana Bogor.', {
    facts: [{ label: 'Diresmikan', value: '16 Mei 2006' }],
  }),
  p(8, 'Teratai Raksasa', 'koleksi', 34.95, 28.99, 'Teratai raksasa dari Amazon dengan daun bundar berdiameter lebih dari satu meter dan tepi daun yang melipat ke atas.', { latin: 'Victoria amazonica' }),
  p(9, 'Kolam Gunting', 'menarik', 27.9, 44.03, 'Kolam memanjang di belakang Istana Bogor. Latar istananya menjadikan kolam ini salah satu sudut paling fotogenik di kebun.'),
  p(10, 'Bunga Bangkai', 'koleksi', 19.76, 46.64, 'Bunga majemuk tertinggi di dunia. Mekarnya hanya beberapa hari dan mengeluarkan bau busuk untuk menarik serangga penyerbuk — momen yang selalu dinanti pengunjung.', { latin: 'Amorphophallus titanum' }),
  p(11, 'Taman Bromelia', 'taman', 17.6, 49.16, 'Koleksi bromelia, kerabat nanas dengan roset daun berwarna cerah yang menampung air di bagian tengahnya.'),
  p(12, 'Monumen Lady Raffles', 'sejarah', 24.43, 53.92, 'Gazebo berpilar delapan untuk mengenang Olivia Mariamne, istri Letnan Gubernur Thomas Stamford Raffles (1811–1816). Pada tugunya terukir puisi berbahasa Inggris klasik karya Olivia sendiri.', {
    facts: [{ label: 'Rute tur', value: 'Titik awal rute Historical Site & Interesting Collection' }],
  }),
  p(13, 'Museum Zoologi', 'menarik', 8.78, 54.64, 'Museum Zoologicum Bogoriense berdiri sejak 1894 dan menjadi museum fauna terbesar di Asia Tenggara. Ikon utamanya: kerangka paus biru.', {
    facts: [
      { label: 'Koleksi', value: '2.768.044 spesimen (2018)' },
      { label: 'Dipamerkan', value: '954 jenis fauna Indonesia di 122 display' },
    ],
  }),
  p(14, 'Pohon Kayu Raja', 'koleksi', 19.03, 60.64, 'Salah satu pohon tertinggi di hutan tropis Asia Tenggara, dengan batang lurus berwarna pucat.', { latin: 'Koompassia excelsa' }),
  p(15, 'Koleksi Keluarga Paku', 'koleksi', 28.59, 58.21, 'Koleksi tumbuhan paku-pakuan, kelompok tumbuhan purba yang berkembang biak dengan spora.'),
  p(16, 'Giant Taro', 'koleksi', 35.04, 56.76, 'Talas raksasa berdaun lebar menyerupai telinga gajah yang bisa lebih tinggi dari orang dewasa.', { latin: 'Alocasia macrorrhizos' }),
  p(17, 'Taman Meksiko', 'taman', 34.18, 73.96, 'Taman tumbuhan gurun berisi aneka kaktus, agave, dan sukulen yang beradaptasi dengan iklim kering.'),
  p(18, 'Taman Akuatik', 'taman', 38.91, 67.37, 'Taman tumbuhan air dengan kolam dan kincir air. Kafe Walungan berada di area ini.'),
  p(19, 'Jembatan Gantung', 'menarik', 37.66, 72.87, 'Jembatan gantung merah yang melintasi Sungai Ciliwung dan menghubungkan dua wilayah utama kebun. Dibangun pada masa Hindia Belanda dengan desain menyerupai Golden Gate Bridge.', { id: '19a' }),
  p(19, 'Jembatan Gantung', 'menarik', 75.0, 34.71, 'Jembatan gantung merah kedua di sisi timur, juga melintasi Sungai Ciliwung.', { id: '19b' }),
  p(20, 'Jalan Kenari 1', 'menarik', 45.59, 68.45, 'Lorong teduh berpayung pohon kenari yang tinggi menjulang di bagian selatan kebun.'),
  p(21, 'Randu Kembar', 'koleksi', 48.2, 63.5, 'Sepasang pohon randu besar yang tumbuh berdampingan seperti kembar, salah satu titik pada rute tur Eco Tree.'),
  p(22, 'Bunga Bangkai', 'koleksi', 51.15, 46.7, 'Lokasi koleksi bunga bangkai lainnya di bagian tengah kebun.', { latin: 'Amorphophallus titanum' }),
  p(23, 'Bunga Rafflesia', 'koleksi', 62.14, 43.65, 'Area konservasi ex-situ Rafflesia — bunga tanpa daun dan batang yang hidup menumpang pada akar tumbuhan inangnya.', { latin: 'Rafflesia patma' }),
  p(24, 'Jalan Kenari 2', 'menarik', 64.02, 49.67, 'Dinamai dari deretan pohon kenari di sepanjang jalannya, yang ditanam sejak tahun 1834.', {
    facts: [{ label: 'Ditanam', value: '1834' }],
  }),
  p(25, 'Tugu 2 Abad', 'sejarah', 59.38, 61.42, 'Tugu peringatan dua abad Kebun Raya Bogor (1817–2017).'),
  p(26, 'Teratai Raksasa', 'koleksi', 56.5, 68.45, 'Kolam teratai raksasa kedua di bagian selatan kebun.', { latin: 'Victoria amazonica' }),
  p(27, 'Resto Raasaa', 'kuliner', 70.53, 69.85, 'Restoran di sisi tenggara kebun, tidak jauh dari Pintu 4.'),
  p(28, 'Taman Pisang', 'taman', 67.02, 55.51, 'Koleksi aneka jenis pisang. Asia Tenggara adalah salah satu pusat asal-usul pisang dunia.'),
  p(29, 'Ecodome', 'menarik', 71.92, 56.61, 'Bangunan kubah artistik berselimut lumut hidup, difungsikan sebagai wahana edukasi lingkungan. Pintu Iklim Sehat-nya menyaring polusi udara.', {
    facts: [{ label: 'Kapasitas filter udara', value: 'Hingga 10.000 m³ per jam' }],
  }),
  p(30, 'Jalan Astrid', 'menarik', 79.62, 55.94, 'Koridor ikonik yang diapit hamparan bunga dan pepohonan rindang — titik akhir rute tur Eco Tree.'),
  p(31, 'Baobab', 'koleksi', 82.18, 50.18, 'Pohon asal Afrika dengan batang menggembung yang menyimpan cadangan air.', { latin: 'Adansonia digitata' }),
  p(32, 'Griya Anggrek', 'menarik', 90.7, 44.03, 'Display anggrek spesies dan hibrida yang sedang berbunga, sekaligus pusat edukasi. Tersedia bibit anggrek botolan hasil kultur jaringan.'),
  p(33, 'Bunga Rafflesia', 'koleksi', 85.83, 32.03, 'Lokasi konservasi Rafflesia di sisi timur laut kebun.', { latin: 'Rafflesia patma' }),
  p(34, 'Orchidarium, Taman Obat & Taman Kopi', 'taman', 90.3, 28.02, 'Tiga taman tematik berdampingan: koleksi anggrek, tanaman obat, dan aneka jenis kopi.'),
  p(35, 'Taman Soedjana Kassan', 'taman', 93.06, 23.14, 'Dinamai untuk menghormati Soedjana Kassan, kurator dan Direktur Kebun Raya Bogor 1949–1969. Ikoniknya: replika Garuda Pancasila dari tumbuhan penutup tanah.', {
    facts: [{ label: 'Didirikan', value: '18 Mei 1985' }],
  }),
  p(36, 'Jembatan Surya Lembayung', 'menarik', 88.41, 20.92, 'Jembatan di sisi timur laut kebun yang melintasi aliran sungai.'),
  p(37, 'Pohon Jodoh', 'menarik', 72.65, 26.65, 'Dua pohon berbeda jenis yang ditanam berdampingan: Meranti Tembaga dan Ara Ratu. Karena perawakannya mirip, warga menyebutnya "Pohon Jodoh". Keduanya kini langka di Indonesia.', {
    latin: 'Shorea leprosula & Ficus albipila',
    facts: [{ label: 'Ditanam', value: '1866' }],
  }),
  p(38, 'Olive Store', 'belanja', 12.32, 55.51, 'Toko suvenir dan merchandise, dekat Museum Zoologi dan Pintu 1.'),
  p(39, 'Secret Garden', 'kuliner', 17.16, 39.28, 'Kafe taman di sisi barat kebun, dekat Taman Teijsmann.'),
  p(40, 'Tugu Sawit', 'sejarah', 47.33, 57.26, 'Menandai kelapa sawit pertama di Indonesia, yang ditanam di Kebun Raya Bogor pada 1848.', { latin: 'Elaeis guineensis' }),
  p(41, 'Café Raffles', 'kuliner', 73.14, 50.87, 'Kafe di bagian timur kebun, dekat Ecodome.'),
  p(42, 'Taman Durian', 'taman', 90.08, 21.66, 'Koleksi pohon durian dan kerabatnya, buah tropis asli Asia Tenggara.'),
  p(43, 'Kafe Walungan', 'kuliner', 36.89, 66.7, 'Stall F&B di area Taman Akuatik dengan jajanan khas Jawa Barat seperti batagor, cireng, dan tahu gejrot. Pohon bisbul di depannya jadi tempat bersantai yang rindang.'),
]

export interface Gate {
  id: 'g1' | 'g2' | 'g3' | 'g4'
  name: string
  x: number
  y: number
  visitorEntry: boolean
  note: string
}

// Visitor Center FAQ: visitors enter through Pintu 1, 3 and 4.
export const GATES: Gate[] = [
  { id: 'g1', name: 'Pintu 1', x: 12.2, y: 64.2, visitorEntry: true, note: 'Pintu masuk pengunjung · parkir motor setiap hari, parkir mobil' },
  { id: 'g2', name: 'Pintu 2', x: 24.6, y: 19.6, visitorEntry: false, note: 'Bukan pintu masuk pengunjung' },
  { id: 'g3', name: 'Pintu 3', x: 96.6, y: 51.8, visitorEntry: true, note: 'Pintu masuk pengunjung · parkir mobil setiap hari, motor akhir pekan & libur' },
  { id: 'g4', name: 'Pintu 4', x: 66.6, y: 82.4, visitorEntry: true, note: 'Pintu masuk pengunjung' },
]

export const ISTANA = { x: 52.87, y: 24.89 }

export interface Route {
  id: 'historical' | 'collection' | 'eco'
  name: string
  tagline: string
  /** Official stop list; `placeId` / `point` when the stop can be drawn on the map */
  stops: { label: string; placeId?: string; point?: { x: number; y: number } }[]
}

// Tour de Kebun Raya (kebunraya.id/r/bogor/tour-de-kebun-raya): guided walk, ±1 hour, 1–10 people per trip.
export const ROUTES: Route[] = [
  {
    id: 'historical',
    name: 'Historical Site',
    tagline: 'Jejak sejarah dua abad',
    stops: [
      { label: 'Monumen Lady Raffles', placeId: '12' },
      { label: 'Monumen Reinwardt', placeId: '7' },
      { label: 'View belakang Istana Bogor', point: { x: 38.5, y: 25.5 } },
      { label: 'Makam Belanda', placeId: '4' },
      { label: 'Taman Bambu', placeId: '2' },
      { label: 'Taman Teijsmann', placeId: '3' },
      { label: 'Treub Laboratorium' },
      { label: 'Monumen Lady Raffles', placeId: '12' },
    ],
  },
  {
    id: 'collection',
    name: 'Interesting Collection',
    tagline: 'Koleksi tumbuhan paling unik',
    stops: [
      { label: 'Monumen Lady Raffles', placeId: '12' },
      { label: 'Kolam Gunting', placeId: '9' },
      { label: 'Pohon tertua di Kebun Raya Bogor' },
      { label: 'Pohon Beringin' },
      { label: 'Koleksi Kopi', placeId: '34' },
      { label: 'Monumen Kelapa Sawit', placeId: '40' },
      { label: 'Taman Akuatik', placeId: '18' },
      { label: 'Taman Meksiko', placeId: '17' },
      { label: 'Pohon Kayu Raja', placeId: '14' },
    ],
  },
  {
    id: 'eco',
    name: 'Eco Tree',
    tagline: 'Pohon-pohon bersejarah & langka',
    stops: [
      { label: 'Griya Anggrek', placeId: '32' },
      { label: 'Orchidarium & Taman Obat', placeId: '34' },
      { label: 'Taman Soedjana Kassan', placeId: '35' },
      { label: 'Pohon Jodoh', placeId: '37' },
      { label: 'Pohon Kenari Babi' },
      { label: 'Kelapa Sawit', placeId: '40' },
      { label: 'Randu Kembar', placeId: '21' },
      { label: 'Tugu 2 Abad', placeId: '25' },
      { label: 'Astrid Avenue', placeId: '30' },
    ],
  },
]

export const TOUR_INFO = 'Tur jalan kaki ±1 jam bersama pemandu · 1–10 orang per trip'

// Visitor Center FAQ
export const OPENING_HOURS = { weekday: '08.00–16.00', weekend: '07.00–16.00' }

/*
 * Walking estimate. Scale is calibrated so the map footprint equals the garden's 87 ha, with the isometric
 * view's vertical squash (≈0.55) undone. Straight line × 1.25 detour factor at 70 m/min — an estimate only.
 */
const M_PER_X = 11.54
const M_PER_Y = M_PER_X / MAP_ASPECT / 0.55
export function walkFrom(from: { x: number; y: number }, to: { x: number; y: number }) {
  const meters = Math.hypot((to.x - from.x) * M_PER_X, (to.y - from.y) * M_PER_Y) * 1.25
  const rounded = Math.max(10, Math.round(meters / 10) * 10)
  return { meters: rounded, minutes: Math.max(1, Math.round(rounded / 70)) }
}

export const placeById = (id: string) => PLACES.find((pl) => pl.id === id)

/** Drawable points of a route, in order, with the stop number shown on each pin. */
export function routePoints(route: Route) {
  const pts: { x: number; y: number; n: number; placeId?: string }[] = []
  route.stops.forEach((s, i) => {
    const pl = s.placeId ? placeById(s.placeId) : undefined
    const pt = pl ?? s.point
    if (!pt) return
    const last = pts[pts.length - 1]
    if (last && last.x === pt.x && last.y === pt.y) return // e.g. Orchidarium & Taman Obat share pin 34
    pts.push({ x: pt.x, y: pt.y, n: i + 1, placeId: pl?.id })
  })
  return pts
}
