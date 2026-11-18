import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

export const MIN_ZOOM = 1
export const MAX_ZOOM = 3.5

interface Insets {
  top: number
  bottom: number
  side: number
}

interface View {
  s: number
  x: number
  y: number
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/**
 * Pan / zoom for a fixed-aspect layer inside a container — no library.
 * Drag (mouse/touch), pinch, Ctrl/⌘ + wheel, keyboard (arrows, + / −, 0).
 * Plain wheel is left to the page so the map never hijacks scrolling.
 */
export function usePanZoom(aspect: number, insets: Insets, fit: 'contain' | 'height' = 'contain') {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 })
  const [animating, setAnimating] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [wheelHint, setWheelHint] = useState(false)
  const viewRef = useRef(view)
  viewRef.current = view
  const movedRef = useRef(false)

  // Base (zoom = 1) size: the whole map fits the free area between the overlays ('contain'),
  // or fills its height and pans sideways ('height' — portrait phones, where 'contain' makes pins pile up)
  const availW = Math.max(0, size.w - insets.side * 2)
  const availH = Math.max(0, size.h - insets.top - insets.bottom)
  const bw = fit === 'height' ? Math.max(availW, availH * aspect) : Math.min(availW, availH * aspect)
  const bh = bw / aspect
  const home = useCallback(
    (): View => ({ s: 1, x: (size.w - bw) / 2, y: insets.top + (availH - bh) / 2 }),
    [size.w, bw, bh, availH, insets.top],
  )

  const constrain = useCallback(
    (v: View): View => {
      const s = clamp(v.s, MIN_ZOOM, MAX_ZOOM)
      // keep at least ~45% of the viewport covered by the map
      const cw = bw * s
      const ch = bh * s
      return {
        s,
        x: clamp(v.x, Math.min(size.w * 0.55 - cw, (size.w - cw) / 2), Math.max(size.w * 0.45, (size.w - cw) / 2)),
        y: clamp(v.y, Math.min(size.h * 0.55 - ch, (size.h - ch) / 2), Math.max(size.h * 0.45, (size.h - ch) / 2)),
      }
    },
    [bw, bh, size.w, size.h],
  )

  const commit = useCallback(
    (next: View, animate = false) => {
      setAnimating(animate)
      setView(constrain(next))
    },
    [constrain],
  )

  // Measure container; reset to home when the layout size changes
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  useLayoutEffect(() => {
    if (size.w) setView(home())
  }, [size.w, size.h, home])

  /** Zoom to `s`, keeping container point (px, py) fixed. */
  const zoomAt = useCallback(
    (s: number, px?: number, py?: number, animate = true) => {
      const v = viewRef.current
      const cx = px ?? size.w / 2
      const cy = py ?? size.h / 2
      const ns = clamp(s, MIN_ZOOM, MAX_ZOOM)
      commit({ s: ns, x: cx - ((cx - v.x) * ns) / v.s, y: cy - ((cy - v.y) * ns) / v.s }, animate)
    },
    [commit, size.w, size.h],
  )

  const reset = useCallback(() => {
    setAnimating(true)
    setView(home())
  }, [home])

  /** Pan (no zoom change) so the map point (xPct, yPct) sits inside `safe` — only if it is outside it now. */
  const reveal = useCallback(
    (xPct: number, yPct: number, safe: { left: number; right: number; top: number; bottom: number }) => {
      const v = viewRef.current
      const px = v.x + (xPct / 100) * bw * v.s
      const py = v.y + (yPct / 100) * bh * v.s
      const inside = px > safe.left && px < size.w - safe.right && py > safe.top && py < size.h - safe.bottom
      if (inside) return
      const tx = safe.left + (size.w - safe.left - safe.right) / 2
      const ty = safe.top + (size.h - safe.top - safe.bottom) / 2
      commit({ s: v.s, x: v.x + (tx - px), y: v.y + (ty - py) }, true)
    },
    [bw, bh, size.w, size.h, commit],
  )

  /** One animated move that frames a set of map points inside `safe` (used when a tour route is chosen). */
  const fitTo = useCallback(
    (pts: { x: number; y: number }[], safe: { left: number; right: number; top: number; bottom: number }, maxS = 2.4) => {
      if (!pts.length || !bw) return
      const xs = pts.map((pt) => (pt.x / 100) * bw)
      const ys = pts.map((pt) => (pt.y / 100) * bh)
      const minX = Math.min(...xs)
      const maxX = Math.max(...xs)
      const minY = Math.min(...ys) - 48 // pins rise above their anchor point
      const maxY = Math.max(...ys)
      const w = size.w - safe.left - safe.right
      const h = size.h - safe.top - safe.bottom
      const s = clamp(Math.min(w / (maxX - minX + 120), h / (maxY - minY + 80)), MIN_ZOOM, maxS)
      commit({ s, x: safe.left + w / 2 - ((minX + maxX) / 2) * s, y: safe.top + h / 2 - ((minY + maxY) / 2) * s }, true)
    },
    [bw, bh, size.w, size.h, commit],
  )

  // Pointer drag + pinch
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const gesture = useRef<{ x: number; y: number; vx: number; vy: number; dist: number; s: number } | null>(null)

  const local = (e: { clientX: number; clientY: number }) => {
    const r = containerRef.current!.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    pointers.current.set(e.pointerId, local(e))
    movedRef.current = false
    const pts = [...pointers.current.values()]
    const v = viewRef.current
    const mid = pts.length === 2 ? { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 } : pts[0]
    const dist = pts.length === 2 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0
    gesture.current = { x: mid.x, y: mid.y, vx: v.x, vy: v.y, dist, s: v.s }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId) || !gesture.current) return
    pointers.current.set(e.pointerId, local(e))
    const pts = [...pointers.current.values()]
    const g = gesture.current
    if (pts.length === 2) {
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 }
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
      const ns = clamp((g.s * dist) / (g.dist || dist), MIN_ZOOM, MAX_ZOOM)
      movedRef.current = true
      setDragging(true)
      commit({ s: ns, x: mid.x - ((g.x - g.vx) * ns) / g.s, y: mid.y - ((g.y - g.vy) * ns) / g.s })
      return
    }
    const dx = pts[0].x - g.x
    const dy = pts[0].y - g.y
    if (!movedRef.current && Math.hypot(dx, dy) < 5) return
    if (!movedRef.current) {
      movedRef.current = true
      setDragging(true)
      // capture only once it is really a drag, so taps still reach the pins
      containerRef.current?.setPointerCapture(e.pointerId)
    }
    commit({ s: viewRef.current.s, x: g.vx + dx, y: g.vy + dy })
  }

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId)
    const rest = [...pointers.current.values()]
    if (rest.length === 1) {
      const v = viewRef.current
      gesture.current = { x: rest[0].x, y: rest[0].y, vx: v.x, vy: v.y, dist: 0, s: v.s }
    } else if (rest.length === 0) {
      gesture.current = null
      setDragging(false)
    }
  }

  /** True right after a drag — lets click handlers ignore the click that ends a pan. */
  const wasDrag = () => movedRef.current

  // Wheel: Ctrl/⌘ zooms; plain wheel scrolls the page and shows a hint
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let t = 0
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const p = local(e)
        zoomAt(viewRef.current.s * Math.exp(-e.deltaY * 0.0025), p.x, p.y, false)
      } else {
        setWheelHint(true)
        window.clearTimeout(t)
        t = window.setTimeout(() => setWheelHint(false), 1400)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      window.clearTimeout(t)
    }
  }, [zoomAt])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.target !== e.currentTarget) return
    const v = viewRef.current
    const step = 80
    const keys: Record<string, () => void> = {
      ArrowLeft: () => commit({ ...v, x: v.x + step }, true),
      ArrowRight: () => commit({ ...v, x: v.x - step }, true),
      ArrowUp: () => commit({ ...v, y: v.y + step }, true),
      ArrowDown: () => commit({ ...v, y: v.y - step }, true),
      '+': () => zoomAt(v.s + 0.5),
      '=': () => zoomAt(v.s + 0.5),
      '-': () => zoomAt(v.s - 0.5),
      '0': reset,
    }
    if (keys[e.key]) {
      e.preventDefault()
      keys[e.key]()
    }
  }

  return {
    containerRef,
    view,
    base: { w: bw, h: bh },
    animating,
    dragging,
    wheelHint,
    zoomAt,
    reset,
    reveal,
    fitTo,
    wasDrag,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onKeyDown },
  }
}
