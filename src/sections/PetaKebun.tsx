import { ChevronDown, Clock, DoorOpen, List, Map as MapIcon, Minus, Plus, RotateCcw, Route as RouteIcon, Search, Ticket, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MapPin } from '../components/peta/MapPin'
import { PlaceCard } from '../components/peta/PlaceCard'
import { PlaceList } from '../components/peta/PlaceList'
import {
  CATEGORIES,
  CATEGORY_ORDER,
  type CategoryId,
  GATES,
  type Gate,
  ISTANA,
  MAP_ASPECT,
  MAP_SRC,
  OPENING_HOURS,
  PLACES,
  ROUTES,
  type Route,
  TOUR_INFO,
  routePoints,
} from '../data/peta'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { MAX_ZOOM, MIN_ZOOM, usePanZoom } from '../hooks/usePanZoom'

type Filter = CategoryId | 'semua'

const glassDark = 'bg-forest-950/65 text-cream-50 ring-1 ring-cream-50/12 backdrop-blur-xl'
const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

/** Jembatan Gantung (#19) has two pins; counts follow the official numbering. */
const countUnique = (list: { no: number }[]) => new Set(list.map((p) => p.no)).size

function todayHours() {
  const d = new Date().getDay()
  return d === 0 || d === 6 ? OPENING_HOURS.weekend : OPENING_HOURS.weekday
}

export function PetaKebun() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [filter, setFilter] = useState<Filter>('semua')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [gateId, setGateId] = useState<Gate['id']>('g1')
  const [routeId, setRouteId] = useState<Route['id'] | null>(null)
  const [view, setView] = useState<'peta' | 'daftar'>('peta')
  const [query, setQuery] = useState('')
  const [listFocus, setListFocus] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const pz = usePanZoom(
    MAP_ASPECT,
    isDesktop ? { top: 80, bottom: 128, side: 24 } : { top: 64, bottom: 124, side: 8 },
    isDesktop ? 'contain' : 'height',
  )
  const { view: v, base } = pz

  const gate = GATES.find((g) => g.id === gateId)!
  const route = ROUTES.find((r) => r.id === routeId) ?? null
  const routePts = useMemo(() => (route ? routePoints(route) : []), [route])
  const stopOf = useMemo(() => {
    const m = new Map<string, number>()
    routePts.forEach((pt) => pt.placeId && !m.has(pt.placeId) && m.set(pt.placeId, pt.n))
    return m
  }, [routePts])

  const visible = useMemo(
    () => (route ? PLACES.filter((p) => stopOf.has(p.id)) : PLACES.filter((p) => filter === 'semua' || p.cat === filter)),
    [route, stopOf, filter],
  )
  const selected = PLACES.find((p) => p.id === selectedId) ?? null
  const selIndex = selected ? visible.findIndex((p) => p.id === selected.id) : -1

  // Keep the selected pin in view (pans only when it would be hidden behind the card / sheet)
  useEffect(() => {
    if (!selected || view !== 'peta') return
    const h = panelRef.current?.clientHeight ?? 600
    pz.reveal(selected.x, selected.y, isDesktop ? { left: 40, right: 420, top: 96, bottom: 150 } : { left: 24, right: 24, top: 80, bottom: h * 0.6 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, view])

  const select = (id: string) => {
    if (pz.wasDrag()) return
    setSelectedId((cur) => (cur === id ? null : id))
  }
  const step = (dir: -1 | 1) => {
    if (!visible.length) return
    const i = selIndex < 0 ? 0 : (selIndex + dir + visible.length) % visible.length
    setSelectedId(visible[i].id)
  }
  const chooseRoute = (id: Route['id'] | null) => {
    const next = ROUTES.find((r) => r.id === id)
    // a card for a place that is not on the new route would only hide the route
    if (next && selectedId && !next.stops.some((s) => s.placeId === selectedId)) setSelectedId(null)
    setRouteId(id)
    setFilter('semua')
    setView('peta')
    if (!next) return pz.reset()
    // frame the whole route once, clear of the top bar and the route stepper
    pz.fitTo(routePoints(next), isDesktop ? { left: 48, right: 48, top: 88, bottom: 176 } : { left: 20, right: 20, top: 72, bottom: 230 })
  }
  const openList = (focusSearch: boolean) => {
    setView('daftar')
    setListFocus(focusSearch)
  }

  const onPanelKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'Escape') return
    if (view === 'daftar') setView('peta')
    else if (selected) setSelectedId(null)
    else if (route) setRouteId(null)
  }

  const chip = (active: boolean) =>
    `inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full pr-4 pl-1.5 text-sm font-medium transition-colors duration-200 ${
      active ? 'bg-cream-50 text-forest-900 shadow-soft' : `${glassDark} hover:bg-forest-950/85`
    }`

  return (
    <section id="peta" aria-labelledby="peta-title" className="bg-cream-50 py-20 lg:py-28">
      <div className="mx-auto max-w-[1520px]" style={{ paddingInline: 'var(--hero-fx)' }}>
        {/* Section header */}
        <div className="mb-8 flex flex-col gap-5 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.28em] text-gold-700 uppercase">
              <span aria-hidden className="h-px w-10 bg-gold-600" />
              Peta Interaktif
            </p>
            <h2 id="peta-title" className="mt-4 text-4xl leading-[1.05] font-light tracking-[-0.01em] sm:text-5xl lg:text-6xl">
              Rencanakan langkahmu, <em className="font-normal text-forest-700">sebelum tiba.</em>
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-sage-600 sm:text-lg">
              43 titik koleksi, taman, dan situs bersejarah di atas peta resmi Kebun Raya Bogor. Pilih pintu masukmu, lihat jarak tempuh, atau ikuti rute Tour de Kebun Raya.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-forest-900">
            <span className="inline-flex h-10 items-center gap-2 rounded-full bg-sage-100 px-4">
              <Clock className="size-4 text-forest-700" aria-hidden />
              Buka hari ini <strong className="font-semibold">{todayHours()} WIB</strong>
            </span>
            <span className="inline-flex h-10 items-center rounded-full bg-sage-100 px-4">Sen–Jum {OPENING_HOURS.weekday} · Sab–Min & libur {OPENING_HOURS.weekend}</span>
          </div>
        </div>

        {/* Map panel */}
        <div
          ref={panelRef}
          onKeyDown={onPanelKey}
          className="relative isolate h-[78svh] max-h-[880px] min-h-[540px] overflow-hidden rounded-panel bg-forest-950 shadow-lift lg:h-[86svh]"
        >
          {/* Ambient backdrop */}
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,#24402f,#0f2419_70%)]" />

          {/* Viewport */}
          <div
            ref={pz.containerRef}
            {...pz.handlers}
            tabIndex={0}
            role="application"
            aria-roledescription="peta"
            aria-label="Peta Kebun Raya Bogor. Seret untuk menggeser, tombol tambah dan kurang untuk zoom, panah untuk menggeser."
            className={`absolute inset-0 touch-none outline-none select-none focus-visible:ring-2 focus-visible:ring-gold-300 focus-visible:ring-inset ${
              pz.dragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            {base.w > 0 && (
              <div
                className="absolute top-0 left-0 origin-top-left"
                style={
                  {
                    width: base.w,
                    height: base.h,
                    transform: `translate3d(${v.x}px, ${v.y}px, 0) scale(${v.s})`,
                    transition: pz.animating ? 'transform 0.45s var(--ease-organic)' : 'none',
                    '--s': v.s,
                  } as React.CSSProperties
                }
              >
                <img
                  src={MAP_SRC.lg}
                  alt=""
                  draggable={false}
                  decoding="async"
                  className="pointer-events-none absolute inset-0 size-full drop-shadow-[0_30px_40px_rgb(0_0_0/0.45)]"
                />

                {/* Tour route */}
                {route && routePts.length > 1 && (
                  <svg key={route.id} aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full overflow-visible">
                    <polyline
                      points={routePts.map((pt) => `${pt.x},${pt.y}`).join(' ')}
                      fill="none"
                      stroke="#0f2419"
                      strokeWidth={7}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                      opacity={0.55}
                    />
                    <polyline
                      className="route-line"
                      pathLength={1}
                      points={routePts.map((pt) => `${pt.x},${pt.y}`).join(' ')}
                      fill="none"
                      stroke="#e3c88c"
                      strokeWidth={3.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}
                {routePts
                  .filter((pt) => !pt.placeId)
                  .map((pt) => (
                    <span
                      key={`pt-${pt.n}`}
                      aria-hidden
                      className="absolute z-10 grid size-6 place-items-center rounded-full bg-gold-300 text-xs font-bold text-forest-950 ring-2 ring-forest-950"
                      style={{ left: `${pt.x}%`, top: `${pt.y}%`, transform: 'translate(-50%, -50%) scale(calc(1 / var(--s)))' }}
                    >
                      {pt.n}
                    </span>
                  ))}

                {/* Istana Bogor (neighbour, not part of the garden) */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute z-0 rounded-full bg-forest-950/70 px-3 py-1 text-xs font-semibold tracking-wide whitespace-nowrap text-cream-50 uppercase ring-1 ring-cream-50/20"
                  style={{ left: `${ISTANA.x}%`, top: `${ISTANA.y}%`, transform: 'translate(-50%, -50%) scale(calc(1 / var(--s)))' }}
                >
                  Istana Bogor
                </span>

                {/* Gates */}
                {GATES.map((g) => {
                  const active = g.id === gateId
                  const label = (
                    <span
                      className={`flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1.5 text-xs font-semibold whitespace-nowrap ring-2 transition-colors ${
                        active ? 'bg-gold-300 text-forest-950 ring-forest-950' : g.visitorEntry ? 'bg-forest-900 text-cream-50 ring-cream-50/80' : 'bg-forest-950/70 text-cream-50/60 ring-cream-50/25'
                      }`}
                    >
                      <DoorOpen className="size-3.5" aria-hidden />
                      {g.name}
                      {active && <span className="font-medium">· Mulai</span>}
                    </span>
                  )
                  const style = { left: `${g.x}%`, top: `${g.y}%`, transform: 'translate(-50%, -50%) scale(calc(1 / var(--s)))' }
                  return g.visitorEntry ? (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => !pz.wasDrag() && setGateId(g.id)}
                      aria-label={`${g.name}: ${g.note}. ${active ? 'Titik mulai saat ini.' : 'Jadikan titik mulai.'}`}
                      aria-pressed={active}
                      className="absolute z-20 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                      style={style}
                    >
                      {label}
                    </button>
                  ) : (
                    <span key={g.id} className="absolute z-20" style={style} title={g.note}>
                      {label}
                    </span>
                  )
                })}

                {/* Places */}
                {PLACES.map((pl) => {
                  const inFilter = route ? stopOf.has(pl.id) : filter === 'semua' || pl.cat === filter
                  return (
                    <MapPin
                      key={pl.id}
                      place={pl}
                      selected={pl.id === selectedId}
                      hidden={!inFilter && !route && pl.id !== selectedId}
                      dimmed={!!route && !stopOf.has(pl.id) && pl.id !== selectedId}
                      stop={stopOf.get(pl.id)}
                      onSelect={select}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Tilt-shift edges: soft blur + vignette, centre stays sharp */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 backdrop-blur-[3px] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_48%,transparent_55%,#000_100%)]"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_75%_at_50%_48%,transparent_55%,rgb(15_36_25/0.6))]" />

          {/* Ctrl + wheel hint */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 top-1/2 z-30 flex justify-center transition-opacity duration-300 ${pz.wheelHint ? 'opacity-100' : 'opacity-0'}`}
          >
            <span className={`rounded-full px-4 py-2 text-sm ${glassDark}`}>Tahan {isMac ? '⌘' : 'Ctrl'} + gulir untuk zoom peta</span>
          </div>

          {/* Top bar */}
          <div className="absolute inset-x-3 top-3 z-30 flex items-center gap-2 sm:inset-x-4 sm:top-4">
            <label className={`relative inline-flex h-11 items-center gap-2 rounded-full pr-8 pl-3 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-300 sm:pr-9 sm:pl-4 ${glassDark}`}>
              <DoorOpen className="size-4 shrink-0 text-gold-300" aria-hidden />
              <span className="hidden text-cream-50/70 sm:inline">Masuk dari</span>
              <select
                value={gateId}
                onChange={(e) => setGateId(e.target.value as Gate['id'])}
                aria-label="Pintu masuk"
                className="cursor-pointer appearance-none bg-transparent font-semibold outline-none"
              >
                {GATES.filter((g) => g.visitorEntry).map((g) => (
                  <option key={g.id} value={g.id} className="text-ink">
                    {g.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 size-4 text-cream-50/70" aria-hidden />
            </label>

            <label className={`relative inline-flex h-11 min-w-0 items-center gap-2 rounded-full pr-8 pl-3 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-300 sm:pr-9 sm:pl-4 ${glassDark}`}>
              <RouteIcon className="size-4 shrink-0 text-gold-300" aria-hidden />
              <span className="hidden text-cream-50/70 sm:inline">Rute tur</span>
              <select
                value={routeId ?? ''}
                onChange={(e) => chooseRoute((e.target.value || null) as Route['id'] | null)}
                aria-label="Rute Tour de Kebun Raya"
                className="min-w-0 cursor-pointer appearance-none truncate bg-transparent font-semibold outline-none"
              >
                <option value="" className="text-ink">
                  Tanpa rute
                </option>
                {ROUTES.map((r) => (
                  <option key={r.id} value={r.id} className="text-ink">
                    {r.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 size-4 text-cream-50/70" aria-hidden />
            </label>

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => openList(true)}
                aria-label="Cari lokasi"
                className={`grid size-11 cursor-pointer place-items-center rounded-full transition-colors hover:bg-forest-950/85 ${glassDark}`}
              >
                <Search className="size-5" aria-hidden />
              </button>
              <a
                href="#tiket"
                className="hidden h-11 items-center gap-2 rounded-full bg-terra-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-terra-700 sm:inline-flex"
              >
                <Ticket className="size-4" aria-hidden />
                Pesan Tiket
              </a>
            </div>
          </div>

          {/* List view */}
          {view === 'daftar' && (
            <div className="absolute inset-x-3 top-[68px] bottom-[124px] z-30 sm:inset-x-4 sm:top-[76px] lg:right-auto lg:bottom-[132px] lg:w-[440px]">
              <PlaceList
                places={visible}
                gate={gate}
                query={query}
                onQuery={setQuery}
                autoFocus={listFocus}
                onPick={(id) => {
                  setSelectedId(id)
                  setView('peta')
                }}
              />
            </div>
          )}

          {/* Detail card / bottom sheet */}
          {selected && view === 'peta' && (
            <div className="absolute inset-x-2 bottom-2 z-40 max-h-[62%] lg:inset-x-auto lg:top-[76px] lg:right-4 lg:bottom-[76px] lg:max-h-none lg:w-[372px]">
              <PlaceCard
                key={selected.id}
                place={selected}
                gate={gate}
                routes={ROUTES.filter((r) => r.stops.some((s) => s.placeId === selected.id))}
                onClose={() => setSelectedId(null)}
                onStep={step}
                onRoute={chooseRoute}
              />
            </div>
          )}

          {/* Bottom bar: filters + zoom + view toggle */}
          <div className="absolute inset-x-3 bottom-3 z-30 flex flex-col-reverse gap-2 sm:inset-x-4 sm:bottom-4 lg:flex-row lg:items-end lg:justify-between">
            {route ? (
              /* Route stepper replaces the category filter while a tour route is shown */
              <div className={`animate-[fade_0.25s_var(--ease-organic)_both] rounded-[20px] p-3 lg:max-w-[760px] ${glassDark}`}>
                <div className="flex items-start justify-between gap-3 px-1">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold tracking-wide text-gold-300 uppercase">Tour de Kebun Raya · {route.name}</p>
                    <p className="mt-0.5 truncate text-sm text-cream-50/70">
                      {route.tagline} · {TOUR_INFO}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => chooseRoute(null)}
                    aria-label="Tutup rute"
                    className="-mt-1 -mr-1 grid size-10 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-cream-50/10"
                  >
                    <X className="size-5" aria-hidden />
                  </button>
                </div>
                <ol aria-label={`Urutan rute ${route.name}`} className="mt-2 flex gap-1.5 overflow-x-auto pr-8 pb-0.5 [mask-image:linear-gradient(to_right,#000_88%,transparent)] [scrollbar-width:none]">
                  {route.stops.map((s, i) => {
                    const drawable = !!(s.placeId || s.point)
                    return (
                      <li key={`${s.label}-${i}`} className="shrink-0">
                        <button
                          type="button"
                          disabled={!s.placeId}
                          onClick={() => s.placeId && setSelectedId(s.placeId)}
                          title={drawable ? undefined : 'Titik ini tidak ditandai pada peta resmi'}
                          className={`inline-flex h-10 items-center gap-2 rounded-full pr-3.5 pl-1.5 text-sm whitespace-nowrap transition-colors enabled:cursor-pointer enabled:hover:bg-cream-50/15 disabled:cursor-default ${
                            s.placeId && s.placeId === selectedId ? 'bg-cream-50/20' : 'bg-cream-50/8'
                          }`}
                        >
                          <span
                            className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${drawable ? 'bg-gold-300 text-forest-950' : 'bg-cream-50/15 text-cream-50/60'}`}
                          >
                            {i + 1}
                          </span>
                          <span className={drawable ? '' : 'text-cream-50/55'}>{s.label}</span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </div>
            ) : (
            <div
              role="group"
              aria-label="Filter kategori"
              className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-0.5 [scrollbar-width:none] sm:-mx-4 sm:px-4 lg:mx-0 lg:max-w-[720px] lg:flex-wrap lg:overflow-visible lg:px-0"
            >
              <button type="button" aria-pressed={filter === 'semua'} onClick={() => setFilter('semua')} className={`${chip(filter === 'semua')} pl-4`}>
                Semua <span className="text-xs opacity-60">{countUnique(PLACES)}</span>
              </button>
              {CATEGORY_ORDER.map((id) => {
                const c = CATEGORIES[id]
                const Icon = c.icon
                const n = countUnique(PLACES.filter((p) => p.cat === id))
                return (
                  <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(filter === id ? 'semua' : id)} className={chip(filter === id)}>
                    <span className="grid size-7 place-items-center rounded-full text-white" style={{ backgroundColor: c.color }}>
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    {c.short}
                    <span className="text-xs opacity-60">{n}</span>
                  </button>
                )
              })}
            </div>
            )}

            <div className={`flex items-center justify-end gap-2 ${selected && !isDesktop && view === 'peta' ? 'invisible' : ''}`}>
              <div className={`flex h-11 items-center gap-1 rounded-full px-1 ${glassDark}`}>
                <button
                  type="button"
                  onClick={() => pz.zoomAt(v.s - 0.5)}
                  disabled={v.s <= MIN_ZOOM}
                  aria-label="Perkecil"
                  className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-cream-50/10 disabled:cursor-default disabled:opacity-40"
                >
                  <Minus className="size-4" aria-hidden />
                </button>
                <input
                  type="range"
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={0.05}
                  value={v.s}
                  onChange={(e) => pz.zoomAt(Number(e.target.value), undefined, undefined, false)}
                  aria-label="Tingkat zoom"
                  aria-valuetext={`${Math.round(v.s * 100)}%`}
                  className="hidden w-24 cursor-pointer accent-gold-300 sm:block"
                />
                <button
                  type="button"
                  onClick={() => pz.zoomAt(v.s + 0.5)}
                  disabled={v.s >= MAX_ZOOM}
                  aria-label="Perbesar"
                  className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-cream-50/10 disabled:cursor-default disabled:opacity-40"
                >
                  <Plus className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={pz.reset}
                  aria-label="Kembalikan tampilan peta"
                  className="grid size-9 cursor-pointer place-items-center rounded-full hover:bg-cream-50/10"
                >
                  <RotateCcw className="size-4" aria-hidden />
                </button>
              </div>
              <div role="group" aria-label="Tampilan" className={`flex h-11 items-center gap-1 rounded-full p-1 ${glassDark}`}>
                {(
                  [
                    ['peta', 'Peta', MapIcon],
                    ['daftar', 'Daftar', List],
                  ] as const
                ).map(([id, label, Icon]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={view === id}
                    onClick={() => (id === 'daftar' ? openList(false) : setView('peta'))}
                    className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-medium transition-colors ${
                      view === id ? 'bg-cream-50 text-forest-900' : 'hover:bg-cream-50/10'
                    }`}
                  >
                    <Icon className="size-4" aria-hidden />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-sage-600">
          Ilustrasi & legenda: Peta resmi Kebun Raya Bogor (BRIN). Jarak dan waktu tempuh adalah perkiraan.
        </p>
      </div>
    </section>
  )
}
