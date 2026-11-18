import { ArrowRight, GraduationCap, type LucideIcon, Microscope, Sprout, Trees } from 'lucide-react'
import { useInView } from '../hooks/useInView'

// Facts: kebunraya.id/r/bogor/about-us and the official map leaflet (Nov 2026).
const STATS = [
  { value: '1817', label: 'Tahun berdiri' },
  { value: '87 ha', label: 'Luas kawasan' },
  { value: '15.000', label: 'Jenis koleksi' },
]

const PILLARS: { eyebrow: string; title: string; desc: string; icon: LucideIcon }[] = [
  {
    eyebrow: '01 · Konservasi',
    title: 'Konservasi ex-situ',
    desc: 'Merawat 15.000 jenis koleksi pohon dan tumbuhan, termasuk jenis langka seperti Rafflesia dan bunga bangkai.',
    icon: Sprout,
  },
  {
    eyebrow: '02 · Penelitian',
    title: 'Pusat riset botani',
    desc: 'Dari sini lahir Herbarium Bogoriense (1844), Laboratorium Treub (1884), hingga Museum Zoologi (1894).',
    icon: Microscope,
  },
  {
    eyebrow: '03 · Pendidikan',
    title: 'Ruang belajar terbuka',
    desc: 'Kelas edukasi, study tour, dan Tour de Kebun Raya bersama pemandu untuk sekolah maupun umum.',
    icon: GraduationCap,
  },
  {
    eyebrow: '04 · Wisata',
    title: 'Hutan di tengah kota',
    desc: 'Jalur hijau, kolam, dan taman tematik di jantung Kota Bogor, bersebelahan dengan Istana Bogor.',
    icon: Trees,
  },
]

/**
 * "Tentang" — slides up over the pinned hero (negative top margin), leaving a strip of the photo above it.
 */
export function Tentang() {
  const [ref, inView] = useInView<HTMLElement>(0.15)

  return (
    <section
      ref={ref}
      id="tentang"
      aria-labelledby="tentang-title"
      className={`relative z-10 -mt-[75svh] rounded-t-[32px] bg-cream-100 pt-20 pb-20 shadow-[0_-40px_80px_-30px_rgb(0_0_0/0.55)] motion-reduce:mt-0 sm:rounded-t-[40px] lg:pt-28 lg:pb-28 ${inView ? 'is-in' : ''}`}
    >
      <div className="mx-auto max-w-[1520px]" style={{ paddingInline: 'calc(var(--hero-fx) + var(--hero-px) / 2)' }}>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Headline */}
          <div className="lg:col-span-7">
            <p className="reveal flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-700 uppercase">
              <span aria-hidden className="h-px w-10 bg-gold-600" />
              Tentang Kami
            </p>
            <h2 id="tentang-title" className="mt-6 text-[clamp(2.75rem,6.2vw,6rem)] leading-[0.98] font-light tracking-[-0.02em]">
              <span className="mask-line">
                <span style={{ '--d': '0.05s' } as React.CSSProperties}>Tempat sains</span>
              </span>
              <span className="mask-line">
                <span style={{ '--d': '0.15s' } as React.CSSProperties}>Indonesia mulai</span>
              </span>
              <span className="mask-line">
                <span style={{ '--d': '0.25s' } as React.CSSProperties}>
                  <em className="font-normal text-forest-700">bertumbuh.</em>
                </span>
              </span>
            </h2>
          </div>

          {/* Intro + CTA + numbers */}
          <div className="flex flex-col lg:col-span-5 lg:pt-14">
            <p className="reveal max-w-md text-lg leading-relaxed text-ink/75" style={{ '--d': '0.3s' } as React.CSSProperties}>
              Didirikan pada 1817, Kebun Raya Bogor adalah kebun raya tertua di Asia Tenggara. Awalnya kebun percobaan tanaman perkebunan, kini
              ia menjadi tonggak lahirnya ilmu pengetahuan di Indonesia.
            </p>
            <a
              href="#peta"
              className="reveal group mt-8 inline-flex h-12 w-fit items-center gap-3 rounded-full border border-forest-900/15 bg-cream-50 pr-1.5 pl-6 text-[15px] font-semibold text-forest-900 transition-colors duration-200 hover:border-forest-900/30 hover:bg-white"
              style={{ '--d': '0.4s' } as React.CSSProperties}
            >
              Rencanakan kunjungan
              <span className="grid size-9 place-items-center rounded-full bg-forest-900 text-cream-50 transition-transform duration-300 ease-(--ease-organic) group-hover:translate-x-0.5">
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </a>
            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-forest-900/10 pt-6 lg:mt-auto">
              {STATS.map((s, i) => (
                <div key={s.label} className="reveal" style={{ '--d': `${0.45 + i * 0.08}s` } as React.CSSProperties}>
                  <dt className="text-xs text-sage-600 sm:text-sm">{s.label}</dt>
                  <dd className="mt-1 font-display text-3xl font-light text-forest-900 sm:text-4xl">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Pillars */}
        <ul className="mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {PILLARS.map((p, i) => {
            const Icon = p.icon
            return (
              <li
                key={p.title}
                className="reveal border-l border-forest-900/15 pl-6"
                style={{ '--d': `${0.1 + i * 0.1}s` } as React.CSSProperties}
              >
                <p className="text-xs font-semibold tracking-[0.2em] text-sage-600 uppercase">{p.eyebrow}</p>
                <Icon className="mt-8 size-14 text-forest-900" strokeWidth={1} aria-hidden />
                <h3 className="mt-8 font-sans text-xl font-semibold text-forest-900">{p.title}</h3>
                <p className="mt-2 max-w-[30ch] text-[15px] leading-relaxed text-ink/70">{p.desc}</p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
