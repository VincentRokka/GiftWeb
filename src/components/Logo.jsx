import { site } from "../content"

export default function Logo({ className = "", onClick }) {
  const onDark = className.includes("logo-on-dark")

  return (
    <a
      className={`logo ${className}`.trim()}
      href="/"
      aria-label={site.brand}
      onClick={(event) => {
        event.preventDefault()
        onClick?.()
      }}
    >
      <img
        className="logo-image"
        src={onDark ? "/images/logo-light.png" : "/images/logo-dark.png"}
        alt={site.brand}
        draggable="false"
      />
    </a>
  )
}
