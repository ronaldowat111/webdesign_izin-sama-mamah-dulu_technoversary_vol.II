/*
 * Featured flora. Text and photos: Kebun Raya Bogor plant database (kebunraya.id/r/bogor/plants), Nov 2026.
 * `placeId` links each card to its pin on the interactive map (src/data/peta.ts).
 */
export interface Flora {
  id: string
  name: string
  latin: string
  family: string
  desc: string
  img: string
  alt: string
  placeId: string
  /** CSS object-position for the card photo */
  focus?: string
}

export const FLORA: Flora[] = [
  {
    id: 'bunga-bangkai',
    name: 'Bunga Bangkai Raksasa',
    latin: 'Amorphophallus titanum',
    family: 'Araceae',
    desc: 'Mekarnya butuh proses panjang: beberapa fase vegetatif, lalu dorman 6–14 bulan. Saat mekar, aroma busuknya bisa tercium hingga radius seratus meter untuk mengundang serangga penyerbuk.',
    img: '/images/flora/bunga-bangkai.webp',
    alt: 'Bunga bangkai raksasa sedang mekar di Kebun Raya Bogor, seludang merah marun dengan tongkol kuning menjulang',
    placeId: '10',
    focus: '50% 30%',
  },
  {
    id: 'anggrek-raksasa',
    name: 'Anggrek Raksasa',
    latin: 'Grammatophyllum speciosum',
    family: 'Orchidaceae',
    desc: 'Dijuluki anggrek tebu karena batangnya mirip tebu. Rangkaian bunganya menjuntai hingga 2 m dengan 50–100 kuntum; di Kebun Raya Bogor ia berbunga serempak setiap dua tahun.',
    img: '/images/flora/anggrek-raksasa.webp',
    alt: 'Bunga anggrek raksasa kuning dengan bercak cokelat',
    placeId: '32',
  },
  {
    id: 'teratai-raksasa',
    name: 'Teratai Raksasa',
    latin: 'Victoria amazonica',
    family: 'Nymphaeaceae',
    desc: 'Raja teratai dari Sungai Amazon. Daunnya bisa tumbuh hingga diameter 3 meter dan menahan beban 30–45 kg tanpa tenggelam, berkat tulang daun berongga udara di sisi bawahnya.',
    img: '/images/flora/teratai-raksasa.webp',
    alt: 'Daun-daun bundar teratai raksasa mengapung di kolam',
    placeId: '8',
  },
  {
    id: 'kantong-semar',
    name: 'Kantong Semar',
    latin: 'Nepenthes rafflesiana',
    family: 'Nepenthaceae',
    desc: 'Tumbuhan karnivora dataran rendah dari Borneo dan Kepulauan Riau. Kantongnya memerangkap serangga untuk mencukupi nutrisi di tanah berpasir yang miskin hara.',
    img: '/images/flora/kantong-semar.webp',
    alt: 'Kantong Nepenthes rafflesiana berwarna krem berbintik merah',
    placeId: '6',
  },
  {
    id: 'bambu-raksasa',
    name: 'Bambu Raksasa',
    latin: 'Dendrocalamus giganteus',
    family: 'Poaceae',
    desc: 'Bambu terbesar di dunia, tingginya bisa mencapai 30 m. Koleksi Kebun Raya Bogor ditanam pada 1928 dari Burma dan baru berbunga setelah 30 tahun.',
    img: '/images/flora/bambu-raksasa.webp',
    alt: 'Rumpun bambu raksasa menjulang di tepi jalan Kebun Raya Bogor',
    placeId: '2',
  },
  {
    id: 'kaktus',
    name: 'Kaktus Tiang Pagar Meksiko',
    latin: 'Lophocereus marginatus',
    family: 'Cactaceae',
    desc: 'Kaktus berbatang kolumnar yang tumbuh perlahan hingga 3,7–6,1 m. Durinya relatif kecil, sehingga steknya kerap dipakai sebagai pagar hidup.',
    img: '/images/flora/kaktus.webp',
    alt: 'Kaktus kolumnar hijau di Taman Meksiko',
    placeId: '17',
  },
  {
    id: 'palem',
    name: 'Keluarga Palem',
    latin: 'Arecaceae',
    family: 'Arecaceae',
    desc: 'Dari sekitar 2.800 spesies palem di dunia, 576 di antaranya berasal dari Indonesia. Beberapa menjadi sumber pangan, seperti aren, sagu, dan kelapa.',
    img: '/images/flora/palem.webp',
    alt: 'Pelepah daun palem hijau menjuntai',
    placeId: '1',
  },
]

/** Ask the interactive map to open a place (handled in PetaKebun). */
export function showOnMap(placeId: string) {
  document.getElementById('peta')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  window.dispatchEvent(new CustomEvent('peta:select', { detail: placeId }))
}
