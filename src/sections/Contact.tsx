import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { useState } from 'react'

const srcSet = (name: string) => [1200, 2000, 2800].map((w) => `/images/${name}-${w}.webp ${w}w`).join(', ')
const BG = { src: '/images/rafflesia-2000.webp', srcSet: srcSet('rafflesia') }

export function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    agreed: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.agreed) return
    alert('Pesan Anda telah terkirim ke Kebun Raya Bogor.')
  }

  return (
    <section id="kontak" aria-label="Hubungi Kami" className="w-full bg-cream-50 text-forest-950">
      {/* Bagian Atas: Hero Gelap dengan Foto & Efek Vignette seperti Hero.tsx */}
      <div className="relative w-full bg-forest-950 text-cream-50">
        {/* Foto Latar Belakang dari public/images/ */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src={BG.src}
            srcSet={BG.srcSet}
            sizes="100vw"
            alt=""
            className="h-full w-full object-cover object-center opacity-35 brightness-[0.65] saturate-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/95 via-forest-950/80 to-forest-950/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_25%_30%,rgb(212_175_98/0.12),transparent_70%)]" />
        </div>

        {/* Kontainer Split-Screen */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-32 pb-24 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            {/* Kolom Kiri: Judul & Info Kontak */}
            <div className="space-y-8 lg:col-span-5 lg:pt-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.3em] text-gold-300 uppercase sm:text-xs">
                  Kebun Raya Bogor · Layanan Informasi
                </p>
                <h2 className="mt-4 text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.98] font-light tracking-[-0.02em] text-cream-50">
                  Hubungi <em className="font-normal text-gold-300">Kami.</em>
                </h2>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-cream-50/80">
                  Untuk informasi kunjungan, reservasi tur edukasi flora, penelitian, atau kolaborasi acara di Kebun Raya Bogor, hubungi tim kami hari ini.
                </p>
              </div>

              <div className="space-y-6 pt-2">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.25em] text-gold-300 uppercase">Telepon</p>
                  <a
                    href="tel:(0251) 8311362"
                    className="mt-1 inline-block font-display text-2xl text-cream-50 transition-colors hover:text-gold-300"
                  >
                    (0251) 8311362
                  </a>
                </div>

                <div>
                  <p className="text-[10px] font-semibold tracking-[0.25em] text-gold-300 uppercase">Email</p>
                  <a
                    href="mailto:info@kebunraya.id."
                    className="mt-1 inline-block font-display text-xl text-cream-50 transition-colors hover:text-gold-300"
                  >
                    info@kebunraya.id
                  </a>
                </div>

                <div>
                  <p className="text-[10px] font-semibold tracking-[0.25em] text-gold-300 uppercase">Sosial Media</p>
                  <div className="mt-3 flex items-center gap-4 text-cream-50/85">
                    <a href="#facebook" aria-label="Facebook" className="transition-colors hover:text-gold-300">
                      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                    <a href="#instagram" aria-label="Instagram" className="transition-colors hover:text-gold-300">
                      <svg
                        className="size-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                      </svg>
                    </a>
                    <a href="#twitter" aria-label="Twitter" className="transition-colors hover:text-gold-300">
                      <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </a>
                    <a href="#whatsapp" aria-label="WhatsApp" className="transition-colors hover:text-gold-300">
                      <MessageCircle className="size-5" strokeWidth={1.75} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Kartu Form Mengambang (Overlapping Card) */}
            <div className="lg:col-span-7 lg:-mb-52">
              <div className="rounded-card border border-forest-950/10 bg-cream-50 p-8 text-forest-950 shadow-[0_40px_90px_-30px_rgb(0_0_0/0.45)] sm:p-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-semibold text-forest-900">
                      Nama Depan
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Masukkan nama depan Anda..."
                      className="mt-2 w-full border-b border-forest-950/20 bg-transparent py-2.5 text-sm text-forest-950 placeholder:text-sage-600/60 transition-colors focus:border-forest-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-xs font-semibold text-forest-900">
                      Nama Belakang
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Masukkan nama belakang Anda..."
                      className="mt-2 w-full border-b border-forest-950/20 bg-transparent py-2.5 text-sm text-forest-950 placeholder:text-sage-600/60 transition-colors focus:border-forest-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-forest-900">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Masukkan alamat email Anda..."
                      className="mt-2 w-full border-b border-forest-950/20 bg-transparent py-2.5 text-sm text-forest-950 placeholder:text-sage-600/60 transition-colors focus:border-forest-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-forest-900">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Masukkan nomor telepon / WhatsApp..."
                      className="mt-2 w-full border-b border-forest-950/20 bg-transparent py-2.5 text-sm text-forest-950 placeholder:text-sage-600/60 transition-colors focus:border-forest-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-forest-900">
                      Pesan Anda
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={2}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Beri tahu kami pertanyaan atau kebutuhan kunjungan Anda..."
                      className="mt-2 w-full resize-none border-b border-forest-950/20 bg-transparent py-2.5 text-sm text-forest-950 placeholder:text-sage-600/60 transition-colors focus:border-forest-900 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex cursor-pointer items-center gap-3 text-xs text-forest-950/75">
                      <input
                        type="checkbox"
                        required
                        checked={formData.agreed}
                        onChange={(e) => setFormData((prev) => ({ ...prev, agreed: e.target.checked }))}
                        className="size-4 rounded border-forest-950/30 text-forest-900 focus:ring-forest-900"
                      />
                      <span>
                        Saya menyetujui{' '}
                        <a href="#privasi" className="font-semibold text-forest-900 underline">
                          Kebijakan Privasi
                        </a>{' '}
                        Kebun Raya Bogor
                      </span>
                    </label>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="group inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-forest-900 px-6 text-sm font-semibold text-cream-50 transition-colors duration-200 hover:bg-gold-300 hover:text-forest-900"
                    >
                      Kirim Pesan
                      <ArrowUpRight
                        className="size-4 transition-transform duration-300 ease-(--ease-organic) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Deskripsi Kiri di atas bg-cream-50 */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="max-w-sm text-sm leading-relaxed text-sage-600">
              Baik Anda berkunjung untuk menikmati keteduhan 87 hektare hutan tropis, riset botani, maupun agenda konservasi — tim kami siap membantu merencanakan pengalaman terbaik Anda di Kebun Raya Bogor.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}