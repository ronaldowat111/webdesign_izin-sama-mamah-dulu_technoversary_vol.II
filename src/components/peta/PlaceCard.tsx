import { ChevronLeft, ChevronRight, Footprints, Route as RouteIcon, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { CATEGORIES, MAP_ASPECT, MAP_SRC, type Gate, type Place, type Route, walkFrom } from '../../data/peta'

interface Props {
  place: Place
  gate: Gate
  routes: Route[]
  onClose: () => void
  onStep: (dir: -1 | 1) => void
  onRoute: (id: Route['id']) => void
}

const ZOOM = 4.2 // how far the illustration is magnified in the card thumbnail
const CARD_RATIO = 10 / 16

/** Background-position that centres map point (x%, y%) in a 16:10 thumbnail at ZOOM×. */
function cropPosition(xPct: number, yPct: number) {
  const u = xPct / 100
  const v = yPct / 100
  const hi = ZOOM / MAP_ASPECT // image height relative to card width
  const px = (0.5 - u * ZOOM) / (1 - ZOOM)
  const py = (CARD_RATIO / 2 - v * hi) / (CARD_RATIO - hi)
  const c = (n: number) => `${Math.min(100, Math.max(0, n * 100)).toFixed(2)}%`
  return `${c(px)} ${c(py)}`
}

export function PlaceCard({ place, gate, routes, onClose, onStep, onRoute }: Props) {
  const cat = CATEGORIES[place.cat]
  const Icon = cat.icon
  const walk = walkFrom(gate, place)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Move focus into the card when the place changes, so keyboard and screen-reader users land on it
  useEffect(() => headingRef.current?.focus({ preventScroll: true }), [place.id])

  return (
    <article
      aria-labelledby="place-card-title"
      className="flex max-h-full animate-[fade_0.25s_var(--ease-organic)_both] flex-col overflow-hidden rounded-[22px] bg-cream-50 text-ink shadow-lift ring-1 ring-black/5"
    >
      {/* Thumbnail: real photo when we have one, otherwise a close-up of the official map illustration */}
      <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-sage-100">
        {place.photo ? (
          <img src={place.photo} alt={place.name} className="size-full object-cover" loading="lazy" />
        ) : (
          <div
            role="img"
            aria-label={`Ilustrasi ${place.name} pada peta`}
            className="size-full bg-no-repeat"
            style={{ backgroundImage: `url(${MAP_SRC.lg})`, backgroundSize: `${ZOOM * 100}% auto`, backgroundPosition: cropPosition(place.x, place.y) }}
          />
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute top-3 right-3 grid size-10 cursor-pointer place-items-center rounded-full bg-forest-950/55 text-cream-50 backdrop-blur-md transition-colors hover:bg-forest-950/75"
        >
          <X className="size-5" aria-hidden />
        </button>
        <span className="absolute bottom-3 left-3 rounded-full bg-forest-950/60 px-2.5 py-1 text-xs font-semibold text-cream-50 backdrop-blur-md">
          No. {place.no}
        </span>
      </div>

      <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-5">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase" style={{ color: cat.color }}>
            <Icon className="size-3.5" aria-hidden />
            {cat.label}
          </p>
          <h3 ref={headingRef} id="place-card-title" tabIndex={-1} className="mt-1.5 text-2xl leading-tight font-normal outline-none">
            {place.name}
          </h3>
          {place.latin && <p className="mt-0.5 font-display text-sm text-sage-600 italic">{place.latin}</p>}
        </div>

        <p className="text-[15px] leading-relaxed text-ink/80">{place.desc}</p>

        <dl className="grid gap-3 rounded-card bg-sage-100/70 p-3.5 text-sm">
          <div className="flex items-start gap-2.5">
            <Footprints className="mt-0.5 size-4 shrink-0 text-forest-700" aria-hidden />
            <div>
              <dt className="text-xs text-sage-600">Dari {gate.name}</dt>
              <dd className="font-semibold text-forest-900">
                ± {walk.meters >= 1000 ? `${(walk.meters / 1000).toFixed(1).replace('.', ',')} km` : `${walk.meters} m`} · {walk.minutes} menit jalan kaki
              </dd>
            </div>
          </div>
          {place.facts?.map((f) => (
            <div key={f.label} className="flex items-start gap-2.5">
              <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-600" />
              <div>
                <dt className="text-xs text-sage-600">{f.label}</dt>
                <dd className="font-semibold text-forest-900">{f.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        {routes.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-sage-600">Termasuk rute Tour de Kebun Raya</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {routes.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => onRoute(r.id)}
                  className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-forest-900/15 px-3.5 text-sm font-medium text-forest-900 transition-colors hover:bg-forest-900 hover:text-cream-50"
                >
                  <RouteIcon className="size-3.5" aria-hidden />
                  {r.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-[11px] leading-snug text-sage-600">Jarak & waktu adalah perkiraan garis lurus dari peta, bukan rute jalan setapak.</p>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-forest-900/10 px-3 py-2">
        <button
          type="button"
          onClick={() => onStep(-1)}
          className="inline-flex h-10 cursor-pointer items-center gap-1 rounded-full px-3 text-sm font-medium text-forest-900 transition-colors hover:bg-sage-100"
        >
          <ChevronLeft className="size-4" aria-hidden /> Sebelumnya
        </button>
        <button
          type="button"
          onClick={() => onStep(1)}
          className="inline-flex h-10 cursor-pointer items-center gap-1 rounded-full px-3 text-sm font-medium text-forest-900 transition-colors hover:bg-sage-100"
        >
          Berikutnya <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </article>
  )
}
