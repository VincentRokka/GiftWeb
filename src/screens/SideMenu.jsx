import { menuItems, site } from "../content"
import Logo from "../components/Logo"
import "./SideMenu.css"

export default function SideMenu({ open, onClose, onSelect }) {
  return (
    <div className={`side-menu${open ? " is-open" : ""}`} aria-hidden={!open}>
      <button
        className="side-menu-backdrop"
        type="button"
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />

      <aside className="side-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="side-menu-top">
          <Logo className="logo-on-dark" onClick={onClose} />
          <button className="side-menu-close" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        <nav className="side-menu-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="side-menu-item"
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => onSelect(item)}
            >
              <span className="side-menu-index">{item.index}</span>
              <span className="side-menu-title">{item.title}</span>
            </button>
          ))}
        </nav>

        <div className="side-menu-foot">
          <p>{site.brand}</p>
          <p>{site.builtBy}</p>
        </div>
      </aside>
    </div>
  )
}
