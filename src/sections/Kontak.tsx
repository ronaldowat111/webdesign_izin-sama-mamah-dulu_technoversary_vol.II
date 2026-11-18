import { ArrowRight, Check, ChevronDown, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { OPENING_HOURS } from '../data/peta'
import { ADDRESS, VISITOR_CENTER, whatsappLink } from '../data/kontak'
import { useInView } from '../hooks/useInView'

const TOPICS = ['Informasi kunjungan', 'Rombongan / study tour', 'Tour de Kebun Raya', 'Penyewaan venue & fasilitas', 'Lainnya']

const THUMBS = [
  { src: '/images/flora/bunga-bangkai.webp', pos: '50% 25%' },
  { src: '/images/flora/teratai-raksasa.webp', pos: '40% 50%' },
  { src: '/images/flora/anggrek-raksasa.webp', pos: '50% 50%' },
]

type Errors = Partial<Record<'name' | 'message', string>>

/**
 * "Kontak" — no backend: the form composes a WhatsApp message to the Visitor Center (email as fallback).
 */
export function Kontak() {
  const [ref, inView] = useInView<HTMLElement>(0.2)
  const id = useId()
  const nameRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const [name, setName] = useState('')
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [sentUrl, setSentUrl] = useState<string | null>(null)

  const compose = () => `Halo Visitor Center Kebun Raya Bogor,\n\nSaya ${name.trim()}. Topik: ${topic}.\n\n${message.trim()}`

  const validate = (): Errors => {
    const e: Errors = {}
    if (name.trim().length < 2) e.name = 'Tulis namamu, minimal 2 huruf.'
    if (message.trim().length < 10) e.message = 'Ceritakan sedikit lebih detail, minimal 10 karakter.'
    return e
  }

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (e.name) return nameRef.current?.focus()
    if (e.message) return messageRef.current?.focus()
    const url = whatsappLink(compose())
    window.open(url, '_blank', 'noopener')
    setSentUrl(url)
  }

  // Clear a field's error as soon as it becomes valid
  const revalidate = (field: keyof Errors) => {
    if (!errors[field]) return
    const e = validate()
    setErrors((cur) => ({ ...cur, [field]: e[field] }))
  }

  const mailto = `mailto:${VISITOR_CENTER.email}?subject=${encodeURIComponent(`[${topic}] Pertanyaan dari situs web`)}&body=${encodeURIComponent(
    message.trim() ? compose() : '',
  )}`

  const field =
    'w-full rounded-xl border bg-white px-4 text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-sage-500 focus-visible:border-forest-700 focus-visible:ring-3 focus-visible:ring-gold-300/60'
  const ok = 'border-forest-900/12'
  const bad = 'border-terra-600 ring-3 ring-terra-500/15'

  const channels = [
    { icon: MessageCircle, label: 'WhatsApp', value: VISITOR_CENTER.whatsappDisplay, href: `https://wa.me/${VISITOR_CENTER.whatsappNumber}`, external: true },
    { icon: Phone, label: 'Telepon', value: VISITOR_CENTER.phoneDisplay, href: VISITOR_CENTER.phoneHref },
    { icon: Mail, label: 'Email', value: VISITOR_CENTER.email, href: `mailto:${VISITOR_CENTER.email}` },
    { icon: MapPin, label: 'Lokasi', value: ADDRESS.line1, href: ADDRESS.mapsUrl, external: true },
  ]

  return (
    <section
      ref={ref}
      id="kontak"
      aria-labelledby="kontak-title"
      className={`bg-cream-100 py-24 lg:py-32 ${inView ? 'is-in' : ''}`}
      style={{ paddingInline: 'calc(var(--hero-fx) + var(--hero-px) / 2)' }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex gap-2.5" aria-hidden>
            {THUMBS.map((t, i) => (
              <span
                key={t.src}
                className="reveal block size-14 overflow-hidden rounded-xl shadow-soft ring-2 ring-white sm:size-16"
                style={{ '--d': `${i * 0.08}s` } as React.CSSProperties}
              >
                <img src={t.src} alt="" loading="lazy" className="size-full object-cover" style={{ objectPosition: t.pos }} />
              </span>
            ))}
          </div>
          <h2 id="kontak-title" className="mt-8 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1] font-light tracking-[-0.02em]">
            <span className="mask-line">
              <span style={{ '--d': '0.15s' } as React.CSSProperties}>Ada pertanyaan sebelum</span>
            </span>
            <span className="mask-line">
              <span style={{ '--d': '0.25s' } as React.CSSProperties}>
                <em className="font-normal text-forest-700">berkunjung?</em>
              </span>
            </span>
          </h2>
          <p className="reveal mt-5 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg" style={{ '--d': '0.35s' } as React.CSSProperties}>
            Kunjungan rombongan, study tour, atau Tour de Kebun Raya — tim Visitor Center siap membantu merencanakannya.
          </p>
        </div>

        {/* Form */}
        <form
          noValidate
          onSubmit={onSubmit}
          aria-labelledby="kontak-title"
          className="reveal mx-auto mt-12 grid w-full max-w-xl gap-4 rounded-[24px] bg-cream-50 p-4 shadow-soft ring-1 ring-forest-900/5 sm:p-6"
          style={{ '--d': '0.45s' } as React.CSSProperties}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-name`} className="mb-1.5 block text-sm font-semibold text-forest-900">
                Nama
              </label>
              <input
                ref={nameRef}
                id={`${id}-name`}
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => revalidate('name')}
                placeholder="Nama lengkap"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${id}-name-err` : undefined}
                className={`${field} h-12 ${errors.name ? bad : ok}`}
              />
              {errors.name && (
                <p id={`${id}-name-err`} className="mt-1.5 text-sm text-terra-600">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor={`${id}-topic`} className="mb-1.5 block text-sm font-semibold text-forest-900">
                Topik
              </label>
              <div className="relative">
                <select
                  id={`${id}-topic`}
                  name="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className={`${field} ${ok} h-12 cursor-pointer appearance-none pr-10`}
                >
                  {TOPICS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-sage-600" aria-hidden />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor={`${id}-message`} className="mb-1.5 block text-sm font-semibold text-forest-900">
              Pesan
            </label>
            <textarea
              ref={messageRef}
              id={`${id}-message`}
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onBlur={() => revalidate('message')}
              placeholder="Contoh: Kami rombongan 40 siswa SD, ingin ikut Tour de Kebun Raya pada pertengahan Desember."
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? `${id}-message-err` : `${id}-message-hint`}
              className={`${field} resize-y py-3 leading-relaxed ${errors.message ? bad : ok}`}
            />
            {errors.message ? (
              <p id={`${id}-message-err`} className="mt-1.5 text-sm text-terra-600">
                {errors.message}
              </p>
            ) : (
              <p id={`${id}-message-hint`} className="mt-1.5 text-sm text-sage-600">
                Sertakan tanggal rencana dan jumlah orang agar jawabannya lebih tepat.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="group relative mt-1 flex h-13 w-full cursor-pointer items-center justify-center rounded-xl bg-forest-900 text-[15px] font-semibold text-cream-50 transition-colors duration-200 hover:bg-forest-800 active:bg-forest-950"
          >
            Kirim lewat WhatsApp
            <span className="absolute right-1.5 grid size-10 place-items-center rounded-lg bg-cream-50 text-forest-900 transition-transform duration-300 ease-(--ease-organic) group-hover:translate-x-0.5">
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </button>

          <div aria-live="polite" className="text-center text-sm">
            {sentUrl ? (
              <p className="flex items-center justify-center gap-2 text-forest-700">
                <Check className="size-4 shrink-0" aria-hidden />
                <span>
                  WhatsApp dibuka di tab baru.{' '}
                  <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2">
                    Belum terbuka?
                  </a>
                </span>
              </p>
            ) : (
              <p className="text-sage-600">
                Pesan dikirim langsung ke WhatsApp Visitor Center — tidak ada data yang disimpan di situs ini. Lebih suka email?{' '}
                <a href={mailto} className="font-semibold text-forest-900 underline underline-offset-2">
                  Kirim email
                </a>
              </p>
            )}
          </div>
        </form>

        {/* Channels */}
        <ul className="mt-16 grid gap-px overflow-hidden rounded-[20px] bg-forest-900/10 ring-1 ring-forest-900/10 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c, i) => {
            const Icon = c.icon
            return (
              <li key={c.label} className="reveal bg-cream-100" style={{ '--d': `${0.1 + i * 0.07}s` } as React.CSSProperties}>
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex h-full items-start gap-4 p-5 transition-colors duration-200 hover:bg-cream-50"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-forest-900 text-cream-50 transition-colors group-hover:bg-forest-700">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold tracking-wide text-sage-600 uppercase">{c.label}</span>
                    <span className="mt-1 block font-semibold break-words text-forest-900">
                      {/* let long emails wrap after the @, not mid-word */}
                      {c.value.includes('@') ? (
                        <>
                          {c.value.split('@')[0]}@<wbr />
                          {c.value.split('@')[1]}
                        </>
                      ) : (
                        c.value
                      )}
                    </span>
                    {c.label === 'Lokasi' && <span className="block text-sm text-ink/65">{ADDRESS.line2}</span>}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
        <p className="mt-5 text-center text-sm text-sage-600">
          Pintu masuk pengunjung: Pintu 1, 3, dan 4 · Sen–Jum {OPENING_HOURS.weekday} · Sab–Min & libur nasional {OPENING_HOURS.weekend} WIB
        </p>
      </div>
    </section>
  )
}
