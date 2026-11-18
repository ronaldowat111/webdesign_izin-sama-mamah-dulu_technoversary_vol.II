import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

const POSTER = '/images/hero-poster.jpg'

/**
 * "Window" hero: one video, two views.
 * - Sharp layer: the <video>, clipped to a rounded frame with clip-path.
 * - Blurred surround: a tiny <canvas> that copies every video frame, upscaled + blurred.
 * Both cover the same box, so the scene stays continuous across the frame edge.
 */
export function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Mirror video frames into the blurred canvas
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!video || !canvas || !ctx) return

    const draw = () => {
      if (video.readyState >= 2) ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    }
    // requestVideoFrameCallback fires once per decoded frame; rAF is the fallback (older Firefox)
    const hasVFC = typeof video.requestVideoFrameCallback === 'function'
    let handle = 0
    const loop = () => {
      if (hasVFC) {
        draw()
        handle = video.requestVideoFrameCallback(loop)
      } else {
        if (!video.paused) draw()
        handle = requestAnimationFrame(loop)
      }
    }
    handle = hasVFC ? video.requestVideoFrameCallback(loop) : requestAnimationFrame(loop)
    video.addEventListener('loadeddata', draw)
    return () => {
      if (hasVFC) video.cancelVideoFrameCallback(handle)
      else cancelAnimationFrame(handle)
      video.removeEventListener('loadeddata', draw)
    }
  }, [])

  // Autoplay (unless reduced motion) and pause while the hero is off-screen
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return
    if (reducedMotion) {
      video.pause()
      return
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    io.observe(section)
    return () => io.disconnect()
  }, [reducedMotion])

  const frameInset = 'var(--hero-fy) var(--hero-fx)'

  return (
    <section ref={sectionRef} aria-label="Selamat datang" className="relative isolate h-svh min-h-[600px] overflow-hidden bg-forest-950">
      {/* Blurred surround */}
      <div aria-hidden className="absolute inset-0 -z-10 scale-110 blur-2xl brightness-[0.6] saturate-[1.15]">
        <img src={POSTER} alt="" className="absolute inset-0 size-full object-cover" />
        <canvas ref={canvasRef} width={160} height={90} className="absolute inset-0 size-full object-cover" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-forest-950/35" />

      {/* Sharp, framed video */}
      <video
        ref={videoRef}
        className="absolute inset-0 size-full animate-frame-in object-cover"
        style={{ clipPath: `inset(${frameInset} round var(--radius-panel))` }}
        poster={POSTER}
        muted
        loop
        playsInline
        preload={reducedMotion ? 'metadata' : 'auto'}
        aria-hidden
      >
        <source src="/video/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/video/hero-desktop.mp4" type="video/mp4" />
      </video>

      {/* Frame: edge light, depth shadow, legibility gradient, content */}
      <div
        className="absolute flex animate-[fade_1s_var(--ease-organic)_0.6s_both] flex-col justify-end overflow-hidden rounded-panel shadow-[0_40px_90px_-30px_rgb(0_0_0/0.7)] ring-1 ring-cream-50/15 ring-inset"
        style={{ inset: frameInset }}
      >
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-forest-950/85 via-forest-950/25 via-45% to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-forest-950/40 to-transparent" />

        <div
          className="relative mx-auto grid w-full max-w-[1400px] gap-8 pt-28 pb-6 sm:pb-10 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-[clamp(2rem,6vh,4.5rem)]"
          style={{ paddingInline: 'var(--hero-px)' }}
        >
          <div className="lg:col-span-7">
            <p
              className="flex animate-rise items-center gap-3 text-[11px] font-semibold tracking-[0.28em] text-gold-300 uppercase sm:text-xs"
              style={{ animationDelay: '0.75s' }}
            >
              <span aria-hidden className="h-px w-10 bg-gold-400" />
              Kebun Raya Bogor · Sejak 1817
            </p>
            <h1 className="mt-5 text-[clamp(2.75rem,8vw,6.5rem)] lg:text-[clamp(2.75rem,6.6vw,6.5rem)] leading-[0.95] font-light tracking-[-0.02em] text-cream-50">
              <span className="block animate-rise" style={{ animationDelay: '0.85s' }}>
                Di Sini, Waktu
              </span>
              <span className="block animate-rise" style={{ animationDelay: '0.97s' }}>
                <em className="font-normal text-gold-300">Tumbuh</em> Perlahan.
              </span>
            </h1>
          </div>

          <div className="animate-rise lg:col-span-5 lg:pb-2" style={{ animationDelay: '1.1s' }}>
            <p className="max-w-md text-base leading-relaxed text-cream-50/90 sm:text-lg lg:text-xl lg:leading-relaxed">
              Lebih dari dua abad, 87 hektare hutan tropis di jantung Kota Hujan menjaga ribuan kehidupan yang tak tergantikan. Datang untuk
              menjelajah, pulang membawa cerita.
            </p>

            <div className="mt-7 flex items-end justify-between gap-4">
              <a
                href="#peta"
                className="glass group inline-flex h-12 items-center gap-2 rounded-full pr-4 pl-6 text-[15px] font-semibold text-cream-50 transition-colors duration-200 hover:bg-cream-50/20"
              >
                Jelajahi Peta Kebun
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 ease-(--ease-organic) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </a>

              <a
                href="#jelajah"
                aria-label="Gulir ke bagian berikutnya"
                className="glass hidden h-[88px] w-14 place-items-center rounded-full text-cream-50 transition-colors hover:bg-cream-50/20 sm:grid"
              >
                <ArrowDown className="size-6 animate-nudge" strokeWidth={1.75} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
