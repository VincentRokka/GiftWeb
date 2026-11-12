import { useEffect, useState } from "react"
import { luckyFlow, menuItems } from "./content"
import Loader from "./loader/Loader"
import FeaturePage from "./screens/FeaturePage"
import LuckyFlow from "./screens/LuckyFlow"
import MainScreen from "./screens/MainScreen"

const REVEAL_MS = 1280

function routeFromPath(pathname) {
  const item = menuItems.find((entry) => entry.path === pathname)
  if (item) return { name: "feature", item }
  return { name: "home" }
}

export default function App() {
  const [phase, setPhase] = useState("loading")
  const [route, setRoute] = useState(() => routeFromPath(window.location.pathname))
  const [luckyOpen, setLuckyOpen] = useState(false)
  // Option đã chọn ở màn 07 — dùng cho bước sau. Lưu cả localStorage để giữ khi reload.
  const [luckyChoice, setLuckyChoice] = useState(() => {
    try {
      return window.localStorage.getItem(luckyFlow.storageKey)
    } catch {
      return null
    }
  })

  useEffect(() => {
    function onPopState() {
      setRoute(routeFromPath(window.location.pathname))
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  function handleComplete() {
    setPhase("revealing")
    window.setTimeout(() => setPhase("main"), REVEAL_MS)
  }

  function goHome() {
    window.history.pushState({}, "", "/")
    setRoute({ name: "home" })
  }

  function openFeature(item) {
    window.history.pushState({}, "", item.path)
    setRoute({ name: "feature", item })
  }

  function handleGalleryClick(index) {
    if (index === luckyFlow.galleryIndex) setLuckyOpen(true)
  }

  function handleLuckyChoose(option) {
    setLuckyChoice(option.id)
    try {
      window.localStorage.setItem(luckyFlow.storageKey, option.id)
    } catch {
      // storage blocked — state still holds the choice
    }
  }

  if (route.name === "feature") {
    return (
      <div className="app">
        <FeaturePage item={route.item} onBack={goHome} />
      </div>
    )
  }

  return (
    <div className="app">
      {phase !== "loading" && (
        <MainScreen
          entering={phase === "revealing"}
          onOpenFeature={openFeature}
          onGalleryClick={handleGalleryClick}
        />
      )}
      {luckyOpen && (
        <LuckyFlow
          choice={luckyChoice}
          onChoose={handleLuckyChoose}
          onClose={() => setLuckyOpen(false)}
        />
      )}
      {phase !== "main" && (
        <Loader
          leaving={phase === "revealing"}
          onComplete={handleComplete}
        />
      )}
    </div>
  )
}
