import { useEffect, useState } from "react"
import { site } from "../content"
import Logo from "../components/Logo"
import Gallery from "./Gallery"
import SideMenu from "./SideMenu"
import "./MainScreen.css"

export default function MainScreen({ entering, onOpenFeature, onGalleryClick }) {
  const [wishOpen, setWishOpen] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    function onKey(event) {
      if (event.key === "Escape") setMenuOpen(false)
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen])

  function handleSelect(item) {
    setMenuOpen(false)
    onOpenFeature?.(item)
  }

  return (
    <main className={`main${entering ? " is-entering" : " is-ready"}`}>
      <div className="stage">
        <header className="topbar">
          <Logo />
          <button
            className="menu"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(true)}
          >
            {site.menu}
          </button>
        </header>

        <div className="axis" aria-hidden="true" />

        <div className="brand">
          <div className="brand-panel">
            <div className="brand-copy">
              {site.lockup.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>

        <Gallery onCardClick={onGalleryClick} />

        {wishOpen && (
          <aside className="wish" role="status">
            <button className="wish-play" type="button" aria-label="Play">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path fill="currentColor" d="M10 8.5v7l6-3.5z" />
              </svg>
            </button>
            <p>{site.wish}</p>
            <button
              className="wish-close"
              type="button"
              aria-label="Close"
              onClick={() => setWishOpen(false)}
            >
              ×
            </button>
          </aside>
        )}

        <footer className="footer">
          <p>{site.footer.left}</p>
          <p className="footer-center">{site.footer.center}</p>
          <p>{site.footer.right}</p>
        </footer>
      </div>

      <div id="site-menu">
        <SideMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onSelect={handleSelect}
        />
      </div>
    </main>
  )
}
