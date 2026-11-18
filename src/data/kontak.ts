/*
 * Contact data. Visitor Center numbers, email, socials and ticket link: kebunraya.id (Nov 2026).
 * Street address is not published on kebunraya.id — widely listed public address, verify before final.
 */
export const VISITOR_CENTER = {
  whatsappDisplay: '0852-1566-8934',
  whatsappNumber: '6285215668934',
  phoneDisplay: '0251-83311362',
  phoneHref: 'tel:+6225183311362',
  email: 'viscos.bogor@kebunraya.id',
}

export const ADDRESS = {
  line1: 'Jl. Ir. H. Juanda No. 13, Paledang',
  line2: 'Bogor Tengah, Kota Bogor, Jawa Barat 16122',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kebun+Raya+Bogor',
}

export const TICKET_URL = 'https://tiketkebunraya.id/'

export const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/kebunraya_id/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@kebunraya_id' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@kebunraya_id' },
  { label: 'X', href: 'https://x.com/kebunraya_id' },
  { label: 'Facebook', href: 'https://www.facebook.com/kebunraya.id/' },
  { label: 'WhatsApp', href: `https://wa.me/${VISITOR_CENTER.whatsappNumber}` },
]

export const whatsappLink = (text: string) => `https://wa.me/${VISITOR_CENTER.whatsappNumber}?text=${encodeURIComponent(text)}`

/** Current time in Bogor (WIB) plus open/closed status from the Visitor Center hours. Ignores public holidays. */
export function bogorNow(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Jakarta', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  )
  const weekend = parts.weekday === 'Sat' || parts.weekday === 'Sun'
  const minutes = Number(parts.hour) * 60 + Number(parts.minute)
  const opens = weekend ? 7 * 60 : 8 * 60
  const closes = 16 * 60
  const label = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'short', hour: '2-digit', minute: '2-digit' }).format(date)
  return { label, open: minutes >= opens && minutes < closes, beforeOpen: minutes < opens, opensAt: weekend ? '07.00' : '08.00' }
}
