/**
 * Load a GIF and return a copy that plays ONCE (stops on its last frame) + its total duration.
 *
 * Browsers loop a GIF forever when it carries a NETSCAPE2.0 "loop" extension; without it they
 * play once and hold the final frame. So we fetch the bytes, drop that extension, and hand back
 * a Blob. Each play should use a fresh `URL.createObjectURL(blob)` so the animation restarts.
 * Duration = sum of frame delays (delays ≤ 10ms count as 100ms, like browsers do).
 */
const cache = new Map()

export function loadPlayOnceGif(url) {
  if (!cache.has(url)) {
    const job = fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`GIF ${url}: ${res.status}`)
        return res.arrayBuffer()
      })
      .then(stripLoop)
      .catch((error) => {
        cache.delete(url)
        throw error
      })
    cache.set(url, job)
  }
  return cache.get(url)
}

function colorTableSize(flags) {
  return flags & 0x80 ? 3 * (1 << ((flags & 0x07) + 1)) : 0
}

function skipSubBlocks(bytes, pos) {
  while (pos < bytes.length && bytes[pos] !== 0) pos += bytes[pos] + 1
  return pos + 1
}

function stripLoop(buffer) {
  const bytes = new Uint8Array(buffer)
  const parts = []
  let duration = 0
  let pos = 13 + colorTableSize(bytes[10]) // header + logical screen descriptor + global table
  parts.push(bytes.subarray(0, pos))

  while (pos < bytes.length) {
    const start = pos
    const type = bytes[pos]

    if (type === 0x21) {
      const label = bytes[pos + 1]
      const body = pos + 2
      let isLoop = false
      if (label === 0xff && bytes[body] === 11) {
        const id = String.fromCharCode(...bytes.subarray(body + 1, body + 12))
        isLoop = id === "NETSCAPE2.0" || id === "ANIMEXTS1.0"
      }
      if (label === 0xf9) {
        const delay = bytes[body + 2] | (bytes[body + 3] << 8) // 1/100 s
        duration += (delay <= 1 ? 10 : delay) * 10
      }
      pos = skipSubBlocks(bytes, body)
      if (!isLoop) parts.push(bytes.subarray(start, pos))
    } else if (type === 0x2c) {
      pos += 10 + colorTableSize(bytes[pos + 9]) + 1 // descriptor + local table + LZW min size
      pos = skipSubBlocks(bytes, pos)
      parts.push(bytes.subarray(start, pos))
    } else {
      break // 0x3B trailer (or junk)
    }
  }

  parts.push(new Uint8Array([0x3b]))
  return { blob: new Blob(parts, { type: "image/gif" }), duration }
}
