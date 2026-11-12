import { useEffect, useRef, useState } from "react"
import {
  loaderCopy,
  loaderCycles,
  loaderFrameMs,
  loaderImages,
} from "../content"
import "./Loader.css"

const SLOT_COUNT = loaderImages.length * loaderCycles
const TOTAL_MS = SLOT_COUNT * loaderFrameMs

function preload(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

export default function Loader({ onComplete, leaving }) {
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(0)
  const onCompleteRef = useRef(onComplete)
  const barRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    let cancelled = false
    Promise.all(loaderImages.map(preload)).then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!ready) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      if (barRef.current) barRef.current.style.transform = "scaleX(1)"
      if (trackRef.current) trackRef.current.setAttribute("aria-valuenow", "100")
      setActive(loaderImages.length - 1)
      const timer = window.setTimeout(() => onCompleteRef.current(), 280)
      return () => window.clearTimeout(timer)
    }

    let origin = 0
    let rafId = 0
    let doneTimer = 0
    let lastSlot = -1
    let finished = false

    const tick = (now) => {
      if (finished) return
      if (origin === 0) origin = now
      const elapsed = now - origin
      const t = Math.min(1, elapsed / TOTAL_MS)
      const slot = Math.min(SLOT_COUNT - 1, Math.floor(Math.max(0, elapsed) / loaderFrameMs))

      if (barRef.current) barRef.current.style.transform = `scaleX(${t})`
      if (trackRef.current) {
        trackRef.current.setAttribute("aria-valuenow", String(Math.round(t * 100)))
      }

      if (slot !== lastSlot) {
        lastSlot = slot
        setActive(slot % loaderImages.length)
      }

      if (t < 1) {
        rafId = window.requestAnimationFrame(tick)
        return
      }

      if (!finished) {
        finished = true
        doneTimer = window.setTimeout(() => onCompleteRef.current(), 260)
      }
    }

    rafId = window.requestAnimationFrame(tick)

    return () => {
      finished = true
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(doneTimer)
    }
  }, [ready])

  return (
    <div className={`loader${leaving ? " is-leaving" : ""}`} aria-hidden={leaving}>
      <div className="lockup">
        <div className="frame">
          {loaderImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt=""
              draggable="false"
              className={index === active ? "is-active" : ""}
            />
          ))}
        </div>
        <div className="meta">
          <div className="lines">
            {loaderCopy.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="caption">{loaderCopy.caption}</p>
        </div>
      </div>

      <div
        className="track"
        ref={trackRef}
        role="progressbar"
        aria-label="Loading"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
      >
        <span className="track-fill" ref={barRef} />
      </div>
    </div>
  )
}
