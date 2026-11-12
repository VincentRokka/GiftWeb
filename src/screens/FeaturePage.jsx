import { site } from "../content"
import Logo from "../components/Logo"
import "./FeaturePage.css"

export default function FeaturePage({ item, onBack }) {
  return (
    <main className="feature">
      <header className="feature-top">
        <Logo onClick={onBack} />
        <button className="feature-back" type="button" onClick={onBack}>
          Back
        </button>
      </header>

      <section className="feature-hero">
        <p className="feature-index">{item.index}</p>
        <h1>{item.title}</h1>
        <p className="feature-note">
          Placeholder page for {item.title}. Drop the final image at{" "}
          <code>{item.image}</code>.
        </p>
      </section>

      <div className="feature-media">
        <img
          src={item.image}
          alt=""
          onError={(event) => {
            event.currentTarget.style.display = "none"
            event.currentTarget.parentElement?.classList.add("is-empty")
          }}
        />
        <div className="feature-media-fallback" aria-hidden="true">
          <span>{item.index}</span>
          <span>{item.title}</span>
        </div>
      </div>

      <footer className="feature-foot">
        <p>{site.brand}</p>
        <p>{site.builtBy}</p>
      </footer>
    </main>
  )
}
