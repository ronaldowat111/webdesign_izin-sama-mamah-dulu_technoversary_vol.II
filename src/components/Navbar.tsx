import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const links = [
  { label: 'Tentang', href: '#tentang' },
  { label: 'Jelajah Flora', href: '#flora' },
  { label: 'Peta Kebun', href: '#peta' },
  { label: 'Agenda', href: '#agenda' },
  { label: 'Kontak', href: '#kontak' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const firstLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile menu: lock scroll, focus first link, close on Escape
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    firstLinkRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuBtnRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      className="fixed inset-x-0 z-50 animate-[fade_0.8s_var(--ease-organic)_0.7s_both] transition-[top] duration-500 ease-(--ease-organic)"
      style={{
        top: scrolled ? '12px' : 'calc(var(--hero-fy) + 10px)',
        paddingInline: 'calc(var(--hero-fx) + var(--hero-px) - 8px)',
      }}
    >
      <nav
        aria-label="Navigasi utama"
        className={`mx-auto flex h-14 max-w-[1416px] items-center justify-between gap-4 rounded-full border border-cream-50/15 pr-1.5 pl-5 backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow] duration-500 sm:h-[68px] sm:pr-2 sm:pl-6 ${
          scrolled ? 'bg-forest-950/80 shadow-lift' : 'bg-forest-950/30'
        }`}
      >
        <a href="#" className="shrink-0 rounded-full" aria-label="Kebun Raya Bogor — Beranda">
          <img src="/images/logo-kebunraya-white.png" alt="Kebun Raya · BRIN" width={640} height={148} className="h-7 w-auto sm:h-9" />
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative py-2 text-[15px] font-medium text-cream-50/85 transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-gold-300 after:transition-transform after:duration-300 hover:text-cream-50 hover:after:scale-x-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#tiket"
            className="inline-flex h-11 items-center rounded-full bg-cream-50 px-5 text-sm font-semibold text-forest-900 shadow-soft transition-colors duration-200 hover:bg-gold-300 sm:h-[52px] sm:px-7 sm:text-[15px]"
          >
            Pesan Tiket
          </a>
          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid size-11 cursor-pointer place-items-center rounded-full text-cream-50 transition-colors hover:bg-cream-50/10 lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex animate-fade flex-col bg-forest-950/95 px-6 pt-6 pb-10 backdrop-blur-xl lg:hidden"
        >
          <div className="flex items-center justify-between">
            <img src="/images/logo-kebunraya-white.png" alt="" className="h-7 w-auto" />
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                menuBtnRef.current?.focus()
              }}
              aria-label="Tutup menu"
              className="grid size-11 cursor-pointer place-items-center rounded-full text-cream-50 hover:bg-cream-50/10"
            >
              <X className="size-6" aria-hidden />
            </button>
          </div>
          <ul className="mt-14 flex flex-col gap-2">
            {links.map((l, i) => (
              <li key={l.href} className="animate-rise" style={{ animationDelay: `${80 + i * 60}ms` }}>
                <a
                  ref={i === 0 ? firstLinkRef : undefined}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 font-display text-4xl font-light text-cream-50 transition-colors hover:text-gold-300"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#tiket"
            onClick={() => setOpen(false)}
            className="mt-auto inline-flex h-14 items-center justify-center rounded-full bg-terra-600 text-base font-semibold text-white transition-colors hover:bg-terra-700"
          >
            Pesan Tiket
          </a>
        </div>
      )}
    </header>
  )
}
