import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SOCIALS, TICKET_URL, bogorNow } from '../data/kontak'

const SITEMAP = [
  { label: 'Beranda', href: '#' },
  { label: 'Tentang Kami', href: '#tentang' },
  { label: 'Peta Kebun', href: '#peta' },
  { label: 'Jelajah Flora', href: '#flora' },
  { label: 'Rute Tur', href: '#peta' },
  { label: 'Kontak', href: '#kontak' },
]

const OFFICIAL = [
  { label: 'Database Tumbuhan', href: 'https://kebunraya.id/r/bogor/plants' },
  { label: 'Museum Zoologi', href: 'https://kebunraya.id/r/bogor/museum-zoologi' },
  { label: 'Tour de Kebun Raya', href: 'https://kebunraya.id/r/bogor/tour-de-kebun-raya' },
  { label: 'Visitor Center', href: 'https://kebunraya.id/r/bogor/visitor-center' },
]

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const
const link = 'inline-flex min-h-8 items-center text-sm tracking-wide text-cream-50/80 uppercase transition-colors duration-200 hover:text-gold-300'

function useBogorClock() {
  const [now, setNow] = useState(() => bogorNow())
  useEffect(() => {
    const t = window.setInterval(() => setNow(bogorNow()), 20_000)
    return () => window.clearInterval(t)
  }, [])
  return now
}

export function Footer() {
  const now = useBogorClock()

  return (
    <footer className="bg-forest-950 text-cream-50" style={{ paddingInline: 'calc(var(--hero-fx) + var(--hero-px) / 2)' }}>
      <div className="mx-auto max-w-[1520px] pt-20 pb-10 lg:pt-28">
        {/* Location + live time */}
        <div className="space-y-1.5 text-sm tracking-wide uppercase sm:text-base">
          <p>Di jantung Kota Bogor, Jawa Barat — bersebelahan dengan Istana Bogor</p>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-cream-50/80">
            <span>
              Waktu setempat (WIB): <span className="text-cream-50 tabular-nums">{now.label}</span>
            </span>
            <span className="inline-flex items-center gap-2 normal-case">
              <span aria-hidden className={`size-2 rounded-full ${now.open ? 'bg-[#7fd18b] shadow-[0_0_0_4px_rgb(127_209_139/0.15)]' : 'bg-cream-50/40'}`} />
              {now.open ? 'Sedang buka · tutup 16.00' : now.beforeOpen ? `Tutup · buka hari ini ${now.opensAt}` : 'Tutup · buka lagi besok pagi'}
            </span>
          </p>
        </div>

        {/* Links */}
        <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-12">
          <nav aria-label="Peta situs" className="lg:col-span-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-cream-50/50 uppercase">Peta situs</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
              {SITEMAP.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Halaman resmi" className="lg:col-span-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-cream-50/50 uppercase">Kebunraya.id</p>
            <ul className="mt-4 grid gap-y-1">
              {OFFICIAL.map((l) => (
                <li key={l.label}>
                  <a href={l.href} {...ext} className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Media sosial" className="lg:col-span-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-cream-50/50 uppercase">Sosial · @kebunraya_id</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} {...ext} className={link}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Big CTA */}
        <a
          href={TICKET_URL}
          {...ext}
          className="group mt-20 block w-fit border-b border-cream-50/30 pb-3 transition-colors duration-300 hover:border-gold-300 lg:mt-32"
        >
          <span className="flex items-end gap-3 font-display text-[clamp(3.25rem,10vw,9.5rem)] leading-[0.9] font-light tracking-[-0.03em] text-cream-50 transition-colors duration-300 group-hover:text-gold-300">
            Pesan tiket
            <ArrowUpRight
              className="mb-[0.08em] size-[0.55em] shrink-0 transition-transform duration-500 ease-(--ease-organic) group-hover:translate-x-2 group-hover:-translate-y-2"
              strokeWidth={1}
              aria-hidden
            />
          </span>
          <span className="sr-only"> (membuka tiketkebunraya.id di tab baru)</span>
        </a>
        <p className="mt-4 text-xs tracking-wide text-cream-50/55 uppercase sm:text-sm">
          Tiket masuk · Tour de Kebun Raya · Sewa sepeda & shuttle · Kelas edukasi
        </p>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col gap-6 border-t border-cream-50/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/logo-kebunraya-white.png" alt="Kebun Raya · BRIN" width={640} height={148} loading="lazy" className="h-8 w-auto" />
            <p className="text-sm text-cream-50/60">© {new Date().getFullYear()} Kebun Raya Bogor</p>
          </div>
          <p className="max-w-xl text-xs leading-relaxed text-cream-50/45 sm:text-right">
            Konsep redesign untuk lomba Web Design Technoscape UNIKU — bukan situs resmi. Data & peta: kebunraya.id. Foto hero: Colin Meg / Unsplash.
          </p>
        </div>
      </div>
    </footer>
  )
}
