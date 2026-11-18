import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { CATEGORIES, type Gate, type Place, walkFrom } from '../../data/peta'

interface Props {
  places: Place[]
  gate: Gate
  query: string
  onQuery: (q: string) => void
  onPick: (id: string) => void
  autoFocus: boolean
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')

/** List view: search + places sorted by distance from the chosen entrance. */
export function PlaceList({ places, gate, query, onQuery, onPick, autoFocus }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const rows = useMemo(() => {
    const q = norm(query.trim())
    return places
      .filter((p) => !q || norm(`${p.name} ${p.latin ?? ''} ${CATEGORIES[p.cat].label}`).includes(q))
      .map((p) => ({ p, walk: walkFrom(gate, p) }))
      .sort((a, b) => a.walk.meters - b.walk.meters)
  }, [places, gate, query])

  return (
    <div className="flex h-full animate-[fade_0.2s_var(--ease-organic)_both] flex-col overflow-hidden rounded-[22px] bg-cream-50 shadow-lift">
      <div className="border-b border-forest-900/10 p-3 sm:p-4">
        <label className="flex h-12 items-center gap-3 rounded-full bg-sage-100 px-4 text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold-600">
          <Search className="size-5 shrink-0 text-sage-600" aria-hidden />
          <span className="sr-only">Cari lokasi</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Cari lokasi, tumbuhan, atau kategori…"
            className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-sage-600"
          />
        </label>
        <p className="mt-2 px-1 text-xs text-sage-600" aria-live="polite">
          {rows.length} lokasi · diurutkan dari yang terdekat ke {gate.name}
        </p>
      </div>
      <ul className="min-h-0 flex-1 divide-y divide-forest-900/8 overflow-y-auto">
        {rows.map(({ p, walk }) => {
          const cat = CATEGORIES[p.cat]
          const Icon = cat.icon
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => onPick(p.id)}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-sage-100/70 focus-visible:bg-sage-100/70"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl text-white" style={{ backgroundColor: cat.color }}>
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-forest-900">{p.name}</span>
                  <span className="block truncate text-xs text-sage-600">
                    No. {p.no} · {cat.label}
                  </span>
                </span>
                <span className="shrink-0 text-right text-xs text-sage-600 tabular-nums">
                  <span className="block font-semibold text-forest-900">{walk.minutes} mnt</span>
                  {walk.meters >= 1000 ? `${(walk.meters / 1000).toFixed(1).replace('.', ',')} km` : `${walk.meters} m`}
                </span>
              </button>
            </li>
          )
        })}
        {rows.length === 0 && <li className="px-4 py-10 text-center text-sm text-sage-600">Tidak ada lokasi yang cocok dengan "{query}".</li>}
      </ul>
    </div>
  )
}
