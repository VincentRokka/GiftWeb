import { useEffect, useMemo, useRef, useState } from "react"
import { galleryImages } from "../content"

const N = galleryImages.length
const COPIES = 5
const MIDDLE_COPY = Math.floor(COPIES / 2)
const START_LOGICAL = Math.floor(N / 2)
const SNAP_MS = 460
const CLICK_SLOP = 6

export default function Gallery({ onCardClick }) {
  const slides = useMemo(
    () =>
      Array.from({ length: N * COPIES }, (_, index) => ({
        key: `${index}-${galleryImages[index % N]}`,
        src: galleryImages[index % N],
      })),
    [],
  )

  const galleryRef = useRef(null)
  const trackRef = useRef(null)
  const stepRef = useRef(0)
  const offsetRef = useRef(0)
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    origin: 0,
  })
  const snapTimer = useRef(0)
  const clickRef = useRef({ index: null, moved: false })
  const onCardClickRef = useRef(onCardClick)
  onCardClickRef.current = onCardClick

  const [offset, setOffset] = useState(0)
  const [animate, setAnimate] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [activeIndex, setActiveIndex] = useState(
    MIDDLE_COPY * N + START_LOGICAL,
  )

  function measureStep() {
    const cards = trackRef.current?.querySelectorAll(".card")
    if (!cards || cards.length < 2) return stepRef.current
    const value = cards[1].offsetLeft - cards[0].offsetLeft
    stepRef.current = value
    return value
  }

  function loopWidth() {
    return measureStep() * N
  }

  function middleBase() {
    return MIDDLE_COPY * loopWidth()
  }

  function normalize(value) {
    const width = loopWidth()
    if (!width) return value
    const base = middleBase()
    const mod = ((value % width) + width) % width
    return base + mod
  }

  function nearestOffset(value) {
    const step = measureStep()
    if (!step) return value
    return Math.round(value / step) * step
  }

  function indexFromOffset(value) {
    const step = measureStep()
    if (!step) return MIDDLE_COPY * N + START_LOGICAL
    return Math.round(value / step)
  }

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const step = measureStep()
      if (!step) return
      const start = middleBase() + START_LOGICAL * step
      offsetRef.current = start
      setOffset(start)
      setActiveIndex(indexFromOffset(start))
    })
    return () => window.cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    function onResize() {
      const step = measureStep()
      if (!step) return
      const logical = ((activeIndex % N) + N) % N
      const next = middleBase() + logical * step
      offsetRef.current = next
      setAnimate(false)
      setOffset(next)
      setActiveIndex(indexFromOffset(next))
    }

    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [activeIndex])

  useEffect(() => {
    function onMove(event) {
      const drag = dragRef.current
      if (!drag.active) return
      if (drag.pointerId != null && event.pointerId != null && event.pointerId !== drag.pointerId) {
        return
      }

      if (Math.abs(event.clientX - drag.startX) > CLICK_SLOP) clickRef.current.moved = true
      const next = drag.origin - (event.clientX - drag.startX)
      offsetRef.current = next
      setOffset(next)
      setActiveIndex(indexFromOffset(next))
    }

    function onUp(event) {
      const drag = dragRef.current
      if (!drag.active) return
      if (drag.pointerId != null && event.pointerId != null && event.pointerId !== drag.pointerId) {
        return
      }

      drag.active = false
      drag.pointerId = null
      setDragging(false)

      const click = clickRef.current
      if (!click.moved && click.index != null) {
        onCardClickRef.current?.(click.index % N)
      }
      clickRef.current = { index: null, moved: false }

      const snapped = nearestOffset(offsetRef.current)
      offsetRef.current = snapped
      setAnimate(true)
      setOffset(snapped)
      setActiveIndex(indexFromOffset(snapped))

      window.clearTimeout(snapTimer.current)
      snapTimer.current = window.setTimeout(() => {
        const wrapped = normalize(snapped)
        if (Math.abs(wrapped - snapped) < 0.5) {
          setAnimate(false)
          return
        }
        offsetRef.current = wrapped
        setAnimate(false)
        setOffset(wrapped)
        setActiveIndex(indexFromOffset(wrapped))
      }, SNAP_MS)
    }

    function onDown(event) {
      if (event.button != null && event.button !== 0) return
      if (event.target.closest(".wish, .topbar, .footer, .brand, .menu, .logo")) return

      const card = event.target.closest(".card")
      clickRef.current = {
        index: card ? Number(card.dataset.index) : null,
        moved: false,
      }

      measureStep()
      const wrapped = normalize(offsetRef.current)
      if (Math.abs(wrapped - offsetRef.current) > 0.5) {
        offsetRef.current = wrapped
        setAnimate(false)
        setOffset(wrapped)
        setActiveIndex(indexFromOffset(wrapped))
      }

      dragRef.current = {
        active: true,
        pointerId: event.pointerId ?? null,
        startX: event.clientX,
        origin: offsetRef.current,
      }
      setDragging(true)
      setAnimate(false)
    }

    const node = galleryRef.current
    node?.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)

    return () => {
      window.clearTimeout(snapTimer.current)
      node?.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }, [])

  return (
    <section
      ref={galleryRef}
      className={`gallery${dragging ? " is-dragging" : ""}${animate ? "" : " is-instant"}`}
      aria-label="Gallery"
    >
      <div
        ref={trackRef}
        className="gallery-track"
        style={{
          transform: `translate3d(calc(50vw - ${offset}px - var(--card-w) / 2), -50%, 0)`,
        }}
      >
        {slides.map((slide, slideIndex) => (
          <article
            key={slide.key}
            data-index={slideIndex}
            className={`card${slideIndex === activeIndex ? " is-active" : ""}`}
          >
            <img src={slide.src} alt="" draggable="false" />
          </article>
        ))}
      </div>
    </section>
  )
}
