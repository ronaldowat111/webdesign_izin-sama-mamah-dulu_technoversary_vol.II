import { ArrowRight, MapPin } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FLORA, showOnMap } from '../data/flora'
import { useInView } from '../hooks/useInView'
import { useMediaQuery, usePrefersReducedMotion } from '../hooks/useMediaQuery'

/**
 * "Jelajah Flora" — photo cards over an aerial backdrop. On desktop the section pins and the card row
 * slides sideways as you scroll down; on touch / small screens (and with reduced motion) it is a plain
 * swipeable row with scroll-snap.
 */
export function JenisFlora() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const reduced = usePrefersReducedMotion()
  const pinned = isDesktop && !reduced

  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const rowRef = useRef<HTMLUListElement>(null)
  const [distance, setDistance] = useState(0)
  const [progress, setProgress] = useState(0)
  const [inViewRef, inView] = useInView<HTMLDivElement>(0.25)

  // How far the row must travel to show its last card
  useLayoutEffect(() => {
    const row = rowRef.current
    const vp = viewportRef.current
    if (!row || !vp) return
    const measure = () => setDistance(Math.max(0, row.scrollWidth - vp.clientWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(row)
    ro.observe(vp)
    return () => ro.disconnect()
  }, [pinned])

  // Vertical scroll → horizontal progress (desktop only)
  useEffect(() => {
    const section = sectionRef.current
    if (!section || !pinned) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      setProgress(travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pinned])

  const active = Math.min(FLORA.length - 1, Math.round(progress * (FLORA.length - 1)))

  return (
    <section
      ref={sectionRef}
      id="flora"
      aria-labelledby="flora-title"
      className="relative bg-forest-950"
      // the extra height is the horizontal travel, so one scroll pixel moves the row one pixel
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className={`${pinned ? 'sticky top-0 h-svh' : ''} relative isolate flex flex-col overflow-hidden`}>
        {/* Aerial backdrop */}
        <img
          src="/images/flora-bg.webp"
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 -z-10 size-full object-cover"
          style={pinned ? { transform: `scale(${1.08 - progress * 0.06})` } : undefined}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-forest-950/85 via-forest-950/45 to-forest-950/85" />

        <div
          ref={inViewRef}
          className={`mx-auto flex w-full max-w-[1520px] flex-1 flex-col pt-28 pb-10 lg:pt-28 lg:pb-10 ${inView ? 'is-in' : ''}`}
          style={{ paddingInline: 'calc(var(--hero-fx) + var(--hero-px) / 2)' }}
        >
          {/* Header */}
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <p className="reveal flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-300 uppercase">
                <span aria-hidden className="h-px w-10 bg-gold-400" />
                Jelajah Flora
              </p>
              <h2 id="flora-title" className="mt-5 text-[clamp(2.5rem,5.4vw,5.25rem)] leading-[0.98] font-light tracking-[-0.02em] text-cream-50">
                <span className="mask-line">
                  <span style={{ '--d': '0.05s' } as React.CSSProperties}>Kenali para</span>
                </span>
                <span className="mask-line">
                  <span style={{ '--d': '0.15s' } as React.CSSProperties}>
                    <em className="font-normal text-gold-300">penghuni</em> kebun.
                  </span>
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5 lg:pt-12">
              <p className="reveal max-w-md text-base leading-relaxed text-cream-50/85 sm:text-lg" style={{ '--d': '0.25s' } as React.CSSProperties}>
                Dari bunga bangkai yang mekarnya ditunggu bertahun-tahun hingga bambu raksasa yang ditanam sejak 1928 — tujuh koleksi yang membuat
                Kebun Raya Bogor tak tergantikan.
              </p>
              <a
                href="#peta"
                className="reveal group mt-6 inline-flex h-12 items-center gap-3 rounded-full bg-forest-950/80 pr-1.5 pl-6 text-[15px] font-semibold text-cream-50 ring-1 ring-cream-50/15 backdrop-blur-md transition-colors hover:bg-forest-950"
                style={{ '--d': '0.35s' } as React.CSSProperties}
              >
                Lihat semua di peta
                <span className="grid size-9 place-items-center rounded-full bg-cream-50 text-forest-900 transition-transform duration-300 ease-(--ease-organic) group-hover:translate-x-0.5">
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </a>
            </div>
          </div>

          {/* Cards */}
          <div
            ref={viewportRef}
            className={`mt-10 lg:mt-auto lg:pt-6 ${pinned ? 'overflow-visible' : 'snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]'}`}
            // on swipe layouts the row bleeds to the screen edges but snaps in line with the header text
            style={pinned ? undefined : { marginInline: 'calc((var(--hero-fx) + var(--hero-px) / 2) * -1)', scrollPaddingInline: 'calc(var(--hero-fx) + var(--hero-px) / 2)' }}
          >
            <ul
              ref={rowRef}
              aria-label="Koleksi flora unggulan"
              className={`flex w-max gap-4 sm:gap-6 ${pinned ? 'pl-[18vw] will-change-transform' : ''}`}
              style={pinned ? { transform: `translate3d(${-progress * distance}px, 0, 0)` } : { paddingInline: 'calc(var(--hero-fx) + var(--hero-px) / 2)' }}
            >
              {FLORA.map((f, i) => (
                <li
                  key={f.id}
                  className="reveal relative aspect-[0.8] w-[80vw] max-w-[480px] shrink-0 snap-start overflow-hidden rounded-[20px] bg-sage-200 shadow-lift sm:aspect-[1.08] sm:w-[60vw] lg:w-[clamp(280px,min(34vw,calc((100svh_-_440px)*1.08)),480px)]"
                  style={{ '--d': `${0.2 + Math.min(i, 3) * 0.1}s` } as React.CSSProperties}
                >
                  <img src={f.img} alt={f.alt} loading="lazy" className="absolute inset-0 size-full object-cover" style={{ objectPosition: f.focus ?? '50% 50%' }} />
                  {/* Info panel — bottom-right, like the reference */}
                  <div className="absolute right-0 bottom-0 flex h-[62%] w-[78%] flex-col rounded-tl-[18px] bg-cream-50 p-4 sm:h-[64%] sm:w-[64%] sm:p-5">
                    <p className="text-xs font-semibold tracking-wide text-sage-600">
                      {String(i + 1).padStart(2, '0')} · {f.family}
                    </p>
                    <h3 className="mt-1.5 font-sans text-[15px] leading-snug font-bold tracking-wide text-forest-900 uppercase sm:text-base">{f.name}</h3>
                    <p className="font-display text-sm text-sage-600 italic">{f.latin}</p>
                    <p className="mt-auto line-clamp-4 pt-2 text-[13px] leading-snug text-ink/75 lg:line-clamp-5">{f.desc}</p>
                    <button
                      type="button"
                      onClick={() => showOnMap(f.placeId)}
                      className="mt-3 inline-flex h-9 w-fit cursor-pointer items-center gap-1.5 rounded-full bg-forest-900 pr-3.5 pl-3 text-xs font-semibold text-cream-50 transition-colors hover:bg-forest-700"
                    >
                      <MapPin className="size-3.5" aria-hidden />
                      Lihat di peta
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Progress (desktop) */}
          {pinned && (
            <div className="mt-8 flex items-center gap-4 text-sm text-cream-50/80" aria-hidden>
              <span className="tabular-nums">{String(active + 1).padStart(2, '0')}</span>
              <span className="relative h-px flex-1 bg-cream-50/20">
                <span className="absolute inset-y-0 left-0 bg-gold-300" style={{ width: `${progress * 100}%` }} />
              </span>
              <span className="tabular-nums">{String(FLORA.length).padStart(2, '0')}</span>
            </div>
          )}

          <p className="mt-4 text-xs text-cream-50/55">Foto & data: Database Tumbuhan Kebun Raya Bogor (kebunraya.id).</p>
        </div>
      </div>
    </section>
  )
}
