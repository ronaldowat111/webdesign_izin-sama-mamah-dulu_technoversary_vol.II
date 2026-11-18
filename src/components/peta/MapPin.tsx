import { CATEGORIES, type Place } from '../../data/peta'

interface Props {
  place: Place
  selected: boolean
  dimmed: boolean
  hidden: boolean
  /** Order number when the place is a stop on the active tour route */
  stop?: number
  onSelect: (id: string) => void
}

/**
 * Category badge pinned to the map. The button's tip sits on the map point and is counter-scaled
 * with --s so it keeps its size while the map zooms. The name shows on hover/focus and while selected.
 */
export function MapPin({ place, selected, dimmed, hidden, stop, onSelect }: Props) {
  const cat = CATEGORIES[place.cat]
  const Icon = cat.icon
  return (
    <button
      type="button"
      onClick={() => onSelect(place.id)}
      aria-label={`${place.no}. ${place.name} — ${cat.label}`}
      aria-pressed={selected}
      tabIndex={hidden ? -1 : 0}
      className={`group absolute flex cursor-pointer flex-col items-center rounded-xl outline-none transition-opacity duration-300 ${
        selected ? 'z-40' : 'z-10 hover:z-30 focus-visible:z-30'
      } ${hidden ? 'pointer-events-none opacity-0' : dimmed ? 'opacity-35 hover:opacity-100 focus-visible:opacity-100' : 'opacity-100'}`}
      style={{
        left: `${place.x}%`,
        top: `${place.y}%`,
        transform: 'translate(-50%, -100%) scale(calc(1 / var(--s)))',
        transformOrigin: '50% 100%',
      }}
    >
      {/* Name label — out of flow, so the button's box is just the badge */}
      <span
        className={`absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 rounded-full bg-cream-50 px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-forest-900 shadow-soft transition-[opacity,translate] duration-200 ${
          selected
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100'
        }`}
      >
        {place.name}
      </span>
      {/* Badge */}
      <span
        className={`relative grid place-items-center rounded-xl text-white shadow-[0_6px_14px_-4px_rgb(0_0_0/0.5)] ring-2 transition-[scale,box-shadow] duration-200 group-hover:scale-110 group-focus-visible:ring-gold-300 ${
          selected ? 'size-11 ring-gold-300' : 'size-9 ring-white/85'
        }`}
        style={{ backgroundColor: cat.color }}
      >
        <Icon className={selected ? 'size-5' : 'size-[18px]'} strokeWidth={2} aria-hidden />
        {stop !== undefined && (
          <span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-gold-300 text-[11px] font-bold text-forest-950 ring-2 ring-forest-950">
            {stop}
          </span>
        )}
      </span>
      {/* Pointer */}
      <span aria-hidden className="-mt-px size-0 border-x-[6px] border-t-[7px] border-x-transparent" style={{ borderTopColor: cat.color }} />
    </button>
  )
}
