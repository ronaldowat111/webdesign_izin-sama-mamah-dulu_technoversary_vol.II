import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

// Photo: Colin Meg / Unsplash. Cutout made locally with rembg (u2net); both share the same canvas.
const srcSet = (name: string) => [1200, 2000, 2800].map((w) => `/images/${name}-${w}.webp ${w}w`).join(', ')
const BG = { src: '/images/rafflesia-2000.webp', srcSet: srcSet('rafflesia') }
const FG = { src: '/images/rafflesia-cutout-2000.webp', srcSet: srcSet('rafflesia-cutout') }
const IMG_RATIO = 3 / 2
/** Top of the tallest petal as a fraction of image height (measured from the cutout's alpha). */
const PETAL_TOP = 0.0702
/** How much of the headline's last line the petals should cover. */
const LINE_COVER = 0.38

/** Layout offset (ignores transforms) of `el` inside `ancestor`. */
function offsetTopWithin(el: HTMLElement, ancestor: HTMLElement) {
  let top = 0
  let node: HTMLElement | null = el
  while (node && node !== ancestor) {
    top += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }
  return top
}

/**
 * Depth hero: photo → headline → flower cutout, inside the glass frame.
 * Scroll opens the frame to full-bleed, zooms the scene and lifts the headline away.
 */
export function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const lastLineRef = useRef<HTMLSpanElement>(null)

  // Place the photo so the tallest petal tucks over the lower part of the headline's last line
  useEffect(() => {
    const stage = stageRef.current
    const scene = sceneRef.current
    const line = lastLineRef.current
    if (!stage || !scene || !line) return

    const layout = () => {
      const W = scene.clientWidth
      const S = scene.clientHeight
      const lh = parseFloat(getComputedStyle(line).lineHeight) || line.offsetHeight
      const target = offsetTopWithin(line, scene) + line.offsetHeight - lh * LINE_COVER
      // The media box is W × S and the image covers it top-aligned, so its rendered height is:
      const imgH = Math.max(W / IMG_RATIO, S)
      stage.style.setProperty('--media-top', `${Math.round(target - PETAL_TOP * imgH)}px`)
    }

    layout()
    document.fonts?.ready.then(layout)
    const ro = new ResizeObserver(layout)
    ro.observe(scene)
    ro.observe(line)
    return () => ro.disconnect()
  }, [])

  // Scroll progress → --p
  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    if (!section || !stage) return
    if (reducedMotion) {
      stage.style.setProperty('--p', '0')
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0
      stage.style.setProperty('--p', p.toFixed(4))
      stage.toggleAttribute('data-past', p > 0.32)
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
  }, [reducedMotion])

  // Pointer parallax → --mx / --my (eased), fine pointers only
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || reducedMotion || !window.matchMedia('(pointer: fine)').matches) return
    let tx = 0
    let ty = 0
    let x = 0
    let y = 0
    let raf = 0
    const tick = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      stage.style.setProperty('--mx', x.toFixed(4))
      stage.style.setProperty('--my', y.toFixed(4))
      raf = Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0
    }
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [reducedMotion])

  const inner = { left: 'calc(var(--hero-fx) + var(--hero-px))', right: 'calc(var(--hero-fx) + var(--hero-px))' }

  return (
    <section ref={sectionRef} aria-label="Selamat datang" className="relative h-[200svh] motion-reduce:h-svh">
      <div ref={stageRef} className="hero-stage sticky top-0 isolate h-svh min-h-[600px] overflow-hidden bg-forest-950">
        {/* Blurred surround (outside the frame) */}
        <div aria-hidden className="hero-media hero-media--fade blur-2xl brightness-[0.55] saturate-[1.1]">
          <img src={BG.src} srcSet={BG.srcSet} sizes="100vw" alt="" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-forest-950/35" />

        {/* Framed scene */}
        <div ref={sceneRef} className="hero-scene absolute inset-0 animate-[frame-in_1.3s_var(--ease-organic)_backwards] bg-forest-950">
          <div aria-hidden className="hero-media hero-media--fade">
            <img src={BG.src} srcSet={BG.srcSet} sizes="100vw" alt="" fetchPriority="high" />
          </div>
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,transparent_35%,rgb(15_36_25/0.55))]"
          />
          {/* Warm glow behind the headline so the dark top band doesn't read flat */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_55%_60%_at_50%_30%,rgb(212_175_98/0.10),transparent_70%)]"
          />

          {/* Headline — sits behind the petals */}
          <div className="hero-headline absolute z-10 text-center top-[calc(var(--hero-fy)+92px)] sm:top-[calc(var(--hero-fy)+108px)]" style={inner}>
            <p className="hero-line text-[11px] font-semibold tracking-[0.3em] text-gold-300 uppercase sm:text-xs">
              <span style={{ animationDelay: '0.55s' }}>Kebun Raya Bogor · Sejak 1817</span>
            </p>
            <h1 className="mt-4 text-[clamp(2.75rem,min(8.4vw,15svh),8.5rem)] leading-[0.95] font-light tracking-[-0.02em] text-cream-50 [text-shadow:0_2px_30px_rgb(0_0_0/0.3)] sm:mt-5">
              <span className="hero-line">
                <span style={{ animationDelay: '0.65s' }}>Di Sini, Waktu</span>
              </span>
              <span ref={lastLineRef} className="hero-line">
                <span style={{ animationDelay: '0.78s' }}>
                  <em className="font-normal text-gold-300">Tumbuh</em> Perlahan.
                </span>
              </span>
            </h1>
          </div>

          {/* Flower cutout — in front of the headline */}
          <div aria-hidden className="hero-media pointer-events-none z-20">
            <img src={FG.src} srcSet={FG.srcSet} sizes="100vw" alt="" fetchPriority="high" />
          </div>

          {/* Bottom cards */}
          <div
            className="hero-ui absolute z-30 flex items-end justify-between gap-4 bottom-[calc(var(--hero-fy)+16px)] sm:bottom-[calc(var(--hero-fy)+clamp(20px,4vh,40px))]"
            style={inner}
          >
            <div
              className="hidden animate-rise rounded-card border border-cream-50/10 bg-forest-950/55 px-5 py-4 backdrop-blur-xl md:block"
              style={{ animationDelay: '1.1s' }}
            >
              <p className="text-[10px] font-semibold tracking-[0.25em] text-gold-300 uppercase">Koleksi Langka</p>
              <p className="mt-1.5 font-display text-2xl text-cream-50 italic">Rafflesia arnoldii</p>
              <p className="mt-0.5 text-sm text-cream-50/75">Puspa langka Indonesia</p>
            </div>

            <div className="flex w-full items-end justify-end gap-3 md:w-auto">
              <div
                className="w-full animate-rise rounded-card border border-cream-50/10 bg-forest-950/55 p-5 backdrop-blur-xl sm:max-w-sm sm:p-6"
                style={{ animationDelay: '1.2s' }}
              >
                <p className="text-[15px] leading-relaxed text-cream-50/90">
                  Lebih dari dua abad, 87 hektare hutan tropis di jantung Kota Hujan menjaga ribuan kehidupan yang tak tergantikan.
                </p>
                <a
                  href="#peta"
                  className="group mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-cream-50 pr-4 pl-5 text-sm font-semibold text-forest-900 transition-colors duration-200 hover:bg-gold-300"
                >
                  Jelajahi Peta Kebun
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 ease-(--ease-organic) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </a>
              </div>
              <a
                href="#jelajah"
                aria-label="Gulir ke bagian berikutnya"
                className="hidden h-[88px] w-14 shrink-0 animate-rise place-items-center rounded-full border border-cream-50/15 bg-forest-950/40 text-cream-50 backdrop-blur-xl transition-colors hover:bg-forest-950/60 sm:grid"
                style={{ animationDelay: '1.3s' }}
              >
                <ArrowDown className="size-6 animate-nudge" strokeWidth={1.75} aria-hidden />
              </a>
            </div>
          </div>
        </div>

        {/* Frame edge light + depth shadow */}
        <div
          aria-hidden
          className="hero-frame-edge pointer-events-none absolute animate-[fade_1s_var(--ease-organic)_0.6s_backwards] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.7)] ring-1 ring-cream-50/15 ring-inset"
        />
      </div>
    </section>
  )
}
