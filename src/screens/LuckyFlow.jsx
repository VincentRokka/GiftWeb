import { useEffect, useRef, useState } from "react"
import { luckyFlow } from "../content"
import { loadPlayOnceGif } from "../lib/playOnceGif"
import "./LuckyFlow.css"

const MENU_FADE_MS = 450
const GIF_END_PAD_MS = 120 // small buffer after the gif's last frame before the message fades in

function pickMessage(choice) {
  const pool = luckyFlow.messages[choice] ?? Object.values(luckyFlow.messages).flat()
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * steps: "intro" (06 zooms in, then holds) → "menu" (07, pick 1 of 6) → "shelf" (06 again)
 *        → "gif" (click 1 of 4 frames: its gif plays once, then a random message for `choice`).
 * The 06 layer stays mounted the whole time; the menu fades in on top of it and out again.
 * Only the "shelf" step adds the hover hotspots / info panels / nav buttons, so the intro is untouched.
 */
export default function LuckyFlow({ choice, onClose, onChoose }) {
  const [step, setStep] = useState("intro")
  const [menuLeaving, setMenuLeaving] = useState(false)
  const [activeItem, setActiveItem] = useState(null)
  const [reveal, setReveal] = useState(null) // { item, url, duration, message }
  const [revealDone, setRevealDone] = useState(false)
  const [opening, setOpening] = useState(null)
  const revealTimer = useRef(0)
  const revealUrl = useRef(null)

  useEffect(
    () => () => {
      window.clearTimeout(revealTimer.current)
      if (revealUrl.current) URL.revokeObjectURL(revealUrl.current)
    },
    [],
  )

  useEffect(() => {
    for (const src of [luckyFlow.menuImage, luckyFlow.hoverIcon]) {
      const img = new Image()
      img.src = src
    }

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    const delay = (reduce ? 0 : luckyFlow.zoomMs) + luckyFlow.holdMs
    const id = window.setTimeout(() => setStep("menu"), delay)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose?.()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  function backToMenu() {
    setActiveItem(null)
    setStep("menu")
  }

  function preloadGif(item) {
    loadPlayOnceGif(item.gif).catch(() => {})
  }

  async function openGif(item) {
    if (opening) return
    setOpening(item.id)
    let next
    try {
      const { blob, duration } = await loadPlayOnceGif(item.gif)
      // fresh object URL each time → the animation restarts from frame 1
      next = { url: URL.createObjectURL(blob), duration }
      revealUrl.current = next.url
    } catch {
      next = { url: item.gif, duration: 0 } // fallback: plain gif, message right away
    }
    setActiveItem(null)
    setRevealDone(false)
    setReveal({ item, message: pickMessage(choice), ...next })
    setStep("gif")
    setOpening(null)
  }

  function onGifLoaded() {
    window.clearTimeout(revealTimer.current)
    revealTimer.current = window.setTimeout(
      () => setRevealDone(true),
      reveal.duration ? reveal.duration + GIF_END_PAD_MS : 0,
    )
  }

  function backToShelf() {
    window.clearTimeout(revealTimer.current)
    if (revealUrl.current) URL.revokeObjectURL(revealUrl.current)
    revealUrl.current = null
    setReveal(null)
    setRevealDone(false)
    setStep("shelf")
  }

  function choose(option) {
    if (menuLeaving) return
    onChoose?.(option)
    setMenuLeaving(true)
    window.setTimeout(() => {
      setStep("shelf")
      setMenuLeaving(false)
    }, MENU_FADE_MS)
  }

  return (
    <div
      className="lucky"
      style={{
        "--lucky-zoom-ms": `${luckyFlow.zoomMs}ms`,
        "--lucky-fade-ms": `${MENU_FADE_MS}ms`,
        "--lucky-hover": luckyFlow.hoverColor,
        "--lucky-hover-text": luckyFlow.hoverText,
        "--lucky-menu-bg": luckyFlow.menuBackground,
        "--lucky-aspect": luckyFlow.menuAspect,
      }}
    >
      <div
        className={`lucky-intro${step === "intro" ? " is-zooming" : ""}`}
        style={{ "--lucky-intro-aspect": luckyFlow.introAspect }}
      >
        {/* stage = the 06 image at object-fit: cover size, so %-positioned overlays line up with the art */}
        <div className="lucky-intro-stage">
          <img src={luckyFlow.introImage} alt="" draggable="false" />

          {step === "shelf" &&
            luckyFlow.shelf.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`lucky-shelf-frame${activeItem === item.id ? " is-active" : ""}${opening === item.id ? " is-opening" : ""}`}
                aria-label={item.title}
                onPointerEnter={() => preloadGif(item)}
                onFocus={() => setActiveItem(item.id)}
                onBlur={() => setActiveItem(null)}
                onClick={() => openGif(item)}
                style={{
                  left: `${item.frame.left}%`,
                  top: `${item.frame.top}%`,
                  width: `${item.frame.width}%`,
                  height: `${item.frame.height}%`,
                }}
              >
                {/* hover the name on the plaque → info panel; click anywhere in the frame → gif */}
                <span
                  className="lucky-shelf-hotspot"
                  onMouseEnter={() => setActiveItem(item.id)}
                  onMouseLeave={() => setActiveItem(null)}
                />
                <span className="lucky-shelf-panel" aria-hidden={activeItem !== item.id}>
                  <span className="lucky-shelf-title">{item.title}</span>
                  {item.body.map((text, i) => (
                    <span className="lucky-shelf-text" key={i}>{text}</span>
                  ))}
                </span>
              </button>
            ))}
        </div>
      </div>

      {step === "gif" && reveal && (
        <section
          className={`lucky-reveal${revealDone ? " is-done" : ""}`}
          aria-label={reveal.item.title}
        >
          <img
            className="lucky-reveal-gif"
            src={reveal.url}
            alt=""
            draggable="false"
            onLoad={onGifLoaded}
          />
          <div className="lucky-reveal-note" aria-live="polite">
            {revealDone && (
              <>
                <span className="lucky-reveal-kicker">{reveal.item.title}</span>
                <p className="lucky-reveal-message">{reveal.message}</p>
              </>
            )}
          </div>
        </section>
      )}

      {(step === "shelf" || step === "gif") && (
        <nav
          className="lucky-nav"
          key={step}
          aria-label="Lucky navigation"
          style={{
            "--lucky-intro-aspect": luckyFlow.introAspect,
            "--lucky-nav-frame-top": luckyFlow.shelf[0].frame.top / 100,
          }}
        >
          <button
            type="button"
            className="lucky-nav-btn"
            onClick={step === "gif" ? backToShelf : backToMenu}
          >
            <span aria-hidden="true">←</span> {luckyFlow.nav.back}
          </button>
          <button type="button" className="lucky-nav-btn" onClick={() => onClose?.()}>
            <span aria-hidden="true">⌂</span> {luckyFlow.nav.home}
          </button>
        </nav>
      )}

      {step === "menu" && (
        <section
          className={`lucky-menu${menuLeaving ? " is-leaving" : ""}`}
          aria-label="What Luck Today?"
        >
          <div className="lucky-menu-stage">
            <img
              className="lucky-menu-art"
              src={luckyFlow.menuImage}
              alt=""
              draggable="false"
            />
            {luckyFlow.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className="lucky-option"
                style={{
                  left: `${option.rect.left}%`,
                  top: `${option.rect.top}%`,
                  width: `${option.rect.width}%`,
                  height: `${option.rect.height}%`,
                }}
                onClick={() => choose(option)}
              >
                <span
                  className={`lucky-option-label is-${option.label.align}`}
                  style={{ left: `${option.label.x}%`, top: `${option.label.y}%` }}
                >
                  {option.title}
                </span>
                <img
                  className="lucky-option-icon"
                  src={luckyFlow.hoverIcon}
                  alt=""
                  draggable="false"
                  style={{ left: `${option.icon.x}%`, top: `${option.icon.y}%` }}
                />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
